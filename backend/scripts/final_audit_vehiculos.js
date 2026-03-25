const pool = require('../config/database');

async function finalAudit() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vehiculos'
            ORDER BY ordinal_position
        `);
        console.log('Schema vehiculos actual:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

finalAudit();
