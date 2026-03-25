const pool = require('../config/database');

async function checkDataCounts() {
    try {
        const empCount = await pool.query('SELECT COUNT(*) FROM empleados');
        console.log('Total empleados:', empCount.rows[0].count);

        const backupEmpExists = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'backup_empleados_manual')");
        if (backupEmpExists.rows[0].exists) {
            const backupCount = await pool.query('SELECT COUNT(*) FROM backup_empleados_manual');
            console.log('Total backup_empleados_manual:', backupCount.rows[0].count);
        }

        const backupCargosExists = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'backup_cargos_manual')");
        if (backupCargosExists.rows[0].exists) {
            const backupCount = await pool.query('SELECT COUNT(*) FROM backup_cargos_manual');
            console.log('Total backup_cargos_manual:', backupCount.rows[0].count);
        }

        if (empCount.rows[0].count === '0') {
            const samples = await pool.query('SELECT * FROM empleados LIMIT 1');
            console.log('Campos de empleados:', Object.keys(samples.rows[0] || {}));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkDataCounts();
