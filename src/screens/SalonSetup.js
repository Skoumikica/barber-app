import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const daniNedelje = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

function SalonSetup() {
  const navigate = useNavigate();
  const [radnoVreme, setRadnoVreme] = useState({
    Ponedeljak: { aktivan: true, od: '09:00', do: '18:00' },
    Utorak: { aktivan: true, od: '09:00', do: '18:00' },
    Sreda: { aktivan: true, od: '09:00', do: '18:00' },
    Četvrtak: { aktivan: true, od: '09:00', do: '18:00' },
    Petak: { aktivan: true, od: '09:00', do: '18:00' },
    Subota: { aktivan: true, od: '09:00', do: '15:00' },
    Nedelja: { aktivan: false, od: '09:00', do: '15:00' },
  });
  const [usluge, setUsluge] = useState([
    { naziv: 'Muško šišanje', cena: 800, trajanje: 30 },
    { naziv: 'Sređivanje brade', cena: 500, trajanje: 20 },
  ]);
  const [novaUsluga, setNovaUsluga] = useState({ naziv: '', cena: '', trajanje: 30 });
  const [loading, setLoading] = useState(false);

  const toggleDan = (dan) => {
    setRadnoVreme(prev => ({
      ...prev,
      [dan]: { ...prev[dan], aktivan: !prev[dan].aktivan }
    }));
  };

  const updateVreme = (dan, field, value) => {
    setRadnoVreme(prev => ({
      ...prev,
      [dan]: { ...prev[dan], [field]: value }
    }));
  };

  const dodajUslugu = () => {
    if (!novaUsluga.naziv || !novaUsluga.cena) return;
    setUsluge(prev => [...prev, { ...novaUsluga, cena: parseInt(novaUsluga.cena) }]);
    setNovaUsluga({ naziv: '', cena: '', trajanje: 30 });
  };

  const obrisiUslugu = (index) => {
    setUsluge(prev => prev.filter((_, i) => i !== index));
  };

  const sacuvaj = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'frizeri', auth.currentUser.uid), {
        radnoVreme,
        usluge,
        azurirano: new Date()
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Greška pri čuvanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>Podešavanje Salona</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Radno vreme */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#1e293b' }}>🕐 Radno Vreme</h3>
          {daniNedelje.map(dan => (
            <div key={dan} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: radnoVreme[dan].aktivan ? 8 : 0 }}>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#334155' }}>{dan}</span>
                <div onClick={() => toggleDan(dan)}
                  style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: radnoVreme[dan].aktivan ? '#2563eb' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: radnoVreme[dan].aktivan ? 22 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s' }} />
                </div>
              </div>
              {radnoVreme[dan].aktivan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="time" value={radnoVreme[dan].od} onChange={e => updateVreme(dan, 'od', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, flex: 1 }} />
                  <span style={{ color: '#94a3b8' }}>—</span>
                  <input type="time" value={radnoVreme[dan].do} onChange={e => updateVreme(dan, 'do', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, flex: 1 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Usluge */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#1e293b' }}>✂️ Usluge</h3>
          {usluge.map((usluga, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{usluga.naziv}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{usluga.trajanje} min · {usluga.cena} RSD</p>
              </div>
              <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => obrisiUslugu(index)} />
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <input placeholder="Naziv usluge" value={novaUsluga.naziv} onChange={e => setNovaUsluga(prev => ({ ...prev, naziv: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 8, boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input placeholder="Cena (RSD)" type="number" value={novaUsluga.cena} onChange={e => setNovaUsluga(prev => ({ ...prev, cena: e.target.value }))}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
              <select value={novaUsluga.trajanje} onChange={e => setNovaUsluga(prev => ({ ...prev, trajanje: parseInt(e.target.value) }))}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }}>
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <button onClick={dodajUslugu}
              style={{ width: '100%', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px dashed #93c5fd', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={16} /> Dodaj uslugu
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 400, padding: '12px 20px', backgroundColor: 'white', borderTop: '1px solid #f1f5f9', boxSizing: 'border-box' }}>
        <button onClick={sacuvaj} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          {loading ? 'Čuvanje...' : 'Sačuvaj Podešavanja →'}
        </button>
      </div>
    </div>
  );
}

export default SalonSetup;