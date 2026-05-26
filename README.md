# 💈 BarberApp — Online Booking Platform for Barbers

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://barber-app-t9pg.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> A full-stack web application that allows clients to book barber appointments online, and barbers to manage their schedules in real time.

---

## 🌐 Live Demo

👉 **[https://barber-app-t9pg.onrender.com](https://barber-app-t9pg.onrender.com)**

---

## ✨ Features

### For Clients
- 🔍 **Search salons** by city or service
- 📅 **Book appointments** — choose service, day and time
- 📧 **Email confirmation** sent automatically after booking
- ⭐ **Leave reviews** for salons
- 🗺️ **Google Maps embed** — see salon location
- 🌍 **Bilingual** — Serbian / English

### For Barbers
- 🔐 **Register & Login** — Firebase Authentication
- 📊 **Dashboard** — real-time appointment management
- 🔔 **In-app notifications** — instant alerts for new bookings
- 📷 **Upload salon photo** — via Cloudinary
- ⚙️ **Salon setup** — working hours & services
- 👤 **Profile management**
- ❌ **Cancel appointments** with one click

### Platform
- 🛡️ **Admin panel** — verify/delete salons, manage all bookings
- 📱 **PWA** — installable as a native app on mobile
- 🌙 **Dark / Light mode** — remembered across sessions
- 🖥️ **Responsive** — mobile-first + full desktop layout

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **React 18** | Frontend framework |
| **Firebase Firestore** | Real-time database |
| **Firebase Auth** | Barber authentication |
| **EmailJS** | Email notifications |
| **Cloudinary** | Image upload & storage |
| **Render** | Hosting & deployment |
| **Lucide React** | Icons |

---

## 📱 Screenshots

### Mobile
| Home | Salon List | Booking |
|------|-----------|---------|
| Search + salon grid | Filter & browse salons | Select service, day & time |

### Desktop
| Home | Salon Detail | Booking |
|------|-------------|---------|
| Hero + 4-column grid | 2-column layout + map | Split layout with sticky summary |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/Skoumika/barber-app.git

# Navigate to project
cd barber-app

# Install dependencies
npm install

# Start development server
npm start
```

### Environment
The app uses Firebase config stored in `src/firebase.js`. Replace with your own Firebase project credentials.

---

## 📁 Project Structure

```
src/
├── screens/
│   ├── Home.js          # Landing page + BottomNav component
│   ├── SalonList.js     # Browse & search salons
│   ├── SalonDetail.js   # Salon info, services, reviews, map
│   ├── Booking.js       # Appointment booking flow
│   ├── Dashboard.js     # Barber dashboard + notifications
│   ├── Login.js         # Barber login
│   ├── Register.js      # Barber registration
│   ├── SalonSetup.js    # Working hours & services setup
│   ├── Profile.js       # Barber profile management
│   ├── Recenzija.js     # Client review form
│   ├── Landing.js       # Marketing page for barbers
│   └── Admin.js         # Admin panel
├── firebase.js          # Firebase configuration
├── ThemeContext.js      # Theme + language global state
└── App.js               # Routes
```

---

## 🔑 Key Implementation Details

- **Real-time updates** — Firestore `onSnapshot` for live dashboard
- **PWA** — Service Worker + Web App Manifest for mobile install
- **Responsive design** — `window.innerWidth` hook for mobile/desktop layouts
- **i18n** — Custom translation system in ThemeContext (SR/EN)
- **Image upload** — Direct Cloudinary upload via unsigned preset
- **Email notifications** — Dual EmailJS templates (barber + client)

---

## 👤 Author

Built with ❤️ using React + Firebase

---

## 📄 License

MIT License — free to use and modify
