const pool = require('../config/database');

async function checkTriggers() {
    try {
        const res = await pool.query(`
            SELECT event_object_table, trigger_name, event_manipulation, action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'categorias_del_empleado'
        `);
        console.log('Triggers:', JSON.stringify(res.rows));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkTriggers();
