const pool = require('../config/database');

async function checkSchemas() {
    const tables = ['categorias', 'puestos', 'categorias_del_empleado'];
    try {
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            console.log(`Schema ${table}:`, JSON.stringify(res.rows));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchemas();
