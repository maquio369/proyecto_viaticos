const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Obtener todos los trámites
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, 
              CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_solicitante,
              c.cargo as cargo_solicitante,
              f.nombre_firma as nombre_autoriza,
              f.cargo_firma as cargo_autoriza
       FROM tramites t
       JOIN usuarios u ON t.id_usuario = u.id_usuario
       JOIN empleados e ON u.id_empleado = e.id_empleado
       LEFT JOIN cargos c ON e.id_cargo = c.id_cargo
       LEFT JOIN firmas f ON t.id_firma = f.id_firma
       WHERE t.esta_borrado = false
       ORDER BY t.fecha_creacion DESC`
        );

        res.json({
            success: true,
            tramites: result.rows
        });
    } catch (error) {
        console.error('Error obteniendo tramites:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Crear nuevo trámite
router.post('/', auth, async (req, res) => {
    try {
        const { fecha, observaciones, id_firma } = req.body;
        const id_usuario = req.user.id;

        // Insertar el trámite
        const result = await pool.query(
            `INSERT INTO tramites (
        fecha, 
        importe,
        observaciones, 
        id_usuario,
        id_firma
      ) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id_tramite`,
            [fecha, 0, observaciones, id_usuario, id_firma || null]
        );

        const id_tramite = result.rows[0].id_tramite;
        let folio = id_tramite.toString();

        // Generar folio usando oficio del área (similar a memorandum)
        try {
            const areaResult = await pool.query(
                `SELECT ar.oficio
         FROM usuarios u
         JOIN empleados e ON u.id_empleado = e.id_empleado
         JOIN areas ar ON e.id_lugar_fisico_de_trabajo = ar.id_area
         WHERE u.id_usuario = $1`,
                [id_usuario]
            );

            if (areaResult.rows.length > 0 && areaResult.rows[0].oficio) {
                folio = `${areaResult.rows[0].oficio}-T${id_tramite}`; // Agregué -T para distinguir
            }
        } catch (err) {
            console.error('Error obteniendo area para folio tramite:', err);
        }

        // Actualizar folio
        await pool.query(
            'UPDATE tramites SET folio = $1 WHERE id_tramite = $2',
            [folio, id_tramite]
        );

        res.json({
            success: true,
            message: 'Trámite creado exitosamente',
            id_tramite,
            folio
        });
    } catch (error) {
        console.error('Error creando tramite:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el trámite',
            error: error.message
        });
    }
});

// Editar trámite
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, importe, observaciones, id_firma } = req.body;

        await pool.query(
            `UPDATE tramites 
       SET fecha = $1, importe = COALESCE($2, importe), observaciones = $3, id_firma = $4
       WHERE id_tramite = $5`,
            [fecha, importe, observaciones, id_firma || null, id]
        );

        res.json({
            success: true,
            message: 'Trámite actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando tramite:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el trámite',
            error: error.message
        });
    }
});

// Eliminar trámite (borrado lógico)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'UPDATE tramites SET esta_borrado = true WHERE id_tramite = $1',
            [id]
        );

        res.json({
            success: true,
            message: 'Trámite eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando tramite:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el trámite',
            error: error.message
        });
    }
});

// OBTENER LISTA DE EMPLEADOS QUE TIENEN COMISIONES DISPONIBLES
router.get('/empleados-con-comisiones', auth, async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT 
                e.id_empleado, 
                CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_completo
            FROM memorandum_comision mc
            JOIN empleados e ON mc.id_empleado = e.id_empleado
            LEFT JOIN tramite_comisiones tc ON mc.id_memorandum_comision = tc.id_memorandum_comision
            WHERE tc.id_tramite IS NULL 
            AND mc.esta_borrado = false
            ORDER BY nombre_completo ASC
        `;
        const result = await pool.query(query);
        res.json({ success: true, empleados: result.rows });
    } catch (error) {
        console.error('Error obteniendo empleados con comisiones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// OBTENER COMISIONES DISPONIBLES PARA VINCULAR
router.get('/comisiones-disponibles', auth, async (req, res) => {
    try {
        const { empleado } = req.query;
        let query = `
            SELECT 
                mc.id_memorandum_comision, 
                COALESCE(dv.folio_comision, 'N/A') as folio_comision, 
                a.fecha as fecha_actividad,
                CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as empleado_nombre,
                COALESCE(SUM(COALESCE(dv.monto_calculado,0) + COALESCE(dv.pasaje,0) + COALESCE(dv.combustible,0) + COALESCE(dv.otros,0)), 0) + 
                COALESCE((SELECT SUM(COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM gastos_globales_memorandum WHERE id_memorandum_comision = mc.id_memorandum_comision AND esta_borrado = false), 0) as total
            FROM memorandum_comision mc
            JOIN actividades a ON mc.id_actividad = a.id_actividad
            JOIN empleados e ON mc.id_empleado = e.id_empleado
            LEFT JOIN detalles_viaticos dv ON mc.id_memorandum_comision = dv.id_memorandum_comision
            LEFT JOIN tramite_comisiones tc ON mc.id_memorandum_comision = tc.id_memorandum_comision
            WHERE tc.id_tramite IS NULL 
            AND mc.esta_borrado = false
        `;
        const values = [];

        if (empleado) {
            query += ` AND (CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) ILIKE $1 OR dv.folio_comision ILIKE $1 OR mc.folio ILIKE $1)`;
            values.push(`%${empleado}%`);
        }

        query += `
            GROUP BY mc.id_memorandum_comision, dv.folio_comision, a.fecha, e.nombres, e.apellido1, e.apellido2
            ORDER BY a.fecha DESC
        `;

        const result = await pool.query(query, values);
        res.json({ success: true, comisiones: result.rows });
    } catch (error) {
        console.error('Error obteniendo comisiones disponibles:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// VINCULAR UNA COMISIÓN AL TRÁMITE
router.post('/:id/vincular-comision', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params; // id_tramite
        const { id_memorandum_comision } = req.body;

        await client.query('BEGIN');

        // 1. Insertar vínculo
        await client.query(
            'INSERT INTO tramite_comisiones (id_tramite, id_memorandum_comision) VALUES ($1, $2)',
            [id, id_memorandum_comision]
        );

        // 2. Recalcular importe total del trámite
        const sumQuery = `
            SELECT 
                SUM(
                    COALESCE((SELECT SUM(COALESCE(monto_calculado,0) + COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM detalles_viaticos WHERE id_memorandum_comision = tc.id_memorandum_comision), 0) +
                    COALESCE((SELECT SUM(COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM gastos_globales_memorandum WHERE id_memorandum_comision = tc.id_memorandum_comision AND esta_borrado = false), 0)
                ) as total_tramite
            FROM tramite_comisiones tc
            WHERE tc.id_tramite = $1
        `;
        const sumRes = await client.query(sumQuery, [id]);
        const nuevoImporte = sumRes.rows[0].total_tramite || 0;

        // 3. Actualizar trámite
        await client.query(
            'UPDATE tramites SET importe = $1 WHERE id_tramite = $2',
            [nuevoImporte, id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Comisión vinculada correctamente', importe: nuevoImporte });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error vinculando comisión:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// DESVINCULAR UNA COMISIÓN DEL TRÁMITE
router.delete('/:id/desvincular-comision/:id_memo', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        const { id, id_memo } = req.params;

        await client.query('BEGIN');

        // 1. Eliminar vínculo
        await client.query(
            'DELETE FROM tramite_comisiones WHERE id_tramite = $1 AND id_memorandum_comision = $2',
            [id, id_memo]
        );

        // 2. Recalcular importe total
        const sumQuery = `
            SELECT 
                SUM(
                    COALESCE((SELECT SUM(COALESCE(monto_calculado,0) + COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM detalles_viaticos WHERE id_memorandum_comision = tc.id_memorandum_comision), 0) +
                    COALESCE((SELECT SUM(COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM gastos_globales_memorandum WHERE id_memorandum_comision = tc.id_memorandum_comision AND esta_borrado = false), 0)
                ) as total_tramite
            FROM tramite_comisiones tc
            WHERE tc.id_tramite = $1
        `;
        const sumRes = await client.query(sumQuery, [id]);
        const nuevoImporte = sumRes.rows[0].total_tramite || 0;

        // 3. Actualizar trámite
        await client.query(
            'UPDATE tramites SET importe = $1 WHERE id_tramite = $2',
            [nuevoImporte, id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Comisión desvinculada correctamente', importe: nuevoImporte });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error desvinculando comisión:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// OBTENER DETALLES (COMISIONES VINCULADAS) DE UN TRÁMITE
router.get('/:id/detalles', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                mc.id_memorandum_comision, 
                COALESCE(dv.folio_comision, 'N/A') as folio_comision, 
                a.fecha as fecha_actividad,
                CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as empleado_nombre,
                COALESCE(SUM(COALESCE(dv.monto_calculado,0) + COALESCE(dv.pasaje,0) + COALESCE(dv.combustible,0) + COALESCE(dv.otros,0)), 0) + 
                COALESCE((SELECT SUM(COALESCE(pasaje,0) + COALESCE(combustible,0) + COALESCE(otros,0)) FROM gastos_globales_memorandum WHERE id_memorandum_comision = mc.id_memorandum_comision AND esta_borrado = false), 0) as total
            FROM tramite_comisiones tc
            JOIN memorandum_comision mc ON tc.id_memorandum_comision = mc.id_memorandum_comision
            JOIN actividades a ON mc.id_actividad = a.id_actividad
            JOIN empleados e ON mc.id_empleado = e.id_empleado
            LEFT JOIN detalles_viaticos dv ON mc.id_memorandum_comision = dv.id_memorandum_comision
            WHERE tc.id_tramite = $1
            GROUP BY mc.id_memorandum_comision, dv.folio_comision, a.fecha, e.nombres, e.apellido1, e.apellido2
            ORDER BY a.fecha DESC
        `;
        const result = await pool.query(query, [id]);
        res.json({ success: true, comisiones: result.rows });
    } catch (error) {
        console.error('Error obteniendo detalles del trámite:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
