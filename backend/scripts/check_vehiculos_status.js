const pool = require('../config/database');

async function checkConstraints() {
    try {
        const res = await pool.query(`
            SELECT 
                conname AS constraint_name,
                pg_get_constraintdef(c.oid) AS constraint_definition
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE conrelid = 'vehiculos'::regclass
        `);
        console.log('Constraints de vehiculos:', JSON.stringify(res.rows, null, 2));

        const res2 = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name ILIKE '%backup%' OR table_name ILIKE '%copia%'
        `);
        console.log('Tablas de backup encontradas:', JSON.stringify(res2.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkConstraints();
