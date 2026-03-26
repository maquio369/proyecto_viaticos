import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Box, Typography, TextField, IconButton, Chip, Button, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, InputAdornment, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, DirectionsCar as CarIcon, Add as AddIcon, Warning as WarningIcon } from '@mui/icons-material';

const Vehiculos = () => {
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
        id_uso_del_vehiculo: '',
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

    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, vehiculo: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [marcasRes, tiposRes, clasesRes, estatusRes, usosRes, empleadosRes, vehiculosRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/vehiculos/marcas`),
                axios.get(`${API_BASE_URL}/api/vehiculos/tipos`),
                axios.get(`${API_BASE_URL}/api/vehiculos/clases`),
                axios.get(`${API_BASE_URL}/api/vehiculos/estatus`),
                axios.get(`${API_BASE_URL}/api/vehiculos/usos`),
                axios.get(`${API_BASE_URL}/api/catalogos/empleados`),
                axios.get(`${API_BASE_URL}/api/vehiculos`)
            ]);

            setCatalogs({
                marcas: marcasRes.data,
                tipos: tiposRes.data,
                clases: clasesRes.data,
                estatus: estatusRes.data,
                usos: usosRes.data,
                empleados: empleadosRes.data.empleados || []
            });

            setVehiculos(vehiculosRes.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
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
            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/vehiculos/${editingId}`, formData);
                setSnackbar({ open: true, message: 'Vehículo actualizado exitosamente', severity: 'success' });
            } else {
                await axios.post(`${API_BASE_URL}/api/vehiculos`, formData);
                setSnackbar({ open: true, message: 'Vehículo registrado exitosamente', severity: 'success' });
            }

            resetForm();
            cargarDatos();
            setShowForm(false);
        } catch (error) {
            console.error('Error guardando vehículo:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error al guardar el vehículo',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (vehiculo) => {
        setFormData({
            numero_economico: vehiculo.numero_economico,
            id_marca_de_vehiculo: vehiculo.id_marca_de_vehiculo,
            id_tipo_de_vehiculo: vehiculo.id_tipo_de_vehiculo,
            id_clase_de_vehiculo: vehiculo.id_clase_de_vehiculo,
            modelo: vehiculo.modelo,
            placas_anteriores: vehiculo.placas_anteriores || '',
            placas_actuales: vehiculo.placas_actuales,
            numero_de_motor: vehiculo.numero_de_motor,
            serie: vehiculo.serie,
            id_estatus_de_vehiculo: vehiculo.id_estatus_de_vehiculo,
            id_uso_del_vehiculo: vehiculo.id_uso_del_vehiculo,
            id_empleado: vehiculo.id_empleado,
            id_estructura_administrativa: 1
        });
        setEditingId(vehiculo.id_vehiculo);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (vehiculo) => {
        setConfirmDialog({ open: true, vehiculo });
    };

    const confirmarEliminar = async () => {
        const id = confirmDialog.vehiculo.id_vehiculo;
        const nombreVehiculo = `${confirmDialog.vehiculo.marca_de_vehiculo} ${confirmDialog.vehiculo.modelo}`;

        try {
            await axios.delete(`${API_BASE_URL}/api/vehiculos/${id}`);
            setSnackbar({ open: true, message: `Vehículo ${nombreVehiculo} eliminado`, severity: 'success' });
            setConfirmDialog({ open: false, vehiculo: null });
            cargarDatos();
        } catch (error) {
            console.error('Error eliminando vehículo:', error);
            setSnackbar({ open: true, message: 'Error al eliminar el vehículo', severity: 'error' });
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
            id_uso_del_vehiculo: '',
            id_empleado: '',
            id_estructura_administrativa: 1
        });
        setEditingId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const filteredVehiculos = useMemo(() => {
        if (!Array.isArray(vehiculos)) return [];
        if (!searchTerm) return vehiculos;

        const search = searchTerm.toLowerCase();
        return vehiculos.filter(v =>
            (v.numero_economico?.toLowerCase().includes(search)) ||
            (v.marca_de_vehiculo?.toLowerCase().includes(search)) ||
            (v.placas_actuales?.toLowerCase().includes(search))
        );
    }, [vehiculos, searchTerm]);

    const visibleRows = React.useMemo(
        () => filteredVehiculos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredVehiculos, page, rowsPerPage]
    );

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

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: '#0f172a', height: '100vh', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#38bdf8' }} />
        </Box>
    );

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
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CarIcon sx={{ fontSize: 35, color: '#38bdf8' }} />
                        Gestión de Vehículos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Registro de Unidades • <span style={{ color: '#38bdf8' }}>Administración</span>
                    </Typography>
                </Box>
            </Box>

            {showForm && (
                <Paper elevation={0} sx={{
                    bgcolor: '#1e293b',
                    borderRadius: '16px',
                    border: '1px solid #334155',
                    p: 4,
                    mb: 3
                }}>
                    <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 3 }}>
                        {editingId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                            <TextField label="Número Económico" name="numero_economico" value={formData.numero_economico} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles} />
                            <TextField label="Serie" name="serie" value={formData.serie} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles} />
                            <TextField label="Modelo (Año)" name="modelo" value={formData.modelo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles} />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                            <TextField label="Placas Actuales" name="placas_actuales" value={formData.placas_actuales} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles} />
                            <TextField label="Placas Anteriores" name="placas_anteriores" value={formData.placas_anteriores} onChange={handleChange} fullWidth variant="outlined" sx={inputStyles} />
                            <TextField label="Número de Motor" name="numero_de_motor" value={formData.numero_de_motor} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles} />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                            <TextField select label="Marca" name="id_marca_de_vehiculo" value={formData.id_marca_de_vehiculo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione marca</MenuItem>
                                {catalogs.marcas.map(m => <MenuItem key={m.id_marca_de_vehiculo} value={m.id_marca_de_vehiculo}>{m.marca_de_vehiculo}</MenuItem>)}
                            </TextField>
                            <TextField select label="Tipo" name="id_tipo_de_vehiculo" value={formData.id_tipo_de_vehiculo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione tipo</MenuItem>
                                {catalogs.tipos.map(t => <MenuItem key={t.id_tipo_de_vehiculo} value={t.id_tipo_de_vehiculo}>{t.tipo_de_vehiculo}</MenuItem>)}
                            </TextField>
                            <TextField select label="Clase" name="id_clase_de_vehiculo" value={formData.id_clase_de_vehiculo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione clase</MenuItem>
                                {catalogs.clases.map(c => <MenuItem key={c.id_clase_de_vehiculo} value={c.id_clase_de_vehiculo}>{c.clase_de_vehiculo}</MenuItem>)}
                            </TextField>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                            <TextField select label="Estatus" name="id_estatus_de_vehiculo" value={formData.id_estatus_de_vehiculo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione estatus</MenuItem>
                                {catalogs.estatus.map(e => <MenuItem key={e.id_estatus_de_vehiculo} value={e.id_estatus_de_vehiculo}>{e.estatus_de_vehiculo}</MenuItem>)}
                            </TextField>
                            <TextField select label="Uso" name="id_uso_del_vehiculo" value={formData.id_uso_del_vehiculo} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione uso</MenuItem>
                                {catalogs.usos.map(u => <MenuItem key={u.id_uso_del_vehiculo} value={u.id_uso_del_vehiculo}>{u.uso_del_vehiculo}</MenuItem>)}
                            </TextField>
                            <TextField select label="Resguardatario" name="id_empleado" value={formData.id_empleado} onChange={handleChange} required fullWidth variant="outlined" sx={inputStyles}>
                                <MenuItem value="">Seleccione empleado</MenuItem>
                                {catalogs.empleados.map(e => <MenuItem key={e.id_empleado} value={e.id_empleado}>{e.nombres} {e.apellido1} {e.apellido2}</MenuItem>)}
                            </TextField>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button type="button" onClick={() => { resetForm(); setShowForm(false); }} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 700, px: 4, py: 1.2, borderRadius: '10px', '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#38bdf8', color: '#0f172a', borderRadius: '10px', textTransform: 'none', fontWeight: 800, boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)', px: 5, py: 1.2, '&:hover': { bgcolor: '#7dd3fc', boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)', transform: 'translateY(-1px)' }, '&:disabled': { bgcolor: '#334155', color: '#64748b' }, transition: 'all 0.2s' }}>
                                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    sx={{
                        bgcolor: '#38bdf8',
                        color: '#0f172a',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 800,
                        boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)',
                        px: 3,
                        py: 1,
                        '&:hover': {
                            bgcolor: '#7dd3fc',
                            boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    {showForm ? 'Ocultar Formulario' : 'Nuevo Vehículo'}
                </Button>

                <TextField
                    placeholder="Buscar vehículo..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>,
                        sx: {
                            borderRadius: '12px',
                            bgcolor: '#1e293b',
                            color: '#f8fafc',
                            fontWeight: 600,
                            outline: 'none !important',
                            '& fieldset': { borderColor: '#334155' },
                            '&:hover fieldset': { borderColor: '#38bdf8' },
                            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                            '& input': {
                                outline: 'none !important',
                                boxShadow: 'none !important'
                            },
                            '& input:focus': {
                                outline: 'none !important',
                                boxShadow: 'none !important'
                            },
                            '& input:focus-visible': {
                                outline: 'none !important',
                                boxShadow: 'none !important'
                            }
                        }
                    }}
                    sx={{
                        minWidth: 300,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#1e293b',
                            outline: 'none !important',
                            '&.Mui-focused': {
                                bgcolor: '#1e293b',
                                outline: 'none !important'
                            }
                        },
                        '& .MuiInputBase-input': {
                            bgcolor: 'transparent',
                            outline: 'none !important',
                            boxShadow: 'none !important',
                            '&:focus': {
                                outline: 'none !important',
                                boxShadow: 'none !important'
                            },
                            '&:focus-visible': {
                                outline: 'none !important',
                                boxShadow: 'none !important'
                            }
                        },
                        '& input': {
                            outline: 'none !important',
                            boxShadow: 'none !important'
                        }
                    }}
                />
            </Box>

            <TableContainer sx={{ pb: 0 }}>
                <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No. Económico</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modelo</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placas</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uso</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ borderBottom: 'none', color: '#64748b', py: 4 }}>
                                    No hay vehículos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((vehiculo) => (
                                <TableRow key={vehiculo.id_vehiculo} sx={{ backgroundColor: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)', borderRadius: '16px', transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s', '&:hover': { transform: 'translateY(-2px)', backgroundColor: '#334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' }, '& td': { borderBottom: 'none' }, '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }, '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' } }}>
                                    <TableCell align="center"><Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.875rem' }}>{vehiculo.numero_economico}</Typography></TableCell>
                                    <TableCell align="center"><Typography sx={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.8rem' }}>{vehiculo.marca_de_vehiculo}</Typography></TableCell>
                                    <TableCell align="center"><Typography sx={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.8rem' }}>{vehiculo.tipo_de_vehiculo}</Typography></TableCell>
                                    <TableCell align="center"><Typography sx={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.8rem' }}>{vehiculo.modelo}</Typography></TableCell>
                                    <TableCell align="center"><Chip label={vehiculo.placas_actuales} size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', fontWeight: 700, borderRadius: '6px', fontSize: '0.75rem' }} /></TableCell>
                                    <TableCell align="center"><Typography sx={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem' }}>{vehiculo.uso}</Typography></TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                            <IconButton
                                                onClick={() => handleEdit(vehiculo)}
                                                disableRipple
                                                size="small"
                                                sx={{
                                                    color: '#64748b',
                                                    bgcolor: 'transparent',
                                                    p: 0.5,
                                                    minWidth: 'auto',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    borderRadius: '6px',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        color: '#38bdf8',
                                                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}>
                                                <EditIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(vehiculo)}
                                                disabled={saving}
                                                disableRipple
                                                size="small"
                                                sx={{
                                                    color: '#64748b',
                                                    bgcolor: 'transparent',
                                                    p: 0.5,
                                                    minWidth: 'auto',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    borderRadius: '6px',
                                                    transition: 'all 0.2s',
                                                    opacity: saving ? 0.5 : 1,
                                                    '&:hover': {
                                                        color: '#ef4444',
                                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                        transform: saving ? 'none' : 'scale(1.1)'
                                                    }
                                                }}>
                                                <DeleteIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredVehiculos.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    <Button onClick={(e) => handleChangePage(e, Math.max(0, page - 1))} disabled={page === 0} variant="text" size="small" sx={{ textTransform: 'none', color: '#64748b', minWidth: 'auto', fontWeight: 600, '&:hover': { color: '#f8fafc', bgcolor: 'transparent' }, '&.Mui-disabled': { color: '#334155' } }}>
                        Anterior
                    </Button>
                    {[...Array(Math.ceil(filteredVehiculos.length / rowsPerPage))].map((_, idx) => (
                        <IconButton key={idx} onClick={(e) => handleChangePage(e, idx)} size="small" sx={{ width: 32, height: 32, fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px', backgroundColor: page === idx ? '#38bdf8' : 'transparent', color: page === idx ? '#0f172a' : '#64748b', '&:hover': { backgroundColor: page === idx ? '#7dd3fc' : 'rgba(255,255,255,0.05)', color: page === idx ? '#0f172a' : '#f8fafc' } }}>
                            {idx + 1}
                        </IconButton>
                    ))}
                    <Button onClick={(e) => handleChangePage(e, Math.min(Math.ceil(filteredVehiculos.length / rowsPerPage) - 1, page + 1))} disabled={page === Math.ceil(filteredVehiculos.length / rowsPerPage) - 1} variant="text" size="small" sx={{ textTransform: 'none', color: '#64748b', minWidth: 'auto', fontWeight: 600, '&:hover': { color: '#f8fafc', bgcolor: 'transparent' }, '&.Mui-disabled': { color: '#334155' } }}>
                        Siguiente
                    </Button>
                </Box>
            )}

            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, vehiculo: null })}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.7)',
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, color: '#f8fafc', pt: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'rgba(239, 68, 68, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <WarningIcon sx={{ fontSize: 35, color: '#ef4444' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                            Confirmar Eliminación
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1rem', mb: 2 }}>
                            ¿Estás seguro de eliminar el vehículo
                        </Typography>
                        {confirmDialog.vehiculo && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', mb: 2 }}>
                                <Chip
                                    label={`${confirmDialog.vehiculo.marca_de_vehiculo} ${confirmDialog.vehiculo.modelo}`}
                                    sx={{
                                        bgcolor: 'rgba(239, 68, 68, 0.15)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: '#ef4444',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        py: 2.5
                                    }}
                                />
                                <Chip
                                    label={`Placas: ${confirmDialog.vehiculo.placas_actuales}`}
                                    sx={{
                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </Box>
                        )}
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Esta acción no se puede deshacer
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={() => setConfirmDialog({ open: false, vehiculo: null })}
                        disabled={saving}
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
                        onClick={confirmarEliminar}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving && <CircularProgress size={20} color="inherit" />}
                        sx={{
                            bgcolor: '#ef4444',
                            color: '#fff',
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 800,
                            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
                            px: 4,
                            py: 1.2,
                            '&:hover': {
                                bgcolor: '#dc2626',
                                boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.5)',
                                transform: 'translateY(-1px)'
                            },
                            '&.Mui-disabled': {
                                bgcolor: '#334155',
                                color: '#64748b'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        {saving ? 'Eliminando...' : 'Eliminar Vehículo'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        bgcolor: snackbar.severity === 'success' ? '#1e293b' : snackbar.severity === 'error' ? '#450a0a' : '#422006',
                        color: snackbar.severity === 'success' ? '#22c55e' : snackbar.severity === 'error' ? '#ef4444' : '#fbbf24',
                        border: `1px solid ${snackbar.severity === 'success' ? '#22c55e' : snackbar.severity === 'error' ? '#ef4444' : '#fbbf24'}`,
                        borderRadius: '12px',
                        fontWeight: 600,
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? '#22c55e' : snackbar.severity === 'error' ? '#ef4444' : '#fbbf24'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Vehiculos;
