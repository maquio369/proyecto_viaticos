-- Crear tabla para gastos globales por memorandum
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

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_gastos_globales_memorandum 
ON gastos_globales_memorandum(id_memorandum_comision) 
WHERE esta_borrado = false;

-- Comentarios
COMMENT ON TABLE gastos_globales_memorandum IS 'Gastos globales que se aplican a todos los viáticos de un memorandum';
COMMENT ON COLUMN gastos_globales_memorandum.id_memorandum_comision IS 'Referencia al memorandum (único por memorandum)';
COMMENT ON COLUMN gastos_globales_memorandum.pasaje IS 'Monto total de pasajes';
COMMENT ON COLUMN gastos_globales_memorandum.combustible IS 'Monto total de combustible';
COMMENT ON COLUMN gastos_globales_memorandum.otros IS 'Otros gastos';
COMMENT ON COLUMN gastos_globales_memorandum.tipo_pago IS 'EFECTIVO o CHEQUE';
