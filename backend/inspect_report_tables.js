const pool = require('./config/database');

async function inspectReportTables() {
    try {
        const tables = [
            'memorandum_comision',
            'empleados',
            'actividades',
            'comisiones',
            'detalle_viaticos'
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

inspectReportTables();
