import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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

  // ... (lines 18-151 skipped)

  const [municipios, setMunicipios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busquedaFolio, setBusquedaFolio] = useState('');

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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/actividades`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/catalogos/estados`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
    console.log('Editing actividad:', actividad); // Debugging
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.tipo) {
        alert('Por favor seleccione un tipo de actividad');
        return;
      }

      const token = localStorage.getItem('token');
      const fechaObj = new Date(formData.fechaHora);
      const fecha = fechaObj.toISOString().split('T')[0];
      const hora = fechaObj.toTimeString().split(' ')[0].substring(0, 5);

      const dataToSend = {
        ...formData,
        fecha,
        hora
      };

      let response;
      if (editingId) {
        response = await axios.put(`${API_BASE_URL}/api/actividades/${editingId}`, dataToSend, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/api/actividades`, dataToSend, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        alert(editingId ? 'Actividad actualizada' : 'Actividad guardada');
        resetForm();
        cargarActividades();
      }
    } catch (error) {
      console.error('Error guardando actividad:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`Error al guardar la actividad: ${errorMessage}`);
      // Log extra details if available
      if (error.response?.data?.error) {
        console.error('Detalle del error:', error.response.data.error);
      }
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
  };

  const renderLugarField = () => {
    switch (formData.tipoLugar) {
      case 'pais':
        return (
          <input
            type="text"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            placeholder="Ingrese el país"
            required
            className="compact-input"
          />
        );
      case 'estado': // Keeping 'estado' as text in case they mean something else, or for retro-compatibility
        return (
          <input
            type="text"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            placeholder="Ingrese el estado"
            required
            className="compact-input"
          />
        );
      case 'nacional':
        return (
          <select
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            required
            className="compact-input"
          >
            <option value="">Seleccione estado</option>
            {loading ? (
              <option disabled>Cargando...</option>
            ) : (
              estados.map(estado => (
                <option key={estado.id_estado} value={estado.nombre_estado}>
                  {estado.nombre_estado}
                </option>
              ))
            )}
          </select>
        );
      case 'municipio':
        return (
          <select
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            required
            className="compact-input"
          >
            <option value="">Seleccione municipio</option>
            {loading ? (
              <option disabled>Cargando...</option>
            ) : (
              municipios.map(municipio => (
                <option key={municipio.id_municipio} value={municipio.id_municipio}>
                  {municipio.descripcion}
                </option>
              ))
            )}
          </select>
        );
      default:
        return null;
    }
  };

  // Filter activities based on search
  const actividadesFiltradas = actividades.filter(act =>
    act.id_actividad.toString().includes(busquedaFolio)
  );

  return (
    <div className="actividad-container">
      <form onSubmit={handleSubmit} className="actividad-form">
        <h2>{editingId ? 'Editar Actividad' : 'Captura de Actividad'}</h2>
        <div className="form-group">
          <label>Fecha y Hora</label>
          <input
            type="datetime-local"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            required
            className="datetime-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Lugar</label>
            <select
              name="tipoLugar"
              value={formData.tipoLugar}
              onChange={handleChange}
              required
              className="compact-input"
            >
              <option value="">Seleccione tipo</option>
              <option value="pais">País</option>
              <option value="nacional">Nacional</option>
              <option value="municipio">Municipio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Lugar</label>
            {renderLugarField()}
          </div>
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección específica"
            required
            className="compact-input"
          />
        </div>

        <div className="form-group">
          <label>Motivo</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            rows="2"
            placeholder="Motivo de la actividad"
            required
            className="compact-input"
          />
        </div>

        <div className="form-group">
          <label>Tipo de Actividad</label>
          <div className="tipo-checklist">
            <div
              className={`tipo-option ${formData.tipo === 'administrativo' ? 'selected' : ''}`}
              onClick={() => handleChange({ target: { name: 'tipo', value: 'administrativo' } })}
            >
              <div className="checkbox-custom">
                {formData.tipo === 'administrativo' && <span>✓</span>}
              </div>
              <span>Administrativo</span>
            </div>

            <div
              className={`tipo-option ${formData.tipo === 'evento' ? 'selected' : ''}`}
              onClick={() => handleChange({ target: { name: 'tipo', value: 'evento' } })}
            >
              <div className="checkbox-custom">
                {formData.tipo === 'evento' && <span>✓</span>}
              </div>
              <span>Evento</span>
            </div>
          </div>
        </div>

        {formData.tipo === 'evento' && (
          <div className="form-row">
            <div className="form-group">
              <label>No. Evento</label>
              <input
                type="text"
                name="noEvento"
                value={formData.noEvento}
                onChange={handleChange}
                placeholder="Número de evento"
                className="compact-input"
              />
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Evento</label>
              <input
                type="text"
                name="nombreEvento"
                value={formData.nombreEvento}
                onChange={handleChange}
                placeholder="Evento"
                className="compact-input"
              />
            </div>
          </div>
        )}


        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Actualizar Actividad' : 'Guardar Actividad'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={resetForm}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Activity List Table */}
      <div className="actividades-table-container">
        <div className="table-header">
          <h3>Actividades Recientes</h3>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar folio..."
              value={busquedaFolio}
              onChange={(e) => setBusquedaFolio(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Folio</th>
                <th style={{ textAlign: 'center' }}>Tipo</th>
                <th style={{ textAlign: 'center' }}>Fecha</th>
                <th style={{ textAlign: 'center' }}>Hora</th>
                <th style={{ textAlign: 'center' }}>Lugar</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {actividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data" style={{ textAlign: 'center' }}>
                    {busquedaFolio ? 'No se encontró el folio' : 'No hay actividades registradas'}
                  </td>
                </tr>
              ) : (
                actividadesFiltradas.map(act => (
                  <tr key={act.id_actividad}>
                    <td style={{ textAlign: 'center' }}>{act.id_actividad}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${act.tipo}`}>
                        {act.tipo === 'administrativo' ? 'A' : act.tipo === 'evento' ? 'E' : act.tipo.charAt(0).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{new Date(act.fecha).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'center' }}>{act.hora}</td>
                    <td style={{ textAlign: 'center' }}>{act.id_municipio ? act.municipio_nombre : act.lugar}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons" style={{ justifyContent: 'center', display: 'flex' }}>
                        <button
                          className="btn-icon edit"
                          onClick={() => handleEdit(act)}
                          title="Editar"
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
      </div>
    </div>
  );
};

export default Actividad;