import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Clock, User, Settings, TrendingUp, Calendar, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { useTheme } from '../ThemeContext';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { BottomNav } from './Home';

function AppointmentCard({ appointment, onOtkazi, isNov }) {
  const theme = useTheme();
  const { t } = theme;
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
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}`, opacity: done ? 0.4 : 1, position: 'relative' }}>
      {/* Nova oznaka */}
      {isNov && (
        <div style={{ position: 'absolute', top: 14, left: -8, backgroundColor: '#2563eb', borderRadius: 20, padding: '2px 7px', fontSize: 10, fontWeight: 'bold', color: 'white' }}>
          NEW
        </div>
      )}
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
          {otkazivanje ? '...' : t.otkazi}
        </button>
      </div>
    </div>
  );
}

// ── NOTIFICATION PANEL ──
function NotificationPanel({ notifikacije, onClose, onClearAll, theme }) {
  const { t } = theme;
  const sr = theme.jezik === 'sr';

  return (
    <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, height: '100vh', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />

      {/* Panel */}
      <div style={{ position: 'relative', backgroundColor: theme.card, borderRadius: '0 0 24px 24px', maxHeight: '70vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${theme.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, margin: 0 }}>
            🔔 {sr ? 'Notifikacije' : 'Notifications'}
          </h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {notifikacije.length > 0 && (
              <span onClick={onClearAll} style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>
                {sr ? 'Obriši sve' : 'Clear all'}
              </span>
            )}
            <span onClick={onClose} style={{ fontSize: 20, cursor: 'pointer', color: theme.subtext }}>✕</span>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {notifikacije.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
              <p style={{ color: theme.subtext, fontSize: 14 }}>
                {sr ? 'Nema novih notifikacija' : 'No new notifications'}
              </p>
            </div>
          ) : (
            notifikacije.map((n, i) => (
              <div key={i} style={{ padding: '14px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', gap: 12, alignItems: 'flex-start', backgroundColor: n.procitana ? 'transparent' : (theme.darkMode ? '#1e3a8a22' : '#eff6ff') }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>✂️</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.text, margin: '0 0 4px' }}>
                    {sr ? 'Novi termin!' : 'New appointment!'}
                  </p>
                  <p style={{ fontSize: 13, color: theme.subtext, margin: '0 0 2px' }}>
                    👤 {n.ime} — {n.usluga}
                  </p>
                  <p style={{ fontSize: 12, color: '#2563eb', margin: 0 }}>
                    🕐 {n.vreme} · {n.dan} {n.datum}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDan, setSelectedDan] = useState(null);
  const [user, setUser] = useState(null);

  // Notifikacije
  const [notifikacije, setNotifikacije] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [neprocitane, setNeprocitane] = useState(0);
  const prethodniTermini = useRef([]);
  const prviLoad = useRef(true);

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

    if (!prviLoad.current) {
      const noviIds = data.map(d => d.id);
      const stariIds = prethodniTermini.current.map(d => d.id);
      const noviTermini = data.filter(d => !stariIds.includes(d.id));

      if (noviTermini.length > 0) {
        const novaNotif = noviTermini.map(n => ({ ...n, procitana: false }));
        setNotifikacije(prev => [...novaNotif, ...prev]);
        setNeprocitane(prev => prev + noviTermini.length);
      }
    } else {
      // Prvi load — uzmi termine iz poslednjih 24h kao notifikacije
      const pre24h = new Date(Date.now() - 86400000);
      const skorasnji = data.filter(t => {
        if (!t.kreirano) return false;
        const datum = t.kreirano.toDate ? t.kreirano.toDate() : new Date(t.kreirano);
        return datum > pre24h;
      });
      if (skorasnji.length > 0) {
        setNotifikacije(skorasnji.map(n => ({ ...n, procitana: false })));
        setNeprocitane(skorasnji.length);
      }
    }

    prethodniTermini.current = data;
    prviLoad.current = false;
    setTermini(data);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

  const handleOpenNotif = () => {
    setShowNotif(true);
    setNeprocitane(0);
    setNotifikacije(prev => prev.map(n => ({ ...n, procitana: true })));
  };

  const handleClearAll = () => {
    setNotifikacije([]);
    setNeprocitane(0);
  };

  const ovajMesec = termini.filter(t => {
    if (!t.kreirano) return false;
    const datum = t.kreirano.toDate ? t.kreirano.toDate() : new Date(t.kreirano);
    const sad = new Date();
    return datum.getMonth() === sad.getMonth() && datum.getFullYear() === sad.getFullYear();
  });

  const procenjeniPrihod = ovajMesec.length * 800;
  const filtrirani = selectedDan ? termini.filter(t => t.dan === selectedDan) : termini;
  const days = t.days;

  // Termini zakazani u poslednjih sat vremena = "novi"
  const noviIds = termini
    .filter(t => {
      if (!t.kreirano) return false;
      const datum = t.kreirano.toDate ? t.kreirano.toDate() : new Date(t.kreirano);
      return (new Date() - datum) < 3600000;
    })
    .map(t => t.id);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 80 }}>

      {/* NOTIFICATION PANEL */}
      {showNotif && (
        <NotificationPanel
          notifikacije={notifikacije}
          onClose={() => setShowNotif(false)}
          onClearAll={handleClearAll}
          theme={theme}
        />
      )}

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <User size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')} />
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t.kontrolnaTabla}</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

            {/* ZVONO */}
            <div onClick={handleOpenNotif} style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={22} color="white" />
              {neprocitane > 0 && (
                <div style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#ef4444', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold', color: 'white', border: '2px solid #2563eb' }}>
                  {neprocitane > 9 ? '9+' : neprocitane}
                </div>
              )}
            </div>

            <Settings size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/setup')} />
            <LogOut size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          </div>
        </div>

        {/* Statistike */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Calendar size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{ovajMesec.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>{t.ovajMesec}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <TrendingUp size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 16, margin: 0 }}>{procenjeniPrihod.toLocaleString()}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>{t.rsdPrihod}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <CheckCircle size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{termini.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>{t.ukupno}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* Kalendar filter */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.terminiPoDanima}</h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <div onClick={() => setSelectedDan(null)}
              style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                backgroundColor: selectedDan === null ? '#2563eb' : theme.border,
                color: selectedDan === null ? 'white' : theme.text }}>
              <div style={{ fontSize: 13, fontWeight: 'bold' }}>{t.svi}</div>
              <div style={{ fontSize: 11 }}>{termini.length}</div>
            </div>
            {days.map(dan => {
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
            <p style={{ textAlign: 'center', color: theme.subtext }}>{t.ucitavanje}</p>
          ) : termini.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>✂️</div>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>{t.nemaNista}</h3>
              <p style={{ color: theme.subtext, fontSize: 14, marginBottom: 24 }}>{t.nemaNistaOpis}</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: theme.text }}>
                {selectedDan ? `${t.terminiZa} ${selectedDan}` : t.sviTermini}
              </h3>
              <p style={{ fontSize: 13, color: theme.subtext, marginBottom: 14 }}>{filtrirani.length} {t.terminA}</p>
              {filtrirani.map(a => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onOtkazi={onOtkazi}
                  isNov={noviIds.includes(a.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <BottomNav user={user} />
    </div>
  );
}

export default Dashboard;