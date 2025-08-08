import React, { useState } from 'react';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', {}, {
        auth: {
          username,
          password
        }
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(t('Login.invalid', 'Invalid credentials'));
    }
  };

  return (
    <div className="login-container">
      <LanguageSwitcher />
      <h2>{t('Login.title', 'Login')}</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <input type="text" placeholder={t('Login.username', 'Username')} value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder={t('Login.password', 'Password')} value={password} onChange={e => setPassword(e.target.value)} required /> <br />
        <button type="submit">{t('Login.submit', 'Login')}</button>
        <Link to="/" className="btn">{t('Home.home', 'Home Page')}</Link>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
