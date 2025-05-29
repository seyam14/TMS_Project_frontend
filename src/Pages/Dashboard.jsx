// src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

      {user.role === 'Ticket Maker' && (
        <div className="space-y-2">
          <p className="text-gray-700">You can create and view your tickets.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/submit')}
          >
            Submit New Ticket
          </button>
        </div>
      )}

      {user.role === 'Checker' && (
        <p className="text-gray-700">You can validate and assign tickets.</p>
      )}

      {user.role === 'DFS Team' || user.role === 'IT Team' ? (
        <p className="text-gray-700">You can resolve tickets assigned to your team.</p>
      ) : null}

      {user.role === 'Admin' && (
        <div className="space-y-2">
          <p className="text-gray-700">You can manage users and view reports.</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/admin')}
          >
            Go to Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}
