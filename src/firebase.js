import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
 apiKey: "AIzaSyDz-WWQTbd8kWfC5_lGT0IXG9E_gt05d48",
  authDomain: "barberapp-d9393.firebaseapp.com",
  projectId: "barberapp-d9393",
  storageBucket: "barberapp-d9393.firebasestorage.app",
  messagingSenderId: "317694417403",
  appId: "1:317694417403:web:3190b031191a7c8e7cd35e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);