import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Box, Typography, TextField, CircularProgress, Button, Select, MenuItem,
    InputLabel, FormControl, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    Tabs, Tab, Autocomplete
} from '@mui/material';
import {
    Search as SearchIcon,
    Badge as BadgeIcon,
    Edit as EditIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    AddCircle as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const GestionCategorias = () => {
    const [employees, setEmployees] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [puestosCatalog, setPuestosCatalog] = useState([]);
    const [categoriasLegacyCatalog, setCategoriasLegacyCatalog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchCatalog, setSearchCatalog] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);

    // Modals
    const [openModal, setOpenModal] = useState(false);
    const [openCatalogModal, setOpenCatalogModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [catalogFormData, setCatalogFormData] = useState({
        id_categoria_del_empleado: null,
        clave_categoria: '',
        literal: '',
        categoria: '',
        id_puesto: '',
        literal_viatico: ''
    });



    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/categorias/empleados-categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setEmployees(response.data.employees);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Error al cargar la información', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCatalog = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/categorias/catalogo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setCatalog(response.data.categorias);
            }
        } catch (error) {
            console.error('Error fetching catalog:', error);
        }
    }, []);

    const fetchNiveles = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/categorias/niveles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setNiveles(response.data.niveles);
            }
        } catch (error) {
            console.error('Error fetching niveles:', error);
        }
    }, []);

    const fetchPuestos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/categorias/puestos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPuestosCatalog(response.data.puestos);
        } catch (error) {
            console.error('Error fetching puestos:', error);
        }
    }, []);

    const fetchLegacyCategorias = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/categorias/legacy-catalog`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setCategoriasLegacyCatalog(response.data.categorias);
            }
        } catch (error) {
            console.error('Error fetching legacy categorias:', error);
            showSnackbar('Error al cargar catálogo de categorías base', 'error');
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchCatalog();
        fetchNiveles();
        fetchPuestos();
        fetchLegacyCategorias();
    }, [fetchData, fetchCatalog, fetchNiveles, fetchPuestos, fetchLegacyCategorias]);

    const handleOpenModal = (employee) => {
        setSelectedEmployee(employee);
        setSelectedCategory(employee.id_categoria_del_empleado || '');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployee(null);
        setSelectedCategory('');
    };

    const handleAssign = async () => {
        if (!selectedCategory) {
            showSnackbar('Selecciona una categoría', 'warning');
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/categorias/asignar`, {
                id_empleado: selectedEmployee.id_empleado,
                id_categoria_del_empleado: selectedCategory
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            showSnackbar('Categoría asignada correctamente', 'success');
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Error assigning:', error);
            showSnackbar('Error al asignar categoría', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateLiteral = async (id_categoria, nuevoLiteral) => {
        try {
            const token = localStorage.getItem('token');
            const cat = catalog.find(c => c.id_categoria_del_empleado === id_categoria);
            await axios.put(`${API_BASE_URL}/api/categorias/catalogo/${id_categoria}`, {
                clave_categoria: cat.clave_categoria,
                literal: cat.literal,
                categoria: cat.id_categoria_puesto,
                id_puesto: cat.id_puesto,
                literal_viatico: nuevoLiteral
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            showSnackbar('Literal actualizado correctamente');
            fetchCatalog();
            fetchData();
        } catch (error) {
            console.error('Error updating literal:', error);
            showSnackbar('Error al actualizar literal', 'error');
        }
    };

    const handleOpenCatalogModal = (entry = null) => {
        if (entry) {
            setCatalogFormData({
                ...entry,
                categoria: entry.id_categoria_puesto || entry.categoria,
                id_puesto: entry.id_puesto || ''
            });
        } else {
            setCatalogFormData({
                id_categoria_del_empleado: null,
                clave_categoria: '',
                literal: '',
                categoria: '',
                id_puesto: '',
                literal_viatico: ''
            });
        }
        setOpenCatalogModal(true);
    };

    const handleSaveCatalogEntry = async () => {
        if (!catalogFormData.clave_categoria || !catalogFormData.categoria) {
            showSnackbar('Clave y Categoría son obligatorios', 'warning');
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                clave_categoria: catalogFormData.clave_categoria,
                literal: catalogFormData.literal,
                categoria: catalogFormData.categoria,
                id_puesto: catalogFormData.id_puesto,
                literal_viatico: catalogFormData.literal_viatico
            };

            if (catalogFormData.id_categoria_del_empleado) {
                // Update
                await axios.put(`${API_BASE_URL}/api/categorias/catalogo/${catalogFormData.id_categoria_del_empleado}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showSnackbar('Categoría actualizada correctamente');
            } else {
                // Create
                await axios.post(`${API_BASE_URL}/api/categorias/catalogo`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showSnackbar('Categoría creada correctamente');
            }
            setOpenCatalogModal(false);
            fetchCatalog();
            fetchData();
        } catch (error) {
            console.error('Error saving catalog entry:', error);
            showSnackbar('Error al guardar categoría', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCatalogEntry = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/categorias/catalogo/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showSnackbar('Categoría eliminada correctamente');
            fetchCatalog();
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
            showSnackbar('Error al eliminar categoría', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const filteredEmployees = employees.filter(emp =>
        emp.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
        emp.area?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredCatalog = catalog.filter(cat =>
        (cat.categoria_nombre || '').toLowerCase().includes(searchCatalog.toLowerCase()) ||
        cat.literal.toLowerCase().includes(searchCatalog.toLowerCase()) ||
        cat.literal_viatico?.toLowerCase().includes(searchCatalog.toLowerCase()) ||
        cat.clave_categoria?.toString().includes(searchCatalog)
    );

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: '#0f172a',
            borderRadius: '12px',
            color: '#f8fafc',
            '& fieldset': { borderColor: '#334155', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
            '&.Mui-focused': { bgcolor: '#0f172a' },
            '& .MuiOutlinedInput-input': { bgcolor: 'transparent !important' },
        },
        '& .MuiInputBase-input': { color: '#f8fafc', fontWeight: 600 },
        '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
        '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
        '& .MuiSelect-icon': { color: '#64748b' }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LayersIcon sx={{ fontSize: 40, color: '#38bdf8' }} />
                        Gestión de Categorías
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, mt: 0.5 }}>
                        Niveles de Viáticos • <span style={{ color: '#38bdf8' }}>Administración</span>
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: '#334155', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, v) => {
                        setTabValue(v);
                        setPage(0);
                    }}
                    sx={{
                        '& .MuiTab-root': {
                            color: '#64748b',
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '1rem',
                            minHeight: 48,
                            '&.Mui-selected': { color: '#38bdf8' }
                        },
                        '& .MuiTabs-indicator': { bgcolor: '#38bdf8', height: 3 }
                    }}
                >
                    <Tab icon={<PersonIcon />} iconPosition="start" label="Asignación a Empleados" />
                    <Tab icon={<SettingsIcon />} iconPosition="start" label="Configuración del Catálogo" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <TextField
                            placeholder="Buscar empleado o área..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            sx={{ minWidth: 320, ...inputStyles }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#38bdf8' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress sx={{ color: '#38bdf8' }} />
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflowX: 'hidden' }}>
                                <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                    <TableHead>
                                        <TableRow sx={{ '& th': { borderBottom: 'none', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' } }}>
                                            <TableCell align="center">Empleado</TableCell>
                                            <TableCell align="center">Área</TableCell>
                                            <TableCell align="center">Categoría Asignada</TableCell>
                                            <TableCell align="center">Literal Viático</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredEmployees
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((emp) => (
                                                <TableRow
                                                    key={emp.id_empleado}
                                                    sx={{
                                                        bgcolor: '#1e293b',
                                                        transition: 'all 0.2s',
                                                        '&:hover': { transform: 'translateY(-2px)', bgcolor: '#334155' },
                                                        '& td': { borderBottom: 'none' },
                                                        '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                                                        '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                                                    }}
                                                >
                                                    <TableCell align="center">
                                                        <Typography sx={{ fontWeight: 700, color: '#f8fafc' }}>{emp.nombre_completo}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>{emp.area || '---'}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {emp.categoria_nombre ? (
                                                            <Chip
                                                                label={emp.categoria_nombre}
                                                                size="small"
                                                                sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 600, border: '1px solid rgba(56, 189, 248, 0.2)' }}
                                                            />
                                                        ) : (
                                                            <Typography sx={{ color: '#ef4444', fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 600 }}>Pendiente</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {emp.literal_viatico ? (
                                                            <Box sx={{
                                                                display: 'inline-flex',
                                                                width: 32,
                                                                height: 32,
                                                                bgcolor: 'rgba(34, 197, 94, 0.15)',
                                                                color: '#22c55e',
                                                                borderRadius: '8px',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 900,
                                                                border: '1px solid rgba(34, 197, 94, 0.3)'
                                                            }}>
                                                                {emp.literal_viatico}
                                                            </Box>
                                                        ) : (
                                                            <Typography sx={{ color: '#64748b', fontSize: '1.2rem' }}>---</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton
                                                                onClick={() => handleOpenModal(emp)}
                                                                size="small"
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    p: 0,
                                                                    color: emp.id_categoria_del_empleado ? '#38bdf8' : '#64748b',
                                                                    bgcolor: 'rgba(100, 116, 139, 0.1)',
                                                                    borderRadius: '10px',
                                                                    '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {filteredEmployees.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                                    <Button
                                        onClick={() => setPage(Math.max(0, page - 1))}
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

                                    {(() => {
                                        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
                                        const start = Math.max(0, page - 4);
                                        const end = Math.min(totalPages - 1, page + 4);
                                        const pages = [];
                                        for (let i = start; i <= end; i++) pages.push(i);

                                        return pages.map((idx) => (
                                            <IconButton
                                                key={idx}
                                                onClick={() => setPage(idx)}
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
                                        ));
                                    })()}

                                    <Button
                                        onClick={() => setPage(Math.min(Math.ceil(filteredEmployees.length / rowsPerPage) - 1, page + 1))}
                                        disabled={page === Math.ceil(filteredEmployees.length / rowsPerPage) - 1}
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
                        </>
                    )}
                </>
            )}

            {tabValue === 1 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 4 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenCatalogModal()}
                            sx={{
                                bgcolor: '#38bdf8',
                                color: '#0f172a',
                                borderRadius: '10px',
                                fontWeight: 800,
                                textTransform: 'none',
                                px: 1.5,
                                py: 1,
                                fontSize: '0.85rem',
                                '&:hover': { bgcolor: '#7dd3fc' }
                            }}
                        >
                            Nueva Categoría
                        </Button>

                        <TextField
                            placeholder="Buscar en catálogo..."
                            value={searchCatalog}
                            onChange={(e) => setSearchCatalog(e.target.value)}
                            size="small"
                            sx={{ minWidth: 320, ...inputStyles }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#38bdf8' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none', overflowX: 'hidden' }}>
                        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <TableHead>
                                <TableRow sx={{ '& th': { borderBottom: 'none', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' } }}>
                                    <TableCell align="center">Literal / Código</TableCell>
                                    <TableCell align="center">Categoría (Puesto)</TableCell>
                                    <TableCell align="center">Nivel Viático</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCatalog
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((cat) => (
                                        <TableRow
                                            key={cat.id_categoria_del_empleado}
                                            sx={{
                                                bgcolor: '#1e293b',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: '#334155' },
                                                '& td': { borderBottom: 'none' },
                                                '& td:first-of-type': { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' },
                                                '& td:last-of-type': { borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }
                                            }}
                                        >
                                            <TableCell align="center">
                                                <Typography sx={{ fontWeight: 800, color: '#38bdf8' }}>{cat.literal}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontWeight: 600, color: '#f8fafc' }}>{cat.categoria_nombre}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.nombre_puesto}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <FormControl fullWidth size="small" sx={{ ...inputStyles, maxWidth: 120 }}>
                                                    <Select
                                                        value={cat.literal_viatico || ''}
                                                        onChange={(e) => handleUpdateLiteral(cat.id_categoria_del_empleado, e.target.value)}
                                                        sx={{
                                                            borderRadius: '10px',
                                                            '& .MuiSelect-select': { py: 0.5, fontWeight: 900 }
                                                        }}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                sx: {
                                                                    bgcolor: '#1e293b',
                                                                    color: '#f8fafc',
                                                                    '& .MuiMenuItem-root': {
                                                                        fontWeight: 700,
                                                                        '&:hover': { bgcolor: '#334155' },
                                                                        '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.2) !important' }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value=""><em>--</em></MenuItem>
                                                        {niveles.map((nivel) => (
                                                            <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <IconButton
                                                        onClick={() => handleOpenCatalogModal(cat)}
                                                        size="small"
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            p: 0,
                                                            color: '#38bdf8',
                                                            bgcolor: 'rgba(56, 189, 248, 0.1)',
                                                            borderRadius: '8px',
                                                            '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' },
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteCatalogEntry(cat.id_categoria_del_empleado)}
                                                        size="small"
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            p: 0,
                                                            color: '#ef4444',
                                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                            borderRadius: '8px',
                                                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {filteredCatalog.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                            <Button
                                onClick={() => setPage(Math.max(0, page - 1))}
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

                            {(() => {
                                const totalPages = Math.ceil(filteredCatalog.length / rowsPerPage);
                                const start = Math.max(0, page - 4);
                                const end = Math.min(totalPages - 1, page + 4);
                                const pages = [];
                                for (let i = start; i <= end; i++) pages.push(i);

                                return pages.map((idx) => (
                                    <IconButton
                                        key={idx}
                                        onClick={() => setPage(idx)}
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
                                ));
                            })()}

                            <Button
                                onClick={() => setPage(Math.min(Math.ceil(filteredCatalog.length / rowsPerPage) - 1, page + 1))}
                                disabled={page === Math.ceil(filteredCatalog.length / rowsPerPage) - 1}
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
                </>
            )}

            {/* Modal de Asignación */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '20px', bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, pt: 3 }}>
                    Asignar Categoría
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
                    {selectedEmployee && (
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Chip
                                icon={<BadgeIcon sx={{ color: '#38bdf8 !important' }} />}
                                label={selectedEmployee.nombre_completo}
                                sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, py: 2, border: '1px solid rgba(56, 189, 248, 0.2)' }}
                            />
                        </Box>
                    )}

                    <Autocomplete
                        fullWidth
                        options={catalog}
                        getOptionLabel={(option) => `${option.literal_viatico} - (${option.clave_categoria}) ${option.categoria_nombre}`}
                        value={catalog.find(c => c.id_categoria_del_empleado === selectedCategory) || null}
                        onChange={(event, newValue) => {
                            setSelectedCategory(newValue ? newValue.id_categoria_del_empleado : '');
                        }}
                        filterOptions={(options, { inputValue }) => {
                            const search = inputValue.toLowerCase();
                            return options.filter(opt =>
                                (opt.categoria_nombre || '').toLowerCase().includes(search) ||
                                (opt.clave_categoria || '').toString().includes(search) ||
                                (opt.literal || '').toLowerCase().includes(search) ||
                                (opt.nombre_puesto || '').toLowerCase().includes(search)
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar por Código o Categoría"
                                sx={{
                                    ...inputStyles,
                                    '& .MuiInputBase-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        )}
                        slotProps={{
                            paper: {
                                sx: {
                                    bgcolor: '#1e293b',
                                    color: '#f8fafc',
                                    border: '1px solid #334155',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                    backgroundImage: 'none', // Remove elevation overlay
                                    '& .MuiAutocomplete-listbox': {
                                        padding: 0,
                                        '& .MuiAutocomplete-option': {
                                            padding: '12px 16px',
                                            borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
                                            '&:hover': { bgcolor: '#334155 !important' },
                                            '&.Mui-focused': { bgcolor: '#334155 !important' },
                                            '&[aria-selected="true"]': {
                                                bgcolor: 'rgba(56, 189, 248, 0.2) !important',
                                                color: '#38bdf8'
                                            }
                                        }
                                    },
                                    '& .MuiAutocomplete-noOptions': {
                                        color: '#64748b',
                                        bgcolor: '#1e293b',
                                        p: 2,
                                        fontWeight: 600
                                    }
                                }
                            }
                        }}
                        renderOption={(props, cat) => (
                            <li {...props} key={cat.id_categoria_del_empleado}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Box sx={{
                                        minWidth: 28,
                                        height: 28,
                                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                                        color: '#22c55e',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.8rem'
                                    }}>
                                        {cat.literal_viatico}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.literal} - {cat.categoria_nombre}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{cat.clave_categoria}</span> • {cat.nombre_puesto}
                                        </Typography>
                                    </Box>
                                </Box>
                            </li>
                        )}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                    <Button onClick={handleCloseModal} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAssign}
                        variant="contained"
                        disabled={actionLoading}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            borderRadius: '10px',
                            fontWeight: 800,
                            textTransform: 'none',
                            px: 3,
                            '&:hover': { bgcolor: '#7dd3fc' }
                        }}
                    >
                        {actionLoading ? 'Asignando...' : 'Asignar Categoría'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de CRUD Catálogo */}
            <Dialog
                open={openCatalogModal}
                onClose={() => setOpenCatalogModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '20px', bgcolor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, pt: 3 }}>
                    {catalogFormData.id_categoria_del_empleado ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                        <TextField
                            label="Clave Categoría"
                            value={catalogFormData.clave_categoria}
                            onChange={(e) => setCatalogFormData({ ...catalogFormData, clave_categoria: e.target.value })}
                            fullWidth
                            sx={inputStyles}
                        />
                        <FormControl fullWidth sx={inputStyles}>
                            <InputLabel>Categoría Base (Legacy)</InputLabel>
                            <Select
                                value={catalogFormData.categoria || ''}
                                label="Categoría Base (Legacy)"
                                onChange={(e) => setCatalogFormData({ ...catalogFormData, categoria: e.target.value })}
                                sx={{ borderRadius: '12px' }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: '#1e293b',
                                            color: '#f8fafc',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { bgcolor: '#334155' },
                                                '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.2) !important' }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {categoriasLegacyCatalog.map((c) => (
                                    <MenuItem key={c.id_categoria} value={c.id_categoria}>
                                        {c.puesto}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Literal (Código)"
                            value={catalogFormData.literal}
                            onChange={(e) => setCatalogFormData({ ...catalogFormData, literal: e.target.value })}
                            fullWidth
                            sx={inputStyles}
                        />
                        <FormControl fullWidth sx={{ ...inputStyles, gridColumn: 'span 2' }}>
                            <InputLabel>Puesto Oficial (Catálogo)</InputLabel>
                            <Select
                                value={catalogFormData.id_puesto || ''}
                                label="Puesto Oficial (Catálogo)"
                                onChange={(e) => setCatalogFormData({ ...catalogFormData, id_puesto: e.target.value })}
                                sx={{ borderRadius: '12px' }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: '#1e293b',
                                            color: '#f8fafc',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { bgcolor: '#334155' },
                                                '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.2) !important' }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {puestosCatalog.map((p) => (
                                    <MenuItem key={p.id_categoria} value={p.id_categoria}>
                                        {p.puesto}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={inputStyles}>
                            <InputLabel>Nivel de Viático</InputLabel>
                            <Select
                                value={catalogFormData.literal_viatico || ''}
                                label="Nivel de Viático"
                                onChange={(e) => setCatalogFormData({ ...catalogFormData, literal_viatico: e.target.value })}
                            >
                                <MenuItem value=""><em>Ninguno</em></MenuItem>
                                {niveles.map((nivel) => (
                                    <MenuItem key={nivel} value={nivel}>Nivel {nivel}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
                    <Button onClick={() => setOpenCatalogModal(false)} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveCatalogEntry}
                        variant="contained"
                        disabled={actionLoading}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            borderRadius: '10px',
                            fontWeight: 800,
                            textTransform: 'none',
                            px: 3,
                            '&:hover': { bgcolor: '#7dd3fc' }
                        }}
                    >
                        {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GestionCategorias;
