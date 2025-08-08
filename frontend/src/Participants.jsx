import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { FaUserPlus, FaUserEdit, FaTrash, FaSearch, FaBuilding, FaUsers } from 'react-icons/fa';


function Participants() {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', cin: '', entreprise: '', tel_fix: '', fax: '', tel_port: '', mail: '', theme_part: '', num_salle: '', date_debut: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nom_prenom: '', cin: '', entreprise: '', tel_fix: '', fax: '', tel_port: '', mail: '', theme_part: '', num_salle: '', date_debut: '' });
  const [filters, setFilters] = useState({ nom: '', entreprise: '', theme: '' });
  const token = localStorage.getItem('token');

  const fetchParticipants = async () => {
    try {
      const params = {};
      if (filters.nom) params.nom = filters.nom;
      if (filters.entreprise) params.entreprise = filters.entreprise;
      if (filters.theme) params.theme = filters.theme;
      const res = await api.get('/participants', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setParticipants(res.data);
    } catch (err) {
      setError('Failed to fetch participants');
    }
  };

  useEffect(() => {
    fetchParticipants();
    // eslint-disable-next-line
  }, [filters]);

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
      await api.post(`/participants?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ nom_prenom: '', cin: '', entreprise: '', theme_part: '' });
      fetchParticipants();
    } catch (err) {
      setError('Failed to create participant');
    }
  };

  const handleEdit = (participant) => {
    setEditId(participant.id);
    setEditForm({
      nom_prenom: participant.nom_prenom,
      cin: participant.cin,
      entreprise: participant.entreprise,
      theme_part: participant.theme_part
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
      await api.put(`/participants/${editId}?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      fetchParticipants();
    } catch (err) {
      setError('Failed to update participant');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/participants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchParticipants();
    } catch (err) {
      setError('Failed to delete participant');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="crud-container" style={{ overflowX: 'auto', maxWidth: '100vw' }}>
      <h2><FaUsers style={{ marginRight: 8 }} />{t('Participants.title', 'Participants')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreate}>
        <input name="nom_prenom" placeholder={t('Participants.name', 'Name')} value={form.nom_prenom} onChange={handleChange} required />
        <input name="cin" placeholder={t('Participants.cin', 'CIN')} value={form.cin} onChange={handleChange} required />
        <input name="entreprise" placeholder={t('Participants.entreprise', 'Entreprise')} value={form.entreprise} onChange={handleChange} required />
        <input name="tel_fix" placeholder={t('Participants.tel_fix', 'Landline')} value={form.tel_fix} onChange={handleChange} />
        <input name="fax" placeholder={t('Participants.fax', 'Fax')} value={form.fax} onChange={handleChange} />
        <input name="tel_port" placeholder={t('Participants.tel_port', 'Mobile')} value={form.tel_port} onChange={handleChange} />
        <input name="mail" placeholder={t('Participants.mail', 'Email')} value={form.mail} onChange={handleChange} />
        <input name="theme_part" placeholder={t('Participants.theme', 'Theme')} value={form.theme_part} onChange={handleChange} required />
        <input name="num_salle" placeholder={t('Participants.num_salle', 'Room Number')} value={form.num_salle} onChange={handleChange} />
        <input name="date_debut" type="date" placeholder={t('Participants.date_debut', 'Start Date')} value={form.date_debut} onChange={handleChange} />
        <button type="submit"><FaUserPlus style={{ marginRight: 6 }} />{t('Participants.add', 'Add Participant')}</button>
      </form>
      <form style={{ marginBottom: '1em', display: 'flex', flexWrap: 'wrap', gap: '0.7em', alignItems: 'center' }}>
        <input name="nom" placeholder={t('Participants.search_name', 'Search by name')} value={filters.nom} onChange={handleFilterChange} />
        <input name="entreprise" placeholder={t('Participants.filter_entreprise', 'Filter by entreprise')} value={filters.entreprise} onChange={handleFilterChange} />
        <input name="theme" placeholder={t('Participants.filter_theme', 'Filter by theme')} value={filters.theme} onChange={handleFilterChange} />
        <button type="button" onClick={fetchParticipants}><FaSearch style={{ marginRight: 6 }} />{t('Participants.search_filter', 'Search/Filter')}</button>
      </form>
      <table style={{ minWidth: '900px', width: '100%' }}>
        <thead>
          <tr>
            <th>{t('Participants.id')}</th>
            <th>{t('Participants.nom_prenom')}</th>
            <th>{t('Participants.cin')}</th>
            <th>{t('Participants.entreprise')}</th>
            <th>{t('Participants.tel_fix')}</th>
            <th>{t('Participants.fax')}</th>
            <th>{t('Participants.tel_port')}</th>
            <th>{t('Participants.mail')}</th>
            <th>{t('Participants.theme_part')}</th>
            <th>{t('Participants.num_salle')}</th>
            <th>{t('Participants.date_debut')}</th>
            <th>{t('Participants.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {editId === p.id ? (
                  <input name="nom_prenom" value={editForm.nom_prenom} onChange={handleEditChange} />
                ) : p.nom_prenom}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="cin" value={editForm.cin} onChange={handleEditChange} />
                ) : p.cin}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="entreprise" value={editForm.entreprise} onChange={handleEditChange} />
                ) : p.entreprise}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="tel_fix" value={editForm.tel_fix} onChange={handleEditChange} />
                ) : p.tel_fix}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="fax" value={editForm.fax} onChange={handleEditChange} />
                ) : p.fax}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="tel_port" value={editForm.tel_port} onChange={handleEditChange} />
                ) : p.tel_port}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="mail" value={editForm.mail} onChange={handleEditChange} />
                ) : p.mail}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="theme_part" value={editForm.theme_part} onChange={handleEditChange} />
                ) : p.theme_part}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="num_salle" value={editForm.num_salle} onChange={handleEditChange} />
                ) : p.num_salle}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="date_debut" type="date" value={editForm.date_debut} onChange={handleEditChange} />
                ) : p.date_debut}
              </td>
              <td>
                {editId === p.id ? (
                  <>
                    <button onClick={handleUpdate}><FaUserEdit style={{ marginRight: 4 }} />{t('Participants.save', 'Save')}</button>
                    <button onClick={() => setEditId(null)}>{t('Participants.cancel', 'Cancel')}</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(p)}><FaUserEdit style={{ marginRight: 4 }} />{t('Participants.edit', 'Edit')}</button>
                    <button onClick={() => handleDelete(p.id)}><FaTrash style={{ marginRight: 4 }} />{t('Participants.delete', 'Delete')}</button>
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

export default Participants;