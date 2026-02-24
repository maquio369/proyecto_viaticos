const pool = require('./config/database');

async function run() {
    try {
        // Agregar columna id_firma
        await pool.query('ALTER TABLE tramites ADD COLUMN IF NOT EXISTS id_firma INTEGER REFERENCES firmas(id_firma)');
        console.log('Columna id_firma agregada exitosamente');
    } catch (err) {
        console.error('Error agregando columna:', err);
    } finally {
        await pool.end();
    }
}

run();
