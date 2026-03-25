const pool = require('../config/database');

async function debugVehiculos() {
    try {
        // 1. Listar todas las tablas
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log('--- Tablas en la base de datos ---');
        console.log(tablesRes.rows.map(r => r.table_name).join(', '));

        // 2. Verificar empleados_original
        try {
            const empOrigRes = await pool.query('SELECT count(*) FROM empleados_original');
            console.log('--- empleados_original ---');
            console.log('Conteo:', empOrigRes.rows[0].count);
        } catch (e) {
            console.log('empleados_original no existe.');
        }

        // 3. Buscar tablas que contengan "vehi"
        const vehiTables = tablesRes.rows.filter(r => r.table_name.toLowerCase().includes('vehi'));
        console.log('--- Tablas de vehiculos detectadas ---');
        for (const t of vehiTables.map(r => r.table_name)) {
            const countRes = await pool.query('SELECT count(*) FROM ' + t);
            console.log(`${t}: ${countRes.rows[0].count} registros`);
        }

        // 4. Ver si hay alguna tabla "temporal" o "respaldo"
        const backupTables = tablesRes.rows.filter(r =>
            r.table_name.toLowerCase().includes('temp') ||
            r.table_name.toLowerCase().includes('back') ||
            r.table_name.toLowerCase().includes('old') ||
            r.table_name.toLowerCase().includes('copia')
        );
        console.log('--- Tablas de backup/temporales ---');
        console.log(backupTables.map(r => r.table_name).join(', '));

    } catch (err) {
        console.error('Error en debug:', err);
    } finally {
        await pool.end();
    }
}

debugVehiculos();
