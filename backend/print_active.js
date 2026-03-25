const fs = require('fs');

const activeTables = [
  'actividades', 'cat_bancos', 'categorias', 'categorias_del_empleado',
  'comisiones', 'cuentas_bancarias', 'detalles_viaticos', 'estados_federacion',
  'firmas', 'firmas_adicionales_empleado', 'firmas_por_area', 'gastos_globales_memorandum',
  'memorandum_comision', 'tarifas_viaticos', 'tramite_comisiones', 'tramites',
  'zonas_municipios', 'zonas_viaticos'
];

console.log(activeTables.join(' '));
