import React from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const salons = [
  { id: '1', name: 'Style Cut', address: 'Kralja Petra 5, Beograd', phone: '064 111 2222', services: [{ name: 'Muško šišanje', price: 800 }, { name: 'Sređivanje brade', price: 500 }, { name: 'Šišanje & Brada', price: 1200 }] },
  { id: '2', name: 'Urban Barber', address: 'Kralja Prire 12, Beograd', phone: '064 123 4567', services: [{ name: 'Muško šišanje', price: 1000 }, { name: 'Sređivanje brade', price: 600 }, { name: 'Šišanje & Brada', price: 1400 }] },
  { id: '3', name: 'Glamour Studio', address: 'Terazije 3, Beograd', phone: '063 999 8888', services: [{ name: 'Muško šišanje', price: 1200 }, { name: 'Sređivanje brade', price: 700 }, { name: 'Šišanje & Brada', price: 1700 }] },
  { id: '4', name: 'Classic Barbers', address: 'Nemanjina 8, Beograd', phone: '061 555 4444', services: [{ name: 'Muško šišanje', price: 700 }, { name: 'Sređivanje brade', price: 400 }, { name: 'Šišanje & Brada', price: 900 }] },
];

function SalonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const salon = salons.find(s => s.id === id);

  if (!salon) return <p style={{ padding: 20 }}>Salon nije pronađen.</p>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#dbeafe', height: 200, display: 'flex', alignItems: 'flex-start', padding: 16 }}>
        <ArrowLeft size={22} style={{ cursor: 'pointer', color: '#1e3a8a' }} onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{salon.name}</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: '#555' }}>
          <MapPin size={16} color="#2563eb" />
          <span style={{ fontSize: 14 }}>{salon.address}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: '#555' }}>
          <Phone size={16} color="#2563eb" />
          <span style={{ fontSize: 14 }}>{salon.phone}</span>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
          {salon.services.map((service, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 15 }}>{service.name}</span>
              <span style={{ fontWeight: 'bold', fontSize: 15 }}>{service.price} RSD</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`/booking/${id}`)}
          style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
          Zakaži
        </button>
      </div>
    </div>
  );
}

export default SalonDetail;