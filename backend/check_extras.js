const pool = require('./config/database');

async function checkMoreTables() {
    try {
        console.log('--- Columnas de memorandum_comision ---');
        const mc = await pool.query(`
            SELECT column_name FROM information_schema.columns WHERE table_name = 'memorandum_comision'
        `);
        console.table(mc.rows);

        console.log('\n--- Columnas de actividades ---');
        const act = await pool.query(`
            SELECT column_name FROM information_schema.columns WHERE table_name = 'actividades'
        `);
        console.table(act.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkMoreTables();
