import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const salons = [
  { id: 1, name: 'Style Cut', rating: 4.8, price: 800 },
  { id: 2, name: 'Urban Barber', rating: 4.7, price: 1000 },
  { id: 3, name: 'Glamour Studio', rating: 4.9, price: 1200 },
  { id: 4, name: 'Classic Barbers', rating: 4.6, price: 700 },
];

function SalonList() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <ArrowLeft size={22} style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => navigate('/')} />
        <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>Pronađi Salon</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
        <Search size={18} color="#999" />
        <input placeholder="Grad ili usluga..." style={{ border: 'none', outline: 'none', marginLeft: 8, width: '100%', fontSize: 15 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {salons.map(salon => (
          <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
            style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', display: 'flex' }}>
            <div style={{ backgroundColor: '#dbeafe', width: 110, minHeight: 90 }} />
            <div style={{ padding: 12 }}>
              <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{salon.name}</p>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>⭐ {salon.rating}</p>
              <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>od {salon.price} RSD</p>
            </div>
            <button style={{ marginLeft: 'auto', margin: 12, backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', alignSelf: 'center' }}>
              Pogledaj
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalonList;