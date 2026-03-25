const pool = require('../config/database');

async function forceRestore() {
    try {
        console.log('1. Desactivando FKs temporalmente...');
        // En Postgres, podemos usar session_replication_role
        await pool.query("SET session_replication_role = 'replica'");

        console.log('2. Limpiando tablas...');
        await pool.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');
        await pool.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');

        console.log('3. Restaurando empleados desde backup...');
        await pool.query(`
            INSERT INTO empleados (
                id_empleado, prefijo, nombres, apellido1, apellido2, 
                correo, telefonos_oficina, id_area, id_lugar_fisico_de_trabajo, 
                id_empleado_datos_laborales, fecha_ingreso, fecha_baja, esta_borrado
            )
            SELECT 
                id_empleado, prefijo, nombres, apellido1, apellido2, 
                correo, telefonos_oficina, id_area, id_lugar_fisico_de_trabajo, 
                id_empleado_datos_laborales, fecha_ingreso, fecha_baja, esta_borrado
            FROM backup_empleados_manual
        `);

        console.log('4. Restaurando usuarios de la imagen...');
        const users = [
            { id_usuario: 1, id_rol: 1, nombres: 'Julio', apellidos: 'Arizmendi', correo: 'jperex0002@gmail.com', usuario: 'admin', contraseña: '123', id_empleado: 261, esta_borrado: false },
            { id_usuario: 2, id_rol: 1, nombres: 'Marco Antonio', apellidos: 'López Gutiérrez', correo: 'maquio92@gmail.com', usuario: 'maquio', contraseña: '123', id_empleado: 268, esta_borrado: false }
        ];

        for (const u of users) {
            await pool.query(
                `INSERT INTO usuarios (id_usuario, id_rol, nombres, apellidos, correo, usuario, contraseña, id_empleado, esta_borrado) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [u.id_usuario, u.id_rol, u.nombres, u.apellidos, u.correo, u.usuario, u.contraseña, u.id_empleado, u.esta_borrado]
            );
        }

        console.log('5. Reactivando FKs...');
        await pool.query("SET session_replication_role = 'origin'");

        console.log('✅ Restauración forzada completada.');

        const empCount = await pool.query('SELECT COUNT(*) FROM empleados');
        const userCount = await pool.query('SELECT COUNT(*) FROM usuarios');
        console.log(`Resumen: ${empCount.rows[0].count} empleados y ${userCount.rows[0].count} usuarios.`);

    } catch (err) {
        console.error('❌ Error crítico:', err.message);
        await pool.query("SET session_replication_role = 'origin'");
    } finally {
        await pool.end();
    }
}

forceRestore();
