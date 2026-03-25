import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
    Box, Typography, CircularProgress, IconButton, TextField,
    InputAdornment, Collapse, Chip, Button
} from '@mui/material';
import {
    AccountTree,
    ExpandMore,
    ChevronRight,
    Search,
    Business,
    CorporateFare,
    MeetingRoom,
    Refresh
} from '@mui/icons-material';

const AreaNode = ({ node, level = 0, defaultOpen = false, searchTerm = '' }) => {
    const [open, setOpen] = useState(defaultOpen || level < 1);
    const hasChildren = node.children && node.children.length > 0;

    // Expandir automáticamente si hay un término de búsqueda y hay hijos que mostrar
    useEffect(() => {
        if (searchTerm && hasChildren) {
            setOpen(true);
        }
    }, [searchTerm, hasChildren]);

    const getIcon = () => {
        if (node.type === 'admin') return <Business sx={{ color: '#38bdf8', fontSize: 20 }} />;
        if (node.type === 'ur') return <CorporateFare sx={{ color: '#818cf8', fontSize: 20 }} />;
        if (node.type === 'uro') return <AccountTree sx={{ color: '#34d399', fontSize: 20 }} />;
        if (node.type === 'area') return <MeetingRoom sx={{ color: '#fb7185', fontSize: 20 }} />;
        return <AccountTree sx={{ color: '#94a3b8', fontSize: 20 }} />;
    };

    return (
        <Box sx={{ ml: level === 0 ? 0 : 3 }}>
            <Box
                onClick={() => hasChildren && setOpen(!open)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.2,
                    px: 2,
                    mb: 1,
                    cursor: hasChildren ? 'pointer' : 'default',
                    borderRadius: '12px',
                    bgcolor: node.isSearchMatch ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                    border: node.isSearchMatch ? '1px solid #38bdf8' : '1px solid rgba(51, 65, 85, 0.5)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'rgba(56, 189, 248, 0.05)',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        transform: 'translateX(4px)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: 24, mr: 1 }}>
                    {hasChildren && (
                        <IconButton size="small" sx={{ p: 0, color: '#38bdf8' }}>
                            {open ? <ExpandMore /> : <ChevronRight />}
                        </IconButton>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    {getIcon()}
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.2 }}>
                            {node.label}
                        </Typography>
                        {node.oficio && (
                            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600, display: 'block' }}>
                                Oficio: {node.oficio}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {node.code && (
                    <Chip
                        label={node.code}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(56, 189, 248, 0.1)',
                            color: '#38bdf8',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                            height: 20
                        }}
                    />
                )}
            </Box>

            {hasChildren && (
                <Collapse in={open}>
                    {node.children.map((child, idx) => (
                        <AreaNode key={child.id || idx} node={child} level={level + 1} defaultOpen={defaultOpen} searchTerm={searchTerm} />
                    ))}
                </Collapse>
            )}
        </Box>
    );
};

const AreasTree = () => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/areas/tree`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTreeData(response.data.tree);
            }
        } catch (error) {
            console.error('Error fetching areas tree:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filterTree = (nodes, term) => {
        if (!term) return nodes;
        return nodes.reduce((acc, node) => {
            const labelStr = String(node.label || '').toLowerCase();
            const oficioStr = String(node.oficio || '').toLowerCase();
            const codeStr = String(node.code || '').toLowerCase();
            const termLower = term.toLowerCase();

            const matchesSearch = labelStr.includes(termLower) ||
                oficioStr.includes(termLower) ||
                codeStr.includes(termLower);

            let filteredChildren = [];
            if (node.children && node.children.length > 0) {
                filteredChildren = filterTree(node.children, term);
            }

            if (matchesSearch || filteredChildren.length > 0) {
                acc.push({
                    ...node,
                    children: filteredChildren,
                    isSearchMatch: matchesSearch
                });
            }
            return acc;
        }, []);
    };

    const displayData = searchTerm ? filterTree(treeData, searchTerm) : treeData;

    return (
        <Box sx={{ p: 4, bgcolor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountTree sx={{ fontSize: 40, color: '#38bdf8' }} />
                        Estructura Organizacional
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                        Visualización jerárquica de Áreas, Oficios y Estructuras Administrativas
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchData}
                    sx={{
                        color: '#38bdf8',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': {
                            borderColor: '#38bdf8',
                            bgcolor: 'rgba(56, 189, 248, 0.05)'
                        }
                    }}
                >
                    Actualizar Datos
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nombre de área, clave de oficio o estructura..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#38bdf8' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#1e293b',
                            borderRadius: '16px',
                            color: '#f8fafc',
                            '& fieldset': { borderColor: '#334155', borderWidth: 2 },
                            '&:hover fieldset': { borderColor: '#38bdf8' },
                            '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                            '&.Mui-focused': { bgcolor: '#1e293b' },
                            '& .MuiOutlinedInput-input': {
                                p: 2,
                                bgcolor: 'transparent !important',
                                '&:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #1e293b inset !important',
                                    WebkitTextFillColor: '#f8fafc !important',
                                }
                            }
                        }
                    }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 20, flexDirection: 'column', gap: 3 }}>
                    <CircularProgress sx={{ color: '#38bdf8' }} thickness={5} size={60} />
                    <Typography sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>
                        CONSTRUYENDO ÁRBOL ORGANIZACIONAL...
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    bgcolor: 'rgba(30, 41, 59, 0.3)',
                    p: 3,
                    borderRadius: '24px',
                    border: '1px solid #1e293b',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#334155', borderRadius: '4px' }
                }}>
                    {displayData.length > 0 ? (
                        displayData.map((node, idx) => (
                            <AreaNode key={node.id || idx} node={node} defaultOpen={!!searchTerm} searchTerm={searchTerm} />
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Search sx={{ fontSize: 60, color: '#334155', mb: 2 }} />
                            <Typography sx={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>
                                No se encontraron resultados para "{searchTerm}"
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default AreasTree;
