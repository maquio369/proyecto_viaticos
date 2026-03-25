const pool = require('../config/database');

async function restoreUsers() {
    try {
        await pool.query('BEGIN');

        // Limpiar para evitar duplicados del intento anterior
        await pool.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');

        const users = [
            {
                id_usuario: 1,
                id_rol: 1,
                nombres: 'Julio',
                apellidos: 'Arizmendi',
                correo: 'jperex0002@gmail.com',
                usuario: 'admin',
                contraseña: '123',
                id_empleado: 261,
                esta_borrado: false
            },
            {
                id_usuario: 2,
                id_rol: 1,
                nombres: 'Marco Antonio',
                apellidos: 'López Gutiérrez',
                correo: 'maquio92@gmail.com',
                usuario: 'maquio',
                contraseña: '123',
                id_empleado: 268,
                esta_borrado: false
            }
        ];

        for (const u of users) {
            await pool.query(
                `INSERT INTO usuarios (id_usuario, id_rol, nombres, apellidos, correo, usuario, contraseña, id_empleado, esta_borrado) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [u.id_usuario, u.id_rol, u.nombres, u.apellidos, u.correo, u.usuario, u.contraseña, u.id_empleado, u.esta_borrado]
            );
        }

        await pool.query('COMMIT');
        console.log('✅ Usuarios restaurados correctamente conforme a la imagen.');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error restaurando usuarios:', err.message);
    } finally {
        await pool.end();
    }
}

restoreUsers();
