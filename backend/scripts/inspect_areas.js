const pool = require('../config/database');

async function getAreasSchema() {
    try {
        console.log('--- Schema de la tabla AREAS ---');
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'areas'
            ORDER BY ordinal_position;
        `);
        console.table(res.rows);

        console.log('\n--- Muestra de datos (primeras 5 filas) ---');
        const dataRes = await pool.query('SELECT * FROM areas LIMIT 5');
        console.table(dataRes.rows);

        console.log('\n--- Relaciones de clave foránea ---');
        const fkRes = await pool.query(`
            SELECT
                tc.table_name, kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='areas';
        `);
        console.table(fkRes.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

getAreasSchema();
