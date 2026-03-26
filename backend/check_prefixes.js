const pool = require('./config/database');

async function checkPrefixes() {
    try {
        const query = `
            SELECT prefijo, nombres, apellido1 
            FROM public.empleados 
            WHERE prefijo IS NOT NULL 
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

checkPrefixes();
