import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Box, Typography, TextField, CircularProgress, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
    InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
    Alert, Select, MenuItem, InputLabel, FormControl, Avatar, Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AddCircle as AddIcon,
    Business as BusinessIcon,
    Mail as MailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';

const GestionEmpleados = () => {
    const [employees, setEmployees] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        id_empleado: null,
        prefijo: '',
        nombres: '',
        apellido1: '',
        apellido2: '',
        correo: '',
        telefonos_oficina: '',
        id_area: '',
        id_lugar_fisico_de_trabajo: '',
        rfc: '',
        num_empleado: '',
        curp: '',
        id_nss: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/empleados/full`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setEmployees(response.data.empleados);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            showSnackbar('Error al cargar empleados', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAreas = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/catalogos/areas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setAreas(response.data.areas);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchAreas();
    }, [fetchEmployees, fetchAreas]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setFormData({
                id_empleado: employee.id_empleado,
                prefijo: employee.prefijo || '',
                nombres: employee.nombres || '',
                apellido1: employee.apellido1 || '',
                apellido2: employee.apellido2 || '',
                correo: employee.correo || '',
                telefonos_oficina: employee.telefonos_oficina || '',
                id_area: employee.id_area || '',
                id_lugar_fisico_de_trabajo: employee.id_lugar_fisico_de_trabajo || '',
                rfc: employee.rfc || '',
                num_empleado: employee.num_empleado || '',
                curp: employee.curp || '',
                nss: employee.nss || ''
            });
        } else {
            setFormData({
                id_empleado: null,
                prefijo: '',
                nombres: '',
                apellido1: '',
                apellido2: '',
                correo: '',
                telefonos_oficina: '',
                id_area: '',
                id_lugar_fisico_de_trabajo: '',
                rfc: '',
                num_empleado: '',
                curp: '',
                nss: ''
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = async () => {
        if (!formData.nombres || !formData.apellido1 || !formData.rfc) {
            showSnackbar('Nombre, Primer Apellido y RFC son obligatorios', 'warning');
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (formData.id_empleado) {
                await axios.put(`${API_BASE_URL}/api/empleados/${formData.id_empleado}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showSnackbar('Empleado actualizado correctamente');
            } else {
                await axios.post(`${API_BASE_URL}/api/empleados`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showSnackbar('Empleado creado correctamente');
            }
            fetchEmployees();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving employee:', error);
            showSnackbar('Error al guardar empleado', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este empleado?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/empleados/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showSnackbar('Empleado eliminado correctamente');
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            showSnackbar('Error al eliminar empleado', 'error');
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
        emp.rfc?.toLowerCase().includes(search.toLowerCase()) ||
        emp.area_nombre?.toLowerCase().includes(search.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#0f172a',
            borderRadius: '12px',
            color: '#f8fafc',
            '& fieldset': { borderColor: '#334155', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused': { bgcolor: '#0f172a' },
            '& .MuiOutlinedInput-input': {
                bgcolor: 'transparent !important',
                '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #0f172a inset !important',
                    WebkitTextFillColor: '#f8fafc !important',
                }
            },
        },
        '& .MuiInputBase-input': { color: '#f8fafc', fontWeight: 600 },
        '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
        '& .MuiSelect-icon': { color: '#64748b' }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonIcon sx={{ fontSize: 40, color: '#38bdf8' }} />
                        Gestión de Personal
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Administra la información básica y laboral de los empleados
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{
                        bgcolor: '#38bdf8',
                        color: '#0f172a',
                        borderRadius: '12px',
                        fontWeight: 800,
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    Nuevo Empleado
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nombre, RFC o área..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#38bdf8' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        ...inputStyles,
                        '& .MuiOutlinedInput-root': {
                            ...inputStyles['& .MuiOutlinedInput-root'],
                            bgcolor: '#1e293b',
                            borderRadius: '16px',
                            '&.Mui-focused': { bgcolor: '#1e293b' },
                            '& .MuiOutlinedInput-input': {
                                ...inputStyles['& .MuiOutlinedInput-root']['& .MuiOutlinedInput-input'],
                                '&:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #1e293b inset !important',
                                    WebkitTextFillColor: '#f8fafc !important',
                                }
                            }
                        }
                    }}
                />
            </Box>

            <TableContainer component={Paper} sx={{
                bgcolor: '#1e293b',
                borderRadius: '20px',
                border: '1px solid #334155',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                overflowX: 'hidden'
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                        <CircularProgress sx={{ color: '#38bdf8' }} />
                    </Box>
                ) : (
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
                                <TableCell align="left" sx={{ color: '#64748b', fontWeight: 800, borderBottom: '1px solid #334155', width: 180, pl: 4 }}>Empleado</TableCell>
                                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 800, borderBottom: '1px solid #334155', width: 140 }}>RFC / CURP</TableCell>
                                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 800, borderBottom: '1px solid #334155', width: 220 }}>Área / Lugar de Trabajo</TableCell>
                                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 800, borderBottom: '1px solid #334155', width: 180 }}>Categoría / Cargo</TableCell>
                                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 800, borderBottom: '1px solid #334155', width: 100 }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedEmployees.map((emp) => (
                                <TableRow key={emp.id_empleado} sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.03)' }, transition: 'background-color 0.2s' }}>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #334155', py: 2.5, pl: 4, width: 180 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                                                {emp.nombres.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    {emp.nombre_completo}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #334155', py: 2.5, width: 140 }}>
                                        <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.8rem' }}>{emp.rfc}</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>{emp.curp}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #334155', py: 2.5, width: 220 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                            <Chip
                                                size="small"
                                                icon={<BusinessIcon style={{ color: '#38bdf8', fontSize: 11 }} />}
                                                label={emp.area_nombre}
                                                sx={{
                                                    bgcolor: 'rgba(56, 189, 248, 0.05)',
                                                    color: '#94a3b8',
                                                    border: '1px solid rgba(56, 189, 248, 0.1)',
                                                    height: 'auto',
                                                    minHeight: 18,
                                                    fontSize: '0.65rem',
                                                    '& .MuiChip-label': { px: 1, py: 0.5, whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.1 }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.65rem', fontWeight: 500, textAlign: 'center' }}>
                                                <LocationIcon sx={{ fontSize: 11 }} /> {emp.lugar_trabajo_nombre || 'No asignado'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #334155', py: 2.5, width: 180 }}>
                                        <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem', lineHeight: 1.2, whiteSpace: 'normal' }}>
                                            {emp.literal_viatico} - {emp.cargo || 'Sin cargo'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #334155', py: 2.5, width: '100px' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'nowrap' }}>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenModal(emp)}
                                                    sx={{
                                                        color: '#38bdf8',
                                                        width: 32,
                                                        height: 32,
                                                        p: 0,
                                                        bgcolor: 'rgba(56, 189, 248, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.15)' }
                                                    }}
                                                >
                                                    <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(emp.id_empleado)}
                                                    sx={{
                                                        color: '#ef4444',
                                                        width: 32,
                                                        height: 32,
                                                        p: 0,
                                                        bgcolor: 'rgba(239, 68, 68, 0.05)',
                                                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {filteredEmployees.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
                    <Button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            minWidth: 'auto',
                            fontWeight: 600,
                            '&:hover': { color: '#f8fafc', bgcolor: 'transparent' },
                            '&.Mui-disabled': { color: '#334155' }
                        }}
                    >
                        Anterior
                    </Button>

                    {(() => {
                        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
                        const start = Math.max(0, page - 4);
                        const end = Math.min(totalPages - 1, page + 4);
                        const pages = [];
                        for (let i = start; i <= end; i++) pages.push(i);

                        return pages.map((idx) => (
                            <IconButton
                                key={idx}
                                onClick={() => setPage(idx)}
                                size="small"
                                sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    backgroundColor: page === idx ? '#38bdf8' : 'transparent',
                                    color: page === idx ? '#0f172a' : '#64748b',
                                    '&:hover': {
                                        backgroundColor: page === idx ? '#7dd3fc' : 'rgba(255,255,255,0.05)',
                                        color: page === idx ? '#0f172a' : '#f8fafc'
                                    }
                                }}
                            >
                                {idx + 1}
                            </IconButton>
                        ));
                    })()}

                    <Button
                        onClick={() => setPage(Math.min(Math.ceil(filteredEmployees.length / rowsPerPage) - 1, page + 1))}
                        disabled={page === Math.ceil(filteredEmployees.length / rowsPerPage) - 1}
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            minWidth: 'auto',
                            fontWeight: 600,
                            '&:hover': { color: '#f8fafc', bgcolor: 'transparent' },
                            '&.Mui-disabled': { color: '#334155' }
                        }}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}

            {/* Modal de Formulario Empleado */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '24px', bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 900, pt: 4, letterSpacing: '-0.025em' }}>
                    {formData.id_empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
                </DialogTitle>
                <DialogContent sx={{ px: 4, pb: 4 }}>
                    <Box component="form" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mt: 2 }}>
                        {/* Datos Básicos */}
                        <TextField
                            label="Prefijo (Lic., Dr., etc.)"
                            value={formData.prefijo}
                            onChange={(e) => setFormData({ ...formData, prefijo: e.target.value })}
                            sx={inputStyles}
                        />
                        <TextField
                            label="Nombres"
                            value={formData.nombres}
                            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                            sx={inputStyles}
                            required
                        />
                        <TextField
                            label="Primer Apellido"
                            value={formData.apellido1}
                            onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                            sx={inputStyles}
                            required
                        />
                        <TextField
                            label="Segundo Apellido"
                            value={formData.apellido2}
                            onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })}
                            sx={inputStyles}
                        />
                        <TextField
                            label="Correo Electrónico"
                            type="email"
                            value={formData.correo}
                            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                            sx={inputStyles}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><MailIcon sx={{ color: '#64748b', fontSize: 20 }} /></InputAdornment>
                            }}
                        />
                        <TextField
                            label="Teléfonos Oficina"
                            value={formData.telefonos_oficina}
                            onChange={(e) => setFormData({ ...formData, telefonos_oficina: e.target.value })}
                            sx={inputStyles}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#64748b', fontSize: 20 }} /></InputAdornment>
                            }}
                        />

                        {/* Datos Laborales */}
                        <TextField
                            label="RFC"
                            value={formData.rfc}
                            onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                            sx={inputStyles}
                            required
                        />
                        <TextField
                            label="CURP"
                            value={formData.curp}
                            onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                            sx={inputStyles}
                        />
                        <TextField
                            label="Número de Empleado"
                            value={formData.num_empleado}
                            onChange={(e) => setFormData({ ...formData, num_empleado: e.target.value })}
                            sx={inputStyles}
                        />
                        <TextField
                            label="NSS"
                            value={formData.nss}
                            onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                            sx={inputStyles}
                        />

                        {/* Dropdowns */}
                        <FormControl fullWidth sx={inputStyles}>
                            <InputLabel>Área de Adscripción</InputLabel>
                            <Select
                                value={formData.id_area}
                                label="Área de Adscripción"
                                onChange={(e) => setFormData({ ...formData, id_area: e.target.value })}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {areas.map(a => (
                                    <MenuItem key={a.id_area} value={a.id_area}>{a.descripcion}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={inputStyles}>
                            <InputLabel>Lugar Físico de Trabajo</InputLabel>
                            <Select
                                value={formData.id_lugar_fisico_de_trabajo}
                                label="Lugar Físico de Trabajo"
                                onChange={(e) => setFormData({ ...formData, id_lugar_fisico_de_trabajo: e.target.value })}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {areas.map(a => (
                                    <MenuItem key={a.id_area} value={a.id_area}>{a.descripcion}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
                    <Button onClick={handleCloseModal} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={actionLoading}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            borderRadius: '12px',
                            fontWeight: 800,
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            '&:hover': { bgcolor: '#7dd3fc' }
                        }}
                    >
                        {actionLoading ? 'Guardando...' : 'Guardar Empleado'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GestionEmpleados;
