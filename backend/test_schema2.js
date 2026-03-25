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
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_name IN (
                'memorandum_comision', 'empleados', 'actividades', 'areas', 
                'estructuras_administrativas', 'empleados_datos_laborales', 
                'categorias_del_empleado', 'categorias', 'puestos', 'vehiculos', 
                'detalles_viaticos', 'municipios', 'firmas', 'proyectos_estrategicos', 
                'clasificaciones_funcionales', 'actividades_institucionales'
            )
            ORDER BY table_name;
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
