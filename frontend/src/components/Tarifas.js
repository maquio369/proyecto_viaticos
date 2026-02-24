import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Button, Typography, Box, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, ToggleButton, ToggleButtonGroup, IconButton
} from '@mui/material';
import { Edit as EditIcon, Hotel as HotelIcon, AccessTime as TimeIcon } from '@mui/icons-material';

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('24+'); // '24+' (Pernota) or '8-24' (Sin Pernota)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
            setPage(0);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const filteredTarifas = tarifas.filter(t => t.tipo_dia === filter);

    // Pagination slicing
    const visibleRows = React.useMemo(
        () =>
            filteredTarifas.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [filteredTarifas, page, rowsPerPage],
    );

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: '#0f172a', height: '100vh', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#38bdf8' }} />
        </Box>
    );

    return (
        <Box sx={{
            maxWidth: '100%',
            margin: '0 auto',
            p: 2,
            fontFamily: "'Inter', sans-serif",
            bgcolor: '#0f172a',
            height: '100vh',
            overflow: 'hidden',
            color: '#f8fafc'
        }}>
            {error && <Alert severity="error" sx={{ mb: 2, bgcolor: '#450a0a', color: '#fecaca' }}>{error}</Alert>}

            {/* Header Compacto Dark */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', mb: 0.5 }}>
                        Tarifas Vigentes
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Control de Viáticos &bull; <span style={{ color: '#38bdf8' }}>Administración</span>
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{
                    border: '1px solid #334155', // Slate 700
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#1e293b' // Slate 800
                }}>
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        aria-label="filtro de tarifas"
                        sx={{
                            '& .MuiToggleButton-root': {
                                border: 'none',
                                px: 2.5,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#94a3b8', // Slate 400
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: '#cbd5e1'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#38bdf8', // Sky 400
                                    color: '#0f172a', // Dark Text for contrast
                                    '&:hover': { backgroundColor: '#7dd3fc' }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="24+">
                            <HotelIcon sx={{ mr: 1, fontSize: 18 }} /> Pernota
                        </ToggleButton>
                        <ToggleButton value="8-24">
                            <TimeIcon sx={{ mr: 1, fontSize: 18 }} /> Sin Pernota
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Paper>
            </Box>

            {/* Tabla Estilo Cards Dark */}
            <TableContainer sx={{ pb: 0 }}>
                <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nivel</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zona Asignada</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Importe Diario</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actualización</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((tarifa) => (
                            <TableRow
                                key={tarifa.id_tarifa}
                                sx={{
                                    backgroundColor: '#1e293b', // Slate 800
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)', // Darker shadow
                                    borderRadius: '16px',
                                    transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        backgroundColor: '#334155', // Slate 700 on hover
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                                    },
                                    '& td': { borderBottom: 'none' },
                                    '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                                    '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                                }}
                            >
                                <TableCell align="center">
                                    <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                                        {tarifa.nivel_aplicacion}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={`Zona ${tarifa.codigo_zona || tarifa.id_zona}`}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(56, 189, 248, 0.1)', // Sky with opacity
                                            color: '#38bdf8', // Sky 400
                                            border: '1px solid rgba(56, 189, 248, 0.2)',
                                            fontWeight: 600,
                                            borderRadius: '6px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Typography sx={{
                                        fontWeight: 700,
                                        color: '#2dd4bf', // Teal 400
                                        fontSize: '1.25rem',
                                        letterSpacing: '-0.02em'
                                    }}>
                                        ${Number(tarifa.monto_diario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {tarifa.vigente_desde ? new Date(tarifa.vigente_desde).toLocaleDateString() : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleEditClick(tarifa)}
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
                                        <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Minimalista Custom Dark */}
            {filteredTarifas.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    <Button
                        onClick={(e) => handleChangePage(e, Math.max(0, page - 1))}
                        disabled={page === 0}
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            minWidth: 'auto',
                            fontWeight: 600,
                            '&:hover': { color: '#f8fafc', bgcolor: 'transparent' },
                            '&.Mui-disabled': { color: '#334155' }
                        }}
                    >
                        Anterior
                    </Button>

                    {[...Array(Math.ceil(filteredTarifas.length / rowsPerPage))].map((_, idx) => (
                        <IconButton
                            key={idx}
                            onClick={(e) => handleChangePage(e, idx)}
                            size="small"
                            sx={{
                                width: 32,
                                height: 32,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                borderRadius: '8px',
                                backgroundColor: page === idx ? '#38bdf8' : 'transparent', // Sky 400 active
                                color: page === idx ? '#0f172a' : '#64748b',
                                '&:hover': {
                                    backgroundColor: page === idx ? '#7dd3fc' : 'rgba(255,255,255,0.05)',
                                    color: page === idx ? '#0f172a' : '#f8fafc'
                                }
                            }}
                        >
                            {idx + 1}
                        </IconButton>
                    ))}

                    <Button
                        onClick={(e) => handleChangePage(e, Math.min(Math.ceil(filteredTarifas.length / rowsPerPage) - 1, page + 1))}
                        disabled={page === Math.ceil(filteredTarifas.length / rowsPerPage) - 1}
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            minWidth: 'auto',
                            fontWeight: 600,
                            '&:hover': { color: '#f8fafc', bgcolor: 'transparent' },
                            '&.Mui-disabled': { color: '#334155' }
                        }}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}

            {/* Edit Dialog - Mejorado */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
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
                    Ajustar Tarifa
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {selectedTarifa && (
                            <>
                                <Chip
                                    label={`${selectedTarifa.nivel_aplicacion} • Zona ${selectedTarifa.codigo_zona}`}
                                    sx={{
                                        alignSelf: 'center',
                                        bgcolor: 'rgba(56, 189, 248, 0.15)',
                                        border: '1px solid rgba(56, 189, 248, 0.3)',
                                        fontWeight: 700,
                                        color: '#38bdf8',
                                        fontSize: '0.9rem',
                                        py: 2.5
                                    }}
                                />

                                {/* Preview Antes/Después */}
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    p: 2.5,
                                    bgcolor: '#0f172a',
                                    borderRadius: '12px',
                                    border: '1px solid #334155'
                                }}>
                                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Actual
                                        </Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#94a3b8' }}>
                                            ${Number(selectedTarifa.monto_diario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                                        →
                                    </Box>
                                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Nuevo
                                        </Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#2dd4bf' }}>
                                            ${newAmount ? Number(newAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}

                        <TextField
                            autoFocus
                            label="Nuevo Monto Diario"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1.5, color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem' }}>$</Typography>,
                                sx: {
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    color: '#f8fafc',
                                    bgcolor: '#0f172a',
                                    outline: 'none !important',
                                    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0
                                    },
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    },
                                    '& input': {
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    },
                                    '& input:focus': {
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    },
                                    '& input:focus-visible': {
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: { color: '#64748b', fontWeight: 600 }
                            }}
                            sx={{
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
                                    outline: 'none !important',
                                    boxShadow: 'none !important',
                                    '&:focus': {
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    },
                                    '&:focus-visible': {
                                        outline: 'none !important',
                                        boxShadow: 'none !important'
                                    }
                                },
                                '& input': {
                                    outline: 'none !important',
                                    boxShadow: 'none !important'
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={() => setEditOpen(false)}
                        sx={{
                            color: '#94a3b8',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 1,
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
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 800,
                            boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.4)',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                bgcolor: '#7dd3fc',
                                boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)',
                                transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                                bgcolor: '#334155',
                                color: '#64748b'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tarifas;
