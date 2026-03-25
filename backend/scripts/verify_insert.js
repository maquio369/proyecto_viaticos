const pool = require('../config/database');

async function verifyInsertion() {
    try {
        const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
        const res = await pool.query(`
            SELECT id_proyecto_estrategico, "id_año_del_gasto", proyecto_estrategico 
            FROM public.proyectos_estrategicos 
            WHERE id_proyecto_estrategico IN (${ids.join(',')})
            ORDER BY id_proyecto_estrategico::int
        `);
        console.log(`Found ${res.rowCount} rows.`);
        console.table(res.rows);
    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        pool.end();
    }
}

verifyInsertion();
