CREATE TABLE IF NOT EXISTS tramites (
    id_tramite SERIAL PRIMARY KEY,
    folio VARCHAR(50),
    fecha DATE NOT NULL,
    importe NUMERIC(10, 2) NOT NULL,
    observaciones TEXT,
    enviado BOOLEAN DEFAULT false,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    esta_borrado BOOLEAN DEFAULT false
);
