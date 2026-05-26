import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Calendar, TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;
  const sr = theme.jezik === 'sr';

  const features = sr ? [
    { ikona: <Calendar size={22} color="#2563eb" />, naslov: 'Online zakazivanje 24/7', opis: 'Klijenti zakazuju kad god hoće, čak i u 2 ujutru.' },
    { ikona: <TrendingUp size={22} color="#2563eb" />, naslov: 'Prati svoj prihod', opis: 'Vidi koliko zarađuješ ovaj mesec u realnom vremenu.' },
    { ikona: <Clock size={22} color="#2563eb" />, naslov: 'Uštedi vreme', opis: 'Nema više poziva i poruka. Sve je automatski.' },
    { ikona: <Star size={22} color="#2563eb" />, naslov: 'Izgleda profesionalno', opis: 'Tvoji klijenti dobijaju moderno iskustvo zakazivanja.' },
  ] : [
    { ikona: <Calendar size={22} color="#2563eb" />, naslov: 'Online booking 24/7', opis: 'Clients book whenever they want, even at 2am.' },
    { ikona: <TrendingUp size={22} color="#2563eb" />, naslov: 'Track your income', opis: 'See how much you earn this month in real time.' },
    { ikona: <Clock size={22} color="#2563eb" />, naslov: 'Save time', opis: 'No more calls and messages. Everything is automatic.' },
    { ikona: <Star size={22} color="#2563eb" />, naslov: 'Look professional', opis: 'Your clients get a modern booking experience.' },
  ];

  const stats = sr ? [
    { broj: '500+', tekst: 'Frizera' },
    { broj: '10k+', tekst: 'Rezervacija' },
    { broj: '4.9★', tekst: 'Ocena' },
  ] : [
    { broj: '500+', tekst: 'Barbers' },
    { broj: '10k+', tekst: 'Bookings' },
    { broj: '4.9★', tekst: 'Rating' },
  ];

  const planFeatures = sr
    ? ['Neograničene rezervacije', 'Kontrolna tabla', 'Statistike prihoda', 'Podrška 24/7']
    : ['Unlimited bookings', 'Dashboard', 'Income statistics', '24/7 Support'];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <Scissors size={28} color="white" />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 22 }}>BarberApp</span>
        </div>
        <h1 style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 12, lineHeight: 1.3 }}>
          {sr ? 'Ne moraš više da se javljaš na telefon 📵' : "No more answering the phone 📵"}
        </h1>
        <p style={{ color: '#93c5fd', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          {sr ? 'Klijenti zakazuju online. Ti samo radiš. Jednostavno.' : 'Clients book online. You just work. Simple.'}
        </p>
        <button onClick={() => navigate('/register')}
          style={{ backgroundColor: 'white', color: '#1e3a8a', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 12, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {sr ? 'Počni besplatno →' : 'Start for free →'}
        </button>
        <p style={{ color: '#93c5fd', fontSize: 13 }}>
          {sr ? 'Bez kreditne kartice · Besplatno za početak' : 'No credit card · Free to start'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, backgroundColor: theme.border }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: theme.card, padding: '16px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, margin: 0 }}>{s.broj}</p>
            <p style={{ fontSize: 12, color: theme.subtext, margin: 0 }}>{s.tekst}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 16, textAlign: 'center' }}>
          {sr ? 'Zašto BarberApp?' : 'Why BarberApp?'}
        </h2>

        {features.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, backgroundColor: theme.card, borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {p.ikona}
            </div>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 15, color: theme.text, margin: 0, marginBottom: 4 }}>{p.naslov}</p>
              <p style={{ fontSize: 13, color: theme.subtext, margin: 0 }}>{p.opis}</p>
            </div>
          </div>
        ))}

        <div style={{ backgroundColor: '#1e3a8a', borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#93c5fd', fontSize: 13, margin: 0, marginBottom: 8 }}>
            {sr ? 'CENOVNIK' : 'PRICING'}
          </p>
          <p style={{ color: 'white', fontSize: 36, fontWeight: 'bold', margin: 0 }}>
            {sr ? 'Besplatno' : 'Free'}
          </p>
          <p style={{ color: '#93c5fd', fontSize: 14, marginBottom: 20 }}>
            {sr ? 'za prvih 30 dana' : 'for the first 30 days'}
          </p>
          {planFeatures.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <CheckCircle size={16} color="#86efac" />
              <span style={{ color: 'white', fontSize: 14 }}>{s}</span>
            </div>
          ))}
          <button onClick={() => navigate('/register')}
            style={{ width: '100%', backgroundColor: 'white', color: '#1e3a8a', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginTop: 16 }}>
            {sr ? 'Registruj salon →' : 'Register salon →'}
          </button>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 20 }}>
          <p style={{ fontSize: 13, color: theme.subtext }}>
            {sr ? 'Već imaš nalog?' : 'Already have an account?'}{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>
              {t.prijaviSeBtn}
            </span>
          </p>
          <p style={{ fontSize: 13, color: theme.subtext, marginTop: 8 }}>
            {sr ? 'Si klijent?' : 'Are you a client?'}{' '}
            <span onClick={() => navigate('/')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>
              {sr ? 'Zakaži termin' : 'Book appointment'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;