import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tarifas from './Tarifas';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse,
  CssBaseline, AppBar, Toolbar, Typography, Box, Avatar, Button, IconButton, Tooltip
} from '@mui/material';
import {
  Book, People, DirectionsCar, Description, Receipt, AccountBalanceWallet, AccountBalance,
  Assignment, Send, CheckCircle, BarChart, ExpandLess, ExpandMore, Menu as MenuIcon, ChevronLeft,
  AccessTime, AttachMoney, CalendarMonth, Layers as LayersIcon, AccountTree
} from '@mui/icons-material';
import Actividad from './Actividad';
import MemorandumComision from './MemorandumComision';
import GestionFirmas from './GestionFirmas';
import GestionCategorias from './GestionCategorias';
import CuentaPersonal from './CuentaPersonal';
import Vehiculos from './Vehiculos';
import Tramites from './Tramites';
import GestionEmpleados from './GestionEmpleados';
import AreasTree from './AreasTree';

const drawerWidth = 240;
const drawerWidthCollapsed = 72; // Width when collapsed

const menuIcons = {
  catalogos: <Book />,
  gestion_personal: <People />,
  imprimir_personal: <People />,
  captura: <Description />,
  procesos: <Assignment />,
  reportes: <BarChart />,
  tarifa: <Receipt />,
  personal: <People />,
  vehiculos: <DirectionsCar />,
  firmas: <CheckCircle />,
  categorias: <LayersIcon />,
  cuenta_personal: <AccountBalance />,
  actividad: <Assignment />,
  memo: <Description />,
  comision: <DirectionsCar />,
  tramite: <Send />,
  validar: <CheckCircle />,
  envio: <Send />,
  deposito: <AccountBalanceWallet />,
  actividades: <BarChart />,
  memorandum: <BarChart />,
  viaticos: <BarChart />,
  areas_tree: <AccountTree />
};

const Dashboard = ({ user, setUser, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState({
    catalogos: false,
    captura: false,
    procesos: false,
    reportes: false,
    personal: false,
    vehiculos: false,
    gestion_personal: false
  });
  // Initialize currentView from localStorage
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || null;
  });


  const [dateTime, setDateTime] = useState(new Date());
  const [exchangeRate, setExchangeRate] = useState(null);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Exchange Rate Effect
  useEffect(() => {
    const fetchRate = async () => {
      try {
        // Using a free rate API
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        if (response.data && response.data.rates && response.data.rates.MXN) {
          setExchangeRate(response.data.rates.MXN.toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };
    fetchRate();
  }, []);

  const menuStructure = {
    gestion_personal: {
      title: 'Personal',
      items: {
        imprimir_personal: { title: 'Imprimir Personal' },
        gestion_empleados: { title: 'Captura de Empleados' },
        categorias: { title: 'Categorías' }
      }
    },
    catalogos: {
      title: 'Catálogos',
      items: {
        tarifa: { title: 'Tarifa' },
        vehiculos: { title: 'Vehículos' },
        firmas: { title: 'Firmas' },
        areas_tree: { title: 'Estructura de Áreas' }
      }
    },
    captura: {
      title: 'Captura',
      items: {
        cuenta_personal: { title: 'Cuenta Personal' },
        actividad: { title: 'Actividad' },
        memo: { title: 'Memo' },
        tramite: { title: 'Trámite' }
      }
    },
    procesos: {
      title: 'Procesos',
      items: {
        validar: { title: 'Validar' },
        envio: { title: 'Envío' },
        deposito: { title: 'Depósito' }
      }
    },
    reportes: {
      title: 'Reportes',
      items: {
        actividades: { title: 'Actividades' },
        memorandum: { title: 'Memorándum' },
        viaticos: { title: 'Viáticos' }
      }
    }
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClick = (key) => {
    if (!sidebarOpen) setSidebarOpen(true); // Auto-open if clicking a menu while collapsed
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = (view) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  };

  const renderMenuItems = (items, parentKey) => {
    return Object.entries(items).map(([itemKey, item]) => {
      const fullKey = `${parentKey}-${itemKey}`;
      if (item.subitems) {
        return (
          <React.Fragment key={fullKey}>
            <Tooltip title={!sidebarOpen ? item.title : ''} placement="right">
              <ListItemButton
                onClick={() => handleClick(itemKey)}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    bgcolor: 'rgba(56, 189, 248, 0.08)',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#38bdf8' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
                  {menuIcons[itemKey]}
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
                {sidebarOpen ? (open[itemKey] ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
            </Tooltip>
            <Collapse in={open[itemKey] && sidebarOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.entries(item.subitems).map(([subitemKey, subitemTitle]) => (
                  <ListItemButton
                    key={`${fullKey}-${subitemKey}`}
                    sx={{
                      pl: sidebarOpen ? 4 : 2,
                      minHeight: 48,
                      justifyContent: 'center',
                      '&:hover': {
                        bgcolor: 'rgba(56, 189, 248, 0.08)',
                        '& .MuiListItemText-primary': { color: '#38bdf8' }
                      }
                    }}
                    onClick={() => handleItemClick(`${itemKey}-${subitemKey}`)}
                  >
                    <ListItemText
                      primary={subitemTitle}
                      sx={{
                        opacity: sidebarOpen ? 1 : 0.7,
                        '& .MuiTypography-root': { fontWeight: 600, fontSize: '0.85rem' }
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return (
        <Tooltip key={fullKey} title={!sidebarOpen ? item.title : ''} placement="right">
          <ListItemButton
            onClick={() => handleItemClick(itemKey)}
            sx={{
              minHeight: 48,
              justifyContent: sidebarOpen ? 'initial' : 'center',
              px: 2.5,
              bgcolor: currentView === itemKey ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              borderLeft: currentView === itemKey ? '4px solid #38bdf8' : '4px solid transparent',
              '&:hover': {
                bgcolor: 'rgba(56, 189, 248, 0.08)',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#38bdf8' }
              }
            }}
          >
            <ListItemIcon sx={{
              minWidth: 0,
              mr: sidebarOpen ? 3 : 'auto',
              justifyContent: 'center',
              color: currentView === itemKey ? '#38bdf8' : '#64748b'
            }}>
              {menuIcons[itemKey]}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                opacity: sidebarOpen ? 1 : 0,
                '& .MuiTypography-root': {
                  fontWeight: currentView === itemKey ? 800 : 600,
                  color: currentView === itemKey ? '#38bdf8' : 'inherit'
                }
              }}
            />
          </ListItemButton>
        </Tooltip>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#0f172a',
        boxShadow: 'none',
        borderBottom: '1px solid #1e293b'
      }}>
        <Toolbar sx={{ minHeight: '48px !important', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              size="small"
              sx={{
                mr: 1,
                p: 0.5,
                minWidth: 'auto',
                width: 'auto',
                flexShrink: 0
              }}
            >
              {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
              Sistema de <span style={{ color: '#38bdf8' }}>Viáticos</span>
            </Typography>
          </Box>
          <Box
            component="img"
            src="/images/patrones/logo_blanco_h(124x150).png"
            alt="Logo Blanco"
            sx={{
              height: '36px',
              width: 'auto'
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidth : drawerWidthCollapsed,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? drawerWidth : drawerWidthCollapsed,
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            borderRight: '1px solid #334155',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important' }} />

        <Box sx={{ overflow: 'auto', overflowX: 'hidden' }}>
          {sidebarOpen && (
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Avatar sx={{
                width: 64,
                height: 64,
                mb: 1,
                bgcolor: '#0f172a',
                border: '3px solid #38bdf8',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
              }}>
                {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" noWrap sx={{ width: '100%', textAlign: 'center', fontWeight: 700, px: 1 }}>{user.nombres}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleLogout}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  color: '#94a3b8',
                  borderColor: '#334155',
                  '&:hover': {
                    bgcolor: 'rgba(244, 67, 54, 0.05)',
                    borderColor: '#f44336',
                    color: '#f44336'
                  },
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          )}
          {!sidebarOpen && (
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Avatar sx={{ width: 40, height: 40, mb: 1, bgcolor: '#009688' }}>
                {user.nombres.charAt(0)}
              </Avatar>
            </Box>
          )}

          <List>
            {Object.entries(menuStructure).map(([menuKey, menu]) => (
              <React.Fragment key={menuKey}>
                <Tooltip title={!sidebarOpen ? menu.title : ''} placement="right">
                  <ListItemButton onClick={() => handleClick(menuKey)} sx={{ minHeight: 48, justifyContent: sidebarOpen ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
                      {menuIcons[menuKey]}
                    </ListItemIcon>
                    <ListItemText primary={menu.title} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
                    {sidebarOpen ? (open[menuKey] ? <ExpandLess /> : <ExpandMore />) : null}
                  </ListItemButton>
                </Tooltip>
                <Collapse in={open[menuKey] && sidebarOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {renderMenuItems(menu.items, menuKey)}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0, mt: '48px', backgroundColor: '#0f172a', minHeight: 'calc(100vh - 48px)', color: '#f8fafc', overflowY: 'auto' }}>
        {currentView === 'actividad' ? (
          <Actividad />
        ) : currentView === 'memorandum' || currentView === 'memo' ? (
          <MemorandumComision />
        ) : currentView === 'firmas' ? (
          <GestionFirmas />
        ) : currentView === 'tarifa' ? (
          <Tarifas />
        ) : currentView === 'cuenta_personal' ? (
          <CuentaPersonal handleLogout={handleLogout} />
        ) : currentView === 'vehiculos' ? (
          <Vehiculos />
        ) : currentView === 'categorias' ? (
          <GestionCategorias />
        ) : currentView === 'gestion_empleados' ? (
          <GestionEmpleados />
        ) : currentView === 'tramite' ? (
          <Tramites user={user} />
        ) : currentView === 'areas_tree' ? (
          <AreasTree />
        ) : (
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ mb: 1, textAlign: 'center', color: '#f8fafc', fontWeight: 900, letterSpacing: '-0.025em' }}>
              Bienvenido, <span style={{ color: '#38bdf8' }}>{user.nombres} {user.apellidos}</span>
            </Typography>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4, fontWeight: 500, textAlign: 'center' }}>
              Ejercicio cargado: <span style={{ color: '#f8fafc', fontWeight: 700 }}>2026</span>. Puede empezar la captura.
            </Typography>

            <Box sx={{
              display: 'flex',
              gap: 4,
              mb: 6,
              p: 2,
              borderRadius: '20px',
              bgcolor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #334155',
              backdropFilter: 'blur(8px)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <AccessTime />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    Hora Local
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, lineHeight: 1 }}>
                    {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    Dólar (USD/MXN)
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, lineHeight: 1 }}>
                    {exchangeRate ? `$${exchangeRate}` : 'Cargando...'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <CalendarMonth />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    Fecha
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, lineHeight: 1 }}>
                    {dateTime.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

};

export default Dashboard;
