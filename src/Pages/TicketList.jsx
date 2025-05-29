/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/TicketList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    
    } catch (err) {
      alert('Error fetching tickets');
    }
  };

  const updateTicket = async (id, update) => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/${id}`, update, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      alert('Error updating ticket');
    }
  };

  const renderActions = (ticket) => {
    if (user.role === 'Checker' && ticket.status === 'Pending') {
      return (
        <div className="flex gap-2 mt-2">
          <button className="btn-primary" onClick={() => updateTicket(ticket._id, {
            status: 'Assigned',
            assignedTo: ticket.description.toLowerCase().includes('system') ? 'IT Team' : 'DFS Team'
          })}>
            Assign
          </button>
          <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => {
            const remarks = prompt('Remarks for rejection:');
            if (remarks) updateTicket(ticket._id, { status: 'Rejected', remarks });
          }}>
            Reject
          </button>
        </div>
      );
    }

    if ((user.role === 'DFS Team' || user.role === 'IT Team') && ticket.assignedTo === user.role && ticket.status === 'Assigned') {
      return (
        <button className="btn-primary mt-2" onClick={() => updateTicket(ticket._id, {
          status: 'Resolved',
          comments: 'Issue resolved'
        })}>
          Mark as Resolved
        </button>
      );
    }

    return null;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tickets</h2>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
            <p className="text-sm text-gray-500">Status: {ticket.status}</p>
            <p className="text-sm text-gray-500">Assigned to: {ticket.assignedTo || 'N/A'}</p>
            {renderActions(ticket)}
            {ticket.attachments?.map(file => (
              <a key={file} href={`http://localhost:5000/${file}`} className="block text-blue-600 text-sm mt-2" target="_blank" rel="noopener noreferrer">
                View Attachment
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
