const pool = require('../config/database');

async function testQuery() {
    try {
        const query = `
      SELECT 
        v.id_vehiculo,
        v.numero_economico,
        v.id_marca_de_vehiculo,
        m.marca_de_vehiculo,
        v.id_tipo_de_vehiculo,
        t.tipo_de_vehiculo,
        v.id_clase_de_vehiculo,
        v.modelo,
        v.placas_anteriores,
        v.placas_actuales,
        v.numero_de_motor,
        v.serie,
        v.id_estatus_de_vehiculo,
        v.id_uso_del_vehiculo,
        u.uso_del_vehiculo as uso,
        v.id_empleado,
        e.nombres || ' ' || e.apellido1 as resguardatario
      FROM vehiculos v
      LEFT JOIN marcas_de_vehiculos m ON v.id_marca_de_vehiculo = m.id_marca_de_vehiculo
      LEFT JOIN tipos_de_vehiculos t ON v.id_tipo_de_vehiculo = t.id_tipo_de_vehiculo
      LEFT JOIN usos_del_vehiculo u ON v.id_uso_del_vehiculo = u.id_uso_del_vehiculo
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      WHERE v.esta_borrado = false
      ORDER BY v.id_vehiculo DESC LIMIT 50
    `;
        const res = await pool.query(query);
        console.log('Query exitosa. Registros encontrados:', res.rows.length);
        if (res.rows.length > 0) {
            console.log('Muestra:', JSON.stringify(res.rows[0], null, 2));
        }
    } catch (err) {
        console.error('❌ Error en la query:', err);
    } finally {
        await pool.end();
    }
}

testQuery();
