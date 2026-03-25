const pool = require('../config/database');

async function migrateCategoriasDelEmpleado() {
    try {
        await pool.query('BEGIN');

        console.log('1. Agregando columna id_puesto a categorias_del_empleado...');
        await pool.query(`
            ALTER TABLE categorias_del_empleado 
            ADD COLUMN IF NOT EXISTS id_puesto integer
        `);

        console.log('2. Corrigiendo typos conocidos...');
        await pool.query(`
            UPDATE categorias_del_empleado 
            SET puesto = 'COORDINADOR ADMINISTRATIVO (DELEGACIÓN)' 
            WHERE puesto = 'COORDINADOR ADMINISTARTIVO'
        `);

        console.log('3. Mapeando nombres a IDs...');
        await pool.query(`
            UPDATE categorias_del_empleado cde
            SET id_puesto = p.id_puesto
            FROM puestos p
            WHERE TRIM(UPPER(cde.puesto)) = TRIM(UPPER(p.nombre_puesto))
        `);

        console.log('4. Renombrando columna original...');
        // Verificamos si la columna ya fue renombrada para evitar errores en re-ejecución
        const checkCol = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'categorias_del_empleado' AND column_name = 'puesto'
        `);
        if (checkCol.rows.length > 0) {
            await pool.query(`
                ALTER TABLE categorias_del_empleado 
                RENAME COLUMN puesto TO puesto_texto_anterior
            `);
        }

        await pool.query('COMMIT');
        console.log('✅ Migración de categorias_del_empleado completada.');

        // Verificación
        const unmapped = await pool.query(`
            SELECT COUNT(*) 
            FROM categorias_del_empleado 
            WHERE id_puesto IS NULL AND puesto_texto_anterior IS NOT NULL
        `);
        console.log(`Registros sin mapear: ${unmapped.rows[0].count}`);

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error en migración:', err.message);
    } finally {
        await pool.end();
    }
}

migrateCategoriasDelEmpleado();
