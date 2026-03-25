-- Versión DEFINITIVA de la función para el Memorandum Oficial
-- Incluye lógica de categorías para el puesto del empleado (Unificado con el reporte anterior)
CREATE OR REPLACE FUNCTION viaticos.fn_reporte_memorandum_oficial(p_id_memorandum INTEGER)
RETURNS TABLE (
    memorandum_no TEXT,
    fecha_reporte TEXT,
    nombre_empleado TEXT,
    puesto_empleado TEXT,
    motivo_comision TEXT,
    lugar_comision TEXT,
    periodo_comision TEXT,
    medio_transporte TEXT,
    observaciones TEXT,
    nombre_autoriza TEXT,
    cargo_autoriza TEXT,
    organismo TEXT,
    area_nombre TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mc.folio::TEXT as memorandum_no,
        UPPER(
            TO_CHAR(mc.fecha_creacion, 'DD') || ' DE ' || 
            CASE EXTRACT(MONTH FROM mc.fecha_creacion)
                WHEN 1 THEN 'ENERO'
                WHEN 2 THEN 'FEBRERO'
                WHEN 3 THEN 'MARZO'
                WHEN 4 THEN 'ABRIL'
                WHEN 5 THEN 'MAYO'
                WHEN 6 THEN 'JUNIO'
                WHEN 7 THEN 'JULIO'
                WHEN 8 THEN 'AGOSTO'
                WHEN 9 THEN 'SEPTIEMBRE'
                WHEN 10 THEN 'OCTUBRE'
                WHEN 11 THEN 'NOVIEMBRE'
                WHEN 12 THEN 'DICIEMBRE'
            END || ' DE ' || 
            TO_CHAR(mc.fecha_creacion, 'YYYY')
        ) as fecha_reporte,
        UPPER(TRIM(CONCAT(COALESCE(e.prefijo, ''), ' ', e.nombres, ' ', e.apellido1, ' ', e.apellido2))) as nombre_empleado,
        UPPER(COALESCE(
            (SELECT CONCAT(cat_pos.puesto, ' ', ce_pos.literal)
             FROM public.empleados_datos_laborales edl_pos
             JOIN viaticos.categorias_del_empleado ce_pos ON edl_pos.id_categoria_del_empleado = ce_pos.id_categoria_del_empleado
             JOIN viaticos.categorias cat_pos ON ce_pos.categoria = cat_pos.id_categoria
             WHERE edl_pos.id_empleado_datos_laborales = e.id_empleado_datos_laborales
            ), 
            c_emp.cargo, 
            'PERSONAL'
        )) as puesto_empleado,
        UPPER(COALESCE(a_act.motivo, 'COMISIÓN OFICIAL')) as motivo_comision,
        COALESCE((SELECT UPPER(STRING_AGG(m.descripcion, ', ')) FROM viaticos.detalles_viaticos dv JOIN public.municipios m ON dv.id_municipio = m.id_municipio WHERE dv.id_memorandum_comision = p_id_memorandum), 'VER DETALLE') as lugar_comision,
        UPPER(CONCAT(TO_CHAR(mc.periodo_inicio, 'DD/MM/YYYY'), ' AL ', TO_CHAR(mc.periodo_fin, 'DD/MM/YYYY'))) as periodo_comision,
        UPPER(CASE 
            WHEN (mc.tipo_transporte ILIKE '%oficial%' OR mc.id_vehiculo IS NOT NULL) AND v.id_vehiculo IS NOT NULL
            THEN CONCAT('VEHICULOS OFICIAL ', v.modelo, ' PLACAS ', v.placas_actuales)
            ELSE COALESCE(mc.tipo_transporte, 'NO ESPECIFICADO')
        END) as medio_transporte,
        COALESCE(mc.observaciones, '') as observaciones,
        UPPER(COALESCE(f.nombre_firma, '')) as nombre_autoriza,
        UPPER(COALESCE(f.cargo_firma, '')) as cargo_autoriza,
        UPPER(COALESCE(ea.descripcion, 'OFICINA DEL GOBERNADOR')) as organismo,
        UPPER(COALESCE(ar.descripcion, 'ÁREA SOLICITANTE')) as area_nombre
    FROM viaticos.memorandum_comision mc
    JOIN public.empleados e ON mc.id_empleado = e.id_empleado
    LEFT JOIN public.cargos c_emp ON e.id_cargo = c_emp.id_cargo
    LEFT JOIN viaticos.actividades a_act ON mc.id_actividad = a_act.id_actividad
    LEFT JOIN public.areas ar ON e.id_area = ar.id_area
    LEFT JOIN public.estructuras_administrativas ea ON ar.id_estructura_administrativa = ea.id_estructura_administrativa
    LEFT JOIN public.vehiculos v ON mc.id_vehiculo = v.id_vehiculo
    LEFT JOIN viaticos.detalles_viaticos dv_first ON mc.id_memorandum_comision = dv_first.id_memorandum_comision
    LEFT JOIN viaticos.firmas f ON dv_first.id_firma_autoriza = f.id_firma
    WHERE mc.id_memorandum_comision = p_id_memorandum
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
