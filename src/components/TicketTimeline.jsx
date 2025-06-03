// src/components/TicketTimeline.jsx
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Typography } from '@mui/material';

export default function TicketTimeline({ ticket }) {
  const history = [];

  history.push({ label: 'Created', detail: `Title: ${ticket.title}` });
  if (ticket.status !== 'Pending') {
    if (ticket.status === 'Rejected') {
      history.push({ label: 'Rejected', detail: `Remarks: ${ticket.remarks}` });
    } else if (ticket.status === 'Assigned') {
      history.push({ label: 'Assigned', detail: `To: ${ticket.assignedTo}` });
    } else if (ticket.status === 'Resolved') {
      history.push({ label: 'Resolved', detail: ticket.comments || 'No comments' });
    }
  }

  return (
    <div className="mt-4">
      <Typography variant="subtitle2" className="mb-1 font-semibold text-gray-800">
        Ticket History
      </Typography>
      <Timeline position="right" className="ml-0">
        {history.map((h, idx) => (
          <TimelineItem key={idx}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {idx < history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2">{h.label}</Typography>
              <Typography variant="caption" color="textSecondary">{h.detail}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
