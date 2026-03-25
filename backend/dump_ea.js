const pg = require('pg');

const config = {
    user: 'postgres',
    password: 'Chispitas99?',
    host: 'localhost',
    port: 5433,
    database: 'siag_dev_local',
};

const client = new pg.Client(config);

async function dump() {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM estructuras_administrativas ORDER BY id_estructura_administrativa');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

dump();
