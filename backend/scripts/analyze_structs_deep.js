const pool = require('../config/database');

async function analyzeEstructuras() {
    try {
        console.log('--- Estructura de la tabla ESTRUCTURAS_ADMINISTRATIVAS ---');
        const schemaRes = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'estructuras_administrativas'
            ORDER BY ordinal_position;
        `);
        console.table(schemaRes.rows);

        console.log('\n--- Datos de ESTRUCTURAS_ADMINISTRATIVAS (Todas) ---');
        const dataRes = await pool.query(`
            SELECT * FROM estructuras_administrativas 
            WHERE esta_borrado = false 
            ORDER BY clave_clasificacion_administrativa, clave_unidad_responsable, clave_uro
        `);
        console.table(dataRes.rows);

        console.log('\n--- Ejemplo de Relación con Areas (para ID 21) ---');
        const relationRes = await pool.query(`
            SELECT ea.id_estructura_administrativa as ea_id, ea.descripcion as ea_desc,
                   a.id_area, a.descripcion as area_desc, a.clave_area, a.clave_subarea, a.clave_ocupacion
            FROM estructuras_administrativas ea
            JOIN areas a ON ea.id_estructura_administrativa = a.id_estructura_administrativa
            WHERE ea.id_estructura_administrativa = 21
        `);
        console.table(relationRes.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

analyzeEstructuras();
