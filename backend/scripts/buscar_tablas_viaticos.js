const pool = require('../config/database');

async function buscarTablasViaticos() {
    try {
        console.log('=== Buscando tablas relacionadas con viáticos ===\n');

        const result = await pool.query(
            `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name LIKE '%viatico%'
       ORDER BY table_name`
        );

        console.log('Tablas encontradas:');
        console.log(JSON.stringify(result.rows, null, 2));

        if (result.rows.length > 0) {
            for (const row of result.rows) {
                console.log(`\n=== Columnas de ${row.table_name} ===`);
                const columns = await pool.query(
                    `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns 
           WHERE table_name = $1
           ORDER BY ordinal_position`,
                    [row.table_name]
                );
                console.log(JSON.stringify(columns.rows, null, 2));
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

buscarTablasViaticos();
