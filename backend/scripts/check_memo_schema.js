const pool = require('../config/database');

async function checkMemorandumSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'memorandum_comision'
        `);
        console.log('Schema memorandum_comision:', JSON.stringify(res.rows));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkMemorandumSchema();
