const pg = require('pg');

const config = {
    user: 'postgres',
    password: 'Chispitas99?',
    host: 'localhost',
    port: 5433,
    database: 'siag_dev_local',
};

const client = new pg.Client(config);

async function listTables() {
    try {
        await client.connect();
        const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename");
        console.log(JSON.stringify(res.rows.map(r => r.tablename), null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listTables();
