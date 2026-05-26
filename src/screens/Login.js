import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Scissors } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;
  const width = useWindowWidth();
  const isDesktop = width >= 768;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError(t.lozinka); return; }
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) { setError(t.pogresnaLozinka); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 14,
    boxSizing: 'border-box', outline: 'none',
    backgroundColor: theme.input, color: theme.inputText
  };

  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="white" />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>BarberApp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={theme.toggleJezik} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: theme.text }}>
                {theme.jezik === 'sr' ? '🇬🇧 EN' : '🇷🇸 SR'}
              </div>
              <div onClick={theme.toggle} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
                {theme.darkMode ? '☀️' : '🌙'}
              </div>
            </div>
          </div>
        </nav>

        {/* CENTAR */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 900, width: '100%' }}>

            {/* Leva strana — tekst */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 14, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={28} color="white" />
                </div>
                <span style={{ fontWeight: 'bold', fontSize: 24, color: theme.text }}>BarberApp</span>
              </div>
              <h1 style={{ fontSize: 38, fontWeight: 'bold', color: theme.text, lineHeight: 1.2, marginBottom: 16 }}>
                {t.dobrodosao} 👋
              </h1>
              <p style={{ fontSize: 17, color: theme.subtext, lineHeight: 1.6, marginBottom: 32 }}>
                {t.prijaviSe}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '📅', text: theme.jezik === 'sr' ? 'Upravljaj terminima u realnom vremenu' : 'Manage appointments in real time' },
                  { icon: '📊', text: theme.jezik === 'sr' ? 'Prati prihode i statistike' : 'Track income and statistics' },
                  { icon: '🔔', text: theme.jezik === 'sr' ? 'Dobijaj notifikacije odmah' : 'Get instant notifications' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, color: theme.subtext }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desna strana — forma */}
            <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 6 }}>{t.dobrodosao}</h2>
              <p style={{ fontSize: 14, color: theme.subtext, marginBottom: 28 }}>{t.prijaviSe}</p>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16, border: '1px solid #fecaca' }}>
                  <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ {error}</p>
                </div>
              )}

              <label style={{ fontSize: 13, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 6 }}>{t.emailAdresa}</label>
              <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ ...inputStyle }} />

              <label style={{ fontSize: 13, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 6 }}>{t.lozinka}</label>
              <input placeholder={t.tvojaLozinka} type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ ...inputStyle, marginBottom: 24 }} />

              <button onClick={handleLogin} disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? '...' : t.prijaviSeBtn}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 20 }}>
                {t.nemasProfil}{' '}
                <span onClick={() => navigate('/register')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{t.registrujSe}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILNI ──
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '40px 20px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: 'center' }}>
        <Scissors size={36} color="white" style={{ marginBottom: 12 }} />
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 'bold', margin: 0 }}>{t.dobrodosao}</h1>
        <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 8 }}>{t.prijaviSe}</p>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.emailAdresa}</p>
          <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.lozinka}</p>
          <input placeholder={t.tvojaLozinka} type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />
          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            {loading ? '...' : t.prijaviSeBtn}
          </button>
          <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 16 }}>
            {t.nemasProfil}{' '}
            <span onClick={() => navigate('/register')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{t.registrujSe}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;