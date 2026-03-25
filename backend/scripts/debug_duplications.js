
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'siag_dev_local',
    password: 'Chispitas99?',
    port: 5433,
});

async function checkDuplications() {
    await client.connect();
    const id_memo = 8;
    
    console.log(`--- Checking duplication for ID_MEMORANDUM ${id_memo} ---`);

    // 1. Check Proyectos Estratégicos
    const resPt = await client.query(`
        SELECT count(*) 
        FROM memorandum_comision m
        JOIN empleados e ON m.id_empleado = e.id_empleado
        JOIN areas a ON e.id_area = a.id_area
        LEFT JOIN estructuras_administrativas ea ON a.id_estructura_administrativa = ea.id_estructura_administrativa
        LEFT JOIN proyectos_estrategicos pt ON ea.id_estructura_administrativa = pt.id_estructura_administrativa
        WHERE m.id_memorandum_comision = $1
    `, [id_memo]);
    console.log(`Rows after projects join: ${resPt.rows[0].count}`);

    // 2. Check Categorías del Empleado
    const resCat = await client.query(`
        SELECT count(*) 
        FROM memorandum_comision m
        JOIN empleados e ON m.id_empleado = e.id_empleado
        LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
        LEFT JOIN categorias_del_empleado cat_emp ON edl.id_categoria_del_empleado = cat_emp.id_categoria_del_empleado
        WHERE m.id_memorandum_comision = $1
    `, [id_memo]);
    console.log(`Rows after categories join: ${resCat.rows[0].count}`);

    // 3. Check Detalles Viáticos
    const resDv = await client.query(`
        SELECT count(*) 
        FROM memorandum_comision m
        JOIN detalles_viaticos dv ON m.id_memorandum_comision = dv.id_memorandum_comision
        WHERE m.id_memorandum_comision = $1
    `, [id_memo]);
    console.log(`Real rows in detalles_viaticos: ${resDv.rows[0].count}`);

    // 4. Combined count (the problem)
    const resTotal = await client.query(`
        SELECT count(*) 
        FROM memorandum_comision m
        JOIN empleados e ON m.id_empleado = e.id_empleado
        JOIN areas a ON e.id_area = a.id_area
        LEFT JOIN estructuras_administrativas ea ON a.id_estructura_administrativa = ea.id_estructura_administrativa 
        LEFT JOIN proyectos_estrategicos pt ON ea.id_estructura_administrativa = pt.id_estructura_administrativa
        LEFT JOIN detalles_viaticos dv ON m.id_memorandum_comision = dv.id_memorandum_comision
        WHERE m.id_memorandum_comision = $1
    `, [id_memo]);
    console.log(`Total rows combined: ${resTotal.rows[0].count}`);

    await client.end();
}

checkDuplications().catch(console.error);
