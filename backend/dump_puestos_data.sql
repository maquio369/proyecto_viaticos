--
-- PostgreSQL database dump
--

\restrict s4jVLChvhiKCEzGSrGk8gmlrB2DNNLs2ODe0SdrIIVFgsILwjTU9cty9T560Jab

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
-- Data for Name: puestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.puestos VALUES (1, 'SECRETARIO DE ESTADO O EQUIVALENTE', false);
INSERT INTO public.puestos VALUES (2, 'DIRECTOR GENERAL', false);
INSERT INTO public.puestos VALUES (3, 'SECRETARIO DEL EJECUTIVO', false);
INSERT INTO public.puestos VALUES (4, 'SUBSECRETARIO DE ESTADO O EQUIVALENTE', false);
INSERT INTO public.puestos VALUES (5, 'SECRETARIO EJECUTIVO', false);
INSERT INTO public.puestos VALUES (6, 'COORDINADOR (A) GENERAL DE RECURSOS HUMANOS', false);
INSERT INTO public.puestos VALUES (7, 'COORDINADOR Ó EQUIVALENTE', false);
INSERT INTO public.puestos VALUES (8, 'DIRECTOR ACADEMIA DE POLICÍA', false);
INSERT INTO public.puestos VALUES (9, 'DIRECTOR', false);
INSERT INTO public.puestos VALUES (10, 'JEFE DE UNIDAD', false);
INSERT INTO public.puestos VALUES (11, 'CONTRALOR INTERNO', false);
INSERT INTO public.puestos VALUES (12, 'SECRETARIO TÉCNICO COORDINADOR TÉCNICO', false);
INSERT INTO public.puestos VALUES (13, 'ASESOR A', false);
INSERT INTO public.puestos VALUES (14, 'SECRETARIO PARTICULAR', false);
INSERT INTO public.puestos VALUES (15, 'ASESOR B', false);
INSERT INTO public.puestos VALUES (16, 'COORDINADOR', false);
INSERT INTO public.puestos VALUES (17, 'COORDINADOR JURÍDICO', false);
INSERT INTO public.puestos VALUES (18, 'COORDINADOR SOCIAL', false);
INSERT INTO public.puestos VALUES (19, 'REPRESENTANTE OPERATIVO PARA LA OBRA PÚBLICA', false);
INSERT INTO public.puestos VALUES (20, 'RESPONSABLE ANTE EL COMITÉ DE ADQUISICIONES', false);
INSERT INTO public.puestos VALUES (21, 'CONSEJERO', false);
INSERT INTO public.puestos VALUES (22, 'ASISTENTE DE INGENIERÍA AERONÁUTICA', false);
INSERT INTO public.puestos VALUES (23, 'SUPERVISOR DE HELICÓPTEROS', false);
INSERT INTO public.puestos VALUES (24, 'TÉCNICO MECÁNICO DE ALA FIJA', false);
INSERT INTO public.puestos VALUES (25, 'TÉCNICO MECÁNICO DE ALA ROTATIVA', false);
INSERT INTO public.puestos VALUES (26, 'SUPERVISOR DE MANTENIMIENTO DE AERONAVES', false);
INSERT INTO public.puestos VALUES (27, 'TÉCNICO DE ACABADOS DE AERONAVES', false);
INSERT INTO public.puestos VALUES (28, 'TÉCNICO EN AVIONIC''S', false);
INSERT INTO public.puestos VALUES (29, 'ASESOR C', false);
INSERT INTO public.puestos VALUES (30, 'OFICIAL DEL REGISTRO CIVIL DEL ESTADO', false);
INSERT INTO public.puestos VALUES (31, 'SUBDIRECTOR DE LA ACADEMIA DE POLICÍA', false);
INSERT INTO public.puestos VALUES (32, 'DELEGADO ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (33, 'DELEGADO DE TRÁNSITO', false);
INSERT INTO public.puestos VALUES (34, 'RESPONSABLE DE RECAUDACIÓN LOCAL', false);
INSERT INTO public.puestos VALUES (35, 'SUBDIRECTOR', false);
INSERT INTO public.puestos VALUES (36, 'JEFE DE DEPARTAMENTO', false);
INSERT INTO public.puestos VALUES (37, 'COORDINADOR OPERATIVO', false);
INSERT INTO public.puestos VALUES (38, 'DELEGADO', false);
INSERT INTO public.puestos VALUES (39, 'PRESIDENTE DE LA JUNTA LOCAL DE CONCILIACIÓN', false);
INSERT INTO public.puestos VALUES (40, 'COMANDANTE OPERATIVO', false);
INSERT INTO public.puestos VALUES (41, 'DELEGADO DE INGRESOS', false);
INSERT INTO public.puestos VALUES (42, 'CURADOR GENERAL', false);
INSERT INTO public.puestos VALUES (43, 'JEFE DE ÁREA DE CONTRALORIA', false);
INSERT INTO public.puestos VALUES (44, 'JEFE DE DEPARTAMENTO DE CONTRALORIA', false);
INSERT INTO public.puestos VALUES (45, 'DELEGADO DE HACIENDA', false);
INSERT INTO public.puestos VALUES (46, 'COPILOTO', false);
INSERT INTO public.puestos VALUES (47, 'CURADOR DE ZOOLÓGICO', false);
INSERT INTO public.puestos VALUES (48, 'PILOTO A', false);
INSERT INTO public.puestos VALUES (49, 'PILOTO B', false);
INSERT INTO public.puestos VALUES (50, 'PILOTO C', false);
INSERT INTO public.puestos VALUES (52, 'SUBDIRECTOR ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (53, 'JEFE DE OFICINA', false);
INSERT INTO public.puestos VALUES (54, 'JEFE DE ÁREA', false);
INSERT INTO public.puestos VALUES (55, 'AGENTE DEL MINISTERIO PÚBLICO', false);
INSERT INTO public.puestos VALUES (56, 'JEFE TÉCNICO PEDAGÓGICO', false);
INSERT INTO public.puestos VALUES (57, 'DIRECTOR MÚSICO', false);
INSERT INTO public.puestos VALUES (58, 'SUPERVISOR DE OBRA', false);
INSERT INTO public.puestos VALUES (59, 'AUDITOR A', false);
INSERT INTO public.puestos VALUES (60, 'ANALISTA TÉCNICO EN CONTABILIDAD', false);
INSERT INTO public.puestos VALUES (61, 'AUDITOR B', false);
INSERT INTO public.puestos VALUES (62, 'SUPERVISOR DE EDUCACIÓN', false);
INSERT INTO public.puestos VALUES (63, 'SUPERVISOR DE PRODUCCIÓN', false);
INSERT INTO public.puestos VALUES (64, 'SUBCOMANDANTE DE REGIÓN', false);
INSERT INTO public.puestos VALUES (65, 'JEFE DE OPERACIÓN', false);
INSERT INTO public.puestos VALUES (66, 'ASISTENTE DE ÁREA', false);
INSERT INTO public.puestos VALUES (67, 'JEFE DE SECCIÓN', false);
INSERT INTO public.puestos VALUES (68, 'JEFE ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (69, 'SUBDELEGADO ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (70, 'AGENTE DEL MINISTERIO PÚBLICO AUXILIAR', false);
INSERT INTO public.puestos VALUES (71, 'SUPERVISOR DE AUDITOR', false);
INSERT INTO public.puestos VALUES (72, 'ANALISTA TÉCNICO B', false);
INSERT INTO public.puestos VALUES (73, 'ANALISTA TÉCNICO C', false);
INSERT INTO public.puestos VALUES (74, 'JEFE DE CUADRILLA', false);
INSERT INTO public.puestos VALUES (75, 'SUPERVISOR', false);
INSERT INTO public.puestos VALUES (76, 'JEFE DE OPERACIONES', false);
INSERT INTO public.puestos VALUES (77, 'SEGUNDO OFICIAL Y/O POLICIA PRIMERO', false);
INSERT INTO public.puestos VALUES (78, 'COORDINADOR DE GRUPO', false);
INSERT INTO public.puestos VALUES (79, 'JEFE DE GRUPO', false);
INSERT INTO public.puestos VALUES (80, 'ALCALDE', false);
INSERT INTO public.puestos VALUES (81, 'MÚSICO GENERAL', false);
INSERT INTO public.puestos VALUES (82, 'NOTIFICADOR Y EJECUTOR', false);
INSERT INTO public.puestos VALUES (83, 'TRADUCTOR DE LENGUAS', false);
INSERT INTO public.puestos VALUES (84, 'ACTUARIO NOTIFICADOR', false);
INSERT INTO public.puestos VALUES (85, 'PROMOTOR', false);
INSERT INTO public.puestos VALUES (86, 'TOPÓGRAFO', false);
INSERT INTO public.puestos VALUES (87, 'PROMOTOR DEPORTIVO', false);
INSERT INTO public.puestos VALUES (88, 'PERITO A', false);
INSERT INTO public.puestos VALUES (89, 'TRABAJADORA SOCIAL', false);
INSERT INTO public.puestos VALUES (90, 'CAPTURISTA', false);
INSERT INTO public.puestos VALUES (91, 'LOCUTOR', false);
INSERT INTO public.puestos VALUES (92, 'AGENTE DE INFORMACIÓN BILINGÜE', false);
INSERT INTO public.puestos VALUES (93, 'ANALISTA PROGRAMADOR', false);
INSERT INTO public.puestos VALUES (94, 'REPORTERO', false);
INSERT INTO public.puestos VALUES (95, 'CORRESPONSAL', false);
INSERT INTO public.puestos VALUES (96, 'PSICÓLOGO', false);
INSERT INTO public.puestos VALUES (97, 'PERITO B', false);
INSERT INTO public.puestos VALUES (98, 'MECÁNICO DE AERONAVE', false);
INSERT INTO public.puestos VALUES (99, 'INSTRUCTOR', false);
INSERT INTO public.puestos VALUES (100, 'ANALISTA DE SISTEMAS', false);
INSERT INTO public.puestos VALUES (101, 'INSTRUCTOR DE TALLER DE EDUCACIÓN ESPECIAL', false);
INSERT INTO public.puestos VALUES (102, 'INSTRUCTOR DE EDUCACIÓN ESPECIAL', false);
INSERT INTO public.puestos VALUES (103, 'INVESTIGADOR', false);
INSERT INTO public.puestos VALUES (104, 'COORDINADOR ADMINISTRATIVO (DELEGACIÓN)', false);
INSERT INTO public.puestos VALUES (105, 'OFICIAL SECRETARIO DEL MINISTERIO PÚBLICO', false);
INSERT INTO public.puestos VALUES (106, 'PROFESIONISTA A', false);
INSERT INTO public.puestos VALUES (107, 'PROFESIONISTA B', false);
INSERT INTO public.puestos VALUES (108, 'ANALISTA TÉCNICO A', false);
INSERT INTO public.puestos VALUES (109, 'PROFESIONISTA C', false);
INSERT INTO public.puestos VALUES (110, 'OPERADOR', false);
INSERT INTO public.puestos VALUES (111, 'MECÁNICO', false);
INSERT INTO public.puestos VALUES (112, 'ANALISTA DE OPERACIÓN', false);
INSERT INTO public.puestos VALUES (113, 'TÉCNICO MEDIO A', false);
INSERT INTO public.puestos VALUES (114, 'ANALISTA DE MAQUINARIA PESADA', false);
INSERT INTO public.puestos VALUES (115, 'CAMARÓGRAFO', false);
INSERT INTO public.puestos VALUES (116, 'TÉCNICO EN ELECTRÓNICA', false);
INSERT INTO public.puestos VALUES (117, 'PROYECTISTA', false);
INSERT INTO public.puestos VALUES (118, 'DIBUJANTE', false);
INSERT INTO public.puestos VALUES (119, 'MECÁNICO ESPECIALIZADO', false);
INSERT INTO public.puestos VALUES (120, 'TÉCNICO MEDIO B', false);
INSERT INTO public.puestos VALUES (121, 'OPERADOR DE TRAILER', false);
INSERT INTO public.puestos VALUES (122, 'TÉCNICO MEDIO C', false);
INSERT INTO public.puestos VALUES (123, 'TÉCNICO ESPECIALIZADO', false);
INSERT INTO public.puestos VALUES (124, 'TÉCNICO DE TRANSMISIÓN', false);
INSERT INTO public.puestos VALUES (125, 'REPRESENTANTE', false);
INSERT INTO public.puestos VALUES (126, 'INSPECTOR', false);
INSERT INTO public.puestos VALUES (127, 'JEFE DE FISCAL', false);
INSERT INTO public.puestos VALUES (128, 'AGENTE FISCAL', false);
INSERT INTO public.puestos VALUES (129, 'AUXILIAR ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (130, 'ADMINISTRADOR DOCUMENTAL', false);
INSERT INTO public.puestos VALUES (131, 'AUXILIAR ADMINISTRATIVO DE SUPERVISOR', false);
INSERT INTO public.puestos VALUES (132, 'PREFECTO', false);
INSERT INTO public.puestos VALUES (133, 'AUXILIAR DE SUPERVISOR DE TELESECUNDARIA', false);
INSERT INTO public.puestos VALUES (134, 'AGENTE DE INFORMACIÓN', false);
INSERT INTO public.puestos VALUES (135, 'SECRETARIA EJECUTIVA DE APOYO', false);
INSERT INTO public.puestos VALUES (136, 'AUXILIAR ADMINISTRATIVO DE TELESECUNDARIA', false);
INSERT INTO public.puestos VALUES (137, 'RECEPCIONISTA', false);
INSERT INTO public.puestos VALUES (138, 'RESPONSABLE DE SECCIÓN', false);
INSERT INTO public.puestos VALUES (139, 'RESPONSABLE DE MESA', false);
INSERT INTO public.puestos VALUES (140, 'GESTOR ADMINISTRATIVO', false);
INSERT INTO public.puestos VALUES (141, 'SECRETARIA EJECUTIVA DE MANDO MEDIO', false);
INSERT INTO public.puestos VALUES (142, 'CAJERA', false);
INSERT INTO public.puestos VALUES (143, 'AUXILIAR CONTABLE', false);
INSERT INTO public.puestos VALUES (144, 'EVALUADOR CONTABLE', false);
INSERT INTO public.puestos VALUES (145, 'SECRETARIA EJECUTIVA DE MANDO SUPERIOR', false);
INSERT INTO public.puestos VALUES (146, 'VIGILANTE', false);
INSERT INTO public.puestos VALUES (147, 'VIGILANTE DE ZOOLOGÍA Y BOTÁNICA', false);
INSERT INTO public.puestos VALUES (148, 'ELECTRICISTA', false);
INSERT INTO public.puestos VALUES (149, 'CARPINTERO', false);
INSERT INTO public.puestos VALUES (150, 'SOLDADOR', false);
INSERT INTO public.puestos VALUES (151, 'CADENERO', false);
INSERT INTO public.puestos VALUES (152, 'AUXILIAR DE LABORATORIO', false);
INSERT INTO public.puestos VALUES (153, 'ARTESANO', false);
INSERT INTO public.puestos VALUES (154, 'ENCARGADO DE TALLER', false);
INSERT INTO public.puestos VALUES (155, 'HERRERO', false);
INSERT INTO public.puestos VALUES (156, 'AYUDANTE', false);
INSERT INTO public.puestos VALUES (157, 'MENSAJERO', false);
INSERT INTO public.puestos VALUES (158, 'INSTITUTRIZ', false);
INSERT INTO public.puestos VALUES (159, 'JARDINERO ESPECIALIZADO', false);
INSERT INTO public.puestos VALUES (160, 'CHOFER DE APOYO', false);
INSERT INTO public.puestos VALUES (161, 'MANTENEDOR DE ANIMALES', false);
INSERT INTO public.puestos VALUES (162, 'CHOFER DE MANDO MEDIO', false);
INSERT INTO public.puestos VALUES (163, 'CHOFER DE MANDO SUPERIOR', false);
INSERT INTO public.puestos VALUES (164, 'JEFE DE ÁREA DE CONTRALORÍA', false);
INSERT INTO public.puestos VALUES (165, 'JEFE DE DEPARTAMENTO DE CONTRALORÍA', false);
INSERT INTO public.puestos VALUES (51, 'ANALISTA TÉCNICO ESPECIALIZADO', false);


--
-- Name: cargos_id_cargo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargos_id_cargo_seq', 165, true);


--
-- PostgreSQL database dump complete
--

\unrestrict s4jVLChvhiKCEzGSrGk8gmlrB2DNNLs2ODe0SdrIIVFgsILwjTU9cty9T560Jab

