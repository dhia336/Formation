import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';


function Formateurs() {
  const { t } = useTranslation();
  const [formateurs, setFormateurs] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', cin: '', specialite: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nom_prenom: '', cin: '', specialite: '' });
  // Labels now come from i18n
  const token = localStorage.getItem('token');

  const fetchFormateurs = async () => {
    try {
      const res = await api.get('/formateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormateurs(res.data);
    } catch (err) {
      setError('Failed to fetch formateurs');
    }
  };

  useEffect(() => {
    fetchFormateurs();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/formateurs', { ...form }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ nom_prenom: '', cin: '', specialite: '' });
      fetchFormateurs();
    } catch (err) {
      setError('Failed to create formateur');
    }
  };

  const handleEdit = (formateur) => {
    setEditId(formateur.id);
    setEditForm({
      nom_prenom: formateur.nom_prenom,
      cin: formateur.cin,
      specialite: formateur.specialite
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/formateurs/${editId}`, { ...editForm }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      fetchFormateurs();
    } catch (err) {
      setError('Failed to update formateur');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/formateurs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFormateurs();
    } catch (err) {
      setError('Failed to delete formateur');
    }
  };

  // Removed filter change handler as filtering UI is removed

  return (
    <div>
      <h2>{t('Formateurs.title')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreate} style={{ marginBottom: '1em' }}>
        <input name="nom_prenom" placeholder={t('Formateurs.name')} value={form.nom_prenom} onChange={handleChange} required />
        <input name="cin" placeholder={t('Formateurs.cin')} value={form.cin} onChange={handleChange} required />
        <input name="specialite" placeholder={t('Formateurs.specialty')} value={form.specialite} onChange={handleChange} required />
        <button type="submit">{t('Formateurs.add')}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('Formateurs.name')}</th>
            <th>{t('Formateurs.cin')}</th>
            <th>{t('Formateurs.specialty')}</th>
            <th>{t('Formateurs.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {formateurs.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>
                {editId === f.id ? (
                  <input name="nom_prenom" value={editForm.nom_prenom} onChange={handleEditChange} />
                ) : f.nom_prenom}
              </td>
              <td>
                {editId === f.id ? (
                  <input name="cin" value={editForm.cin} onChange={handleEditChange} />
                ) : f.cin}
              </td>
              <td>
                {editId === f.id ? (
                  <input name="specialite" value={editForm.specialite} onChange={handleEditChange} />
                ) : f.specialite}
              </td>
              <td>
                {editId === f.id ? (
                  <>
                    <button onClick={handleUpdate}>{t('Formateurs.save')}</button>
                    <button onClick={() => setEditId(null)}>{t('Formateurs.cancel')}</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(f)}>{t('Formateurs.edit')}</button>
                    <button onClick={() => handleDelete(f.id)}>{t('Formateurs.delete')}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Formateurs;
