require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('../config/database');

async function populate() {
    const rawData = [
        // PARTE FINAL - ESPECIALISTA
        { clave: '110601', cat: 'ESPECIALISTA', lit: '', puesto: 'MÚSICO GENERAL', nivel: 'E' },
        { clave: '110601', cat: 'ESPECIALISTA', lit: '', puesto: 'NOTIFICADOR Y EJECUTOR', nivel: 'E' },
        { clave: '110602', cat: 'ESPECIALISTA', lit: '', puesto: 'TRADUCTOR DE LENGUAS', nivel: 'E' },
        { clave: '110602', cat: 'ESPECIALISTA', lit: '', puesto: 'ACTUARIO NOTIFICADOR', nivel: 'E' },
        { clave: '110602', cat: 'ESPECIALISTA', lit: '', puesto: 'PROMOTOR', nivel: 'E' },
        { clave: '110603', cat: 'ESPECIALISTA', lit: '', puesto: 'TOPÓGRAFO', nivel: 'D' },
        { clave: '110603', cat: 'ESPECIALISTA', lit: '', puesto: 'PROMOTOR DEPORTIVO', nivel: 'D' },
        { clave: '110603', cat: 'ESPECIALISTA', lit: '', puesto: 'PERITO A', nivel: 'D' },
        { clave: '110603', cat: 'ESPECIALISTA', lit: '', puesto: 'TRABAJADORA SOCIAL', nivel: 'D' },
        { clave: '110603', cat: 'ESPECIALISTA', lit: '', puesto: 'CAPTURISTA', nivel: 'D' },
        { clave: '110604', cat: 'ESPECIALISTA', lit: '', puesto: 'LOCUTOR', nivel: 'D' },
        { clave: '110604', cat: 'ESPECIALISTA', lit: '', puesto: 'AGENTE DE INFORMACIÓN BILINGÜE', nivel: 'D' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'ANALISTA PROGRAMADOR', nivel: 'E' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'REPORTERO', nivel: 'E' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'CORRESPONSAL', nivel: 'E' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'PSICÓLOGO', nivel: 'E' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'PERITO B', nivel: 'E' },
        { clave: '110605', cat: 'ESPECIALISTA', lit: '', puesto: 'MECÁNICO DE AERONAVE', nivel: 'F' },
        { clave: '110606', cat: 'ESPECIALISTA', lit: '', puesto: 'INSTRUCTOR', nivel: 'F' },
        { clave: '110607', cat: 'ESPECIALISTA', lit: '', puesto: 'ANALISTA DE SISTEMAS', nivel: 'G' },
        { clave: '110607', cat: 'ESPECIALISTA', lit: '', puesto: 'INSTRUCTOR DE TALLER DE EDUCACIÓN ESPECIAL', nivel: 'G' },
        { clave: '110608', cat: 'ESPECIALISTA', lit: '', puesto: '', nivel: 'H' },
        { clave: '110609', cat: 'ESPECIALISTA', lit: '', puesto: 'INSTRUCTOR DE EDUCACIÓN ESPECIAL', nivel: 'I' },
        { clave: '110611', cat: 'ESPECIALISTA', lit: '', puesto: 'INVESTIGADOR', nivel: 'K' },

        // PARTE FINAL - ANALISTA
        { clave: '110701', cat: 'ANALISTA', lit: '', puesto: 'COORDINADOR ADMINISTRATIVO (DELEGACIÓN)', nivel: 'A' },
        { clave: '110702', cat: 'ANALISTA', lit: '', puesto: 'OFICIAL SECRETARIO DEL MINISTERIO PÚBLICO', nivel: 'B' },
        { clave: '110702', cat: 'ANALISTA', lit: '', puesto: 'PROFESIONISTA A', nivel: 'B' },
        { clave: '110703', cat: 'ANALISTA', lit: '', puesto: 'PROFESIONISTA B', nivel: 'C' },
        { clave: '110704', cat: 'ANALISTA', lit: '', puesto: 'ANALISTA TÉCNICO A', nivel: 'D' },
        { clave: '110704', cat: 'ANALISTA', lit: '', puesto: 'PROFESIONISTA C', nivel: 'D' },

        // PARTE FINAL - TÉCNICO
        { clave: '110801', cat: 'TÉCNICO', lit: '', puesto: 'OPERADOR', nivel: 'A' },
        { clave: '110801', cat: 'TÉCNICO', lit: '', puesto: 'MECÁNICO', nivel: 'A' },
        { clave: '110802', cat: 'TÉCNICO', lit: '', puesto: 'ANALISTA DE OPERACIÓN', nivel: 'B' },
        { clave: '110802', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO MEDIO A', nivel: 'B' },
        { clave: '110802', cat: 'TÉCNICO', lit: '', puesto: 'ANALISTA DE MAQUINARIA PESADA', nivel: 'B' },
        { clave: '110802', cat: 'TÉCNICO', lit: '', puesto: 'CAMARÓGRAFO', nivel: 'B' },
        { clave: '110803', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO EN ELECTRÓNICA', nivel: 'C' },
        { clave: '110803', cat: 'TÉCNICO', lit: '', puesto: 'PROYECTISTA', nivel: 'C' },
        { clave: '110803', cat: 'TÉCNICO', lit: '', puesto: 'DIBUJANTE', nivel: 'C' },
        { clave: '110804', cat: 'TÉCNICO', lit: '', puesto: 'MECÁNICO ESPECIALIZADO', nivel: 'D' },
        { clave: '110804', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO MEDIO B', nivel: 'D' },
        { clave: '110805', cat: 'TÉCNICO', lit: '', puesto: 'OPERADOR DE TRAILER', nivel: 'E' },
        { clave: '110805', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO MEDIO C', nivel: 'E' },
        { clave: '110805', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO ESPECIALIZADO', nivel: 'E' },
        { clave: '110806', cat: 'TÉCNICO', lit: '', puesto: '', nivel: 'F' },
        { clave: '110807', cat: 'TÉCNICO', lit: '', puesto: '', nivel: 'G' },
        { clave: '110808', cat: 'TÉCNICO', lit: '', puesto: 'TÉCNICO DE TRANSMISIÓN', nivel: 'H' },

        // PARTE FINAL - AUXILIAR ADMINISTRATIVO
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'REPRESENTANTE', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'INSPECTOR', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'JEFE DE FISCAL', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AGENTE FISCAL', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AUXILIAR ADMINISTRATIVO', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'ADMINISTRADOR DOCUMENTAL', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AUXILIAR ADMINISTRATIVO DE SUPERVISOR', nivel: 'A' },
        { clave: '110901', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'PREFECTO', nivel: 'A' },
        { clave: '110902', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AUXILIAR DE SUPERVISOR DE TELESECUNDARIA', nivel: 'B' },
        { clave: '110902', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AGENTE DE INFORMACIÓN', nivel: 'B' },
        { clave: '110902', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'SECRETARIA EJECUTIVA DE APOYO', nivel: 'B' },
        { clave: '110902', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AUXILIAR ADMINISTRATIVO DE TELESECUNDARIA', nivel: 'B' },
        { clave: '110902', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'RECEPCIONISTA', nivel: 'B' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'RESPONSABLE DE SECCIÓN', nivel: 'C' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'RESPONSABLE DE MESA', nivel: 'C' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'GESTOR ADMINISTRATIVO', nivel: 'C' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'SECRETARIA EJECUTIVA DE MANDO MEDIO', nivel: 'C' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'CAJERA', nivel: 'C' },
        { clave: '110903', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'AUXILIAR CONTABLE', nivel: 'C' },
        { clave: '110904', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: '', nivel: 'D' },
        { clave: '110905', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: '', nivel: 'E' },
        { clave: '110906', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: '', nivel: 'F' },
        { clave: '110907', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'EVALUADOR CONTABLE', nivel: 'G' },
        { clave: '110907', cat: 'AUXILIAR ADMINISTRATIVO', lit: '', puesto: 'SECRETARIA EJECUTIVA DE MANDO SUPERIOR', nivel: 'G' },

        // PARTE FINAL - AUXILIAR DE SEGURIDAD
        { clave: '111002', cat: 'AUXILIAR DE SEGURIDAD', lit: '', puesto: 'VIGILANTE', nivel: 'B' },
        { clave: '111002', cat: 'AUXILIAR DE SEGURIDAD', lit: '', puesto: 'VIGILANTE DE ZOOLOGÍA Y BOTÁNICA', nivel: 'B' },

        // PARTE FINAL - TÉCNICO AUXILIAR
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'ELECTRICISTA', nivel: 'A' },
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'CARPINTERO', nivel: 'A' },
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'SOLDADOR', nivel: 'A' },
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'CADENERO', nivel: 'A' },
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'AUXILIAR DE LABORATORIO', nivel: 'A' },
        { clave: '111101', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'ARTESANO', nivel: 'A' },
        { clave: '111102', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'ENCARGADO DE TALLER', nivel: 'B' },
        { clave: '111103', cat: 'TÉCNICO AUXILIAR', lit: '', puesto: 'HERRERO', nivel: 'C' },

        // PARTE FINAL - AUXILIAR DE SERVICIOS
        { clave: '111201', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'AYUDANTE', nivel: 'A' },
        { clave: '111201', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'MENSAJERO', nivel: 'A' },
        { clave: '111201', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'INSTITUTRIZ', nivel: 'A' },
        { clave: '111201', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'JARDINERO ESPECIALIZADO', nivel: 'A' },
        { clave: '111202', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'CHOFER DE APOYO', nivel: 'B' },
        { clave: '111202', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'MANTENEDOR DE ANIMALES', nivel: 'B' },
        { clave: '111203', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'CHOFER DE MANDO MEDIO', nivel: 'C' },
        { clave: '111203', cat: 'AUXILIAR DE SERVICIOS', lit: '', puesto: 'CHOFER DE MANDO SUPERIOR', nivel: 'C' },
    ];

    try {
        console.log('--- Iniciando carga de datos Parte FINAL ---');

        const categoriasRes = await pool.query('SELECT id_categoria, puesto FROM categorias');
        const categoriasMap = {};
        categoriasRes.rows.forEach(r => categoriasMap[r.puesto.toUpperCase().trim()] = r.id_categoria);

        await pool.query('BEGIN');

        let insertados = 0;
        let puestosNuevos = 0;

        for (const item of rawData) {
            const id_categoria = categoriasMap[item.cat.toUpperCase().trim()];
            if (!id_categoria) {
                console.error(`❌ Categoría base no encontrada: "${item.cat}"`);
                continue;
            }

            let id_puesto = null;
            const puestoNormalizado = item.puesto.trim();

            if (puestoNormalizado !== '') {
                const findPuesto = await pool.query('SELECT id_puesto FROM puestos WHERE UPPER(nombre_puesto) = $1', [puestoNormalizado.toUpperCase()]);
                if (findPuesto.rows.length > 0) {
                    id_puesto = findPuesto.rows[0].id_puesto;
                } else {
                    console.log(`➕ Creando nuevo puesto: "${puestoNormalizado}"`);
                    const newPuesto = await pool.query('INSERT INTO puestos (nombre_puesto) VALUES ($1) RETURNING id_puesto', [puestoNormalizado]);
                    id_puesto = newPuesto.rows[0].id_puesto;
                    puestosNuevos++;
                }
            }

            await pool.query(`
                INSERT INTO categorias_del_empleado (clave_categoria, literal, categoria, id_puesto, literal_viatico)
                VALUES ($1, $2, $3, $4, $5)
            `, [item.clave, item.lit, id_categoria, id_puesto, item.nivel]);
            insertados++;
        }

        await pool.query('COMMIT');
        console.log(`\n✅ Éxito Final: ${insertados} registros, ${puestosNuevos} puestos nuevos.`);
    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('❌ Error fatal:', err);
    } finally {
        pool.end();
    }
}

populate();
