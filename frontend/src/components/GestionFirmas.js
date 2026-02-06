import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const GestionFirmas = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFirmantes, setEmpleadosFirmantes] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [firmasEmpleado, setFirmasEmpleado] = useState([]);
  const [empleadoFirmanteAgregar, setEmpleadoFirmanteAgregar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmpleados();
    cargarEmpleadosFirmantes();
  }, []);

  useEffect(() => {
    if (empleadoSeleccionado) {
      cargarFirmasEmpleado(empleadoSeleccionado);
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
      setFirmasEmpleado(response.data.firmas);
    } catch (error) {
      console.error('Error cargando firmas del empleado:', error);
      setFirmasEmpleado([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarEmpleadoComoFirma = async () => {
    if (!empleadoSeleccionado || !empleadoFirmanteAgregar) {
      alert('Selecciona un empleado y un empleado firmante');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/firmas/agregar-empleado-como-firma`, {
        id_empleado_destino: empleadoSeleccionado,
        id_empleado_firmante: empleadoFirmanteAgregar
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(`Firma agregada: ${response.data.firma_creada.nombre_firma}`);
        setEmpleadoFirmanteAgregar('');
        cargarFirmasEmpleado(empleadoSeleccionado);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error al agregar firma');
    }
  };

  const eliminarFirma = async (id_firma) => {
    if (!window.confirm('¿Estás seguro de eliminar esta firma adicional?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/firmas/eliminar-adicional/${empleadoSeleccionado}/${id_firma}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Firma eliminada exitosamente');
      cargarFirmasEmpleado(empleadoSeleccionado);
    } catch (error) {
      alert('Error al eliminar firma');
    }
  };

  const getEmpleadoInfo = (id_empleado) => {
    const empleado = empleados.find(e => e.id_empleado === id_empleado);
    return empleado ? `${empleado.nombres} ${empleado.apellido1} ${empleado.apellido2} - ${empleado.area_nombre}` : '';
  };

  return (
    <div className="gestion-firmas-container">
      <h2>Gestión de Firmas por Empleado</h2>

      <div className="seleccion-empleado">
        <div className="form-group">
          <label>Seleccionar Empleado</label>
          <select
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map(empleado => (
              <option key={empleado.id_empleado} value={empleado.id_empleado}>
                {empleado.nombres} {empleado.apellido1} {empleado.apellido2} - {empleado.area_nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {empleadoSeleccionado && (
        <div className="firmas-empleado">
          <h3>Firmas Disponibles para: {getEmpleadoInfo(empleadoSeleccionado)}</h3>

          {loading ? (
            <p>Cargando firmas...</p>
          ) : (
            <div className="firmas-lista">
              {firmasEmpleado.length === 0 ? (
                <p>No hay firmas asignadas a este empleado</p>
              ) : (
                firmasEmpleado.map(firma => (
                  <div key={firma.id_firma} className="firma-item">
                    <div className="firma-info">
                      <strong>{firma.nombre_firma}</strong>
                      <span>{firma.cargo_firma}</span>
                      <span className={`tipo-badge ${firma.tipo_asignacion}`}>
                        {firma.tipo_asignacion === 'area' ? 'Por Área' : 'Adicional'}
                      </span>
                    </div>
                    {firma.tipo_asignacion === 'adicional' && (
                      <button
                        onClick={() => eliminarFirma(firma.id_firma)}
                        className="btn-eliminar"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="agregar-firma">
            <h4>Agregar Empleado como Firma Adicional</h4>
            <p className="info-text">Solo empleados con cargos directivos pueden ser agregados como firmantes</p>
            <div className="form-row">
              <div className="form-group">
                <select
                  value={empleadoFirmanteAgregar}
                  onChange={(e) => setEmpleadoFirmanteAgregar(e.target.value)}
                >
                  <option value="">Seleccione un empleado firmante</option>
                  {empleadosFirmantes.map(empleado => (
                    <option key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombres} {empleado.apellido1} {empleado.apellido2} - {empleado.cargo}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={agregarEmpleadoComoFirma} className="btn-primary">
                Agregar como Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionFirmas;