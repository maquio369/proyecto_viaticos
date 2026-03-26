import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Box, Typography, TextField, Button, MenuItem, Paper } from '@mui/material';
import { DirectionsCar as CarIcon } from '@mui/icons-material';

const CapturaVehiculo = ({ onVehiculoGuardado, vehiculoEditar, onCancelarEdicion }) => {
    const [formData, setFormData] = useState({
        numero_economico: '',
        id_marca_de_vehiculo: '',
        id_tipo_de_vehiculo: '',
        id_clase_de_vehiculo: '',
        modelo: '',
        placas_anteriores: '',
        placas_actuales: '',
        numero_de_motor: '',
        serie: '',
        id_estatus_de_vehiculo: '',
        id_usos_de_vehiculo: '',
        id_empleado: '',
        id_estructura_administrativa: 1
    });

    const [catalogs, setCatalogs] = useState({
        marcas: [],
        tipos: [],
        clases: [],
        estatus: [],
        usos: [],
        empleados: []
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        cargarCatalogos();
    }, []);

    useEffect(() => {
        if (vehiculoEditar) {
            setFormData({
                numero_economico: vehiculoEditar.numero_economico,
                id_marca_de_vehiculo: vehiculoEditar.id_marca_de_vehiculo,
                id_tipo_de_vehiculo: vehiculoEditar.id_tipo_de_vehiculo,
                id_clase_de_vehiculo: vehiculoEditar.id_clase_de_vehiculo,
                modelo: vehiculoEditar.modelo,
                placas_anteriores: vehiculoEditar.placas_anteriores || '',
                placas_actuales: vehiculoEditar.placas_actuales,
                numero_de_motor: vehiculoEditar.numero_de_motor,
                serie: vehiculoEditar.serie,
                id_estatus_de_vehiculo: vehiculoEditar.id_estatus_de_vehiculo,
                id_usos_de_vehiculo: vehiculoEditar.id_usos_de_vehiculo,
                id_empleado: vehiculoEditar.id_empleado,
                id_estructura_administrativa: 1
            });
        }
    }, [vehiculoEditar]);

    const cargarCatalogos = async () => {
        try {
            const [marcasRes, tiposRes, clasesRes, estatusRes, usosRes, empleadosRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/vehiculos/marcas`),
                axios.get(`${API_BASE_URL}/api/vehiculos/tipos`),
                axios.get(`${API_BASE_URL}/api/vehiculos/clases`),
                axios.get(`${API_BASE_URL}/api/vehiculos/estatus`),
                axios.get(`${API_BASE_URL}/api/vehiculos/usos`),
                axios.get(`${API_BASE_URL}/api/catalogos/empleados`)
            ]);

            setCatalogs({
                marcas: marcasRes.data,
                tipos: tiposRes.data,
                clases: clasesRes.data,
                estatus: estatusRes.data,
                usos: usosRes.data,
                empleados: empleadosRes.data.empleados || []
            });
        } catch (error) {
            console.error('Error cargando catálogos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (vehiculoEditar) {
                await axios.put(`${API_BASE_URL}/api/vehiculos/${vehiculoEditar.id_vehiculo}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/api/vehiculos`, formData);
            }

            resetForm();
            if (onVehiculoGuardado) onVehiculoGuardado();
        } catch (error) {
            console.error('Error guardando vehículo:', error);
            alert('Error al guardar el vehículo');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            numero_economico: '',
            id_marca_de_vehiculo: '',
            id_tipo_de_vehiculo: '',
            id_clase_de_vehiculo: '',
            modelo: '',
            placas_anteriores: '',
            placas_actuales: '',
            numero_de_motor: '',
            serie: '',
            id_estatus_de_vehiculo: '',
            id_usos_de_vehiculo: '',
            id_empleado: '',
            id_estructura_administrativa: 1
        });
        if (onCancelarEdicion) onCancelarEdicion();
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#0f172a',
            outline: 'none !important',
            '& fieldset': { borderColor: '#334155', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused': {
                bgcolor: '#0f172a',
                outline: 'none !important',
                '& fieldset': { borderColor: '#38bdf8', borderWidth: 2 }
            }
        },
        '& .MuiInputBase-input': {
            bgcolor: 'transparent',
            color: '#f8fafc',
            fontWeight: 600,
            outline: 'none !important',
            boxShadow: 'none !important',
            '&:focus': { outline: 'none !important', boxShadow: 'none !important' },
            '&:focus-visible': { outline: 'none !important', boxShadow: 'none !important' }
        },
        '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
        '& input': { outline: 'none !important', boxShadow: 'none !important' }
    };

    return (
        <Box sx={{
            maxWidth: '100%',
            margin: '0 auto',
            p: 3,
            fontFamily: "'Inter', sans-serif",
            bgcolor: '#0f172a',
            minHeight: '100vh',
            color: '#f8fafc'
        }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CarIcon sx={{ fontSize: 35, color: '#38bdf8' }} />
                    {vehiculoEditar ? 'Editar Vehículo' : 'Captura de Vehículo'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    Registro de Unidades • <span style={{ color: '#38bdf8' }}>Administración</span>
                </Typography>
            </Box>

            <Paper elevation={0} sx={{
                bgcolor: '#1e293b',
                borderRadius: '16px',
                border: '1px solid #334155',
                p: 4
            }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3 }}>
                        <TextField
                            label="Número Económico"
                            name="numero_economico"
                            value={formData.numero_economico}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                        <TextField
                            label="Serie"
                            name="serie"
                            value={formData.serie}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                        <TextField
                            label="Modelo (Año)"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3 }}>
                        <TextField
                            label="Placas Actuales"
                            name="placas_actuales"
                            value={formData.placas_actuales}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                        <TextField
                            label="Placas Anteriores"
                            name="placas_anteriores"
                            value={formData.placas_anteriores}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                        <TextField
                            label="Número de Motor"
                            name="numero_de_motor"
                            value={formData.numero_de_motor}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3 }}>
                        <TextField
                            select
                            label="Marca"
                            name="id_marca_de_vehiculo"
                            value={formData.id_marca_de_vehiculo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione marca</MenuItem>
                            {catalogs.marcas.map(m => (
                                <MenuItem key={m.id_marca_de_vehiculo} value={m.id_marca_de_vehiculo}>
                                    {m.marca_de_vehiculo}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Tipo"
                            name="id_tipo_de_vehiculo"
                            value={formData.id_tipo_de_vehiculo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione tipo</MenuItem>
                            {catalogs.tipos.map(t => (
                                <MenuItem key={t.id_tipos_de_vehiculo} value={t.id_tipos_de_vehiculo}>
                                    {t.tipos_de_vehiculo}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Clase"
                            name="id_clase_de_vehiculo"
                            value={formData.id_clase_de_vehiculo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione clase</MenuItem>
                            {catalogs.clases.map(c => (
                                <MenuItem key={c.id_clases_de_vehiculo} value={c.id_clases_de_vehiculo}>
                                    {c.clases_de_vehiculo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
                        <TextField
                            select
                            label="Estatus"
                            name="id_estatus_de_vehiculo"
                            value={formData.id_estatus_de_vehiculo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione estatus</MenuItem>
                            {catalogs.estatus.map(e => (
                                <MenuItem key={e.id_estatus_de_vehiculo} value={e.id_estatus_de_vehiculo}>
                                    {e.estatus_de_vehiculo}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Uso"
                            name="id_usos_de_vehiculo"
                            value={formData.id_usos_de_vehiculo}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione uso</MenuItem>
                            {catalogs.usos.map(u => (
                                <MenuItem key={u.id_usos_de_vehiculo} value={u.id_usos_de_vehiculo}>
                                    {u.usos_de_vehiculo}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Resguardatario"
                            name="id_empleado"
                            value={formData.id_empleado}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={inputStyles}
                        >
                            <MenuItem value="">Seleccione empleado</MenuItem>
                            {catalogs.empleados.map(e => (
                                <MenuItem key={e.id_empleado} value={e.id_empleado}>
                                    {e.nombres} {e.apellido1} {e.apellido2}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            type="button"
                            onClick={resetForm}
                            sx={{
                                color: '#94a3b8',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4,
                                py: 1.2,
                                borderRadius: '10px',
                                '&:hover': {
                                    color: '#f8fafc',
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            sx={{
                                bgcolor: '#38bdf8',
                                color: '#0f172a',
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 800,
                                boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)',
                                px: 5,
                                py: 1.2,
                                '&:hover': {
                                    bgcolor: '#7dd3fc',
                                    boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                    bgcolor: '#334155',
                                    color: '#64748b'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            {saving ? 'Guardando...' : vehiculoEditar ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default CapturaVehiculo;
