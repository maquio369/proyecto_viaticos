const { Client } = require('pg');
const client = new Client({
    host: '172.16.35.75',
    port: 32768,
    user: 'maquio',
    password: 'maquio92',
    database: 'siag_dev'
});

client.connect()
    .then(() => {
        return client.query(`
            SELECT m.id_memorandum_comision, e.id_empleado, act.id_actividad, a.id_area
            FROM viaticos.memorandum_comision m
            JOIN public.empleados e ON m.id_empleado = e.id_empleado
            JOIN viaticos.actividades act ON m.id_actividad = act.id_actividad
            JOIN public.areas a ON e.id_area = a.id_area
            WHERE m.id_memorandum_comision = 1
            AND m.esta_borrado = false;
        `);
    })
    .then(res => {
        console.table(res.rows);
        client.end();
    })
    .catch(err => {
        console.error(err);
        client.end();
    });
