import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful');
      navigate('/login');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" className="input" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="email" name="email" placeholder="Email" className="input mt-2" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" name="password" placeholder="Password" className="input mt-2" onChange={e => setForm({ ...form, password: e.target.value })} />
        <select name="role" className="input mt-2" onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option value="Ticket Maker">Ticket Maker</option>
          <option value="Checker">Checker</option>
          <option value="DFS Team">DFS Team</option>
          <option value="IT Team">IT Team</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="btn-primary w-full mt-4">Register</button>
        <p className="text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
