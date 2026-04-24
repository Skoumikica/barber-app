import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Star } from 'lucide-react';

function Recenzija() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [ocena, setOcena] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [ime, setIme] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!ocena) {
      alert('Molimo izaberite ocenu.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'recenzije'), {
        salonId: id,
        ocena,
        komentar,
        ime: ime || 'Anoniman',
        kreirano: new Date()
      });
      setDone(true);
    } catch (error) {
      alert('Greška pri slanju recenzije.');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 70, marginBottom: 20 }}>⭐</div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>Hvala na recenziji!</h2>
        <p style={{ color: theme.subtext, marginBottom: 32 }}>Vaša ocena pomaže drugima da pronađu dobrog frizera.</p>
        <button onClick={() => navigate('/')}
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
          Nazad na početak
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>Ostavi Recenziju</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 20, color: theme.text, textAlign: 'center' }}>Kako ocenjuješ salon?</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={40}
                color="#f59e0b"
                fill={(hovered || ocena) >= i ? '#f59e0b' : 'none'}
                style={{ cursor: 'pointer' }}
                onClick={() => setOcena(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
              />
            ))}
          </div>

          {ocena > 0 && (
            <p style={{ textAlign: 'center', color: theme.subtext, fontSize: 14, marginBottom: 0 }}>
              {['', 'Loše 😞', 'Može bolje 😐', 'Dobro 🙂', 'Odlično 😊', 'Savršeno! 🌟'][ocena]}
            </p>
          )}
        </div>

        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>Tvoji podaci</h3>
          
          <input placeholder="Tvoje ime (opciono)" value={ime} onChange={e => setIme(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 14, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />

          <textarea placeholder="Napiši komentar (opciono)..." value={komentar} onChange={e => setKomentar(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText, resize: 'none', fontFamily: 'sans-serif' }} />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 400, padding: '12px 20px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, boxSizing: 'border-box' }}>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {loading ? 'Slanje...' : 'Pošalji recenziju ⭐'}
        </button>
      </div>
    </div>
  );
}

export default Recenzija;