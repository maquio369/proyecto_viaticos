-- Rename columns inside production "puestos" table TO match LOCAL
ALTER TABLE puestos RENAME COLUMN puesto_id TO id_puesto;
ALTER TABLE puestos RENAME COLUMN puesto TO nombre_puesto;
ALTER TABLE puestos RENAME COLUMN esta_activo TO esta_borrado;
