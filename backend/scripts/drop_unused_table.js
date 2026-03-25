const pool = require('../config/database');

async function dropUnusedTable() {
    try {
        console.log('--- Eliminando tabla no utilizada: claves_categorias ---');
        await pool.query('DROP TABLE IF EXISTS claves_categorias');
        console.log('✅ Tabla "claves_categorias" eliminada correctamente.');
    } catch (err) {
        console.error('❌ Error al eliminar la tabla:', err);
    } finally {
        await pool.end();
    }
}

dropUnusedTable();
