-- Eliminar tabla categorias previa si existe (estaba vacía y sin uso)
DROP TABLE IF EXISTS categorias CASCADE;

-- Crear tabla categorias (Puestos)
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    puesto VARCHAR(255) NOT NULL,
    esta_borrado BOOLEAN DEFAULT FALSE
);

-- Poblar tabla con los niveles solicitados por el usuario
INSERT INTO categorias (puesto) VALUES 
('MANDO SUPERIOR'),
('MANDO MEDIO SUPERIOR'),
('MANDO MEDIO'),
('ENLACE'),
('MANDO OPERATIVO'),
('ESPECIALISTA'),
('ANALISTA'),
('TÉCNICO'),
('AUXILIAR ADMINISTRATIVO'),
('AUXILIAR DE SEGURIDAD'),
('TÉCNICO AUXILIAR'),
('AUXILIAR DE SERVICIOS');
