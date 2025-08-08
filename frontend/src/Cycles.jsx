import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { FaLayerGroup, FaCalendarAlt, FaEdit, FaTrash, FaSearch, FaDoorOpen, FaPlus } from 'react-icons/fa';


function Cycles() {
  const { t } = useTranslation();
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ num_act: '', theme: '', date_deb: '', date_fin: '', num_salle: '', for1: '', for2: '', for3: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ num_act: '', theme: '', date_deb: '', date_fin: '', num_salle: '', for1: '', for2: '', for3: '' });
  const [filters, setFilters] = useState({ theme: '', active: '' });
  const token = localStorage.getItem('token');

  const fetchCycles = async () => {
    try {
      const params = {};
      if (filters.theme) params.theme = filters.theme;
      if (filters.active) params.active_only = filters.active === 'true';
      const res = await api.get('/cycles', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setCycles(res.data);
    } catch (err) {
      setError('Failed to fetch cycles');
    }
  };

  useEffect(() => {
    fetchCycles();
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
      await api.post(`/cycles?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ theme: '', date_deb: '', date_fin: '', num_salle: '' });
      fetchCycles();
    } catch (err) {
      setError('Failed to create cycle');
    }
  };

  const handleEdit = (cycle) => {
    setEditId(cycle.id);
    setEditForm({
      num_act: cycle.num_act,
      theme: cycle.theme,
      date_deb: cycle.date_deb,
      date_fin: cycle.date_fin,
      num_salle: cycle.num_salle,
      for1: cycle.for1,
      for2: cycle.for2,
      for3: cycle.for3
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
      await api.put(`/cycles/${editId}?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      fetchCycles();
    } catch (err) {
      setError('Failed to update cycle');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cycles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCycles();
    } catch (err) {
      setError('Failed to delete cycle');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="crud-container">
      <h2><FaLayerGroup style={{ marginRight: 8 }} />{t('Cycles.title', 'Cycles')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreate}>
        <input name="num_act" placeholder={t('Cycles.num_act', 'Operation Number')} value={form.num_act} onChange={handleChange} required />
        <input name="theme" placeholder={t('Cycles.theme', 'Theme')} value={form.theme} onChange={handleChange} required />
        <input name="date_deb" type="date" placeholder={t('Cycles.start_date', 'Start Date')} value={form.date_deb} onChange={handleChange} required />
        <input name="date_fin" type="date" placeholder={t('Cycles.end_date', 'End Date')} value={form.date_fin} onChange={handleChange} required />
        <input name="num_salle" placeholder={t('Cycles.room', 'Room')} value={form.num_salle} onChange={handleChange} required />
        <input name="for1" placeholder={t('Cycles.for1', 'Trainer 1')} value={form.for1} onChange={handleChange} />
        <input name="for2" placeholder={t('Cycles.for2', 'Trainer 2')} value={form.for2} onChange={handleChange} />
        <input name="for3" placeholder={t('Cycles.for3', 'Trainer 3')} value={form.for3} onChange={handleChange} />
        <button type="submit"><FaPlus style={{ marginRight: 6 }} />{t('Cycles.add', 'Add Cycle')}</button>
      </form>
      <form style={{ marginBottom: '1em', display: 'flex', flexWrap: 'wrap', gap: '0.7em', alignItems: 'center' }}>
        <input name="theme" placeholder={t('Cycles.filter_theme', 'Filter by theme')} value={filters.theme} onChange={handleFilterChange} />
        <select name="active" value={filters.active} onChange={handleFilterChange}>
          <option value="">{t('Cycles.all', 'All')}</option>
          <option value="true">{t('Cycles.active_only', 'Active Only')}</option>
        </select>
        <button type="button" onClick={fetchCycles}><FaSearch style={{ marginRight: 6 }} />{t('Cycles.search_filter', 'Search/Filter')}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>{t('Cycles.id')}</th>
            <th>{t('Cycles.num_act')}</th>
            <th>{t('Cycles.theme')}</th>
            <th><FaCalendarAlt style={{ marginRight: 6 }} />{t('Cycles.date_deb')}</th>
            <th><FaCalendarAlt style={{ marginRight: 6 }} />{t('Cycles.date_fin')}</th>
            <th><FaDoorOpen style={{ marginRight: 6 }} />{t('Cycles.num_salle')}</th>
            <th>{t('Cycles.for1')}</th>
            <th>{t('Cycles.for2')}</th>
            <th>{t('Cycles.for3')}</th>
            <th>{t('Cycles.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editId === c.id ? (
                  <input name="num_act" value={editForm.num_act} onChange={handleEditChange} />
                ) : c.num_act}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="theme" value={editForm.theme} onChange={handleEditChange} />
                ) : c.theme}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="date_deb" type="date" value={editForm.date_deb} onChange={handleEditChange} />
                ) : c.date_deb}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="date_fin" type="date" value={editForm.date_fin} onChange={handleEditChange} />
                ) : c.date_fin}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="num_salle" value={editForm.num_salle} onChange={handleEditChange} />
                ) : c.num_salle}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="for1" value={editForm.for1} onChange={handleEditChange} />
                ) : c.for1}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="for2" value={editForm.for2} onChange={handleEditChange} />
                ) : c.for2}
              </td>
              <td>
                {editId === c.id ? (
                  <input name="for3" value={editForm.for3} onChange={handleEditChange} />
                ) : c.for3}
              </td>
              <td>
                {editId === c.id ? (
                  <>
                    <button onClick={handleUpdate}><FaEdit style={{ marginRight: 4 }} />{t('Cycles.save', 'Save')}</button>
                    <button onClick={() => setEditId(null)}>{t('Cycles.cancel', 'Cancel')}</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(c)}><FaEdit style={{ marginRight: 4 }} />{t('Cycles.edit', 'Edit')}</button>
                    <button onClick={() => handleDelete(c.id)}><FaTrash style={{ marginRight: 4 }} />{t('Cycles.delete', 'Delete')}</button>
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

export default Cycles;
