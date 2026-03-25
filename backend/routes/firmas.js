const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Obtener empleados que pueden ser firmas
router.get('/empleados-firmantes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id_empleado, e.nombres, e.apellido1, e.apellido2, 
             p.nombre_puesto as cargo, a.descripcion as area_nombre
      FROM empleados e
      LEFT JOIN areas a ON e.id_area = a.id_area
      LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
      LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
      LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
      WHERE e.esta_borrado = false 
      ORDER BY e.nombres, e.apellido1
    `);
    res.json({
      success: true,
      empleados_firmantes: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener todas las firmas disponibles
router.get('/todas', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_firma, nombre_firma, cargo_firma FROM firmas WHERE esta_borrado = false ORDER BY nombre_firma'
    );
    res.json({
      success: true,
      firmas: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener firmas asignadas a un empleado (por área + adicionales)
router.get('/empleado/:id_empleado', async (req, res) => {
  try {
    const { id_empleado } = req.params;

    // Verificar si existe la tabla de excepciones
    const tablaExiste = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'viaticos' 
        AND table_name = 'excepciones_firmas_empleado'
      )
    `);

    const tieneExcepciones = tablaExiste.rows[0].exists;

    let query;
    if (tieneExcepciones) {
      // Query con excepciones
      query = `
        SELECT f.id_firma, f.nombre_firma, f.cargo_firma, 'area' as tipo_asignacion
        FROM empleados e
        JOIN firmas_por_area fa ON e.id_area = fa.id_area
        JOIN firmas f ON fa.id_firma = f.id_firma
        WHERE e.id_empleado = $1 
          AND e.esta_borrado = false 
          AND fa.esta_borrado = false 
          AND f.esta_borrado = false
          AND f.id_firma NOT IN (
            SELECT id_firma FROM firmas_adicionales_empleado 
            WHERE id_empleado = $1 AND esta_borrado = false
          )
          AND f.id_firma NOT IN (
            SELECT id_firma FROM excepciones_firmas_empleado
            WHERE id_empleado = $1
          )

        UNION ALL

        SELECT f.id_firma, f.nombre_firma, f.cargo_firma, 'adicional' as tipo_asignacion
        FROM firmas_adicionales_empleado fae
        JOIN firmas f ON fae.id_firma = f.id_firma
        WHERE fae.id_empleado = $1 
          AND fae.esta_borrado = false 
          AND f.esta_borrado = false

        ORDER BY nombre_firma
      `;
    } else {
      // Query sin excepciones (para cuando no existe la tabla)
      query = `
        SELECT f.id_firma, f.nombre_firma, f.cargo_firma, 'area' as tipo_asignacion
        FROM empleados e
        JOIN firmas_por_area fa ON e.id_area = fa.id_area
        JOIN firmas f ON fa.id_firma = f.id_firma
        WHERE e.id_empleado = $1 
          AND e.esta_borrado = false 
          AND fa.esta_borrado = false 
          AND f.esta_borrado = false
          AND f.id_firma NOT IN (
            SELECT id_firma FROM firmas_adicionales_empleado 
            WHERE id_empleado = $1 AND esta_borrado = false
          )

        UNION ALL

        SELECT f.id_firma, f.nombre_firma, f.cargo_firma, 'adicional' as tipo_asignacion
        FROM firmas_adicionales_empleado fae
        JOIN firmas f ON fae.id_firma = f.id_firma
        WHERE fae.id_empleado = $1 
          AND fae.esta_borrado = false 
          AND f.esta_borrado = false

        ORDER BY nombre_firma
      `;
    }

    const result = await pool.query(query, [id_empleado]);

    res.json({
      success: true,
      firmas: result.rows
    });
  } catch (error) {
    console.error('Error en /empleado/:id_empleado:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Crear firma desde empleado y agregar como adicional
router.post('/agregar-empleado-como-firma', auth, async (req, res) => {
  try {
    const { id_empleado_destino, id_empleado_firmante } = req.body;

    // Obtener datos del empleado firmante
    const empleadoFirmante = await pool.query(`
      SELECT e.nombres, e.apellido1, e.apellido2, p.nombre_puesto as cargo
      FROM empleados e
      LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
      LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
      LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
      WHERE e.id_empleado = $1
    `, [id_empleado_firmante]);

    if (empleadoFirmante.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El empleado seleccionado no puede ser firmante'
      });
    }

    const firmante = empleadoFirmante.rows[0];
    const nombreCompleto = `${firmante.nombres} ${firmante.apellido1} ${firmante.apellido2}`.trim();
    const cargo = firmante.cargo || 'Sin cargo';

    // Verificar si ya existe una firma para este empleado
    const firmaExiste = await pool.query(
      'SELECT id_firma FROM firmas WHERE nombre_firma = $1 AND esta_borrado = false',
      [nombreCompleto]
    );

    let id_firma;
    if (firmaExiste.rows.length > 0) {
      id_firma = firmaExiste.rows[0].id_firma;
    } else {
      // Crear nueva firma
      const nuevaFirma = await pool.query(
        'INSERT INTO firmas (nombre_firma, cargo_firma, descripcion) VALUES ($1, $2, $3) RETURNING id_firma',
        [nombreCompleto, cargo, `Firma de ${nombreCompleto}`]
      );
      id_firma = nuevaFirma.rows[0].id_firma;
    }

    // Verificar si ya está asignada como adicional
    const asignacionExiste = await pool.query(
      'SELECT id FROM firmas_adicionales_empleado WHERE id_empleado = $1 AND id_firma = $2 AND esta_borrado = false',
      [id_empleado_destino, id_firma]
    );

    if (asignacionExiste.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Esta firma ya está asignada al empleado'
      });
    }

    // Asignar firma adicional
    const result = await pool.query(
      'INSERT INTO firmas_adicionales_empleado (id_empleado, id_firma) VALUES ($1, $2) RETURNING *',
      [id_empleado_destino, id_firma]
    );

    res.json({
      success: true,
      message: 'Firma adicional agregada exitosamente',
      asignacion: result.rows[0],
      firma_creada: { nombre_firma: nombreCompleto, cargo_firma: cargo }
    });
  } catch (error) {
    console.error('Error agregando empleado como firma:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Eliminar firma adicional de un empleado
router.delete('/eliminar-adicional/:id_empleado/:id_firma', auth, async (req, res) => {
  try {
    const { id_empleado, id_firma } = req.params;

    // 1. Intentar eliminar de firmas adicionales primero
    const resultAdicional = await pool.query(
      'UPDATE firmas_adicionales_empleado SET esta_borrado = true WHERE id_empleado = $1 AND id_firma = $2 RETURNING id',
      [id_empleado, id_firma]
    );

    if (resultAdicional.rowCount > 0) {
      return res.json({
        success: true,
        message: 'Firma adicional eliminada exitosamente'
      });
    }

    // 2. Si no estaba como adicional, verificar si es de área para agregar excepción
    const esFirmaArea = await pool.query(`
      SELECT f.id_firma
      FROM empleados e
      JOIN firmas_por_area fa ON e.id_area = fa.id_area
      JOIN firmas f ON fa.id_firma = f.id_firma
      WHERE e.id_empleado = $1 
        AND f.id_firma = $2
        AND e.esta_borrado = false 
        AND fa.esta_borrado = false 
        AND f.esta_borrado = false
    `, [id_empleado, id_firma]);

    if (esFirmaArea.rows.length > 0) {
      // Verificar si ya existe excepción
      const existeExcepcion = await pool.query(
        'SELECT id FROM excepciones_firmas_empleado WHERE id_empleado = $1 AND id_firma = $2',
        [id_empleado, id_firma]
      );

      if (existeExcepcion.rows.length === 0) {
        await pool.query(
          'INSERT INTO excepciones_firmas_empleado (id_empleado, id_firma) VALUES ($1, $2)',
          [id_empleado, id_firma]
        );
      }

      return res.json({
        success: true,
        message: 'Firma de área excluida para este empleado'
      });
    }

    return res.status(404).json({
      success: false,
      message: 'No se encontró la firma asignada para eliminar o excluir'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;