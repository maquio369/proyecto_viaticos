const pool = require('./config/database');

async function testConnection() {
  try {
    const res = await pool.query('SELECT current_schema(), count(*) FROM actividades');
    console.log('Successfully connected to DB');
    console.log('Current schema in search_path:', res.rows[0].current_schema);
    console.log('Rows in actividades:', res.rows[0].count);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    pool.end();
  }
}

testConnection();
