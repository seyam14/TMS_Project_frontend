/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TableSortLabel,
  Typography
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin': return 'error';
    case 'IT Team': return 'primary';
    case 'DFS Team': return 'secondary';
    case 'Checker': return 'info';
    case 'Ticket Maker': return 'success';
    default: return 'default';
  }
};

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Ticket Maker' });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Success', 'User created successfully!', 'success');
      fetchUsers();
      setOpen(false);
    } catch {
      Swal.fire('Error', 'Failed to create user', 'error');
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (order === 'asc') return a[orderBy].localeCompare(b[orderBy]);
    return b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">Admin Panel</Typography>
      </Box>

      <Button variant="contained" onClick={() => setOpen(true)}>Create User</Button>

      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        className="my-4"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={order}
                  onClick={() => handleRequestSort('name')}
                >Name</TableSortLabel></TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={getRoleColor(user.role)} />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField fullWidth label="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <Select
            fullWidth
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            {['Ticket Maker', 'Checker', 'DFS Team', 'IT Team', 'Admin'].map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
