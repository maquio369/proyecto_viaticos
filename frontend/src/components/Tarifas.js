import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, ButtonGroup, Typography, Box, CircularProgress, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Alert, TablePagination
} from '@mui/material';
import { Edit as EditIcon, Hotel as HotelIcon, AccessTime as TimeIcon } from '@mui/icons-material';

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('24+'); // '24+' (Pernota) or '8-24' (Sin Pernota)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [error, setError] = useState(null);

    // Edit State
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTarifa, setSelectedTarifa] = useState(null);
    const [newAmount, setNewAmount] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTarifas();
    }, []);

    const fetchTarifas = async () => {
        try {
            // Use 127.0.0.1 as per previous fix
            const response = await axios.get(`${API_BASE_URL}/api/tarifas`);
            setTarifas(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tarifas:', err);
            setError('Error al cargar las tarifas');
            setLoading(false);
        }
    };

    const handleEditClick = (tarifa) => {
        setSelectedTarifa(tarifa);
        setNewAmount(tarifa.monto_diario);
        setEditOpen(true);
    };

    const handleSave = async () => {
        if (!newAmount || isNaN(newAmount) || Number(newAmount) < 0) {
            alert('Por favor ingrese un monto válido');
            return;
        }

        setSaving(true);
        try {
            await axios.put(`${API_BASE_URL}/api/tarifas/${selectedTarifa.id_tarifa}`, {
                monto_diario: newAmount
            });

            // Update local state
            setTarifas(tarifas.map(t =>
                t.id_tarifa === selectedTarifa.id_tarifa ? { ...t, monto_diario: newAmount } : t
            ));

            setEditOpen(false);
        } catch (err) {
            console.error('Error updating tarifa:', err);
            alert('Error al actualizar la tarifa');
        } finally {
            setSaving(false);
        }
    };

    const filteredTarifas = tarifas.filter(t => t.tipo_dia === filter);

    const totalPages = Math.ceil(filteredTarifas.length / rowsPerPage);
    const currentPageData = filteredTarifas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Reset page when filter changes
    useEffect(() => {
        setPage(0);
    }, [filter]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    // Calculate empty rows for consistent height if needed
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredTarifas.length - page * rowsPerPage);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#009688' }} />
        </Box>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <div className="actividades-table-container tarifas-table-container" style={{ marginTop: 0 }}>
                <div className="table-header" style={{ justifyContent: 'space-between' }}>
                    <h3>Tarifas Vigentes</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setFilter('24+')}
                            style={{
                                backgroundColor: filter === '24+' ? '#009688' : 'white',
                                color: filter === '24+' ? 'white' : '#009688',
                                border: '1px solid #009688',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <HotelIcon fontSize="small" /> Pernota (24+)
                        </button>
                        <button
                            onClick={() => setFilter('8-24')}
                            style={{
                                backgroundColor: filter === '8-24' ? '#009688' : 'white',
                                color: filter === '8-24' ? 'white' : '#009688',
                                border: '1px solid #009688',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <TimeIcon fontSize="small" /> Sin Pernota (8-24)
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center', width: '15%' }}>Nivel</th>
                                <th style={{ textAlign: 'center', width: '20%' }}>Zona</th>
                                <th style={{ textAlign: 'center', width: '25%' }}>Importe</th>
                                <th style={{ textAlign: 'center', width: '25%' }}>Fecha Actualización</th>
                                <th style={{ textAlign: 'center', width: '15%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.length > 0 ? (
                                currentPageData.map((tarifa) => (
                                    <tr key={tarifa.id_tarifa}>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            {tarifa.nivel_aplicacion}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: '#e0f2f1', color: '#00695c',
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold'
                                            }}>
                                                Zona {tarifa.codigo_zona || tarifa.id_zona}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center', color: '#00796b', fontWeight: 'bold', fontSize: '1rem' }}>
                                            ${Number(tarifa.monto_diario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ textAlign: 'center', color: '#546e7a' }}>
                                            {tarifa.vigente_desde ? new Date(tarifa.vigente_desde).toLocaleDateString() : '-'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-icon edit"
                                                    onClick={() => handleEditClick(tarifa)}
                                                    title="Editar Monto"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', fontStyle: 'italic', color: '#90a4ae' }}>
                                        No hay tarifas disponibles para este filtro.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '5px' }}>
                        <button
                            onClick={() => handleChangePage(page - 1)}
                            disabled={page === 0}
                            className="btn-secondary"
                            style={{
                                padding: '5px 10px',
                                cursor: page === 0 ? 'not-allowed' : 'pointer',
                                opacity: page === 0 ? 0.6 : 1
                            }}
                        >
                            Ant.
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleChangePage(index)}
                                className="btn-secondary"
                                style={{
                                    padding: '5px 10px',
                                    minWidth: '35px',
                                    backgroundColor: page === index ? '#009688' : 'white',
                                    color: page === index ? 'white' : '#009688',
                                    border: '1px solid #009688',
                                    cursor: 'pointer'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handleChangePage(page + 1)}
                            disabled={page === totalPages - 1}
                            className="btn-secondary"
                            style={{
                                padding: '5px 10px',
                                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                                opacity: page === totalPages - 1 ? 0.6 : 1
                            }}
                        >
                            Sig.
                        </button>
                    </div>
                )}
            </div>




            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle sx={{ color: '#00796b' }}>Editar Tarifa</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, minWidth: 300 }}>
                        {selectedTarifa && (
                            <>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Nivel: <strong>{selectedTarifa.nivel_aplicacion}</strong> | Zona: <strong>{selectedTarifa.codigo_zona}</strong>
                                </Typography>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Importe Diario"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                                    }}
                                />
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditOpen(false)} color="inherit">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ bgcolor: '#009688', '&:hover': { bgcolor: '#00796b' } }}>
                        {saving ? 'Guardando...' : 'Guardar Cambio'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

const ReceiptIconWrapper = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7zm-3 8h2v-2H4v2zm0 4h2v-2H4v2zm0-8h2V7H4v2zm4 4h14v-2H8v2zm0 4h14v-2H8v2zM8 7v2h14V7H8z" />
    </svg>
);

export default Tarifas;
