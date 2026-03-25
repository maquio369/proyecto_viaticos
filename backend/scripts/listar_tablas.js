const pool = require('../config/database');

async function listAllTables() {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log('Tablas en public:');
        res.rows.forEach(r => console.log(` - ${r.table_name}`));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

listAllTables();
