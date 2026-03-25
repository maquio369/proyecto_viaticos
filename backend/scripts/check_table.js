const pool = require('../config/database');

async function checkTable() {
    try {
        const res = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'proyectos_estrategicos'
            );
        `);
        console.log('Table exists:', res.rows[0].exists);

        if (res.rows[0].exists) {
            const columns = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'proyectos_estrategicos'
            `);
            console.log('Columns:');
            console.table(columns.rows);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

checkTable();
