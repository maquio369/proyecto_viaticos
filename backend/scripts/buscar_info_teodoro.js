const pool = require('../config/database');

async function buscarInfoTeodoro() {
    try {
        console.log('=== Información de TEODORO CORTES ORDOÑEZ ===\n');

        // 1. Buscar empleado
        const empleado = await pool.query(`
      SELECT 
        e.id_empleado,
        e.nombres,
        e.apellido1,
        e.apellido2,
        e.id_empleado_datos_laborales,
        a.descripcion as area_nombre
      FROM empleados e
      LEFT JOIN areas a ON e.id_area = a.id_area
      WHERE e.nombres ILIKE '%TEODORO%'
      AND e.esta_borrado = false
    `);

        if (empleado.rows.length === 0) {
            console.log('❌ No se encontró empleado');
            return;
        }

        const emp = empleado.rows[0];
        console.log('👤 EMPLEADO:');
        console.log(`   Nombre: ${emp.nombres} ${emp.apellido1} ${emp.apellido2}`);
        console.log(`   Área: ${emp.area_nombre}`);

        // 2. Buscar categoría
        if (emp.id_empleado_datos_laborales) {
            const categoria = await pool.query(`
        SELECT 
          edl.id_categoria_del_empleado,
          cat.literal_viatico
        FROM empleados_datos_laborales edl
        LEFT JOIN categorias_del_empleado cat ON edl.id_categoria_del_empleado = cat.id_categoria_del_empleado
        WHERE edl.id_empleado_datos_laborales = $1
      `, [emp.id_empleado_datos_laborales]);

            if (categoria.rows.length > 0) {
                console.log(`\n📊 CATEGORÍA:`);
                console.log(`   ID: ${categoria.rows[0].id_categoria_del_empleado}`);
                console.log(`   Literal Viático: ${categoria.rows[0].literal_viatico || 'N/A'}`);

                // Buscar descripción de categoría
                const catDesc = await pool.query(`
          SELECT * FROM categorias_del_empleado WHERE id_categoria_del_empleado = $1
        `, [categoria.rows[0].id_categoria_del_empleado]);

                if (catDesc.rows.length > 0) {
                    console.log(`   Detalles:`, catDesc.rows[0]);
                }
            }
        }

        // 3. Buscar firma
        const firma = await pool.query(`
      SELECT id_firma, nombre_firma, cargo_firma
      FROM firmas
      WHERE nombre_firma ILIKE '%TEODORO%'
      AND esta_borrado = false
    `);

        if (firma.rows.length > 0) {
            console.log(`\n✍️ FIRMA:`);
            console.log(`   ID: ${firma.rows[0].id_firma}`);
            console.log(`   Nombre: ${firma.rows[0].nombre_firma}`);
            console.log(`   Cargo: ${firma.rows[0].cargo_firma}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('📋 RESUMEN PARA EL USUARIO:');
        console.log('='.repeat(60));
        console.log(`Nombre Completo: ${emp.nombres} ${emp.apellido1} ${emp.apellido2}`);
        if (categoria && categoria.rows.length > 0) {
            console.log(`Categoría ID: ${categoria.rows[0].id_categoria_del_empleado}`);
            console.log(`Literal Viático: ${categoria.rows[0].literal_viatico || 'N/A'}`);
        }
        if (firma && firma.rows.length > 0) {
            console.log(`Puesto/Cargo: ${firma.rows[0].cargo_firma}`);
        }
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await pool.end();
    }
}

buscarInfoTeodoro();
