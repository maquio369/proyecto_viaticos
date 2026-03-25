-- Migración de la columna 'categoria' de TEXT a INT en 'categorias_del_empleado'

-- 1. Crear una columna temporal de tipo INTEGER
ALTER TABLE categorias_del_empleado ADD COLUMN categoria_id_new INTEGER;

-- 2. Mapear los valores de texto existentes a los IDs de la nueva tabla 'categorias'
-- Usamos UNACCENT o simplemente mapeo manual para los casos conocidos
UPDATE categorias_del_empleado cde
SET categoria_id_new = c.id_categoria
FROM categorias c
WHERE 
    UPPER(TRIM(cde.categoria)) = UPPER(TRIM(c.puesto))
    OR (UPPER(TRIM(cde.categoria)) = 'TECNICO' AND UPPER(TRIM(c.puesto)) = 'TÉCNICO');

-- 3. Eliminar la columna vieja y renombrar la nueva (o simplemente convertir el tipo)
-- Para mantener el nombre original 'categoria' pero como INT:
ALTER TABLE categorias_del_empleado DROP COLUMN categoria;
ALTER TABLE categorias_del_empleado RENAME COLUMN categoria_id_new TO categoria;

-- 4. Agregar constraint de llave foránea
ALTER TABLE categorias_del_empleado
ADD CONSTRAINT fk_categoria_puesto
FOREIGN KEY (categoria) REFERENCES categorias(id_categoria);

-- 5. Verificar si quedaron nulos (en caso de que algún texto no coincidiera)
-- Si quedan nulos, el usuario deberá re-asignarlos vía UI
-- (Opcional: podrías poner un default si fuera necesario)
