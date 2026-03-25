const pool = require('../config/database');

async function verifyMigration() {
    try {
        console.log('=== Verificando Migración de Puestos ===\n');

        // 1. Verificar tablas existentes
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('puestos', 'cargos', 'puestos_anterior_sistema', 'backup_cargos_manual')
        `);
        console.log('Tablas encontradas:', tables.rows.map(r => r.table_name).join(', '));

        // 2. Verificar estructura de 'puestos'
        if (tables.rows.some(r => r.table_name === 'puestos')) {
            const columns = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'puestos'
            `);
            console.log('\nColumnas de "puestos":');
            columns.rows.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));

            const count = await pool.query('SELECT COUNT(*) FROM puestos');
            console.log(`\nTotal de registros en "puestos": ${count.rows[0].count}`);

            const first5 = await pool.query('SELECT * FROM puestos LIMIT 5');
            console.log('Primeros 5 puestos:');
            console.table(first5.rows);
        }

        // 3. Verificar 'categorias'
        const catCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'categorias' AND column_name = 'id_puesto_vinculado'
        `);
        console.log('\nColumna "id_puesto_vinculado" en "categorias":', catCols.rows.length > 0 ? 'EXISTE' : 'NO EXISTE');

        // 4. Verificar 'empleados'
        const empCols = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'empleados' AND column_name = 'id_cargo'
        `);
        console.log('Columna "id_cargo" en "empleados":', empCols.rows.length > 0 ? 'EXISTE (Error)' : 'ELIMINADA (Correcto)');

    } catch (err) {
        console.error('❌ Error en verificación:', err.message);
    } finally {
        await pool.end();
    }
}

verifyMigration();
