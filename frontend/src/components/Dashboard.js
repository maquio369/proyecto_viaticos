import React, { useState } from 'react';
import Tarifas from './Tarifas';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse,
  CssBaseline, AppBar, Toolbar, Typography, Box, Avatar, Button, IconButton, Tooltip
} from '@mui/material';
import {
  Book, People, DirectionsCar, Description, Receipt, AccountBalanceWallet, CreditCard, AccountBalance,
  Assignment, Send, CheckCircle, BarChart, ExpandLess, ExpandMore, Menu as MenuIcon, ChevronLeft
} from '@mui/icons-material';
import Actividad from './Actividad';
import MemorandumComision from './MemorandumComision';
import GestionFirmas from './GestionFirmas';
import CuentaPersonal from './CuentaPersonal';
import CapturaVehiculos from './CapturaVehiculos';

const drawerWidth = 240;
const drawerWidthCollapsed = 72; // Width when collapsed

const menuIcons = {
  catalogos: <Book />,
  captura: <Description />,
  procesos: <Assignment />,
  reportes: <BarChart />,
  tarifa: <Receipt />,
  personal: <People />,
  vehiculos: <DirectionsCar />,
  firmas: <CheckCircle />,
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
  viaticos: <BarChart />
};

const Dashboard = ({ user, setUser, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState({
    catalogos: false,
    captura: false,
    procesos: false,
    reportes: false,
    personal: false,
    vehiculos: false
  });
  // Initialize currentView from localStorage
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || null;
  });

  const menuStructure = {
    catalogos: {
      title: 'Catálogos',
      items: {
        tarifa: { title: 'Tarifa' },
        personal: {
          title: 'Personal',
          subitems: { imprimir: 'Imprimir' }
        },
        vehiculos: {
          title: 'Vehículos',
          subitems: {
            captura: 'Captura',
            imprimir: 'Imprimir'
          }
        },
        firmas: { title: 'Firmas' }
      }
    },
    captura: {
      title: 'Captura',
      items: {
        cuenta_personal: { title: 'Cuenta Personal' },
        actividad: { title: 'Actividad' },
        memo: { title: 'Memo' },
        comision: { title: 'Comisión' },
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
              <ListItemButton onClick={() => handleClick(itemKey)} sx={{ minHeight: 48, justifyContent: sidebarOpen ? 'initial' : 'center', px: 2.5 }}>
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
                    sx={{ pl: sidebarOpen ? 4 : 2, minHeight: 48, justifyContent: 'center' }}
                    onClick={() => handleItemClick(`${itemKey}-${subitemKey}`)}
                  >
                    <ListItemText primary={subitemTitle} sx={{ opacity: sidebarOpen ? 1 : 0.7 }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return (
        <Tooltip key={fullKey} title={!sidebarOpen ? item.title : ''} placement="right">
          <ListItemButton onClick={() => handleItemClick(itemKey)} sx={{ minHeight: 48, justifyContent: sidebarOpen ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
              {menuIcons[itemKey]}
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#D3D3D3' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#1e3f35',
        boxShadow: 'none',
        backgroundImage: 'url("/images/patrones/patron-corazon.png")',
        backgroundSize: '100px 48px',
        backgroundRepeat: 'repeat'
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
            <Typography variant="h6" noWrap component="div">
              Sistema de Viáticos
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
            backgroundColor: '#1e3f35',
            backgroundImage: 'url("/images/patrones/patron-corazon.png")',
            backgroundSize: '110px auto',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            color: 'white',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
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
              <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: '#009688' }}>
                {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" noWrap sx={{ width: '100%', textAlign: 'center' }}>{user.nombres}</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleLogout}
                sx={{
                  mt: 1,
                  borderRadius: 3,
                  bgcolor: '#f44336',
                  '&:hover': {
                    bgcolor: '#d32f2f'
                  },
                  textTransform: 'none'
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
      <Box component="main" sx={{ flexGrow: 1, p: 0, mt: '48px', backgroundColor: '#D3D3D3', minHeight: '100vh', color: 'black' }}>
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
        ) : currentView === 'vehiculos-captura' ? (
          <CapturaVehiculos handleLogout={handleLogout} />
        ) : (
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#009887' }}>Bienvenido al Sistema de Viáticos</Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 3,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {Object.entries(menuStructure).map(([menuKey, menu]) => (
                <Box
                  key={menuKey}
                  sx={{
                    perspective: '1000px',
                    height: '200px'
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.8s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'rotateY(180deg)'
                      }
                    }}
                  >
                    {/* Frente de la tarjeta */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        backgroundColor: '#1e3f35',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3
                      }}
                    >
                      <Box sx={{ color: 'white', fontSize: '3rem', mb: 2 }}>
                        {menuIcons[menuKey]}
                      </Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                        {menu.title}
                      </Typography>
                    </Box>

                    {/* Reverso de la tarjeta */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        backgroundColor: '#2a5a47',
                        borderRadius: 2,
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                        p: 2
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {Object.entries(menu.items).map(([itemKey, item]) => (
                          <Typography
                            key={itemKey}
                            variant="body1"
                            sx={{
                              color: 'white',
                              mb: 1.5,
                              textAlign: 'center',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '1.1rem',
                              letterSpacing: '0.5px',
                              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                              '&:hover': {
                                color: 'black'
                              }
                            }}
                            onClick={() => handleItemClick(itemKey)}
                          >
                            {item.title}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

};

export default Dashboard;
