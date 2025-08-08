import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="language-switcher">
      <button className={current === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>English</button>
      <button className={current === 'fr' ? 'active' : ''} onClick={() => changeLanguage('fr')}>Français</button>
      <button className={current === 'ar' ? 'active' : ''} onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
};

export default LanguageSwitcher;
