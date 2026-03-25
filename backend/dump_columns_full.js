const pool = require('./config/database');

async function dumpAllColumns() {
    const tableMappings = [
        { schema: 'viaticos', table: 'memorandum_comision' },
        { schema: 'public', table: 'empleados' },
        { schema: 'public', table: 'cargos' },
        { schema: 'viaticos', table: 'actividades' },
        { schema: 'public', table: 'areas' },
        { schema: 'public', table: 'estructuras_administrativas' },
        { schema: 'public', table: 'vehiculos' },
        { schema: 'viaticos', table: 'detalles_viaticos' },
        { schema: 'viaticos', table: 'firmas' },
        { schema: 'public', table: 'municipios' }
    ];

    try {
        for (const mapping of tableMappings) {
            const query = `
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = $1 AND table_name = $2
                ORDER BY column_name
            `;
            const res = await pool.query(query, [mapping.schema, mapping.table]);
            console.log(`\n### ${mapping.schema}.${mapping.table} ###`);
            console.log(res.rows.map(r => r.column_name).join(', '));
        }
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

dumpAllColumns();
