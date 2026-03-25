const pool = require('./config/database');

async function debug() {
    try {
        const res = await pool.query("SELECT * FROM categorias_del_empleado WHERE literal_viatico = 'C' OR literal = 'C' LIMIT 5");
        console.log('Suspicious rows:');
        console.log(JSON.stringify(res.rows, null, 2));

        const findDibu = await pool.query("SELECT * FROM puestos WHERE nombre_puesto ILIKE '%DIBUJANTE%'");
        console.log('\nPuesto DIBUJANTE info:');
        console.log(JSON.stringify(findDibu.rows, null, 2));

        const puestos = await pool.query('SELECT * FROM puestos LIMIT 5');
        console.log('\nPuestos data (first 5):');
        console.table(puestos.rows);

        const checkType = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'categorias_del_empleado' 
            AND column_name IN ('categoria', 'id_puesto')
        `);
        console.log('\nColumn Types:');
        console.table(checkType.rows);

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

debug();
