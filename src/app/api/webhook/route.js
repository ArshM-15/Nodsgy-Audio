import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
// import serviceAccount from "../../firebase/serviceAccountKey.json"; // Adjust path as necessary

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});
const endpointSecret = process.env.WEBHOOK_SECRET;
const serviceAccount = {
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
};

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = getAuth();

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    // Retrieve the raw body for Stripe's signature verification
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        }
      );

      const lineItems = session.line_items;
      if (!lineItems) {
        return new Response("Internal Server Error", { status: 500 });
      }
      const amountSpent = event.data.object.amount_total / 100; // Convert from cents to dollars

      // Retrieve the user’s UID from the checkout session metadata
      const userUid = event.data.object.metadata?.user_uid;

      // Convert numOfCredits to an integer safely
      const numOfCreditsString = event.data.object.metadata?.num_of_credits;
      const numOfCredits = numOfCreditsString
        ? parseInt(numOfCreditsString, 10)
        : 0;

      if (!userUid) {
        console.error("User UID not found in metadata.");
        return new Response("User UID not found in metadata", { status: 400 });
      }

      // Retrieve user document in Firestore and add credits
      const userDocRef = db.collection("users").doc(userUid);

      // Fetch the document data
      const userDoc = await userDocRef.get();
      const currentCredits = userDoc.exists ? userDoc.data().credits || 0 : 0;
      const currentAmountSpent = userDoc.exists
        ? userDoc.data().amountSpent || 0
        : 0;
      const currentTimesPayed = userDoc.exists
        ? userDoc.data().amountOfTimesPayed || 0
        : 0;

      await userDocRef.update({
        credits: currentCredits + numOfCredits,
        amountSpent: currentAmountSpent + amountSpent,
        amountOfTimesPayed: currentTimesPayed + 1,
      });
    } catch (error) {
      console.error("Error processing checkout session:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
