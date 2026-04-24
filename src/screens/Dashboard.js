import React, { useState, useEffect } from 'react';
import { LogOut, Clock, User, Settings, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { useTheme } from '../ThemeContext';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { BottomNav } from './Home';

function AppointmentCard({ appointment, onOtkazi }) {
  const theme = useTheme();
  const [done, setDone] = useState(false);
  const [otkazivanje, setOtkazivanje] = useState(false);

  const handleOtkazi = async () => {
    if (window.confirm(`Da li ste sigurni da želite da otkažete termin za ${appointment.ime}?`)) {
      setOtkazivanje(true);
      try {
        await onOtkazi(appointment.id);
      } catch (error) {
        alert('Greška pri otkazivanju.');
        setOtkazivanje(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}`, opacity: done ? 0.4 : 1 }}>
      <div style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
        <User size={20} color="#2563eb" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0, color: theme.text }}>{appointment.ime}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Clock size={11} color="#94a3b8" />
          <span style={{ fontSize: 12, color: theme.subtext }}>{appointment.vreme} · {appointment.dan} {appointment.datum}</span>
        </div>
        {appointment.usluga && (
          <span style={{ fontSize: 11, color: '#2563eb' }}>{appointment.usluga}</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
        <button onClick={() => setDone(!done)}
          style={{ backgroundColor: done ? '#86efac' : '#2563eb', color: done ? '#166534' : 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
          {done ? '✓' : appointment.vreme}
        </button>
        <button onClick={handleOtkazi} disabled={otkazivanje}
          style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
          {otkazivanje ? '...' : 'Otkaži'}
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDan, setSelectedDan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const onOtkazi = async (id) => {
    await deleteDoc(doc(db, 'termini', id));
  };

  useEffect(() => {
    const q = query(collection(db, 'termini'), orderBy('kreirano', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTermini(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const ovajMesec = termini.filter(t => {
    if (!t.kreirano) return false;
    const datum = t.kreirano.toDate ? t.kreirano.toDate() : new Date(t.kreirano);
    const sad = new Date();
    return datum.getMonth() === sad.getMonth() && datum.getFullYear() === sad.getFullYear();
  });

  const procenjeniPrihod = ovajMesec.length * 800;
  const filtrirani = selectedDan ? termini.filter(t => t.dan === selectedDan) : termini;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <User size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')} />
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 'bold', margin: 0 }}>Kontrolna Tabla</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Settings size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/setup')} />
            <LogOut size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          </div>
        </div>

        {/* Statistike */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Calendar size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{ovajMesec.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Ovaj mesec</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <TrendingUp size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 16, margin: 0 }}>{procenjeniPrihod.toLocaleString()}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>RSD prihod</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <CheckCircle size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{termini.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Ukupno</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* Kalendar filter */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>📅 Termini po danima</h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <div onClick={() => setSelectedDan(null)}
              style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                backgroundColor: selectedDan === null ? '#2563eb' : theme.border,
                color: selectedDan === null ? 'white' : theme.text }}>
              <div style={{ fontSize: 13, fontWeight: 'bold' }}>Svi</div>
              <div style={{ fontSize: 11 }}>{termini.length}</div>
            </div>
            {['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'].map(dan => {
              const broj = termini.filter(t => t.dan === dan).length;
              return (
                <div key={dan} onClick={() => setSelectedDan(selectedDan === dan ? null : dan)}
                  style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                    backgroundColor: selectedDan === dan ? '#2563eb' : theme.border,
                    color: selectedDan === dan ? 'white' : theme.text }}>
                  <div style={{ fontSize: 13, fontWeight: 'bold' }}>{dan}</div>
                  <div style={{ fontSize: 11 }}>{broj}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista termina */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: theme.subtext }}>Učitavanje termina...</p>
          ) : termini.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>✂️</div>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>Još nema termina</h3>
              <p style={{ color: theme.subtext, fontSize: 14, marginBottom: 24 }}>Kad klijenti zakažu, termini će se pojaviti ovde u realnom vremenu.</p>
              <div style={{ backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
                <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>💡 Savet</p>
                <p style={{ fontSize: 13, color: '#3b82f6', margin: '4px 0 0' }}>Podeli link aplikacije sa klijentima i počni da primaš rezervacije!</p>
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: theme.text }}>
                {selectedDan ? `Termini za ${selectedDan}` : 'Svi termini'}
              </h3>
              <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 14 }}>{filtrirani.length} termin(a)</p>
              {filtrirani.map(a => <AppointmentCard key={a.id} appointment={a} onOtkazi={onOtkazi} />)}
            </>
          )}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <BottomNav user={user} />

    </div>
  );
}

export default Dashboard;