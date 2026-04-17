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
        salonId: id, ime, telefon,
        dan: days[selectedDay], datum: dates[selectedDay],
        vreme: selectedTime, kreirano: new Date()
      });
      setConfirmed(true);
    } catch (error) {
      alert('Greška pri zakazivanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', padding: 40, textAlign: 'center', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 70, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1e293b' }}>Termin zakazan!</h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>Vidimo se u {selectedTime}h. Potvrda je poslata na vaš broj.</p>
        <button onClick={() => navigate('/')}
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
          Nazad na početak
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => navigate(-1)} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>Zakaži Termin</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: '#1e293b' }}>Izaberi dan</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {days.map((day, i) => (
              <div key={i} onClick={() => setSelectedDay(i)}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 6px', borderRadius: 10, width: 40,
                  backgroundColor: selectedDay === i ? '#2563eb' : '#f1f5f9',
                  color: selectedDay === i ? 'white' : '#333' }}>
                <div style={{ fontSize: 11 }}>{day}</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>{dates[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: '#1e293b' }}>Izaberi vreme</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {timeSlots.map((time, i) => (
              <button key={i} onClick={() => setSelectedTime(time)}
                style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 'bold',
                  backgroundColor: selectedTime === time ? '#2563eb' : '#f1f5f9',
                  color: selectedTime === time ? 'white' : '#334155', fontSize: 14 }}>
                {time}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: '#1e293b' }}>Vaši podaci</h3>
          <input placeholder="Ime i prezime" value={ime} onChange={e => setIme(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
          <input placeholder="Broj telefona" value={telefon} onChange={e => setTelefon(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
        </div>

        <button onClick={handleConfirm} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {loading ? 'Čekajte...' : 'Potvrdi Termin →'}
        </button>
      </div>
    </div>
  );
}

export default Booking;