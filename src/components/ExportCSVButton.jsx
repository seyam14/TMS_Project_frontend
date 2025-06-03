// src/components/ExportCSVButton.jsx
import { Button } from '@mui/material';
import { Download as DownloadIcon } from 'lucide-react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export default function ExportCSVButton({ data }) {
  const handleExport = () => {
    if (!data || data.length === 0) return alert('No data to export.');
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'tickets.csv');
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<DownloadIcon size={18} />}
      onClick={handleExport}
      className="mb-4"
    >
      Export CSV
    </Button>
  );
}
