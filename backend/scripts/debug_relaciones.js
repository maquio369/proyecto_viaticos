const pool = require('../config/database');

async function debugData() {
    try {
        console.log('=== Depurando Datos de Categorías y Empleados ===\n');

        // 1. Ver qué puestos hay en la tabla nueva
        const puestos = await pool.query('SELECT id_puesto, nombre_puesto FROM puestos LIMIT 10');
        console.log('Algunos Puestos nuevos:');
        console.table(puestos.rows);

        // 2. Ver qué categorías hay y si tienen id_puesto_vinculado
        const categorias = await pool.query(`
            SELECT id_categoria, puesto, id_puesto_vinculado 
            FROM categorias 
            LIMIT 10
        `);
        console.log('\nCategorías actuales:');
        console.table(categorias.rows);

        // 3. Ver un ejemplo de empleado completo hasta el puesto (JOIN parcial)
        const empleado = await pool.query(`
            SELECT e.nombres, edl.id_categoria_del_empleado, cde.categoria as id_cat_base
            FROM empleados e
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
            WHERE e.esta_borrado = false
            LIMIT 5
        `);
        console.log('\nRelación Empleado -> Categoría:');
        console.table(empleado.rows);

    } catch (err) {
        console.error('❌ Error en debug:', err.message);
    } finally {
        await pool.end();
    }
}

debugData();
