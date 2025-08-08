import api from './api';

function ExportButton() {
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
    <button onClick={handleExport}>Export All Data (CSV)</button>
  );
}

export default ExportButton;
