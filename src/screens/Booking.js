import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';

const days = ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'];
const dates = [14, 15, 16, 17, 18, 19, 20];
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];

function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedUsluga, setSelectedUsluga] = useState(null);
  const [usluge, setUsluge] = useState([]);
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsluge = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'frizeri', id));
        if (docSnap.exists() && docSnap.data().usluge) {
          setUsluge(docSnap.data().usluge);
        } else {
          setUsluge([
            { naziv: 'Muško šišanje', cena: 800, trajanje: 30 },
            { naziv: 'Sređivanje brade', cena: 500, trajanje: 20 },
            { naziv: 'Šišanje & Brada', cena: 1200, trajanje: 45 },
          ]);
        }
      } catch {
        setUsluge([
          { naziv: 'Muško šišanje', cena: 800, trajanje: 30 },
          { naziv: 'Sređivanje brade', cena: 500, trajanje: 20 },
          { naziv: 'Šišanje & Brada', cena: 1200, trajanje: 45 },
        ]);
      }
    };
    fetchUsluge();
  }, [id]);

  const handleConfirm = async () => {
    if (!selectedTime || !selectedUsluga || !ime || !telefon || !email) {
      alert('Molimo popunite sva polja, izaberite uslugu i termin.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'termini'), {
        salonId: id, ime, telefon, email,
        dan: days[selectedDay],
        datum: dates[selectedDay],
        vreme: selectedTime,
        usluga: selectedUsluga.naziv,
        cena: selectedUsluga.cena,
        trajanje: selectedUsluga.trajanje,
        kreirano: new Date()
      });

      const docSnap = await getDoc(doc(db, 'frizeri', id));
      if (docSnap.exists()) {
        const frizerEmail = docSnap.data().email;
        const salonNaziv = docSnap.data().salonNaziv;

        await emailjs.send('service_kgg93x5', 'template_ih73t6h', {
          email: frizerEmail,
          salon_naziv: salonNaziv,
          klijent_ime: ime,
          klijent_telefon: telefon,
          usluga: selectedUsluga.naziv,
          dan: days[selectedDay],
          datum: dates[selectedDay],
          vreme: selectedTime,
          cena: selectedUsluga.cena,
        }, 'GxX0uBmT-h8_iDTQl');

        await emailjs.send('service_kgg93x5', 'template_89v0p0k', {
          email: email,
          salon_naziv: salonNaziv,
          klijent_ime: ime,
          usluga: selectedUsluga.naziv,
          dan: days[selectedDay],
          datum: dates[selectedDay],
          vreme: selectedTime,
          cena: selectedUsluga.cena,
        }, 'GxX0uBmT-h8_iDTQl');
      }

      setConfirmed(true);
    } catch (error) {
      console.log(error);
      alert('Greška pri zakazivanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', padding: 40, textAlign: 'center', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 70, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1e293b' }}>Termin zakazan!</h2>
        <div style={{ backgroundColor: 'white', borderRadius: 14, padding: 20, marginBottom: 24, width: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: 15, color: '#334155', margin: '0 0 8px' }}>✂️ <strong>{selectedUsluga.naziv}</strong></p>
          <p style={{ fontSize: 15, color: '#334155', margin: '0 0 8px' }}>🕐 {selectedTime}h · {days[selectedDay]} {dates[selectedDay]}</p>
          <p style={{ fontSize: 15, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>💰 {selectedUsluga.cena} RSD</p>
        </div>
        <button onClick={() => navigate('/')}
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
          Nazad na početak
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>Zakaži Termin</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: '#1e293b' }}>Izaberi uslugu</h3>
          {usluge.map((usluga, i) => (
            <div key={i} onClick={() => setSelectedUsluga(usluga)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, marginBottom: 8, cursor: 'pointer', border: '2px solid', borderColor: selectedUsluga?.naziv === usluga.naziv ? '#2563eb' : '#f1f5f9', backgroundColor: selectedUsluga?.naziv === usluga.naziv ? '#eff6ff' : 'white' }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0, color: '#1e293b' }}>{usluga.naziv}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Clock size={11} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{usluga.trajanje} min</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: 15 }}>{usluga.cena} RSD</span>
            </div>
          ))}
        </div>

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
          <input placeholder="Email adresa" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
          <input placeholder="Broj telefona" value={telefon} onChange={e => setTelefon(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 400, padding: '12px 20px', backgroundColor: 'white', borderTop: '1px solid #f1f5f9', boxSizing: 'border-box' }}>
        {selectedUsluga && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: '0 0 8px' }}>
            {selectedUsluga.naziv} · {selectedUsluga.cena} RSD · {selectedUsluga.trajanje} min
          </p>
        )}
        <button onClick={handleConfirm} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {loading ? 'Čekajte...' : 'Potvrdi Termin →'}
        </button>
      </div>
    </div>
  );
}

export default Booking;