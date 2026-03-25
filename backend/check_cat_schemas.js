const pool = require('./config/database');
const tables = ['categorias', 'categorias_del_empleado', 'empleados_datos_laborales'];

async function checkSchemas() {
    try {
        const query = `
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_name = ANY($1)
        `;
        const res = await pool.query(query, [tables]);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

checkSchemas();
