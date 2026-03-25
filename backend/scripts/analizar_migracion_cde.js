const pool = require('../config/database');

async function checkPuestosData() {
    try {
        console.log('=== Analizando Categorías del Empleado ===');
        const res = await pool.query(`
            SELECT cde.id_categoria_del_empleado, cde.puesto as puesto_actual, p.id_puesto, p.nombre_puesto
            FROM categorias_del_empleado cde
            LEFT JOIN puestos p ON TRIM(UPPER(cde.puesto)) = TRIM(UPPER(p.nombre_puesto))
            LIMIT 50
        `);
        console.table(res.rows);

        const unmatched = await pool.query(`
            SELECT DISTINCT puesto 
            FROM categorias_del_empleado 
            WHERE TRIM(UPPER(puesto)) NOT IN (SELECT TRIM(UPPER(nombre_puesto)) FROM puestos)
        `);
        console.log('\nPuestos que NO coinciden automáticamente:');
        console.table(unmatched.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkPuestosData();
