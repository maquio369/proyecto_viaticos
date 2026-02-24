import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Box, Typography, TextField, Autocomplete, Button, Chip, IconButton, Paper, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Person as PersonIcon, Badge as BadgeIcon, Warning as WarningIcon } from '@mui/icons-material';

const GestionFirmas = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFirmantes, setEmpleadosFirmantes] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [firmasEmpleado, setFirmasEmpleado] = useState([]);
  const [empleadoFirmanteAgregar, setEmpleadoFirmanteAgregar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, firma: null });

  useEffect(() => {
    cargarEmpleados();
    cargarEmpleadosFirmantes();
  }, []);

  useEffect(() => {
    if (empleadoSeleccionado) {
      cargarFirmasEmpleado(empleadoSeleccionado.id_empleado);
    } else {
      setFirmasEmpleado([]);
    }
  }, [empleadoSeleccionado]);

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/empleados`);
      setEmpleados(response.data.empleados);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  const cargarEmpleadosFirmantes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/firmas/empleados-firmantes`);
      setEmpleadosFirmantes(response.data.empleados_firmantes);
    } catch (error) {
      console.error('Error cargando empleados firmantes:', error);
    }
  };

  const cargarFirmasEmpleado = async (id_empleado) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/firmas/empleado/${id_empleado}`);
      setFirmasEmpleado(response.data.firmas || []);
    } catch (error) {
      console.error('Error cargando firmas del empleado:', error);
      setFirmasEmpleado([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarEmpleadoComoFirma = async () => {
    if (!empleadoSeleccionado || !empleadoFirmanteAgregar) {
      setSnackbar({ open: true, message: 'Selecciona un empleado y un empleado firmante', severity: 'warning' });
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/firmas/agregar-empleado-como-firma`, {
        id_empleado_destino: empleadoSeleccionado.id_empleado,
        id_empleado_firmante: empleadoFirmanteAgregar.id_empleado
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message || `Firma agregada: ${response.data.firma_creada.nombre_firma}`,
          severity: 'success'
        });
        setEmpleadoFirmanteAgregar(null);
        cargarFirmasEmpleado(empleadoSeleccionado.id_empleado);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || error.response?.data?.error || 'Error al agregar firma', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const eliminarFirma = async (firma) => {
    setConfirmDialog({ open: true, firma });
  };

  const confirmarEliminar = async () => {
    const firma = confirmDialog.firma;
    setConfirmDialog({ open: false, firma: null });

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/api/firmas/eliminar-adicional/${empleadoSeleccionado.id_empleado}/${firma.id_firma}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: response.data.message || `Firma eliminada: ${firma.nombre_firma}`,
        severity: 'success'
      });
      cargarFirmasEmpleado(empleadoSeleccionado.id_empleado);
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || error.response?.data?.error || 'Error al eliminar firma', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
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
          <BadgeIcon sx={{ fontSize: 35, color: '#38bdf8' }} />
          Gestión de Firmas
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
          Asignación de Firmantes • <span style={{ color: '#38bdf8' }}>Administración</span>
        </Typography>
      </Box>

      <Paper elevation={0} sx={{
        bgcolor: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        p: 3,
        mb: 3
      }}>
        <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
          Seleccionar Empleado
        </Typography>
        <Autocomplete
          options={empleados}
          getOptionLabel={(option) => `${option.nombres} ${option.apellido1} ${option.apellido2} - ${option.area_nombre}`}
          value={empleadoSeleccionado}
          onChange={(event, newValue) => setEmpleadoSeleccionado(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar Empleado..."
              variant="outlined"
              sx={inputStyles}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id_empleado} style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderBottom: '1px solid #334155' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, color: '#f8fafc' }}>{option.nombres} {option.apellido1} {option.apellido2}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{option.area_nombre}</Typography>
              </Box>
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.id_empleado === value.id_empleado}
          sx={{
            '& .MuiAutocomplete-popupIndicator': { color: '#64748b' },
            '& .MuiAutocomplete-clearIndicator': { color: '#64748b' }
          }}
          ListboxProps={{
            sx: {
              bgcolor: '#1e293b',
              '& .MuiAutocomplete-option': {
                '&:hover': { bgcolor: '#334155' },
                '&[aria-selected="true"]': { bgcolor: '#334155' }
              }
            }
          }}
        />
      </Paper>

      {empleadoSeleccionado && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700 }}>
              Firmas Asignadas
            </Typography>
            <Chip
              icon={<PersonIcon sx={{ color: '#38bdf8 !important' }} />}
              label={`${empleadoSeleccionado.nombres} ${empleadoSeleccionado.apellido1}`}
              sx={{
                bgcolor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontWeight: 700
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#38bdf8' }} />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2, mb: 3 }}>
                {firmasEmpleado.length === 0 ? (
                  <Paper elevation={0} sx={{
                    bgcolor: '#1e293b',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    p: 3,
                    gridColumn: '1 / -1',
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ color: '#64748b' }}>No hay firmas asignadas a este empleado</Typography>
                  </Paper>
                ) : (
                  firmasEmpleado.map(firma => (
                    <Paper
                      key={firma.id_firma}
                      elevation={0}
                      sx={{
                        bgcolor: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        p: 2.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          bgcolor: '#334155',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          bgcolor: 'rgba(56, 189, 248, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          color: '#38bdf8'
                        }}>
                          {firma.nombre_firma.charAt(0)}
                        </Box>
                        <Chip
                          label={firma.tipo_asignacion === 'area' ? 'Área' : 'Adicional'}
                          size="small"
                          sx={{
                            bgcolor: firma.tipo_asignacion === 'area' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                            color: firma.tipo_asignacion === 'area' ? '#22c55e' : '#a855f7',
                            border: `1px solid ${firma.tipo_asignacion === 'area' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
                            fontWeight: 700,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem', mb: 0.5 }}>
                        {firma.nombre_firma}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mb: 2 }}>
                        {firma.cargo_firma}
                      </Typography>
                      <IconButton
                        onClick={() => eliminarFirma(firma)}
                        disabled={actionLoading}
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
                          opacity: actionLoading ? 0.5 : 1,
                          '&:hover': {
                            color: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            transform: actionLoading ? 'none' : 'scale(1.1)'
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Paper>
                  ))
                )}
              </Box>

              <Paper elevation={0} sx={{
                bgcolor: '#1e293b',
                borderRadius: '16px',
                border: '1px solid #334155',
                p: 3
              }}>
                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 1 }}>
                  Agregar Nueva Firma
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 3 }}>
                  Selecciona un directivo para autorizarlo como firmante adicional
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Autocomplete
                    options={empleadosFirmantes}
                    getOptionLabel={(option) => `${option.nombres} ${option.apellido1} ${option.apellido2} - ${option.cargo}`}
                    value={empleadoFirmanteAgregar}
                    onChange={(event, newValue) => setEmpleadoFirmanteAgregar(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buscar Directivo..."
                        variant="outlined"
                        sx={inputStyles}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id_empleado} style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderBottom: '1px solid #334155' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 600, color: '#f8fafc' }}>{option.nombres} {option.apellido1} {option.apellido2}</Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{option.cargo}</Typography>
                        </Box>
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) => option.id_empleado === value.id_empleado}
                    sx={{
                      width: '100%',
                      '& .MuiAutocomplete-popupIndicator': { color: '#64748b' },
                      '& .MuiAutocomplete-clearIndicator': { color: '#64748b' }
                    }}
                    ListboxProps={{
                      sx: {
                        bgcolor: '#1e293b',
                        '& .MuiAutocomplete-option': {
                          '&:hover': { bgcolor: '#334155' },
                          '&[aria-selected="true"]': { bgcolor: '#334155' }
                        }
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      onClick={agregarEmpleadoComoFirma}
                      variant="contained"
                      disabled={actionLoading || !empleadoFirmanteAgregar}
                      startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                      sx={{
                        bgcolor: '#38bdf8',
                        color: '#0f172a',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 800,
                        boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)',
                        px: 4,
                        py: 1.2,
                        '&:hover': {
                          bgcolor: '#7dd3fc',
                          boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)',
                          transform: 'translateY(-1px)'
                        },
                        '&.Mui-disabled': {
                          bgcolor: '#1e293b',
                          color: '#64748b',
                          border: '1px solid #334155'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      {actionLoading ? 'Procesando...' : 'Agregar Firma'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
        </>
      )}

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

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, firma: null })}
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
              ¿Estás seguro de eliminar a
            </Typography>
            <Chip
              label={confirmDialog.firma?.nombre_firma}
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 2.5,
                mb: 2
              }}
            />
            <Typography sx={{ color: '#94a3b8', fontSize: '1rem' }}>
              de las firmas asignadas?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, firma: null })}
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
              transition: 'all 0.2s'
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionFirmas;
