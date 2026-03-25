const pool = require('../config/database');

async function analyzeEmployeeTables() {
    try {
        console.log('=== Análisis detallado de tablas relacionadas con Empleados ===\n');

        const targetTables = [
            'empleados',
            'empleados_datos_laborales',
            'categorias',
            'categorias_del_empleado',
            'cargos',
            'puestos',
            'areas',
            'unidades',
            'estructuras_administrativas',
            'firmas',
            'firmas_adicionales_empleado',
            'firmas_por_area',
            'usuarios',
            'roles',
            'tramites',
            'comisiones'
        ];

        for (const tableName of targetTables) {
            console.log(`\n==================================================`);
            console.log(`TABLA: ${tableName}`);
            console.log(`==================================================`);

            const tableCheck = await pool.query(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)",
                [tableName]
            );

            if (!tableCheck.rows[0].exists) {
                console.log(`La tabla ${tableName} no existe.`);
                continue;
            }

            // Columnas
            const columns = await pool.query(
                `SELECT column_name, data_type, is_nullable, column_default
                 FROM information_schema.columns 
                 WHERE table_name = $1 
                 ORDER BY ordinal_position`,
                [tableName]
            );
            console.log('\nColumnas:');
            columns.rows.forEach(col => {
                console.log(`  - ${col.column_name.padEnd(25)} | ${col.data_type.padEnd(20)} | Null: ${col.is_nullable.padEnd(3)} | Def: ${col.column_default || 'None'}`);
            });

            // Primary Key
            const pk = await pool.query(`
                SELECT a.attname
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE  i.indrelid = $1::regclass
                AND    i.indisprimary;
            `, [tableName]);

            if (pk.rows.length > 0) {
                console.log(`\nPrimary Key: ${pk.rows.map(r => r.attname).join(', ')}`);
            }

            // Foreign Keys
            const fks = await pool.query(`
                SELECT
                    kcu.column_name, 
                    ccu.table_name AS foreign_table,
                    ccu.column_name AS foreign_column 
                FROM 
                    information_schema.key_column_usage AS kcu 
                    JOIN information_schema.constraint_column_usage AS ccu 
                      ON ccu.constraint_name = kcu.constraint_name 
                WHERE kcu.table_name = $1 AND kcu.table_schema = 'public'`,
                [tableName]
            );

            if (fks.rows.length > 0) {
                console.log('\nRelaciones (FK):');
                fks.rows.forEach(fk => {
                    console.log(`  - ${fk.column_name} -> ${fk.foreign_table}.${fk.foreign_column}`);
                });
            }

            // Relaciones inversas (quién apunta a esta tabla)
            const inverseFks = await pool.query(`
                SELECT
                    kcu.table_name,
                    kcu.column_name
                FROM 
                    information_schema.key_column_usage AS kcu 
                    JOIN information_schema.constraint_column_usage AS ccu 
                      ON ccu.constraint_name = kcu.constraint_name 
                WHERE ccu.table_name = $1 AND ccu.table_schema = 'public'`,
                [tableName]
            );

            if (inverseFks.rows.length > 0) {
                console.log('\nTablas que dependen de esta (FK externas):');
                inverseFks.rows.forEach(ifk => {
                    console.log(`  - ${ifk.table_name}.${ifk.column_name}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

analyzeEmployeeTables();
