const pool = require('../config/database');

async function checkColumns() {
    try {
        console.log('--- Columns for tipos_de_vehiculos ---');
        const cols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tipos_de_vehiculos'
            ORDER BY ordinal_position;
        `);
        console.log(JSON.stringify(cols.rows, null, 2));

        console.log('--- Columns for vehiculos ---');
        const vCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vehiculos'
            ORDER BY ordinal_position;
        `);
        console.log(JSON.stringify(vCols.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkColumns();
