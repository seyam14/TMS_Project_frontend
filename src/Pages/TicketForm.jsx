// src/pages/TicketForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function TicketForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
  });
  const [files, setFiles] = useState([]);

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
      alert('Ticket submitted!');
      setForm({ title: '', description: '', priority: 'Low' });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert('Error submitting ticket');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          placeholder="Title"
          className="input w-full mb-3"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          className="input w-full mb-3"
          rows="4"
          onChange={handleChange}
          required
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="input w-full mb-3"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="file"
          multiple
          onChange={e => setFiles(e.target.files)}
          className="mb-3"
        />
        <button type="submit" className="btn-primary w-full">Submit</button>
      </form>
    </div>
  );
}
