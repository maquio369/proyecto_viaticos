const pool = require('./config/database');

async function checkViaticosTables() {
    try {
        console.log('--- Verificando nombres exactos de tablas de viáticos ---');
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%viatico%'
        `);
        console.table(res.rows);

        for (const t of res.rows) {
            const count = await pool.query(`SELECT COUNT(*) FROM ${t.table_name}`);
            console.log(`Tabla: ${t.table_name} -> Registros: ${count.rows[0].count}`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkViaticosTables();
