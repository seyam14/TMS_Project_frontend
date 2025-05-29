/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/AdminPanel.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Ticket Maker'
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    // Delete not defined in backend yet; this is a placeholder
    alert('Delete feature not implemented in backend. (You can add this later)');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-white shadow rounded space-y-3">
        <h3 className="text-lg font-semibold mb-2">Create User</h3>
        <input
          name="name"
          placeholder="Name"
          className="input"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          name="email"
          placeholder="Email"
          className="input"
          type="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          name="password"
          placeholder="Password"
          className="input"
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <select
          name="role"
          className="input"
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="Ticket Maker">Ticket Maker</option>
          <option value="Checker">Checker</option>
          <option value="DFS Team">DFS Team</option>
          <option value="IT Team">IT Team</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" className="btn-primary w-full">Create User</button>
      </form>

      <h3 className="text-lg font-semibold mb-2">All Users</h3>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:underline">
                  Delete (TODO)
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
