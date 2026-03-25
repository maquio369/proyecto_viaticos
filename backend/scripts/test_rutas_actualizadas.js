const pool = require('../config/database');

async function testRoutes() {
    try {
        console.log('=== Probando Rutas Actualizadas ===\n');

        // 1. Probar empleados firmantes
        const firmantes = await pool.query(`
            SELECT e.nombres, p.nombre_puesto as cargo
            FROM empleados e
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
            LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
            WHERE e.esta_borrado = false 
            LIMIT 3
        `);
        console.log('Test firmantes (puestos):');
        console.table(firmantes.rows);

        // 2. Probar trámites
        const tramites = await pool.query(`
            SELECT t.id_tramite, p.nombre_puesto as cargo_solicitante
            FROM tramites t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            JOIN empleados e ON u.id_empleado = e.id_empleado
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
            LEFT JOIN categorias cat ON cde.categoria = cat.id_categoria
            LEFT JOIN puestos p ON cat.id_puesto_vinculado = p.id_puesto
            WHERE t.esta_borrado = false
            LIMIT 3
        `);
        console.log('\nTest trámites (cargo solicitante):');
        console.table(tramites.rows);

    } catch (err) {
        console.error('❌ Error en test:', err.message);
    } finally {
        await pool.end();
    }
}

testRoutes();
