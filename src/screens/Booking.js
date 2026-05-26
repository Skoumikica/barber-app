import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Scissors } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import { useTheme } from '../ThemeContext';
import { BottomNav } from './Home';

const dates = [14, 15, 16, 17, 18, 19, 20];
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const { t } = theme;
  const days = t.days;
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedUsluga, setSelectedUsluga] = useState(null);
  const [usluge, setUsluge] = useState([]);
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

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
      alert(t.upozorenje); return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'termini'), {
        salonId: id, ime, telefon, email,
        dan: days[selectedDay], datum: dates[selectedDay],
        vreme: selectedTime, usluga: selectedUsluga.naziv,
        cena: selectedUsluga.cena, trajanje: selectedUsluga.trajanje,
        kreirano: new Date()
      });
      const docSnap = await getDoc(doc(db, 'frizeri', id));
      if (docSnap.exists()) {
        const frizerEmail = docSnap.data().email;
        const salonNaziv = docSnap.data().salonNaziv;
        await emailjs.send('service_kgg93x5', 'template_ih73t6h', {
          email: frizerEmail, salon_naziv: salonNaziv, klijent_ime: ime,
          klijent_telefon: telefon, usluga: selectedUsluga.naziv,
          dan: days[selectedDay], datum: dates[selectedDay],
          vreme: selectedTime, cena: selectedUsluga.cena,
        }, 'GxX0uBmT-h8_iDTQl');
        await emailjs.send('service_kgg93x5', 'template_89v0p0k', {
          email: email, salon_naziv: salonNaziv, klijent_ime: ime,
          usluga: selectedUsluga.naziv, dan: days[selectedDay],
          datum: dates[selectedDay], vreme: selectedTime, cena: selectedUsluga.cena,
        }, 'GxX0uBmT-h8_iDTQl');
      }
      setConfirmed(true);
    } catch (error) {
      console.log(error);
      alert('Greška pri zakazivanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  // ── EKRAN POTVRDE ──
  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>✅</div>
          <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 12, color: theme.text }}>{t.terminZakazan}</h2>
          <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 28, marginBottom: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: 16, color: theme.text, margin: '0 0 10px' }}>✂️ <strong>{selectedUsluga.naziv}</strong></p>
            <p style={{ fontSize: 16, color: theme.text, margin: '0 0 10px' }}>🕐 {selectedTime}h · {days[selectedDay]} {dates[selectedDay]}</p>
            <p style={{ fontSize: 18, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>💰 {selectedUsluga.cena} RSD</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')}
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
              {t.nazadNaPocetak}
            </button>
            <button onClick={() => navigate(`/recenzija/${id}`)}
              style={{ background: 'none', color: '#2563eb', border: '2px solid #2563eb', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
              {t.ostaviRecenziju}
            </button>
          </div>
        </div>
        <BottomNav user={user} />
      </div>
    );
  }

  // ── DESKTOP LAYOUT ──
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="white" />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>BarberApp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'transparent', color: theme.subtext, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 14 }}>
                <ArrowLeft size={16} /> {t.nazad}
              </button>
              <div onClick={theme.toggleJezik} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: theme.text }}>
                {theme.jezik === 'sr' ? '🇬🇧 EN' : '🇷🇸 SR'}
              </div>
              <div onClick={theme.toggle} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
                {theme.darkMode ? '☀️' : '🌙'}
              </div>
            </div>
          </div>
        </nav>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '40px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontSize: 32, fontWeight: 'bold', color: 'white', margin: 0 }}>{t.zakaziTermin}</h1>
            <p style={{ color: '#93c5fd', fontSize: 16, marginTop: 8 }}>
              {theme.jezik === 'sr' ? 'Izaberi uslugu, dan i vreme.' : 'Choose a service, day and time.'}
            </p>
          </div>
        </div>

        {/* SADRZAJ — 2 kolone */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>

          {/* LEVA KOLONA */}
          <div>

            {/* USLUGE */}
            <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.izaberiUslugu}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {usluge.map((usluga, i) => (
                  <div key={i} onClick={() => setSelectedUsluga(usluga)}
                    style={{ padding: '16px', borderRadius: 12, cursor: 'pointer', border: '2px solid', borderColor: selectedUsluga?.naziv === usluga.naziv ? '#2563eb' : theme.border, backgroundColor: selectedUsluga?.naziv === usluga.naziv ? '#eff6ff' : theme.bg, transition: 'all 0.15s' }}>
                    <p style={{ fontWeight: 'bold', fontSize: 15, margin: '0 0 6px', color: theme.text }}>{usluga.naziv}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="#94a3b8" />
                        <span style={{ fontSize: 13, color: theme.subtext }}>{usluga.trajanje} {t.min}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: 15 }}>{usluga.cena} RSD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DAN */}
            <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.izaberiDan}</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {days.map((day, i) => (
                  <div key={i} onClick={() => setSelectedDay(i)}
                    style={{ textAlign: 'center', cursor: 'pointer', padding: '12px 16px', borderRadius: 12, flex: 1,
                      backgroundColor: selectedDay === i ? '#2563eb' : theme.bg,
                      border: `2px solid ${selectedDay === i ? '#2563eb' : theme.border}`,
                      color: selectedDay === i ? 'white' : theme.text, transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>{day}</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>{dates[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VREME */}
            <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.izaberiVreme}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                {timeSlots.map((time, i) => (
                  <button key={i} onClick={() => setSelectedTime(time)}
                    style={{ padding: '12px 8px', borderRadius: 10, border: `2px solid ${selectedTime === time ? '#2563eb' : theme.border}`, cursor: 'pointer', fontWeight: 'bold',
                      backgroundColor: selectedTime === time ? '#2563eb' : theme.bg,
                      color: selectedTime === time ? 'white' : theme.text, fontSize: 14, transition: 'all 0.15s' }}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DESNA KOLONA — sticky summary + forma */}
          <div>
            <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 20 }}>{t.vasiPodaci}</h3>

              {/* Summary */}
              {selectedUsluga && (
                <div style={{ backgroundColor: theme.darkMode ? '#1e3a8a22' : '#eff6ff', borderRadius: 12, padding: '14px 16px', marginBottom: 20, border: '1px solid #bfdbfe' }}>
                  <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold', margin: '0 0 6px' }}>
                    {theme.jezik === 'sr' ? 'Izabrano:' : 'Selected:'}
                  </p>
                  <p style={{ fontSize: 14, color: theme.text, margin: '0 0 4px' }}>✂️ {selectedUsluga.naziv}</p>
                  {selectedTime && <p style={{ fontSize: 14, color: theme.text, margin: '0 0 4px' }}>🕐 {selectedTime} · {days[selectedDay]} {dates[selectedDay]}</p>}
                  <p style={{ fontSize: 15, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>💰 {selectedUsluga.cena} RSD</p>
                </div>
              )}

              <input placeholder={t.imePrezime} value={ime} onChange={e => setIme(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
              <input placeholder={t.emailAdresa} value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
              <input placeholder={t.brojTelefona} value={telefon} onChange={e => setTelefon(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, marginBottom: 20, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />

              <button onClick={handleConfirm} disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '16px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', opacity: loading ? 0.7 : 1 }}>
                {loading ? t.cekajte : t.potvrdiTermin}
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: theme.subtext, marginTop: 12 }}>
                ✓ {theme.jezik === 'sr' ? 'Besplatno otkazivanje' : 'Free cancellation'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILNI ──
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 160 }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>{t.zakaziTermin}</h2>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.izaberiUslugu}</h3>
          {usluge.map((usluga, i) => (
            <div key={i} onClick={() => setSelectedUsluga(usluga)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, marginBottom: 8, cursor: 'pointer', border: '2px solid', borderColor: selectedUsluga?.naziv === usluga.naziv ? '#2563eb' : theme.border, backgroundColor: selectedUsluga?.naziv === usluga.naziv ? '#eff6ff' : theme.bg }}>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: 14, margin: 0, color: theme.text }}>{usluga.naziv}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Clock size={11} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: theme.subtext }}>{usluga.trajanje} {t.min}</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: 15 }}>{usluga.cena} RSD</span>
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.izaberiDan}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {days.map((day, i) => (
              <div key={i} onClick={() => setSelectedDay(i)}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '8px 6px', borderRadius: 10, width: 40, backgroundColor: selectedDay === i ? '#2563eb' : theme.border, color: selectedDay === i ? 'white' : theme.text }}>
                <div style={{ fontSize: 11 }}>{day}</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>{dates[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.izaberiVreme}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {timeSlots.map((time, i) => (
              <button key={i} onClick={() => setSelectedTime(time)}
                style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: selectedTime === time ? '#2563eb' : theme.border, color: selectedTime === time ? 'white' : theme.text, fontSize: 14 }}>
                {time}
              </button>
            ))}
          </div>
        </div>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.vasiPodaci}</h3>
          <input placeholder={t.imePrezime} value={ime} onChange={e => setIme(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 10, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
          <input placeholder={t.emailAdresa} value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, marginBottom: 10, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
          <input placeholder={t.brojTelefona} value={telefon} onChange={e => setTelefon(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 15, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, padding: '10px 20px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, boxSizing: 'border-box', zIndex: 999 }}>
        {selectedUsluga && <p style={{ textAlign: 'center', fontSize: 13, color: theme.subtext, margin: '0 0 8px' }}>{selectedUsluga.naziv} · {selectedUsluga.cena} RSD · {selectedUsluga.trajanje} {t.min}</p>}
        <button onClick={handleConfirm} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? t.cekajte : t.potvrdiTermin}
        </button>
      </div>
      <BottomNav user={user} />
    </div>
  );
}

export default Booking;