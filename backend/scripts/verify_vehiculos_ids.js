const pool = require('../config/database');

async function verifyIds() {
    const idsToCheck = [279, 205, 188, 177, 254, 38, 149, 40, 20, 195, 272, 168, 166, 260, 6];
    try {
        const res = await pool.query('SELECT id_empleado, nombres, apellido1 FROM empleados WHERE id_empleado = ANY($1)', [idsToCheck]);
        console.log('Empleados encontrados:', JSON.stringify(res.rows, null, 2));

        if (res.rows.length === 0) {
            console.log('No se encontraron empleados con esos IDs. Esto sugiere que los IDs de empleados cambiaron durante la restauración.');
        } else {
            console.log(`Se encontraron ${res.rows.length} de ${idsToCheck.length} empleados.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

verifyIds();
