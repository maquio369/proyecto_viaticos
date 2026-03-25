const pool = require('../config/database');

async function verifyReconstruction() {
    try {
        console.log('--- Verificando catálogos ---');
        const resUso = await pool.query('SELECT count(*) FROM usos_del_vehiculo');
        console.log('usos_del_vehiculo:', resUso.rows[0].count);

        const resMarca = await pool.query('SELECT count(*) FROM marcas_de_vehiculos');
        console.log('marcas_de_vehiculos:', resMarca.rows[0].count);

        console.log('--- Verificando vehículos ---');
        const resVehi = await pool.query(`
            SELECT v.id_vehiculo, v.placas_actuales, e.nombres, e.apellido1, u.uso_del_vehiculo
            FROM vehiculos v
            JOIN empleados e ON v.id_empleado = e.id_empleado
            JOIN usos_del_vehiculo u ON v.id_uso_del_vehiculo = u.id_uso_del_vehiculo
            LIMIT 5
        `);
        console.log('Muestra de vehículos con JOINs:', JSON.stringify(resVehi.rows, null, 2));

        const totalVehi = await pool.query('SELECT count(*) FROM vehiculos');
        console.log('Total vehículos:', totalVehi.rows[0].count);

    } catch (err) {
        console.error('❌ Error en verificación:', err);
    } finally {
        await pool.end();
    }
}

verifyReconstruction();
