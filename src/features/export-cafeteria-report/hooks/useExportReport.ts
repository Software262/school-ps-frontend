import { useState } from 'react';
import { exportCafeteriaReport } from '../api/export-report';

export const useExportReport = () => {
  const [loading, setLoading] = useState(false);

  const download = async (): Promise<void> => {
    setLoading(true);
    try {
      const blob = await exportCafeteriaReport(1);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `reporte_cafeteria_${new Date().toISOString().split('T')[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setLoading(false);
    }
  };

  return { download, loading };
};
