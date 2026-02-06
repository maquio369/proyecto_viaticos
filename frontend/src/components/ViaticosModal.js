import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
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
    Delete as DeleteIcon
} from '@mui/icons-material';

const ViaticosModal = ({ isOpen, onClose, idMemorandum, idEmpleado, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [municipios, setMunicipios] = useState([]);
    const [firmas, setFirmas] = useState([]);
    const [detalles, setDetalles] = useState([]);

    const [formData, setFormData] = useState({
        pasaje: 0,
        combustible: 0,
        otros: 0,
        tipo: '',
        id_firma: '',
        id_municipio: '',
        monto_diario: 0,
        fecha_inicio: '',
        fecha_fin: '',
        dias: 0,
        pernocta: false
    });

    const [totalCalculado, setTotalCalculado] = useState(0);

    useEffect(() => {
        if (isOpen) {
            cargarCatalogos();
            cargarDetalles();
        }
    }, [isOpen, idMemorandum]);

    useEffect(() => {
        const total = (parseFloat(formData.monto_diario) || 0) * (parseFloat(formData.dias) || 0);
        setTotalCalculado(total);
    }, [formData.monto_diario, formData.dias]);

    useEffect(() => {
        if (formData.id_municipio && idEmpleado) {
            calcularTarifa();
        }
    }, [formData.id_municipio, formData.pernocta]);

    const cargarCatalogos = async () => {
        try {
            const resM = await axios.get(`${API_BASE_URL}/api/catalogos/municipios`);
            setMunicipios(resM.data.municipios);

            const resF = await axios.get(`${API_BASE_URL}/api/catalogos/firma-por-empleado/${idEmpleado}`);
            if (resF.data.firma) {
                setFirmas([resF.data.firma]);
                setFormData(prev => ({ ...prev, id_firma: resF.data.firma.id_firma }));
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id_firma || !formData.tipo) {
            alert("Faltan datos obligatorios (Firma o Tipo de Pago)");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_memorandum_comision: idMemorandum,
                ...formData,
                monto_calculado: totalCalculado,
                tipo_pago: formData.tipo
            };

            await axios.post(`${API_BASE_URL}/api/viaticos`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Viático agregado correctamente');
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
            alert('Error al guardar');
        }
    };

    const eliminarDetalle = async (id) => {
        if (!window.confirm("¿Seguro de eliminar este registro?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/viaticos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            cargarDetalles();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    const inputStyle = {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '0.9rem',
        transition: 'border-color 0.2s'
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        color: '#546e7a',
        fontSize: '0.8rem',
        fontWeight: '500',
        marginBottom: '0.3rem'
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content viaticos-modal" style={{ maxWidth: '850px', maxHeight: '90vh', overflow: 'auto' }}>
                {/* Header Compacto */}
                <div style={{
                    background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
                    color: 'white',
                    padding: '1rem 1.25rem',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CalculateIcon style={{ fontSize: '1.5rem' }} />
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Cálculo de Viáticos</h3>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.5rem',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                    }}>&times;</button>
                </div>

                <div style={{ padding: '1rem' }}>
                    {/* Sección Gastos - Más Compacta */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        border: '1px solid #e0e0e0'
                    }}>
                        <h4 style={{
                            color: '#00796b',
                            margin: '0 0 0.6rem 0',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                            <MoneyIcon fontSize="small" /> Gastos y Configuración
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '0.6rem' }}>
                            <div>
                                <label style={labelStyle}>
                                    <FlightIcon sx={{ fontSize: '0.9rem' }} /> Pasajes
                                </label>
                                <input type="number" name="pasaje" value={formData.pasaje} onChange={handleInputChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <GasIcon sx={{ fontSize: '0.9rem' }} /> Combustible
                                </label>
                                <input type="number" name="combustible" value={formData.combustible} onChange={handleInputChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <MoreIcon sx={{ fontSize: '0.9rem' }} /> Otros
                                </label>
                                <input type="number" name="otros" value={formData.otros} onChange={handleInputChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>💳 Tipo Pago</label>
                                <select name="tipo" value={formData.tipo} onChange={handleInputChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
                                    <option value="">Seleccionar</option>
                                    <option value="Efectivo">💵 Efectivo</option>
                                    <option value="Cheque">📝 Cheque</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>✍️ Firma Autorizada</label>
                            <select name="id_firma" value={formData.id_firma} onChange={handleInputChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="">Seleccionar</option>
                                {firmas.map(f => (
                                    <option key={f.id_firma} value={f.id_firma}>{f.nombre_firma} - {f.cargo_firma}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Calculadora - Compacta */}
                    <form onSubmit={handleSubmit} style={{
                        background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        border: '2px solid #009688'
                    }}>
                        <h4 style={{
                            color: '#00796b',
                            margin: '0 0 0.6rem 0',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                            <CalculateIcon fontSize="small" /> Calculadora de Viáticos
                        </h4>

                        <div style={{ marginBottom: '0.6rem' }}>
                            <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>
                                <LocationIcon sx={{ fontSize: '0.9rem' }} /> Municipio Destino
                            </label>
                            <select name="id_municipio" value={formData.id_municipio} onChange={handleInputChange} required
                                style={{ ...inputStyle, border: '2px solid #009688', background: 'white', cursor: 'pointer', fontWeight: '500' }}>
                                <option value="">SELECCIONAR</option>
                                {municipios.map(m => (
                                    <option key={m.id_municipio} value={m.id_municipio}>{m.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                            <div>
                                <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>💰 Tarifa Diaria</label>
                                <input type="text" value={`$${parseFloat(formData.monto_diario || 0).toFixed(2)}`} readOnly
                                    style={{ ...inputStyle, border: '2px solid #009688', fontSize: '1rem', fontWeight: 'bold', background: 'white', color: '#00796b', textAlign: 'center' }}
                                />
                            </div>

                            <div>
                                <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>
                                    <HotelIcon sx={{ fontSize: '0.9rem' }} /> Pernocta
                                </label>
                                <div style={{
                                    background: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '2px solid #009688',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    gap: '0.3rem'
                                }}>
                                    <div
                                        onClick={() => handleInputChange({ target: { name: 'pernocta', type: 'checkbox', checked: !formData.pernocta } })}
                                        style={{
                                            width: '50px',
                                            height: '24px',
                                            background: formData.pernocta ? '#4caf50' : '#ccc',
                                            borderRadius: '12px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease',
                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '2px',
                                            left: formData.pernocta ? '28px' : '2px',
                                            transition: 'left 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: formData.pernocta ? '#4caf50' : '#666' }}>
                                        {formData.pernocta ? 'SI (mayor a 24 Hrs.)' : 'NO (entre 8 y 24 Hrs.)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                            <div>
                                <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>
                                    <CalendarIcon sx={{ fontSize: '0.85rem' }} /> Inicio
                                </label>
                                <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleInputChange} required
                                    style={{ ...inputStyle, border: '2px solid #009688', background: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>
                                    <CalendarIcon sx={{ fontSize: '0.85rem' }} /> Fin
                                </label>
                                <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleInputChange} required
                                    style={{ ...inputStyle, border: '2px solid #009688', background: 'white' }}
                                />
                            </div>
                        </div>

                        {/* Fila Final Compacta */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 1fr auto',
                            gap: '0.6rem',
                            alignItems: 'end',
                            background: 'white',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '2px dashed #009688'
                        }}>
                            <div>
                                <label style={{ ...labelStyle, color: '#00796b', fontWeight: '600' }}>
                                    <TimeIcon sx={{ fontSize: '0.85rem' }} /> Días
                                </label>
                                <input type="number" step="0.5" name="dias" value={formData.dias} onChange={handleInputChange} required
                                    style={{ ...inputStyle, border: '2px solid #009688', fontSize: '0.95rem', fontWeight: 'bold', textAlign: 'center' }}
                                />
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <label style={{ color: '#00796b', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.3rem', display: 'block' }}>
                                    💵 TOTAL
                                </label>
                                <div style={{
                                    background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 8px rgba(0, 150, 136, 0.3)'
                                }}>
                                    ${totalCalculado.toFixed(2)}
                                </div>
                            </div>

                            <button type="submit" style={{
                                background: 'linear-gradient(135deg, #ec407a 0%, #d81b60 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '6px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(236, 64, 122, 0.3)',
                                whiteSpace: 'nowrap'
                            }}>
                                ➕ Agregar
                            </button>
                        </div>
                    </form>

                    {/* Tabla Compacta */}
                    <div style={{
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <h4 style={{
                            color: '#00796b',
                            margin: '0 0 0.6rem 0',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}>
                            📋 Viáticos Registrados
                        </h4>

                        <div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #009688', color: '#00796b', fontWeight: '600', fontSize: '0.8rem' }}>
                                            <LocationIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.2rem' }} />Lugar
                                        </th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #009688', color: '#00796b', fontWeight: '600', fontSize: '0.8rem' }}>
                                            <TimeIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.2rem' }} />Días
                                        </th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #009688', color: '#00796b', fontWeight: '600', fontSize: '0.8rem' }}>
                                            <HotelIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.2rem' }} />Pernocta
                                        </th>
                                        <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid #009688', color: '#00796b', fontWeight: '600', fontSize: '0.8rem' }}>
                                            <MoneyIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.2rem' }} />Monto
                                        </th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #009688', color: '#00796b', fontWeight: '600', fontSize: '0.8rem' }}>
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((d, index) => (
                                        <tr key={d.id_detalle_viatico} style={{ background: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                            <td style={{ padding: '0.5rem', borderBottom: '1px solid #e0e0e0' }}>{d.municipio_nombre}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '500' }}>{d.dias}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
                                                <span style={{
                                                    background: d.pernocta ? '#4caf50' : '#ff9800',
                                                    color: 'white',
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {d.pernocta ? 'SÍ' : 'NO'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: '600', color: '#00796b' }}>
                                                ${parseFloat(d.monto_calculado).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
                                                <button onClick={() => eliminarDetalle(d.id_detalle_viatico)}
                                                    style={{
                                                        background: '#f44336',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.3rem 0.5rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.2rem'
                                                    }}>
                                                    <DeleteIcon sx={{ fontSize: '0.9rem' }} /> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {detalles.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#90a4ae', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                                📭 Sin viáticos asignados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViaticosModal;
