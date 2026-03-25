const { execSync } = require('child_process');
const fs = require('fs');

const activeTables = [
  'actividades', 'cat_bancos', 'categorias', 'categorias_del_empleado',
  'comisiones', 'cuentas_bancarias', 'detalles_viaticos', 'estados_federacion',
  'firmas', 'firmas_adicionales_empleado', 'firmas_por_area', 'gastos_globales_memorandum',
  'memorandum_comision', 'tarifas_viaticos', 'tramite_comisiones', 'tramites',
  'zonas_municipios', 'zonas_viaticos'
];

const tArgs = activeTables.map(t => `-t public.${t}`).join(' ');
console.log('Dumping tables...');

execSync(`set PGPASSWORD=Chispitas99?&& "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe" -h localhost -p 5433 -U postgres -d siag_dev_local ${tArgs} --clean --if-exists --no-owner --no-privileges -f dump_active.sql`, { stdio: 'inherit' });

console.log('Processing SQL file to change schema to viaticos...');
let sql = fs.readFileSync('dump_active.sql', 'utf8');

// The `search_path` controls the default schema for new objects
sql = sql.replace(/SET search_path = public, pg_catalog;/g, 'SET search_path = viaticos, public, pg_catalog;');
sql = sql.replace(/Schema: public/g, 'Schema: viaticos');

// Only replace `public.` with `viaticos.` for tables we are migrating and their sequences!
for (const t of activeTables) {
    const tableRegex = new RegExp(`\\bpublic\\.${t}\\b`, 'g');
    sql = sql.replace(tableRegex, `viaticos.${t}`);
    
    // Also their sequences (commonly named tablename_id_seq or tablename_seq)
    const seqRegex = new RegExp(`\\bpublic\\.${t}_[a-zA-Z0-9_]+\\b`, 'g');
    sql = sql.replace(seqRegex, match => match.replace('public.', 'viaticos.'));
}

fs.writeFileSync('dump_active_viaticos.sql', sql);
console.log('Migrator script complete.');
