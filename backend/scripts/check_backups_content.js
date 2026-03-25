const pool = require('../config/database');

async function checkBackupsContent() {
    try {
        console.log('--- Contenido de backup_empleados_manual (primeros 5) ---');
        const res1 = await pool.query('SELECT * FROM backup_empleados_manual LIMIT 5');
        console.log(JSON.stringify(res1.rows, null, 2));

        console.log('--- Contenido de backup_empleados (primeros 5) ---');
        const res2 = await pool.query('SELECT * FROM backup_empleados LIMIT 5');
        console.log(JSON.stringify(res2.rows, null, 2));

        console.log('--- Verificando si existe algun rastro de vehiculos en tablas de sistema ---');
        const res3 = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name ILIKE '%vehi%'
        `);
        console.log('Tablas con "vehi":', res3.rows.map(r => r.table_name).join(', '));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkBackupsContent();
