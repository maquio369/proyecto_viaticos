const pool = require('./config/database');

async function listTables() {
    try {
        const query = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `;
        const res = await pool.query(query);
        console.log(res.rows.map(r => r.table_name).join(', '));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

listTables();
