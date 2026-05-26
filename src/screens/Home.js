import React, { useEffect, useState } from 'react';
import { Search, Star, Scissors, LogIn, Home as HomeIcon, List, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../ThemeContext';

const salons = [
  { id: 1, name: 'Style Cut', rating: 4.8, price: 800, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: 2, name: 'Urban Barber', rating: 4.7, price: 1000, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: 3, name: 'Glamour Studio', rating: 4.9, price: 1200, img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: 4, name: 'Classic Barbers', rating: 4.6, price: 700, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
];

// Hook za pracenje sirine ekrana
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// =============================================
// BOTTOM NAVIGATION — samo mobilni
// =============================================
export function BottomNav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = theme;
  const width = useWindowWidth();

  if (width >= 768) return null;

  const items = [
    { label: t.pocetak, icon: <HomeIcon size={22} />, path: '/' },
    { label: t.saloni, icon: <List size={22} />, path: '/salons' },
    { label: user ? t.mojSalon : t.prijava, icon: <LayoutDashboard size={22} />, path: user ? '/dashboard' : '/login' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, backgroundColor: theme.card,
      borderTop: `1px solid ${theme.border}`, display: 'flex',
      justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 18px', zIndex: 1000, boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
    }}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div key={item.path} onClick={() => navigate(item.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', color: isActive ? '#2563eb' : '#94a3b8',
              fontWeight: isActive ? 'bold' : 'normal', fontSize: 11, minWidth: 64 }}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// =============================================
// HOME EKRAN
// =============================================
function Home() {
  const theme = useTheme();
  const { t } = theme;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // ── DESKTOP LAYOUT ──
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>

        {/* DESKTOP NAVBAR */}
        <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="white" />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>BarberApp</span>
            </div>

            {/* Nav linkovi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <span onClick={() => navigate('/')} style={{ fontSize: 15, fontWeight: '600', color: '#2563eb', cursor: 'pointer' }}>{t.pocetak}</span>
              <span onClick={() => navigate('/salons')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{t.saloni}</span>
              <span onClick={() => navigate('/landing')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{theme.jezik === 'sr' ? 'Za frizere' : 'For barbers'}</span>
            </div>

            {/* Desna strana */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={theme.toggleJezik}
                style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: theme.text }}>
                {theme.jezik === 'sr' ? '🇬🇧 EN' : '🇷🇸 SR'}
              </div>
              <div onClick={theme.toggle}
                style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
                {theme.darkMode ? '☀️' : '🌙'}
              </div>
              <button onClick={() => navigate(user ? '/dashboard' : '/login')}
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {user ? t.mojSalon : t.prijava}
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SEKCIJA */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)', padding: '80px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* Leva strana — tekst */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
                <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 'bold' }}>⭐ Platforma #1 za zakazivanje</span>
              </div>
              <h1 style={{ fontSize: 52, fontWeight: '800', color: 'white', lineHeight: 1.15, marginBottom: 20 }}>
                {t.pronajdi}<br />
                <span style={{ color: '#93c5fd' }}>{t.frizera}</span>
              </h1>
              <p style={{ fontSize: 18, color: '#bfdbfe', marginBottom: 36, lineHeight: 1.6 }}>
                {theme.jezik === 'sr'
                  ? 'Zakaži termin kod najboljeg frizera u tvom gradu za samo par klikova.'
                  : 'Book an appointment with the best barber in your city in just a few clicks.'}
              </p>

              {/* Search bar */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: '12px 18px', gap: 10 }}>
                  <Search size={20} color="#94a3b8" />
                  <input
                    placeholder={t.searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && search.trim() && navigate(`/salons?q=${search}`)}
                    style={{ border: 'none', outline: 'none', fontSize: 15, color: '#333', width: '100%', backgroundColor: 'transparent' }} />
                </div>
                <button onClick={() => navigate(search.trim() ? `/salons?q=${search}` : '/salons')}
                  style={{ background: 'white', color: '#1e3a8a', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t.zakaziOdmah}
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 32 }}>
                {[
                  { br: '500+', txt: theme.jezik === 'sr' ? 'Frizera' : 'Barbers' },
                  { br: '10k+', txt: theme.jezik === 'sr' ? 'Rezervacija' : 'Bookings' },
                  { br: '4.9★', txt: theme.jezik === 'sr' ? 'Prosečna ocena' : 'Avg rating' },
                ].map((s, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 24, fontWeight: 'bold', color: 'white', margin: 0 }}>{s.br}</p>
                    <p style={{ fontSize: 13, color: '#93c5fd', margin: 0 }}>{s.txt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desna strana — kartice salona */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {salons.map(salon => (
                <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={salon.img} alt={salon.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: 14, color: 'white', margin: '0 0 4px' }}>{salon.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 12, color: '#93c5fd' }}>{salon.rating}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 'bold' }}>{t.od} {salon.price} RSD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POPULARNI SALONI — desktop grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 'bold', color: theme.text, margin: 0 }}>{t.popularniSaloni}</h2>
            <button onClick={() => navigate('/salons')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'transparent', color: '#2563eb', border: '2px solid #2563eb', borderRadius: 10, padding: '8px 20px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
              {theme.jezik === 'sr' ? 'Vidi sve' : 'View all'} <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {salons.map(salon => (
              <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
                style={{ backgroundColor: theme.card, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}>
                <div style={{ position: 'relative' }}>
                  <img src={salon.img} alt={salon.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#2563eb', borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>Top</span>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: theme.text }}>{salon.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: 13, color: theme.subtext }}>{salon.rating}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>{t.od} {salon.price} RSD</span>
                  </div>
                  <button style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}>
                    {t.pogledaj}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER ZA FRIZERE */}
        {!user && (
          <div style={{ backgroundColor: theme.darkMode ? '#1e293b' : '#eff6ff', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 'bold', color: theme.text, margin: '0 0 8px' }}>{t.sifrizer}</h3>
                <p style={{ fontSize: 16, color: theme.subtext, margin: 0 }}>{t.registrujSalon}</p>
              </div>
              <button onClick={() => navigate('/register')}
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {theme.jezik === 'sr' ? 'Registruj salon →' : 'Register salon →'}
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Scissors size={18} color="#2563eb" />
            <span style={{ fontWeight: 'bold', color: theme.text, fontSize: 16 }}>BarberApp</span>
          </div>
          <p style={{ color: theme.subtext, fontSize: 13, margin: 0 }}>
            © 2026 BarberApp · {theme.jezik === 'sr' ? 'Sva prava zadržana' : 'All rights reserved'}
          </p>
        </footer>
      </div>
    );
  }

  // ── MOBILNI LAYOUT (nepromenjen) ──
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 80 }}>

      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '32px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scissors size={22} color="white" />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{t.appName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div onClick={theme.toggleJezik}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '7px 10px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: 'white', minWidth: 36, textAlign: 'center' }}>
              {theme.jezik === 'sr' ? 'EN' : 'SR'}
            </div>
            <div onClick={theme.toggle}
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '7px 10px', cursor: 'pointer', fontSize: 16 }}>
              {theme.darkMode ? '☀️' : '🌙'}
            </div>
            <div onClick={() => navigate(user ? '/dashboard' : '/login')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '7px 11px', cursor: 'pointer' }}>
              <LogIn size={15} color="white" />
              <span style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>{user ? t.salon : t.prijava}</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{t.pronajdi}</h1>
        <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#93c5fd', marginBottom: 12 }}>{t.frizera}</h1>

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: '10px 14px', gap: 8, marginBottom: 10 }}>
          <Search size={18} color="#94a3b8" />
          <input placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search.trim() && navigate(`/salons?q=${search}`)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, color: '#333' }} />
        </div>

        {search.trim() && (
          <button onClick={() => navigate(`/salons?q=${search}`)}
            style={{ width: '100%', backgroundColor: 'white', color: '#1e3a8a', padding: '10px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
            {t.pretrazi} "{search}"
          </button>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <button onClick={() => navigate('/salons')}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 24, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {t.zakaziOdmah}
        </button>

        {!user && (
          <div onClick={() => navigate('/register')}
            style={{ backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 12, padding: '14px 16px', marginBottom: 24, cursor: 'pointer', border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.darkMode ? 'white' : '#1e3a8a', margin: 0 }}>{t.sifrizer}</p>
              <p style={{ fontSize: 13, color: '#3b82f6', margin: '2px 0 0' }}>{t.registrujSalon}</p>
            </div>
            <span style={{ color: '#2563eb', fontSize: 20 }}>→</span>
          </div>
        )}

        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.popularniSaloni}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {salons.map(salon => (
            <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
              style={{ backgroundColor: theme.card, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={salon.img} alt={salon.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} />
              <div style={{ padding: '10px 10px 12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4, color: theme.text }}>{salon.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 12, color: theme.subtext }}>{salon.rating} · {salon.price} RSD</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav user={user} />
    </div>
  );
}

export default Home;