--
-- PostgreSQL database dump
--

\restrict gg6JMI7RImRc98W8HtoUD6brjvZqRh7tPR4K1gPGhcELAINeROx0l4BzPNdbbx4

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

--
-- Data for Name: firmas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO viaticos.firmas VALUES (1, 'Lic. Juan Pérez García', 'Director General', 'Firma del Director General', false);
INSERT INTO viaticos.firmas VALUES (2, 'Ing. María López Hernández', 'Subdirectora de Administración', 'Firma de la Subdirectora', false);
INSERT INTO viaticos.firmas VALUES (3, 'C.P. Carlos Ramírez Torres', 'Jefe de Recursos Humanos', 'Firma del Jefe de RH', false);
INSERT INTO viaticos.firmas VALUES (4, 'Lic. Ana Martínez Silva', 'Coordinadora de Finanzas', 'Firma de la Coordinadora', false);
INSERT INTO viaticos.firmas VALUES (5, 'Juan Carlos Gómez Aranda', 'Coordinador General de Asesores', 'Firma del Coordinador de Asesores y Proyectos Estratégicos', false);
INSERT INTO viaticos.firmas VALUES (6, 'Jorge Alberto Cruz Nájera', 'Coordinador Ejecutivo de Giras', 'Firma del Coordinador de Giras, Logística y Protocolo', false);
INSERT INTO viaticos.firmas VALUES (7, 'Anjuli Acosta Guillén', 'Coordinadora de Atención Ciudadana', 'Firma de la Coordinadora de Atención Ciudadana', false);
INSERT INTO viaticos.firmas VALUES (8, 'Kenia Arroyo Muñiz', 'Representante en CDMX', 'Firma de la Representante del Gobierno en Ciudad de México', false);
INSERT INTO viaticos.firmas VALUES (9, 'José Eduardo Alabath Paniagua', 'Coordinador Administrativo', 'Firma del Coordinador Administrativo', false);
INSERT INTO viaticos.firmas VALUES (10, 'Luis Enrique López Díaz', 'Responsable de Casa de Gobierno', 'Firma del Responsable de Casa de Gobierno', false);
INSERT INTO viaticos.firmas VALUES (11, 'Sergio Alejandro López Matías', 'Responsable Técnico de Comisionados', 'Firma del Responsable de Comisionados Externos', false);
INSERT INTO viaticos.firmas VALUES (12, 'EMMANUEL  CASTELLANOS CORDERO', 'Jefe de Unidad', 'Firma de EMMANUEL  CASTELLANOS CORDERO', false);
INSERT INTO viaticos.firmas VALUES (13, 'WILLIAM NOE LOPEZ MAZA', 'Jefe de Área', 'Firma de WILLIAM NOE LOPEZ MAZA', false);
INSERT INTO viaticos.firmas VALUES (14, 'JAVIER  ABARCA ARIAS', 'Director', 'Firma de JAVIER  ABARCA ARIAS', false);
INSERT INTO viaticos.firmas VALUES (15, 'TEODORO  CORTES ORDOÑEZ', 'Jefe de Unidad', 'Firma de TEODORO  CORTES ORDOÑEZ', false);
INSERT INTO viaticos.firmas VALUES (16, 'ISABEL  SALDAÑA GARCIA', 'Jefe de Área', 'Firma de ISABEL  SALDAÑA GARCIA', false);
INSERT INTO viaticos.firmas VALUES (17, 'CARLOS ALBERTO RODAS ZUÑIGA', 'Director', 'Firma de CARLOS ALBERTO RODAS ZUÑIGA', false);
INSERT INTO viaticos.firmas VALUES (18, 'BENITO IVAN MEJIA ESTRADA', 'Jefe de Área', 'Firma de BENITO IVAN MEJIA ESTRADA', false);


--
-- Data for Name: firmas_adicionales_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO viaticos.firmas_adicionales_empleado VALUES (2, 268, 12, '2026-03-04 10:08:17.028723', false);


--
-- Data for Name: firmas_por_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO viaticos.firmas_por_area VALUES (1, 1, 1, false);
INSERT INTO viaticos.firmas_por_area VALUES (2, 2, 2, false);
INSERT INTO viaticos.firmas_por_area VALUES (3, 3, 3, false);
INSERT INTO viaticos.firmas_por_area VALUES (4, 4, 4, false);
INSERT INTO viaticos.firmas_por_area VALUES (5, 5, 5, false);
INSERT INTO viaticos.firmas_por_area VALUES (6, 6, 6, false);
INSERT INTO viaticos.firmas_por_area VALUES (7, 12, 7, false);
INSERT INTO viaticos.firmas_por_area VALUES (8, 15, 8, false);
INSERT INTO viaticos.firmas_por_area VALUES (9, 21, 9, false);
INSERT INTO viaticos.firmas_por_area VALUES (10, 28, 10, false);
INSERT INTO viaticos.firmas_por_area VALUES (11, 34, 11, false);


--
-- Name: firmas_adicionales_empleado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('viaticos.firmas_adicionales_empleado_id_seq', 2, true);


--
-- Name: firmas_id_firma_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('viaticos.firmas_id_firma_seq', 18, true);


--
-- Name: firmas_por_area_id_firma_area_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('viaticos.firmas_por_area_id_firma_area_seq', 11, true);


--
-- PostgreSQL database dump complete
--

\unrestrict gg6JMI7RImRc98W8HtoUD6brjvZqRh7tPR4K1gPGhcELAINeROx0l4BzPNdbbx4

