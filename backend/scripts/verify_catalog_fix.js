const pool = require('../config/database');

async function verifyFix() {
    try {
        console.log('--- Probando GET /api/categorias/catalogo ---');
        const resCat = await pool.query(`
            SELECT 
                cde.id_categoria_del_empleado, 
                cde.literal, 
                p.nombre_puesto as puesto
            FROM categorias_del_empleado cde
            LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
            WHERE cde.esta_borrado = false
            LIMIT 5
        `);
        console.table(resCat.rows);

        console.log('\n--- Probando GET /api/categorias/puestos ---');
        const resPuestos = await pool.query('SELECT id_puesto, nombre_puesto FROM puestos WHERE esta_borrado = false LIMIT 5');
        console.table(resPuestos.rows);

    } catch (err) {
        console.error('❌ Error en verificación:', err.message);
    } finally {
        await pool.end();
    }
}

verifyFix();
