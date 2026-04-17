import React from 'react';
import { Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const salons = [
  { id: 1, name: 'Style Cut', rating: 4.8, price: 800 },
  { id: 2, name: 'Urban Barber', rating: 4.7, price: 1000 },
  { id: 3, name: 'Glamour Studio', rating: 4.9, price: 1200 },
  { id: 4, name: 'Classic Barbers', rating: 4.6, price: 700 },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h1 style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
        Pronađi i zakaži <span style={{ color: '#2563eb' }}>frizera</span> u par klikova
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
        <Search size={18} color="#999" />
        <input placeholder="Grad ili usluga..." style={{ border: 'none', outline: 'none', marginLeft: 8, width: '100%', fontSize: 15 }} />
      </div>

      <button
        onClick={() => navigate('/salons')}
        style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer', marginBottom: 24 }}>
        Zakaži Odmah
      </button>

      <button
  onClick={() => navigate('/dashboard')}
  style={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', padding: '12px', borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer', marginBottom: 24 }}>
  Kontrolna Tabla (Frizer)
</button>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Popularni Saloni</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {salons.map(salon => (
          <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
            style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, cursor: 'pointer' }}>
            <div style={{ backgroundColor: '#dbeafe', height: 80, borderRadius: 8, marginBottom: 8 }} />
            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{salon.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 13 }}>{salon.rating} · {salon.price} RSD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;