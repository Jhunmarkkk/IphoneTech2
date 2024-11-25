import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCX2UwR-E6TIdday_xRw4w7CABD2HIsnf8",
  authDomain: "iphonetech-ac6fb.firebaseapp.com",
  projectId: "iphonetech-ac6fb",
  storageBucket: "iphonetech-ac6fb.firebasestorage.app",
  messagingSenderId: "278361748173",
  appId: "1:278361748173:web:e1fd36364ec6b17d956f84",
  measurementId: "G-KNE92JH7Z7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };