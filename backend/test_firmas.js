const pool = require('./config/database');

async function checkQueries() {
  try {
    console.log('--- Testing /api/firmas/empleado/1 query ---');
    const result = await pool.query(`
        SELECT f.id_firma, f.nombre_firma, f.cargo_firma, 'area' as tipo_asignacion
        FROM empleados e
        JOIN firmas_por_area fa ON e.id_area = fa.id_area
        JOIN firmas f ON fa.id_firma = f.id_firma
        WHERE e.id_empleado = 1
          AND e.esta_borrado = false 
          AND fa.esta_borrado = false 
          AND f.esta_borrado = false
          AND f.id_firma NOT IN (
            SELECT id_firma FROM firmas_adicionales_empleado 
            WHERE id_empleado = 1 AND esta_borrado = false
          )
    `);
    console.log('Result:', result.rows);
  } catch(e) {
    console.error('Error 1:', e);
  }
  
  try {
      console.log('--- Testing /api/firmas/empleados-firmantes query ---');
      const result = await pool.query(`
      SELECT e.id_empleado, e.nombres, e.apellido1, e.apellido2, 
             p.nombre_puesto as cargo, a.descripcion as area_nombre
      FROM empleados e
      LEFT JOIN areas a ON e.id_area = a.id_area
      LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
      LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
      LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
      WHERE e.esta_borrado = false 
      ORDER BY e.nombres, e.apellido1
      LIMIT 5
      `);
      console.log('Result:', result.rows);
  } catch(e) {
      console.error('Error 2:', e.message);
  }

  pool.end();
}
checkQueries();
