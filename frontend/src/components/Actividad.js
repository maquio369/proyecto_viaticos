import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Box, Typography, TextField, CircularProgress, Button, Select, MenuItem,
  InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  ToggleButtonGroup, ToggleButton, LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  EventAvailable as EventIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Place as PlaceIcon,
  Badge as BadgeIcon,
  AccessTime as TimeIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Actividad = () => {
  const [formData, setFormData] = useState({
    fechaHora: '',
    tipoLugar: 'municipio',
    lugar: '',
    direccion: '',
    motivo: '',
    tipo: '',
    noEvento: '',
    nombreEvento: ''
  });

  const [municipios, setMunicipios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busquedaFolio, setBusquedaFolio] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    cargarActividades();
  }, []);

  useEffect(() => {
    if (formData.tipoLugar === 'municipio') {
      cargarMunicipios();
    } else if (formData.tipoLugar === 'nacional') {
      cargarEstados();
    }
  }, [formData.tipoLugar]);

  const cargarActividades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/actividades`);
      if (response.data.success) {
        setActividades(response.data.actividades);
      }
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  const cargarMunicipios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/municipios`);
      setMunicipios(response.data.municipios);
    } catch (error) {
      console.error('Error cargando municipios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstados = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/estados`);
      setEstados(response.data.estados);
    } catch (error) {
      console.error('Error cargando estados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'tipoLugar' && { lugar: '', direccion: '' })
    });
  };

  const handleEdit = (actividad) => {
    const fechaHora = `${actividad.fecha.split('T')[0]}T${actividad.hora}`;
    setFormData({
      fechaHora,
      tipoLugar: actividad.tipo_lugar,
      lugar: actividad.tipo_lugar === 'municipio' ? actividad.id_municipio : actividad.lugar,
      direccion: actividad.direccion,
      motivo: actividad.motivo,
      tipo: actividad.tipo,
      noEvento: actividad.no_evento || '',
      nombreEvento: actividad.nombre_evento || ''
    });
    setEditingId(actividad.id_actividad);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tipo) {
      setSnackbar({ open: true, message: 'Selecciona un tipo de actividad', severity: 'warning' });
      return;
    }

    setActionLoading(true);
    try {
      const fechaObj = new Date(formData.fechaHora);
      const fecha = fechaObj.toISOString().split('T')[0];
      const hora = fechaObj.toTimeString().split(' ')[0].substring(0, 5);

      const dataToSend = { ...formData, fecha, hora };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/actividades/${editingId}`, dataToSend);
        setSnackbar({ open: true, message: 'Actividad actualizada con éxito', severity: 'success' });
      } else {
        await axios.post(`${API_BASE_URL}/api/actividades`, dataToSend);
        setSnackbar({ open: true, message: 'Actividad registrada con éxito', severity: 'success' });
      }

      resetForm();
      setShowForm(false);
      cargarActividades();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al guardar la actividad',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/actividades/${confirmDialog.id}`);
      setSnackbar({ open: true, message: 'Actividad eliminada con éxito', severity: 'success' });
      setConfirmDialog({ open: false, id: null });
      cargarActividades();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar la actividad',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fechaHora: '',
      tipoLugar: 'municipio',
      lugar: '',
      direccion: '',
      motivo: '',
      tipo: '',
      noEvento: '',
      nombreEvento: ''
    });
    setEditingId(null);
    setShowForm(false);
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
        '&:focus': {
          bgcolor: 'transparent !important',
        }
      },
      '&.Mui-focused': {
        bgcolor: '#1e293b !important',
      }
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
    '& .MuiSelect-icon': { color: '#64748b' }
  };

  const actividadesFiltradas = actividades.filter(act =>
    act.id_actividad.toString().includes(busquedaFolio)
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
      {/* Formulario Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TimeIcon sx={{ fontSize: 40, color: '#38bdf8' }} />
            {editingId ? 'Editar Actividad' : 'Captura de Actividad'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, mt: 0.5 }}>
            Registro Cronológico • <span style={{ color: '#38bdf8' }}>Operación</span>
          </Typography>
        </Box>
      </Box>

      {/* Captura Card */}
      {showForm && (
        <Paper sx={{
          p: 4,
          bgcolor: '#1e293b',
          borderRadius: '24px',
          border: '1px solid #334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}>
          {loading && <LinearProgress sx={{ mt: -4, mx: -4, mb: 3 }} />}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                label="Fecha y Hora de la Actividad"
                type="datetime-local"
                name="fechaHora"
                value={formData.fechaHora}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={inputStyles}
              />

              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Tipo de Ubicación</InputLabel>
                <Select
                  name="tipoLugar"
                  value={formData.tipoLugar}
                  onChange={handleChange}
                  label="Tipo de Ubicación"
                  sx={{
                    borderRadius: '12px',
                    '&.Mui-focused': { bgcolor: 'transparent !important' }
                  }}
                >
                  <MenuItem value="pais">País (Internacional)</MenuItem>
                  <MenuItem value="nacional">Nacional (Estado)</MenuItem>
                  <MenuItem value="municipio">Local (Municipio)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>{formData.tipoLugar === 'municipio' ? 'Municipio' : formData.tipoLugar === 'nacional' ? 'Estado' : 'Lugar / País'}</InputLabel>
                {formData.tipoLugar === 'pais' ? (
                  <TextField
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    placeholder="Ingrese el país"
                    required
                    variant="outlined"
                    sx={inputStyles}
                  />
                ) : (
                  <Select
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    label={formData.tipoLugar === 'municipio' ? 'Municipio' : 'Estado'}
                    required
                    sx={{
                      borderRadius: '12px',
                      '&.Mui-focused': { bgcolor: 'transparent !important' }
                    }}
                  >
                    <MenuItem value="" disabled>Seleccione una opción</MenuItem>
                    {formData.tipoLugar === 'municipio' ? (
                      municipios.map(m => <MenuItem key={m.id_municipio} value={m.id_municipio}>{m.descripcion}</MenuItem>)
                    ) : (
                      estados.map(e => <MenuItem key={e.id_estado} value={e.nombre_estado}>{e.nombre_estado}</MenuItem>)
                    )}
                  </Select>
                )}
              </FormControl>

              <TextField
                name="direccion"
                label="Lugar"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección específica"
                required
                fullWidth
                sx={inputStyles}
              />

              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <TextField
                  name="motivo"
                  label="Motivo de la Actividad / Comisión"
                  value={formData.motivo}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                  sx={inputStyles}
                />
              </Box>

              <Box sx={{ gridColumn: { md: 'span 2' }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Clasificación de Actividad
                </Typography>
                <ToggleButtonGroup
                  value={formData.tipo}
                  exclusive
                  onChange={(e, val) => val && handleChange({ target: { name: 'tipo', value: val } })}
                  fullWidth
                  sx={{
                    gap: 2,
                    '& .MuiToggleButton-root': {
                      flex: 1,
                      borderRadius: '12px !important',
                      border: '2px solid #334155 !important',
                      color: '#64748b',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(56, 189, 248, 0.1) !important',
                        color: '#38bdf8',
                        borderColor: '#38bdf8 !important',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.02)',
                        color: '#cbd5e1'
                      }
                    }
                  }}
                >
                  <ToggleButton value="administrativo">
                    <BadgeIcon sx={{ mr: 1 }} /> Administrativo
                  </ToggleButton>
                  <ToggleButton value="evento">
                    <EventIcon sx={{ mr: 1 }} /> Evento Público
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {formData.tipo === 'evento' && (
                <>
                  <TextField
                    name="noEvento"
                    label="Número de Evento"
                    value={formData.noEvento}
                    onChange={handleChange}
                    fullWidth
                    sx={inputStyles}
                  />
                  <TextField
                    name="nombreEvento"
                    label="Nombre del Evento"
                    value={formData.nombreEvento}
                    onChange={handleChange}
                    fullWidth
                    sx={inputStyles}
                  />
                </>
              )}
            </Box>

            <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={actionLoading}
                startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : editingId ? <EditIcon /> : <AddIcon />}
                sx={{
                  bgcolor: '#38bdf8',
                  color: '#0f172a',
                  fontWeight: 800,
                  px: 6,
                  py: 1.5,
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.4)',
                  '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-2px)' },
                  '&:disabled': { bgcolor: '#334155', color: '#64748b' },
                  transition: 'all 0.2s'
                }}
              >
                {actionLoading ? 'Procesando...' : editingId ? 'Actualizar Registro' : 'Guardar Actividad'}
              </Button>
              <Button
                onClick={resetForm}
                sx={{
                  color: '#94a3b8',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#f8fafc', bgcolor: 'transparent' }
                }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* Listado Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              if (showForm && editingId) {
                resetForm();
              } else {
                setShowForm(!showForm);
              }
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
            {showForm ? 'Ocultar Formulario' : 'Nueva Actividad'}
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: '#38bdf8', display: { xs: 'none', sm: 'block' } }} /> Histórico
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
              borderRadius: '12px',
              bgcolor: '#1e293b',
              color: '#f8fafc',
              '& fieldset': { borderColor: '#334155' }
            }
          }}
          sx={{ minWidth: 280 }}
        />
      </Box>

      {/* Listado de Actividades - Row-Card Style */}
      <TableContainer sx={{ pb: 4, overflowX: 'hidden' }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 10px', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ '& th': { border: 'none', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', pb: 0 } }}>
              <TableCell width="10%" align="center">Folio</TableCell>
              <TableCell width="12%" align="center">Tipo</TableCell>
              <TableCell width="20%" align="center">Fecha / Hora</TableCell>
              <TableCell width="38%">Ubicación y Motivo</TableCell>
              <TableCell width="20%" align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actividadesFiltradas.length === 0 ? (
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell colSpan={5} align="center" sx={{ border: 'none', py: 10, color: '#475569' }}>
                  No se encontraron actividades registradas
                </TableCell>
              </TableRow>
            ) : (
              actividadesFiltradas.map((act) => (
                <TableRow
                  key={act.id_actividad}
                  sx={{
                    bgcolor: '#1e293b',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#334155', transform: 'translateY(-2px)', cursor: 'default' },
                    '& td': { border: 'none' },
                    '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                    '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                  }}
                >
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: '#38bdf8' }}>#{act.id_actividad}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={act.tipo === 'administrativo' ? 'ADMX' : 'EVENTO'}
                      size="small"
                      sx={{
                        bgcolor: act.tipo === 'administrativo' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(45, 212, 191, 0.1)',
                        color: act.tipo === 'administrativo' ? '#38bdf8' : '#2dd4bf',
                        fontWeight: 800,
                        fontSize: '0.65rem'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>
                      {new Date(act.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{act.hora}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PlaceIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                      {act.municipio_nombre || act.lugar}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {act.motivo}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEdit(act)}
                      size="small"
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
                    <IconButton
                      onClick={() => setConfirmDialog({ open: true, id: act.id_actividad })}
                      size="small"
                      disabled={actionLoading}
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
            ¿Estás seguro de que deseas eliminar la actividad con folio <strong>#{confirmDialog.id}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, id: null })}
            disabled={actionLoading}
            sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={actionLoading}
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

export default Actividad;