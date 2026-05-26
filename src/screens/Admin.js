import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, LogOut, Trash2, CheckCircle, Users, Calendar, TrendingUp, Scissors } from 'lucide-react';

const ADMIN_LOZINKA = 'Carsalasije123';

function Admin() {
  const navigate = useNavigate();
  const [ulogovan, setUlogovan] = useState(false);
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');

  const [saloni, setSaloni] = useState([]);
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aktivnaTabela, setAktivnaTabela] = useState('saloni');

  const handleLogin = () => {
    if (lozinka === ADMIN_LOZINKA) {
      setUlogovan(true);
      fetchData();
    } else {
      setGreska('Pogrešna lozinka!');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const saloniSnap = await getDocs(collection(db, 'frizeri'));
      setSaloni(saloniSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const terminiSnap = await getDocs(collection(db, 'termini'));
      setTermini(terminiSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleBrisiSalon = async (id, naziv) => {
    if (window.confirm(`Obrisati salon "${naziv}"?`)) {
      await deleteDoc(doc(db, 'frizeri', id));
      setSaloni(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleVerifikuj = async (id, trenutno) => {
    await updateDoc(doc(db, 'frizeri', id), { verifikovan: !trenutno });
    setSaloni(prev => prev.map(s => s.id === id ? { ...s, verifikovan: !trenutno } : s));
  };

  const handleBrisiTermin = async (id) => {
    if (window.confirm('Obrisati ovaj termin?')) {
      await deleteDoc(doc(db, 'termini', id));
      setTermini(prev => prev.filter(t => t.id !== id));
    }
  };

  const ukupanPrihod = termini.reduce((sum, t) => sum + (t.cena || 0), 0);

  // ── LOGIN EKRAN ──
  if (!ulogovan) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '50%', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={36} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Admin Panel</h1>
          <p style={{ color: '#64748b', marginTop: 8 }}>BarberApp upravljanje</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <label style={{ fontSize: 13, fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: 8 }}>Admin lozinka</label>
          <input
            type="password"
            placeholder="Unesite lozinku..."
            value={lozinka}
            onChange={e => { setLozinka(e.target.value); setGreska(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, boxSizing: 'border-box', outline: 'none', marginBottom: 12 }}
          />
          {greska && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 10 }}>❌ {greska}</p>}
          <button onClick={handleLogin}
            style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', padding: '13px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
            Prijavi se →
          </button>
          <button onClick={() => navigate('/')}
            style={{ width: '100%', background: 'none', color: '#64748b', padding: '10px', borderRadius: 10, border: 'none', fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
            ← Nazad na aplikaciju
          </button>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: 40 }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={20} color="white" />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Admin Panel</span>
          </div>
          <LogOut size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => setUlogovan(false)} />
        </div>

        {/* Statistike */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Scissors size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 22, margin: 0 }}>{saloni.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Salona</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Calendar size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 22, margin: 0 }}>{termini.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Termina</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <TrendingUp size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 16, margin: 0 }}>{ukupanPrihod.toLocaleString()}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>RSD ukupno</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: 12, padding: 4, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <button onClick={() => setAktivnaTabela('saloni')}
            style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 14, backgroundColor: aktivnaTabela === 'saloni' ? '#2563eb' : 'transparent', color: aktivnaTabela === 'saloni' ? 'white' : '#64748b' }}>
            💈 Saloni ({saloni.length})
          </button>
          <button onClick={() => setAktivnaTabela('termini')}
            style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 14, backgroundColor: aktivnaTabela === 'termini' ? '#2563eb' : 'transparent', color: aktivnaTabela === 'termini' ? 'white' : '#64748b' }}>
            📅 Termini ({termini.length})
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Učitavanje...</p>
        ) : aktivnaTabela === 'saloni' ? (

          // ── LISTA SALONA ──
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {saloni.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Nema registrovanih salona.</p>
            ) : saloni.map(salon => (
              <div key={salon.id} style={{ backgroundColor: 'white', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 'bold', fontSize: 15, color: '#1e293b', margin: 0 }}>{salon.salonNaziv}</p>
                      {salon.verifikovan && (
                        <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 'bold', padding: '2px 6px', borderRadius: 20 }}>✓ Verifikovan</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 2px' }}>👤 {salon.ime}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>📧 {salon.email}</p>
                    {salon.adresa && <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>📍 {salon.adresa}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => handleVerifikuj(salon.id, salon.verifikovan)}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 12, backgroundColor: salon.verifikovan ? '#fef9c3' : '#dcfce7', color: salon.verifikovan ? '#854d0e' : '#166534' }}>
                    {salon.verifikovan ? '✗ Ukloni verifikaciju' : '✓ Verifikuj'}
                  </button>
                  <button onClick={() => handleBrisiSalon(salon.id, salon.salonNaziv)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: '#fef2f2', color: '#ef4444' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        ) : (

          // ── LISTA TERMINA ──
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {termini.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Nema termina.</p>
            ) : termini.map(termin => (
              <div key={termin.id} style={{ backgroundColor: 'white', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 'bold', fontSize: 14, color: '#1e293b', margin: '0 0 4px' }}>{termin.ime}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px' }}>✂️ {termin.usluga}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px' }}>🕐 {termin.vreme} · {termin.dan} {termin.datum}</p>
                  <p style={{ fontSize: 12, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>{termin.cena} RSD</p>
                </div>
                <button onClick={() => handleBrisiTermin(termin.id)}
                  style={{ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: '#fef2f2', color: '#ef4444', marginLeft: 12, flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
}

export default Admin;