const pool = require('./config/database');
async function run() {
  try {
    const res = await pool.query(`
      SELECT dv.id_municipio, m.descripcion 
      FROM detalles_viaticos dv 
      JOIN municipios m ON dv.id_municipio = m.id_municipio 
      WHERE dv.id_memorandum_comision = 8
    `);
    console.log("Municipalities for ID 8:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
