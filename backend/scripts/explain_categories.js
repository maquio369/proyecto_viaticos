const pool = require('../config/database');

async function explainTables() {
    try {
        console.log('--- Listando tablas relacionadas con categorias ---');
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name ILIKE '%categoria%' OR table_name ILIKE '%puesto%')
        `);
        console.table(tables.rows);

        const tablesToCheck = ['categorias_del_empleado', 'claves_categorias', 'categorias', 'puestos'];

        for (const table of tablesToCheck) {
            const check = await pool.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`, [table]);
            if (check.rows[0].exists) {
                console.log(`\n--- Estructura de ${table} ---`);
                const cols = await pool.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1 
                    ORDER BY ordinal_position
                `, [table]);
                console.table(cols.rows);

                const data = await pool.query(`SELECT * FROM ${table} LIMIT 3`);
                console.log(`Datos de muestra (${table}):`);
                console.log(data.rows);
            } else {
                console.log(`\nLa tabla ${table} no existe.`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

explainTables();
