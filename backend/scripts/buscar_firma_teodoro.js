const pool = require('../config/database');

async function buscarFirmaTeodoro() {
    try {
        console.log('=== Buscando firma de TEODORO CORTES ORDOÑEZ ===\n');

        const result = await pool.query(
            `SELECT id_firma, nombre_firma, cargo_firma 
       FROM firmas 
       WHERE nombre_firma ILIKE '%TEODORO%' 
       AND esta_borrado = false`
        );

        if (result.rows.length > 0) {
            console.log('✅ Firma encontrada:');
            console.log(JSON.stringify(result.rows, null, 2));
        } else {
            console.log('❌ No se encontró la firma de TEODORO');
            console.log('\n=== Mostrando todas las firmas disponibles ===\n');

            const allFirmas = await pool.query(
                `SELECT id_firma, nombre_firma, cargo_firma 
         FROM firmas 
         WHERE esta_borrado = false 
         ORDER BY nombre_firma`
            );

            console.log(JSON.stringify(allFirmas.rows, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

buscarFirmaTeodoro();
