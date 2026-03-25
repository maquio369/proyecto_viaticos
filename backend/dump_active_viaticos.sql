--
-- PostgreSQL database dump
--

\restrict 2rTAqHHlNq0Epz7WIC3MPmEnGQg3FEICFesZrRMg0PwXPNDPPlxTmRGf8UMdsTf

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY viaticos.tramites DROP CONSTRAINT IF EXISTS tramites_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.tramites DROP CONSTRAINT IF EXISTS tramites_id_firma_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.memorandum_comision DROP CONSTRAINT IF EXISTS memorandum_comision_id_firma_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.memorandum_comision DROP CONSTRAINT IF EXISTS memorandum_comision_id_empleado_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.memorandum_comision DROP CONSTRAINT IF EXISTS memorandum_comision_id_actividad_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.gastos_globales_memorandum DROP CONSTRAINT IF EXISTS gastos_globales_memorandum_id_memorandum_comision_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.zonas_municipios DROP CONSTRAINT IF EXISTS fk_zm_zona;
ALTER TABLE IF EXISTS ONLY viaticos.zonas_municipios DROP CONSTRAINT IF EXISTS fk_zm_municipio;
ALTER TABLE IF EXISTS ONLY viaticos.tarifas_viaticos DROP CONSTRAINT IF EXISTS fk_tv_zona;
ALTER TABLE IF EXISTS ONLY viaticos.tramite_comisiones DROP CONSTRAINT IF EXISTS fk_tc_tramite;
ALTER TABLE IF EXISTS ONLY viaticos.tramite_comisiones DROP CONSTRAINT IF EXISTS fk_tc_memo;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS fk_firma_fija;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS fk_dv_municipio;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS fk_dv_memo;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS fk_dv_firma;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS fk_dv_estado;
ALTER TABLE IF EXISTS ONLY viaticos.comisiones DROP CONSTRAINT IF EXISTS fk_com_municipio;
ALTER TABLE IF EXISTS ONLY viaticos.comisiones DROP CONSTRAINT IF EXISTS fk_com_empleado;
ALTER TABLE IF EXISTS ONLY viaticos.categorias_del_empleado DROP CONSTRAINT IF EXISTS fk_categoria_puesto;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_por_area DROP CONSTRAINT IF EXISTS firmas_por_area_id_firma_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_por_area DROP CONSTRAINT IF EXISTS firmas_por_area_id_area_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_adicionales_empleado DROP CONSTRAINT IF EXISTS firmas_adicionales_empleado_id_firma_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_adicionales_empleado DROP CONSTRAINT IF EXISTS firmas_adicionales_empleado_id_empleado_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.cuentas_bancarias DROP CONSTRAINT IF EXISTS cuentas_bancarias_id_empleado_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.cuentas_bancarias DROP CONSTRAINT IF EXISTS cuentas_bancarias_id_banco_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.actividades DROP CONSTRAINT IF EXISTS actividades_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY viaticos.actividades DROP CONSTRAINT IF EXISTS actividades_id_municipio_fkey;
DROP INDEX IF EXISTS public.idx_gastos_globales_memorandum;
ALTER TABLE IF EXISTS ONLY viaticos.zonas_viaticos DROP CONSTRAINT IF EXISTS zonas_viaticos_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.zonas_viaticos DROP CONSTRAINT IF EXISTS zonas_viaticos_codigo_zona_key;
ALTER TABLE IF EXISTS ONLY viaticos.zonas_municipios DROP CONSTRAINT IF EXISTS zonas_municipios_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.tramite_comisiones DROP CONSTRAINT IF EXISTS unique_tramite_memo;
ALTER TABLE IF EXISTS ONLY viaticos.gastos_globales_memorandum DROP CONSTRAINT IF EXISTS unique_memorandum_gastos;
ALTER TABLE IF EXISTS ONLY viaticos.tramites DROP CONSTRAINT IF EXISTS tramites_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.tramite_comisiones DROP CONSTRAINT IF EXISTS tramite_comisiones_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.tarifas_viaticos DROP CONSTRAINT IF EXISTS tarifas_viaticos_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.memorandum_comision DROP CONSTRAINT IF EXISTS memorandum_comision_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.gastos_globales_memorandum DROP CONSTRAINT IF EXISTS gastos_globales_memorandum_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_por_area DROP CONSTRAINT IF EXISTS firmas_por_area_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas DROP CONSTRAINT IF EXISTS firmas_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.firmas_adicionales_empleado DROP CONSTRAINT IF EXISTS firmas_adicionales_empleado_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.estados_federacion DROP CONSTRAINT IF EXISTS estados_federacion_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.estados_federacion DROP CONSTRAINT IF EXISTS estados_federacion_clave_estado_key;
ALTER TABLE IF EXISTS ONLY viaticos.detalles_viaticos DROP CONSTRAINT IF EXISTS detalles_viaticos_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.cuentas_bancarias DROP CONSTRAINT IF EXISTS cuentas_bancarias_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.comisiones DROP CONSTRAINT IF EXISTS comisiones_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.categorias DROP CONSTRAINT IF EXISTS categorias_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.categorias_del_empleado DROP CONSTRAINT IF EXISTS categorias_del_empleado_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.cat_bancos DROP CONSTRAINT IF EXISTS cat_bancos_pkey;
ALTER TABLE IF EXISTS ONLY viaticos.actividades DROP CONSTRAINT IF EXISTS actividades_pkey;
ALTER TABLE IF EXISTS viaticos.tramites ALTER COLUMN id_tramite DROP DEFAULT;
ALTER TABLE IF EXISTS viaticos.tramite_comisiones ALTER COLUMN id_tramite_comision DROP DEFAULT;
ALTER TABLE IF EXISTS viaticos.gastos_globales_memorandum ALTER COLUMN id_gasto_global DROP DEFAULT;
ALTER TABLE IF EXISTS viaticos.cuentas_bancarias ALTER COLUMN id_cuenta_bancaria DROP DEFAULT;
ALTER TABLE IF EXISTS viaticos.categorias ALTER COLUMN id_categoria DROP DEFAULT;
ALTER TABLE IF EXISTS viaticos.cat_bancos ALTER COLUMN id_banco DROP DEFAULT;
DROP TABLE IF EXISTS viaticos.zonas_viaticos;
DROP TABLE IF EXISTS viaticos.zonas_municipios;
DROP SEQUENCE IF EXISTS viaticos.tramites_id_tramite_seq;
DROP TABLE IF EXISTS viaticos.tramites;
DROP SEQUENCE IF EXISTS viaticos.tramite_comisiones_id_tramite_comision_seq;
DROP TABLE IF EXISTS viaticos.tramite_comisiones;
DROP TABLE IF EXISTS viaticos.tarifas_viaticos;
DROP TABLE IF EXISTS viaticos.memorandum_comision;
DROP SEQUENCE IF EXISTS viaticos.gastos_globales_memorandum_id_gasto_global_seq;
DROP TABLE IF EXISTS viaticos.gastos_globales_memorandum;
DROP TABLE IF EXISTS viaticos.firmas_por_area;
DROP TABLE IF EXISTS viaticos.firmas_adicionales_empleado;
DROP TABLE IF EXISTS viaticos.firmas;
DROP TABLE IF EXISTS viaticos.estados_federacion;
DROP TABLE IF EXISTS viaticos.detalles_viaticos;
DROP SEQUENCE IF EXISTS viaticos.cuentas_bancarias_id_cuenta_bancaria_seq;
DROP TABLE IF EXISTS viaticos.cuentas_bancarias;
DROP TABLE IF EXISTS viaticos.comisiones;
DROP SEQUENCE IF EXISTS viaticos.categorias_id_categoria_seq;
DROP TABLE IF EXISTS viaticos.categorias_del_empleado;
DROP TABLE IF EXISTS viaticos.categorias;
DROP SEQUENCE IF EXISTS viaticos.cat_bancos_id_banco_seq;
DROP TABLE IF EXISTS viaticos.cat_bancos;
DROP TABLE IF EXISTS viaticos.actividades;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actividades; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.actividades (
    id_actividad integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    tipo_lugar text NOT NULL,
    lugar text NOT NULL,
    id_municipio integer,
    direccion text NOT NULL,
    motivo text NOT NULL,
    tipo text NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    esta_borrado boolean DEFAULT false NOT NULL,
    no_evento text,
    nombre_evento text,
    CONSTRAINT actividades_tipo_check CHECK ((tipo = ANY (ARRAY['administrativo'::text, 'evento'::text]))),
    CONSTRAINT actividades_tipo_lugar_check CHECK ((tipo_lugar = ANY (ARRAY['pais'::text, 'estado'::text, 'municipio'::text])))
);


--
-- Name: COLUMN actividades.id_actividad; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.id_actividad IS 'ID único de la actividad';


--
-- Name: COLUMN actividades.id_usuario; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.id_usuario IS 'Usuario que registra la actividad';


--
-- Name: COLUMN actividades.fecha; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.fecha IS 'Fecha de la actividad';


--
-- Name: COLUMN actividades.hora; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.hora IS 'Hora de la actividad';


--
-- Name: COLUMN actividades.tipo_lugar; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.tipo_lugar IS 'Tipo de lugar: pais, estado, municipio';


--
-- Name: COLUMN actividades.lugar; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.lugar IS 'Nombre del lugar (país, estado o ID municipio)';


--
-- Name: COLUMN actividades.id_municipio; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.id_municipio IS 'ID del municipio (solo si tipo_lugar = municipio)';


--
-- Name: COLUMN actividades.direccion; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.direccion IS 'Dirección específica del lugar';


--
-- Name: COLUMN actividades.motivo; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.motivo IS 'Motivo de la actividad';


--
-- Name: COLUMN actividades.tipo; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.tipo IS 'Tipo: administrativo o evento';


--
-- Name: COLUMN actividades.fecha_creacion; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.fecha_creacion IS 'Fecha de registro';


--
-- Name: COLUMN actividades.esta_borrado; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.actividades.esta_borrado IS 'Borrado lógico';


--
-- Name: actividades_id_actividad_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.actividades ALTER COLUMN id_actividad ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME viaticos.actividades_id_actividad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cat_bancos; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.cat_bancos (
    id_banco integer NOT NULL,
    nombre_banco character varying(255) NOT NULL,
    esta_borrado boolean DEFAULT false
);


--
-- Name: cat_bancos_id_banco_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.cat_bancos_id_banco_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cat_bancos_id_banco_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.cat_bancos_id_banco_seq OWNED BY viaticos.cat_bancos.id_banco;


--
-- Name: categorias; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.categorias (
    id_categoria integer NOT NULL,
    puesto character varying(255) NOT NULL,
    esta_borrado boolean DEFAULT false,
    id_puesto_vinculado integer
);


--
-- Name: categorias_del_empleado; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.categorias_del_empleado (
    id_categoria_del_empleado integer NOT NULL,
    clave_categoria integer NOT NULL,
    literal text NOT NULL,
    puesto_texto_anterior text,
    esta_borrado boolean DEFAULT false NOT NULL,
    literal_viatico text,
    categoria integer,
    id_puesto integer
);


--
-- Name: categorias_del_empleado_id_categoria_del_empleado_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.categorias_del_empleado ALTER COLUMN id_categoria_del_empleado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.categorias_del_empleado_id_categoria_del_empleado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.categorias_id_categoria_seq OWNED BY viaticos.categorias.id_categoria;


--
-- Name: comisiones; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.comisiones (
    id_comision integer NOT NULL,
    id_empleado integer NOT NULL,
    id_municipio_destino integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    dias integer NOT NULL,
    monto_total numeric(12,2)
);


--
-- Name: comisiones_id_comision_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.comisiones ALTER COLUMN id_comision ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.comisiones_id_comision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cuentas_bancarias; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.cuentas_bancarias (
    id_cuenta_bancaria integer NOT NULL,
    id_empleado integer,
    id_banco integer,
    cuenta character varying(50),
    clabe character varying(50),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    esta_borrado boolean DEFAULT false
);


--
-- Name: cuentas_bancarias_id_cuenta_bancaria_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.cuentas_bancarias_id_cuenta_bancaria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cuentas_bancarias_id_cuenta_bancaria_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.cuentas_bancarias_id_cuenta_bancaria_seq OWNED BY viaticos.cuentas_bancarias.id_cuenta_bancaria;


--
-- Name: detalles_viaticos; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.detalles_viaticos (
    id_detalle_viatico integer NOT NULL,
    id_memorandum_comision integer NOT NULL,
    id_municipio integer,
    id_estado integer,
    id_pais integer,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    dias numeric(5,2) DEFAULT 1.00 NOT NULL,
    pernocta boolean DEFAULT false NOT NULL,
    monto_calculado numeric(10,2) DEFAULT 0.00 NOT NULL,
    pasaje numeric(10,2) DEFAULT 0.00,
    combustible numeric(10,2) DEFAULT 0.00,
    otros numeric(10,2) DEFAULT 0.00,
    tipo_pago text NOT NULL,
    id_firma_autoriza integer NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_firma_fija integer DEFAULT 15 NOT NULL,
    folio_comision character varying(50)
);


--
-- Name: detalles_viaticos_id_detalle_viatico_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.detalles_viaticos ALTER COLUMN id_detalle_viatico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.detalles_viaticos_id_detalle_viatico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estados_federacion; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.estados_federacion (
    id_estado integer NOT NULL,
    clave_estado text NOT NULL,
    nombre_estado text NOT NULL,
    esta_borrado boolean DEFAULT false NOT NULL
);


--
-- Name: estados_federacion_id_estado_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.estados_federacion ALTER COLUMN id_estado ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.estados_federacion_id_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: firmas; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.firmas (
    id_firma integer NOT NULL,
    nombre_firma text NOT NULL,
    cargo_firma text NOT NULL,
    descripcion text,
    esta_borrado boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN firmas.id_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas.id_firma IS 'ID único de la firma';


--
-- Name: COLUMN firmas.nombre_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas.nombre_firma IS 'Nombre de quien firma';


--
-- Name: COLUMN firmas.cargo_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas.cargo_firma IS 'Cargo de quien firma';


--
-- Name: COLUMN firmas.descripcion; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas.descripcion IS 'Descripción adicional';


--
-- Name: firmas_adicionales_empleado; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.firmas_adicionales_empleado (
    id integer NOT NULL,
    id_empleado integer NOT NULL,
    id_firma integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    esta_borrado boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN firmas_adicionales_empleado.id; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_adicionales_empleado.id IS 'ID único';


--
-- Name: COLUMN firmas_adicionales_empleado.id_empleado; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_adicionales_empleado.id_empleado IS 'Empleado al que se asigna la firma adicional';


--
-- Name: COLUMN firmas_adicionales_empleado.id_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_adicionales_empleado.id_firma IS 'Firma adicional asignada';


--
-- Name: COLUMN firmas_adicionales_empleado.fecha_asignacion; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_adicionales_empleado.fecha_asignacion IS 'Fecha de asignación';


--
-- Name: COLUMN firmas_adicionales_empleado.esta_borrado; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_adicionales_empleado.esta_borrado IS 'Borrado lógico';


--
-- Name: firmas_adicionales_empleado_id_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.firmas_adicionales_empleado ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME viaticos.firmas_adicionales_empleado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: firmas_id_firma_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.firmas ALTER COLUMN id_firma ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME viaticos.firmas_id_firma_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: firmas_por_area; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.firmas_por_area (
    id_firma_area integer NOT NULL,
    id_area integer NOT NULL,
    id_firma integer NOT NULL,
    esta_borrado boolean DEFAULT false NOT NULL
);


--
-- Name: COLUMN firmas_por_area.id_firma_area; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_por_area.id_firma_area IS 'ID único';


--
-- Name: COLUMN firmas_por_area.id_area; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_por_area.id_area IS 'Área que usa esta firma';


--
-- Name: COLUMN firmas_por_area.id_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.firmas_por_area.id_firma IS 'Firma asignada al área';


--
-- Name: firmas_por_area_id_firma_area_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.firmas_por_area ALTER COLUMN id_firma_area ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME viaticos.firmas_por_area_id_firma_area_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: gastos_globales_memorandum; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.gastos_globales_memorandum (
    id_gasto_global integer NOT NULL,
    id_memorandum_comision integer NOT NULL,
    pasaje numeric(10,2) DEFAULT 0,
    combustible numeric(10,2) DEFAULT 0,
    otros numeric(10,2) DEFAULT 0,
    tipo_pago character varying(20),
    fecha_creacion timestamp without time zone DEFAULT now(),
    esta_borrado boolean DEFAULT false
);


--
-- Name: TABLE gastos_globales_memorandum; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON TABLE viaticos.gastos_globales_memorandum IS 'Gastos globales que se aplican a todos los viáticos de un memorandum';


--
-- Name: COLUMN gastos_globales_memorandum.id_memorandum_comision; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.gastos_globales_memorandum.id_memorandum_comision IS 'Referencia al memorandum (único por memorandum)';


--
-- Name: gastos_globales_memorandum_id_gasto_global_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.gastos_globales_memorandum_id_gasto_global_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gastos_globales_memorandum_id_gasto_global_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.gastos_globales_memorandum_id_gasto_global_seq OWNED BY viaticos.gastos_globales_memorandum.id_gasto_global;


--
-- Name: memorandum_comision; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.memorandum_comision (
    id_memorandum_comision integer NOT NULL,
    folio character varying(50),
    id_actividad integer NOT NULL,
    id_empleado integer NOT NULL,
    periodo_inicio date NOT NULL,
    periodo_fin date NOT NULL,
    tipo_transporte text NOT NULL,
    id_firma integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    esta_borrado boolean DEFAULT false NOT NULL,
    observaciones text,
    id_vehiculo integer,
    CONSTRAINT memorandum_comision_tipo_transporte_check CHECK ((tipo_transporte = ANY (ARRAY['publico'::text, 'oficial'::text, 'aereo'::text])))
);


--
-- Name: COLUMN memorandum_comision.id_memorandum_comision; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.id_memorandum_comision IS 'ID único';


--
-- Name: COLUMN memorandum_comision.folio; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.folio IS 'Folio personalizado por Área';


--
-- Name: COLUMN memorandum_comision.id_actividad; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.id_actividad IS 'Actividad relacionada';


--
-- Name: COLUMN memorandum_comision.id_empleado; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.id_empleado IS 'Empleado comisionado';


--
-- Name: COLUMN memorandum_comision.periodo_inicio; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.periodo_inicio IS 'Fecha inicio del período';


--
-- Name: COLUMN memorandum_comision.periodo_fin; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.periodo_fin IS 'Fecha fin del período';


--
-- Name: COLUMN memorandum_comision.tipo_transporte; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.tipo_transporte IS 'Tipo: publico, oficial, aereo';


--
-- Name: COLUMN memorandum_comision.id_firma; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.id_firma IS 'Firma del jefe de área';


--
-- Name: COLUMN memorandum_comision.observaciones; Type: COMMENT; Schema: viaticos; Owner: -
--

COMMENT ON COLUMN viaticos.memorandum_comision.observaciones IS 'Observaciones adicionales del memorandum/comisión';


--
-- Name: memorandum_comision_id_memorandum_comision_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.memorandum_comision ALTER COLUMN id_memorandum_comision ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME viaticos.memorandum_comision_id_memorandum_comision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tarifas_viaticos; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.tarifas_viaticos (
    id_tarifa integer NOT NULL,
    nivel_aplicacion text NOT NULL,
    id_zona integer NOT NULL,
    monto_diario numeric(10,2) NOT NULL,
    vigente_desde date NOT NULL,
    vigente_hasta date,
    esta_borrado boolean DEFAULT false NOT NULL,
    tipo_dia text DEFAULT '24+'::text NOT NULL
);


--
-- Name: tarifas_viaticos_id_tarifa_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.tarifas_viaticos ALTER COLUMN id_tarifa ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.tarifas_viaticos_id_tarifa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tramite_comisiones; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.tramite_comisiones (
    id_tramite_comision integer NOT NULL,
    id_tramite integer NOT NULL,
    id_memorandum_comision integer NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: tramite_comisiones_id_tramite_comision_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.tramite_comisiones_id_tramite_comision_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tramite_comisiones_id_tramite_comision_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.tramite_comisiones_id_tramite_comision_seq OWNED BY viaticos.tramite_comisiones.id_tramite_comision;


--
-- Name: tramites; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.tramites (
    id_tramite integer NOT NULL,
    folio character varying(50),
    fecha date NOT NULL,
    observaciones text,
    enviado boolean DEFAULT false,
    id_usuario integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    esta_borrado boolean DEFAULT false,
    id_firma integer,
    importe numeric(10,2) DEFAULT 0
);


--
-- Name: tramites_id_tramite_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

CREATE SEQUENCE viaticos.tramites_id_tramite_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tramites_id_tramite_seq; Type: SEQUENCE OWNED BY; Schema: viaticos; Owner: -
--

ALTER SEQUENCE viaticos.tramites_id_tramite_seq OWNED BY viaticos.tramites.id_tramite;


--
-- Name: zonas_municipios; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.zonas_municipios (
    id_zona integer NOT NULL,
    id_municipio integer NOT NULL
);


--
-- Name: zonas_viaticos; Type: TABLE; Schema: viaticos; Owner: -
--

CREATE TABLE viaticos.zonas_viaticos (
    id_zona integer NOT NULL,
    codigo_zona text NOT NULL,
    nombre_zona text NOT NULL,
    esta_borrado boolean DEFAULT false NOT NULL
);


--
-- Name: zonas_viaticos_id_zona_seq; Type: SEQUENCE; Schema: viaticos; Owner: -
--

ALTER TABLE viaticos.zonas_viaticos ALTER COLUMN id_zona ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME viaticos.zonas_viaticos_id_zona_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cat_bancos id_banco; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cat_bancos ALTER COLUMN id_banco SET DEFAULT nextval('viaticos.cat_bancos_id_banco_seq'::regclass);


--
-- Name: categorias id_categoria; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('viaticos.categorias_id_categoria_seq'::regclass);


--
-- Name: cuentas_bancarias id_cuenta_bancaria; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cuentas_bancarias ALTER COLUMN id_cuenta_bancaria SET DEFAULT nextval('viaticos.cuentas_bancarias_id_cuenta_bancaria_seq'::regclass);


--
-- Name: gastos_globales_memorandum id_gasto_global; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.gastos_globales_memorandum ALTER COLUMN id_gasto_global SET DEFAULT nextval('viaticos.gastos_globales_memorandum_id_gasto_global_seq'::regclass);


--
-- Name: tramite_comisiones id_tramite_comision; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramite_comisiones ALTER COLUMN id_tramite_comision SET DEFAULT nextval('viaticos.tramite_comisiones_id_tramite_comision_seq'::regclass);


--
-- Name: tramites id_tramite; Type: DEFAULT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramites ALTER COLUMN id_tramite SET DEFAULT nextval('viaticos.tramites_id_tramite_seq'::regclass);


--
-- Data for Name: actividades; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.actividades (id_actividad, id_usuario, fecha, hora, tipo_lugar, lugar, id_municipio, direccion, motivo, tipo, fecha_creacion, esta_borrado, no_evento, nombre_evento) FROM stdin;
1	2	2026-03-01	13:57:00	municipio	1	1	sancristobal	prueba de estrucutura	evento	2026-03-03 13:57:55.647098	t	12	ok
2	2	2026-03-01	14:15:00	municipio	1	1	esto es una prueba 	ok 	administrativo	2026-03-04 14:15:59.08829	t		
3	2	2026-03-02	11:17:00	municipio	11	11	Av. Principal #123, Centro	prueba de fechas 	evento	2026-03-10 11:19:38.176766	t	23	inauguración de las fechas 
4	2	2026-03-01	11:44:00	municipio	2	2	Av. Principal #123, Centro	prueba de eliminación 	administrativo	2026-03-10 11:45:40.647553	t		
5	2	2026-03-02	12:05:00	municipio	1	1	Av. Principal #123, Centro	campo de motivo 	evento	2026-03-11 12:06:26.869566	f	12	evento de actividad 
6	2	2026-03-02	16:52:00	municipio	12	12	kkkk	kkkkk	evento	2026-03-12 16:52:42.215356	f	9	ok
\.


--
-- Data for Name: cat_bancos; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.cat_bancos (id_banco, nombre_banco, esta_borrado) FROM stdin;
1	BANCOPPEL	f
2	BBVA MEXICO	f
3	BANAMEX	f
4	SCOTIABANK INVERLAT	f
5	BANOBRAS	f
6	HSBC MEXICO S.A.	f
7	SANTANDER SERFIN	f
8	BANCO AZTECA	f
9	BANORTE	f
10	BANJERCITO	f
11	BANCO INBURSA	f
\.


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.categorias (id_categoria, puesto, esta_borrado, id_puesto_vinculado) FROM stdin;
1	MANDO SUPERIOR	f	\N
2	MANDO MEDIO SUPERIOR	f	\N
3	MANDO MEDIO	f	\N
4	ENLACE	f	\N
5	MANDO OPERATIVO	f	\N
6	ESPECIALISTA	f	\N
7	ANALISTA	f	\N
9	AUXILIAR ADMINISTRATIVO	f	\N
10	AUXILIAR DE SEGURIDAD	f	\N
12	AUXILIAR DE SERVICIOS	f	\N
8	TÉCNICO	f	\N
11	TÉCNICO AUXILIAR	f	\N
\.


--
-- Data for Name: categorias_del_empleado; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.categorias_del_empleado (id_categoria_del_empleado, clave_categoria, literal, puesto_texto_anterior, esta_borrado, literal_viatico, categoria, id_puesto) FROM stdin;
81	110101		SECRETARIO DEL ESTADO EQUIVALENTE	f	A	1	1
24	160404	D	ANALISTA TÉCNICO ESPECIALIZADO	f	D	4	51
2	160301	A		f	\N	3	\N
3	160302	B		f	\N	3	\N
4	160302	B		f	\N	3	\N
60	160804	D	TECNICO MEDIO B	f	E	8	120
82	110804	D	TECNICO MEDIO B	f	E	8	120
1	160201	A	DIRECTOR GENERAL Y/O COORDINADOR O EQUIVALENTE	f	\N	2	2
21	160606	F	PILOTO	f	\N	6	48
83	110903	C	\N	f	D	9	143
84	110101		\N	f	A	1	1
85	110201		\N	f	A	2	2
86	110101		\N	f	B	1	3
87	110201		\N	f	B	2	4
88	110201		\N	f	B	2	5
89	110201		\N	f	B	2	6
90	110201		\N	f	B	2	7
91	110301		\N	f	A	3	\N
92	110302		\N	f	B	3	8
93	110303		\N	f	C	3	\N
94	110304		\N	f	D	3	\N
95	110305		\N	f	E	3	9
96	110305		\N	f	E	3	10
97	110305		\N	f	E	3	11
98	110306		\N	f	F	3	12
99	110401		\N	f	A	4	13
100	110402		\N	f	B	4	14
101	110402		\N	f	B	4	15
102	110402		\N	f	B	4	16
5	160303	C		f	\N	3	\N
6	160304	D		f	\N	3	\N
103	110402		\N	f	B	4	17
104	110402		\N	f	B	4	18
8	160305	E	DIRECTOR DE ESCUELA	f	C	3	\N
105	110402		\N	f	B	4	19
14	160404	D	COORDINADOR ACADEMICO	f	\N	4	\N
23	160403	C		f	\N	4	\N
106	110402		\N	f	B	4	20
107	110404		\N	f	D	4	21
13	160402	B	COMISARIO PÚBLICO	f	C	4	\N
15	160406	F		f	C	4	\N
108	110404		\N	f	D	4	22
109	110404		\N	f	D	4	23
110	110404		\N	f	D	4	24
111	110404		\N	f	D	4	25
25	160501	A	OFICIAL DEL REGISTRO CIVIL Y/O SUBDIRECTOR ADMINISTRATIVO	f	\N	5	\N
112	110404		\N	f	D	4	26
113	110404		\N	f	D	4	27
114	110404		\N	f	D	4	28
115	110405		\N	f	E	4	\N
77	161102	B		f	\N	12	\N
116	110406		\N	f	F	4	29
117	110501		\N	f	A	5	30
118	110505		\N	f	E	5	31
119	110506		\N	f	F	5	32
7	160305	E	DIRECTOR	f	C	3	9
9	160305	E	JEFE DE UNIDAD	f	C	3	10
11	160401	A	ASESOR A	f	C	4	13
12	160402	B	SECRETARIO PARTICULAR	f	C	4	14
10	160306	F	DELEGADO ADMINISTRATIVO	f	\N	3	32
16	160507	G	JEFE DE DEPARTAMENTO	f	\N	5	36
18	160507	G	COORDINADOR OPERATIVO	f	\N	5	37
17	160507	G	DELEGADO	f	\N	5	38
19	160507	G	COMANDANTE OPERATIVO	f	\N	5	40
46	161004	D	COORDINADOR DE GRUPO	f	\N	10	78
20	160605	E	MECÁNICO DE AERONAVE	f	\N	6	98
22	160701	A	COORDINADOR ADMINISTRATIVO (DELEGACIÓN)	f	E	7	104
74	160907	G	SECRETARIA EJECUTIVA DE MANDO SUPERIOR	f	\N	9	145
75	161101	A	AYUDANTE	f	\N	12	156
76	161101	A	JARDINERO ESPECIALIZADO	f	\N	12	159
78	161102	B	CHOFER DE APOYO	f	\N	12	160
80	161103	C	CHOFER DE MANDO MEDIO	f	\N	12	162
79	161103	C	CHOFER DE MANDO SUPERIOR	f	\N	12	163
120	110506		\N	f	F	5	33
121	110506		\N	f	F	5	34
122	110507		\N	f	G	5	35
123	110507		\N	f	G	5	36
124	110507		\N	f	G	5	37
125	110507		\N	f	G	5	38
126	110507		\N	f	G	5	39
127	110507		\N	f	G	5	40
128	110507		\N	f	G	5	41
129	110507		\N	f	G	5	42
130	110507		\N	f	G	5	34
131	110508		\N	f	H	5	\N
132	110509		\N	f	I	5	164
133	110510		\N	f	J	5	165
134	110510		\N	f	J	5	45
135	110604		\N	f	D	6	46
136	110610		\N	f	J	6	47
137	110611		\N	f	K	6	48
138	110612		\N	f	L	6	49
139	110613		\N	f	M	6	\N
140	110614		\N	f	N	6	50
141	110301		\N	f	A	3	\N
142	110302		\N	f	B	3	8
143	110303		\N	f	C	3	\N
144	110304		\N	f	D	3	\N
145	110305		\N	f	E	3	9
146	110305		\N	f	E	3	10
147	110305		\N	f	E	3	11
148	110306		\N	f	F	3	12
149	110401		\N	f	A	4	13
150	110402		\N	f	B	4	14
151	110402		\N	f	B	4	15
152	110402		\N	f	B	4	16
153	110402		\N	f	B	4	17
154	110402		\N	f	B	4	18
155	110402		\N	f	B	4	19
156	110402		\N	f	B	4	20
157	110404		\N	f	D	4	21
158	110404		\N	f	D	4	22
30	160506	F	JEFE DE OFICINA	f	\N	5	53
32	160507	G	JEFE DE ÁREA	f	C	5	54
33	160602	B	DIRECTOR MÚSICO	f	\N	6	57
28	160504	D	SUPERVISOR DE OBRA	f	\N	5	58
36	160703	C	SUBCOMANDANTE DE REGIÓN	f	\N	7	64
26	160502	B		f	\N	5	\N
39	160706	F	JEFE DE SECCIÓN	f	\N	7	67
40	160707	G	ANALISTA TÉCNICO B	f	\N	7	72
44	161003	C	SUPERVISOR	f	\N	9	75
45	161003	C	SEGUNDO OFICIAL Y/O POLICIA PRIMERO	f	\N	10	77
50	160605	E	PROMOTOR DEPORTIVO	f	\N	6	87
48	160603	C	CAPTURISTA	f	\N	6	90
51	160605	E	ANALISTA PROGRAMADOR	f	\N	6	93
57	160801	A	OPERADOR	f	\N	8	110
63	160805	E	TÉCNICO ESPECIALIZADO	f	\N	8	123
65	160901	A	AUXILIAR ADMINISTRATIVO	f	\N	9	129
66	160902	B	SECRETARIA EJECUTIVA DE APOYO	f	\N	9	135
67	160903	C	GESTOR ADMINISTRATIVO	f	\N	9	140
68	160903	C	SECRETARIA EJECUTIVA DE MANDO MEDIO	f	\N	9	141
69	160903	C	CAJERA	f	\N	9	142
34	160607	G	PRGRAMADOR	f	\N	6	93
53	160702	B	PROFESIONALISTA A	f	\N	7	106
54	160703	C	PROFESIONALISTA B	f	\N	7	107
55	160704	D	PROFESIONALISTA C	f	\N	7	109
59	160802	B	TECNICO MEDIO A	f	\N	8	113
62	160805	E	TECNICO MEDIO C	f	\N	8	122
64	160806	F	TÉCNICO	f	\N	8	123
31	160507	G	AGENTE DEL MINISTRO PÚBLICO	f	\N	5	55
56	160706	F	AGENTE DEL MINISTRO PÚBLICO AUXILIAR	f	\N	7	56
52	160702	B	OFICIAL SECRETARIO DEL MINISTERIO PUBLICO	f	\N	7	57
58	160801	A	MECÁNICO	f	E	8	110
70	110903	C	AUXILIAR CONTABLE	f	E	9	143
61	160803	C	DIBUJANTE	f	E	8	118
27	160503	C		f	\N	5	\N
29	160505	E		f	\N	5	\N
49	160604	D		f	E	6	\N
47	160601	A	NOTIFICADOR Y EJECUTADOR	f	\N	6	\N
35	160703	C	JEFE DE OPERECIÓN	f	\N	7	\N
37	160704	D		f	\N	7	\N
38	160705	E		f	\N	7	\N
71	160904	D		f	\N	9	\N
72	160905	E		f	\N	9	\N
73	160906	F		f	\N	9	\N
41	161000			f	D	10	\N
42	161001	A	JEFE DE OPERECIÓN	f	D	10	\N
43	161002	B		f	\N	10	\N
159	110404		\N	f	D	4	23
160	110404		\N	f	D	4	24
161	110404		\N	f	D	4	25
162	110404		\N	f	D	4	26
163	110404		\N	f	D	4	27
164	110404		\N	f	D	4	28
165	110405		\N	f	E	4	\N
166	110406		\N	f	F	4	29
167	110501		\N	f	A	5	30
168	110505		\N	f	E	5	31
169	110506		\N	f	F	5	32
170	110506		\N	f	F	5	33
171	110506		\N	f	F	5	34
172	110507		\N	f	G	5	35
173	110507		\N	f	G	5	36
174	110507		\N	f	G	5	37
175	110507		\N	f	G	5	38
176	110507		\N	f	G	5	39
177	110507		\N	f	G	5	40
178	110507		\N	f	G	5	41
179	110507		\N	f	G	5	42
180	110507		\N	f	G	5	34
181	110508		\N	f	H	5	\N
182	110509		\N	f	I	5	164
183	110510		\N	f	J	5	165
184	110510		\N	f	J	5	45
185	110604		\N	f	D	6	46
186	110610		\N	f	J	6	47
187	110611		\N	f	K	6	48
188	110612		\N	f	L	6	49
189	110613		\N	f	M	6	\N
190	110614		\N	f	N	6	50
191	110601		\N	f	E	6	81
192	110601		\N	f	E	6	82
193	110602		\N	f	E	6	83
194	110602		\N	f	E	6	84
195	110602		\N	f	E	6	85
196	110603		\N	f	D	6	86
197	110603		\N	f	D	6	87
198	110603		\N	f	D	6	88
199	110603		\N	f	D	6	89
200	110603		\N	f	D	6	90
201	110604		\N	f	D	6	91
202	110604		\N	f	D	6	92
203	110605		\N	f	E	6	93
204	110605		\N	f	E	6	94
205	110605		\N	f	E	6	95
206	110605		\N	f	E	6	96
207	110605		\N	f	E	6	97
208	110605		\N	f	F	6	98
209	110606		\N	f	F	6	99
210	110607		\N	f	G	6	100
211	110607		\N	f	G	6	101
212	110608		\N	f	H	6	\N
213	110609		\N	f	I	6	102
214	110611		\N	f	K	6	103
215	110701		\N	f	A	7	104
216	110702		\N	f	B	7	105
217	110702		\N	f	B	7	106
218	110703		\N	f	C	7	107
219	110704		\N	f	D	7	108
220	110704		\N	f	D	7	109
221	110801		\N	f	A	8	110
222	110801		\N	f	A	8	111
223	110802		\N	f	B	8	112
224	110802		\N	f	B	8	113
225	110802		\N	f	B	8	114
226	110802		\N	f	B	8	115
227	110803		\N	f	C	8	116
228	110803		\N	f	C	8	117
229	110803		\N	f	C	8	118
230	110804		\N	f	D	8	119
231	110804		\N	f	D	8	120
232	110805		\N	f	E	8	121
233	110805		\N	f	E	8	122
234	110805		\N	f	E	8	123
235	110806		\N	f	F	8	\N
236	110807		\N	f	G	8	\N
237	110808		\N	f	H	8	124
238	110901		\N	f	A	9	125
239	110901		\N	f	A	9	126
240	110901		\N	f	A	9	127
241	110901		\N	f	A	9	128
242	110901		\N	f	A	9	129
243	110901		\N	f	A	9	130
244	110901		\N	f	A	9	131
245	110901		\N	f	A	9	132
246	110902		\N	f	B	9	133
247	110902		\N	f	B	9	134
248	110902		\N	f	B	9	135
249	110902		\N	f	B	9	136
250	110902		\N	f	B	9	137
251	110903		\N	f	C	9	138
252	110903		\N	f	C	9	139
253	110903		\N	f	C	9	140
254	110903		\N	f	C	9	141
255	110903		\N	f	C	9	142
256	110903		\N	f	C	9	143
257	110904		\N	f	D	9	\N
258	110905		\N	f	E	9	\N
259	110906		\N	f	F	9	\N
260	110907		\N	f	G	9	144
261	110907		\N	f	G	9	145
262	111002		\N	f	B	10	146
263	111002		\N	f	B	10	147
264	111101		\N	f	A	11	148
265	111101		\N	f	A	11	149
266	111101		\N	f	A	11	150
267	111101		\N	f	A	11	151
268	111101		\N	f	A	11	152
269	111101		\N	f	A	11	153
270	111102		\N	f	B	11	154
271	111103		\N	f	C	11	155
272	111201		\N	f	A	12	156
273	111201		\N	f	A	12	157
274	111201		\N	f	A	12	158
275	111201		\N	f	A	12	159
276	111202		\N	f	B	12	160
277	111202		\N	f	B	12	161
278	111203		\N	f	C	12	162
279	111203		\N	f	C	12	163
280	110404		\N	f	D	4	51
\.


--
-- Data for Name: comisiones; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.comisiones (id_comision, id_empleado, id_municipio_destino, fecha_inicio, fecha_fin, dias, monto_total) FROM stdin;
\.


--
-- Data for Name: cuentas_bancarias; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.cuentas_bancarias (id_cuenta_bancaria, id_empleado, id_banco, cuenta, clabe, fecha_registro, esta_borrado) FROM stdin;
\.


--
-- Data for Name: detalles_viaticos; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.detalles_viaticos (id_detalle_viatico, id_memorandum_comision, id_municipio, id_estado, id_pais, fecha_inicio, fecha_fin, dias, pernocta, monto_calculado, pasaje, combustible, otros, tipo_pago, id_firma_autoriza, creado_en, id_firma_fija, folio_comision) FROM stdin;
2	4	1	\N	\N	2026-03-02	2026-03-03	1.00	t	1060.00	0.00	0.00	0.00	Efectivo	12	2026-03-04 12:31:17.689466	15	COM-OG/CA/UI/4
4	8	1	\N	\N	2026-03-03	2026-03-04	1.00	t	1060.00	0.00	0.00	0.00	Efectivo	12	2026-03-11 15:33:38.508083	15	COM-OGE/CA/UI/8
8	8	53	\N	\N	2026-03-04	2026-03-06	2.00	t	1768.00	0.00	0.00	0.00	Efectivo	12	2026-03-11 17:58:29.174392	15	COM-OGE/CA/UI/8
9	9	11	\N	\N	2026-03-03	2026-03-06	3.00	t	2652.00	0.00	0.00	0.00	Efectivo	12	2026-03-12 16:54:06.796891	15	COM-OGE/CA/UI/9
\.


--
-- Data for Name: estados_federacion; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.estados_federacion (id_estado, clave_estado, nombre_estado, esta_borrado) FROM stdin;
1	AGU	Aguascalientes	f
2	BCN	Baja California	f
3	BCS	Baja California Sur	f
4	CAM	Campeche	f
5	COA	Coahuila	f
6	COL	Colima	f
7	CHH	Chihuahua	f
8	CDMX	Ciudad de México	f
9	DUR	Durango	f
10	GUA	Guanajuato	f
11	GRO	Guerrero	f
12	HID	Hidalgo	f
13	JAL	Jalisco	f
14	MEX	Estado de México	f
15	MIC	Michoacán	f
16	MOR	Morelos	f
17	NAY	Nayarit	f
18	NLE	Nuevo León	f
19	OAX	Oaxaca	f
20	PUE	Puebla	f
21	QUE	Querétaro	f
22	ROO	Quintana Roo	f
23	SLP	San Luis Potosí	f
24	SIN	Sinaloa	f
25	SON	Sonora	f
26	TAB	Tabasco	f
27	TAM	Tamaulipas	f
28	TLA	Tlaxcala	f
29	VER	Veracruz	f
30	YUC	Yucatán	f
31	ZAC	Zacatecas	f
\.


--
-- Data for Name: firmas; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.firmas (id_firma, nombre_firma, cargo_firma, descripcion, esta_borrado) FROM stdin;
1	Lic. Juan Pérez García	Director General	Firma del Director General	f
2	Ing. María López Hernández	Subdirectora de Administración	Firma de la Subdirectora	f
3	C.P. Carlos Ramírez Torres	Jefe de Recursos Humanos	Firma del Jefe de RH	f
4	Lic. Ana Martínez Silva	Coordinadora de Finanzas	Firma de la Coordinadora	f
5	Juan Carlos Gómez Aranda	Coordinador General de Asesores	Firma del Coordinador de Asesores y Proyectos Estratégicos	f
6	Jorge Alberto Cruz Nájera	Coordinador Ejecutivo de Giras	Firma del Coordinador de Giras, Logística y Protocolo	f
7	Anjuli Acosta Guillén	Coordinadora de Atención Ciudadana	Firma de la Coordinadora de Atención Ciudadana	f
8	Kenia Arroyo Muñiz	Representante en CDMX	Firma de la Representante del Gobierno en Ciudad de México	f
9	José Eduardo Alabath Paniagua	Coordinador Administrativo	Firma del Coordinador Administrativo	f
10	Luis Enrique López Díaz	Responsable de Casa de Gobierno	Firma del Responsable de Casa de Gobierno	f
11	Sergio Alejandro López Matías	Responsable Técnico de Comisionados	Firma del Responsable de Comisionados Externos	f
12	EMMANUEL  CASTELLANOS CORDERO	Jefe de Unidad	Firma de EMMANUEL  CASTELLANOS CORDERO	f
13	WILLIAM NOE LOPEZ MAZA	Jefe de Área	Firma de WILLIAM NOE LOPEZ MAZA	f
14	JAVIER  ABARCA ARIAS	Director	Firma de JAVIER  ABARCA ARIAS	f
15	TEODORO  CORTES ORDOÑEZ	Jefe de Unidad	Firma de TEODORO  CORTES ORDOÑEZ	f
16	ISABEL  SALDAÑA GARCIA	Jefe de Área	Firma de ISABEL  SALDAÑA GARCIA	f
17	CARLOS ALBERTO RODAS ZUÑIGA	Director	Firma de CARLOS ALBERTO RODAS ZUÑIGA	f
18	BENITO IVAN MEJIA ESTRADA	Jefe de Área	Firma de BENITO IVAN MEJIA ESTRADA	f
\.


--
-- Data for Name: firmas_adicionales_empleado; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.firmas_adicionales_empleado (id, id_empleado, id_firma, fecha_asignacion, esta_borrado) FROM stdin;
2	268	12	2026-03-04 10:08:17.028723	f
\.


--
-- Data for Name: firmas_por_area; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.firmas_por_area (id_firma_area, id_area, id_firma, esta_borrado) FROM stdin;
1	1	1	f
2	2	2	f
3	3	3	f
4	4	4	f
5	5	5	f
6	6	6	f
7	12	7	f
8	15	8	f
9	21	9	f
10	28	10	f
11	34	11	f
\.


--
-- Data for Name: gastos_globales_memorandum; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.gastos_globales_memorandum (id_gasto_global, id_memorandum_comision, pasaje, combustible, otros, tipo_pago, fecha_creacion, esta_borrado) FROM stdin;
1	3	100.00	100.00	100.00	Efectivo	2026-03-04 10:12:59.395159	f
2	4	0.00	0.00	100.00	Efectivo	2026-03-04 12:30:46.167545	f
3	7	100.00	0.00	0.00	Efectivo	2026-03-10 11:50:11.022203	t
4	8	100.00	0.00	0.00	Efectivo	2026-03-11 12:07:46.803039	f
\.


--
-- Data for Name: memorandum_comision; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.memorandum_comision (id_memorandum_comision, folio, id_actividad, id_empleado, periodo_inicio, periodo_fin, tipo_transporte, id_firma, fecha_creacion, esta_borrado, observaciones, id_vehiculo) FROM stdin;
4	OG/CA/UI/4	1	268	2026-03-02	2026-03-03	oficial	12	2026-03-04 12:26:19.589836	t	ok	81
3	OG/CA/UI/3	1	194	2026-03-02	2026-03-03	oficial	9	2026-03-04 10:12:42.195858	t	prueba	81
5	OGE/CA/UI/5	2	194	2026-03-02	2026-03-04	oficial	9	2026-03-04 14:17:01.172569	t	ok	81
6	OGE/CA/UI/6	3	268	2026-03-03	2026-03-06	oficial	12	2026-03-10 11:20:53.753265	t	hay que tener en cuenta las fechas del memo para poder selecionar las fechas de comison 	81
7	OGE/CA/UI/7	4	268	2026-03-02	2026-03-06	oficial	12	2026-03-10 11:46:12.055405	t	prueba de elimiancion 	80
8	OGE/CA/UI/8	5	268	2026-03-03	2026-03-06	oficial	12	2026-03-11 12:07:17.969399	f	campo de observaciones 	81
9	OGE/CA/UI/9	6	268	2026-03-02	2026-03-06	oficial	12	2026-03-12 16:53:16.487827	f	ok	69
\.


--
-- Data for Name: tarifas_viaticos; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.tarifas_viaticos (id_tarifa, nivel_aplicacion, id_zona, monto_diario, vigente_desde, vigente_hasta, esta_borrado, tipo_dia) FROM stdin;
2	A	1	2739.00	2021-01-27	\N	f	24+
3	A	2	972.00	2021-01-27	\N	f	8-24
4	A	2	2474.00	2021-01-27	\N	f	24+
5	A	3	884.00	2021-01-27	\N	f	8-24
6	A	3	2297.00	2021-01-27	\N	f	24+
7	A	4	1590.00	2021-01-27	\N	f	8-24
8	A	4	3976.00	2021-01-27	\N	f	24+
9	B	1	795.00	2021-01-27	\N	f	8-24
10	B	1	2032.00	2021-01-27	\N	f	24+
11	B	2	707.00	2021-01-27	\N	f	8-24
12	B	2	1767.00	2021-01-27	\N	f	24+
13	B	3	619.00	2021-01-27	\N	f	8-24
14	B	3	1590.00	2021-01-27	\N	f	24+
15	B	4	1325.00	2021-01-27	\N	f	8-24
16	B	4	3093.00	2021-01-27	\N	f	24+
17	C	1	619.00	2021-01-27	\N	f	8-24
18	C	1	1502.00	2021-01-27	\N	f	24+
19	C	2	530.00	2021-01-27	\N	f	8-24
20	C	2	1307.00	2021-01-27	\N	f	24+
21	C	3	442.00	2021-01-27	\N	f	8-24
22	C	3	1060.00	2021-01-27	\N	f	24+
23	C	4	1149.00	2021-01-27	\N	f	8-24
24	C	4	2209.00	2021-01-27	\N	f	24+
25	D	1	442.00	2021-01-27	\N	f	8-24
26	D	1	1237.00	2021-01-27	\N	f	24+
27	D	2	353.00	2021-01-27	\N	f	8-24
28	D	2	972.00	2021-01-27	\N	f	24+
29	D	3	309.00	2021-01-27	\N	f	8-24
30	D	3	795.00	2021-01-27	\N	f	24+
31	D	4	795.00	2021-01-27	\N	f	8-24
32	D	4	1679.00	2021-01-27	\N	f	24+
33	E	1	398.00	2021-01-27	\N	f	8-24
34	E	1	1060.00	2021-01-27	\N	f	24+
35	E	2	309.00	2021-01-27	\N	f	8-24
36	E	2	884.00	2021-01-27	\N	f	24+
37	E	3	265.00	2021-01-27	\N	f	8-24
38	E	3	663.00	2021-01-27	\N	f	24+
39	E	4	619.00	2021-01-27	\N	f	8-24
40	E	4	1370.00	2021-01-27	\N	f	24+
41	P	1	0.00	2021-01-27	\N	f	8-24
42	P	1	795.00	2021-01-27	\N	f	24+
43	P	2	0.00	2021-01-27	\N	f	8-24
44	P	2	619.00	2021-01-27	\N	f	24+
45	P	3	0.00	2021-01-27	\N	f	8-24
46	P	3	530.00	2021-01-27	\N	f	24+
47	P	4	0.00	2021-01-27	\N	f	8-24
48	P	4	1149.00	2021-01-27	\N	f	24+
49	S	1	0.00	2021-01-27	\N	f	8-24
50	S	1	486.00	2021-01-27	\N	f	24+
51	S	2	0.00	2021-01-27	\N	f	8-24
52	S	2	399.00	2021-01-27	\N	f	24+
53	S	3	0.00	2021-01-27	\N	f	8-24
54	S	3	355.00	2021-01-27	\N	f	24+
55	S	4	0.00	2021-01-27	\N	f	8-24
56	S	4	751.00	2021-01-27	\N	f	24+
57	A	4	3976.00	2026-01-13	\N	f	24+
58	A	4	1590.00	2026-01-13	\N	f	8-24
59	B	4	3093.00	2026-01-13	\N	f	24+
60	B	4	1325.00	2026-01-13	\N	f	8-24
61	C	4	2209.00	2026-01-13	\N	f	24+
62	C	4	1149.00	2026-01-13	\N	f	8-24
63	D	4	1679.00	2026-01-13	\N	f	24+
64	D	4	795.00	2026-01-13	\N	f	8-24
65	E	4	1370.00	2026-01-13	\N	f	24+
66	E	4	619.00	2026-01-13	\N	f	8-24
1	A	1	1060.00	2026-02-20	\N	f	8-24
\.


--
-- Data for Name: tramite_comisiones; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.tramite_comisiones (id_tramite_comision, id_tramite, id_memorandum_comision, creado_en) FROM stdin;
3	2	3	2026-03-04 12:33:37.548234
4	2	4	2026-03-04 12:33:38.426254
\.


--
-- Data for Name: tramites; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.tramites (id_tramite, folio, fecha, observaciones, enviado, id_usuario, fecha_creacion, esta_borrado, id_firma, importe) FROM stdin;
1	OG/CA/UI/-T1	2026-03-04	ok	f	2	2026-03-04 10:16:13.502125	t	12	0.00
2	OG/CA/UI/-T2	2026-03-04	ok	f	2	2026-03-04 12:32:18.37417	t	12	1460.00
\.


--
-- Data for Name: zonas_municipios; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.zonas_municipios (id_zona, id_municipio) FROM stdin;
1	1
1	2
1	9
1	15
1	16
1	27
1	29
1	17
1	19
1	21
1	34
1	40
1	46
1	48
1	50
1	51
1	55
1	123
1	63
1	68
1	74
1	78
1	79
1	85
1	86
1	89
1	91
1	96
1	100
1	101
1	104
1	107
2	3
2	6
2	8
2	11
2	12
2	13
2	18
2	25
2	28
2	32
2	35
2	36
2	37
2	41
2	42
2	43
2	44
2	47
2	53
2	54
2	57
2	61
2	65
2	69
2	71
2	72
2	73
2	83
2	84
2	87
2	90
2	92
2	94
2	97
2	102
2	103
2	105
2	106
2	113
2	119
2	120
2	121
2	122
3	4
3	5
3	7
3	10
3	14
3	20
3	22
3	23
3	24
3	26
3	30
3	31
3	33
3	38
3	39
3	45
3	49
3	52
3	56
3	58
3	59
3	60
3	62
3	64
3	66
3	67
3	70
3	75
3	76
3	77
3	80
3	81
3	82
3	88
3	93
3	95
3	98
3	99
3	108
3	109
3	110
3	111
3	112
3	114
3	115
3	116
3	117
3	118
3	124
\.


--
-- Data for Name: zonas_viaticos; Type: TABLE DATA; Schema: viaticos; Owner: -
--

COPY viaticos.zonas_viaticos (id_zona, codigo_zona, nombre_zona, esta_borrado) FROM stdin;
1	1	Zona 1 Medio, Bajo, Muy Bajo	f
2	2	Zona 2 Alto	f
3	3	Zona 3 Muy Alto	f
4	NACIONAL	Fuera del Estado dentro del Territorio Nacional	f
\.


--
-- Name: actividades_id_actividad_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.actividades_id_actividad_seq', 6, true);


--
-- Name: cat_bancos_id_banco_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.cat_bancos_id_banco_seq', 11, true);


--
-- Name: categorias_del_empleado_id_categoria_del_empleado_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.categorias_del_empleado_id_categoria_del_empleado_seq', 280, true);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.categorias_id_categoria_seq', 12, true);


--
-- Name: comisiones_id_comision_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.comisiones_id_comision_seq', 1, false);


--
-- Name: cuentas_bancarias_id_cuenta_bancaria_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.cuentas_bancarias_id_cuenta_bancaria_seq', 1, false);


--
-- Name: detalles_viaticos_id_detalle_viatico_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.detalles_viaticos_id_detalle_viatico_seq', 9, true);


--
-- Name: estados_federacion_id_estado_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.estados_federacion_id_estado_seq', 31, true);


--
-- Name: firmas_adicionales_empleado_id_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.firmas_adicionales_empleado_id_seq', 2, true);


--
-- Name: firmas_id_firma_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.firmas_id_firma_seq', 18, true);


--
-- Name: firmas_por_area_id_firma_area_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.firmas_por_area_id_firma_area_seq', 11, true);


--
-- Name: gastos_globales_memorandum_id_gasto_global_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.gastos_globales_memorandum_id_gasto_global_seq', 4, true);


--
-- Name: memorandum_comision_id_memorandum_comision_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.memorandum_comision_id_memorandum_comision_seq', 9, true);


--
-- Name: tarifas_viaticos_id_tarifa_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.tarifas_viaticos_id_tarifa_seq', 66, true);


--
-- Name: tramite_comisiones_id_tramite_comision_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.tramite_comisiones_id_tramite_comision_seq', 4, true);


--
-- Name: tramites_id_tramite_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.tramites_id_tramite_seq', 2, true);


--
-- Name: zonas_viaticos_id_zona_seq; Type: SEQUENCE SET; Schema: viaticos; Owner: -
--

SELECT pg_catalog.setval('viaticos.zonas_viaticos_id_zona_seq', 4, true);


--
-- Name: actividades actividades_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.actividades
    ADD CONSTRAINT actividades_pkey PRIMARY KEY (id_actividad);


--
-- Name: cat_bancos cat_bancos_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cat_bancos
    ADD CONSTRAINT cat_bancos_pkey PRIMARY KEY (id_banco);


--
-- Name: categorias_del_empleado categorias_del_empleado_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.categorias_del_empleado
    ADD CONSTRAINT categorias_del_empleado_pkey PRIMARY KEY (id_categoria_del_empleado);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: comisiones comisiones_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.comisiones
    ADD CONSTRAINT comisiones_pkey PRIMARY KEY (id_comision);


--
-- Name: cuentas_bancarias cuentas_bancarias_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cuentas_bancarias
    ADD CONSTRAINT cuentas_bancarias_pkey PRIMARY KEY (id_cuenta_bancaria);


--
-- Name: detalles_viaticos detalles_viaticos_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT detalles_viaticos_pkey PRIMARY KEY (id_detalle_viatico);


--
-- Name: estados_federacion estados_federacion_clave_estado_key; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.estados_federacion
    ADD CONSTRAINT estados_federacion_clave_estado_key UNIQUE (clave_estado);


--
-- Name: estados_federacion estados_federacion_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.estados_federacion
    ADD CONSTRAINT estados_federacion_pkey PRIMARY KEY (id_estado);


--
-- Name: firmas_adicionales_empleado firmas_adicionales_empleado_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_adicionales_empleado
    ADD CONSTRAINT firmas_adicionales_empleado_pkey PRIMARY KEY (id);


--
-- Name: firmas firmas_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas
    ADD CONSTRAINT firmas_pkey PRIMARY KEY (id_firma);


--
-- Name: firmas_por_area firmas_por_area_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_por_area
    ADD CONSTRAINT firmas_por_area_pkey PRIMARY KEY (id_firma_area);


--
-- Name: gastos_globales_memorandum gastos_globales_memorandum_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.gastos_globales_memorandum
    ADD CONSTRAINT gastos_globales_memorandum_pkey PRIMARY KEY (id_gasto_global);


--
-- Name: memorandum_comision memorandum_comision_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.memorandum_comision
    ADD CONSTRAINT memorandum_comision_pkey PRIMARY KEY (id_memorandum_comision);


--
-- Name: tarifas_viaticos tarifas_viaticos_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tarifas_viaticos
    ADD CONSTRAINT tarifas_viaticos_pkey PRIMARY KEY (id_tarifa);


--
-- Name: tramite_comisiones tramite_comisiones_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramite_comisiones
    ADD CONSTRAINT tramite_comisiones_pkey PRIMARY KEY (id_tramite_comision);


--
-- Name: tramites tramites_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramites
    ADD CONSTRAINT tramites_pkey PRIMARY KEY (id_tramite);


--
-- Name: gastos_globales_memorandum unique_memorandum_gastos; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.gastos_globales_memorandum
    ADD CONSTRAINT unique_memorandum_gastos UNIQUE (id_memorandum_comision);


--
-- Name: tramite_comisiones unique_tramite_memo; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramite_comisiones
    ADD CONSTRAINT unique_tramite_memo UNIQUE (id_tramite, id_memorandum_comision);


--
-- Name: zonas_municipios zonas_municipios_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.zonas_municipios
    ADD CONSTRAINT zonas_municipios_pkey PRIMARY KEY (id_zona, id_municipio);


--
-- Name: zonas_viaticos zonas_viaticos_codigo_zona_key; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.zonas_viaticos
    ADD CONSTRAINT zonas_viaticos_codigo_zona_key UNIQUE (codigo_zona);


--
-- Name: zonas_viaticos zonas_viaticos_pkey; Type: CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.zonas_viaticos
    ADD CONSTRAINT zonas_viaticos_pkey PRIMARY KEY (id_zona);


--
-- Name: idx_gastos_globales_memorandum; Type: INDEX; Schema: viaticos; Owner: -
--

CREATE INDEX idx_gastos_globales_memorandum ON viaticos.gastos_globales_memorandum USING btree (id_memorandum_comision) WHERE (esta_borrado = false);


--
-- Name: actividades actividades_id_municipio_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.actividades
    ADD CONSTRAINT actividades_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: actividades actividades_id_usuario_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.actividades
    ADD CONSTRAINT actividades_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: cuentas_bancarias cuentas_bancarias_id_banco_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cuentas_bancarias
    ADD CONSTRAINT cuentas_bancarias_id_banco_fkey FOREIGN KEY (id_banco) REFERENCES viaticos.cat_bancos(id_banco);


--
-- Name: cuentas_bancarias cuentas_bancarias_id_empleado_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.cuentas_bancarias
    ADD CONSTRAINT cuentas_bancarias_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado);


--
-- Name: firmas_adicionales_empleado firmas_adicionales_empleado_id_empleado_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_adicionales_empleado
    ADD CONSTRAINT firmas_adicionales_empleado_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado);


--
-- Name: firmas_adicionales_empleado firmas_adicionales_empleado_id_firma_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_adicionales_empleado
    ADD CONSTRAINT firmas_adicionales_empleado_id_firma_fkey FOREIGN KEY (id_firma) REFERENCES viaticos.firmas(id_firma);


--
-- Name: firmas_por_area firmas_por_area_id_area_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_por_area
    ADD CONSTRAINT firmas_por_area_id_area_fkey FOREIGN KEY (id_area) REFERENCES public.areas(id_area);


--
-- Name: firmas_por_area firmas_por_area_id_firma_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.firmas_por_area
    ADD CONSTRAINT firmas_por_area_id_firma_fkey FOREIGN KEY (id_firma) REFERENCES viaticos.firmas(id_firma);


--
-- Name: categorias_del_empleado fk_categoria_puesto; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.categorias_del_empleado
    ADD CONSTRAINT fk_categoria_puesto FOREIGN KEY (categoria) REFERENCES viaticos.categorias(id_categoria);


--
-- Name: comisiones fk_com_empleado; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.comisiones
    ADD CONSTRAINT fk_com_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado);


--
-- Name: comisiones fk_com_municipio; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.comisiones
    ADD CONSTRAINT fk_com_municipio FOREIGN KEY (id_municipio_destino) REFERENCES public.municipios(id_municipio);


--
-- Name: detalles_viaticos fk_dv_estado; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT fk_dv_estado FOREIGN KEY (id_estado) REFERENCES viaticos.estados_federacion(id_estado);


--
-- Name: detalles_viaticos fk_dv_firma; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT fk_dv_firma FOREIGN KEY (id_firma_autoriza) REFERENCES viaticos.firmas(id_firma);


--
-- Name: detalles_viaticos fk_dv_memo; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT fk_dv_memo FOREIGN KEY (id_memorandum_comision) REFERENCES viaticos.memorandum_comision(id_memorandum_comision) ON DELETE CASCADE;


--
-- Name: detalles_viaticos fk_dv_municipio; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT fk_dv_municipio FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: detalles_viaticos fk_firma_fija; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.detalles_viaticos
    ADD CONSTRAINT fk_firma_fija FOREIGN KEY (id_firma_fija) REFERENCES viaticos.firmas(id_firma);


--
-- Name: tramite_comisiones fk_tc_memo; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramite_comisiones
    ADD CONSTRAINT fk_tc_memo FOREIGN KEY (id_memorandum_comision) REFERENCES viaticos.memorandum_comision(id_memorandum_comision) ON DELETE CASCADE;


--
-- Name: tramite_comisiones fk_tc_tramite; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramite_comisiones
    ADD CONSTRAINT fk_tc_tramite FOREIGN KEY (id_tramite) REFERENCES viaticos.tramites(id_tramite) ON DELETE CASCADE;


--
-- Name: tarifas_viaticos fk_tv_zona; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tarifas_viaticos
    ADD CONSTRAINT fk_tv_zona FOREIGN KEY (id_zona) REFERENCES viaticos.zonas_viaticos(id_zona);


--
-- Name: zonas_municipios fk_zm_municipio; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.zonas_municipios
    ADD CONSTRAINT fk_zm_municipio FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: zonas_municipios fk_zm_zona; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.zonas_municipios
    ADD CONSTRAINT fk_zm_zona FOREIGN KEY (id_zona) REFERENCES viaticos.zonas_viaticos(id_zona);


--
-- Name: gastos_globales_memorandum gastos_globales_memorandum_id_memorandum_comision_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.gastos_globales_memorandum
    ADD CONSTRAINT gastos_globales_memorandum_id_memorandum_comision_fkey FOREIGN KEY (id_memorandum_comision) REFERENCES viaticos.memorandum_comision(id_memorandum_comision) ON DELETE CASCADE;


--
-- Name: memorandum_comision memorandum_comision_id_actividad_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.memorandum_comision
    ADD CONSTRAINT memorandum_comision_id_actividad_fkey FOREIGN KEY (id_actividad) REFERENCES viaticos.actividades(id_actividad);


--
-- Name: memorandum_comision memorandum_comision_id_empleado_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.memorandum_comision
    ADD CONSTRAINT memorandum_comision_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado);


--
-- Name: memorandum_comision memorandum_comision_id_firma_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.memorandum_comision
    ADD CONSTRAINT memorandum_comision_id_firma_fkey FOREIGN KEY (id_firma) REFERENCES viaticos.firmas(id_firma);


--
-- Name: tramites tramites_id_firma_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramites
    ADD CONSTRAINT tramites_id_firma_fkey FOREIGN KEY (id_firma) REFERENCES viaticos.firmas(id_firma);


--
-- Name: tramites tramites_id_usuario_fkey; Type: FK CONSTRAINT; Schema: viaticos; Owner: -
--

ALTER TABLE ONLY viaticos.tramites
    ADD CONSTRAINT tramites_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- PostgreSQL database dump complete
--

\unrestrict 2rTAqHHlNq0Epz7WIC3MPmEnGQg3FEICFesZrRMg0PwXPNDPPlxTmRGf8UMdsTf

