import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Clock, User, Settings, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';

function AppointmentCard({ appointment }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', opacity: done ? 0.4 : 1 }}>
      <div style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <User size={20} color="#2563eb" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0, color: '#1e293b' }}>{appointment.ime}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Clock size={11} color="#94a3b8" />
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{appointment.vreme} · {appointment.dan} {appointment.datum}</span>
        </div>
      </div>
      <button onClick={() => setDone(!done)}
        style={{ backgroundColor: done ? '#86efac' : '#2563eb', color: done ? '#166534' : 'white', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
        {done ? '✓' : appointment.vreme}
      </button>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const zavrseni = termini.filter(t => t.done);
  const procenjeniPrihod = ovajMesec.length * 800;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Menu size={22} color="white" />
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
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 18, margin: 0 }}>{procenjeniPrihod.toLocaleString()}</p>
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
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Učitavanje termina...</p>
          ) : termini.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>✂️</div>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>Još nema termina</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Kad klijenti zakažu, termini će se pojaviti ovde u realnom vremenu.</p>
              <div style={{ backgroundColor: '#eff6ff', borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
                <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>💡 Savet</p>
                <p style={{ fontSize: 13, color: '#3b82f6', margin: '4px 0 0' }}>Podeli link aplikacije sa klijentima i počni da primaš rezervacije!</p>
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#1e293b' }}>Zakazani Termini</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>{termini.length} termin(a) ukupno</p>
              {termini.map(a => <AppointmentCard key={a.id} appointment={a} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;