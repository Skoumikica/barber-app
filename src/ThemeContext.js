import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// =============================================
// SVI PREVODI
// =============================================
export const translations = {
  sr: {
    // Navbar / General
    appName: 'BarberApp',
    prijava: 'Prijava',
    salon: 'Salon',
    mojSalon: 'Moj salon',
    pocetak: 'Početna',
    saloni: 'Saloni',
    nazad: 'Nazad',

    // Home
    pronajdi: 'Pronađi savršenog',
    frizera: 'frizera 💈',
    searchPlaceholder: 'Grad ili usluga...',
    pretrazi: '🔍 Pretraži',
    zakaziOdmah: 'Zakaži Odmah →',
    sifrizer: '💈 Si frizer?',
    registrujSalon: 'Registruj svoj salon besplatno',
    popularniSaloni: 'Popularni Saloni',

    // SalonList
    pronajdiSalon: 'Pronađi Salon',
    nemaRezultata: 'Nema rezultata za',
    pogledaj: 'Pogledaj',
    od: 'od',

    // SalonDetail
    recenzija: 'recenzija',
    rezervacija: '+ rezervacija',
    usluge: 'Usluge',
    recenzije: 'Recenzije',
    zakaziOdmahBtn: 'Zakaži odmah →',
    min: 'min',

    // Booking
    zakaziTermin: 'Zakaži Termin',
    izaberiUslugu: 'Izaberi uslugu',
    izaberiDan: 'Izaberi dan',
    izaberiVreme: 'Izaberi vreme',
    vasiPodaci: 'Vaši podaci',
    imePrezime: 'Ime i prezime',
    emailAdresa: 'Email adresa',
    brojTelefona: 'Broj telefona',
    potvrdiTermin: 'Potvrdi Termin →',
    cekajte: 'Čekajte...',
    terminZakazan: 'Termin zakazan!',
    nazadNaPocetak: 'Nazad na početak',
    ostaviRecenziju: 'Ostavi recenziju ⭐',
    upozorenje: 'Molimo popunite sva polja, izaberite uslugu i termin.',

    // Dani
    days: ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'],

    // Dashboard
    kontrolnaTabla: 'Kontrolna Tabla',
    ovajMesec: 'Ovaj mesec',
    rsdPrihod: 'RSD prihod',
    ukupno: 'Ukupno',
    terminiPoDanima: '📅 Termini po danima',
    svi: 'Svi',
    sviTermini: 'Svi termini',
    terminiZa: 'Termini za',
    terminA: 'termin(a)',
    ucitavanje: 'Učitavanje termina...',
    nemaNista: 'Još nema termina',
    nemaNistaOpis: 'Kad klijenti zakažu, termini će se pojaviti ovde u realnom vremenu.',
    otkazi: 'Otkaži',

    // Login / Register
    dobrodosao: 'Dobrodošao nazad',
    prijaviSe: 'Prijavi se na svoj nalog',
    lozinka: 'Lozinka',
    tvojaLozinka: 'Tvoja lozinka',
    prijaviSeBtn: 'Prijavi se →',
    nemasProfil: 'Nemaš nalog?',
    registrujSe: 'Registruj se',
    registracija: 'Registruj se',
    kreirajNalog: 'Kreiraj nalog za tvoj salon',
    tvojeIme: 'Tvoje ime',
    nazivSalona: 'Naziv salona',
    adresaSalona: 'Adresa salona',
    kreirajNalogBtn: 'Kreiraj nalog →',
    imasNalog: 'Imaš nalog?',

    // SalonSetup
    podesavanjeSalona: 'Podešavanje Salona',
    slikaSalona: '📷 Slika Salona',
    dodajSliku: 'Dodaj sliku salona',
    radnoVreme: '🕐 Radno Vreme',
    uslugeSetup: '✂️ Usluge',
    sacuvajPodesavanja: 'Sačuvaj Podešavanja →',
    cuvanje: 'Čuvanje...',
    dodajUslugu: 'Dodaj uslugu',
    nazivUsluge: 'Naziv usluge',
    cena: 'Cena (RSD)',

    // Admin
    adminPanel: 'Admin Panel',
    adminOpis: 'BarberApp upravljanje',
    adminLozinka: 'Admin lozinka',
    unesiteLozinku: 'Unesite lozinku...',
    prijaviSeAdmin: 'Prijavi se →',
    nazadNaAplikaciju: '← Nazad na aplikaciju',
    pogresnaLozinka: 'Pogrešna lozinka!',
    verifikuj: '✓ Verifikuj',
    ukloniVerifikaciju: '✗ Ukloni verifikaciju',
    obrisati: 'Obrisati salon',
    nemaRegistrovanih: 'Nema registrovanih salona.',
    nemaTermina: 'Nema termina.',
  },

  en: {
    // Navbar / General
    appName: 'BarberApp',
    prijava: 'Login',
    salon: 'Salon',
    mojSalon: 'My salon',
    pocetak: 'Home',
    saloni: 'Salons',
    nazad: 'Back',

    // Home
    pronajdi: 'Find the perfect',
    frizera: 'barber 💈',
    searchPlaceholder: 'City or service...',
    pretrazi: '🔍 Search',
    zakaziOdmah: 'Book Now →',
    sifrizer: '💈 Are you a barber?',
    registrujSalon: 'Register your salon for free',
    popularniSaloni: 'Popular Salons',

    // SalonList
    pronajdiSalon: 'Find a Salon',
    nemaRezultata: 'No results for',
    pogledaj: 'View',
    od: 'from',

    // SalonDetail
    recenzija: 'reviews',
    rezervacija: '+ bookings',
    usluge: 'Services',
    recenzije: 'Reviews',
    zakaziOdmahBtn: 'Book now →',
    min: 'min',

    // Booking
    zakaziTermin: 'Book Appointment',
    izaberiUslugu: 'Choose a service',
    izaberiDan: 'Choose a day',
    izaberiVreme: 'Choose a time',
    vasiPodaci: 'Your details',
    imePrezime: 'Full name',
    emailAdresa: 'Email address',
    brojTelefona: 'Phone number',
    potvrdiTermin: 'Confirm Appointment →',
    cekajte: 'Please wait...',
    terminZakazan: 'Appointment booked!',
    nazadNaPocetak: 'Back to home',
    ostaviRecenziju: 'Leave a review ⭐',
    upozorenje: 'Please fill in all fields, choose a service and time.',

    // Dani
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],

    // Dashboard
    kontrolnaTabla: 'Dashboard',
    ovajMesec: 'This month',
    rsdPrihod: 'RSD income',
    ukupno: 'Total',
    terminiPoDanima: '📅 Appointments by day',
    svi: 'All',
    sviTermini: 'All appointments',
    terminiZa: 'Appointments for',
    terminA: 'appointment(s)',
    ucitavanje: 'Loading appointments...',
    nemaNista: 'No appointments yet',
    nemaNistaOpis: 'When clients book, appointments will appear here in real time.',
    otkazi: 'Cancel',

    // Login / Register
    dobrodosao: 'Welcome back',
    prijaviSe: 'Sign in to your account',
    lozinka: 'Password',
    tvojaLozinka: 'Your password',
    prijaviSeBtn: 'Sign in →',
    nemasProfil: "Don't have an account?",
    registrujSe: 'Sign up',
    registracija: 'Sign up',
    kreirajNalog: 'Create your salon account',
    tvojeIme: 'Your name',
    nazivSalona: 'Salon name',
    adresaSalona: 'Salon address',
    kreirajNalogBtn: 'Create account →',
    imasNalog: 'Already have an account?',

    // SalonSetup
    podesavanjeSalona: 'Salon Settings',
    slikaSalona: '📷 Salon Photo',
    dodajSliku: 'Add salon photo',
    radnoVreme: '🕐 Working Hours',
    uslugeSetup: '✂️ Services',
    sacuvajPodesavanja: 'Save Settings →',
    cuvanje: 'Saving...',
    dodajUslugu: 'Add service',
    nazivUsluge: 'Service name',
    cena: 'Price (RSD)',

    // Admin
    adminPanel: 'Admin Panel',
    adminOpis: 'BarberApp management',
    adminLozinka: 'Admin password',
    unesiteLozinku: 'Enter password...',
    prijaviSeAdmin: 'Sign in →',
    nazadNaAplikaciju: '← Back to app',
    pogresnaLozinka: 'Wrong password!',
    verifikuj: '✓ Verify',
    ukloniVerifikaciju: '✗ Remove verification',
    obrisati: 'Delete salon',
    nemaRegistrovanih: 'No registered salons.',
    nemaTermina: 'No appointments.',
  }
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [jezik, setJezik] = useState(() => {
    return localStorage.getItem('jezik') || 'sr';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('jezik', jezik);
  }, [jezik]);

  const toggle = () => setDarkMode(prev => !prev);
  const toggleJezik = () => setJezik(prev => prev === 'sr' ? 'en' : 'sr');

  const t = translations[jezik];

  const theme = {
    darkMode,
    toggle,
    jezik,
    toggleJezik,
    t,
    bg: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    subtext: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    input: darkMode ? '#1e293b' : 'white',
    inputText: darkMode ? '#f1f5f9' : '#333',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}