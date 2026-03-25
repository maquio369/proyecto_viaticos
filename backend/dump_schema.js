const pool = require('./config/database');

async function dumpSchema() {
    try {
        const tables = ['memorandum_comision', 'detalle_viaticos', 'detalles_viaticos', 'empleados', 'vehiculos', 'actividades', 'areas', 'cargos', 'firmas'];
        const query = `
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = ANY($1) 
            ORDER BY table_name, ordinal_position
        `;
        const result = await pool.query(query, [tables]);
        console.log(JSON.stringify(result.rows, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

dumpSchema();
