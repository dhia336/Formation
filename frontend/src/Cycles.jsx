import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { FaLayerGroup, FaCalendarAlt, FaEdit, FaTrash, FaSearch, FaDoorOpen, FaPlus } from 'react-icons/fa';

function Cycles() {
  const { t } = useTranslation();
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ num_act: '', theme: '', date_deb: '', date_fin: '', num_salle: '', for1: '', for2: '', for3: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);
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
      setForm({ num_act: '', theme: '', date_deb: '', date_fin: '', num_salle: '', for1: '', for2: '', for3: '' });
      fetchCycles();
    } catch (err) {
      setError('Failed to create cycle');
    }
  };

  const handleEdit = (cycle) => {
    setEditingCycle(cycle);
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
    setEditModalOpen(true);
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
      await api.put(`/cycles/${editingCycle.id}?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditModalOpen(false);
      setEditingCycle(null);
      fetchCycles();
    } catch (err) {
      setError('Failed to update cycle');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Cycles.confirm_delete', 'Are you sure you want to delete this cycle?'))) {
      try {
        await api.delete(`/cycles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCycles();
      } catch (err) {
        setError('Failed to delete cycle');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingCycle(null);
  };

  return (
    <div className="crud-container">
      <h2><FaLayerGroup style={{ marginRight: 8 }} />{t('Cycles.title')}</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Create Form */}
      <form onSubmit={handleCreate}>
        <input name="num_act" placeholder={t('Cycles.num_act')} value={form.num_act} onChange={handleChange} required />
        <input name="theme" placeholder={t('Cycles.theme')} value={form.theme} onChange={handleChange} required />
        <input name="date_deb" type="date" placeholder={t('Cycles.date_deb')} value={form.date_deb} onChange={handleChange} required />
        <input name="date_fin" type="date" placeholder={t('Cycles.date_fin')} value={form.date_fin} onChange={handleChange} required />
        <input name="num_salle" placeholder={t('Cycles.num_salle')} value={form.num_salle} onChange={handleChange} required />
        <input name="for1" placeholder={t('Cycles.for1')} value={form.for1} onChange={handleChange} />
        <input name="for2" placeholder={t('Cycles.for2')} value={form.for2} onChange={handleChange} />
        <input name="for3" placeholder={t('Cycles.for3')} value={form.for3} onChange={handleChange} />
        <button type="submit"><FaPlus style={{ marginRight: 6 }} />{t('Cycles.add')}</button>
      </form>

      {/* Filter Form */}
      <form style={{ marginBottom: '1em', display: 'flex', flexWrap:'nowrap', gap: '0.7em', alignItems: 'stretch' }}>
        <input name="theme" placeholder={t('Cycles.filter_theme')} value={filters.theme} onChange={handleFilterChange} />
        <select name="active" value={filters.active} onChange={handleFilterChange}>
          <option value="">{t('Cycles.all')}</option>
          <option value="true">{t('Cycles.active_only')}</option>
          <option value="false">{t('Cycles.inactive_only')}</option>
        </select>
        <button type="button" onClick={fetchCycles}><FaSearch style={{ marginRight: 6 }} />{t('Cycles.search_filter')}</button>
      </form>

      {/* Desktop Table View */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('Cycles.id')}</th>
              <th>{t('Cycles.num_act')}</th>
              <th>{t('Cycles.theme')}</th>
              <th>{t('Cycles.date_deb')}</th>
              <th>{t('Cycles.date_fin')}</th>
              <th>{t('Cycles.num_salle')}</th>
              <th>{t('Cycles.for1')}</th>
              <th>{t('Cycles.for2')}</th>
              <th>{t('Cycles.for3')}</th>
              <th>{t('Cycles.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.num_act}</td>
                <td>{c.theme}</td>
                <td>{c.date_deb}</td>
                <td>{c.date_fin}</td>
                <td>{c.num_salle}</td>
                <td>{c.for1}</td>
                <td>{c.for2}</td>
                <td>{c.for3}</td>
                <td>
                  <button onClick={() => handleEdit(c)}><FaEdit style={{ marginRight: 4 }} />{t('Cycles.edit')}</button>
                  <button onClick={() => handleDelete(c.id)}><FaTrash style={{ marginRight: 4 }} />{t('Cycles.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {cycles.map((c) => (
          <div key={c.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">{c.theme}</div>
              <div className="mobile-card-actions">
                <button onClick={() => handleEdit(c)}><FaEdit /></button>
                <button onClick={() => handleDelete(c.id)}><FaTrash /></button>
              </div>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.num_act')}:</span>
                <span className="mobile-card-value">{c.num_act}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.date_deb')}:</span>
                <span className="mobile-card-value">{c.date_deb}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.date_fin')}:</span>
                <span className="mobile-card-value">{c.date_fin}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.num_salle')}:</span>
                <span className="mobile-card-value">{c.num_salle}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.for1')}:</span>
                <span className="mobile-card-value">{c.for1}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.for2')}:</span>
                <span className="mobile-card-value">{c.for2}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Cycles.for3')}:</span>
                <span className="mobile-card-value">{c.for3}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={closeEditModal}
        title={t('Cycles.edit_cycle', 'Edit Cycle')}
      >
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.num_act')}</label>
            <input 
              className="modal-form-input"
              name="num_act" 
              value={editForm.num_act} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.theme')}</label>
            <input 
              className="modal-form-input"
              name="theme" 
              value={editForm.theme} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.date_deb')}</label>
            <input 
              className="modal-form-input"
              name="date_deb" 
              type="date"
              value={editForm.date_deb} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.date_fin')}</label>
            <input 
              className="modal-form-input"
              name="date_fin" 
              type="date"
              value={editForm.date_fin} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.num_salle')}</label>
            <input 
              className="modal-form-input"
              name="num_salle" 
              value={editForm.num_salle} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.for1')}</label>
            <input 
              className="modal-form-input"
              name="for1" 
              value={editForm.for1} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.for2')}</label>
            <input 
              className="modal-form-input"
              name="for2" 
              value={editForm.for2} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Cycles.for3')}</label>
            <input 
              className="modal-form-input"
              name="for3" 
              value={editForm.for3} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeEditModal} className="btn-secondary">
              {t('Cycles.cancel')}
            </button>
            <button type="submit">
              <FaEdit style={{ marginRight: 6 }} />
              {t('Cycles.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Cycles;
