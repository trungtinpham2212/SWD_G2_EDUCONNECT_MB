// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUCs6fGskD7Fg_W4cRxB_NmeqtfjgO9XA",
  authDomain: "educonnect-40eb2.firebaseapp.com",
  projectId: "educonnect-40eb2",
  storageBucket: "educonnect-40eb2.firebasestorage.app",
  messagingSenderId: "625703609844",
  appId: "1:625703609844:web:7414e15cce5bdc190d45a1",
  measurementId: "G-H3C9CCWSR7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);