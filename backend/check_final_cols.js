const pool = require('./config/database');

async function checkFinalTables() {
    try {
        console.log('--- Columnas de firmas ---');
        const f = await pool.query(`
            SELECT column_name FROM information_schema.columns WHERE table_name = 'firmas'
        `);
        console.table(f.rows);

        console.log('\n--- Columnas de vehiculos ---');
        const v = await pool.query(`
            SELECT column_name FROM information_schema.columns WHERE table_name = 'vehiculos'
        `);
        console.table(v.rows);

        console.log('\n--- Columnas de empleados_datos_laborales ---');
        const edl = await pool.query(`
            SELECT column_name FROM information_schema.columns WHERE table_name = 'empleados_datos_laborales'
        `);
        console.table(edl.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkFinalTables();
