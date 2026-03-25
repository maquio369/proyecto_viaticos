const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// 1. Obtener todos los empleados con información detallada (para la lista de gestión)
router.get('/full', auth, async (req, res) => {
  try {
    const query = `
            SELECT 
                e.id_empleado,
                e.prefijo,
                e.nombres,
                e.apellido1,
                e.apellido2,
                CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_completo,
                e.correo,
                e.telefonos_oficina,
                e.id_area,
                a.descripcion as area_nombre,
                e.id_lugar_fisico_de_trabajo,
                lft.descripcion as lugar_trabajo_nombre,
                edl.rfc,
                edl.num_empleado,
                edl.curp,
                edl.nss,
                cde.id_categoria_del_empleado,
                p.nombre_puesto as cargo,
                cde.literal_viatico
            FROM empleados e
            LEFT JOIN areas a ON e.id_area = a.id_area
            LEFT JOIN areas lft ON e.id_lugar_fisico_de_trabajo = lft.id_area
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            LEFT JOIN categorias_del_empleado cde ON edl.id_categoria_del_empleado = cde.id_categoria_del_empleado
            LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
            WHERE e.esta_borrado = false
            ORDER BY e.nombres, e.apellido1
        `;
    const result = await pool.query(query);
    res.json({ success: true, empleados: result.rows });
  } catch (error) {
    console.error('Error obteniendo empleados detallados:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Obtener un empleado por ID con toda su información
router.get('/full/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
            SELECT 
                e.*,
                edl.rfc,
                edl.num_empleado,
                edl.curp,
                edl.nss,
                edl.id_categoria_del_empleado
            FROM empleados e
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            WHERE e.id_empleado = $1 AND e.esta_borrado = false
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    }
    res.json({ success: true, empleado: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo empleado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Crear nuevo empleado
router.post('/', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      prefijo, nombres, apellido1, apellido2, correo, telefonos_oficina,
      id_area, id_lugar_fisico_de_trabajo,
      rfc, num_empleado, curp, nss
    } = req.body;

    await client.query('BEGIN');

    // 1. Insertar en empleados_datos_laborales
    const labRes = await client.query(
      `INSERT INTO empleados_datos_laborales 
            (rfc, num_empleado, curp, nss) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id_empleado_datos_laborales`,
      [rfc, num_empleado, curp, nss]
    );
    const id_laborales = labRes.rows[0].id_empleado_datos_laborales;

    // 2. Insertar en empleados
    const empRes = await client.query(
      `INSERT INTO empleados 
            (prefijo, nombres, apellido1, apellido2, correo, telefonos_oficina, id_area, id_lugar_fisico_de_trabajo, id_empleado_datos_laborales) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING id_empleado`,
      [prefijo, nombres, apellido1, apellido2, correo, telefonos_oficina, id_area, id_lugar_fisico_de_trabajo, id_laborales]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Empleado creado exitosamente', id_empleado: empRes.rows[0].id_empleado });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando empleado:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// 4. Actualizar empleado
router.put('/:id', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      prefijo, nombres, apellido1, apellido2, correo, telefonos_oficina,
      id_area, id_lugar_fisico_de_trabajo,
      rfc, num_empleado, curp, nss
    } = req.body;

    await client.query('BEGIN');

    // 1. Obtener el ID de datos laborales
    const empCheck = await client.query('SELECT id_empleado_datos_laborales FROM empleados WHERE id_empleado = $1', [id]);
    if (empCheck.rows.length === 0) throw new Error('Empleado no encontrado');

    let id_laborales = empCheck.rows[0].id_empleado_datos_laborales;

    // 2. Actualizar o insertar datos laborales
    if (id_laborales) {
      await client.query(
        `UPDATE empleados_datos_laborales 
                SET rfc = $1, num_empleado = $2, curp = $3, nss = $4
                WHERE id_empleado_datos_laborales = $5`,
        [rfc, num_empleado, curp, nss, id_laborales]
      );
    } else {
      const labRes = await client.query(
        `INSERT INTO empleados_datos_laborales 
                (rfc, num_empleado, curp, nss) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id_empleado_datos_laborales`,
        [rfc, num_empleado, curp, nss]
      );
      id_laborales = labRes.rows[0].id_empleado_datos_laborales;
    }

    // 3. Actualizar empleado
    await client.query(
      `UPDATE empleados 
            SET prefijo = $1, nombres = $2, apellido1 = $3, apellido2 = $4, correo = $5, 
                telefonos_oficina = $6, id_area = $7, id_lugar_fisico_de_trabajo = $8,
                id_empleado_datos_laborales = $9
            WHERE id_empleado = $10`,
      [prefijo, nombres, apellido1, apellido2, correo, telefonos_oficina, id_area, id_lugar_fisico_de_trabajo, id_laborales, id]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Empleado actualizado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando empleado:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// 5. Eliminar empleado (Soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE empleados SET esta_borrado = true WHERE id_empleado = $1', [id]);
    res.json({ success: true, message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando empleado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Buscar empleados (Mantenido por compatibilidad)
router.get('/buscar', auth, async (req, res) => {
  try {
    const { q } = req.query;

    let query = `
      SELECT 
        e.id_empleado,
        edl.rfc,
        CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_completo,
        a.descripcion as area,
        b.nombre_banco,
        cb.cuenta,
        cb.clabe
      FROM empleados e
      LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
      LEFT JOIN areas a ON e.id_area = a.id_area AND a.esta_borrado = false
      LEFT JOIN cuentas_bancarias cb ON e.id_empleado = cb.id_empleado AND cb.esta_borrado = false
      LEFT JOIN cat_bancos b ON cb.id_banco = b.id_banco
      WHERE e.esta_borrado = false
    `;

    const params = [];

    if (q) {
      query += ` AND (
        LOWER(e.nombres) LIKE LOWER($1) OR 
        LOWER(e.apellido1) LIKE LOWER($1) OR 
        LOWER(e.apellido2) LIKE LOWER($1) OR
        LOWER(edl.rfc) LIKE LOWER($1)
      )`;
      params.push(`%${q}%`);
    }

    query += ` ORDER BY e.nombres, e.apellido1 LIMIT 50`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error buscando empleados:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 7. Guardar/Actualizar cuenta bancaria (Mantenido por compatibilidad)
router.post('/cuenta-bancaria', async (req, res) => {
  try {
    const { id_empleado, id_banco, cuenta, clabe } = req.body;

    const check = await pool.query(
      'SELECT id_cuenta_bancaria FROM cuentas_bancarias WHERE id_empleado = $1 AND esta_borrado = false',
      [id_empleado]
    );

    if (check.rows.length > 0) {
      await pool.query(
        `UPDATE cuentas_bancarias 
                 SET id_banco = $1, cuenta = $2, clabe = $3
                 WHERE id_empleado = $4`,
        [id_banco, cuenta, clabe, id_empleado]
      );
    } else {
      await pool.query(
        `INSERT INTO cuentas_bancarias (id_empleado, id_banco, cuenta, clabe)
                 VALUES ($1, $2, $3, $4)`,
        [id_empleado, id_banco, cuenta, clabe]
      );
    }

    res.json({ success: true, message: 'Cuenta bancaria guardada exitosamente' });

  } catch (error) {
    console.error('Error guardando cuenta bancaria:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Obtener cuenta bancaria (Mantenido por compatibilidad)
router.get('/cuenta-bancaria/:id_empleado', async (req, res) => {
  try {
    const { id_empleado } = req.params;
    const result = await pool.query(
      `SELECT c.id_cuenta_bancaria, c.id_banco, c.cuenta, c.clabe, b.nombre_banco
             FROM cuentas_bancarias c
             JOIN cat_bancos b ON c.id_banco = b.id_banco
             WHERE c.id_empleado = $1 AND c.esta_borrado = false`,
      [id_empleado]
    );

    res.json({
      success: true,
      cuenta: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error obteniendo cuenta bancaria:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;