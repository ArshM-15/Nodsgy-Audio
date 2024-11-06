import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Configure Firebase Admin SDK using environment variables
initializeApp({
  credential: cert({
    type: process.env.GOOGLE_FIREBASE_TYPE,
    project_id: process.env.GOOGLE_FIREBASE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_FIREBASE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_FIREBASE_AUTH_URI,
    token_uri: process.env.GOOGLE_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.GOOGLE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_FIREBASE_UNIVERSE_DOMAIN,
  }),
});

// Initialize Firestore
const db = getFirestore();
