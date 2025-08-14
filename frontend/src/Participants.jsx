import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Modal from './Modal';
import { FaUserPlus, FaUserEdit, FaTrash, FaSearch, FaBuilding, FaUsers } from 'react-icons/fa';


function Participants() {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', cin: '', entreprise: '', tel_fix: '', fax: '', tel_port: '', mail: '', theme_part: '', num_salle: '', date_debut: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
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
      setForm({ nom_prenom: '', cin: '', entreprise: '', tel_fix: '', fax: '', tel_port: '', mail: '', theme_part: '', num_salle: '', date_debut: '' });
      fetchParticipants();
    } catch (err) {
      setError('Failed to create participant');
    }
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setEditForm({
      nom_prenom: participant.nom_prenom,
      cin: participant.cin,
      entreprise: participant.entreprise,
      tel_fix: participant.tel_fix,
      fax: participant.fax,
      tel_port: participant.tel_port,
      mail: participant.mail,
      theme_part: participant.theme_part,
      num_salle: participant.num_salle,
      date_debut: participant.date_debut
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
      await api.put(`/participants/${editingParticipant.id}?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditModalOpen(false);
      setEditingParticipant(null);
      fetchParticipants();
    } catch (err) {
      setError('Failed to update participant');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Participants.confirm_delete', 'Are you sure you want to delete this participant?'))) {
      try {
        await api.delete(`/participants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchParticipants();
      } catch (err) {
        setError('Failed to delete participant');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingParticipant(null);
  };

  return (
    <div className="crud-container">
      <h2><FaUsers style={{ marginRight: 8 }} />{t('Participants.title', 'Participants')}</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Create Form */}
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

      {/* Filter Form */}
      <form style={{ marginBottom: '1em', display: 'flex', flexWrap:'nowrap', gap: '0.7em', alignItems: 'stretch' }}>
        <input name="nom" placeholder={t('Participants.search_name', 'Search by name')} value={filters.nom} onChange={handleFilterChange} />
        <input name="entreprise" placeholder={t('Participants.filter_entreprise', 'Filter by entreprise')} value={filters.entreprise} onChange={handleFilterChange} />
        <input name="theme" placeholder={t('Participants.filter_theme', 'Filter by theme')} value={filters.theme} onChange={handleFilterChange} />
        <button type="button" onClick={fetchParticipants}><FaSearch style={{ marginRight: 6 }} />{t('Participants.search_filter', 'Search/Filter')}</button>
      </form>

      {/* Desktop Table View */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
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
                <td>{p.nom_prenom}</td>
                <td>{p.cin}</td>
                <td>{p.entreprise}</td>
                <td>{p.tel_fix}</td>
                <td>{p.fax}</td>
                <td>{p.tel_port}</td>
                <td>{p.mail}</td>
                <td>{p.theme_part}</td>
                <td>{p.num_salle}</td>
                <td>{p.date_debut}</td>
                <td>
                  <button onClick={() => handleEdit(p)}><FaUserEdit style={{ marginRight: 4 }} />{t('Participants.edit', 'Edit')}</button>
                  <button onClick={() => handleDelete(p.id)}><FaTrash style={{ marginRight: 4 }} />{t('Participants.delete', 'Delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {participants.map((p) => (
          <div key={p.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">{p.nom_prenom}</div>
              <div className="mobile-card-actions">
                <button onClick={() => handleEdit(p)}><FaUserEdit /></button>
                <button onClick={() => handleDelete(p.id)}><FaTrash /></button>
              </div>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.cin')}:</span>
                <span className="mobile-card-value">{p.cin}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.entreprise')}:</span>
                <span className="mobile-card-value">{p.entreprise}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.tel_fix')}:</span>
                <span className="mobile-card-value">{p.tel_fix}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.tel_port')}:</span>
                <span className="mobile-card-value">{p.tel_port}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.mail')}:</span>
                <span className="mobile-card-value">{p.mail}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.theme_part')}:</span>
                <span className="mobile-card-value">{p.theme_part}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.num_salle')}:</span>
                <span className="mobile-card-value">{p.num_salle}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Participants.date_debut')}:</span>
                <span className="mobile-card-value">{p.date_debut}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={closeEditModal}
        title={t('Participants.edit_participant', 'Edit Participant')}
      >
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.name', 'Name')}</label>
            <input 
              className="modal-form-input"
              name="nom_prenom" 
              value={editForm.nom_prenom} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.cin', 'CIN')}</label>
            <input 
              className="modal-form-input"
              name="cin" 
              value={editForm.cin} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.entreprise', 'Entreprise')}</label>
            <input 
              className="modal-form-input"
              name="entreprise" 
              value={editForm.entreprise} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.tel_fix', 'Landline')}</label>
            <input 
              className="modal-form-input"
              name="tel_fix" 
              value={editForm.tel_fix} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.fax', 'Fax')}</label>
            <input 
              className="modal-form-input"
              name="fax" 
              value={editForm.fax} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.tel_port', 'Mobile')}</label>
            <input 
              className="modal-form-input"
              name="tel_port" 
              value={editForm.tel_port} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.mail', 'Email')}</label>
            <input 
              className="modal-form-input"
              name="mail" 
              type="email"
              value={editForm.mail} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.theme', 'Theme')}</label>
            <input 
              className="modal-form-input"
              name="theme_part" 
              value={editForm.theme_part} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.num_salle', 'Room Number')}</label>
            <input 
              className="modal-form-input"
              name="num_salle" 
              value={editForm.num_salle} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Participants.date_debut', 'Start Date')}</label>
            <input 
              className="modal-form-input"
              name="date_debut" 
              type="date"
              value={editForm.date_debut} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeEditModal} className="btn-secondary">
              {t('Participants.cancel', 'Cancel')}
            </button>
            <button type="submit">
              <FaUserEdit style={{ marginRight: 6 }} />
              {t('Participants.save', 'Save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Participants;