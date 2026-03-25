const pool = require('./config/database');

async function inspectMoreTables() {
    try {
        const tables = [
            'empleados_datos_laborales',
            'detalles_viaticos',
            'firmas',
            'puestos',
            'tarifas_viaticos'
        ];

        for (const table of tables) {
            console.log(`\n--- Schema: ${table} ---`);
            const cols = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            console.table(cols.rows);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

inspectMoreTables();
