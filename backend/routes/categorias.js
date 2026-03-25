const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// 1. Obtener todos los niveles/categorías disponibles
router.get('/catalogo', auth, async (req, res) => {
    try {
        const query = `
            SELECT 
                cde.id_categoria_del_empleado, 
                cde.clave_categoria, 
                cde.literal, 
                cde.categoria as id_categoria_puesto, 
                c.puesto as categoria_nombre, 
                p.nombre_puesto as nombre_puesto, 
                cde.literal_viatico,
                cde.id_puesto
            FROM categorias_del_empleado cde
            LEFT JOIN categorias c ON cde.categoria = c.id_categoria
            LEFT JOIN puestos p ON cde.id_puesto = p.id_puesto
            WHERE cde.esta_borrado = false
            ORDER BY cde.literal_viatico ASC, cde.literal ASC
        `;
        console.log('Ejecutando query en /catalogo');
        const result = await pool.query(query);
        res.json({ success: true, categorias: result.rows });
    } catch (error) {
        console.error('Error obteniendo catálogo de categorías:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. Obtener lista de empleados con su categoría actual
router.get('/empleados-categorias', auth, async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id_empleado,
                CONCAT(e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_completo,
                a.descripcion as area,
                cat.id_categoria_del_empleado,
                cat.literal_viatico,
                c.puesto as categoria_nombre,
                cat.literal
            FROM empleados e
            LEFT JOIN areas a ON e.id_area = a.id_area
            LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
            LEFT JOIN categorias_del_empleado cat ON edl.id_categoria_del_empleado = cat.id_categoria_del_empleado
            LEFT JOIN categorias c ON cat.categoria = c.id_categoria
            WHERE e.esta_borrado = false
            ORDER BY e.nombres ASC
        `;
        const result = await pool.query(query);
        res.json({ success: true, employees: result.rows });
    } catch (error) {
        console.error('Error obteniendo empleados con categorías:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Asignar categoría a un empleado
router.post('/asignar', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        const { id_empleado, id_categoria_del_empleado } = req.body;

        if (!id_empleado || !id_categoria_del_empleado) {
            return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
        }

        await client.query('BEGIN');

        // 1. Obtener el id_empleado_datos_laborales y la categoría actual del empleado
        const empRes = await client.query(
            'SELECT e.id_empleado_datos_laborales, edl.id_categoria_del_empleado as categoria_actual ' +
            'FROM empleados e ' +
            'LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales ' +
            'WHERE e.id_empleado = $1',
            [id_empleado]
        );

        if (empRes.rows.length === 0) {
            throw new Error('Empleado no encontrado');
        }

        let id_laborales = empRes.rows[0].id_empleado_datos_laborales;

        if (!id_laborales) {
            // Si no tiene datos laborales, creamos uno nuevo
            const newLabRes = await client.query(
                'INSERT INTO empleados_datos_laborales (id_categoria_del_empleado, fecha_actualizacion_categoria) VALUES ($1, NOW()) RETURNING id_empleado_datos_laborales',
                [id_categoria_del_empleado]
            );
            id_laborales = newLabRes.rows[0].id_empleado_datos_laborales;

            // Actualizamos al empleado con su nuevo registro de datos laborales
            await client.query(
                'UPDATE empleados SET id_empleado_datos_laborales = $1 WHERE id_empleado = $2',
                [id_laborales, id_empleado]
            );
        } else {
            // Si ya tiene, actualizamos la categoría guardando el historial de la anterior
            const categoria_actual = empRes.rows[0].categoria_actual;

            await client.query(
                'UPDATE empleados_datos_laborales ' +
                'SET id_categoria_anterior = $1, ' +
                '    id_categoria_del_empleado = $2, ' +
                '    fecha_actualizacion_categoria = NOW() ' +
                'WHERE id_empleado_datos_laborales = $3',
                [categoria_actual, id_categoria_del_empleado, id_laborales]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, message: 'Categoría asignada correctamente' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error asignando categoría:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// 4. Obtener niveles únicos de tarifas_viaticos (para el selector del catálogo)
router.get('/niveles', auth, async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT nivel_aplicacion 
            FROM tarifas_viaticos 
            WHERE esta_borrado = false 
            ORDER BY nivel_aplicacion ASC
        `;
        const result = await pool.query(query);
        res.json({ success: true, niveles: result.rows.map(r => r.nivel_aplicacion) });
    } catch (error) {
        console.error('Error obteniendo niveles:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4.5. Obtener catálogo de categorías base (legacy)
router.get('/legacy-catalog', auth, async (req, res) => {
    try {
        const query = 'SELECT id_categoria, puesto FROM categorias WHERE esta_borrado = false ORDER BY puesto ASC';
        const result = await pool.query(query);
        res.json({ success: true, categorias: result.rows });
    } catch (error) {
        console.error('Error obteniendo catálogo base:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. Actualizar una categoría completa
router.put('/catalogo/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { clave_categoria, literal, categoria, puesto, literal_viatico, id_puesto, id_categoria_puesto } = req.body;

        // Determinar el ID de la categoría (usar categoria o id_categoria_puesto si están presentes)
        const final_categoria = Number(id_categoria_puesto || categoria);

        // Determinar el ID del puesto (id_puesto o el valor de puesto si es numérico)
        // Evitar que strings como 'DIBUJANTE' pasen como IDs
        const final_id_puesto = (!isNaN(Number(id_puesto)) && id_puesto !== null && id_puesto !== '') ? Number(id_puesto) :
            (!isNaN(Number(puesto)) && puesto !== null && puesto !== '') ? Number(puesto) : null;

        console.log('Actualizando categoría:', {
            id,
            clave_categoria,
            final_categoria,
            final_id_puesto,
            literal_viatico
        });

        const query = `
            UPDATE categorias_del_empleado 
            SET clave_categoria = $1, literal = $2, categoria = $3, id_puesto = $4, literal_viatico = $5
            WHERE id_categoria_del_empleado = $6 
            RETURNING *
        `;
        const result = await pool.query(query, [clave_categoria, literal, final_categoria, final_id_puesto, literal_viatico, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        res.json({ success: true, message: 'Categoría actualizada correctamente', categoria: result.rows[0] });
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5.5. Obtener lista de puestos (nuevo catálogo)
router.get('/puestos', auth, async (req, res) => {
    try {
        const query = 'SELECT id_puesto as id_categoria, nombre_puesto as puesto FROM puestos WHERE esta_borrado = false ORDER BY nombre_puesto ASC';
        const result = await pool.query(query);
        res.json({ success: true, puestos: result.rows });
    } catch (error) {
        console.error('Error obteniendo catálogo de puestos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 6. Crear una nueva categoría
router.post('/catalogo', auth, async (req, res) => {
    try {
        const { clave_categoria, literal, categoria, puesto, literal_viatico, id_puesto, id_categoria_puesto } = req.body;

        if (!clave_categoria || (!categoria && !id_categoria_puesto)) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (Clave y Categoría)' });
        }

        // Determinar el ID de la categoría
        const final_categoria = Number(id_categoria_puesto || categoria);

        // Determinar el ID del puesto
        const final_id_puesto = (!isNaN(Number(id_puesto)) && id_puesto !== null && id_puesto !== '') ? Number(id_puesto) :
            (!isNaN(Number(puesto)) && puesto !== null && puesto !== '') ? Number(puesto) : null;

        console.log('Creando categoría:', {
            clave_categoria,
            final_categoria,
            final_id_puesto,
            literal_viatico
        });

        const query = `
            INSERT INTO categorias_del_empleado (clave_categoria, literal, categoria, id_puesto, literal_viatico)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [clave_categoria, literal, final_categoria, final_id_puesto, literal_viatico]);

        res.json({ success: true, message: 'Categoría creada correctamente', categoria: result.rows[0] });
    } catch (error) {
        console.error('Error creando categoría:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 7. Eliminar una categoría (Soft delete)
router.delete('/catalogo/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            UPDATE categorias_del_empleado 
            SET esta_borrado = true 
            WHERE id_categoria_del_empleado = $1 
            RETURNING *
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        res.json({ success: true, message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
