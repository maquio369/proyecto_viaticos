# Resumen de Categorías: 11 (Confianza) vs 16 (Eventual)

He realizado un análisis de la tabla `categorias_del_empleado` para identificar discrepancias entre las claves de personal de **Confianza (11XXXX)** y personal **Eventual (16XXXX)**.

## Resumen de Registros
- **Confianza (Prefijo 11):** 253 registros.
- **Eventual (Prefijo 16):** 12 registros.

## Puestos que SOLO tienen Clave 11 (Confianza)
Casi todos los puestos que hemos cargado últimamente (Especialistas, Analistas, Técnicos) están en esta situación. Algunos ejemplos:

| Puesto | Clave 11 | Clave 16 (Detección) |
| :--- | :--- | :--- |
| MUSICO GENERAL | 110601 | ❌ Faltante |
| TRADUCTOR DE LENGUAS | 110602 | ❌ Faltante |
| PSICÓLOGO | 110605 | ❌ Faltante |
| COORDINADOR ADMINISTRATIVO | 110701 | ❌ Faltante |
| ANALISTA TÉCNICO A | 110704 | ❌ Faltante |
| OPERADOR | 110801 | ❌ Faltante |
| ELECTRICISTA | 111101 | ❌ Faltante |
| CHOFER DE MANDO SUPERIOR | 111203 | ❌ Faltante |

## Conclusión
Si la regla del sistema es que **todo puesto de confianza debe tener su espejo en eventual (prefijo 16)**, entonces nos faltan más de **240 registros**.

---
### Sugerencia
Podemos generar automáticamente los registros 16XXXX para todos los puestos que ya tenemos en 11XXXX, manteniendo el mismo nombre, nivel de viático y categoría base.
