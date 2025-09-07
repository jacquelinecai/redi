// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP74ZSzQonrHtYpkAZO5EvzWlKzPlUtGs",
  authDomain: "redi-fe0fc.firebaseapp.com",
  projectId: "redi-fe0fc",
  storageBucket: "redi-fe0fc.firebasestorage.app",
  messagingSenderId: "853101159954",
  appId: "1:853101159954:web:af21b6f003574177509acb",
  measurementId: "G-M82QY45P5R"
};

// Initialize Firebase

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export const analytics = getAnalytics(FIREBASE_APP);