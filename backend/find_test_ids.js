const pool = require('./config/database');

async function findTestIds() {
  try {
    const res = await pool.query(`
      SELECT m.id_memorandum_comision, m.folio, e.nombres, e.apellido1,
             (SELECT COUNT(*) FROM detalles_viaticos dv WHERE dv.id_memorandum_comision = m.id_memorandum_comision) as has_details
      FROM memorandum_comision m
      JOIN empleados e ON m.id_empleado = e.id_empleado
      WHERE m.esta_borrado = false
      ORDER BY has_details DESC, m.fecha_creacion DESC
      LIMIT 10;
    `);
    console.log('Valid Memorandum IDs for testing:');
    res.rows.forEach(row => {
      console.log(`ID: ${row.id_memorandum_comision} | Folio: ${row.folio} | Comisionado: ${row.nombres} ${row.apellido1} | Detalles: ${row.has_details > 0 ? 'SÍ' : 'NO'}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

findTestIds();
