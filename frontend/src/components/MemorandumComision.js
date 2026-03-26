import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Box, Typography, TextField, CircularProgress, Button, Select, MenuItem,
  InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Autocomplete
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  Search as SearchIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Paid as PaidIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import ViaticosModal from './ViaticosModal';

const MemorandumComision = () => {
  const [showViaticosModal, setShowViaticosModal] = useState(false);
  const [selectedMemoForViaticos, setSelectedMemoForViaticos] = useState(null);
  const [formData, setFormData] = useState({
    id_actividad: '',
    id_empleado: '',
    periodo_inicio: '',
    periodo_fin: '',
    tipo_transporte: '',
    id_vehiculo: '',
    id_firma: '',
    observaciones: '',
    id_memorandum_comision: null
  });

  const [actividades, setActividades] = useState([]);
  const [selectedActivityDate, setSelectedActivityDate] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [firmasDisponibles, setFirmasDisponibles] = useState([]);
  const [memorandums, setMemorandums] = useState([]);
  const [busquedaFolio, setBusquedaFolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      // Assuming the delete route will be implemented at /api/memorandum/:id
      await axios.delete(`${API_BASE_URL}/api/memorandum/${confirmDialog.id}`);
      setSnackbar({ open: true, message: 'Memorandum eliminado con éxito', severity: 'success' });
      setConfirmDialog({ open: false, id: null });
      cargarMemorandums();
    } catch (error) {
      console.error('Error eliminando memorandum:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar el memorandum',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    cargarActividades();
    cargarEmpleados();
    cargarVehiculos();
    cargarMemorandums();
  }, []);

  useEffect(() => {
    if (formData.id_actividad) {
      const act = actividades.find(a => a.id_actividad === formData.id_actividad);
      if (act) {
        setSelectedActivityDate(act.fecha.split('T')[0]);
      }
    } else {
      setSelectedActivityDate(null);
    }
  }, [formData.id_actividad, actividades]);

  useEffect(() => {
    if (formData.id_empleado) {
      cargarFirmasPorEmpleado(formData.id_empleado);
    } else {
      setFirmasDisponibles([]);
    }
  }, [formData.id_empleado]);

  useEffect(() => {
    setPage(0);
  }, [busquedaFolio]);

  const cargarActividades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/actividades`);
      setActividades(response.data.actividades);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/empleados`);
      setEmpleados(response.data.empleados);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehiculos`);
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error cargando vehiculos:', error);
    }
  };

  const cargarMemorandums = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/memorandum`);
      if (response.data.success) {
        setMemorandums(response.data.memorandums);
      }
    } catch (error) {
      console.error('Error cargando memorandums:', error);
    }
  };

  const cargarFirmasPorEmpleado = async (id_empleado) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/firmas/empleado/${id_empleado}`);
      const firmas = response.data.firmas;
      setFirmasDisponibles(firmas);
      if (firmas.length > 0) {
        setFormData(prev => ({ ...prev, id_firma: firmas[0].id_firma }));
      }
    } catch (error) {
      console.error('Error cargando firmas:', error);
      setFirmasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Auto-adjust end date if start date is changed to be after it
      if (name === 'periodo_inicio' && newData.periodo_fin && value > newData.periodo_fin) {
        newData.periodo_fin = value;
      }

      return newData;
    });
  };

  const formatDateSafe = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const esFechaValida = (fecha, esInicio = true) => {
    if (!fecha) return { valida: true };

    // Validar contra la actividad
    if (selectedActivityDate) {
      if (fecha < selectedActivityDate) {
        return {
          valida: false,
          msg: `La fecha no puede ser anterior a la actividad (${formatDateSafe(selectedActivityDate)})`
        };
      }
    }

    // Validar fin contra inicio
    if (!esInicio && formData.periodo_inicio) {
      if (fecha < formData.periodo_inicio) {
        return {
          valida: false,
          msg: 'La fecha de fin no puede ser anterior al inicio'
        };
      }
    }

    return { valida: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_empleado) {
      setSnackbar({ open: true, message: 'Seleccione un empleado válido', severity: 'warning' });
      return;
    }

    const valInicio = esFechaValida(formData.periodo_inicio, true);
    const valFin = esFechaValida(formData.periodo_fin, false);

    if (!valInicio.valida || !valFin.valida) {
      setSnackbar({
        open: true,
        message: valInicio.msg || valFin.msg || 'Revise las fechas seleccionadas',
        severity: 'error'
      });
      return;
    }

    setActionLoading(true);
    try {
      const isEditing = formData.id_memorandum_comision !== null;

      const url = isEditing
        ? `${API_BASE_URL}/api/memorandum/${formData.id_memorandum_comision}`
        : `${API_BASE_URL}/api/memorandum`;

      const method = isEditing ? 'put' : 'post';

      const response = await axios[method](url, formData);

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: isEditing ? 'Memorandum actualizado con éxito' : 'Memorandum guardado con éxito',
          severity: 'success'
        });
        resetForm();
        cargarMemorandums();
      }
    } catch (error) {
      console.error('Error guardando/actualizando memorandum:', error);
      setSnackbar({ open: true, message: 'Error al procesar el memorandum', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (memo) => {
    setFormData({
      id_actividad: memo.id_actividad,
      id_empleado: memo.id_empleado,
      periodo_inicio: memo.periodo_inicio.split('T')[0],
      periodo_fin: memo.periodo_fin.split('T')[0],
      tipo_transporte: memo.tipo_transporte,
      id_vehiculo: memo.id_vehiculo || '',
      id_firma: memo.id_firma,
      observaciones: memo.observaciones || '',
      id_memorandum_comision: memo.id_memorandum_comision
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      id_actividad: '',
      id_empleado: '',
      periodo_inicio: '',
      periodo_fin: '',
      tipo_transporte: '',
      id_vehiculo: '',
      id_firma: '',
      observaciones: '',
      id_memorandum_comision: null
    });
    setFirmasDisponibles([]);
    setShowForm(false);
  };

  const handleDescargarReporte = async (id, tipo = 'memorandum') => {
    try {
      setSnackbar({ open: true, message: 'Generando reporte, por favor espere...', severity: 'info' });
      const response = await axios.get(`${API_BASE_URL}/api/reportes/${tipo}/${id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
      setSnackbar({ open: true, message: 'Reporte abierto con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error descargando reporte:', error);
      setSnackbar({ open: true, message: 'Error al descargar el reporte', severity: 'error' });
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#1e293b',
      '& fieldset': { borderColor: '#334155', borderWidth: 2 },
      '&:hover fieldset': { borderColor: '#38bdf8' },
      '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
      '& input, & textarea': {
        color: '#f8fafc',
        fontWeight: 600,
        bgcolor: 'transparent !important',
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px #1e293b inset !important',
          WebkitTextFillColor: '#f8fafc !important',
        },
        '&:focus': { bgcolor: 'transparent !important' }
      },
      '&.Mui-focused': { bgcolor: '#1e293b !important' }
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
    '& .MuiSelect-icon': { color: '#64748b' }
  };

  const memorandumsFiltrados = memorandums.filter(memo => {
    const id = memo.id_memorandum_comision?.toString() || '';
    const folio = memo.folio?.toString() || '';
    return id.includes(busquedaFolio) || folio.includes(busquedaFolio);
  });

  const visibleRows = useMemo(
    () =>
      memorandumsFiltrados.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [memorandumsFiltrados, page, rowsPerPage],
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
      {/* Header section - Removed flex from here to use more specific list-header style */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentIcon sx={{ fontSize: 40, color: '#38bdf8' }} />
          Gestión de Memorandum
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, mt: 0.5 }}>
          Oficios de Comisión • <span style={{ color: '#38bdf8' }}>Administración</span>
        </Typography>
      </Box>

      {/* List Header: Button & Search aligned on same line */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        mt: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
            sx={{
              bgcolor: '#38bdf8',
              color: '#0f172a',
              fontWeight: 800,
              px: 3,
              height: 40,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)',
              '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-1px)' },
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {showForm ? 'Ocultar Formulario' : (formData.id_memorandum_comision ? 'Editando Memorandum' : 'Nuevo Memorandum')}
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon sx={{ color: '#38bdf8' }} /> Historial de Comisiones
          </Typography>
        </Box>

        <TextField
          placeholder="Filtrar por folio..."
          value={busquedaFolio}
          onChange={(e) => setBusquedaFolio(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>,
            sx: {
              height: 40,
              borderRadius: '12px',
              bgcolor: '#1e293b',
              color: '#f8fafc',
              '& fieldset': { borderColor: '#334155' }
            }
          }}
          sx={{ minWidth: 280 }}
        />
      </Box>

      {/* Capture Form */}
      {showForm && (
        <Paper elevation={0} sx={{
          p: 4,
          borderRadius: '24px',
          bgcolor: '#1e293b',
          border: '1px solid #334155',
          mb: 5,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Actividad Relacionada</InputLabel>
                <Select
                  name="id_actividad"
                  value={actividades.some(a => a.id_actividad === formData.id_actividad) ? formData.id_actividad : ''}
                  onChange={handleChange}
                  label="Actividad Relacionada"
                  required
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="" disabled>Seleccione una actividad</MenuItem>
                  {actividades.map(act => (
                    <MenuItem key={act.id_actividad} value={act.id_actividad}>
                      {act.motivo} - {formatDateSafe(act.fecha.split('T')[0])}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                options={empleados}
                getOptionLabel={(option) => `${option.nombres} ${option.apellido1} ${option.apellido2}`}
                value={empleados.find(e => e.id_empleado === formData.id_empleado) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, id_empleado: newValue ? newValue.id_empleado : '' }));
                }}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box key={key} component="li" {...optionProps} sx={{ bgcolor: '#1e293b !important', color: '#f8fafc' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{option.nombres} {option.apellido1} {option.apellido2}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{option.lugar_trabajo_nombre || 'Sin lugar asignado'}</Typography>
                      </Box>
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empleado Comisionado"
                    required
                    sx={inputStyles}
                  />
                )}
                sx={{ '& .MuiAutocomplete-paper': { bgcolor: '#1e293b' } }}
              />

              <TextField
                label="Inicio del Período"
                type="date"
                name="periodo_inicio"
                value={formData.periodo_inicio}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!esFechaValida(formData.periodo_inicio, true).valida}
                helperText={esFechaValida(formData.periodo_inicio, true).msg}
                sx={inputStyles}
              />

              <TextField
                label="Fin del Período"
                type="date"
                name="periodo_fin"
                value={formData.periodo_fin}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!esFechaValida(formData.periodo_fin, false).valida}
                helperText={esFechaValida(formData.periodo_fin, false).msg}
                sx={inputStyles}
              />

              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Tipo de Transporte</InputLabel>
                <Select
                  name="tipo_transporte"
                  value={formData.tipo_transporte}
                  onChange={handleChange}
                  label="Tipo de Transporte"
                  required
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="publico">Público</MenuItem>
                  <MenuItem value="oficial">Oficial</MenuItem>
                  <MenuItem value="aereo">Aéreo</MenuItem>
                </Select>
              </FormControl>

              {formData.tipo_transporte === 'oficial' && (
                <FormControl fullWidth sx={inputStyles}>
                  <InputLabel>Vehículo Oficial</InputLabel>
                  <Select
                    name="id_vehiculo"
                    value={vehiculos.some(v => v.id_vehiculo === formData.id_vehiculo) ? formData.id_vehiculo : ''}
                    onChange={handleChange}
                    label="Vehículo Oficial"
                    required
                    sx={{ borderRadius: '12px' }}
                  >
                    {vehiculos.map(veh => (
                      <MenuItem key={veh.id_vehiculo} value={veh.id_vehiculo}>
                        {veh.marca_de_vehiculo} {veh.modelo} - {veh.placas_actuales}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Firma que Autoriza</InputLabel>
                <Select
                  name="id_firma"
                  value={firmasDisponibles.some(f => f.id_firma === formData.id_firma) ? formData.id_firma : ''}
                  onChange={handleChange}
                  label="Firma que Autoriza"
                  required
                  sx={{ borderRadius: '12px' }}
                  disabled={loading || firmasDisponibles.length === 0}
                >
                  {firmasDisponibles.map(f => (
                    <MenuItem key={f.id_firma} value={f.id_firma}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{f.nombre_firma} - {f.cargo_firma}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{f.tipo_asignacion === 'area' ? 'Firma de Área' : 'Firma Adicional'}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {firmasDisponibles.length === 0 && formData.id_empleado && !loading && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, fontWeight: 600 }}>
                    ⚠️ Empleado sin firmas asignadas
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  name="observaciones"
                  label="Observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Detalles adicionales de la comisión..."
                  sx={inputStyles}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!!actionLoading || !!(formData.id_empleado && firmasDisponibles.length === 0)}
                startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                sx={{
                  bgcolor: '#38bdf8',
                  color: '#0f172a',
                  fontWeight: 800,
                  px: 6,
                  py: 1.5,
                  borderRadius: '14px',
                  textTransform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.4)',
                  '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-2px)' },
                  '&:disabled': { bgcolor: '#334155', color: '#64748b' }
                }}
              >
                {actionLoading ? 'Guardando...' : (formData.id_memorandum_comision ? 'Actualizar Memorandum' : 'Generar Memorandum')}
              </Button>
              <Button onClick={resetForm} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'none' }}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* List Header */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon sx={{ color: '#38bdf8' }} /> Historial de Comisiones
      </Typography>

      {/* Row-Card List */}
      <TableContainer sx={{ pb: 4, overflowX: 'hidden' }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 10px', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ '& th': { border: 'none', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' } }}>
              <TableCell width="10%" align="center">Folio</TableCell>
              <TableCell width="15%" align="center">Fecha Comisión</TableCell>
              <TableCell width="30%" align="center">Información del Comisionado</TableCell>
              <TableCell width="25%" align="center">Ubicación</TableCell>
              <TableCell width="20%" align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell colSpan={5} align="center" sx={{ border: 'none', py: 10, color: '#475569' }}>
                  No se encontraron memorandums registrados
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((memo) => (
                <TableRow
                  key={memo.id_memorandum_comision}
                  sx={{
                    bgcolor: '#1e293b',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#334155', transform: 'translateY(-2px)' },
                    '& td': { border: 'none' },
                    '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                    '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                  }}
                >
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#38bdf8' }}>#{memo.folio || memo.id_memorandum_comision}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatDateSafe(memo.periodo_inicio.split('T')[0])}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>Inicio Periodo</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ maxWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                      <PersonIcon sx={{ color: '#64748b', flexShrink: 0 }} />
                      <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                        <Typography sx={{
                          color: '#cbd5e1',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          lineHeight: 1.2,
                          wordBreak: 'break-word',
                          whiteSpace: 'normal'
                        }}>
                          {memo.empleado_nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Comisionado
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ maxWidth: 220 }}>
                    <Box sx={{ display: 'inline-block', textAlign: 'left', minWidth: 0 }}>
                      <Typography sx={{
                        color: '#cbd5e1',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        {memo.municipio_nombre || memo.lugar || 'N/A'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        Punto de Destino
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(memo)}
                          sx={{
                            color: '#64748b',
                            border: '1px solid #334155',
                            p: 0.5,
                            minWidth: 'auto',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '8px',
                            '&:hover': { color: '#38bdf8', borderColor: '#38bdf8', bgcolor: 'rgba(56,189,248,0.05)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reporte Memo">
                        <IconButton
                          size="small"
                          onClick={() => handleDescargarReporte(memo.id_memorandum_comision)}
                          sx={{
                            color: '#64748b',
                            border: '1px solid #334155',
                            p: 0.5,
                            minWidth: 'auto',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '8px',
                            '&:hover': { color: '#2dd4bf', borderColor: '#2dd4bf', bgcolor: 'rgba(45,212,191,0.05)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <PdfIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reporte Oficial (Memorándum)">
                        <IconButton
                          size="small"
                          onClick={() => handleDescargarReporte(memo.id_memorandum_comision, 'memorandum-oficial')}
                          sx={{
                            color: '#64748b',
                            border: '1px solid #334155',
                            p: 0.5,
                            minWidth: 'auto',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '8px',
                            '&:hover': { color: '#38bdf8', borderColor: '#38bdf8', bgcolor: 'rgba(56,189,248,0.05)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <PdfIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Gastos / Viáticos">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedMemoForViaticos(memo);
                            setShowViaticosModal(true);
                          }}
                          sx={{
                            color: '#f8fafc',
                            bgcolor: '#e91e63',
                            border: '1px solid transparent',
                            p: 0.5,
                            minWidth: 'auto',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '8px',
                            '&:hover': { bgcolor: '#f06292', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <PaidIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => setConfirmDialog({ open: true, id: memo.id_memorandum_comision })}
                          disabled={!!actionLoading}
                          sx={{
                            color: '#64748b',
                            border: '1px solid #334155',
                            p: 0.5,
                            minWidth: 'auto',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '8px',
                            '&:hover': { color: '#f87171', borderColor: '#f87171', bgcolor: 'rgba(248,113,113,0.05)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
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

      {/* Pagination Minimalista Custom Dark */}
      {memorandumsFiltrados.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4, gap: 1 }}>
          <Button
            onClick={(e) => handleChangePage(e, Math.max(0, page - 1))}
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

          {[...Array(Math.ceil(memorandumsFiltrados.length / rowsPerPage))].map((_, idx) => (
            <IconButton
              key={idx}
              onClick={(e) => handleChangePage(e, idx)}
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
          ))}

          <Button
            onClick={(e) => handleChangePage(e, Math.min(Math.ceil(memorandumsFiltrados.length / rowsPerPage) - 1, page + 1))}
            disabled={page === Math.ceil(memorandumsFiltrados.length / rowsPerPage) - 1}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => !actionLoading && setConfirmDialog({ open: false, id: null })}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <WarningIcon sx={{ color: '#f87171' }} /> Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#94a3b8', fontWeight: 500 }}>
            ¿Estás seguro de que deseas eliminar el memorandum con folio <strong>#{confirmDialog.id}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, id: null })}
            disabled={!!actionLoading}
            sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={!!actionLoading}
            variant="contained"
            sx={{
              bgcolor: '#f87171',
              color: '#fff',
              fontWeight: 800,
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#ef4444' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Sí, Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {showViaticosModal && selectedMemoForViaticos && (
        <ViaticosModal
          isOpen={showViaticosModal}
          onClose={() => setShowViaticosModal(false)}
          idMemorandum={selectedMemoForViaticos.id_memorandum_comision}
          idEmpleado={selectedMemoForViaticos.id_empleado}
        />
      )}

      {/* Notification System */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' ? '#1e293b' : '#3c0a0a',
            color: snackbar.severity === 'success' ? '#22c55e' : '#f87171',
            border: `1px solid ${snackbar.severity === 'success' ? '#22c55e' : '#f87171'}`,
            borderRadius: '16px',
            fontWeight: 600,
            '& .MuiAlert-icon': { color: 'inherit' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemorandumComision;