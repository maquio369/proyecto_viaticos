import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, CircularProgress, Modal, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { API_BASE_URL } from '../config';

const CuentaPersonal = ({ handleLogout }) => {
  const [busqueda, setBusqueda] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');


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
    if (busqueda.trim().length >= 2) {
      buscarEmpleados();
    } else if (busqueda.trim().length === 0) {
      cargarEmpleadosIniciales();
    } else {
      setEmpleados([]);
      setMensaje('');
    }
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
      console.log('Cargando bancos...');
      const response = await fetch(`${API_BASE_URL}/api/catalogos/bancos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Bancos cargados:', data.bancos);
        setBancos(data.bancos || []);
      } else {
        console.error('Error al cargar bancos:', response.status);
      }
    } catch (error) {
      console.error('Error cargando bancos:', error);
    }
  };

  const cargarEmpleadosIniciales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/empleados/buscar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmpleados(data.slice(0, 8));
      } else if (response.status === 401) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        if (handleLogout) handleLogout();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarEmpleados = async () => {
    if (!busqueda.trim() || busqueda.trim().length < 2) return;

    setLoading(true);
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/empleados/buscar?q=${encodeURIComponent(busqueda)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
        if (data.length === 0) {
          setMensaje('No se encontraron empleados');
        }
      } else if (response.status === 401) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        if (handleLogout) handleLogout();
      } else {
        setMensaje('Error al buscar empleados');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };


  const handlOpenModal = async (empleado) => {
    setSelectedEmpleado(empleado);
    setOpenModal(true);
    setAccountForm({ id_banco: '', cuenta: '', clabe: '' }); // Reset form
    setLoadingAccount(true);

    // Fetch existing account if any
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/empleados/cuenta-bancaria/${empleado.id_empleado}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.cuenta) {
          setAccountForm({
            id_banco: data.cuenta.id_banco,
            cuenta: data.cuenta.cuenta,
            clabe: data.cuenta.clabe
          });
        }
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
      alert('Por favor complete todos los campos bancarios');
      return;
    }

    if (accountForm.cuenta.length !== 10) {
      alert('El número de cuenta debe tener exactamente 10 dígitos.');
      return;
    }

    if (accountForm.clabe.length !== 18) {
      alert('La CLABE debe tener exactamente 18 dígitos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/empleados/cuenta-bancaria`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_empleado: selectedEmpleado.id_empleado,
          ...accountForm
        })
      });

      if (response.ok) {
        alert('Cuenta bancaria guardada exitosamente');
        handleCloseModal();
        // Refresh the list
        if (busqueda && busqueda.trim().length >= 2) {
          buscarEmpleados();
        } else {
          cargarEmpleadosIniciales();
        }
      } else {
        alert('Error al guardar la cuenta');
      }
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Error de conexión');
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  return (
    <div className="actividades-table-container cuentas-table-container" style={{ padding: '24px', maxWidth: '1000px', margin: '32px auto' }}>
      <div className="table-header">
        <h3>CUENTAS BANCARIAS DEL PERSONAL</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar empleado (nombre, RFC)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="search-icon">🔍</span>
          {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </div>
        {mensaje && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>{mensaje}</Typography>}
      </div>


      <div className="table-responsive">
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              <th style={{ width: '20%', textAlign: 'center', padding: '12px', fontWeight: 'bold', color: '#555' }}>RFC</th>
              <th style={{ width: '35%', textAlign: 'center', padding: '12px', fontWeight: 'bold', color: '#555' }}>Nombre</th>
              <th style={{ width: '30%', textAlign: 'center', padding: '12px', fontWeight: 'bold', color: '#555' }}>Área</th>
              <th style={{ width: '15%', textAlign: 'center', padding: '12px', fontWeight: 'bold', color: '#555' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                  {busqueda ? 'No se encontraron empleados' : 'Escribe para buscar empleados'}
                </td>
              </tr>
            ) : (
              empleados.map(empleado => (
                <tr key={empleado.id_empleado} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ textAlign: 'center', padding: '12px', verticalAlign: 'top' }}>
                    <div>{empleado.rfc || 'N/A'}</div>
                    {empleado.nombre_banco && (
                      <div style={{ fontSize: '0.85rem', color: '#009688', marginTop: '4px' }}>
                        {empleado.nombre_banco}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', verticalAlign: 'top' }}>
                    <div>{empleado.nombre_completo}</div>
                    {empleado.cuenta && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{
                          backgroundColor: '#e0f2f1',
                          color: '#00695c',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          border: '1px solid #b2dfdb'
                        }}>
                          CTA
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#555' }}>
                          {empleado.cuenta}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', verticalAlign: 'top' }}>
                    <div>{empleado.area || 'N/A'}</div>
                    {empleado.clabe && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{
                          backgroundColor: '#e0f2f1',
                          color: '#00695c',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          border: '1px solid #b2dfdb'
                        }}>
                          CLABE
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#555' }}>
                          {empleado.clabe}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', verticalAlign: 'top' }}>
                    <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        className="btn-icon edit"
                        onClick={() => handlOpenModal(empleado)}
                        title={empleado.cuenta ? "Editar Cuenta" : "Agregar Cuenta"}
                        style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        ✎
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Modal de Cuenta Bancaria */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Cuenta Bancaria
          </Typography>
          {selectedEmpleado && (
            <Typography variant="body2" mb={3} color="text.secondary">
              Empleado: {selectedEmpleado.nombre_completo}
            </Typography>
          )}

          {loadingAccount ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Banco</InputLabel>
                <Select
                  value={accountForm.id_banco}
                  label="Banco"
                  onChange={(e) => setAccountForm({ ...accountForm, id_banco: e.target.value })}
                >
                  {bancos.map((b) => (
                    <MenuItem key={b.id_banco} value={b.id_banco}>
                      {b.nombre_banco}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="No. Cuenta"
                value={accountForm.cuenta}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setAccountForm({ ...accountForm, cuenta: val });
                }}
                inputProps={{ maxLength: 10 }}
                helperText={`${accountForm.cuenta.length}/10 dígitos`}
              />
              <TextField
                fullWidth
                margin="normal"
                label="CLABE Interbancaria"
                value={accountForm.clabe}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 18) setAccountForm({ ...accountForm, clabe: val });
                }}
                inputProps={{ maxLength: 18 }}
                helperText={`${accountForm.clabe.length}/18 dígitos`}
              />
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleCloseModal} color="secondary">
                  Cancelar
                </Button>
                <Button onClick={handleSaveAccount} variant="contained" color="primary">
                  Guardar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div >
  );
};

export default CuentaPersonal;