const pool = require('../config/database');

async function checkAllLegacyFks() {
    try {
        console.log('--- Searching for all Foreign Keys pointing to empleados_original ---');
        const fks = await pool.query(`
            SELECT
                conname AS constraint_name,
                relname AS table_name,
                confrelid::regclass AS foreign_table,
                a.attname AS column_name
            FROM pg_constraint c
            JOIN pg_class r ON r.oid = c.conrelid
            JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
            WHERE confrelid::regclass::text = 'empleados_original'
            AND c.contype = 'f';
        `);
        console.log(JSON.stringify(fks.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkAllLegacyFks();
