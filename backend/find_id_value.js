const pool = require('./config/database');

async function findValue() {
    try {
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        const tablesRes = await pool.query(tablesQuery);
        const tables = tablesRes.rows.map(r => r.table_name);

        for (const table of tables) {
            try {
                const colsQuery = `
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = $1
                    AND column_name ILIKE 'id%'
                `;
                const colsRes = await pool.query(colsQuery, [table]);
                const cols = colsRes.rows.map(r => r.column_name);

                for (const col of cols) {
                    const dataQuery = `SELECT count(*) FROM public.${table} WHERE ${col} = 30`;
                    const dataRes = await pool.query(dataQuery);
                    if (parseInt(dataRes.rows[0].count) > 0) {
                        console.log(`FOUND 30 in ${table}.${col}`);
                        const nameQuery = `SELECT * FROM public.${table} WHERE ${col} = 30 LIMIT 1`;
                        const nameRes = await pool.query(nameQuery);
                        console.log(JSON.stringify(nameRes.rows[0], null, 2));
                    }
                }
            } catch (e) {
                // Ignore errors for specific tables/columns
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

findValue();
