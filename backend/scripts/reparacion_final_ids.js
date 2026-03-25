const pool = require('../config/database');

async function finalRepair() {
    const finalMappings = [
        { text: 'ANALISTA TÉCNICO ESPECIALIZADO', id: 51 },
        { text: 'AGENTE DEL MINISTRO PÚBLICO', id: 55 },
        { text: 'AGENTE DEL MINISTRO PÚBLICO AUXILIAR', id: 56 },
        { text: 'OFICIAL SECRETARIO DEL MINISTERIO PUBLICO', id: 57 },
        { text: 'OFICIAL DEL REGISTRO CIVIL DEL ESTADO', id: 30 }
    ];

    try {
        await pool.query('BEGIN');

        for (const m of finalMappings) {
            console.log(`Mapeando: "${m.text}" -> ID ${m.id}`);
            await pool.query(`
                UPDATE categorias_del_empleado 
                SET id_puesto = $1 
                WHERE puesto_texto_anterior = $2
            `, [m.id, m.text]);
        }

        await pool.query('COMMIT');
        console.log('✅ Reparación final completada.');

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error en reparación final:', err.message);
    } finally {
        await pool.end();
    }
}

finalRepair();
