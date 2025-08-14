import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Magnet from './utils/magnet';

function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const containerRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    }
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' });
    }
  }, []);

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
    <div className="login-container" ref={containerRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      {/* Blurry background image */}
      <img 
        src="/formation1.jpg" 
        alt="Background" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'blur(16px) brightness(0.7)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="login-hero-img-wrap" style={{ marginBottom: '2rem' }}>
          <img src="/formation1.jpg" alt="Formation" className="login-hero-img" style={{ boxShadow: '0 8px 32px rgba(3,4,94,0.13)', borderRadius: '18px', maxWidth: '320px', width: '80vw', objectFit: 'cover', aspectRatio: '4/3' }} />
        </div>
        <div className="login-form" ref={formRef} style={{ background: 'rgba(255,255,255,0.97)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(3,4,94,0.13)', padding: '2.5rem', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <h2 style={{ color: '#0077B6', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', letterSpacing: '1px' }}>{t('Login.title', 'Login')}</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input 
              type="text" 
              placeholder={t('Login.username', 'Username')} 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ padding: '1rem 1.2rem', border: '2px solid #90E0EF', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.8)' }}
            />
            <input 
              type="password" 
              placeholder={t('Login.password', 'Password')} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ padding: '1rem 1.2rem', border: '2px solid #90E0EF', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.8)' }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg, #0077B6, #00B4D8)', color: '#fff', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,119,182,0.3)', cursor: 'pointer', marginTop: '1rem', letterSpacing: '0.5px' }}>{t('Login.submit', 'Login')}</button>
          </form>
          {error && <p className="error" style={{ color: '#dc3545', background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '12px', padding: '1rem', fontWeight: 500, width: '100%', textAlign: 'center' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;