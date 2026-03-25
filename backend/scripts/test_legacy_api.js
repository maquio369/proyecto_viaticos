const pool = require('../config/database');

async function testLegacyCatalog() {
    try {
        console.log('--- Testing /api/categorias/legacy-catalog logic ---');
        const query = 'SELECT id_categoria, puesto FROM categorias WHERE esta_borrado = false ORDER BY puesto ASC';
        const result = await pool.query(query);
        console.log('Results:', result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

testLegacyCatalog();
