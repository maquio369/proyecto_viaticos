const pool = require('./config/database');
async function run() {
  try {
    // List tables to find anything related to destinations or viaticum details
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Tables:", tables.rows.map(r => r.table_name));

    // Check columns of detalles_viaticos
    const dvCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'detalles_viaticos'");
    console.log("\ndetalles_viaticos Columns:", dvCols.rows);

    // Look for a table that might contain multiple destinations per memorandum
    const searchDest = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%destino%' OR table_name LIKE '%municipio%' OR table_name LIKE '%viatico%'");
    console.log("\nPotential Destination Tables:", searchDest.rows.map(r => r.table_name));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
