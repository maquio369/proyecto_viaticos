const pool = require('./config/database');

async function checkCategories() {
    try {
        console.log('--- Buscando tablas de categorías/puestos ---');
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name ILIKE '%categoria%' OR table_name ILIKE '%puesto%')
        `);
        console.table(tables.rows);

        for (const t of tables.rows) {
            console.log(`\n--- Schema: ${t.table_name} ---`);
            const cols = await pool.query(`
                SELECT column_name FROM information_schema.columns WHERE table_name = $1
            `, [t.table_name]);
            console.table(cols.rows);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkCategories();
