import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Scissors, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../ThemeContext';
import { BottomNav } from './Home';

const salonsStatic = [
  { id: '1', name: 'Style Cut', rating: 4.8, price: 800, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: '2', name: 'Urban Barber', rating: 4.7, price: 1000, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: '3', name: 'Glamour Studio', rating: 4.9, price: 1200, img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80' },
  { id: '4', name: 'Classic Barbers', rating: 4.6, price: 700, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80' },
];

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function SalonList() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = theme;
  const width = useWindowWidth();
  const isDesktop = width >= 768;
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get('q') || '');
  const [frizeri, setFrizeri] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFrizeri = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'frizeri'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().salonNaziv,
          rating: 5.0,
          price: doc.data().usluge?.[0]?.cena || 800,
          img: doc.data().slikaUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
          isReal: true,
        }));
        setFrizeri(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFrizeri();
  }, []);

  const sviSaloni = [...salonsStatic, ...frizeri];
  const filtrirani = sviSaloni.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── DESKTOP LAYOUT ──
  if (isDesktop) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>

        {/* DESKTOP NAVBAR */}
        <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scissors size={20} color="white" />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>BarberApp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <span onClick={() => navigate('/')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{t.pocetak}</span>
              <span onClick={() => navigate('/salons')} style={{ fontSize: 15, fontWeight: '600', color: '#2563eb', cursor: 'pointer' }}>{t.saloni}</span>
              <span onClick={() => navigate('/landing')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{theme.jezik === 'sr' ? 'Za frizere' : 'For barbers'}</span>
            </div>
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

        {/* HERO SEARCH */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '48px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>{t.pronajdiSalon}</h1>
            <p style={{ color: '#93c5fd', fontSize: 16, marginBottom: 28 }}>
              {theme.jezik === 'sr' ? `${filtrirani.length} salona pronađeno` : `${filtrirani.length} salons found`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 14, padding: '14px 20px', gap: 12, maxWidth: 600 }}>
              <Search size={20} color="#94a3b8" />
              <input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: 16, color: '#333', backgroundColor: 'transparent' }} />
              {search && (
                <span onClick={() => setSearch('')} style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>✕</span>
              )}
            </div>
          </div>
        </div>

        {/* GRID SALONA */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
          {filtrirani.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 22, color: theme.text, marginBottom: 8 }}>{t.nemaRezultata} "{search}"</h3>
              <p style={{ color: theme.subtext }}>
                {theme.jezik === 'sr' ? 'Pokušaj sa drugim pojmom.' : 'Try a different search term.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {filtrirani.map(salon => (
                <div key={salon.id}
                  onClick={() => navigate(`/salon/${salon.id}`)}
                  style={{ backgroundColor: theme.card, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}>

                  {/* Slika */}
                  <div style={{ position: 'relative' }}>
                    <img src={salon.img} alt={salon.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                      {salon.isReal && (
                        <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 20 }}>✓ {theme.jezik === 'sr' ? 'Verifikovan' : 'Verified'}</span>
                      )}
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{salon.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, margin: '0 0 8px' }}>{salon.name}</h3>
                    <p style={{ fontSize: 14, color: '#2563eb', fontWeight: 'bold', margin: '0 0 16px' }}>
                      {t.od} {salon.price} RSD
                    </p>
                    <button
                      style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                      {t.pogledaj} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer style={{ backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, padding: '32px', textAlign: 'center', marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
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
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => navigate('/')} />
          <h2 style={{ fontSize: 20, fontWeight: 'bold', color: 'white', margin: 0 }}>{t.pronajdiSalon}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, padding: '10px 14px', gap: 8 }}>
          <Search size={18} color="#94a3b8" />
          <input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 15, backgroundColor: 'transparent', color: theme.inputText }} />
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtrirani.length === 0 ? (
          <p style={{ textAlign: 'center', color: theme.subtext, marginTop: 20 }}>{t.nemaRezultata} "{search}"</p>
        ) : (
          filtrirani.map(salon => (
            <div key={salon.id} onClick={() => navigate(`/salon/${salon.id}`)}
              style={{ backgroundColor: theme.card, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex' }}>
              <img src={salon.img} alt={salon.name} style={{ width: 110, height: 100, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: '12px 10px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: 'bold', fontSize: 15, color: theme.text, margin: 0 }}>{salon.name}</p>
                  {salon.isReal && (
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 'bold', padding: '2px 6px', borderRadius: 20, whiteSpace: 'nowrap' }}>✓ Verifikovan</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 13, color: theme.subtext }}>{salon.rating}</span>
                </div>
                <p style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold', margin: 0 }}>{t.od} {salon.price} RSD</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 10px', flexShrink: 0 }}>
                <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  {t.pogledaj}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav user={user} />
    </div>
  );
}

export default SalonList;