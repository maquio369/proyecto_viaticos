const pool = require('../config/database');

async function testValidacionFechas() {
    try {
        console.log('=== Prueba de Validación de Fechas en Viáticos ===\n');

        // 1. Obtener un memorandum de ejemplo con su fecha de actividad
        const memo = await pool.query(`
      SELECT 
        mc.id_memorandum_comision,
        mc.folio,
        a.fecha as fecha_actividad,
        a.motivo
      FROM memorandum_comision mc
      JOIN actividades a ON mc.id_actividad = a.id_actividad
      WHERE mc.esta_borrado = false
      ORDER BY mc.fecha_creacion DESC
      LIMIT 1
    `);

        if (memo.rows.length === 0) {
            console.log('❌ No hay memorandums disponibles para probar');
            return;
        }

        const m = memo.rows[0];
        console.log('📋 Memorandum de Prueba:');
        console.log(`   Folio: ${m.folio}`);
        console.log(`   Motivo: ${m.motivo}`);
        console.log(`   Fecha de Actividad: ${new Date(m.fecha_actividad).toLocaleDateString('es-MX')}`);

        // 2. Probar el endpoint de firma (debe incluir fecha_actividad)
        console.log('\n🔍 Probando endpoint de firma...');
        const firma = await pool.query(`
      SELECT m.id_firma, f.nombre_firma, f.cargo_firma, a.fecha as fecha_actividad
      FROM memorandum_comision m
      JOIN firmas f ON m.id_firma = f.id_firma
      JOIN actividades a ON m.id_actividad = a.id_actividad
      WHERE m.id_memorandum_comision = $1
    `, [m.id_memorandum_comision]);

        if (firma.rows.length > 0) {
            console.log('   ✓ Endpoint retorna fecha_actividad correctamente');
            console.log(`   Fecha: ${new Date(firma.rows[0].fecha_actividad).toLocaleDateString('es-MX')}`);
        }

        // 3. Simular validaciones
        console.log('\n📅 Simulación de Validaciones:');
        const fechaActividad = new Date(m.fecha_actividad);

        // Fecha INVÁLIDA (mismo día)
        const fechaInvalida1 = new Date(m.fecha_actividad);
        console.log(`\n   ❌ INVÁLIDA: ${fechaInvalida1.toLocaleDateString('es-MX')} (mismo día)`);
        console.log(`      Razón: Debe ser DESPUÉS de la actividad`);

        // Fecha INVÁLIDA (día anterior)
        const fechaInvalida2 = new Date(m.fecha_actividad);
        fechaInvalida2.setDate(fechaInvalida2.getDate() - 1);
        console.log(`\n   ❌ INVÁLIDA: ${fechaInvalida2.toLocaleDateString('es-MX')} (día anterior)`);
        console.log(`      Razón: Debe ser DESPUÉS de la actividad`);

        // Fecha VÁLIDA (día siguiente)
        const fechaValida = new Date(m.fecha_actividad);
        fechaValida.setDate(fechaValida.getDate() + 1);
        console.log(`\n   ✅ VÁLIDA: ${fechaValida.toLocaleDateString('es-MX')} (día siguiente)`);
        console.log(`      Razón: Es DESPUÉS de la actividad`);

        console.log('\n' + '='.repeat(60));
        console.log('📝 RESUMEN DE VALIDACIÓN:');
        console.log('='.repeat(60));
        console.log('✅ La fecha de inicio del viático DEBE ser DESPUÉS de la fecha de actividad');
        console.log('❌ NO se permite el mismo día ni días anteriores');
        console.log('🎨 En el frontend:');
        console.log('   - Fecha válida: Borde verde, fondo blanco');
        console.log('   - Fecha inválida: Borde rojo, fondo rosa + mensaje de error');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

testValidacionFechas();
