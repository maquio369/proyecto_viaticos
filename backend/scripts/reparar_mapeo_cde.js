const pool = require('../config/database');

async function repairCategoriasDelEmpleado() {
    const mappings = {
        'AGENTE DEL MINISTRO PÚBLICO': 'AGENTE DEL MINISTERIO PÚBLICO',
        'AGENTE DEL MINISTRO PÚBLICO AUXILIAR': 'AGENTE DEL MINISTERIO PÚBLICO AUXILIAR',
        'ANALISTA TÉCNICO ESPECIALIZADO': 'ANÁLISIS TÉCNICO ESPECIALIZADO',
        'PRGRAMADOR': 'ANALISTA PROGRAMADOR',
        'PROFESIONALISTA A': 'PROFESIONISTA A',
        'PROFESIONALISTA B': 'PROFESIONISTA B',
        'PROFESIONALISTA C': 'PROFESIONISTA C',
        'SECRETARIO DEL ESTADO EQUIVALENTE': 'SECRETARIO DE ESTADO O EQUIVALENTE',
        'TECNICO MEDIO A': 'TÉCNICO MEDIO A',
        'TECNICO MEDIO B': 'TÉCNICO MEDIO B',
        'TECNICO MEDIO C': 'TÉCNICO MEDIO C'
    };

    try {
        await pool.query('BEGIN');

        for (const [oldName, newName] of Object.entries(mappings)) {
            console.log(`Reparando: "${oldName}" -> "${newName}"`);
            await pool.query(`
                UPDATE categorias_del_empleado cde
                SET id_puesto = p.id_puesto
                FROM puestos p
                WHERE cde.puesto_texto_anterior = $1 
                AND TRIM(UPPER(p.nombre_puesto)) = TRIM(UPPER($2))
            `, [oldName, newName]);
        }

        // Casos especiales (Director General y/o Coordinador o Equivalente)
        // Mapear a DIRECTOR GENERAL (ID 2)
        await pool.query(`
            UPDATE categorias_del_empleado cde
            SET id_puesto = 2
            WHERE puesto_texto_anterior = 'DIRECTOR GENERAL Y/O COORDINADOR O EQUIVALENTE'
        `);

        // PILOTO -> PILOTO A (ID 48)
        await pool.query(`
            UPDATE categorias_del_empleado cde
            SET id_puesto = 48
            WHERE puesto_texto_anterior = 'PILOTO'
        `);

        // TÉCNICO -> TÉCNICO ESPECIALIZADO (ID 123)
        await pool.query(`
            UPDATE categorias_del_empleado cde
            SET id_puesto = 123
            WHERE puesto_texto_anterior = 'TÉCNICO'
        `);

        await pool.query('COMMIT');
        console.log('✅ Reparación de mapeos completada.');

        const remaining = await pool.query(`
            SELECT DISTINCT puesto_texto_anterior 
            FROM categorias_del_empleado 
            WHERE id_puesto IS NULL AND puesto_texto_anterior != ''
        `);
        console.log('Puestos aún sin mapear:', remaining.rows.map(r => r.puesto_texto_anterior));

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error en reparación:', err.message);
    } finally {
        await pool.end();
    }
}

repairCategoriasDelEmpleado();
