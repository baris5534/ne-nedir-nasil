// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgwbbavvOSyaz22iM30XEkZ7fCiVcR2sw",
  authDomain: "blog-app-d1d3f.firebaseapp.com",
  projectId: "blog-app-d1d3f",
  storageBucket: "blog-app-d1d3f.firebasestorage.app",
  messagingSenderId: "891330793357",
  appId: "1:891330793357:web:e15b76497c34362f3f77c4",
  measurementId: "G-9009YB7L1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };