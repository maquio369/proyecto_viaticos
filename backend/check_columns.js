const pool = require('./config/database');

async function checkColumns() {
    try {
        const tables = ['public.empleados', 'public.cargos', 'viaticos.memorandum_comision'];
        for (const fullTable of tables) {
            const [schema, table] = fullTable.split('.');
            const query = `
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = $1 AND table_name = $2
            `;
            const res = await pool.query(query, [schema, table]);
            console.log(`--- ${fullTable} ---`);
            console.log(res.rows.map(r => r.column_name).join(', '));
        }
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

checkColumns();
