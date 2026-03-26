const pool = require('./config/database');

async function listSchemas() {
    try {
        const query = `
            SELECT DISTINCT table_schema 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        `;
        const res = await pool.query(query);
        console.log(res.rows.map(r => r.table_schema).join(', '));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

listSchemas();
