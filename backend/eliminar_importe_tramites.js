const pool = require('./config/database');

async function run() {
    try {
        await pool.query('ALTER TABLE tramites DROP COLUMN IF EXISTS importe');
        console.log('Columna importe eliminada exitosamente');
    } catch (err) {
        console.error('Error eliminando columna:', err);
    } finally {
        await pool.end();
    }
}

run();
