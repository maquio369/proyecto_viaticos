const pool = require('../config/database');

async function auditSchemasFull() {
    const tables = ['categorias_del_empleado', 'memorandum_comision', 'puestos', 'categorias', 'empleados'];
    try {
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.log(`--- Schema ${table} ---`);
            res.rows.forEach(row => console.log(`${row.column_name} (${row.data_type})`));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

auditSchemasFull();
