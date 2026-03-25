const pool = require('../config/database');

async function fixBrokenLinks() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('1. Fixing firmas_adicionales_empleado foreign key...');
        // Drop the constraint that points to empleados_original
        await client.query('ALTER TABLE firmas_adicionales_empleado DROP CONSTRAINT IF EXISTS firmas_adicionales_empleado_id_empleado_fkey');

        // Add it back pointing to empleados
        await client.query('ALTER TABLE firmas_adicionales_empleado ADD CONSTRAINT firmas_adicionales_empleado_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado)');

        console.log('2. Verifying tipos_de_vehiculos table pluralization...');
        // Check if the column is id_tipo_de_vehiculo or id_tipos_de_vehiculo
        const check = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tipos_de_vehiculos' AND column_name = 'id_tipos_de_vehiculo'
        `);

        if (check.rows.length > 0) {
            console.log('Found plural column id_tipos_de_vehiculo, renaming to singular...');
            await client.query('ALTER TABLE tipos_de_vehiculos RENAME COLUMN id_tipos_de_vehiculo TO id_tipo_de_vehiculo');
        } else {
            console.log('Column is already singular or does not exist.');
        }

        await client.query('COMMIT');
        console.log('✅ Fixes applied.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error applying fixes:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

fixBrokenLinks();
