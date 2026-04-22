import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Scissors } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Molimo unesite email i lozinku.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Pogrešan email ili lozinka.');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 14, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '40px 20px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: 'center' }}>
        <Scissors size={36} color="white" style={{ marginBottom: 12 }} />
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 'bold', margin: 0 }}>Dobrodošao nazad</h1>
        <p style={{ color: '#93c5fd', fontSize: 14, marginTop: 8 }}>Prijavi se na svoj nalog</p>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {error ? (
            <div style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          ) : null}

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Email adresa</p>
          <input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Lozinka</p>
          <input placeholder="Tvoja lozinka" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />

          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: theme.subtext, marginTop: 16 }}>
            Nemaš nalog?{' '}
            <span onClick={() => navigate('/register')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>Registruj se</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;