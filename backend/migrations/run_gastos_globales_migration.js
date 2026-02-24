const pool = require('../config/database');

async function runMigration() {
    try {
        console.log('Ejecutando migración: crear tabla gastos_globales_memorandum...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS gastos_globales_memorandum (
                id_gasto_global SERIAL PRIMARY KEY,
                id_memorandum_comision INTEGER NOT NULL REFERENCES memorandum_comision(id_memorandum_comision) ON DELETE CASCADE,
                pasaje DECIMAL(10,2) DEFAULT 0,
                combustible DECIMAL(10,2) DEFAULT 0,
                otros DECIMAL(10,2) DEFAULT 0,
                tipo_pago VARCHAR(20),
                fecha_creacion TIMESTAMP DEFAULT NOW(),
                esta_borrado BOOLEAN DEFAULT FALSE,
                CONSTRAINT unique_memorandum_gastos UNIQUE(id_memorandum_comision)
            );
        `);

        console.log('✅ Tabla gastos_globales_memorandum creada exitosamente');

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_gastos_globales_memorandum 
            ON gastos_globales_memorandum(id_memorandum_comision) 
            WHERE esta_borrado = false;
        `);

        console.log('✅ Índice creado exitosamente');

        await pool.query(`
            COMMENT ON TABLE gastos_globales_memorandum IS 'Gastos globales que se aplican a todos los viáticos de un memorandum';
        `);

        await pool.query(`
            COMMENT ON COLUMN gastos_globales_memorandum.id_memorandum_comision IS 'Referencia al memorandum (único por memorandum)';
        `);

        console.log('✅ Comentarios agregados exitosamente');
        console.log('✅ Migración completada con éxito');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando migración:', error.message);
        process.exit(1);
    }
}

runMigration();
