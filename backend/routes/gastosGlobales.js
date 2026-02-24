const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// POST - Crear o actualizar gastos globales para un memorandum
router.post('/', auth, async (req, res) => {
    try {
        const { id_memorandum_comision, pasaje, combustible, otros, tipo_pago } = req.body;

        // Verificar si ya existen gastos globales para este memorandum
        const existente = await pool.query(
            'SELECT id_gasto_global FROM gastos_globales_memorandum WHERE id_memorandum_comision = $1 AND esta_borrado = false',
            [id_memorandum_comision]
        );

        let result;
        if (existente.rows.length > 0) {
            // Actualizar existente
            result = await pool.query(
                `UPDATE gastos_globales_memorandum 
                 SET pasaje = $1, combustible = $2, otros = $3, tipo_pago = $4
                 WHERE id_memorandum_comision = $5 AND esta_borrado = false
                 RETURNING *`,
                [pasaje || 0, combustible || 0, otros || 0, tipo_pago, id_memorandum_comision]
            );
        } else {
            // Crear nuevo
            result = await pool.query(
                `INSERT INTO gastos_globales_memorandum 
                 (id_memorandum_comision, pasaje, combustible, otros, tipo_pago)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [id_memorandum_comision, pasaje || 0, combustible || 0, otros || 0, tipo_pago]
            );
        }

        res.json({
            success: true,
            gasto: result.rows[0]
        });
    } catch (error) {
        console.error('Error guardando gastos globales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar gastos globales',
            error: error.message
        });
    }
});

// GET - Obtener gastos globales de un memorandum
router.get('/memorandum/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT * FROM gastos_globales_memorandum 
             WHERE id_memorandum_comision = $1 AND esta_borrado = false`,
            [id]
        );

        res.json({
            success: true,
            gastos: result.rows[0] || null
        });
    } catch (error) {
        console.error('Error obteniendo gastos globales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener gastos globales',
            error: error.message
        });
    }
});

// DELETE - Eliminar gastos globales
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            'UPDATE gastos_globales_memorandum SET esta_borrado = true WHERE id_gasto_global = $1',
            [id]
        );

        res.json({
            success: true,
            message: 'Gastos globales eliminados'
        });
    } catch (error) {
        console.error('Error eliminando gastos globales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar gastos globales',
            error: error.message
        });
    }
});

module.exports = router;
