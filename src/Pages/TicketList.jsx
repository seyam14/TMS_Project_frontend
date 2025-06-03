/* eslint-disable no-unused-vars */
// src/pages/TicketList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import ExportCSVButton from '../components/ExportCSVButton';
import TicketTimeline from '../components/TicketTimeline';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  Divider,
} from '@mui/material';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered =
        user.role === 'Ticket Maker'
          ? res.data.filter((t) => t.createdBy === user.id)
          : res.data;

      setTickets(filtered);
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
      inputPlaceholder: 'Enter rejection reason...',
      showCancelButton: true,
    });

    if (remarks) {
      updateTicket(ticket._id, { status: 'Rejected', remarks });
    }
  };

  const renderActions = (ticket) => {
    if (user.role === 'Checker' && ticket.status === 'Pending') {
      const isIT = ticket.description.toLowerCase().includes('system');

      return (
        <Box className="flex gap-2 mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              updateTicket(ticket._id, {
                status: isIT ? 'Forwarded to IT' : 'Forwarded to DFS',
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
      ticket.assignedTo === user.id &&
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
                comments: 'Issue resolved successfully.',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Assigned':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Typography
        variant="h4"
        className="mb-6 text-center font-bold text-xl md:text-2xl text-gray-800"
      >
        {user.role === 'Ticket Maker' ? 'My Tickets' : 'All Tickets'}
      </Typography>

      {user.role !== 'Ticket Maker' && <ExportCSVButton data={tickets} />}

      <Grid container spacing={4}>
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} key={ticket._id}>
            <Card
              className="transition duration-300 shadow hover:shadow-lg rounded-xl border"
              sx={{ minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom className="text-blue-800 font-semibold">
                  {ticket.title}
                </Typography>

                <Typography variant="body2" className="text-gray-700 mb-2">
                  {ticket.description}
                </Typography>

                <div className="mb-2">
                  <Chip label={`Priority: ${ticket.priority}`} className="mr-2" />
                  <Chip label={`Status: ${ticket.status}`} color={getStatusColor(ticket.status)} />
                </div>

                <Typography variant="caption" className="block text-gray-600 mb-1">
                  Assigned to: {ticket.assignedTo || 'N/A'}
                </Typography>

                {ticket.remarks && (
                  <Typography variant="caption" className="block text-red-600 mb-1">
                    Remarks: {ticket.remarks}
                  </Typography>
                )}
                {ticket.comments && (
                  <Typography variant="caption" className="block text-green-700 mb-1">
                    Comments: {ticket.comments}
                  </Typography>
                )}

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

                <Divider className="my-3" />
                <TicketTimeline ticket={ticket} />
              </CardContent>

              <Box className="p-4">{renderActions(ticket)}</Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
