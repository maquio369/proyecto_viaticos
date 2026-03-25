const pool = require('../config/database');

async function inspectEstructuras() {
    try {
        console.log('--- Estructuras Administrativas ---');
        const res = await pool.query('SELECT * FROM estructuras_administrativas WHERE esta_borrado = false');
        console.table(res.rows);

        console.log('\n--- Áreas con su Estructura ---');
        const areasRes = await pool.query(`
            SELECT a.id_area, a.descripcion as area_nombre, a.oficio, 
                   ea.id_estructura_administrativa, ea.descripcion as estructura_nombre,
                   ea.clave_clasificacion_administrativa, ea.clave_unidad_responsable, ea.clave_uro
            FROM areas a
            LEFT JOIN estructuras_administrativas ea ON a.id_estructura_administrativa = ea.id_estructura_administrativa
            WHERE a.esta_borrado = false
            LIMIT 20
        `);
        console.table(areasRes.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

inspectEstructuras();
