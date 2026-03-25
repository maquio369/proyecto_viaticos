const pool = require('./config/database');

async function debug() {
    try {
        const res = await pool.query('SELECT * FROM categorias_del_empleado WHERE id_categoria_del_empleado = 83');
        console.log('Row 83 full data:');
        console.log(JSON.stringify(res.rows[0], null, 2));

        const res2 = await pool.query("SELECT * FROM categorias_del_empleado WHERE literal_viatico = 'C' LIMIT 1");
        console.log('\nA row with literal_viatico C:');
        console.log(JSON.stringify(res2.rows[0], null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

debug();
