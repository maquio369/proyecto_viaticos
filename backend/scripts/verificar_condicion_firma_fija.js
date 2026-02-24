const pool = require('../config/database');

async function verificarCondicionFirmaFija() {
    try {
        console.log('=== Verificando Condición para Firma Fija ===\n');

        // Buscar empleado que cumple la condición
        const empleadoResult = await pool.query(`
      SELECT 
        e.id_empleado,
        e.nombres,
        e.apellido1,
        e.apellido2,
        e.id_area,
        e.id_lugar_fisico_de_trabajo,
        a1.descripcion as area_nombre,
        a2.descripcion as lugar_trabajo_nombre
      FROM empleados e
      LEFT JOIN areas a1 ON e.id_area = a1.id_area
      LEFT JOIN areas a2 ON e.id_lugar_fisico_de_trabajo = a2.id_area
      WHERE e.id_area = 21 
        AND e.id_lugar_fisico_de_trabajo = 21
        AND e.esta_borrado = false
    `);

        console.log(`Empleados que cumplen la condición (id_area=21 AND id_lugar_fisico_de_trabajo=21):`);
        console.log(`Total encontrados: ${empleadoResult.rows.length}\n`);

        if (empleadoResult.rows.length > 0) {
            empleadoResult.rows.forEach((emp, index) => {
                console.log(`${index + 1}. ${emp.nombres} ${emp.apellido1} ${emp.apellido2}`);
                console.log(`   ID Empleado: ${emp.id_empleado}`);
                console.log(`   Área: ${emp.area_nombre}`);
                console.log(`   Lugar Físico: ${emp.lugar_trabajo_nombre}`);

                // Buscar si tiene firma asociada
                pool.query(`
          SELECT id_firma, nombre_firma, cargo_firma
          FROM firmas
          WHERE nombre_firma ILIKE '%' || $1 || '%'
          AND esta_borrado = false
        `, [emp.nombres]).then(firmaRes => {
                    if (firmaRes.rows.length > 0) {
                        console.log(`   ✓ Firma encontrada: ${firmaRes.rows[0].nombre_firma} - ${firmaRes.rows[0].cargo_firma} (ID: ${firmaRes.rows[0].id_firma})`);
                    } else {
                        console.log(`   ⚠️ No tiene firma asociada`);
                    }
                    console.log('');
                });
            });

            // Esperar a que terminen las consultas de firma
            await new Promise(resolve => setTimeout(resolve, 1000));

        } else {
            console.log('❌ No se encontró ningún empleado con esa condición');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

verificarCondicionFirmaFija();
