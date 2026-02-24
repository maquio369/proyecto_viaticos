const pool = require('../config/database');

async function testFirmaFijaDinamica() {
    try {
        console.log('=== Prueba de Firma Fija Dinámica ===\n');

        console.log('Probando query de firma fija...');
        const result = await pool.query(`
      SELECT 
        f.id_firma,
        f.nombre_firma,
        f.cargo_firma,
        e.id_empleado,
        e.nombres,
        e.apellido1,
        e.id_area,
        e.id_lugar_fisico_de_trabajo
      FROM empleados e
      JOIN firmas f ON f.nombre_firma ILIKE '%' || e.nombres || '%'
      WHERE e.id_area = 21 
        AND e.id_lugar_fisico_de_trabajo = 21
        AND e.esta_borrado = false
        AND f.esta_borrado = false
      LIMIT 1
    `);

        console.log('\n' + '='.repeat(60));
        if (result.rows.length > 0) {
            const firma = result.rows[0];
            console.log('✅ FIRMA FIJA ENCONTRADA DINÁMICAMENTE');
            console.log('='.repeat(60));
            console.log(`\nID Firma: ${firma.id_firma}`);
            console.log(`Nombre: ${firma.nombre_firma}`);
            console.log(`Cargo: ${firma.cargo_firma}`);
            console.log(`\nEmpleado Asociado:`);
            console.log(`  - ID: ${firma.id_empleado}`);
            console.log(`  - Nombre: ${firma.nombres} ${firma.apellido1}`);
            console.log(`  - Área ID: ${firma.id_area}`);
            console.log(`  - Lugar Físico ID: ${firma.id_lugar_fisico_de_trabajo}`);

            console.log('\n' + '='.repeat(60));
            console.log('📝 CÓMO CAMBIAR LA FIRMA FIJA:');
            console.log('='.repeat(60));
            console.log('1. Actualiza el empleado que debe firmar:');
            console.log('   UPDATE empleados SET');
            console.log('     id_area = 21,');
            console.log('     id_lugar_fisico_de_trabajo = 21');
            console.log('   WHERE id_empleado = [ID_DEL_NUEVO_EMPLEADO];');
            console.log('\n2. Actualiza el empleado anterior:');
            console.log(`   UPDATE empleados SET`);
            console.log(`     id_area = [OTRA_AREA]`);
            console.log(`   WHERE id_empleado = ${firma.id_empleado};`);
            console.log('\n3. El sistema automáticamente usará la nueva firma');
            console.log('   (No requiere cambios en el código)');

        } else {
            console.log('❌ NO SE ENCONTRÓ FIRMA');
            console.log('='.repeat(60));
            console.log('\nVerifica que exista un empleado con:');
            console.log('  - id_area = 21');
            console.log('  - id_lugar_fisico_de_trabajo = 21');
            console.log('  - esta_borrado = false');
            console.log('  - Firma asociada en tabla firmas');
        }
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

testFirmaFijaDinamica();
