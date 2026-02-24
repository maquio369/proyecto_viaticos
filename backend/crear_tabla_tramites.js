const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function run() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'tabla_tramites.sql'), 'utf8');
        await pool.query(sql);
        console.log('Tabla tramites creada exitosamente');
    } catch (err) {
        console.error('Error creando tabla:', err);
    } finally {
        await pool.end();
    }
}

run();
