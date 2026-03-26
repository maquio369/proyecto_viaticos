const pool = require('./config/database');

async function checkIds() {
    const checks = [
        { table: 'public.areas', id_col: 'id_area' },
        { table: 'public.unidades', id_col: 'id_unidad' },
        { table: 'public.estructuras_administrativas', id_col: 'id_estructura_administrativa' }
    ];

    try {
        for (const check of checks) {
            const query = `SELECT * FROM ${check.table} WHERE ${check.id_col} IN (30, 31)`;
            const res = await pool.query(query);
            if (res.rows.length > 0) {
                console.log(`--- ${check.table} ---`);
                console.log(JSON.stringify(res.rows, null, 2));
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

checkIds();
