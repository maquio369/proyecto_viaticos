import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
    observaciones: ''
  });

  const [actividades, setActividades] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [firmasDisponibles, setFirmasDisponibles] = useState([]);
  const [memorandums, setMemorandums] = useState([]);
  const [busquedaFolio, setBusquedaFolio] = useState('');
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarActividades();
    cargarEmpleados();
    cargarVehiculos();
    cargarMemorandums();
  }, []);

  useEffect(() => {
    if (formData.id_empleado) {
      cargarFirmasPorEmpleado(formData.id_empleado);
    }
  }, [formData.id_empleado]);

  const cargarActividades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/actividades`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/vehiculos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error cargando vehiculos:', error);
    }
  };

  const cargarMemorandums = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/memorandum`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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

      // Auto-seleccionar la primera firma si existe
      if (firmas.length > 0) {
        setFormData(prev => ({
          ...prev,
          id_firma: firmas[0].id_firma
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          id_firma: ''
        }));
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el empleado seleccionado coincida con el texto del campo
    if (formData.id_empleado) {
      const empleadoSeleccionado = empleados.find(emp => emp.id_empleado === parseInt(formData.id_empleado));
      if (empleadoSeleccionado) {
        const nombreCompletoEsperado = `${empleadoSeleccionado.nombres} ${empleadoSeleccionado.apellido1} ${empleadoSeleccionado.apellido2} (${empleadoSeleccionado.lugar_trabajo_nombre || 'Sin lugar asignado'})`;
        if (busquedaEmpleado !== nombreCompletoEsperado) {
          alert('⚠️ El texto del empleado no coincide con la selección. Por favor, seleccione un empleado válido de la lista.');
          return;
        }
      }
    } else {
      alert('⚠️ Debe seleccionar un empleado válido de la lista.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/memorandum`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Memorandum/Comisión guardado exitosamente');
        setFormData({
          id_actividad: '',
          id_empleado: '',
          periodo_inicio: '',
          periodo_fin: '',
          tipo_transporte: '',
          id_vehiculo: '',
          id_firma: '',
          observaciones: ''
        });
        setBusquedaEmpleado(''); // Limpiar búsqueda de empleado
        setFirmasDisponibles([]);
        cargarMemorandums(); // Recargar tabla
      }
    } catch (error) {
      console.error('Error guardando memorandum:', error);
      alert('Error al guardar el memorandum');
    }
  };

  // Filtrar memorandums por búsqueda
  const memorandumsFiltrados = memorandums.filter(memo => {
    const id = memo.id_memorandum_comision || memo.id_memorandum; // Fallback por si acaso
    return id ? id.toString().includes(busquedaFolio) : false;
  });

  return (
    <div className="memorandum-container">
      <h2>Memorandum y Comisión</h2>

      <form onSubmit={handleSubmit} className="memorandum-form">
        <div className="form-group">
          <label>Actividad</label>
          <select
            name="id_actividad"
            value={formData.id_actividad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una actividad</option>
            {actividades.map(actividad => (
              <option key={actividad.id_actividad} value={actividad.id_actividad}>
                {actividad.motivo} - {actividad.fecha} ({actividad.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Empleado Comisionado</label>
          <input
            type="text"
            list="empleados-list"
            placeholder="🔍 Escriba para buscar empleado por nombre o lugar de trabajo..."
            value={busquedaEmpleado}
            onChange={(e) => {
              const value = e.target.value;
              setBusquedaEmpleado(value);

              // Si el campo está vacío, limpiar la selección
              if (!value || value.trim() === '') {
                setFormData(prev => ({
                  ...prev,
                  id_empleado: ''
                }));
                return;
              }

              // Buscar si hay un empleado que coincida exactamente
              const empleadoEncontrado = empleados.find(emp => {
                const nombreCompleto = `${emp.nombres} ${emp.apellido1} ${emp.apellido2} (${emp.lugar_trabajo_nombre || 'Sin lugar asignado'})`;
                return nombreCompleto === value;
              });

              // Solo actualizar si se encontró un empleado válido
              if (empleadoEncontrado) {
                setFormData(prev => ({
                  ...prev,
                  id_empleado: empleadoEncontrado.id_empleado
                }));
              } else {
                // Si no coincide exactamente, limpiar el id pero mantener el texto para seguir buscando
                setFormData(prev => ({
                  ...prev,
                  id_empleado: ''
                }));
              }
            }}
            onBlur={(e) => {
              // Al perder el foco, verificar si hay una selección válida
              const value = e.target.value;
              const empleadoEncontrado = empleados.find(emp => {
                const nombreCompleto = `${emp.nombres} ${emp.apellido1} ${emp.apellido2} (${emp.lugar_trabajo_nombre || 'Sin lugar asignado'})`;
                return nombreCompleto === value;
              });

              // Si no hay selección válida, limpiar el campo
              if (!empleadoEncontrado && value) {
                // Opcional: puedes descomentar esto si quieres que se limpie automáticamente
                // setBusquedaEmpleado('');
              }
            }}
            required
            style={{
              padding: '8px 12px',
              border: formData.id_empleado
                ? '2px solid #4caf50'
                : busquedaEmpleado && !formData.id_empleado
                  ? '2px solid #ff9800'
                  : '1px solid #ddd',
              borderRadius: '4px',
              width: '100%',
              fontSize: '14px',
              backgroundColor: formData.id_empleado
                ? '#f1f8f4'
                : busquedaEmpleado && !formData.id_empleado
                  ? '#fff8e1'
                  : 'white'
            }}
          />
          <datalist id="empleados-list">
            {empleados
              .filter(empleado => {
                if (!busquedaEmpleado) return true;
                const searchTerm = busquedaEmpleado.toLowerCase();
                const nombreCompleto = `${empleado.nombres} ${empleado.apellido1} ${empleado.apellido2}`.toLowerCase();
                const lugarTrabajo = (empleado.lugar_trabajo_nombre || 'Sin lugar asignado').toLowerCase();
                return nombreCompleto.includes(searchTerm) || lugarTrabajo.includes(searchTerm);
              })
              .map(empleado => (
                <option
                  key={empleado.id_empleado}
                  value={`${empleado.nombres} ${empleado.apellido1} ${empleado.apellido2} (${empleado.lugar_trabajo_nombre || 'Sin lugar asignado'})`}
                />
              ))}
          </datalist>
          {formData.id_empleado && (
            <small style={{ color: '#4caf50', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              ✓ Empleado seleccionado correctamente
            </small>
          )}
          {busquedaEmpleado && !formData.id_empleado && (
            <small style={{ color: '#ff9800', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              ⚠️ Debe seleccionar un empleado de la lista
            </small>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Período Inicio</label>
            <input
              type="date"
              name="periodo_inicio"
              value={formData.periodo_inicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Período Fin</label>
            <input
              type="date"
              name="periodo_fin"
              value={formData.periodo_fin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tipo de Transporte</label>
          <select
            name="tipo_transporte"
            value={formData.tipo_transporte}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione tipo de transporte</option>
            <option value="publico">Público</option>
            <option value="oficial">Oficial</option>
            <option value="aereo">Aéreo</option>
          </select>
        </div>

        {formData.tipo_transporte === 'oficial' && (
          <div className="form-group">
            <label>Vehículo Oficial</label>
            <select
              name="id_vehiculo"
              value={formData.id_vehiculo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map(vehiculo => (
                <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                  {vehiculo.marca_de_vehiculo} {vehiculo.modelo} - {vehiculo.placas_actuales}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
            placeholder="Observaciones adicionales (opcional)"
          />
        </div>

        {firmasDisponibles.length > 0 && (
          <div className="form-group">
            <label>Firma que Autoriza</label>
            <select
              name="id_firma"
              value={formData.id_firma}
              onChange={handleChange}
              required
              className="select-firma"
            >
              {firmasDisponibles.map(firma => (
                <option key={firma.id_firma} value={firma.id_firma}>
                  {firma.nombre_firma} - {firma.cargo_firma} ({firma.tipo_asignacion === 'area' ? 'Área' : 'Adicional'})
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.id_empleado && firmasDisponibles.length === 0 && !loading && (
          <div className="error-message">
            <p>⚠️ No hay firmas asignadas para este empleado</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={firmasDisponibles.length === 0}
          >
            Guardar Memorandum
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setFormData({
                id_actividad: '',
                id_empleado: '',
                periodo_inicio: '',
                periodo_fin: '',
                tipo_transporte: '',
                id_vehiculo: '',
                id_firma: '',
                observaciones: ''
              });
              setBusquedaEmpleado(''); // Limpiar búsqueda de empleado
              setFirmasDisponibles([]);
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Tabla de Memorandums */}
      <div className="actividades-table-container">
        <div className="table-header">
          <h3>Memorandums y Comisiones Recientes</h3>
          <div className="search-box">
            {/* Busqueda simple por ahora */}
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Folio</th>
                <th style={{ textAlign: 'center' }}>Fecha</th>
                <th style={{ textAlign: 'center' }}>Municipio / Lugar</th>
                <th style={{ textAlign: 'center' }}>Empleado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {memorandumsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data" style={{ textAlign: 'center' }}>
                    No hay memorandums registrados
                  </td>
                </tr>
              ) : (
                memorandumsFiltrados.map(memo => (
                  <tr key={memo.id_memorandum_comision}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {memo.folio || memo.id_memorandum_comision}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {new Date(memo.periodo_inicio).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {memo.municipio_nombre || memo.lugar || memo.direccion || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {memo.empleado_nombre}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons" style={{ justifyContent: 'center', display: 'flex' }}>
                        <button
                          className="btn-icon edit"
                          onClick={() => alert(`Editar folio ${memo.folio || memo.id_memorandum_comision} - Función pendiente de configurar`)}
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => alert(`Imprimir folio ${memo.folio || memo.id_memorandum_comision} - Función pendiente de configurar`)}
                          title="Imprimir"
                        >
                          🖨️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setSelectedMemoForViaticos(memo);
                            setShowViaticosModal(true);
                          }}
                          title="Agregar Viáticos"
                          style={{ marginLeft: '5px', backgroundColor: '#e91e63', color: 'white' }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showViaticosModal && selectedMemoForViaticos && (
        <ViaticosModal
          isOpen={showViaticosModal}
          onClose={() => setShowViaticosModal(false)}
          idMemorandum={selectedMemoForViaticos.id_memorandum_comision}
          idEmpleado={selectedMemoForViaticos.id_empleado}
        />
      )}
    </div>
  );
};

export default MemorandumComision;