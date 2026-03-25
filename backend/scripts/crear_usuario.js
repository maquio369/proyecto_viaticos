const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const res = await pool.query(
            `INSERT INTO usuarios (nombres, apellidos, usuario, contraseña) 
             VALUES ($1, $2, $3, $4) RETURNING id_usuario`,
            ['Admin', 'Sistema', 'admin', hashedPassword]
        );
        console.log('User created with ID:', res.rows[0].id_usuario);
    } catch (err) {
        console.error('Error creating user:', err.message);
    } finally {
        await pool.end();
    }
}

createTestUser();
