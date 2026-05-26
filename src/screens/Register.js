import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Scissors, CheckCircle } from 'lucide-react';
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

function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;
  const width = useWindowWidth();
  const isDesktop = width >= 768;
  const sr = theme.jezik === 'sr';

  const [ime, setIme] = useState('');
  const [salonNaziv, setSalonNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!ime || !salonNaziv || !adresa || !telefon || !email || !password) {
      setError(t.upozorenje); return;
    }
    if (password.length < 6) {
      setError('Minimum 6 characters / Minimum 6 karaktera.'); return;
    }
    setLoading(true); setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'frizeri', userCredential.user.uid), {
        ime, salonNaziv, adresa, telefon, email, kreirano: new Date()
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email već registrovan / Email already in use.');
      } else {
        setError('Greška / Error. Try again.');
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1px solid ${theme.border}`, fontSize: 14, marginBottom: 12,
    boxSizing: 'border-box', outline: 'none',
    backgroundColor: theme.input, color: theme.inputText
  };

  const benefits = sr ? [
    { icon: '✅', text: 'Besplatno za početak' },
    { icon: '📅', text: 'Online zakazivanje 24/7' },
    { icon: '📊', text: 'Kontrolna tabla sa statistikama' },
    { icon: '🔔', text: 'Notifikacije u realnom vremenu' },
    { icon: '📷', text: 'Dodaj sliku svog salona' },
    { icon: '⭐', text: 'Prikaz recenzija klijenata' },
  ] : [
    { icon: '✅', text: 'Free to start' },
    { icon: '📅', text: 'Online booking 24/7' },
    { icon: '📊', text: 'Dashboard with statistics' },
    { icon: '🔔', text: 'Real-time notifications' },
    { icon: '📷', text: 'Add your salon photo' },
    { icon: '⭐', text: 'Client reviews display' },
  ];

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

        {/* SADRZAJ */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start', maxWidth: 1000, width: '100%' }}>

            {/* Leva strana — benefiti */}
            <div style={{ paddingTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 14, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={28} color="white" />
                </div>
                <span style={{ fontWeight: 'bold', fontSize: 24, color: theme.text }}>BarberApp</span>
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 'bold', color: theme.text, lineHeight: 1.2, marginBottom: 12 }}>
                {sr ? 'Registruj svoj salon' : 'Register your salon'} 💈
              </h1>
              <p style={{ fontSize: 16, color: theme.subtext, marginBottom: 32, lineHeight: 1.6 }}>
                {sr ? 'Pridruži se stotinama frizera koji koriste BarberApp za upravljanje rezervacijama.' : 'Join hundreds of barbers using BarberApp to manage their bookings.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{b.icon}</span>
                    <span style={{ fontSize: 15, color: theme.subtext }}>{b.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32, backgroundColor: theme.darkMode ? '#1e3a8a33' : '#eff6ff', borderRadius: 14, padding: '16px 20px', border: '1px solid #bfdbfe' }}>
                <p style={{ fontSize: 14, color: '#2563eb', fontWeight: 'bold', margin: '0 0 4px' }}>
                  {sr ? '🎁 Besplatno za prvih 30 dana' : '🎁 Free for the first 30 days'}
                </p>
                <p style={{ fontSize: 13, color: theme.subtext, margin: 0 }}>
                  {sr ? 'Bez kreditne kartice. Otkaži kada hoćeš.' : 'No credit card. Cancel anytime.'}
                </p>
              </div>
            </div>

            {/* Desna strana — forma */}
            <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 6 }}>{t.registracija}</h2>
              <p style={{ fontSize: 14, color: theme.subtext, marginBottom: 24 }}>{t.kreirajNalog}</p>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16, border: '1px solid #fecaca' }}>
                  <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ {error}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 0 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.tvojeIme}</label>
                  <input placeholder="Marko Marković" value={ime} onChange={e => setIme(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.nazivSalona}</label>
                  <input placeholder="Urban Barber" value={salonNaziv} onChange={e => setSalonNaziv(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.adresaSalona}</label>
                  <input placeholder="Kralja Petra 5, Beograd" value={adresa} onChange={e => setAdresa(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.brojTelefona}</label>
                  <input placeholder="064 123 4567" value={telefon} onChange={e => setTelefon(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.emailAdresa}</label>
              <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

              <label style={{ fontSize: 12, fontWeight: '600', color: theme.subtext, display: 'block', marginBottom: 5 }}>{t.lozinka}</label>
              <input placeholder="Min. 6 karaktera" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />

              <button onClick={handleRegister} disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? '...' : t.kreirajNalogBtn}
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 16 }}>
                {t.imasNalog}{' '}
                <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{t.prijaviSeBtn}</span>
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
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 'bold', margin: 0 }}>{t.registracija}</h1>
        <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 8 }}>{t.kreirajNalog}</p>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.tvojeIme}</p>
          <input placeholder="Npr. Marko Marković" value={ime} onChange={e => setIme(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.nazivSalona}</p>
          <input placeholder="Npr. Urban Barber" value={salonNaziv} onChange={e => setSalonNaziv(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.adresaSalona}</p>
          <input placeholder="Npr. Kralja Petra 5, Beograd" value={adresa} onChange={e => setAdresa(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.brojTelefona}</p>
          <input placeholder="Npr. 064 123 4567" value={telefon} onChange={e => setTelefon(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.emailAdresa}</p>
          <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>{t.lozinka}</p>
          <input placeholder="Min. 6" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />
          <button onClick={handleRegister} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            {loading ? '...' : t.kreirajNalogBtn}
          </button>
          <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 16 }}>
            {t.imasNalog}{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{t.prijaviSeBtn}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;