import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Container,
  CssBaseline
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        usuario: formData.usuario.trim(),
        password: formData.password.trim()
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al iniciar sesión. Por favor intente de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#0f172a',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#334155', borderWidth: 1.5 },
      '&:hover fieldset': { borderColor: '#38bdf8' },
      '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
      '&.Mui-focused': { bgcolor: '#0f172a' },
      '& input': {
        color: '#f8fafc',
        fontWeight: 500,
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px #0f172a inset !important',
          WebkitTextFillColor: '#f8fafc !important',
        },
        '&:focus': {
          bgcolor: 'transparent !important'
        }
      }
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#0f172a',
      backgroundImage: 'radial-gradient(circle at 2% 10%, rgba(56, 189, 248, 0.1) 0%, transparent 40%), radial-gradient(circle at 98% 90%, rgba(56, 189, 248, 0.05) 0%, transparent 40%)',
      p: 2
    }}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ p: 0 }}>
        <Paper elevation={0} sx={{
          p: 4,
          borderRadius: '28px',
          bgcolor: '#1e293b',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Top Bar */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)'
          }} />

          {/* Branding */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Avatar sx={{
              width: 56,
              height: 56,
              bgcolor: '#38bdf8',
              mb: 1.5,
              mx: 'auto',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
            }}>
              <LockIcon sx={{ fontSize: 28, color: '#0f172a' }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.025em' }}>
              Bienvenido
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, fontWeight: 500 }}>
              Sistema de <span style={{ color: '#38bdf8', fontWeight: 700 }}>Viáticos</span>
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                width: '100%',
                mb: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                '& .MuiAlert-icon': { color: '#f87171' }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Usuario"
              name="usuario"
              autoComplete="username"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
              disabled={loading}
              sx={inputStyles}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#64748b' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={!loading && <LoginIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.8,
                borderRadius: '14px',
                bgcolor: '#38bdf8',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.4)',
                '&:hover': {
                  bgcolor: '#7dd3fc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 20px 25px -5px rgba(56, 189, 248, 0.4)'
                },
                '&:active': { transform: 'translateY(0)' },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#0f172a' }} /> : 'Iniciar Sesión'}
            </Button>

            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', mt: 2, fontWeight: 500 }}>
              Oficialía Mayor • <span style={{ color: '#334155' }}>Subsecretaría de Administración</span>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;