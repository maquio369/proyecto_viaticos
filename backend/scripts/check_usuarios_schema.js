const pool = require('../config/database');

async function checkTableStructure() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position
        `);
        console.log('Estructura de la tabla "usuarios":');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkTableStructure();
