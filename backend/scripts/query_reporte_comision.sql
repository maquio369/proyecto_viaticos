-- SQL Query para el Formato Único de Comisión (Jaspersoft/PostgreSQL)
-- Basado en el id_memorandum_comision

SELECT 
    -- 1. Nombre del Organismo Público
    'GUBERNATURA' as organismo_publico, -- Esto puede venir de estructuras_administrativas si es dinámico
    
    -- 2. Número de memorandum
    m.folio as num_memorandum,
    
    -- 3. Fecha de elaboración
    EXTRACT(DAY FROM m.fecha_creacion) as dia_elab,
    EXTRACT(MONTH FROM m.fecha_creacion) as mes_elab,
    EXTRACT(YEAR FROM m.fecha_creacion) as año_elab,
    
    -- 4. Órgano administrativo
    ea.descripcion as organo_administrativo,
    
    -- 5. Clave Presupuestaria
    ea.clave_clasificacion_administrativa as cp,
    ea.clave_unidad_responsable as ca, -- En el contexto del usuario CA suele ser la UR
    cf.clave_funcion as fu,
    cf.clave_subfuncion as sf,
    ai.clave_actividad_institucional as ai,
    pt.proyecto_estrategico as pt,
    
    -- 6. Nombre comisionado
    concat(e.prefijo, ' ', e.nombres, ' ', e.apellido1, ' ', e.apellido2) as nombre_comisionado,
    
    -- 7. Categoría
    cat.nombre_categoria as categoria,
    
    -- 8. Teléfonos oficina / Ext
    e.telefonos_oficina,
    
    -- 9. Motivo de comisión
    act.motivo as motivo_comision,
    
    -- 10. Lugares de comisión
    mun.nombre as municipio_destino,
    act.lugar as lugar_especifico,
    
    -- 11. Periodo
    m.periodo_inicio,
    m.periodo_fin,
    
    -- 12, 13, 14. Viáticos
    -- (Estos datos suelen venir de una subconsulta o join con detalle_viaticos)
    dv.monto_calculado as cuota_diaria,
    dv.dias as total_dias,
    (dv.monto_calculado * dv.dias) as importe_viaticos,
    
    -- 18. Medio de transporte
    m.tipo_transporte,
    v.placas,
    v.modelo,
    
    -- Signatures (15, 16)
    f_aut.nombre_firma as firma_autoriza,
    f_aut.cargo_firma as cargo_autoriza,
    f_area.nombre_firma as firma_jefe_area,
    f_area.cargo_firma as cargo_jefe_area

FROM memorandum_comision m
JOIN empleados e ON m.id_empleado = e.id_empleado
JOIN actividades act ON m.id_actividad = act.id_actividad
JOIN municipios mun ON act.id_municipio = mun.id_municipio
JOIN estructuras_administrativas ea ON e.id_area = ea.id_estructura_administrativa -- O join via areas
LEFT JOIN proyectos_estrategicos pt ON ea.id_estructura_administrativa = pt.id_estructura_administrativa
LEFT JOIN clasificaciones_funcionales cf ON pt.id_clasificacion_funcional = cf.id_clasificacion_funcional
LEFT JOIN actividades_institucionales ai ON pt.id_actividad_institucional = ai.id_actividad_institucional
LEFT JOIN empleados_datos_laborales edl ON e.id_empleado_datos_laborales = edl.id_empleado_datos_laborales
LEFT JOIN categorias cat ON edl.id_categoria_del_empleado = cat.id_categoria
LEFT JOIN vehiculos v ON m.id_vehiculo = v.id_vehiculo
LEFT JOIN detalle_viaticos dv ON m.id_memorandum_comision = dv.id_memorandum_comision
LEFT JOIN firmas f_aut ON dv.id_firma_autoriza = f_aut.id_firma
LEFT JOIN firmas f_area ON dv.id_firma_fija = f_area.id_firma
WHERE m.id_memorandum_comision = $P{ID_MEMORANDUM}
AND m.esta_borrado = false;
