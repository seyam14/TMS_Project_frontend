/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/TicketList.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
} from '@mui/material';

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
      Swal.fire('Error', 'Unable to fetch tickets.', 'error');
    }
  };

  const updateTicket = async (id, update) => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/${id}`, update, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Success', 'Ticket updated successfully.', 'success');
      fetchTickets();
    } catch (err) {
      Swal.fire('Error', 'Failed to update ticket.', 'error');
    }
  };

  const handleReject = async (ticket) => {
    const { value: remarks } = await Swal.fire({
      title: 'Reject Ticket',
      input: 'textarea',
      inputLabel: 'Remarks',
      inputPlaceholder: 'Enter remarks for rejection...',
      showCancelButton: true,
    });

    if (remarks) {
      updateTicket(ticket._id, { status: 'Rejected', remarks });
    }
  };

  const renderActions = (ticket) => {
    if (user.role === 'Checker' && ticket.status === 'Pending') {
      return (
        <Box className="flex gap-2 mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              updateTicket(ticket._id, {
                status: 'Assigned',
                assignedTo: ticket.description.toLowerCase().includes('system')
                  ? 'IT Team'
                  : 'DFS Team',
              })
            }
          >
            Assign
          </Button>
          <Button variant="outlined" color="error" onClick={() => handleReject(ticket)}>
            Reject
          </Button>
        </Box>
      );
    }

    if (
      (user.role === 'DFS Team' || user.role === 'IT Team') &&
      ticket.assignedTo === user.role &&
      ticket.status === 'Assigned'
    ) {
      return (
        <Box className="mt-4">
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              updateTicket(ticket._id, {
                status: 'Resolved',
                comments: 'Issue resolved',
              })
            }
          >
            Mark as Resolved
          </Button>
        </Box>
      );
    }

    return null;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Typography variant="h4" className="mb-6 text-center font-bold">
        Ticket Management
      </Typography>

      <Grid container spacing={4}>
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} lg={4} key={ticket._id}>
            <Card className="shadow-md hover:shadow-lg transition duration-300">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ticket.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-2">
                  {ticket.description}
                </Typography>

                <div className="mb-2">
                  <Chip label={`Priority: ${ticket.priority}`} className="mr-2" />
                  <Chip
                    label={`Status: ${ticket.status}`}
                    color={
                      ticket.status === 'Resolved'
                        ? 'success'
                        : ticket.status === 'Rejected'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </div>

                <Typography variant="caption" className="block text-gray-500 mb-2">
                  Assigned to: {ticket.assignedTo || 'N/A'}
                </Typography>

                {ticket.attachments?.map((file) => (
                  <a
                    key={file}
                    href={`http://localhost:5000/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 text-sm mt-2 hover:underline"
                  >
                    View Attachment
                  </a>
                ))}

                {renderActions(ticket)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
