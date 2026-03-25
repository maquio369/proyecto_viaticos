const pool = require('../config/database');

async function extractURNames() {
    try {
        console.log('--- Extrayendo Nombres de Unidades Responsables ---');

        // Buscamos los registros base de cada UR (donde URO es 000)
        const res = await pool.query(`
            SELECT DISTINCT
                clave_clasificacion_administrativa as c_admin,
                clave_unidad_responsable as c_ur,
                descripcion
            FROM estructuras_administrativas
            WHERE esta_borrado = false 
              AND clave_uro = '000'
            ORDER BY c_admin, c_ur
        `);

        console.log('Total de URs encontradas:', res.rows.length);

        const urNames = {};
        res.rows.forEach(row => {
            const key = `${row.c_admin}-${row.c_ur}`;
            urNames[key] = row.descripcion;
        });

        // Específicamente para la Gubernatura (21111101)
        console.log('\n--- URs para Gubernatura (21111101) ---');
        res.rows.filter(r => r.c_admin === '21111101').forEach(r => {
            console.log(`UR ${r.c_ur}: ${r.descripcion}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

extractURNames();
