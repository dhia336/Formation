import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Magnet from './utils/magnet';
function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      <div className='home-BG'></div>
        <LanguageSwitcher />
        <div className='home-hero'>
        <h1>{t('Home.welcome', 'Welcome to the Training Center Management System')}</h1>
        <div>
          <Magnet>
            <Link to="/login" className="btn">{t('Home.login', 'Login')}</Link>
          </Magnet>
        </div>
        </div>
        <div className='space'></div>
        <Link to="/contact" className='btn' >Contact</Link>
    </div>
  );
}

export default Home;