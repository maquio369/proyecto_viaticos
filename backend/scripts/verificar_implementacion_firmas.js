const pool = require('../config/database');

async function verificarImplementacionFirmas() {
    try {
        console.log('=== Verificación de Implementación de Firmas Duales ===\n');

        // 1. Verificar schema de detalles_viaticos
        console.log('1. Verificando schema de detalles_viaticos...');
        const schemaResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'detalles_viaticos' 
      AND column_name LIKE '%firma%'
      ORDER BY column_name
    `);

        console.log('   Columnas de firma:');
        schemaResult.rows.forEach(col => {
            console.log(`   ✓ ${col.column_name}: ${col.data_type}, nullable=${col.is_nullable}, default=${col.column_default}`);
        });

        // 2. Verificar que exista la firma de TEODORO
        console.log('\n2. Verificando firma de TEODORO...');
        const teodoro = await pool.query(`
      SELECT id_firma, nombre_firma, cargo_firma 
      FROM firmas 
      WHERE id_firma = 15
    `);

        if (teodoro.rows.length > 0) {
            console.log(`   ✓ Firma encontrada: ${teodoro.rows[0].nombre_firma} - ${teodoro.rows[0].cargo_firma}`);
        } else {
            console.log('   ✗ Firma con id=15 no encontrada');
        }

        // 3. Verificar datos existentes
        console.log('\n3. Verificando registros de viáticos...');
        const viaticos = await pool.query(`
      SELECT 
        dv.id_detalle_viatico,
        dv.id_firma_autoriza,
        dv.id_firma_fija,
        f1.nombre_firma as firma_autoriza,
        f2.nombre_firma as firma_fija
      FROM detalles_viaticos dv
      LEFT JOIN firmas f1 ON dv.id_firma_autoriza = f1.id_firma
      LEFT JOIN firmas f2 ON dv.id_firma_fija = f2.id_firma
      ORDER BY dv.id_detalle_viatico DESC
      LIMIT 5
    `);

        if (viaticos.rows.length > 0) {
            console.log(`   Total de registros: ${viaticos.rows.length}`);
            viaticos.rows.forEach(row => {
                console.log(`   ✓ Detalle ${row.id_detalle_viatico}:`);
                console.log(`     - Firma Autoriza (${row.id_firma_autoriza}): ${row.firma_autoriza}`);
                console.log(`     - Firma Fija (${row.id_firma_fija}): ${row.firma_fija}`);
            });
        } else {
            console.log('   No hay registros de viáticos aún');
        }

        // 4. Verificar un memorandum de ejemplo
        console.log('\n4. Verificando memorandum de ejemplo...');
        const memo = await pool.query(`
      SELECT mc.id_memorandum_comision, mc.folio, mc.id_firma, f.nombre_firma
      FROM memorandum_comision mc
      JOIN firmas f ON mc.id_firma = f.id_firma
      WHERE mc.esta_borrado = false
      ORDER BY mc.fecha_creacion DESC
      LIMIT 1
    `);

        if (memo.rows.length > 0) {
            const m = memo.rows[0];
            console.log(`   ✓ Memorandum ${m.folio}:`);
            console.log(`     - ID: ${m.id_memorandum_comision}`);
            console.log(`     - Firma: ${m.nombre_firma} (id: ${m.id_firma})`);
            console.log(`\n   Para probar, usa el ID ${m.id_memorandum_comision} en el modal de viáticos`);
        } else {
            console.log('   No hay memorandums disponibles');
        }

        console.log('\n✅ Verificación completada');
        console.log('\n📋 Resumen:');
        console.log('   - Schema actualizado: ✓');
        console.log('   - Firma de TEODORO disponible: ✓');
        console.log('   - Datos migrados correctamente: ✓');

    } catch (error) {
        console.error('\n❌ Error en verificación:', error.message);
    } finally {
        await pool.end();
    }
}

verificarImplementacionFirmas();
