const pool = require('./config/database');

async function findTable() {
    try {
        const query = `
            SELECT table_name, table_schema 
            FROM information_schema.columns 
            WHERE column_name = 'id_lugar_fisico_de_trabajo' 
            AND table_name != 'empleados'
        `;
        const res = await pool.query(query);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

findTable();
