import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography,
    TextField, Button, CircularProgress, Grid, Paper, Chip, IconButton,
    Alert, Snackbar, MenuItem, Select, FormControl, InputLabel,
    Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, InputAdornment
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    LocalGasStation as GasIcon,
    Flight as FlightIcon,
    MoreHoriz as MoreIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Hotel as HotelIcon,
    AccessTime as TimeIcon,
    Calculate as CalculateIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Person as PersonIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const ViaticosModal = ({ isOpen, onClose, idMemorandum, idEmpleado, onUpdate }) => {
    const [municipios, setMunicipios] = useState([]);
    const [firmas, setFirmas] = useState([]);
    const [firmasFijasDisponibles, setFirmasFijasDisponibles] = useState([]);  // Nuevo estado
    const [detalles, setDetalles] = useState([]);
    const [fechaActividad, setFechaActividad] = useState(null);  // Fecha de la actividad del memorandum
    const [gastosGlobales, setGastosGlobales] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null }); // Estado para confirmación themed

    const [formData, setFormData] = useState({
        id_municipio: '',
        id_estado: null,
        id_pais: null,
        fecha_inicio: '',
        fecha_fin: '',
        dias: 0,
        pernocta: false,
        monto_diario: 0,
        pasaje: 0,
        combustible: 0,
        otros: 0,
        tipo: '',
        id_firma_autoriza: '',
        id_firma_fija: ''
    });

    const [totalCalculado, setTotalCalculado] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Función para validar si la fecha de inicio es válida (debe ser DESPUÉS de la fecha de actividad)
    const esFechaInicioValida = (fechaInicio) => {
        if (!fechaActividad || !fechaInicio) return true;

        const fechaAct = new Date(fechaActividad);
        const fechaIni = new Date(fechaInicio);

        // La fecha de inicio debe ser MAYOR (no igual) a la fecha de actividad
        return fechaIni > fechaAct;
    };

    // Función para validar si la fecha de fin es válida
    const esFechaFinValida = (fechaFin) => {
        if (!fechaActividad || !fechaFin) return true;

        const fechaAct = new Date(fechaActividad);
        const fechaF = new Date(fechaFin);

        // La fecha de fin también debe ser MAYOR (no igual) a la fecha de actividad
        return fechaF > fechaAct;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isOpen) {
            cargarCatalogos();
            cargarDetalles();
        }
    }, [isOpen, idMemorandum]);

    useEffect(() => {
        // Si NO pernocta, el total es solo el monto diario (sin multiplicar por días)
        // Si SÍ pernocta, el total es monto_diario * días
        const total = formData.pernocta
            ? (parseFloat(formData.monto_diario) || 0) * (parseFloat(formData.dias) || 0)
            : (parseFloat(formData.monto_diario) || 0);
        setTotalCalculado(total);
    }, [formData.monto_diario, formData.dias, formData.pernocta]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (formData.id_municipio && idEmpleado) {
            calcularTarifa();
        }
    }, [formData.id_municipio, formData.pernocta]);

    const cargarCatalogos = async () => {
        try {
            const resM = await axios.get(`${API_BASE_URL}/api/catalogos/municipios`);
            setMunicipios(resM.data.municipios);

            // Cargar firma del memorandum
            const resMemoFirma = await axios.get(
                `${API_BASE_URL}/api/memorandum/${idMemorandum}/firma`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            // Cargar firmas fijas dinámicas (puede haber múltiples)
            const resFirmaFija = await axios.get(
                `${API_BASE_URL}/api/catalogos/firma-fija`
            );

            if (resMemoFirma.data.firma && resFirmaFija.data.firmas && resFirmaFija.data.firmas.length > 0) {
                const firmasFijas = resFirmaFija.data.firmas;
                setFirmasFijasDisponibles(firmasFijas);

                // Guardar fecha de actividad para validación
                if (resMemoFirma.data.firma.fecha_actividad) {
                    setFechaActividad(resMemoFirma.data.firma.fecha_actividad);
                }

                // Si solo hay una firma fija, auto-seleccionarla
                const firmaFijaSeleccionada = firmasFijas.length === 1 ? firmasFijas[0] : null;

                // Guardar ambas firmas para mostrar en UI
                setFirmas([
                    resMemoFirma.data.firma,  // Firma del memorandum
                    firmaFijaSeleccionada     // Firma fija (puede ser null si hay múltiples)
                ]);

                // Guardar la firma del memorandum en formData
                setFormData(prev => ({
                    ...prev,
                    id_firma_autoriza: resMemoFirma.data.firma.id_firma,
                    id_firma_fija: firmaFijaSeleccionada ? firmaFijaSeleccionada.id_firma : ''
                }));
            }
        } catch (error) {
            console.error('Error cargando catalogos modal:', error);
        }
    };

    const cargarDetalles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/viaticos/memorandum/${idMemorandum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setDetalles(res.data.detalles);
                setGastosGlobales(res.data.gastosGlobales);

                // Si hay gastos globales, pre-cargar en el formulario
                if (res.data.gastosGlobales) {
                    setFormData(prev => ({
                        ...prev,
                        pasaje: res.data.gastosGlobales.pasaje || 0,
                        combustible: res.data.gastosGlobales.combustible || 0,
                        otros: res.data.gastosGlobales.otros || 0,
                        tipo: res.data.gastosGlobales.tipo_pago || ''
                    }));
                }
            }
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    const calcularTarifa = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/viaticos/calcular`, {
                id_empleado: idEmpleado,
                id_municipio: formData.id_municipio,
                pernocta: formData.pernocta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setFormData(prev => ({ ...prev, monto_diario: res.data.tarifa }));
            }
        } catch (error) {
            console.error('Error calculando tarifa:', error);
        }
    };

    const calcularDias = (inicio, fin) => {
        if (!inicio || !fin) return 0;
        const start = new Date(inicio);
        const end = new Date(fin);

        // Reset hours to compare only dates
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end < start) return 0;

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference only
        return diffDays;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Cálculo automático de días si cambian las fechas
            if (name === 'fecha_inicio' || name === 'fecha_fin') {
                const totalDias = calcularDias(newData.fecha_inicio, newData.fecha_fin);
                newData.dias = totalDias;
            }

            // Validaciones de Pernocta
            if (name === 'pernocta' && checked) {
                // Si intenta activar pernocta y las fechas son iguales
                if (newData.fecha_inicio === newData.fecha_fin && newData.fecha_inicio !== '') {
                    setSnackbar({
                        open: true,
                        message: 'La pernocta requiere que las fechas de inicio y fin sean diferentes',
                        severity: 'warning'
                    });
                    newData.pernocta = false;
                }
            } else if (name === 'pernocta' && !checked) {
                // Si intenta quitar pernocta y las fechas son diferentes
                if (newData.fecha_inicio !== newData.fecha_fin && newData.fecha_inicio !== '' && newData.fecha_fin !== '') {
                    setSnackbar({
                        open: true,
                        message: 'Sin pernocta, las fechas de inicio y fin deben ser iguales',
                        severity: 'warning'
                    });
                    // Agrego una advertencia proactiva pero no bloqueo el toggle aquí para dejar que el usuario corrija las fechas
                }
            }

            // Si se cambian las fechas, validar consistencia con el estado actual de pernocta
            if (name === 'fecha_inicio' || name === 'fecha_fin') {
                if (newData.fecha_inicio !== '' && newData.fecha_fin !== '') {
                    if (newData.pernocta && newData.fecha_inicio === newData.fecha_fin) {
                        setSnackbar({
                            open: true,
                            message: 'Pernocta detectada en el mismo día. Desactivando pernocta...',
                            severity: 'info'
                        });
                        newData.pernocta = false;
                    }
                }
            }

            return newData;
        });
    };

    // Función para validar que una fecha no se use más de 2 veces
    const validarUsoFechas = (fechaInicio, fechaFin) => {
        // Crear un mapa para contar cuántas veces se usa cada fecha
        const conteoFechas = {};

        // Contar fechas en viáticos existentes
        detalles.forEach(detalle => {
            const inicio = new Date(detalle.fecha_inicio);
            const fin = new Date(detalle.fecha_fin);

            // Iterar por cada día del rango
            for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
                const fechaStr = d.toISOString().split('T')[0];
                conteoFechas[fechaStr] = (conteoFechas[fechaStr] || 0) + 1;
            }
        });

        // Verificar las fechas del nuevo viático
        const nuevoInicio = new Date(fechaInicio);
        const nuevoFin = new Date(fechaFin);
        const fechasConflicto = [];

        for (let d = new Date(nuevoInicio); d <= nuevoFin; d.setDate(d.getDate() + 1)) {
            const fechaStr = d.toISOString().split('T')[0];
            const usos = conteoFechas[fechaStr] || 0;

            if (usos >= 2) {
                fechasConflicto.push(new Date(fechaStr).toLocaleDateString('es-MX'));
            }
        }

        return fechasConflicto;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id_firma_autoriza || !formData.tipo) {
            setSnackbar({ open: true, message: 'Faltan datos obligatorios (Firma o Tipo de Pago)', severity: 'warning' });
            return;
        }

        // Validación final de pernocta
        if (formData.pernocta) {
            if (formData.fecha_inicio === formData.fecha_fin) {
                setSnackbar({ open: true, message: 'La pernocta requiere que las fechas de inicio y fin sean diferentes', severity: 'error' });
                return;
            }
        } else {
            // No pernocta
            if (formData.fecha_inicio !== formData.fecha_fin) {
                setSnackbar({ open: true, message: 'Sin pernocta, las fechas de inicio y fin deben ser iguales', severity: 'error' });
                return;
            }
        }

        // Validar uso de fechas (máximo 2 veces por fecha)
        const fechasConflicto = validarUsoFechas(formData.fecha_inicio, formData.fecha_fin);
        if (fechasConflicto.length > 0) {
            setSnackbar({
                open: true,
                message: `No se puede agregar: Las fechas ${fechasConflicto.slice(0, 2).join(', ')}${fechasConflicto.length > 2 ? '...' : ''} ya se usaron 2 veces`,
                severity: 'error'
            });
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_memorandum_comision: idMemorandum,
                id_municipio: formData.id_municipio,
                id_estado: formData.id_estado,
                id_pais: formData.id_pais,
                fecha_inicio: formData.fecha_inicio,
                fecha_fin: formData.fecha_fin,
                dias: formData.pernocta ? parseFloat(formData.dias) : 0.5,
                pernocta: formData.pernocta,
                monto_calculado: totalCalculado,
                monto_diario: formData.monto_diario,
                pasaje: 0,
                combustible: 0,
                otros: 0,
                tipo_pago: formData.tipo,
                id_firma_autoriza: formData.id_firma_autoriza,
                id_firma_fija: formData.id_firma_fija
            };

            await axios.post(`${API_BASE_URL}/api/viaticos`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSnackbar({ open: true, message: 'Viático agregado correctamente', severity: 'success' });
            cargarDetalles();
            setFormData(prev => ({
                ...prev,
                id_municipio: '',
                monto_diario: 0,
                fecha_inicio: '',
                fecha_fin: '',
                dias: 0,
                pernocta: false
            }));

        } catch (error) {
            console.error('Error guardando viatico:', error);
            setSnackbar({ open: true, message: 'Error al guardar el viático', severity: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleAgregarGastos = async () => {
        if ((parseFloat(formData.pasaje) || 0) === 0 &&
            (parseFloat(formData.combustible) || 0) === 0 &&
            (parseFloat(formData.otros) || 0) === 0) {
            setSnackbar({ open: true, message: 'Debe ingresar al menos un gasto', severity: 'warning' });
            return;
        }

        if (!formData.tipo) {
            setSnackbar({ open: true, message: 'Debe seleccionar el Tipo de Pago', severity: 'warning' });
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');

            const payload = {
                id_memorandum_comision: idMemorandum,
                pasaje: parseFloat(formData.pasaje) || 0,
                combustible: parseFloat(formData.combustible) || 0,
                otros: parseFloat(formData.otros) || 0,
                tipo_pago: formData.tipo,
                id_firma_autoriza: formData.id_firma_autoriza,
                id_firma_fija: formData.id_firma_fija
            };

            await axios.post(`${API_BASE_URL}/api/gastos-globales`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSnackbar({ open: true, message: 'Gastos globales actualizados', severity: 'success' });
            cargarDetalles();

            setFormData(prev => ({
                ...prev,
                pasaje: 0,
                combustible: 0,
                otros: 0
            }));

        } catch (error) {
            console.error('Error guardando gastos globales:', error);
            setSnackbar({ open: true, message: 'Error al guardar gastos globales', severity: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const eliminarDetalle = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleConfirmDelete = async () => {
        const id = deleteConfirm.id;
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/viaticos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSnackbar({ open: true, message: 'Registro eliminado correctamente', severity: 'success' });
            cargarDetalles();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
        } finally {
            setActionLoading(false);
            setDeleteConfirm({ open: false, id: null });
        }
    };
    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#0f172a',
            color: '#f8fafc',
            borderRadius: '12px',
            '& fieldset': { borderColor: '#334155' },
            '&:hover fieldset': { borderColor: '#475569' },
            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
            '& input': {
                bgcolor: 'transparent',
                // Quitar flechitas (spin buttons)
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                },
                '&[type=number]': {
                    '-moz-appearance': 'textfield',
                },
                '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px #0f172a inset !important',
                    WebkitTextFillColor: '#f8fafc !important',
                    transition: 'background-color 5000s ease-in-out 0s',
                },
            },
        },
        '& .MuiInputLabel-root': { color: '#64748b' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
        '& .MuiSelect-icon': { color: '#64748b' }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#0f172a',
                    color: '#f8fafc',
                    borderRadius: '24px',
                    backgroundImage: 'none',
                    border: '1px solid #1e293b',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }
            }}
        >
            <DialogTitle sx={{
                py: 2.2,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #1e293b'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <CalculateIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                            Cálculo de Viáticos
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mt: -0.2 }}>
                            Oficio de Comisión • Gestión de Gastos
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: '#64748b',
                        width: 28,
                        height: 28,
                        p: 0,
                        '&:hover': { color: '#f8fafc', bgcolor: '#1e293b' }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 4, pt: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* SECCIÓN 1: GASTOS GLOBALES */}
                    <Paper sx={{
                        p: 3,
                        bgcolor: '#1e293b',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            color: '#38bdf8',
                            fontWeight: 800,
                            mb: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <MoneyIcon sx={{ fontSize: 20 }} /> Gastos Globales
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Pasajes"
                                    name="pasaje"
                                    type="number"
                                    value={formData.pasaje}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><FlightIcon sx={{ fontSize: 18, color: '#64748b' }} /></InputAdornment>,
                                    }}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Combustible"
                                    name="combustible"
                                    type="number"
                                    value={formData.combustible}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><GasIcon sx={{ fontSize: 18, color: '#64748b' }} /></InputAdornment>,
                                    }}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Otros"
                                    name="otros"
                                    type="number"
                                    value={formData.otros}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><MoreIcon sx={{ fontSize: 18, color: '#64748b' }} /></InputAdornment>,
                                    }}
                                    sx={inputStyles}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small" sx={inputStyles}>
                                    <InputLabel id="tipo-pago-label">Tipo Pago</InputLabel>
                                    <Select
                                        labelId="tipo-pago-label"
                                        label="Tipo Pago"
                                        name="tipo"
                                        value={formData.tipo}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                        <MenuItem value="Efectivo">Efectivo 💵</MenuItem>
                                        <MenuItem value="Cheque">Cheque 📝</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAgregarGastos}
                                    disabled={actionLoading || !formData.tipo}
                                    startIcon={actionLoading ? <CircularProgress size={20} /> : <AddIcon />}
                                    sx={{
                                        bgcolor: '#38bdf8',
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        py: 1,
                                        '&:hover': { bgcolor: '#7dd3fc' },
                                        mt: 1
                                    }}
                                >
                                    {gastosGlobales ? 'Actualizar Gastos Globales' : 'Agregar Gastos Globales'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* SECCIÓN 2: CALCULADORA DE VIÁTICOS */}
                    <Paper sx={{
                        p: 3,
                        bgcolor: '#1e293b',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="subtitle1" sx={{
                            color: '#2dd4bf',
                            fontWeight: 800,
                            mb: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CalculateIcon sx={{ fontSize: 20 }} /> Calculadora de Viáticos
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="small" sx={inputStyles}>
                                        <InputLabel id="municipio-label">Municipio Destino</InputLabel>
                                        <Select
                                            labelId="municipio-label"
                                            label="Municipio Destino"
                                            name="id_municipio"
                                            value={formData.id_municipio}
                                            onChange={handleInputChange}
                                            required
                                            startAdornment={<LocationIcon sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />}
                                        >
                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                            {municipios.map(m => (
                                                <MenuItem key={m.id_municipio} value={m.id_municipio}>{m.descripcion}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tarifa Diaria"
                                        value={`$${parseFloat(formData.monto_diario || 0).toFixed(2)}`}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: <InputAdornment position="start"><MoneyIcon sx={{ fontSize: 18, color: '#2dd4bf' }} /></InputAdornment>,
                                            sx: { pointerEvents: 'none' } // Evitar interacción y efecto de click
                                        }}
                                        sx={{
                                            ...inputStyles,
                                            '& .MuiOutlinedInput-root': {
                                                ...inputStyles['& .MuiOutlinedInput-root'],
                                                bgcolor: '#1e293b',
                                                '& input': {
                                                    fontWeight: 800,
                                                    color: '#2dd4bf',
                                                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                        '-webkit-appearance': 'none',
                                                        margin: 0,
                                                    },
                                                    '&:-webkit-autofill': {
                                                        WebkitBoxShadow: '0 0 0 100px #1e293b inset !important',
                                                        WebkitTextFillColor: '#2dd4bf !important',
                                                    },
                                                },
                                                // Forzar borde estático para evitar efectos al enfocar
                                                '& fieldset': { borderColor: '#334155 !important' },
                                                '&:hover fieldset': { borderColor: '#334155 !important' },
                                                '&.Mui-focused fieldset': { borderColor: '#334155 !important' },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 2,
                                        py: 0.5,
                                        bgcolor: '#0f172a',
                                        borderRadius: '12px',
                                        border: '1px solid #334155',
                                        height: '40px'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HotelIcon sx={{ fontSize: 18, color: '#64748b' }} />
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Pernocta</Typography>
                                        </Box>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.pernocta}
                                                    onChange={(e) => handleInputChange({ target: { name: 'pernocta', type: 'checkbox', checked: e.target.checked } })}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#2dd4bf' },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2dd4bf' }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    color: formData.pernocta ? '#2dd4bf' : '#64748b',
                                                    minWidth: 40
                                                }}>
                                                    {formData.pernocta ? 'SÍ' : 'NO'}
                                                </Typography>
                                            }
                                            labelPlacement="start"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Fecha Inicio"
                                        name="fecha_inicio"
                                        type="date"
                                        value={formData.fecha_inicio}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        error={!esFechaInicioValida(formData.fecha_inicio) && !!formData.fecha_inicio}
                                        helperText={!esFechaInicioValida(formData.fecha_inicio) && !!formData.fecha_inicio ? `Debe ser después del ${new Date(fechaActividad).toLocaleDateString()}` : ''}
                                        sx={inputStyles}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Fecha Fin"
                                        name="fecha_fin"
                                        type="date"
                                        value={formData.fecha_fin}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        error={!esFechaFinValida(formData.fecha_fin) && !!formData.fecha_fin}
                                        helperText={!esFechaFinValida(formData.fecha_fin) && !!formData.fecha_fin ? `Debe ser después del ${new Date(fechaActividad).toLocaleDateString()}` : ''}
                                        sx={inputStyles}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: '#0f172a',
                                        border: '1px dashed #334155',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3
                                    }}>
                                        {formData.pernocta && (
                                            <TextField
                                                label="Días"
                                                name="dias"
                                                type="number"
                                                step="0.5"
                                                value={formData.dias}
                                                onChange={handleInputChange}
                                                size="small"
                                                sx={{ ...inputStyles, maxWidth: 100 }}
                                            />
                                        )}
                                        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>TOTAL PROYECTADO</Typography>
                                            <Typography variant="h4" sx={{ color: '#2dd4bf', fontWeight: 900 }}>${totalCalculado.toFixed(2)}</Typography>
                                        </Box>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={actionLoading}
                                            startIcon={actionLoading ? <CircularProgress size={20} /> : <AddIcon />}
                                            sx={{
                                                bgcolor: '#2dd4bf',
                                                color: '#0f172a',
                                                fontWeight: 800,
                                                borderRadius: '10px',
                                                px: 3,
                                                '&:hover': { bgcolor: '#5eead4' }
                                            }}
                                        >
                                            Agregar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

                    {/* SECCIÓN 3: VIÁTICOS REGISTRADOS (ROW-CARD LAYOUT) */}
                    <Box>
                        <Typography variant="subtitle1" sx={{
                            color: '#64748b',
                            fontWeight: 800,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em'
                        }}>
                            📋 Viáticos Registrados
                            {detalles.length > 0 && detalles[0].folio_comision && (
                                <Chip
                                    label={`FOLIO: ${detalles[0].folio_comision}`}
                                    size="small"
                                    sx={{
                                        ml: 2,
                                        bgcolor: 'rgba(56, 189, 248, 0.1)',
                                        color: '#38bdf8',
                                        fontWeight: 800,
                                        border: '1px solid rgba(56, 189, 248, 0.2)'
                                    }}
                                />
                            )}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {detalles.map((d) => (
                                <Paper key={d.id_detalle_viatico} sx={{
                                    p: 2,
                                    bgcolor: '#1e293b',
                                    borderRadius: '16px',
                                    border: '1px solid #334155',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#243146', transform: 'translateY(-2px)' }
                                }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: '10px',
                                                    bgcolor: d.municipio_nombre ? 'rgba(56, 189, 248, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                                    color: d.municipio_nombre ? '#38bdf8' : '#eab308'
                                                }}>
                                                    {d.municipio_nombre ? <LocationIcon sx={{ fontSize: 20 }} /> : <MoneyIcon sx={{ fontSize: 20 }} />}
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
                                                        {d.municipio_nombre || 'Gastos Globales'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                        {d.municipio_nombre ? 'Lugar de Comisión' : 'Administración'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                                <Box>
                                                    <Typography sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        {d.fecha_inicio ? new Date(d.fecha_inicio).toLocaleDateString() : '-'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Inicio</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box>
                                                    <Typography sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        {d.fecha_fin ? new Date(d.fecha_fin).toLocaleDateString() : '-'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Fin</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={1}>
                                            <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {d.dias}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'center' }}>Días</Typography>
                                        </Grid>

                                        <Grid item xs={6} sm={2}>
                                            <Typography sx={{ color: d.municipio_nombre ? '#38bdf8' : '#eab308', fontWeight: 900, fontSize: '1rem', textAlign: 'right' }}>
                                                ${parseFloat(d.monto_calculado || 0).toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'right' }}>Monto</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                                            <IconButton
                                                onClick={() => eliminarDetalle(d.id_detalle_viatico)}
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}

                            {detalles.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #1e293b', borderRadius: '16px' }}>
                                    <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                        📭 Sin viáticos asignados
                                    </Typography>
                                </Box>
                            )}

                            {/* Fila de Totales */}
                            <Paper sx={{
                                p: 2,
                                bgcolor: '#0f172a',
                                borderRadius: '16px',
                                border: '1px solid #38bdf8',
                                mt: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 900 }}>
                                        TOTAL GENERAL
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                                        Viáticos + Gastos Globales
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: '#38bdf8', fontWeight: 900 }}>
                                    ${(
                                        detalles.reduce((sum, d) => sum + parseFloat(d.monto_calculado || 0), 0) +
                                        (gastosGlobales ? (parseFloat(gastosGlobales.pasaje || 0) + parseFloat(gastosGlobales.combustible || 0) + parseFloat(gastosGlobales.otros || 0)) : 0)
                                    ).toFixed(2)}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>

                    {/* SECCIÓN DE FIRMAS */}
                    <Paper sx={{
                        p: 3,
                        bgcolor: '#1e293b',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            ✍️ Firmas del Memorándum
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>AUTORIZA</Typography>
                                    <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {firmas[0]?.nombre_firma || 'Cargando...'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                        {firmas[0]?.cargo_firma}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                {firmasFijasDisponibles.length > 1 ? (
                                    <FormControl fullWidth size="small" sx={inputStyles}>
                                        <InputLabel id="firma-fija-label">Jefe de Unidad (Firma Fija)</InputLabel>
                                        <Select
                                            labelId="firma-fija-label"
                                            label="Jefe de Unidad (Firma Fija)"
                                            name="id_firma_fija"
                                            value={formData.id_firma_fija}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                            {firmasFijasDisponibles.map(firma => (
                                                <MenuItem key={firma.id_firma} value={firma.id_firma}>
                                                    {firma.nombre_firma}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>JEFE DE UNIDAD</Typography>
                                        <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
                                            {firmas[1]?.nombre_firma || 'Cargando...'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                                            {firmas[1]?.cargo_firma}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </DialogContent>


            {/* DIÁLOGO DE CONFIRMACIÓN PARA ELIMINAR */}
            <Dialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                PaperProps={{
                    sx: {
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        borderRadius: '20px',
                        border: '1px solid #334155',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <WarningIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Confirmar Eliminación</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        ¿Está seguro que desea eliminar este registro de viático? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteConfirm({ open: false, id: null })}
                        sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={actionLoading}
                        variant="contained"
                        sx={{
                            bgcolor: '#ef4444',
                            '&:hover': { bgcolor: '#dc2626' },
                            borderRadius: '10px',
                            fontWeight: 800,
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Eliminar Registro'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default ViaticosModal;
