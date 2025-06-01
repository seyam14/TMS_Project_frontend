import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Box,
} from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  // Prevent scroll on mount and clean up on unmount
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable scroll on unmount
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You can now login with your credentials.',
        confirmButtonColor: '#3085d6',
      }).then(() => navigate('/login'));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || 'Something went wrong!',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh', // force full viewport height
        overflow: 'hidden', // no scrollbars
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 450,
          width: '100%',
          bgcolor: 'rgba(255,255,255,0.9)',
          p: 4,
          borderRadius: 3,
          boxShadow:
            '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // glass effect
          backdropFilter: 'blur(8.5px)',
          WebkitBackdropFilter: 'blur(8.5px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflowY: 'auto', // allow scroll inside form if needed
          maxHeight: '90vh', // prevent form from overflowing viewport
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="700"
          color="primary.main"
          mb={3}
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Ticket Maker">Ticket Maker</MenuItem>
              <MenuItem value="Checker">Checker</MenuItem>
              <MenuItem value="DFS Team">DFS Team</MenuItem>
              <MenuItem value="IT Team">IT Team</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            Register
          </Button>
          <Typography variant="body2" align="center" mt={2}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 underline">
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
