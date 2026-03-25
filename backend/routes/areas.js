const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Obtiene la jerarquía completa de áreas estructurada recursivamente.
 */
router.get('/tree', auth, async (req, res) => {
    try {
        // Obtenemos los nombres de las URs primero
        const urResult = await pool.query(`
            SELECT DISTINCT
                clave_clasificacion_administrativa as c_admin,
                clave_unidad_responsable as c_ur,
                descripcion as ur_nombre
            FROM estructuras_administrativas
            WHERE esta_borrado = false AND clave_uro = '000'
        `);

        const urNamesMap = {};
        urResult.rows.forEach(r => {
            urNamesMap[`${r.c_admin}-${r.c_ur}`] = r.ur_nombre;
        });

        const result = await pool.query(`
            SELECT 
                a.id_area, a.descripcion as area_nombre, a.oficio,
                a.clave_area, a.clave_subarea, a.clave_ocupacion,
                ea.id_estructura_administrativa as ea_id, 
                ea.descripcion as ea_nombre,
                ea.clave_clasificacion_administrativa as c_admin,
                ea.clave_unidad_responsable as c_ur,
                ea.clave_uro as c_uro
            FROM areas a
            JOIN estructuras_administrativas ea ON a.id_estructura_administrativa = ea.id_estructura_administrativa
            WHERE a.esta_borrado = false AND ea.esta_borrado = false
            ORDER BY c_admin, c_ur, c_uro, a.clave_area, a.clave_subarea, a.clave_ocupacion
        `);

        const tree = [];
        const rootMap = {};

        result.rows.forEach(row => {
            // 1. Clasificación Administrativa (Nivel 1)
            if (!rootMap[row.c_admin]) {
                rootMap[row.c_admin] = {
                    id: `admin-${row.c_admin}`,
                    label: row.c_admin === '21111101' ? 'Gubernatura' : `Estructura: ${row.c_admin}`,
                    children: {},
                    type: 'admin'
                };
                tree.push(rootMap[row.c_admin]);
            }

            // 2. Unidad Responsable (Nivel 2)
            const urKey = `${row.c_admin}-${row.c_ur}`;
            if (!rootMap[row.c_admin].children[row.c_ur]) {
                const urNombre = urNamesMap[urKey] || row.c_ur;
                rootMap[row.c_admin].children[row.c_ur] = {
                    id: `ur-${urKey}`,
                    label: `UR ${row.c_ur}: ${urNombre}`,
                    children: {},
                    type: 'ur'
                };
            }

            // 3. URO (Nivel 3)
            const urNode = rootMap[row.c_admin].children[row.c_ur];
            if (!urNode.children[row.c_uro]) {
                urNode.children[row.c_uro] = {
                    id: `uro-${row.ea_id}`,
                    label: `URO ${row.c_uro}: ${row.ea_nombre}`,
                    children: {},
                    type: 'uro'
                };
            }

            // 4. Clave de Área (Nivel 4)
            const uroNode = urNode.children[row.c_uro];
            if (!uroNode.children[row.clave_area]) {
                uroNode.children[row.clave_area] = {
                    id: `area-${row.id_area}`,
                    label: row.area_nombre,
                    oficio: row.oficio,
                    code: `${row.clave_area}-${row.clave_subarea}-${row.clave_ocupacion}`,
                    children: {},
                    type: 'area'
                };
            }

            // 5. Clave de Subárea (Nivel 5) - Solo si no es 00
            if (row.clave_subarea !== '00') {
                const areaNode = uroNode.children[row.clave_area];
                if (!areaNode.children[row.clave_subarea]) {
                    areaNode.children[row.clave_subarea] = {
                        id: `sub-${row.id_area}`,
                        label: row.area_nombre,
                        oficio: row.oficio,
                        code: `${row.clave_area}-${row.clave_subarea}-${row.clave_ocupacion}`,
                        children: {},
                        type: 'subarea'
                    };
                }
            }
        });

        // Función recursiva para convertir los objetos de hijos en arreglos
        const convertToArray = (node) => {
            const children = Object.values(node.children || {});
            if (children.length > 0) {
                return {
                    ...node,
                    children: children.map(convertToArray)
                };
            }
            const { children: _, ...rest } = node;
            return rest;
        };

        const finalTree = tree.map(convertToArray);

        res.json({
            success: true,
            tree: finalTree
        });
    } catch (error) {
        console.error('Error al generar árbol de áreas:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

module.exports = router;
