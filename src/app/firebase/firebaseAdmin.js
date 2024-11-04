import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../firebase/serviceAccountKey.json"; // Adjust path as necessary

// Parse the service account key from the environment variable
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

// Now you can use Firestore or any other Firebase services
const db = getFirestore();
