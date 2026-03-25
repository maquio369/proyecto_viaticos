const pool = require('../config/database');

async function analyzeEmployeeTables() {
    try {
        console.log('=== Análisis de tablas relacionadas con Empleados ===\n');

        // Tablas sugeridas por el usuario y comunes
        const targetTables = [
            'empleados',
            'empleados_datos_laborales',
            'categorias',
            'cargos',
            'areas',
            'puestos',
            'unidades_administrativas',
            'direcciones',
            'departamentos',
            'firmas',
            'usuarios'
        ];

        for (const tableName of targetTables) {
            console.log(`\n--- Tabla: ${tableName} ---`);

            // Verificar si la tabla existe
            const tableCheck = await pool.query(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)",
                [tableName]
            );

            if (!tableCheck.rows[0].exists) {
                console.log(`La tabla ${tableName} no existe.`);
                continue;
            }

            // Obtener columnas
            const columns = await pool.query(
                `SELECT column_name, data_type, is_nullable, column_default
                 FROM information_schema.columns 
                 WHERE table_name = $1 
                 ORDER BY ordinal_position`,
                [tableName]
            );
            console.log('Columnas:');
            columns.rows.forEach(col => {
                console.log(`  - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''}${col.column_default ? ', Default: ' + col.column_default : ''})`);
            });

            // Obtener llaves foráneas (FK)
            const fks = await pool.query(
                `SELECT
                    kcu.column_name, 
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name 
                FROM 
                    information_schema.key_column_usage AS kcu 
                    JOIN information_schema.constraint_column_usage AS ccu 
                      ON ccu.constraint_name = kcu.constraint_name 
                WHERE kcu.table_name = $1`,
                [tableName]
            );

            if (fks.rows.length > 0) {
                console.log('Relaciones (FK):');
                fks.rows.forEach(fk => {
                    console.log(`  - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
                });
            } else {
                console.log('No se encontraron llaves foráneas explícitas.');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

analyzeEmployeeTables();
