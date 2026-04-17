import React from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const salons = [
  { id: 1, name: 'Style Cut', rating: 4.8, price: 800, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: 2, name: 'Urban Barber', rating: 4.7, price: 1000, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: 3, name: 'Glamour Studio', rating: 4.9, price: 1200, img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: 4, name: 'Classic Barbers', rating: 4.6, price: 700, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
];

function SalonList() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => navigate('/')} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>Pronađi Salon</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: '10px 14px', gap: 8 }}>
          <Search size={18} color="#94a3b8" />
          <input placeholder="Grad ili usluga..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15 }} />
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {salons.map(salon => (
          <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
            style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex' }}>
            <img src={salon.img} alt={salon.name} style={{ width: 110, height: 100, objectFit: 'cover' }} />
            <div style={{ padding: '14px 12px', flex: 1 }}>
              <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: '#1e293b' }}>{salon.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Star size={13} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 13, color: '#64748b' }}>{salon.rating}</span>
              </div>
              <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>od {salon.price} RSD</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: 12 }}>
              <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                Pogledaj
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalonList;