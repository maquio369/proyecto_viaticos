// Ejemplos de Validación de Fechas en Viáticos

/**
 * REGLAS DE VALIDACIÓN:
 * 
 * 1. Fecha de Inicio:
 *    - DEBE ser DESPUÉS de la fecha de actividad (NO igual)
 * 
 * 2. Fecha de Fin:
 *    - DEBE ser DESPUÉS de la fecha de actividad (NO igual)
 *    - PUEDE ser igual a la fecha de inicio (mismo día permitido)
 */

// Ejemplo 1: Actividad el 2 de febrero de 2026
const fechaActividad = new Date('2026-02-02');

console.log('=== EJEMPLOS DE VALIDACIÓN ===\n');
console.log(`Fecha de Actividad: ${fechaActividad.toLocaleDateString('es-MX')}\n`);

// FECHA DE INICIO
console.log('📅 FECHA DE INICIO:');
console.log('  ❌ 1 de febrero → INVÁLIDA (anterior a actividad)');
console.log('  ❌ 2 de febrero → INVÁLIDA (igual a actividad)');
console.log('  ✅ 3 de febrero → VÁLIDA (después de actividad)');
console.log('  ✅ 4 de febrero → VÁLIDA (después de actividad)\n');

// FECHA DE FIN
console.log('📅 FECHA DE FIN:');
console.log('  ❌ 1 de febrero → INVÁLIDA (anterior a actividad)');
console.log('  ❌ 2 de febrero → INVÁLIDA (igual a actividad)');
console.log('  ✅ 3 de febrero → VÁLIDA (después de actividad)');
console.log('  ✅ 4 de febrero → VÁLIDA (después de actividad)\n');

// COMBINACIONES VÁLIDAS
console.log('✅ COMBINACIONES VÁLIDAS:');
console.log('  Inicio: 3 feb, Fin: 3 feb → ✅ (mismo día permitido)');
console.log('  Inicio: 3 feb, Fin: 4 feb → ✅');
console.log('  Inicio: 3 feb, Fin: 5 feb → ✅\n');

// COMBINACIONES INVÁLIDAS
console.log('❌ COMBINACIONES INVÁLIDAS:');
console.log('  Inicio: 2 feb, Fin: 3 feb → ❌ (inicio igual a actividad)');
console.log('  Inicio: 3 feb, Fin: 2 feb → ❌ (fin igual a actividad)');
console.log('  Inicio: 1 feb, Fin: 3 feb → ❌ (inicio anterior a actividad)');
console.log('  Inicio: 3 feb, Fin: 1 feb → ❌ (fin anterior a actividad)\n');

console.log('🎨 INDICADORES VISUALES:');
console.log('  ✅ Válida: Borde verde, fondo blanco');
console.log('  ❌ Inválida: Borde rojo, fondo rosa + mensaje de error');
