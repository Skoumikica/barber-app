import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from '../ThemeContext';

const salonsStatic = [
  { id: '1', name: 'Style Cut', rating: 4.8, price: 800, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: '2', name: 'Urban Barber', rating: 4.7, price: 1000, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: '3', name: 'Glamour Studio', rating: 4.9, price: 1200, img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: '4', name: 'Classic Barbers', rating: 4.6, price: 700, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
];

function SalonList() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get('q') || '');
  const [frizeri, setFrizeri] = useState([]);

  useEffect(() => {
    const fetchFrizeri = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'frizeri'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().salonNaziv,
          rating: 5.0,
          price: doc.data().usluge?.[0]?.cena || 800,
          img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
          isReal: true,
        }));
        setFrizeri(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFrizeri();
  }, []);

  const sviSaloni = [...salonsStatic, ...frizeri];
  const filtrirani = sviSaloni.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => navigate('/')} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>Pronađi Salon</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, padding: '10px 14px', gap: 8 }}>
          <Search size={18} color="#94a3b8" />
          <input
            placeholder="Grad ili usluga..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, backgroundColor: theme.card, color: theme.inputText }} />
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtrirani.length === 0 ? (
          <p style={{ textAlign: 'center', color: theme.subtext, marginTop: 20 }}>Nema rezultata za "{search}"</p>
        ) : (
          filtrirani.map(salon => (
            <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
              style={{ backgroundColor: theme.card, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex' }}>
              <img src={salon.img} alt={salon.name} style={{ width: 110, height: 100, objectFit: 'cover' }} />
              <div style={{ padding: '14px 12px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <p style={{ fontWeight: 'bold', fontSize: 16, color: theme.text, margin: 0 }}>{salon.name}</p>
                  {salon.isReal && (
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 'bold', padding: '2px 6px', borderRadius: 20 }}>✓ Verifikovan</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 13, color: theme.subtext }}>{salon.rating}</span>
                </div>
                <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>od {salon.price} RSD</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: 12 }}>
                <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  Pogledaj
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SalonList;