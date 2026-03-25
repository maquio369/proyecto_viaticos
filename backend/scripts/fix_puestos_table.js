const pool = require('../config/database');

async function fixDatabase() {
    try {
        console.log('Añadiendo columna esta_borrado a tabla puestos...');
        await pool.query('ALTER TABLE puestos ADD COLUMN IF NOT EXISTS esta_borrado boolean DEFAULT false');
        console.log('✅ Base de datos actualizada correctamente.');
    } catch (err) {
        console.error('❌ Error actualizando base de datos:', err.message);
    } finally {
        await pool.end();
    }
}

fixDatabase();
