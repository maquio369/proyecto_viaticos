import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
// import { CircularProgress } from '@mui/material'; // Removed unused import

const CapturaVehiculos = ({ handleLogout }) => {
    const [formData, setFormData] = useState({
        numero_economico: '',
        id_marca_de_vehiculo: '',
        id_tipo_de_vehiculo: '',
        id_clase_de_vehiculo: '',
        modelo: '',
        placas_anteriores: '',
        placas_actuales: '',
        numero_de_motor: '',
        serie: '',
        id_estatus_de_vehiculo: '',
        id_usos_de_vehiculo: '',
        id_empleado: '',
        id_estructura_administrativa: 1
    });

    const [catalogs, setCatalogs] = useState({
        marcas: [],
        tipos: [],
        clases: [],
        estatus: [],
        usos: [],
        empleados: []
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarDatos = async () => {
        try {
            // Cargar catálogos y lista de vehículos en paralelo
            const [marcasRes, tiposRes, clasesRes, estatusRes, usosRes, empleadosRes, vehiculosRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/vehiculos/marcas`),
                axios.get(`${API_BASE_URL}/api/vehiculos/tipos`),
                axios.get(`${API_BASE_URL}/api/vehiculos/clases`),
                axios.get(`${API_BASE_URL}/api/vehiculos/estatus`),
                axios.get(`${API_BASE_URL}/api/vehiculos/usos`),
                axios.get(`${API_BASE_URL}/api/catalogos/empleados`),
                axios.get(`${API_BASE_URL}/api/vehiculos`)
            ]);

            setCatalogs({
                marcas: marcasRes.data,
                tipos: tiposRes.data,
                clases: clasesRes.data,
                estatus: estatusRes.data,
                usos: usosRes.data,
                empleados: empleadosRes.data.empleados || []
            });

            setVehiculos(vehiculosRes.data);

        } catch (error) {
            console.error('Error cargando datos:', error);
            if (error.response && error.response.status === 401) {
                alert('Sesión expirada');
                if (handleLogout) handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const cargarVehiculos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/vehiculos`);
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/vehiculos/${editingId}`, formData);
                alert('Vehículo actualizado exitosamente');
            } else {
                await axios.post(`${API_BASE_URL}/api/vehiculos`, formData);
                alert('Vehículo registrado exitosamente');
            }

            resetForm();
            cargarVehiculos();

        } catch (error) {
            console.error('Error guardando vehículo:', error);
            if (error.response && error.response.status === 401) {
                alert('Sesión expirada');
                if (handleLogout) handleLogout();
            } else {
                alert('Error al guardar el vehículo');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (vehiculo) => {
        setFormData({
            numero_economico: vehiculo.numero_economico,
            id_marca_de_vehiculo: vehiculo.id_marca_de_vehiculo,
            id_tipo_de_vehiculo: vehiculo.id_tipo_de_vehiculo,
            id_clase_de_vehiculo: vehiculo.id_clase_de_vehiculo,
            modelo: vehiculo.modelo,
            placas_anteriores: vehiculo.placas_anteriores || '',
            placas_actuales: vehiculo.placas_actuales,
            numero_de_motor: vehiculo.numero_de_motor,
            serie: vehiculo.serie,
            id_estatus_de_vehiculo: vehiculo.id_estatus_de_vehiculo,
            id_usos_de_vehiculo: vehiculo.id_usos_de_vehiculo,
            id_empleado: vehiculo.id_empleado,
            id_estructura_administrativa: 1
        });
        setEditingId(vehiculo.id_vehiculo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/vehiculos/${id}`);
            alert('Vehículo eliminado');
            cargarVehiculos();
        } catch (error) {
            console.error('Error eliminando vehículo:', error);
            alert('Error al eliminar');
        }
    };

    const resetForm = () => {
        setFormData({
            numero_economico: '',
            id_marca_de_vehiculo: '',
            id_tipo_de_vehiculo: '',
            id_clase_de_vehiculo: '',
            modelo: '',
            placas_anteriores: '',
            placas_actuales: '',
            numero_de_motor: '',
            serie: '',
            id_estatus_de_vehiculo: '',
            id_usos_de_vehiculo: '',
            id_empleado: '',
            id_estructura_administrativa: 1
        });
        setEditingId(null);
    };

    const filteredVehiculos = vehiculos.filter(v =>
        (v.numero_economico && v.numero_economico.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.marca_de_vehiculo && v.marca_de_vehiculo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.placas_actuales && v.placas_actuales.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVehiculos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) return <div className="text-center p-5">Cargando...</div>;

    return (
        <div className="actividad-container">
            <form onSubmit={handleSubmit} className="actividad-form">
                <h2>{editingId ? 'Editar Vehículo' : 'Captura de Vehículo'}</h2>

                {/* Fila 1 */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Número Económico</label>
                        <input
                            type="text"
                            name="numero_economico"
                            value={formData.numero_economico}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Serie</label>
                        <input
                            type="text"
                            name="serie"
                            value={formData.serie}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Modelo (Año)</label>
                        <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        />
                    </div>
                </div>

                {/* Fila 2 */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Placas Actuales</label>
                        <input
                            type="text"
                            name="placas_actuales"
                            value={formData.placas_actuales}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Placas Anteriores</label>
                        <input
                            type="text"
                            name="placas_anteriores"
                            value={formData.placas_anteriores}
                            onChange={handleChange}
                            className="compact-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Número de Motor</label>
                        <input
                            type="text"
                            name="numero_de_motor"
                            value={formData.numero_de_motor}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        />
                    </div>
                </div>

                {/* Fila 3 - Catalogos Principales */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Marca</label>
                        <select
                            name="id_marca_de_vehiculo"
                            value={formData.id_marca_de_vehiculo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione marca</option>
                            {catalogs.marcas.map(m => (
                                <option key={m.id_marca_de_vehiculo} value={m.id_marca_de_vehiculo}>
                                    {m.marca_de_vehiculo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="id_tipo_de_vehiculo"
                            value={formData.id_tipo_de_vehiculo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione tipo</option>
                            {catalogs.tipos.map(t => (
                                <option key={t.id_tipos_de_vehiculo} value={t.id_tipos_de_vehiculo}>
                                    {t.tipos_de_vehiculo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Clase</label>
                        <select
                            name="id_clase_de_vehiculo"
                            value={formData.id_clase_de_vehiculo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione clase</option>
                            {catalogs.clases.map(c => (
                                <option key={c.id_clases_de_vehiculo} value={c.id_clases_de_vehiculo}>
                                    {c.clases_de_vehiculo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fila 4 - Detalles y Resguardo */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Estatus</label>
                        <select
                            name="id_estatus_de_vehiculo"
                            value={formData.id_estatus_de_vehiculo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione estatus</option>
                            {catalogs.estatus.map(e => (
                                <option key={e.id_estatus_de_vehiculo} value={e.id_estatus_de_vehiculo}>
                                    {e.estatus_de_vehiculo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Uso</label>
                        <select
                            name="id_usos_de_vehiculo"
                            value={formData.id_usos_de_vehiculo}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione uso</option>
                            {catalogs.usos.map(u => (
                                <option key={u.id_usos_de_vehiculo} value={u.id_usos_de_vehiculo}>
                                    {u.usos_de_vehiculo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Resguardatario</label>
                        <select
                            name="id_empleado"
                            value={formData.id_empleado}
                            onChange={handleChange}
                            required
                            className="compact-input"
                        >
                            <option value="">Seleccione empleado</option>
                            {catalogs.empleados.map(e => (
                                <option key={e.id_empleado} value={e.id_empleado}>
                                    {e.nombres} {e.apellido1} {e.apellido2}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                    >
                        {editingId ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
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

            {/* Tabla de Vehiculos */}
            <div className="actividades-table-container vehiculos-table-container">
                <div className="table-header">
                    <h3>Vehículos Registrados</h3>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar (No. Económico, Marca, Placas)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Tipo</th>
                                <th>Modelo</th>
                                <th>Placas</th>
                                <th>Uso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No hay vehículos registrados
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map(v => (
                                    <tr key={v.id_vehiculo}>
                                        <td>{v.marca_de_vehiculo}</td>
                                        <td>{v.tipos_de_vehiculo}</td>
                                        <td>{v.modelo}</td>
                                        <td>{v.placas_actuales}</td>
                                        <td>{v.uso}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon edit"
                                                    onClick={() => handleEdit(v)}
                                                    title="Editar"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    className="btn-icon delete"
                                                    onClick={() => handleDelete(v.id_vehiculo)}
                                                    title="Eliminar"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '5px' }}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn-secondary"
                            style={{ padding: '5px 10px' }}
                        >
                            Ant.
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '5px 10px', minWidth: '35px' }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn-secondary"
                            style={{ padding: '5px 10px' }}
                        >
                            Sig.
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CapturaVehiculos;
