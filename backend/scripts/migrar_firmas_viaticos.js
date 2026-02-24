const pool = require('../config/database');

async function migrarFirmasViaticos() {
    const client = await pool.connect();

    try {
        console.log('=== Iniciando Migración de Firmas en Viáticos ===\n');

        await client.query('BEGIN');

        // Paso 1: Verificar estado actual
        console.log('1. Verificando estructura actual...');
        const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'detalles_viaticos' 
      AND column_name IN ('id_firma', 'id_firma_autoriza', 'id_firma_fija')
    `);

        console.log('   Columnas encontradas:', checkColumn.rows.map(r => r.column_name));

        // Paso 2: Renombrar columna existente si es necesario
        const hasOldColumn = checkColumn.rows.some(r => r.column_name === 'id_firma');
        const hasNewColumn = checkColumn.rows.some(r => r.column_name === 'id_firma_autoriza');

        if (hasOldColumn && !hasNewColumn) {
            console.log('\n2. Renombrando id_firma a id_firma_autoriza...');
            await client.query(`
        ALTER TABLE detalles_viaticos 
        RENAME COLUMN id_firma TO id_firma_autoriza
      `);
            console.log('   ✅ Columna renombrada');
        } else {
            console.log('\n2. Columna ya está renombrada, saltando...');
        }

        // Paso 3: Agregar nueva columna para firma fija
        const hasFirmaFija = checkColumn.rows.some(r => r.column_name === 'id_firma_fija');

        if (!hasFirmaFija) {
            console.log('\n3. Agregando columna id_firma_fija...');
            await client.query(`
        ALTER TABLE detalles_viaticos 
        ADD COLUMN id_firma_fija INTEGER
      `);
            console.log('   ✅ Columna agregada');

            // Paso 4: Actualizar registros existentes con firma de TEODORO (id: 15)
            console.log('\n4. Actualizando registros existentes con firma de TEODORO (id: 15)...');
            const updateResult = await client.query(`
        UPDATE detalles_viaticos 
        SET id_firma_fija = 15 
        WHERE id_firma_fija IS NULL
      `);
            console.log(`   ✅ ${updateResult.rowCount} registros actualizados`);

            // Paso 5: Hacer la columna NOT NULL
            console.log('\n5. Configurando columna como NOT NULL...');
            await client.query(`
        ALTER TABLE detalles_viaticos 
        ALTER COLUMN id_firma_fija SET NOT NULL
      `);
            console.log('   ✅ Restricción NOT NULL aplicada');

            // Paso 6: Agregar DEFAULT para futuros registros
            console.log('\n6. Configurando valor DEFAULT = 15...');
            await client.query(`
        ALTER TABLE detalles_viaticos 
        ALTER COLUMN id_firma_fija SET DEFAULT 15
      `);
            console.log('   ✅ Valor por defecto configurado');

            // Paso 7: Agregar Foreign Key
            console.log('\n7. Agregando Foreign Key constraint...');
            await client.query(`
        ALTER TABLE detalles_viaticos
        ADD CONSTRAINT fk_firma_fija
        FOREIGN KEY (id_firma_fija) REFERENCES firmas(id_firma)
      `);
            console.log('   ✅ Foreign Key agregada');
        } else {
            console.log('\n3. Columna id_firma_fija ya existe, saltando pasos 3-7...');
        }

        // Paso 8: Verificar resultado final
        console.log('\n8. Verificando estructura final...');
        const finalCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'detalles_viaticos' 
      AND column_name LIKE '%firma%'
      ORDER BY column_name
    `);

        console.log('\n   Columnas de firma en detalles_viaticos:');
        finalCheck.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type}, nullable=${col.is_nullable}, default=${col.column_default}`);
        });

        // Paso 9: Verificar datos
        console.log('\n9. Verificando datos de ejemplo...');
        const sampleData = await client.query(`
      SELECT id_detalle_viatico, id_firma_autoriza, id_firma_fija
      FROM detalles_viaticos
      LIMIT 3
    `);

        if (sampleData.rows.length > 0) {
            console.log('\n   Registros de ejemplo:');
            sampleData.rows.forEach(row => {
                console.log(`   - Detalle ${row.id_detalle_viatico}: firma_autoriza=${row.id_firma_autoriza}, firma_fija=${row.id_firma_fija}`);
            });
        } else {
            console.log('   No hay registros existentes');
        }

        await client.query('COMMIT');
        console.log('\n✅ ¡Migración completada exitosamente!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Error en la migración:', error.message);
        console.error('   Se hizo ROLLBACK de todos los cambios');
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

migrarFirmasViaticos();
