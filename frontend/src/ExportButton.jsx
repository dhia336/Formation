import api from './api';
import { useTranslation } from 'react-i18next';

function ExportButton() {
  const { t } = useTranslation();
  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/export', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button onClick={handleExport}>{t('Home.export','Export All Data (CSV)',)} </button>
  );
}

export default ExportButton;
