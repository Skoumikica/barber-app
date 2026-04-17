import React from 'react';
import { ArrowLeft, MapPin, Phone, Star, Clock, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const salons = [
  { id: '1', name: 'Style Cut', address: 'Kralja Petra 5, Beograd', phone: '064 111 2222', rating: 4.8, reviews: 124, bookings: 50, badge: 'Top salon', img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80', services: [{ name: 'Muško šišanje', price: 800, duration: '30 min' }, { name: 'Sređivanje brade', price: 500, duration: '20 min' }, { name: 'Šišanje & Brada', price: 1200, duration: '45 min' }] },
  { id: '2', name: 'Urban Barber', address: 'Kralja Prire 12, Beograd', phone: '064 123 4567', rating: 4.7, reviews: 98, bookings: 80, badge: 'Popularno', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', services: [{ name: 'Muško šišanje', price: 1000, duration: '30 min' }, { name: 'Sređivanje brade', price: 600, duration: '20 min' }, { name: 'Šišanje & Brada', price: 1400, duration: '45 min' }] },
  { id: '3', name: 'Glamour Studio', address: 'Terazije 3, Beograd', phone: '063 999 8888', rating: 4.9, reviews: 210, bookings: 120, badge: '⭐ Broj 1', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80', services: [{ name: 'Muško šišanje', price: 1200, duration: '30 min' }, { name: 'Sređivanje brade', price: 700, duration: '20 min' }, { name: 'Šišanje & Brada', price: 1700, duration: '45 min' }] },
  { id: '4', name: 'Classic Barbers', address: 'Nemanjina 8, Beograd', phone: '061 555 4444', rating: 4.6, reviews: 76, bookings: 45, badge: 'Provereno', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80', services: [{ name: 'Muško šišanje', price: 700, duration: '30 min' }, { name: 'Sređivanje brade', price: 400, duration: '20 min' }, { name: 'Šišanje & Brada', price: 900, duration: '45 min' }] },
];

function SalonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const salon = salons.find(s => s.id === id);

  if (!salon) return <p style={{ padding: 20 }}>Salon nije pronađen.</p>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 90 }}>

      <div style={{ position: 'relative', height: 220 }}>
        <img src={salon.img} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4))' }} />
        <ArrowLeft size={22} color="white" style={{ position: 'absolute', top: 16, left: 16, cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: 6, width: 34, height: 34, boxSizing: 'border-box' }} onClick={() => navigate(-1)} />
        <div style={{ position: 'absolute', top: 16, right: 16, backgroundColor: '#2563eb', borderRadius: 20, padding: '4px 12px' }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{salon.badge}</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1e293b' }}>{salon.name}</h2>

          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 'bold', color: '#1e293b' }}>{salon.rating}</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>({salon.reviews} recenzija)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={14} color="#2563eb" />
              <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>{salon.bookings}+ rezervacija</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MapPin size={15} color="#2563eb" />
            <span style={{ fontSize: 14, color: '#555' }}>{salon.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={15} color="#2563eb" />
            <span style={{ fontSize: 14, color: '#555' }}>{salon.phone}</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 14, color: '#1e293b' }}>Usluge</h3>
          {salon.services.map((service, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: index < salon.services.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div>
                <p style={{ fontSize: 15, color: '#334155', margin: 0, marginBottom: 2 }}>{service.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{service.duration}</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 15, color: '#1e293b' }}>{service.price} RSD</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 400, padding: '12px 20px', backgroundColor: 'white', borderTop: '1px solid #f1f5f9', boxSizing: 'border-box' }}>
        <button
          onClick={() => navigate(`/booking/${id}`)}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          Zakaži odmah →
        </button>
      </div>
    </div>
  );
}

export default SalonDetail;