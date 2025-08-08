import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      <LanguageSwitcher />
      <h1>{t('Home.welcome', 'Welcome to the Training Center Management System')}</h1>
      <div>
        <Link to="/login" className="btn">{t('Home.login', 'Login')}</Link>
      </div>
    </div>
  );
}

export default Home;