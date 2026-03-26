const pool = require('./config/database');

async function sampleData() {
    try {
        const query = `
            SELECT id_lugar_fisico_de_trabajo, id_area, nombres, apellido1 
            FROM public.empleados 
            WHERE id_lugar_fisico_de_trabajo IS NOT NULL 
            LIMIT 10
        `;
        const res = await pool.query(query);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

sampleData();
