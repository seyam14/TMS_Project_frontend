// src/pages/TicketForm.jsx
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  TextField,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Select,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AttachFile, Send } from '@mui/icons-material';

export default function TicketForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
  });
  const [files, setFiles] = useState([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    Array.from(files).forEach(file => formData.append('attachments', file));

    try {
      await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Ticket Submitted!',
        text: 'Thank you. We’ll get back to you soon.',
        confirmButtonColor: '#2563eb',
      });

      setForm({ title: '', description: '', priority: 'Low' });
      setFiles([]);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Try again later.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Paper
        elevation={6}
        className="w-full max-w-2xl rounded-2xl bg-white/30 backdrop-blur-md p-8 shadow-2xl"
      >
        <Typography variant="h4" className="text-center font-bold text-blue-700 mb-6">
          🎫  Ticket
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="Ticket Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={isMobile ? 3 : 5}
            fullWidth
            required
            variant="outlined"
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="Low">🟢 Low</MenuItem>
              <MenuItem value="Medium">🟠 Medium</MenuItem>
              <MenuItem value="High">🔴 High</MenuItem>
            </Select>
          </FormControl>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <AttachFile className="mr-1" fontSize="small" />
              Attach Files (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={e => setFiles(e.target.files)}
              className="w-full block text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-green-700">
                {Array.from(files).map(f => f.name).join(', ')}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<Send />}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: '#2563eb',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
          >
            Submit Ticket
          </Button>
        </form>
      </Paper>
    </div>
  );
}
