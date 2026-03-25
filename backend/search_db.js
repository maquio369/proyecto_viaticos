const pg = require('pg');

const config = {
    user: 'postgres',
    password: 'Chispitas99?',
    host: 'localhost',
    port: 5433,
    database: 'siag_dev_local',
};

const client = new pg.Client(config);

async function search() {
    try {
        await client.connect();
        const tablesRes = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        const tables = tablesRes.rows.map(r => r.tablename);

        for (const table of tables) {
            try {
                const res = await client.query(`SELECT * FROM "${table}"`);
                for (const row of res.rows) {
                    const rowString = JSON.stringify(row).toUpperCase();
                    if (rowString.includes('OFICINA DEL GOBERNADOR') || rowString.includes('GUBERNATURA')) {
                        console.log(`FOUND in table: ${table}`);
                        console.log(JSON.stringify(row, null, 2));
                    }
                }
            } catch (err) {
                // console.error(`Error checking table ${table}: ${err.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

search();
