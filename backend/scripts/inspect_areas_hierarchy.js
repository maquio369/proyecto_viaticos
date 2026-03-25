const pool = require('../config/database');

async function getAreasHierarchySample() {
    try {
        console.log('--- Jerarquía de Áreas ordenadas por claves ---');
        const res = await pool.query(`
            SELECT id_area, clave_area, clave_subarea, clave_ocupacion, descripcion, oficio
            FROM areas
            WHERE esta_borrado = false
            ORDER BY clave_area, clave_subarea, clave_ocupacion
            LIMIT 50;
        `);
        console.table(res.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

getAreasHierarchySample();
