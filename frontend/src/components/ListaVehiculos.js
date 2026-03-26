import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Box, Typography, TextField, IconButton, Chip, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, DirectionsCar as CarIcon } from '@mui/icons-material';

const ListaVehiculos = ({ onEditarVehiculo }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/vehiculos`);
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/vehiculos/${id}`);
            cargarVehiculos();
        } catch (error) {
            console.error('Error eliminando vehículo:', error);
            alert('Error al eliminar');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const filteredVehiculos = vehiculos.filter(v =>
        (v.numero_economico && v.numero_economico.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.marca_de_vehiculo && v.marca_de_vehiculo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.placas_actuales && v.placas_actuales.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const visibleRows = React.useMemo(
        () => filteredVehiculos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredVehiculos, page, rowsPerPage]
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
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CarIcon sx={{ fontSize: 35, color: '#38bdf8' }} />
                        Vehículos Registrados
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Listado de Unidades • <span style={{ color: '#38bdf8' }}>Administración</span>
                    </Typography>
                </Box>

                <TextField
                    placeholder="Buscar vehículo..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#64748b' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            bgcolor: '#1e293b',
                            color: '#f8fafc',
                            fontWeight: 600,
                            '& fieldset': { borderColor: '#334155' },
                            '&:hover fieldset': { borderColor: '#38bdf8' },
                            '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
                        }
                    }}
                    sx={{ minWidth: 300 }}
                />
            </Box>

            <TableContainer sx={{ pb: 0 }}>
                <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No. Económico</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modelo</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placas</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uso</TableCell>
                            <TableCell align="center" sx={{ borderBottom: 'none', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ borderBottom: 'none', color: '#64748b', py: 4 }}>
                                    No hay vehículos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((vehiculo) => (
                                <TableRow
                                    key={vehiculo.id_vehiculo}
                                    sx={{
                                        backgroundColor: '#1e293b',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                                        borderRadius: '16px',
                                        transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            backgroundColor: '#334155',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                                        },
                                        '& td': { borderBottom: 'none' },
                                        '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                                        '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                                    }}
                                >
                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                                            {vehiculo.numero_economico}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: 600, color: '#cbd5e1' }}>
                                            {vehiculo.marca_de_vehiculo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: 600, color: '#cbd5e1' }}>
                                            {vehiculo.tipos_de_vehiculo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: 600, color: '#cbd5e1' }}>
                                            {vehiculo.modelo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={vehiculo.placas_actuales}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                                color: '#38bdf8',
                                                border: '1px solid rgba(56, 189, 248, 0.2)',
                                                fontWeight: 700,
                                                borderRadius: '6px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.875rem' }}>
                                            {vehiculo.uso}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <IconButton
                                                onClick={() => onEditarVehiculo(vehiculo)}
                                                size="small"
                                                sx={{
                                                    color: '#64748b',
                                                    bgcolor: 'transparent',
                                                    p: 0.75,
                                                    border: '1px solid transparent',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        color: '#38bdf8',
                                                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                                        border: '1px solid rgba(56, 189, 248, 0.3)',
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(vehiculo.id_vehiculo)}
                                                size="small"
                                                sx={{
                                                    color: '#64748b',
                                                    bgcolor: 'transparent',
                                                    p: 0.75,
                                                    border: '1px solid transparent',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        color: '#ef4444',
                                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredVehiculos.length > 0 && (
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

                    {[...Array(Math.ceil(filteredVehiculos.length / rowsPerPage))].map((_, idx) => (
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
                                backgroundColor: page === idx ? '#38bdf8' : 'transparent',
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
                        onClick={(e) => handleChangePage(e, Math.min(Math.ceil(filteredVehiculos.length / rowsPerPage) - 1, page + 1))}
                        disabled={page === Math.ceil(filteredVehiculos.length / rowsPerPage) - 1}
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
        </Box>
    );
};

export default ListaVehiculos;
