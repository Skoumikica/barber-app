import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTheme } from '../ThemeContext';
import { LogOut, Trash2, Users, Calendar, TrendingUp } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [frizeri, setFrizeri] = useState([]);
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const frizeriSnap = await getDocs(collection(db, 'frizeri'));
        const frizeriData = frizeriSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        const terminiSnap = await getDocs(collection(db, 'termini'));
        const terminiData = terminiSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setFrizeri(frizeriData);
        setTermini(terminiData);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const obrisiFrizera = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog frizera?')) {
      await deleteDoc(doc(db, 'frizeri', id));
      setFrizeri(prev => prev.filter(f => f.id !== id));
    }
  };

  if (loading) return <p style={{ padding: 20, color: theme.text }}>Učitavanje...</p>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 'bold', margin: 0 }}>Admin Panel</h2>
          <LogOut size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Users size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{frizeri.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Frizera</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <Calendar size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{termini.length}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>Termina</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <TrendingUp size={16} color="#93c5fd" style={{ marginBottom: 4 }} />
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: 20, margin: 0 }}>{(termini.length * 800).toLocaleString()}</p>
            <p style={{ color: '#93c5fd', fontSize: 11, margin: 0 }}>RSD</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>
            Registrovani Frizeri ({frizeri.length})
          </h3>
          {frizeri.map(frizer => (
            <div key={frizer.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0, color: theme.text }}>{frizer.salonNaziv}</p>
                <p style={{ fontSize: 12, color: theme.subtext, margin: '2px 0 0' }}>{frizer.email}</p>
                <p style={{ fontSize: 12, color: theme.subtext, margin: '2px 0 0' }}>{frizer.adresa}</p>
                <p style={{ fontSize: 11, color: '#2563eb', margin: '2px 0 0' }}>
                  {termini.filter(t => t.salonId === frizer.id).length} termina
                </p>
              </div>
              {!frizer.isAdmin && (
                <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => obrisiFrizera(frizer.id)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;