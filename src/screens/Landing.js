import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Calendar, TrendingUp, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;
  const sr = theme.jezik === 'sr';
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  const features = sr ? [
    { ikona: <Calendar size={28} color="#2563eb" />, naslov: 'Online zakazivanje 24/7', opis: 'Klijenti zakazuju kad god hoće, čak i u 2 ujutru. Nema više propuštenih poziva.' },
    { ikona: <TrendingUp size={28} color="#2563eb" />, naslov: 'Prati svoj prihod', opis: 'Vidi koliko zarađuješ ovaj mesec u realnom vremenu na pregledenoj kontrolnoj tabli.' },
    { ikona: <Clock size={28} color="#2563eb" />, naslov: 'Uštedi vreme', opis: 'Nema više poziva i poruka. Sve je automatizovano — fokusiraj se na posao.' },
    { ikona: <Star size={28} color="#2563eb" />, naslov: 'Izgleda profesionalno', opis: 'Tvoji klijenti dobijaju moderno iskustvo zakazivanja koje gradi poverenje.' },
  ] : [
    { ikona: <Calendar size={28} color="#2563eb" />, naslov: 'Online booking 24/7', opis: 'Clients book whenever they want, even at 2am. No more missed calls.' },
    { ikona: <TrendingUp size={28} color="#2563eb" />, naslov: 'Track your income', opis: 'See how much you earn this month in real time on a clean dashboard.' },
    { ikona: <Clock size={28} color="#2563eb" />, naslov: 'Save time', opis: 'No more calls and messages. Everything is automated — focus on your work.' },
    { ikona: <Star size={28} color="#2563eb" />, naslov: 'Look professional', opis: 'Your clients get a modern booking experience that builds trust.' },
  ];

  const planFeatures = sr
    ? ['Neograničene rezervacije', 'Kontrolna tabla', 'Statistike prihoda', 'Email notifikacije', 'Upload slike salona', 'Podrška 24/7']
    : ['Unlimited bookings', 'Dashboard', 'Income statistics', 'Email notifications', 'Salon photo upload', '24/7 Support'];

  const stats = sr
    ? [{ broj: '500+', tekst: 'Frizera' }, { broj: '10k+', tekst: 'Rezervacija' }, { broj: '4.9★', tekst: 'Prosečna ocena' }]
    : [{ broj: '500+', tekst: 'Barbers' }, { broj: '10k+', tekst: 'Bookings' }, { broj: '4.9★', tekst: 'Avg rating' }];

  // ── DESKTOP ──
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>

        {/* NAVBAR */}
        <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="white" />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>BarberApp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <span onClick={() => navigate('/')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer' }}>{t.pocetak}</span>
              <span onClick={() => navigate('/salons')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer' }}>{t.saloni}</span>
              <span style={{ fontSize: 15, color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>{sr ? 'Za frizere' : 'For barbers'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={theme.toggleJezik} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: theme.text }}>
                {theme.jezik === 'sr' ? '🇬🇧 EN' : '🇷🇸 SR'}
              </div>
              <div onClick={theme.toggle} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
                {theme.darkMode ? '☀️' : '🌙'}
              </div>
              <button onClick={() => navigate('/login')} style={{ backgroundColor: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: 10, padding: '8px 20px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {t.prijava}
              </button>
              <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {sr ? 'Počni besplatno' : 'Start for free'}
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)', padding: '100px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 18px', marginBottom: 28 }}>
              <span style={{ color: '#93c5fd', fontSize: 14, fontWeight: 'bold' }}>💈 {sr ? 'Platforma #1 za frizere u Srbiji' : 'The #1 platform for barbers'}</span>
            </div>
            <h1 style={{ fontSize: 60, fontWeight: '800', color: 'white', lineHeight: 1.1, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
              {sr ? 'Ne moraš više da se javljaš na telefon 📵' : "No more answering the phone 📵"}
            </h1>
            <p style={{ fontSize: 20, color: '#bfdbfe', marginBottom: 48, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 48px' }}>
              {sr ? 'Klijenti zakazuju online. Ti samo radiš. Jednostavno i besplatno.' : 'Clients book online. You just work. Simple and free.'}
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 60 }}>
              <button onClick={() => navigate('/register')}
                style={{ backgroundColor: 'white', color: '#1e3a8a', padding: '16px 40px', borderRadius: 12, border: 'none', fontSize: 18, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {sr ? 'Počni besplatno' : 'Start for free'} <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/')}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)', fontSize: 18, fontWeight: 'bold', cursor: 'pointer' }}>
                {sr ? 'Vidi demo' : 'See demo'}
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 36, fontWeight: 'bold', color: 'white', margin: 0 }}>{s.broj}</p>
                  <p style={{ fontSize: 14, color: '#93c5fd', margin: 0 }}>{s.tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 40, fontWeight: 'bold', color: theme.text, margin: '0 0 12px' }}>
              {sr ? 'Zašto BarberApp?' : 'Why BarberApp?'}
            </h2>
            <p style={{ fontSize: 18, color: theme.subtext }}>
              {sr ? 'Sve što ti treba na jednom mestu.' : 'Everything you need in one place.'}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ backgroundColor: theme.card, borderRadius: 20, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', gap: 20 }}>
                <div style={{ backgroundColor: theme.darkMode ? '#1e3a8a44' : '#eff6ff', borderRadius: 14, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.ikona}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, margin: '0 0 8px' }}>{f.naslov}</h3>
                  <p style={{ fontSize: 15, color: theme.subtext, margin: 0, lineHeight: 1.6 }}>{f.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div style={{ backgroundColor: theme.darkMode ? '#0f172a' : '#f8fafc', padding: '80px 32px', borderTop: `1px solid ${theme.border}` }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 40, fontWeight: 'bold', color: theme.text, margin: '0 0 12px' }}>
              {sr ? 'Jednostavno cenovnik' : 'Simple pricing'}
            </h2>
            <p style={{ fontSize: 18, color: theme.subtext, marginBottom: 48 }}>
              {sr ? 'Bez skrivenih troškova.' : 'No hidden costs.'}
            </p>
            <div style={{ backgroundColor: '#1e3a8a', borderRadius: 24, padding: 48 }}>
              <p style={{ color: '#93c5fd', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, margin: '0 0 12px' }}>
                {sr ? 'STARTER PLAN' : 'STARTER PLAN'}
              </p>
              <p style={{ color: 'white', fontSize: 64, fontWeight: '800', margin: 0, lineHeight: 1 }}>
                {sr ? 'Besplatno' : 'Free'}
              </p>
              <p style={{ color: '#93c5fd', fontSize: 16, margin: '12px 0 36px' }}>
                {sr ? 'za prvih 30 dana' : 'for the first 30 days'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36, textAlign: 'left' }}>
                {planFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={18} color="#86efac" />
                    <span style={{ color: 'white', fontSize: 15 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')}
                style={{ width: '100%', backgroundColor: 'white', color: '#1e3a8a', padding: '16px', borderRadius: 12, border: 'none', fontSize: 18, fontWeight: 'bold', cursor: 'pointer' }}>
                {sr ? 'Registruj salon besplatno →' : 'Register salon for free →'}
              </button>
              <p style={{ color: '#93c5fd', fontSize: 13, marginTop: 16 }}>
                {sr ? 'Bez kreditne kartice. Otkaži kada hoćeš.' : 'No credit card. Cancel anytime.'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA BOTTOM */}
        <div style={{ backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, padding: '60px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 'bold', color: theme.text, margin: '0 0 16px' }}>
            {sr ? 'Spreman si?' : 'Ready to start?'}
          </h2>
          <p style={{ fontSize: 18, color: theme.subtext, marginBottom: 32 }}>
            {sr ? 'Pridruži se stotinama frizera koji već koriste BarberApp.' : 'Join hundreds of barbers already using BarberApp.'}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')}
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '16px 40px', borderRadius: 12, border: 'none', fontSize: 17, fontWeight: 'bold', cursor: 'pointer' }}>
              {sr ? 'Počni besplatno →' : 'Start for free →'}
            </button>
            <button onClick={() => navigate('/')}
              style={{ backgroundColor: 'transparent', color: '#2563eb', border: '2px solid #2563eb', padding: '16px 40px', borderRadius: 12, fontSize: 17, fontWeight: 'bold', cursor: 'pointer' }}>
              {sr ? 'Zakaži termin' : 'Book appointment'}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ backgroundColor: theme.darkMode ? '#0f172a' : '#1e293b', padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <Scissors size={18} color="#2563eb" />
            <span style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>BarberApp</span>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            © 2026 BarberApp · {sr ? 'Sva prava zadržana' : 'All rights reserved'}
          </p>
        </footer>
      </div>
    );
  }

  // ── MOBILNI (nepromenjen) ──
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
          style={{ backgroundColor: 'white', color: '#1e3a8a', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 12, width: '100%' }}>
          {sr ? 'Počni besplatno →' : 'Start for free →'}
        </button>
        <p style={{ color: '#93c5fd', fontSize: 13 }}>{sr ? 'Bez kreditne kartice · Besplatno za početak' : 'No credit card · Free to start'}</p>
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
        <h2 style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 16, textAlign: 'center' }}>{sr ? 'Zašto BarberApp?' : 'Why BarberApp?'}</h2>
        {features.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, backgroundColor: theme.card, borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.ikona}</div>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 15, color: theme.text, margin: 0, marginBottom: 4 }}>{p.naslov}</p>
              <p style={{ fontSize: 13, color: theme.subtext, margin: 0 }}>{p.opis}</p>
            </div>
          </div>
        ))}
        <div style={{ backgroundColor: '#1e3a8a', borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#93c5fd', fontSize: 13, margin: 0, marginBottom: 8 }}>{sr ? 'CENOVNIK' : 'PRICING'}</p>
          <p style={{ color: 'white', fontSize: 36, fontWeight: 'bold', margin: 0 }}>{sr ? 'Besplatno' : 'Free'}</p>
          <p style={{ color: '#93c5fd', fontSize: 14, marginBottom: 20 }}>{sr ? 'za prvih 30 dana' : 'for the first 30 days'}</p>
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
          <p style={{ fontSize: 13, color: theme.subtext }}>{sr ? 'Već imaš nalog?' : 'Already have an account?'}{' '}<span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{t.prijaviSeBtn}</span></p>
          <p style={{ fontSize: 13, color: theme.subtext, marginTop: 8 }}>{sr ? 'Si klijent?' : 'Are you a client?'}{' '}<span onClick={() => navigate('/')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>{sr ? 'Zakaži termin' : 'Book appointment'}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Landing;