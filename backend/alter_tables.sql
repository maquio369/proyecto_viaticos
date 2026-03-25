-- Rename columns inside production "puestos" table
ALTER TABLE puestos RENAME COLUMN id_puesto TO puesto_id;
ALTER TABLE puestos RENAME COLUMN nombre_puesto TO puesto;
ALTER TABLE puestos RENAME COLUMN esta_borrado TO esta_activo;

-- Add new columns to existing production tables
ALTER TABLE areas ADD COLUMN IF NOT EXISTS oficio character varying(50);
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS id_lugar_fisico_de_trabajo integer;
ALTER TABLE empleados_datos_laborales ADD COLUMN IF NOT EXISTS id_categoria_del_empleado integer;
