import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, Box, Tooltip, Chip, InputAdornment, Snackbar, Alert,
    CircularProgress, MenuItem, Select, FormControl, InputLabel, Autocomplete
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon,
    CheckCircle as CheckCircleIcon,
    PostAdd as PostAddIcon,
    CalendarMonth as CalendarMonthIcon,
    Pending as PendingIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const Tramites = ({ user }) => {
    const [tramites, setTramites] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDetallesModal, setOpenDetallesModal] = useState(false);
    const [selectedTramite, setSelectedTramite] = useState(null);
    const [comisionesVinculadas, setComisionesVinculadas] = useState([]);
    const [comisionesBusqueda, setComisionesBusqueda] = useState([]);
    const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [empleadosConComisiones, setEmpleadosConComisiones] = useState([]);
    const [loadingBusqueda, setLoadingBusqueda] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [firmasDisponibles, setFirmasDisponibles] = useState([]);
    const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1);
    const [filtroAnio] = useState(new Date().getFullYear());

    // Notification & Dialog states
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

    const [formData, setFormData] = useState({
        id_tramite: null,
        fecha: '',
        observaciones: '',
        id_firma: ''
    });

    useEffect(() => {
        cargarTramites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showMessage = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const cargarFirmas = async () => {
        if (!user || !user.id_empleado) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/api/firmas/empleado/${user.id_empleado}`);
            if (response.data.success) {
                setFirmasDisponibles(response.data.firmas);
            }
        } catch (error) {
            console.error('Error cargando firmas:', error);
        }
    };

    const cargarTramites = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tramites`);
            if (response.data.success) {
                setTramites(response.data.tramites);
            }
        } catch (error) {
            console.error('Error cargando tramites:', error);
            showMessage('Error al cargar trámites', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (tramite = null) => {
        cargarFirmas();
        if (tramite) {
            setFormData({
                id_tramite: tramite.id_tramite,
                fecha: tramite.fecha.split('T')[0],
                observaciones: tramite.observaciones || '',
                id_firma: tramite.id_firma || 'USER_SIGNATURE'
            });
        } else {
            setFormData({
                id_tramite: null,
                fecha: new Date().toISOString().split('T')[0],
                observaciones: '',
                id_firma: 'USER_SIGNATURE'
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({
            id_tramite: null,
            fecha: '',
            observaciones: '',
            id_firma: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = {
                ...formData,
                id_firma: formData.id_firma === 'USER_SIGNATURE' ? null : formData.id_firma
            };

            if (formData.id_tramite) {
                await axios.put(`${API_BASE_URL}/api/tramites/${formData.id_tramite}`, payload);
                showMessage('Trámite actualizado correctamente');
            } else {
                await axios.post(`${API_BASE_URL}/api/tramites`, payload);
                showMessage('Trámite creado correctamente');
            }

            handleCloseModal();
            cargarTramites();
        } catch (error) {
            console.error('Error guardando tramite:', error);
            showMessage('Error al guardar el trámite', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEliminar = async () => {
        setActionLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/tramites/${deleteConfirm.id}`);
            cargarTramites();
            showMessage('Trámite eliminado correctamente');
        } catch (error) {
            console.error('Error eliminando tramite:', error);
            showMessage('Error al eliminar el trámite', 'error');
        } finally {
            setActionLoading(false);
            setDeleteConfirm({ open: false, id: null });
        }
    };

    const handleVerDetalles = async (tramite) => {
        setSelectedTramite(tramite);
        setBusquedaEmpleado('');
        setEmpleadoSeleccionado(null);
        setComisionesBusqueda([]);
        await cargarDetallesTramite(tramite.id_tramite);
        await cargarEmpleadosConComisiones();
        setOpenDetallesModal(true);
        // Cargar lista inicial de comisiones disponibles
        setTimeout(() => handleBuscarComisiones(''), 100);
    };

    const cargarEmpleadosConComisiones = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tramites/empleados-con-comisiones`);
            if (response.data.success) {
                setEmpleadosConComisiones(response.data.empleados);
            }
        } catch (error) {
            console.error('Error cargando empleados con comisiones:', error);
        }
    };

    const cargarDetallesTramite = async (id_tramite) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tramites/${id_tramite}/detalles`);
            if (response.data.success) {
                setComisionesVinculadas(response.data.comisiones);
            }
        } catch (error) {
            console.error('Error cargando detalles:', error);
            showMessage('Error al cargar comisiones vinculadas', 'error');
        }
    };

    const handleBuscarComisiones = async (valorFiltro = null) => {
        let busqueda = '';

        if (valorFiltro !== null) {
            busqueda = valorFiltro;
        } else if (empleadoSeleccionado) {
            busqueda = empleadoSeleccionado.nombre_completo;
        } else {
            busqueda = busquedaEmpleado;
        }

        setLoadingBusqueda(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tramites/comisiones-disponibles?empleado=${busqueda}`);
            if (response.data.success) {
                setComisionesBusqueda(response.data.comisiones);
            }
        } catch (error) {
            console.error('Error buscando comisiones:', error);
            showMessage('Error al buscar comisiones', 'error');
        } finally {
            setLoadingBusqueda(false);
        }
    };

    const handleVincular = async (id_memo) => {
        setActionLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/tramites/${selectedTramite.id_tramite}/vincular-comision`,
                { id_memorandum_comision: id_memo }
            );
            if (response.data.success) {
                showMessage('Comisión vinculada correctamente');
                cargarDetallesTramite(selectedTramite.id_tramite);
                handleBuscarComisiones();
                cargarTramites(); // Refrescar lista principal para ver el nuevo importe
            }
        } catch (error) {
            console.error('Error vinculando:', error);
            showMessage('Error al vincular comisión', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDesvincular = async (id_memo) => {
        setActionLoading(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/tramites/${selectedTramite.id_tramite}/desvincular-comision/${id_memo}`);
            if (response.data.success) {
                showMessage('Comisión desvinculada');
                cargarDetallesTramite(selectedTramite.id_tramite);
                cargarTramites();
            }
        } catch (error) {
            console.error('Error desvinculando:', error);
            showMessage('Error al desvincular comisión', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#0f172a',
            borderRadius: '12px',
            color: '#f8fafc',
            '& fieldset': { borderColor: '#334155' },
            '&:hover fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused': { bgcolor: '#0f172a' },
            '& .MuiOutlinedInput-input': { bgcolor: 'transparent !important' },
        },
        '& .MuiInputLabel-root': { color: '#94a3b8' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
        '& .MuiSelect-icon': { color: '#38bdf8' },
        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: '#38bdf8' }
    };

    const filteredTramites = tramites.filter(t => {
        const fecha = new Date(t.fecha);
        return (fecha.getMonth() + 1) === parseInt(filtroMes) && fecha.getFullYear() === parseInt(filtroAnio);
    });

    return (
        <Box sx={{ p: 4, bgcolor: '#0f172a', minHeight: '100%' }}>
            {/* Header section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 900, letterSpacing: '-0.025em' }}>
                        Trámites <span style={{ color: '#38bdf8' }}>Realizados</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                        Registro histórico y gestión de envíos
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 200, ...inputStyles }}>
                        <InputLabel id="filtro-mes-label">Filtrar por Mes</InputLabel>
                        <Select
                            labelId="filtro-mes-label"
                            value={filtroMes}
                            label="Filtrar por Mes"
                            onChange={(e) => setFiltroMes(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <CalendarMonthIcon />
                                </InputAdornment>
                            }
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('es-MX', { month: 'long' }).charAt(0).toUpperCase() +
                                        new Date(0, i).toLocaleString('es-MX', { month: 'long' }).slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-2px)' },
                            height: 40,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 800,
                            boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Nuevo Trámite
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflowX: 'hidden' }}>
                <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 12px', tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="15%" sx={{ color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', pl: 3 }}>Status</TableCell>
                            <TableCell width="15%" align="center" sx={{ color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Folio / ID</TableCell>
                            <TableCell width="20%" align="center" sx={{ color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha</TableCell>
                            <TableCell width="20%" align="center" sx={{ color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Importe Total</TableCell>
                            <TableCell width="30%" align="center" sx={{ color: '#94a3b8', border: 'none', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', pr: 3 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                                <TableCell colSpan={5} align="center" sx={{ py: 8, border: 'none' }}>
                                    <CircularProgress sx={{ color: '#38bdf8' }} />
                                </TableCell>
                            </TableRow>
                        ) : filteredTramites.length === 0 ? (
                            <TableRow sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                                <TableCell colSpan={5} align="center" sx={{ py: 8, border: 'none' }}>
                                    <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                        No hay trámites registrados en este periodo
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTramites.map((tramite) => (
                                <TableRow
                                    key={tramite.id_tramite}
                                    sx={{
                                        bgcolor: '#1e293b',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.01)',
                                            bgcolor: '#334155',
                                            '& .action-btn': { opacity: 1 }
                                        },
                                    }}
                                >
                                    <TableCell sx={{ border: 'none', borderRadius: '16px 0 0 16px', pl: 3 }}>
                                        {tramite.enviado ? (
                                            <Chip
                                                icon={<CheckCircleIcon style={{ color: '#065f46', fontSize: '1rem' }} />}
                                                label="Enviado"
                                                size="small"
                                                sx={{ bgcolor: '#dcfce7', color: '#065f46', fontWeight: 800, fontSize: '0.7rem' }}
                                            />
                                        ) : (
                                            <Chip
                                                icon={<PendingIcon style={{ color: '#92400e', fontSize: '1rem' }} />}
                                                label="Pendiente"
                                                size="small"
                                                sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: 'none', color: '#38bdf8', fontWeight: 900 }}>
                                        #{tramite.folio || tramite.id_tramite}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: 'none', color: '#f8fafc', fontWeight: 600 }}>
                                        {new Date(tramite.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: 'none', color: '#f8fafc', fontWeight: 800 }}>
                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(tramite.importe || 0)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: 'none', borderRadius: '0 16px 16px 0', pr: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    disabled={actionLoading}
                                                    onClick={() => handleOpenModal(tramite)}
                                                    sx={{ width: 28, height: 28, p: 0, color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)', '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' } }}
                                                >
                                                    <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    disabled={actionLoading || tramite.enviado}
                                                    onClick={() => setDeleteConfirm({ open: true, id: tramite.id_tramite })}
                                                    sx={{ width: 28, height: 28, p: 0, color: '#f87171', bgcolor: 'rgba(248, 113, 113, 0.1)', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.2)' } }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Detalles">
                                                <IconButton
                                                    onClick={() => handleVerDetalles(tramite)}
                                                    sx={{ width: 28, height: 28, p: 0, color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)', '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.2)' } }}
                                                >
                                                    <PostAddIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Imprimir">
                                                <IconButton
                                                    sx={{ width: 28, height: 28, p: 0, color: '#94a3b8', bgcolor: 'rgba(148, 163, 184, 0.1)', '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.2)' } }}
                                                >
                                                    <PrintIcon sx={{ fontSize: '1.2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Crear/Editar */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#1e293b', backgroundImage: 'none', borderRadius: '24px', border: '1px solid #334155' }
                }}
            >
                <DialogTitle sx={{ color: '#f8fafc', fontWeight: 900, pb: 1 }}>
                    {formData.id_tramite ? 'Editar Trámite' : 'Nuevo Trámite'}
                </DialogTitle>
                <form onSubmit={handleGuardar}>
                    <DialogContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                            <TextField
                                label="Fecha"
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={inputStyles}
                            />
                            <TextField
                                label="Solicita (Usted)"
                                value={user ? `${user.nombres} ${user.apellidos}` : 'Usuario Actual'}
                                fullWidth
                                disabled
                                sx={inputStyles}
                                InputProps={{ sx: { bgcolor: 'rgba(15, 23, 42, 0.5) !important' } }}
                            />
                            <TextField
                                select
                                label="Autoriza"
                                name="id_firma"
                                value={formData.id_firma}
                                onChange={handleChange}
                                fullWidth
                                required
                                sx={inputStyles}
                            >
                                <MenuItem value="USER_SIGNATURE">
                                    {user ? `${user.nombres} ${user.apellidos}` : 'Usuario Actual'} (Autofirma)
                                </MenuItem>
                                {firmasDisponibles.map((firma) => (
                                    <MenuItem key={firma.id_firma} value={firma.id_firma}>
                                        {firma.nombre_firma} - {firma.cargo_firma}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Observaciones"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Observaciones adicionales..."
                                sx={inputStyles}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 4, pt: 2 }}>
                        <Button onClick={handleCloseModal} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'none' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={actionLoading}
                            sx={{
                                bgcolor: '#38bdf8',
                                color: '#0f172a',
                                fontWeight: 800,
                                textTransform: 'none',
                                borderRadius: '12px',
                                px: 4,
                                '&:hover': { bgcolor: '#7dd3fc' }
                            }}
                        >
                            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Trámite'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dashboard Modal de Detalles/Comisiones */}
            <Dialog
                open={openDetallesModal}
                onClose={() => setOpenDetallesModal(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#0f172a', borderRadius: '24px', border: '1px solid #1e293b' }
                }}
            >
                <DialogTitle sx={{
                    color: '#f8fafc',
                    fontWeight: 900,
                    pb: 2,
                    borderBottom: '1px solid #1e293b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'rgba(30, 41, 59, 0.5)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
                            <PostAddIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>Comisiones del Trámite</Typography>
                            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
                                FOLIO: #{selectedTramite?.folio || selectedTramite?.id_tramite}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={() => setOpenDetallesModal(false)}
                        sx={{
                            p: 0,
                            width: 28,
                            height: 28,
                            color: '#64748b',
                            bgcolor: 'rgba(100, 116, 139, 0.1)',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            minWidth: 28
                        }}
                    >
                        <CloseIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: '#0f172a' }}>
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Buscador de Comisiones */}
                        <Box sx={{
                            p: 2.5,
                            bgcolor: '#1e293b',
                            borderRadius: '20px',
                            border: '1px solid #334155',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                🔍 Vincular Nueva Comisión
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: comisionesBusqueda.length > 0 ? 2 : 0 }}>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    loading={loadingBusqueda}
                                    options={empleadosConComisiones}
                                    getOptionLabel={(option) => option.nombre_completo}
                                    value={empleadoSeleccionado}
                                    onChange={(event, newValue) => {
                                        setEmpleadoSeleccionado(newValue);
                                        if (newValue) {
                                            handleBuscarComisiones(newValue.nombre_completo);
                                        } else {
                                            setComisionesBusqueda([]);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Seleccionar empleado con comisiones..."
                                            sx={{
                                                ...inputStyles,
                                                '& .MuiOutlinedInput-root': {
                                                    ...inputStyles['& .MuiOutlinedInput-root'],
                                                    bgcolor: '#0f172a',
                                                }
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <PostAddIcon sx={{ color: '#64748b', fontSize: '1.2rem', ml: 1 }} />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    // Estilos para el dropdown
                                    componentsProps={{
                                        paper: {
                                            sx: {
                                                bgcolor: '#1e293b',
                                                color: '#f8fafc',
                                                border: '1px solid #334155',
                                                '& .MuiAutocomplete-option': {
                                                    '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)' },
                                                    '&[aria-selected="true"]': { bgcolor: 'rgba(56, 189, 248, 0.2)' },
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {comisionesBusqueda.length > 0 && (
                                <TableContainer component={Paper} sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid #334155', maxHeight: 300, overflowX: 'hidden' }}>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 800, borderBottom: '1px solid #334155', minWidth: 100 }} align="center">Folio</TableCell>
                                                <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 800, borderBottom: '1px solid #334155', minWidth: 200 }}>Empleado</TableCell>
                                                <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 800, borderBottom: '1px solid #334155' }} align="center">Total</TableCell>
                                                <TableCell sx={{ bgcolor: '#1e293b', color: '#94a3b8', fontWeight: 800, borderBottom: '1px solid #334155' }} align="center">Acción</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {comisionesBusqueda.map((c) => (
                                                <TableRow key={c.id_memorandum_comision} sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.05)' } }}>
                                                    <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 800, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>{c.folio_comision}</TableCell>
                                                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(51, 65, 85, 0.5)', whiteSpace: 'nowrap' }}>{c.empleado_nombre}</TableCell>
                                                    <TableCell align="center" sx={{ color: '#2dd4bf', fontWeight: 900, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>${parseFloat(c.total).toFixed(2)}</TableCell>
                                                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => handleVincular(c.id_memorandum_comision)}
                                                            sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 800, borderRadius: '8px', textTransform: 'none', border: '1px solid rgba(56, 189, 248, 0.2)', '&:hover': { bgcolor: '#38bdf8', color: '#0f172a' } }}
                                                        >
                                                            Vincular
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>

                        {/* Comisiones Vinculadas */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                📋 Comisiones en este Trámite
                            </Typography>
                            {comisionesVinculadas.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#1e293b', borderRadius: '20px', border: '2px dashed #334155' }}>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                        No hay comisiones vinculadas a este trámite.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: '20px', border: '1px solid #334155', overflowX: 'hidden' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ bgcolor: '#243146', color: '#94a3b8', fontWeight: 800, py: 1.5, minWidth: 100 }} align="center">Folio Comisión</TableCell>
                                                <TableCell sx={{ bgcolor: '#243146', color: '#94a3b8', fontWeight: 800, py: 1.5, minWidth: 200 }}>Empleado</TableCell>
                                                <TableCell sx={{ bgcolor: '#243146', color: '#94a3b8', fontWeight: 800, py: 1.5 }} align="center">Total</TableCell>
                                                <TableCell sx={{ bgcolor: '#243146', color: '#94a3b8', fontWeight: 800, py: 1.5 }} align="center">Acción</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {comisionesVinculadas.map((c) => (
                                                <TableRow key={c.id_memorandum_comision} sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.03)' } }}>
                                                    <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 900, borderBottom: '1px solid #334155' }}>
                                                        <Chip label={c.folio_comision} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.2)' }} />
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #334155', whiteSpace: 'nowrap' }}>{c.empleado_nombre}</TableCell>
                                                    <TableCell align="center" sx={{ color: '#f8fafc', fontWeight: 800, borderBottom: '1px solid #334155' }}>${parseFloat(c.total).toFixed(2)}</TableCell>
                                                    <TableCell align="center" sx={{ borderBottom: '1px solid #334155' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDesvincular(c.id_memorandum_comision)}
                                                            sx={{
                                                                p: 0,
                                                                width: 28,
                                                                height: 28,
                                                                color: '#f87171',
                                                                bgcolor: 'rgba(248, 113, 113, 0.1)',
                                                                borderRadius: '50%',
                                                                '&:hover': { bgcolor: '#ef4444', color: '#ffffff' },
                                                                transition: 'all 0.2s',
                                                                flexShrink: 0,
                                                                minWidth: 28
                                                            }}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>

                        {/* TOTAL BOX */}
                        <Box sx={{
                            mt: 1,
                            p: 3,
                            bgcolor: '#0f172a',
                            borderRadius: '24px',
                            border: '1px solid #38bdf8',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.1)',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                bgcolor: '#38bdf8'
                            }
                        }}>
                            <Box>
                                <Typography sx={{ color: '#38bdf8', fontWeight: 900, letterSpacing: '0.1em', fontSize: '0.75rem' }}>RESUMEN FINANCIERO</Typography>
                                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900 }}>Importe Total del Trámite</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>TOTAL ACUMULADO</Typography>
                                <Typography variant="h4" sx={{ color: '#38bdf8', fontWeight: 900, letterSpacing: '-0.02em' }}>
                                    ${comisionesVinculadas.reduce((sum, c) => sum + parseFloat(c.total), 0).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                open={deleteConfirm.open}
                onClose={() => !actionLoading && setDeleteConfirm({ open: false, id: null })}
                PaperProps={{
                    sx: { bgcolor: '#1e293b', backgroundImage: 'none', borderRadius: '24px', border: '1px solid #334155' }
                }}
            >
                <DialogTitle sx={{ color: '#f8fafc', fontWeight: 900 }}>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#94a3b8' }}>
                        ¿Está seguro de que desea eliminar este trámite? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteConfirm({ open: false, id: null })} sx={{ color: '#94a3b8' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEliminar}
                        disabled={actionLoading}
                        variant="contained"
                        sx={{ bgcolor: '#f87171', color: '#ffffff', '&:hover': { bgcolor: '#ef4444' } }}
                    >
                        {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar Trámite'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Tramites;
