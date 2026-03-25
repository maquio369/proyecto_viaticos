const pool = require('../config/database');

async function checkSchema() {
    try {
        console.log('--- Columns for categorias_del_empleado ---');
        const res = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('categorias_del_empleado', 'puestos') 
            ORDER BY table_name, ordinal_position;
        `);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();
