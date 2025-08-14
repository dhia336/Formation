import React, { useEffect, useState } from 'react';
import api from './api';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { FaUserPlus, FaUserEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';

function Formateurs() {
  const { t } = useTranslation();
  const [formateurs, setFormateurs] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState(null);
  const [editForm, setEditForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
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
    setEditingFormateur(formateur);
    setEditForm({
      nom_prenom: formateur.nom_prenom,
      specialite: formateur.specialite,
      direction: formateur.direction,
      entreprise: formateur.entreprise
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
      await api.put(`/formateurs/${editingFormateur.id}?${params.toString()}`, '', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditModalOpen(false);
      setEditingFormateur(null);
      fetchFormateurs();
    } catch (err) {
      setError('Failed to update formateur');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Formateurs.confirm_delete', 'Are you sure you want to delete this formateur?'))) {
      try {
        await api.delete(`/formateurs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFormateurs();
      } catch (err) {
        setError('Failed to delete formateur');
      }
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingFormateur(null);
  };

  return (
    <div className="crud-container">
      <h2><FaChalkboardTeacher style={{ marginRight: 8 }} />{t('Formateurs.title')}</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Create Form */}
      <form onSubmit={handleCreate}>
        <input name="nom_prenom" placeholder={t('Formateurs.name')} value={form.nom_prenom} onChange={handleChange} required />
        <input name="specialite" placeholder={t('Formateurs.specialty')} value={form.specialite} onChange={handleChange} required />
        <input name="direction" placeholder={t('Formateurs.direction')} value={form.direction} onChange={handleChange} required />
        <input name="entreprise" placeholder={t('Formateurs.entreprise')} value={form.entreprise} onChange={handleChange} required />
        <button type="submit"><FaUserPlus style={{ marginRight: 6 }} />{t('Formateurs.add')}</button>
      </form>

      {/* Desktop Table View */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('Formateurs.name')}</th>
              <th>{t('Formateurs.specialty')}</th>
              <th>{t('Formateurs.direction')}</th>
              <th>{t('Formateurs.entreprise')}</th>
              <th>{t('Formateurs.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {formateurs.map(f => (
              <tr key={f.id}>
                <td>{f.nom_prenom}</td>
                <td>{f.specialite}</td>
                <td>{f.direction}</td>
                <td>{f.entreprise}</td>
                <td>
                  <button onClick={() => handleEdit(f)}><FaUserEdit style={{ marginRight: 4 }} />{t('Formateurs.edit')}</button>
                  <button onClick={() => handleDelete(f.id)}><FaTrash style={{ marginRight: 4 }} />{t('Formateurs.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {formateurs.map(f => (
          <div key={f.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="mobile-card-title">{f.nom_prenom}</div>
              <div className="mobile-card-actions">
                <button onClick={() => handleEdit(f)}><FaUserEdit /></button>
                <button onClick={() => handleDelete(f.id)}><FaTrash /></button>
              </div>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Formateurs.specialty')}:</span>
                <span className="mobile-card-value">{f.specialite}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Formateurs.direction')}:</span>
                <span className="mobile-card-value">{f.direction}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">{t('Formateurs.entreprise')}:</span>
                <span className="mobile-card-value">{f.entreprise}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={closeEditModal}
        title={t('Formateurs.edit_formateur', 'Edit Formateur')}
      >
        <form onSubmit={handleUpdate} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Formateurs.name')}</label>
            <input 
              className="modal-form-input"
              name="nom_prenom" 
              value={editForm.nom_prenom} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Formateurs.specialty')}</label>
            <input 
              className="modal-form-input"
              name="specialite" 
              value={editForm.specialite} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Formateurs.direction')}</label>
            <input 
              className="modal-form-input"
              name="direction" 
              value={editForm.direction} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">{t('Formateurs.entreprise')}</label>
            <input 
              className="modal-form-input"
              name="entreprise" 
              value={editForm.entreprise} 
              onChange={handleEditChange} 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeEditModal} className="btn-secondary">
              {t('Formateurs.cancel')}
            </button>
            <button type="submit">
              <FaUserEdit style={{ marginRight: 6 }} />
              {t('Formateurs.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Formateurs;
