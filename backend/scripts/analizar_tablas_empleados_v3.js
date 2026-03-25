const pool = require('../config/database');
const fs = require('fs');

async function analyzeEmployeeTables() {
    try {
        let output = '=== Análisis detallado de tablas relacionadas con Empleados ===\n\n';

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
            output += `\n==================================================\n`;
            output += `TABLA: ${tableName}\n`;
            output += `==================================================\n`;

            const tableCheck = await pool.query(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)",
                [tableName]
            );

            if (!tableCheck.rows[0].exists) {
                output += `La tabla ${tableName} no existe.\n`;
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
            output += '\nColumnas:\n';
            columns.rows.forEach(col => {
                output += `  - ${col.column_name.padEnd(25)} | ${col.data_type.padEnd(20)} | Null: ${col.is_nullable.padEnd(3)} | Def: ${col.column_default || 'None'}\n`;
            });

            // Primary Key
            try {
                const pk = await pool.query(`
                    SELECT a.attname
                    FROM   pg_index i
                    JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE  i.indrelid = $1::regclass
                    AND    i.indisprimary;
                `, [tableName]);

                if (pk.rows.length > 0) {
                    output += `\nPrimary Key: ${pk.rows.map(r => r.attname).join(', ')}\n`;
                }
            } catch (e) {
                output += `\nError al obtener PK: ${e.message}\n`;
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
                output += '\nRelaciones (FK):\n';
                fks.rows.forEach(fk => {
                    output += `  - ${fk.column_name} -> ${fk.foreign_table}.${fk.foreign_column}\n`;
                });
            }

            // Relaciones inversas
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
                output += '\nTablas que dependen de esta (FK externas):\n';
                inverseFks.rows.forEach(ifk => {
                    output += `  - ${ifk.table_name}.${ifk.column_name}\n`;
                });
            }
        }

        fs.writeFileSync('analysis_report.txt', output, 'utf8');
        console.log('Reporte generado en analysis_report.txt');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

analyzeEmployeeTables();
