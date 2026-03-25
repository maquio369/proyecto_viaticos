const pool = require('./config/database');

async function checkProjectColumns() {
    try {
        console.log('--- Columnas de proyectos_estrategicos ---');
        const pe = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'proyectos_estrategicos'
        `);
        console.table(pe.rows);

        console.log('\n--- Columnas de clasificaciones_funcionales ---');
        const cf = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'clasificaciones_funcionales'
        `);
        console.table(cf.rows);

        console.log('\n--- Columnas de actividades_institucionales ---');
        const ai = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'actividades_institucionales'
        `);
        console.table(ai.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkProjectColumns();
