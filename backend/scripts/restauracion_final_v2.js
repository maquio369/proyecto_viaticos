const pool = require('../config/database');

async function restoreAllData() {
    try {
        await pool.query('BEGIN');

        // 0. Limpiar tablas
        console.log('Limpiando tablas para restauración limpia...');
        await pool.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');
        // Usamos DELETE para empleados para evitar problemas con cascadas si las hay, 
        // pero TRUNCATE con CASCADE es más agresivo. Vamos a usar TRUNCATE.
        await pool.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');

        // 1. Restaurar Empleados
        console.log('Restaurando empleados...');
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
        console.log('✅ Empleados restaurados.');

        // 2. Restaurar Usuarios
        console.log('Restaurando usuarios...');
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
        console.log('✅ Usuarios restaurados.');

        await pool.query('COMMIT');
        console.log('=== Restauración Completa ===');

        const finalEmp = await pool.query('SELECT COUNT(*) FROM empleados');
        console.log('Total empleados final:', finalEmp.rows[0].count);

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error en restauración:', err.message);
    } finally {
        await pool.end();
    }
}

restoreAllData();
