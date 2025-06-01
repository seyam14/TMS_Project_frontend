import { useState } from 'react';
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
} from '@mui/material';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side with logo */}
      <div className="bg-blue-700 flex items-center justify-center p-10">
        <img
          src="https://via.placeholder.com/300x300?text=Your+Logo"
          alt="Logo"
          className="w-72 h-72 object-contain"
        />
      </div>

      {/* Right side with registration form */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <Paper elevation={3} className="w-full max-w-md p-6">
          <Typography variant="h5" className="mb-4 text-center font-semibold">
            Register
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <FormControl fullWidth>
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 underline">
                Login
              </Link>
            </Typography>
          </form>
        </Paper>
      </div>
    </div>
  );
}
