import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Calendar, TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <Scissors size={28} color="white" />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 22 }}>BarberApp</span>
        </div>
        <h1 style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 12, lineHeight: 1.3 }}>
          Ne moraš više da se javljaš na telefon 📵
        </h1>
        <p style={{ color: '#93c5fd', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          Klijenti zakazuju online. Ti samo radiš. Jednostavno.
        </p>
        <button onClick={() => navigate('/register')}
          style={{ backgroundColor: 'white', color: '#1e3a8a', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 12, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          Počni besplatno →
        </button>
        <p style={{ color: '#93c5fd', fontSize: 13 }}>Bez kreditne kartice · Besplatno za početak</p>
      </div>

      {/* Statistike */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, backgroundColor: '#e2e8f0', margin: '0' }}>
        {[
          { broj: '500+', tekst: 'Frizera' },
          { broj: '10k+', tekst: 'Rezervacija' },
          { broj: '4.9★', tekst: 'Ocena' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '16px 8px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{s.broj}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{s.tekst}</p>
          </div>
        ))}
      </div>

      {/* Prednosti */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, textAlign: 'center' }}>
          Zašto BarberApp?
        </h2>

        {[
          { ikona: <Calendar size={22} color="#2563eb" />, naslov: 'Online zakazivanje 24/7', opis: 'Klijenti zakazuju kad god hoće, čak i u 2 ujutru.' },
          { ikona: <TrendingUp size={22} color="#2563eb" />, naslov: 'Prati svoj prihod', opis: 'Vidi koliko zarađuješ ovaj mesec u realnom vremenu.' },
          { ikona: <Clock size={22} color="#2563eb" />, naslov: 'Uštedi vreme', opis: 'Nema više poziva i poruka. Sve je automatski.' },
          { ikona: <Star size={22} color="#2563eb" />, naslov: 'Izgleda profesionalno', opis: 'Tvoji klijenti dobijaju moderne iskustvo zakazivanja.' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, backgroundColor: 'white', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ backgroundColor: '#eff6ff', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {p.ikona}
            </div>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 15, color: '#1e293b', margin: 0, marginBottom: 4 }}>{p.naslov}</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{p.opis}</p>
            </div>
          </div>
        ))}

        {/* Cena */}
        <div style={{ backgroundColor: '#1e3a8a', borderRadius: 16, padding: 24, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#93c5fd', fontSize: 13, margin: 0, marginBottom: 8 }}>CENOVNIK</p>
          <p style={{ color: 'white', fontSize: 36, fontWeight: 'bold', margin: 0 }}>Besplatno</p>
          <p style={{ color: '#93c5fd', fontSize: 14, marginBottom: 20 }}>za prvih 30 dana</p>
          {[
            'Neograničene rezervacije',
            'Kontrolna tabla',
            'Statistike prihoda',
            'Podrška 24/7',
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <CheckCircle size={16} color="#86efac" />
              <span style={{ color: 'white', fontSize: 14 }}>{s}</span>
            </div>
          ))}
          <button onClick={() => navigate('/register')}
            style={{ width: '100%', backgroundColor: 'white', color: '#1e3a8a', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginTop: 16 }}>
            Registruj salon →
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Već imaš nalog?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>Prijavi se</span>
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
            Si klijent?{' '}
            <span onClick={() => navigate('/')} style={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>Zakaži termin</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;