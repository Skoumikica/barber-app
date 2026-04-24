import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, User, Scissors } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ime, setIme] = useState('');
  const [salonNaziv, setSalonNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'frizeri', auth.currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIme(data.ime || '');
          setSalonNaziv(data.salonNaziv || '');
          setAdresa(data.adresa || '');
          setTelefon(data.telefon || '');
          setEmail(data.email || '');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchProfil();
  }, []);

  const sacuvaj = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'frizeri', auth.currentUser.uid), {
        ime, salonNaziv, adresa, telefon, azurirano: new Date()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Greška pri čuvanju.');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 14,
    boxSizing: 'border-box', outline: 'none',
    backgroundColor: theme.input, color: theme.inputText
  };

  if (loading) return <p style={{ padding: 20, color: theme.text }}>Učitavanje...</p>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>Moj Profil</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scissors size={36} color="white" />
          </div>
        </div>

        {success && (
          <div style={{ backgroundColor: '#dcfce7', borderRadius: 10, padding: '10px 14px', marginBottom: 16, textAlign: 'center' }}>
            <p style={{ color: '#16a34a', fontSize: 14, fontWeight: 'bold', margin: 0 }}>✓ Profil uspešno sačuvan!</p>
          </div>
        )}

        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>Lični podaci</h3>

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Tvoje ime</p>
          <input placeholder="Ime i prezime" value={ime} onChange={e => setIme(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Email adresa</p>
          <input placeholder="Email" value={email} disabled
            style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
        </div>

        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>Podaci salona</h3>

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Naziv salona</p>
          <input placeholder="Naziv salona" value={salonNaziv} onChange={e => setSalonNaziv(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Adresa</p>
          <input placeholder="Adresa salona" value={adresa} onChange={e => setAdresa(e.target.value)} style={inputStyle} />

          <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 6 }}>Telefon</p>
          <input placeholder="Broj telefona" value={telefon} onChange={e => setTelefon(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 400, padding: '12px 20px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, boxSizing: 'border-box' }}>
        <button onClick={sacuvaj} disabled={saving}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {saving ? 'Čuvanje...' : 'Sačuvaj Profil →'}
        </button>
      </div>
    </div>
  );
}

export default Profile;