/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, TableSortLabel,
  Typography, Grid
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
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Ticket Maker',
    ticketMakerId: ''
  });
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (form.role === 'Ticket Maker' && !form.ticketMakerId) {
      Swal.fire('Error', 'Ticket Maker ID is required for Ticket Makers', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Success', 'User created successfully!', 'success');
      fetchUsers();
      setOpen(false);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'Ticket Maker',
        ticketMakerId: ''
      });
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch {
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
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
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" mb={{ xs: 2, sm: 0 }}>Admin Panel</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create User</Button>
      </Box>

      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        sx={{ mb: 2 }}
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
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Ticket Maker ID</TableCell>
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
                <TableCell>{user.role === 'Ticket Maker' ? user.ticketMakerId : '-'}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                {['Ticket Maker', 'Checker', 'DFS Team', 'IT Team', 'Admin'].map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </Grid>
            {form.role === 'Ticket Maker' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ticket Maker ID"
                  value={form.ticketMakerId}
                  onChange={e => setForm({ ...form, ticketMakerId: e.target.value })}
                />
              </Grid>
            )}
          </Grid>
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
