import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDE37U17U-z3BdWALJ0ivT26BenmtlBcio",
  authDomain: "nodsgy-fd9fa.firebaseapp.com",
  projectId: "nodsgy-fd9fa",
  storageBucket: "nodsgy-fd9fa.appspot.com",
  messagingSenderId: "574025046986",
  appId: "1:574025046986:web:f84c2cf24c446c0af40d33",
  measurementId: "G-T42TGSPFL5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore, and Storage
export const auth = getAuth(app);
export const fileStorage = getStorage(app);
export const db = getFirestore(app); // Initialize Firestore
export default app;
