import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const timeSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const dates = [14, 15, 16, 17, 18, 19, 20];

function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedTime, setSelectedTime] = useState(null);
  const [ime, setIme] = useState('');
  const [telefon, setTelefon] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedTime || !ime || !telefon) {
      alert('Molimo popunite sva polja i izaberite termin.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'termini'), {
        salonId: id,
        ime: ime,
        telefon: telefon,
        dan: days[selectedDay],
        datum: dates[selectedDay],
        vreme: selectedTime,
        kreirano: new Date()
      });
      setConfirmed(true);
    } catch (error) {
      alert('Greška pri zakazivanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Termin zakazan!</h2>
        <p style={{ color: '#555', marginBottom: 24 }}>Vidimo se u {selectedTime}h. Potvrda je poslata na vaš broj.</p>
        <button onClick={() => navigate('/')}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer' }}>
          Nazad na početak
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#dbeafe', height: 180, display: 'flex', alignItems: 'flex-start', padding: 16 }}>
        <ArrowLeft size={22} style={{ cursor: 'pointer', color: '#1e3a8a' }} onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Zakaži Termin</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {days.map((day, i) => (
            <div key={i} onClick={() => setSelectedDay(i)}
              style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 6px', borderRadius: 8,
                backgroundColor: selectedDay === i ? '#2563eb' : 'transparent',
                color: selectedDay === i ? 'white' : '#333' }}>
              <div style={{ fontSize: 12 }}>{day}</div>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>{dates[i]}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {timeSlots.map((time, i) => (
            <button key={i} onClick={() => setSelectedTime(time)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer',
                backgroundColor: selectedTime === time ? '#2563eb' : 'white',
                color: selectedTime === time ? 'white' : '#333', fontSize: 14 }}>
              {time}
            </button>
          ))}
        </div>

        <input placeholder="Ime" value={ime} onChange={e => setIme(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 10, boxSizing: 'border-box' }} />

        <input placeholder="Telefon" value={telefon} onChange={e => setTelefon(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, marginBottom: 20, boxSizing: 'border-box' }} />

        <button onClick={handleConfirm} disabled={loading}
          style={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', padding: '14px', borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer' }}>
          {loading ? 'Čekajte...' : 'Potvrdi Termin'}
        </button>
      </div>
    </div>
  );
}

export default Booking;