const pool = require('./config/database');

async function listTables() {
    try {
        const query = `
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_schema IN ('public', 'viaticos') 
            ORDER BY table_name
        `;
        const res = await pool.query(query);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

listTables();
