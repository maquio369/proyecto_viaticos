const pool = require('../config/database');

async function verificarSchemaViaticos() {
    try {
        console.log('=== Verificando schema de detalle_viaticos ===\n');

        const result = await pool.query(
            `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns 
       WHERE table_name = 'detalle_viaticos'
       ORDER BY ordinal_position`
        );

        console.log('Columnas encontradas:');
        console.log(JSON.stringify(result.rows, null, 2));

        // Verificar si hay columnas de firma
        const firmaColumns = result.rows.filter(col =>
            col.column_name.includes('firma')
        );

        console.log('\n=== Columnas relacionadas con firma ===');
        console.log(JSON.stringify(firmaColumns, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verificarSchemaViaticos();
