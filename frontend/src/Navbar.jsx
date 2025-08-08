import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaChalkboardTeacher, FaLayerGroup, FaSignOutAlt, FaHome } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-link"><FaHome style={{ marginRight: 6 }} />{t('common.dashboard')}</Link>
        <Link to="/participants" className="nav-link"><FaUsers style={{ marginRight: 6 }} />{t('common.participants')}</Link>
        <Link to="/formateurs" className="nav-link"><FaChalkboardTeacher style={{ marginRight: 6 }} />{t('common.formateurs')}</Link>
        <Link to="/cycles" className="nav-link"><FaLayerGroup style={{ marginRight: 6 }} />{t('common.cycles')}</Link>
      </div>
      <div className="nav-right">
        <LanguageSwitcher />
        <button className="nav-logout" onClick={handleLogout}><FaSignOutAlt style={{ marginRight: 6 }} />{t('common.logout')}</button>
      </div>
    </nav>
  );
};

export default Navbar;
