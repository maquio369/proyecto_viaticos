const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Guardar memorandum/comisión
// Guardar memorandum/comisión
router.post('/', auth, async (req, res) => {
  try {
    const { id_actividad, id_empleado, periodo_inicio, periodo_fin, tipo_transporte, id_firma, observaciones, id_vehiculo } = req.body;
    const id_usuario = req.user.id;

    const id_vehiculo_final = id_vehiculo === '' ? null : id_vehiculo;

    // 1. Insertar el memorandum
    const result = await pool.query(
      `INSERT INTO memorandum_comision (
        id_actividad, 
        id_empleado, 
        periodo_inicio, 
        periodo_fin, 
        tipo_transporte, 
        id_firma, 
        observaciones,
        id_vehiculo
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_memorandum_comision`,
      [id_actividad, id_empleado, periodo_inicio, periodo_fin, tipo_transporte, id_firma, observaciones, id_vehiculo_final]
    );

    const id_memo = result.rows[0].id_memorandum_comision;
    let folio = id_memo.toString();

    // 2. Obtener el oficio del área del usuario creador
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
        folio = `${areaResult.rows[0].oficio}${id_memo}`;
      }
    } catch (err) {
      console.error('Error obteniendo area para folio:', err);
      // Fallback a ID si falla la consulta de área
    }

    // 3. Actualizar el memorandum con el folio
    await pool.query(
      'UPDATE memorandum_comision SET folio = $1 WHERE id_memorandum_comision = $2',
      [folio, id_memo]
    );

    res.json({
      success: true,
      message: 'Memorandum/Comisión guardado exitosamente',
      id_memorandum: id_memo,
      folio: folio
    });
  } catch (error) {
    console.error('Error guardando memorandum:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar el memorandum',
      error: error.message
    });
  }
});

// Obtener memorandums del usuario
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mc.*, 
              mc.folio,
              a.motivo, a.fecha as fecha_actividad, a.direccion,
              m.descripcion as municipio_nombre, a.lugar,
              CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as empleado_nombre,
              f.nombre_firma, f.cargo_firma,
              v.modelo as vehiculo_modelo,
              v.placas_actuales as vehiculo_placas,
              mv.marca_de_vehiculo as vehiculo_marca
       FROM memorandum_comision mc
       JOIN actividades a ON mc.id_actividad = a.id_actividad
       LEFT JOIN municipios m ON a.id_municipio = m.id_municipio
       JOIN empleados e ON mc.id_empleado = e.id_empleado
       JOIN firmas f ON mc.id_firma = f.id_firma
       LEFT JOIN vehiculos v ON mc.id_vehiculo = v.id_vehiculo
       LEFT JOIN marcas_de_vehiculos mv ON v.id_marca_de_vehiculo = mv.id_marca_de_vehiculo
       WHERE mc.esta_borrado = false
       ORDER BY mc.fecha_creacion DESC`
    );

    res.json({
      success: true,
      memorandums: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener firma de un memorandum específico
router.get('/:id/firma', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.id_firma, f.nombre_firma, f.cargo_firma, a.fecha as fecha_actividad,
               m.periodo_inicio, m.periodo_fin
       FROM memorandum_comision m
       JOIN firmas f ON m.id_firma = f.id_firma
       JOIN actividades a ON m.id_actividad = a.id_actividad
       WHERE m.id_memorandum_comision = $1`,
      [id]
    );

    res.json({
      success: true,
      firma: result.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Eliminar (Borrado lógico) memorandum
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Verificar si tiene viáticos asociados
    const checkViaticos = await pool.query(
      'SELECT id_detalle_viatico FROM detalles_viaticos WHERE id_memorandum_comision = $1 LIMIT 1',
      [id]
    );

    // 2. Verificar si tiene gastos globales asociados
    const checkGastos = await pool.query(
      'SELECT id_gasto_global FROM gastos_globales_memorandum WHERE id_memorandum_comision = $1 AND esta_borrado = false LIMIT 1',
      [id]
    );

    if (checkViaticos.rows.length > 0 || checkGastos.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el memorandum porque ya tiene cálculos de viáticos o gastos asociados.'
      });
    }

    const result = await pool.query(
      'UPDATE memorandum_comision SET esta_borrado = true WHERE id_memorandum_comision = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Memorandum no encontrado' });
    }

    res.json({ success: true, message: 'Memorandum eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando memorandum:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
});

// Actualizar memorandum
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { id_actividad, id_empleado, periodo_inicio, periodo_fin, tipo_transporte, id_firma, observaciones, id_vehiculo } = req.body;

    const id_vehiculo_final = id_vehiculo === '' ? null : id_vehiculo;

    const result = await pool.query(
      `UPDATE memorandum_comision 
       SET id_actividad = $1, 
           id_empleado = $2, 
           periodo_inicio = $3, 
           periodo_fin = $4, 
           tipo_transporte = $5, 
           id_firma = $6, 
           observaciones = $7,
           id_vehiculo = $8
       WHERE id_memorandum_comision = $9 AND esta_borrado = false
       RETURNING *`,
      [id_actividad, id_empleado, periodo_inicio, periodo_fin, tipo_transporte, id_firma, observaciones, id_vehiculo_final, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Memorandum no encontrado' });
    }

    res.json({
      success: true,
      message: 'Memorandum actualizado exitosamente',
      memorandum: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando memorandum:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el memorandum',
      error: error.message
    });
  }
});

module.exports = router;