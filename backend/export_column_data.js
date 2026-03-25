const { Client } = require('pg');
const fs = require('fs');

async function migrateData() {
  const localClient = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'Chispitas99?',
    database: 'siag_dev_local'
  });

  await localClient.connect();

  console.log('Fetching local data...');
  // 1. areas: oficio
  const areasRes = await localClient.query('SELECT id_area, oficio FROM areas WHERE oficio IS NOT NULL');
  
  // 2. empleados: id_lugar_fisico_de_trabajo
  const empRes = await localClient.query('SELECT id_empleado, id_lugar_fisico_de_trabajo FROM empleados WHERE id_lugar_fisico_de_trabajo IS NOT NULL');

  // 3. empleados_datos_laborales: id_categoria_del_empleado
  const edlRes = await localClient.query('SELECT id_empleado_datos_laborales, id_categoria_del_empleado FROM empleados_datos_laborales WHERE id_categoria_del_empleado IS NOT NULL');

  await localClient.end();

  console.log('Building update scripts...');
  let sql = 'BEGIN;\n\n';

  for (const row of areasRes.rows) {
      if(row.oficio) {
          sql += `UPDATE public.areas SET oficio = '${row.oficio.replace(/'/g, "''")}' WHERE id_area = ${row.id_area};\n`;
      }
  }

  for (const row of empRes.rows) {
      if(row.id_lugar_fisico_de_trabajo) {
          sql += `UPDATE public.empleados SET id_lugar_fisico_de_trabajo = ${row.id_lugar_fisico_de_trabajo} WHERE id_empleado = ${row.id_empleado};\n`;
      }
  }

  for (const row of edlRes.rows) {
      if(row.id_categoria_del_empleado) {
          sql += `UPDATE public.empleados_datos_laborales SET id_categoria_del_empleado = ${row.id_categoria_del_empleado} WHERE id_empleado_datos_laborales = ${row.id_empleado_datos_laborales};\n`;
      }
  }

  sql += '\nCOMMIT;';
  fs.writeFileSync('update_columns_data.sql', sql);
  console.log('Update script update_columns_data.sql created successfully!');
}

migrateData().catch(console.error);
