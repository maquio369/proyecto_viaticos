import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Box, Typography, TextField, CircularProgress, Button, Select, MenuItem,
  InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const CuentaPersonal = ({ handleLogout }) => {
  const [busqueda, setBusqueda] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [bancos, setBancos] = useState([]);
  const [accountForm, setAccountForm] = useState({
    id_banco: '',
    cuenta: '',
    clabe: ''
  });
  const [loadingAccount, setLoadingAccount] = useState(false);

  // Búsqueda automática cuando cambia el texto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda.trim().length >= 2) {
        buscarEmpleados();
      } else if (busqueda.trim().length === 0) {
        cargarEmpleadosIniciales();
      } else {
        setEmpleados([]);
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  // Cargar primeros 8 empleados al iniciar y catalogo de bancos
  useEffect(() => {
    cargarEmpleadosIniciales();
    cargarBancos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarBancos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/bancos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBancos(response.data.bancos || []);
    } catch (error) {
      console.error('Error cargando bancos:', error);
    }
  };

  const cargarEmpleadosIniciales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/empleados/buscar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmpleados(response.data.slice(0, 8));
    } catch (error) {
      if (error.response?.status === 401) {
        setSnackbar({ open: true, message: 'Sesión expirada', severity: 'error' });
        if (handleLogout) handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const buscarEmpleados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/empleados/buscar?q=${encodeURIComponent(busqueda)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmpleados(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        if (handleLogout) handleLogout();
      } else {
        setSnackbar({ open: true, message: 'Error al buscar empleados', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlOpenModal = async (empleado) => {
    setSelectedEmpleado(empleado);
    setOpenModal(true);
    setAccountForm({ id_banco: '', cuenta: '', clabe: '' });
    setLoadingAccount(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/empleados/cuenta-bancaria/${empleado.id_empleado}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.cuenta) {
        setAccountForm({
          id_banco: response.data.cuenta.id_banco,
          cuenta: response.data.cuenta.cuenta,
          clabe: response.data.cuenta.clabe
        });
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmpleado(null);
  };

  const handleSaveAccount = async () => {
    if (!accountForm.id_banco || !accountForm.cuenta || !accountForm.clabe) {
      setSnackbar({ open: true, message: 'Completa todos los campos', severity: 'warning' });
      return;
    }

    if (accountForm.cuenta.length !== 10 || accountForm.clabe.length !== 18) {
      setSnackbar({ open: true, message: 'Revisa la longitud de cuenta (10) y CLABE (18)', severity: 'warning' });
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/empleados/cuenta-bancaria`, {
        id_empleado: selectedEmpleado.id_empleado,
        ...accountForm
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSnackbar({ open: true, message: 'Cuenta bancaria guardada con éxito', severity: 'success' });
      handleCloseModal();
      busqueda ? buscarEmpleados() : cargarEmpleadosIniciales();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar la cuenta', severity: 'error' });
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
      color: '#f8fafc',
      fontWeight: 600,
      '&:focus': {
        outline: 'none !important',
        boxShadow: 'none !important',
        bgcolor: 'transparent !important'
      },
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #0f172a inset',
        WebkitTextFillColor: '#f8fafc',
      }
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
    '& .MuiSelect-icon': { color: '#64748b' }
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceIcon sx={{ fontSize: 35, color: '#38bdf8' }} />
            Cuentas Bancarias
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            Cuentas del Personal • <span style={{ color: '#38bdf8' }}>Administración</span>
          </Typography>
        </Box>

        <TextField
          placeholder="Buscar empleado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>,
            endAdornment: loading && <CircularProgress size={20} sx={{ color: '#38bdf8' }} />,
            sx: {
              borderRadius: '12px',
              bgcolor: '#1e293b',
              color: '#f8fafc',
              fontWeight: 600,
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#38bdf8' },
              '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
              '& input': {
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #1e293b inset',
                  WebkitTextFillColor: '#f8fafc',
                },
                '&:focus': {
                  bgcolor: 'transparent',
                }
              },
              '&.Mui-focused': {
                bgcolor: '#1e293b !important', // Asegurar que no cambie a blanco
              }
            }
          }}
          sx={{ minWidth: 320 }}
        />
      </Box>

      <TableContainer sx={{ pb: 0 }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RFC</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre Completo</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cuenta / CLABE</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ borderBottom: 'none', color: '#64748b', py: 6 }}>
                  {busqueda ? 'No se encontraron resultados' : 'Buscando empleados...'}
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((empleado) => (
                <TableRow
                  key={empleado.id_empleado}
                  sx={{
                    backgroundColor: '#1e293b',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                    borderRadius: '16px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: '#334155',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    },
                    '& td': { borderBottom: 'none' },
                    '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                    '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                  }}
                >
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.85rem' }}>
                      {empleado.rfc || '---'}
                    </Typography>
                    {empleado.nombre_banco && (
                      <Typography sx={{ fontSize: '0.7rem', color: '#38bdf8', mt: 0.5, fontWeight: 600 }}>
                        {empleado.nombre_banco}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.9rem' }}>
                      {empleado.nombre_completo}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {empleado.area || 'Sin área asignada'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                      {empleado.cuenta ? (
                        <Chip
                          label={`CTA: ${empleado.cuenta}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', fontWeight: 700, fontSize: '0.75rem', border: '1px solid rgba(45, 212, 191, 0.2)' }}
                        />
                      ) : (
                        <Typography sx={{ color: '#475569', fontSize: '0.75rem', fontStyle: 'italic' }}>Sin cuenta</Typography>
                      )}
                      {empleado.clabe && (
                        <Chip
                          label={`CLABE: ${empleado.clabe}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handlOpenModal(empleado)}
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
                      }}
                    >
                      <EditIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo de Edición */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            bgcolor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, pt: 3 }}>
          Configurar Cuenta
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {selectedEmpleado && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip
                icon={<BadgeIcon sx={{ color: '#38bdf8 !important' }} />}
                label={selectedEmpleado.nombre_completo}
                sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, py: 2, border: '1px solid rgba(56, 189, 248, 0.2)' }}
              />
            </Box>
          )}

          {loadingAccount ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#38bdf8' }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Banco Autorizado</InputLabel>
                <Select
                  value={accountForm.id_banco}
                  label="Banco Autorizado"
                  onChange={(e) => setAccountForm({ ...accountForm, id_banco: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  {bancos.map((b) => (
                    <MenuItem key={b.id_banco} value={b.id_banco}>{b.nombre_banco}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Número de Cuenta (10 dígitos)"
                value={accountForm.cuenta}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setAccountForm({ ...accountForm, cuenta: val });
                }}
                sx={inputStyles}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />

              <TextField
                fullWidth
                label="CLABE Interbancaria (18 dígitos)"
                value={accountForm.clabe}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                  setAccountForm({ ...accountForm, clabe: val });
                }}
                sx={inputStyles}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveAccount}
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={18} color="inherit" />}
            sx={{
              bgcolor: '#38bdf8',
              color: '#0f172a',
              borderRadius: '10px',
              fontWeight: 800,
              textTransform: 'none',
              px: 4,
              '&:hover': { bgcolor: '#7dd3fc' },
              '&:disabled': { bgcolor: '#334155' }
            }}
          >
            {actionLoading ? 'Guardando...' : 'Guardar'}
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
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' ? '#1e293b' : '#450a0a',
            color: snackbar.severity === 'success' ? '#22c55e' : '#ef4444',
            border: `1px solid ${snackbar.severity === 'success' ? '#22c55e' : '#ef4444'}`,
            borderRadius: '12px',
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CuentaPersonal;