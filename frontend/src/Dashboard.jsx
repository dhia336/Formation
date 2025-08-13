import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import ExportButton from './ExportButton';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaChalkboardTeacher, FaLayerGroup, FaBuilding, FaChartBar, FaStar } from 'react-icons/fa';

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2><FaChartBar style={{ marginRight: 8 }} />{t('common.dashboard')}</h2>
      <ExportButton />
      <br />
      {error && <p className="error">{error}</p>}
      {stats ? (
        <div className="stats">
          <h3>{t('dashboard.statistics', 'Statistics')}</h3><br />
          <ul>
            <li><FaUsers style={{ marginRight: 6 }} />{t('dashboard.participants_count', 'Participants')}: {stats.participants}</li>
            <li><FaChalkboardTeacher style={{ marginRight: 6 }} />{t('dashboard.formateurs_count', 'Formateurs')}: {stats.formateurs}</li>
            <li><FaLayerGroup style={{ marginRight: 6 }} />{t('dashboard.cycles_count', 'Cycles')}: {stats.cycles}</li>
            <li><FaLayerGroup style={{ marginRight: 6 }} />{t('dashboard.active_cycles', 'Active Cycles')}: {stats.active_cycles}</li>
            <li><FaChartBar style={{ marginRight: 6 }} />{t('dashboard.avg_participants_per_cycle', 'Avg. Participants/Cycle')}: {stats.avg_participants_per_cycle?.toFixed(2)}</li>
          </ul><br />
          <h4>{t('dashboard.recent_additions', 'Recent Additions (last 7 days)')}</h4>
          <ul>
            <li>{t('dashboard.participants_count', 'Participants')}: {stats.recent_additions?.participants}</li>
            <li>{t('dashboard.formateurs_count', 'Formateurs')}: {stats.recent_additions?.formateurs}</li>
            <li>{t('dashboard.cycles_count', 'Cycles')}: {stats.recent_additions?.cycles}</li>
          </ul>
          <h4>{t('dashboard.participants_per_company', 'Participants per Company')}</h4>
          <table><thead><tr><th>{t('dashboard.company', 'Company')}</th><th>{t('dashboard.count', 'Count')}</th></tr></thead><tbody>
            {stats.participants_per_company && Object.entries(stats.participants_per_company).map(([company, count]) => (
              <tr key={company}><td>{company}</td><td>{count}</td></tr>
            ))}
          </tbody></table>
          <h4>{t('dashboard.cycles_per_theme', 'Cycles per Theme')}</h4>
          <table><thead><tr><th>{t('dashboard.theme', 'Theme')}</th><th>{t('dashboard.count', 'Count')}</th></tr></thead><tbody>
            {stats.cycles_per_theme && Object.entries(stats.cycles_per_theme).map(([theme, count]) => (
              <tr key={theme}><td>{theme}</td><td>{count}</td></tr>
            ))}
          </tbody></table>
          <h4>{t('dashboard.formateurs_per_specialty', 'Formateurs per Specialty')}</h4>
          <table><thead><tr><th>{t('dashboard.specialty', 'Specialty')}</th><th>{t('dashboard.count', 'Count')}</th></tr></thead><tbody>
            {stats.formateurs_per_specialty && Object.entries(stats.formateurs_per_specialty).map(([spec, count]) => (
              <tr key={spec}><td>{spec}</td><td>{count}</td></tr>
            ))}
          </tbody></table>
          <h4>{t('dashboard.top_companies', 'Top 5 Companies')}</h4>
          <table><thead><tr><th>{t('dashboard.company', 'Company')}</th><th>{t('dashboard.count', 'Count')}</th></tr></thead><tbody>
            {stats.top_companies && stats.top_companies.map((row, i) => (
              <tr key={i}><td>{row.entreprise}</td><td>{row.count}</td></tr>
            ))}
          </tbody></table>
          <h4>{t('dashboard.top_themes', 'Top 5 Training Themes')}</h4>
          <table><thead><tr><th>{t('dashboard.theme', 'Theme')}</th><th>{t('dashboard.count', 'Count')}</th></tr></thead><tbody>
            {stats.top_themes && stats.top_themes.map((row, i) => (
              <tr key={i}><td>{row.theme}</td><td>{row.count}</td></tr>
            ))}
          </tbody></table>
          {/* Removed Most Active Formateur section as requested */}
        </div>
      ) : (
        <p>{t('dashboard.loading', 'Loading stats...')}</p>
      )}
    </div>
  );
}

export default Dashboard;
