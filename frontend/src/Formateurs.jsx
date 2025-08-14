import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { FaCheckSquare, FaRegSquare, FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import api from './api';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { FaUserPlus, FaUserEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';

function Formateurs() {
  const { t } = useTranslation();
  const [formateurs, setFormateurs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState(null);
  const [editForm, setEditForm] = useState({ nom_prenom: '', specialite: '', direction: '', entreprise: '' });
  const token = localStorage.getItem('token');

  // GSAP refs
  const tableRef = useRef();
  const cardsRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    // Animate table rows on scroll
    if (tableRef.current) {
      gsap.utils.toArray(tableRef.current.querySelectorAll('tbody tr')).forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }
    // Animate mobile cards on scroll
    if (cardsRef.current) {
      gsap.utils.toArray(cardsRef.current.querySelectorAll('.mobile-card')).forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }
    // Animate forms on scroll
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    // Clean up triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [formateurs]);

  const fetchFormateurs = async () => {
    try {
      const params = { page, page_size: pageSize };
      const res = await api.get('/formateurs', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setFormateurs(res.data.items || res.data);
      setTotal(res.data.total || res.data.length || 0);
      setSelected([]);
    } catch (err) {
      setError('Failed to fetch formateurs');
    }
  };

  useEffect(() => {
    fetchFormateurs();
    // eslint-disable-next-line
  }, [page]);
  // Bulk selection
  const toggleSelectAll = () => {
    if (selected.length === formateurs.length) setSelected([]);
    else setSelected(formateurs.map(f => f.id));
  };
  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(t('Formateurs.confirm_bulk_delete', 'Delete selected formateurs?'))) return;
    try {
      await Promise.all(selected.map(id => api.delete(`/formateurs/${id}`, { headers: { Authorization: `Bearer ${token}` } })));
      fetchFormateurs();
    } catch {
      setError('Bulk delete failed');
    }
  };

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
  <form onSubmit={handleCreate} ref={formRef}>
        <input name="nom_prenom" placeholder={t('Formateurs.name')} value={form.nom_prenom} onChange={handleChange} required />
        <input name="specialite" placeholder={t('Formateurs.specialty')} value={form.specialite} onChange={handleChange} required />
        <input name="direction" placeholder={t('Formateurs.direction')} value={form.direction} onChange={handleChange} required />
        <input name="entreprise" placeholder={t('Formateurs.entreprise')} value={form.entreprise} onChange={handleChange} required />
        <button type="submit"><FaUserPlus style={{ marginRight: 6 }} />{t('Formateurs.add')}</button>
      </form>

  {/* Desktop Table View */}
  <div className="table-responsive" ref={tableRef}>
        <table className="crud-table">
          <thead>
            <tr>
              <th style={{width:'36px',textAlign:'center',position:'sticky',left:0,background:'#fff',zIndex:2}}>
                <button type="button" className="table-check" onClick={toggleSelectAll} title={t('Formateurs.select_all','Select all')}>
                  {selected.length === formateurs.length && formateurs.length > 0 ? <FaCheckSquare /> : <FaRegSquare />}
                </button>
              </th>
              <th>{t('Formateurs.name')}</th>
              <th>{t('Formateurs.specialty')}</th>
              <th>{t('Formateurs.direction')}</th>
              <th>{t('Formateurs.entreprise')}</th>
              <th>{t('Formateurs.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {formateurs.map((f, idx) => (
              <tr key={f.id} className={idx%2===0?"zebra":""}>
                <td style={{textAlign:'center',position:'sticky',left:0,background:'#fff',zIndex:1}}>
                  <button type="button" className="table-check" onClick={()=>toggleSelect(f.id)} title={selected.includes(f.id)?t('Formateurs.deselect','Deselect'):t('Formateurs.select','Select')}>
                    {selected.includes(f.id) ? <FaCheckSquare /> : <FaRegSquare />}
                  </button>
                </td>
                <td>{f.nom_prenom}</td>
                <td>{f.specialite}</td>
                <td>{f.direction}</td>
                <td>{f.entreprise}</td>
                <td>
                  <button onClick={() => handleEdit(f)} title={t('Formateurs.edit','Edit')} className="icon-btn"><FaUserEdit /></button>
                  <button onClick={() => handleDelete(f.id)} title={t('Formateurs.delete','Delete')} className="icon-btn"><FaTrash /></button>
                  <span className="icon-tooltip"><FaInfoCircle /> {t('Formateurs.actions_hint','Edit or delete')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="crud-table-footer">
          <button onClick={handleBulkDelete} disabled={selected.length===0} className="bulk-delete-btn">{t('Formateurs.bulk_delete','Delete Selected')}</button>
          <div className="pagination">
            <button onClick={()=>setPage(page-1)} disabled={page===1}><FaChevronLeft /></button>
            <span>{t('common.page','Page')} {page} / {Math.ceil(total/pageSize)||1}</span>
            <button onClick={()=>setPage(page+1)} disabled={page>=Math.ceil(total/pageSize)}><FaChevronRight /></button>
          </div>
        </div>
      </div>
  {/* Add .zebra, .icon-btn, .icon-tooltip, .crud-table, .crud-table-footer, .bulk-delete-btn, .pagination styles in App.css for full effect */}

  {/* Mobile Card View */}
  <div className="mobile-cards" ref={cardsRef}>
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
