import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBgwbbavvOSyaz22iM30XEkZ7fCiVcR2sw",
  authDomain: "blog-app-d1d3f.firebaseapp.com",
  projectId: "blog-app-d1d3f",
  storageBucket: "blog-app-d1d3f.appspot.com",
  messagingSenderId: "891330793357",
  appId: "1:891330793357:web:e15b76497c34362f3f77c4",
  measurementId: "G-9009YB7L1W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics }; 