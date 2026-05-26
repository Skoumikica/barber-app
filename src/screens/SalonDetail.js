import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Star, Clock, Award, Map, Scissors } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../ThemeContext';
import { BottomNav } from './Home';

const salonsStatic = [
  { id: '1', name: 'Style Cut', address: 'Kralja Petra 5, Beograd', phone: '064 111 2222', rating: 4.8, reviews: 124, bookings: 50, badge: 'Top salon', img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80' },
  { id: '2', name: 'Urban Barber', address: 'Kralja Prire 12, Beograd', phone: '064 123 4567', rating: 4.7, reviews: 98, bookings: 80, badge: 'Popularno', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80' },
  { id: '3', name: 'Glamour Studio', address: 'Terazije 3, Beograd', phone: '063 999 8888', rating: 4.9, reviews: 210, bookings: 120, badge: '⭐ Broj 1', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80' },
  { id: '4', name: 'Classic Barbers', address: 'Nemanjina 8, Beograd', phone: '061 555 4444', rating: 4.6, reviews: 76, bookings: 45, badge: 'Provereno', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80' },
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

function SalonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const { t } = theme;
  const sr = theme.jezik === 'sr';
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  const [salon, setSalon] = useState(null);
  const [usluge, setUsluge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recenzije, setRecenzije] = useState([]);
  const [user, setUser] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSalon = async () => {
      const staticSalon = salonsStatic.find(s => s.id === id);
      if (staticSalon) {
        setSalon(staticSalon);
        try {
          const docSnap = await getDoc(doc(db, 'frizeri', id));
          if (docSnap.exists()) {
            if (docSnap.data().slikaUrl) setSalon(prev => ({ ...prev, img: docSnap.data().slikaUrl }));
            if (docSnap.data().usluge) setUsluge(docSnap.data().usluge);
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
      } else {
        try {
          const docSnap = await getDoc(doc(db, 'frizeri', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSalon({
              id, name: data.salonNaziv,
              address: data.adresa || 'Beograd, Srbija',
              phone: data.telefon || 'Kontaktirajte salon',
              rating: 5.0, reviews: 0, bookings: 0, badge: '✓ Novo',
              img: data.slikaUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
            });
            setUsluge(data.usluge || []);
          }
        } catch { setSalon(null); }
      }
      setLoading(false);
      try {
        const rQuery = query(collection(db, 'recenzije'), where('salonId', '==', id), orderBy('kreirano', 'desc'));
        const rSnapshot = await getDocs(rQuery);
        setRecenzije(rSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.log(e); }
    };
    fetchSalon();
  }, [id]);

  if (loading) return <p style={{ padding: 20, color: theme.text }}>{t.ucitavanje}</p>;
  if (!salon) return <p style={{ padding: 20, color: theme.text }}>Salon nije pronađen.</p>;

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(salon.address)}&output=embed&z=15`;

  // ── DESKTOP LAYOUT ──
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
              <span onClick={() => navigate('/')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{t.pocetak}</span>
              <span onClick={() => navigate('/salons')} style={{ fontSize: 15, color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>{t.saloni}</span>
              <span onClick={() => navigate('/landing')} style={{ fontSize: 15, color: theme.subtext, cursor: 'pointer', fontWeight: '500' }}>{sr ? 'Za frizere' : 'For barbers'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={theme.toggleJezik} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold', color: theme.text }}>
                {theme.jezik === 'sr' ? '🇬🇧 EN' : '🇷🇸 SR'}
              </div>
              <div onClick={theme.toggle} style={{ backgroundColor: theme.darkMode ? '#334155' : '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16 }}>
                {theme.darkMode ? '☀️' : '🌙'}
              </div>
              <button onClick={() => navigate(user ? '/dashboard' : '/login')}
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>
                {user ? t.mojSalon : t.prijava}
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SLIKA */}
        <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
          <img src={salon.img} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 1200, padding: '0 32px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ backgroundColor: '#2563eb', color: 'white', fontSize: 12, fontWeight: 'bold', padding: '4px 12px', borderRadius: 20, marginBottom: 12, display: 'inline-block' }}>{salon.badge}</span>
                <h1 style={{ fontSize: 42, fontWeight: 'bold', color: 'white', margin: '8px 0 12px' }}>{salon.name}</h1>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={18} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{salon.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>({salon.reviews} {t.recenzija})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={16} color="#93c5fd" />
                    <span style={{ color: '#93c5fd', fontSize: 14 }}>{salon.bookings}{t.rezervacija}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(`/booking/${id}`)}
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 18, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
                {t.zakaziOdmahBtn}
              </button>
            </div>
          </div>
        </div>

        {/* GLAVNI SADRZAJ */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>

          {/* LEVA KOLONA */}
          <div>

            {/* Kontakt info */}
            <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
                {sr ? 'Informacije' : 'Information'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ backgroundColor: '#eff6ff', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: theme.subtext, margin: 0 }}>{sr ? 'Adresa' : 'Address'}</p>
                    <p style={{ fontSize: 15, color: theme.text, margin: 0, fontWeight: '500' }}>{salon.address}</p>
                  </div>
                  <button onClick={() => setShowMap(prev => !prev)}
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, backgroundColor: showMap ? '#2563eb' : '#eff6ff', color: showMap ? 'white' : '#2563eb', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                    <Map size={14} />
                    {showMap ? (sr ? 'Zatvori' : 'Close') : (sr ? 'Mapa' : 'Map')}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ backgroundColor: '#eff6ff', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: theme.subtext, margin: 0 }}>{sr ? 'Telefon' : 'Phone'}</p>
                    <p style={{ fontSize: 15, color: theme.text, margin: 0, fontWeight: '500' }}>{salon.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPA */}
            {showMap && (
              <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1px solid ${theme.border}` }}>
                <iframe title="Mapa salona" src={mapSrc} width="100%" height="300"
                  style={{ border: 'none', display: 'block' }} loading="lazy" allowFullScreen />
              </div>
            )}

            {/* USLUGE */}
            <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 20 }}>{t.usluge}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {usluge.map((usluga, index) => (
                  <div key={index} style={{ backgroundColor: theme.bg, borderRadius: 12, padding: '16px', border: `1px solid ${theme.border}` }}>
                    <p style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, margin: '0 0 6px' }}>{usluga.naziv || usluga.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="#94a3b8" />
                        <span style={{ fontSize: 13, color: theme.subtext }}>{usluga.trajanje || usluga.duration} {t.min}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: 16, color: '#2563eb' }}>{usluga.cena || usluga.price} RSD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENZIJE */}
            {recenzije.length > 0 && (
              <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 20 }}>
                  ⭐ {t.recenzije} ({recenzije.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {recenzije.map(r => (
                    <div key={r.id} style={{ backgroundColor: theme.bg, borderRadius: 12, padding: 16, border: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            <span key={i} style={{ color: i <= r.ocena ? '#f59e0b' : '#e2e8f0', fontSize: 16 }}>★</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>{r.ime}</span>
                      </div>
                      {r.komentar && <p style={{ fontSize: 14, color: theme.subtext, margin: 0 }}>{r.komentar}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DESNA KOLONA — booking kartica */}
          <div>
            <div style={{ backgroundColor: theme.card, borderRadius: 20, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
                {sr ? 'Zakaži termin' : 'Book appointment'}
              </h3>
              <p style={{ fontSize: 14, color: theme.subtext, marginBottom: 24 }}>
                {sr ? 'Izaberi uslugu i termin koji ti odgovara.' : 'Choose a service and time that suits you.'}
              </p>

              {/* Usluge u booking kartici */}
              <div style={{ marginBottom: 24 }}>
                {usluge.slice(0, 3).map((usluga, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < Math.min(usluge.length, 3) - 1 ? `1px solid ${theme.border}` : 'none' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.text, margin: 0 }}>{usluga.naziv || usluga.name}</p>
                      <span style={{ fontSize: 12, color: theme.subtext }}>{usluga.trajanje} {t.min}</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{usluga.cena} RSD</span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate(`/booking/${id}`)}
                style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', marginBottom: 12 }}>
                {t.zakaziOdmahBtn}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: theme.subtext }}>
                  {sr ? '✓ Besplatno otkazivanje' : '✓ Free cancellation'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <Scissors size={18} color="#2563eb" />
            <span style={{ fontWeight: 'bold', color: theme.text, fontSize: 16 }}>BarberApp</span>
          </div>
          <p style={{ color: theme.subtext, fontSize: 13, margin: 0 }}>
            © 2026 BarberApp · {sr ? 'Sva prava zadržana' : 'All rights reserved'}
          </p>
        </footer>
      </div>
    );
  }

  // ── MOBILNI LAYOUT (nepromenjen) ──
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 140 }}>
      <div style={{ position: 'relative', height: 220 }}>
        <img src={salon.img} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4))' }} />
        <ArrowLeft size={22} color="white" style={{ position: 'absolute', top: 16, left: 16, cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: 6, width: 34, height: 34, boxSizing: 'border-box' }} onClick={() => navigate(-1)} />
        <div style={{ position: 'absolute', top: 16, right: 16, backgroundColor: '#2563eb', borderRadius: 20, padding: '4px 12px' }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{salon.badge}</span>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: theme.text }}>{salon.name}</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 'bold', color: theme.text }}>{salon.rating}</span>
              <span style={{ fontSize: 13, color: theme.subtext }}>({salon.reviews} {t.recenzija})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Award size={14} color="#2563eb" />
              <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 'bold' }}>{salon.bookings}{t.rezervacija}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={15} color="#2563eb" />
              <span style={{ fontSize: 14, color: theme.subtext }}>{salon.address}</span>
            </div>
            <button onClick={() => setShowMap(prev => !prev)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: showMap ? '#2563eb' : (theme.darkMode ? '#1e3a8a' : '#eff6ff'), color: showMap ? 'white' : '#2563eb', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>
              <Map size={13} />
              {showMap ? (sr ? 'Zatvori' : 'Close') : (sr ? 'Mapa' : 'Map')}
            </button>
          </div>
          {showMap && (
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: `1px solid ${theme.border}` }}>
              <iframe title="Mapa salona" src={mapSrc} width="100%" height="200" style={{ border: 'none', display: 'block' }} loading="lazy" allowFullScreen />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={15} color="#2563eb" />
            <span style={{ fontSize: 14, color: theme.subtext }}>{salon.phone}</span>
          </div>
        </div>
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>{t.usluge}</h3>
          {usluge.map((usluga, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: index < usluge.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
              <div>
                <p style={{ fontSize: 15, color: theme.text, margin: 0, marginBottom: 2 }}>{usluga.naziv || usluga.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: theme.subtext }}>{usluga.trajanje || usluga.duration} {t.min}</span>
                </div>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: 15, color: theme.text }}>{usluga.cena || usluga.price} RSD</span>
            </div>
          ))}
        </div>
        {recenzije.length > 0 && (
          <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 14, color: theme.text }}>⭐ {t.recenzije} ({recenzije.length})</h3>
            {recenzije.map(r => (
              <div key={r.id} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.ocena ? '#f59e0b' : '#e2e8f0', fontSize: 14 }}>★</span>)}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: theme.text }}>{r.ime}</span>
                </div>
                {r.komentar && <p style={{ fontSize: 13, color: theme.subtext, margin: 0 }}>{r.komentar}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, padding: '10px 20px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, boxSizing: 'border-box', zIndex: 999 }}>
        <button onClick={() => navigate(`/booking/${id}`)}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {t.zakaziOdmahBtn}
        </button>
      </div>
      <BottomNav user={user} />
    </div>
  );
}

export default SalonDetail;