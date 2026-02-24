const pool = require('./config/database');

async function run() {
    const id_empleado = 268;
    try {
        const result = await pool.query(`
      SELECT DISTINCT f.id_firma, f.nombre_firma, f.cargo_firma,
             CASE 
               WHEN fa.id_area IS NOT NULL THEN 'area'
               ELSE 'adicional'
             END as tipo_asignacion
      FROM empleados e
      LEFT JOIN firmas_por_area fa ON e.id_area = fa.id_area AND fa.esta_borrado = false
      LEFT JOIN firmas_adicionales_empleado fae ON e.id_empleado = fae.id_empleado AND fae.esta_borrado = false
      JOIN firmas f ON (f.id_firma = fa.id_firma OR f.id_firma = fae.id_firma)
      WHERE e.id_empleado = $1 AND e.esta_borrado = false AND f.esta_borrado = false
      ORDER BY f.nombre_firma
    `, [id_empleado]);

        console.log('Resultados para empleado 268:', result.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

run();
