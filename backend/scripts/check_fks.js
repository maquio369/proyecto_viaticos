const pool = require('../config/database');

async function checkSchema() {
    try {
        console.log('--- Foreign Keys for firmas_adicionales_empleado ---');
        const fks = await pool.query(`
            SELECT
                conname AS constraint_name,
                confrelid::regclass AS foreign_table,
                a.attname AS column_name,
                af.attname AS foreign_column_name
            FROM pg_constraint c
            JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
            JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
            WHERE c.conrelid = 'firmas_adicionales_empleado'::regclass
            AND c.contype = 'f';
        `);
        console.log(JSON.stringify(fks.rows, null, 2));

        console.log('--- Checking for id_tipos_de_vehiculo in routes/vehiculos.js ---');
        // This is just a placeholder for the logic I'll execute manually but good for verification if I were to run it inside.
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();
