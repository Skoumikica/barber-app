import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Scissors } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
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
      setError('Molimo popunite sva polja.');
      return;
    }
    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'frizeri', userCredential.user.uid), {
        ime, salonNaziv, adresa, telefon, email, kreirano: new Date()
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ovaj email je već registrovan.');
      } else {
        setError('Greška pri registraciji. Pokušajte ponovo.');
      }
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 14, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '40px 20px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: 'center' }}>
        <Scissors size={36} color="white" style={{ marginBottom: 12 }} />
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 'bold', margin: 0 }}>Registruj se</h1>
        <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 8 }}>Kreiraj nalog za tvoj salon</p>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {error ? (
            <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          ) : null}

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Tvoje ime</p>
          <input placeholder="Npr. Marko Marković" value={ime} onChange={e => setIme(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Naziv salona</p>
          <input placeholder="Npr. Urban Barber" value={salonNaziv} onChange={e => setSalonNaziv(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Adresa salona</p>
          <input placeholder="Npr. Kralja Petra 5, Beograd" value={adresa} onChange={e => setAdresa(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Broj telefona</p>
          <input placeholder="Npr. 064 123 4567" value={telefon} onChange={e => setTelefon(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Email adresa</p>
          <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Lozinka</p>
          <input placeholder="Minimum 6 karaktera" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />

          <button onClick={handleRegister} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            {loading ? 'Registracija...' : 'Kreiraj nalog →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 16 }}>
            Već imaš nalog?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>Prijavi se</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;