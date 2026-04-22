import React, { useEffect, useState } from 'react';
import { Search, Star, Scissors, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../ThemeContext';

const salons = [
  { id: 1, name: 'Style Cut', rating: 4.8, price: 800, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: 2, name: 'Urban Barber', rating: 4.7, price: 1000, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: 3, name: 'Glamour Studio', rating: 4.9, price: 1200, img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: 4, name: 'Classic Barbers', rating: 4.6, price: 700, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
];

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '32px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scissors size={22} color="white" />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>BarberApp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div onClick={theme.toggle}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
              {theme.darkMode ? '☀️' : '🌙'}
            </div>
            <div onClick={() => navigate(user ? '/dashboard' : '/login')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 12px', cursor: 'pointer' }}>
              <LogIn size={15} color="white" />
              <span style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>{user ? 'Moj salon' : 'Frizer? Prijavi se'}</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
          Pronađi savršenog
        </h1>
        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#93c5fd', marginBottom: 20 }}>
          frizera 💈
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: '10px 14px', gap: 8 }}>
          <Search size={18} color="#94a3b8" />
          <input placeholder="Grad ili usluga..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, color: '#333' }} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <button
          onClick={() => navigate('/salons')}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 24, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          Zakaži Odmah →
        </button>

        {!user && (
          <div onClick={() => navigate('/register')}
            style={{ backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 12, padding: '14px 16px', marginBottom: 24, cursor: 'pointer', border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.darkMode ? 'white' : '#1e3a8a', margin: 0 }}>💈 Si frizer?</p>
              <p style={{ fontSize: 13, color: '#3b82f6', margin: '2px 0 0' }}>Registruj svoj salon besplatno</p>
            </div>
            <span style={{ color: '#2563eb', fontSize: 20 }}>→</span>
          </div>
        )}

        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>Popularni Saloni</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {salons.map(salon => (
            <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
              style={{ backgroundColor: theme.card, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={salon.img} alt={salon.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} />
              <div style={{ padding: '10px 10px 12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4, color: theme.text }}>{salon.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 12, color: theme.subtext }}>{salon.rating} · {salon.price} RSD</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;