const pool = require('./config/database');

async function checkMunicipios() {
    try {
        console.log('--- Columnas de la tabla municipios ---');
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'municipios'
        `);
        console.table(res.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkMunicipios();
