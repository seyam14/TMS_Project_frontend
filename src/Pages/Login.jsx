/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://tms-backend-q1jq.onrender.com/api/auth/login', form);
      login(res.data.user, res.data.token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: ' TMS dashboard...',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.response?.data?.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: "url('/logo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.6)',
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={12}
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 420,
          width: '90%',
          p: 5,
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
          '@media (max-width:600px)': {
            p: 4,
          },
          '@media (min-width:601px) and (max-width:960px)': {
            p: 5,
          },
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: '700', color: '#222' }}>
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 4, fontWeight: '600', height: 45 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
