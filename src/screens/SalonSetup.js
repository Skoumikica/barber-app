import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, Plus, Trash2, Camera, Upload } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const CLOUDINARY_CLOUD_NAME = 'dgd116da2';
const CLOUDINARY_UPLOAD_PRESET = 'cryzufnj';

const daniNedelje = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
const daysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function SalonSetup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = theme;

  const [salonSlika, setSalonSlika] = useState(null);
  const [uploadingSlika, setUploadingSlika] = useState(false);
  const [previewSlika, setPreviewSlika] = useState(null);

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

  const handleSlikaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSlika(ev.target.result);
    reader.readAsDataURL(file);
    setSalonSlika(file);
  };

  const uploadSlika = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'barberapp/saloni');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await response.json();
    return data.secure_url;
  };

  const toggleDan = (dan) => {
    setRadnoVreme(prev => ({ ...prev, [dan]: { ...prev[dan], aktivan: !prev[dan].aktivan } }));
  };

  const updateVreme = (dan, field, value) => {
    setRadnoVreme(prev => ({ ...prev, [dan]: { ...prev[dan], [field]: value } }));
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
      let slikaUrl = null;
      if (salonSlika) {
        setUploadingSlika(true);
        slikaUrl = await uploadSlika(salonSlika);
        setUploadingSlika(false);
      }
      const updateData = { radnoVreme, usluge, azurirano: new Date() };
      if (slikaUrl) updateData.slikaUrl = slikaUrl;
      await updateDoc(doc(db, 'frizeri', auth.currentUser.uid), updateData);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      alert('Greška pri čuvanju. Pokušajte ponovo.');
    }
    setLoading(false);
  };

  const inputStyle = { padding: '6px 10px', borderRadius: 8, border: `1px solid ${theme.border}`, fontSize: 14, flex: 1, backgroundColor: theme.input, color: theme.inputText };
  const prikazDana = theme.jezik === 'sr' ? daniNedelje : daysEn;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: 100 }}>

      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '20px 20px 28px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>{t.podesavanjeSalona}</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* UPLOAD SLIKE */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.slikaSalona}</h3>
          {previewSlika ? (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <img src={previewSlika} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />
              <button onClick={() => { setPreviewSlika(null); setSalonSlika(null); }}
                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          ) : (
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{ border: `2px dashed ${theme.border}`, borderRadius: 12, padding: '30px 20px', textAlign: 'center', backgroundColor: theme.bg }}>
                <Camera size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.text, margin: '0 0 4px' }}>{t.dodajSliku}</p>
                <p style={{ fontSize: 12, color: theme.subtext, margin: 0 }}>JPG, PNG · Max 5MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleSlikaChange} style={{ display: 'none' }} />
            </label>
          )}
          {salonSlika && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#eff6ff', borderRadius: 8, padding: '8px 12px' }}>
              <Upload size={14} color="#2563eb" />
              <span style={{ fontSize: 12, color: '#2563eb' }}>
                {uploadingSlika ? 'Uploading...' : `${salonSlika.name}`}
              </span>
            </div>
          )}
        </div>

        {/* RADNO VREME */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.radnoVreme}</h3>
          {daniNedelje.map((dan, i) => (
            <div key={dan} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: radnoVreme[dan].aktivan ? 8 : 0 }}>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: theme.text }}>{prikazDana[i]}</span>
                <div onClick={() => toggleDan(dan)}
                  style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: radnoVreme[dan].aktivan ? '#2563eb' : theme.border, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: radnoVreme[dan].aktivan ? 22 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s' }} />
                </div>
              </div>
              {radnoVreme[dan].aktivan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="time" value={radnoVreme[dan].od} onChange={e => updateVreme(dan, 'od', e.target.value)} style={inputStyle} />
                  <span style={{ color: theme.subtext }}>—</span>
                  <input type="time" value={radnoVreme[dan].do} onChange={e => updateVreme(dan, 'do', e.target.value)} style={inputStyle} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* USLUGE */}
        <div style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>{t.uslugeSetup}</h3>
          {usluge.map((usluga, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 'bold', color: theme.text, margin: 0 }}>{usluga.naziv}</p>
                <p style={{ fontSize: 12, color: theme.subtext, margin: 0 }}>{usluga.trajanje} {t.min} · {usluga.cena} RSD</p>
              </div>
              <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => obrisiUslugu(index)} />
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <input placeholder={t.nazivUsluge} value={novaUsluga.naziv} onChange={e => setNovaUsluga(prev => ({ ...prev, naziv: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, marginBottom: 8, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input placeholder={t.cena} type="number" value={novaUsluga.cena} onChange={e => setNovaUsluga(prev => ({ ...prev, cena: e.target.value }))}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, outline: 'none', backgroundColor: theme.input, color: theme.inputText }} />
              <select value={novaUsluga.trajanje} onChange={e => setNovaUsluga(prev => ({ ...prev, trajanje: parseInt(e.target.value) }))}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, outline: 'none', backgroundColor: theme.input, color: theme.inputText }}>
                <option value={15}>15 {t.min}</option>
                <option value={20}>20 {t.min}</option>
                <option value={30}>30 {t.min}</option>
                <option value={45}>45 {t.min}</option>
                <option value={60}>60 {t.min}</option>
              </select>
            </div>
            <button onClick={dodajUslugu}
              style={{ width: '100%', backgroundColor: theme.darkMode ? '#1e3a8a' : '#eff6ff', color: '#2563eb', border: '1px dashed #93c5fd', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={16} /> {t.dodajUslugu}
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, padding: '12px 20px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, boxSizing: 'border-box' }}>
        <button onClick={sacuvaj} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', opacity: loading ? 0.7 : 1 }}>
          {loading ? (uploadingSlika ? '📷 Upload...' : t.cuvanje) : t.sacuvajPodesavanja}
        </button>
      </div>
    </div>
  );
}

export default SalonSetup;