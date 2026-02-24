const pool = require('../config/database');

async function infoTeodoro() {
    try {
        // Solo la firma
        const result = await pool.query(`
      SELECT id_firma, nombre_firma, cargo_firma
      FROM firmas
      WHERE id_firma = 15
    `);

        console.log('='.repeat(60));
        console.log('INFORMACIÓN DE TEODORO CORTES ORDOÑEZ');
        console.log('='.repeat(60));

        if (result.rows.length > 0) {
            const firma = result.rows[0];
            console.log(`\nNombre: ${firma.nombre_firma}`);
            console.log(`Cargo/Puesto: ${firma.cargo_firma}`);
            console.log(`ID Firma: ${firma.id_firma}`);
        }

        // Buscar si tiene empleado asociado
        const emp = await pool.query(`
      SELECT e.*, a.descripcion as area
      FROM empleados e
      LEFT JOIN areas a ON e.id_area = a.id_area
      WHERE e.nombres ILIKE '%TEODORO%'
      AND e.apellido1 ILIKE '%CORTES%'
      LIMIT 1
    `);

        if (emp.rows.length > 0) {
            console.log(`\nÁrea: ${emp.rows[0].area || 'N/A'}`);
            console.log(`ID Empleado: ${emp.rows[0].id_empleado}`);
        }

        console.log('\n' + '='.repeat(60));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

infoTeodoro();
