import React, { useState, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function AppointmentCard({ appointment }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0', opacity: done ? 0.4 : 1 }}>
      <div style={{ backgroundColor: '#dbeafe', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: 16 }}>
        👤
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0 }}>{appointment.ime}</p>
        <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{appointment.vreme} · {appointment.dan} {appointment.datum}</p>
      </div>
      <button onClick={() => setDone(!done)}
        style={{ backgroundColor: done ? '#86efac' : '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>
        {done ? '✓ Gotovo' : appointment.vreme}
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

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu size={22} color="white" />
        <h2 style={{ color: 'white', fontSize: 18, fontWeight: 'bold', margin: 0 }}>Kontrolna Tabla</h2>
        <LogOut size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
      </div>

      <div style={{ padding: 20 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Učitavanje termina...</p>
        ) : termini.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Nema zakazanih termina.</p>
        ) : (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Zakazani Termini ({termini.length})</h3>
            {termini.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;