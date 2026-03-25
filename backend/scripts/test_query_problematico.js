const pool = require('../config/database');
async function test() {
    try {
        const query = `
            SELECT 
                cde.id_categoria_del_empleado, 
                cde.clave_categoria, 
                cde.literal, 
                cde.categoria as id_categoria_puesto, 
                c.puesto as categoria_nombre, 
                p.nombre_puesto as puesto, 
                cde.literal_viatico
            FROM categorias_del_empleado cde
            LEFT JOIN categorias c ON cde.categoria = c.id_categoria
            LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
            WHERE cde.esta_borrado = false
            ORDER BY cde.literal_viatico ASC, cde.literal ASC
        `;
        const res = await pool.query(query);
        console.log('Query exitosa, filas:', res.rows.length);
    } catch (e) {
        console.error('Query FALLÓ:', e.message);
    } finally {
        await pool.end();
    }
}
test();
