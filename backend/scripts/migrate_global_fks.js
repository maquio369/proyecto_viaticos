const pool = require('../config/database');

async function migrateAllFks() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('--- Migrating Global Foreign Keys to "empleados" ---');

        const constraints = [
            { table: 'proyectos_estrategicos', con: 'proyectos_estrategicos_id_jefe_del_lider_fkey', col: 'id_jefe_del_lider' },
            { table: 'proyectos_estrategicos', con: 'proyectos_estrategicos_id_lider_del_proyecto_fkey', col: 'id_lider_del_proyecto' },
            { table: 'usuarios', con: 'usuarios_id_empleado_fkey', col: 'id_empleado' },
            { table: 'vales_de_entrada', con: 'vales_de_entrada_id_empleado_fkey', col: 'id_empleado' },
            { table: 'vales_de_salida', con: 'vales_de_salida_id_empleado_entrega_fkey', col: 'id_empleado_entrega' },
            { table: 'vales_de_salida', con: 'vales_de_salida_id_empleado_recibe_fkey', col: 'id_empleado_recibe' },
            { table: 'comisiones', con: 'fk_com_empleado', col: 'id_empleado' },
            { table: 'memorandum_comision', con: 'memorandum_comision_id_empleado_fkey', col: 'id_empleado' },
            { table: 'cuentas_bancarias', con: 'cuentas_bancarias_id_empleado_fkey', col: 'id_empleado' }
        ];

        for (const c of constraints) {
            console.log(`Fixing ${c.table} -> ${c.con} (${c.col})...`);
            await client.query(`ALTER TABLE ${c.table} DROP CONSTRAINT IF EXISTS ${c.con}`);
            await client.query(`ALTER TABLE ${c.table} ADD CONSTRAINT ${c.con} FOREIGN KEY (${c.col}) REFERENCES empleados (id_empleado)`);
        }

        await client.query('COMMIT');
        console.log('✅ All global foreign keys migrated successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during global migration:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateAllFks();
