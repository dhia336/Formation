import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';


function Formateurs() {
  const { t } = useTranslation();
  const [formateurs, setFormateurs] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
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
      const params = new URLSearchParams();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
      await api.post(`/formateurs?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
      fetchFormateurs();
    } catch (err) {
      setError('Failed to create formateur');
    }
  };

  const handleEdit = (formateur) => {
    setEditId(formateur.id);
    setEditForm({
      nom_prenom: formateur.nom_prenom,
      specialite: formateur.specialite,
      direction: formateur.direction,
      entreprise: formateur.entreprise
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
      await api.put(`/formateurs/${editId}?${params.toString()}`, '', {
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
        <input name="specialite" placeholder={t('Formateurs.specialty')} value={form.specialite} onChange={handleChange} required />
        <input name="direction" placeholder={t('Formateurs.direction')} value={form.direction} onChange={handleChange} required />
        <input name="entreprise" placeholder={t('Formateurs.entreprise')} value={form.entreprise} onChange={handleChange} required />
        <button type="submit">{t('Formateurs.add')}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>{t('Formateurs.id')}</th>
            <th>{t('Formateurs.name')}</th>
            <th>{t('Formateurs.direction')}</th>
            <th>{t('Formateurs.entreprise')}</th>
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
                  <input name="direction" value={editForm.direction} onChange={handleEditChange} />
                ) : f.direction}
              </td>
              <td>
                {editId === f.id ? (
                  <input name="entreprise" value={editForm.entreprise} onChange={handleEditChange} />
                ) : f.entreprise}
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
