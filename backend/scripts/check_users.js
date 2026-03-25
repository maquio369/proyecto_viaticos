const pool = require('../config/database');

async function checkUsers() {
    try {
        const res = await pool.query('SELECT id_usuario, nombres, apellidos, usuario, contraseña, id_empleado, esta_borrado FROM usuarios');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkUsers();
