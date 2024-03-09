// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBos2TR9XiHJHNvIxmBnbLU0JCekTAGed8",
  authDomain: "flat-finder-45cb0.firebaseapp.com",
  projectId: "flat-finder-45cb0",
  storageBucket: "flat-finder-45cb0.appspot.com",
  messagingSenderId: "206119590471",
  appId: "1:206119590471:web:8d2b71bfe60413750a2f62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);