const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function updateSchema() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Adding folio_comision to detalles_viaticos...');
        await client.query(`
            ALTER TABLE detalles_viaticos 
            ADD COLUMN IF NOT EXISTS folio_comision VARCHAR(50);
        `);

        console.log('Creating table tramite_comisiones...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS tramite_comisiones (
                id_tramite_comision SERIAL PRIMARY KEY,
                id_tramite INTEGER NOT NULL,
                id_memorandum_comision INTEGER NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_tc_tramite FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE,
                CONSTRAINT fk_tc_memo FOREIGN KEY (id_memorandum_comision) REFERENCES memorandum_comision(id_memorandum_comision) ON DELETE CASCADE,
                CONSTRAINT unique_tramite_memo UNIQUE (id_tramite, id_memorandum_comision)
            );
        `);

        await client.query('COMMIT');
        console.log('Database schema updated successfully.');
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Error updating schema:', error);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

updateSchema();
