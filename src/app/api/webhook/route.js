import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../firebase/serviceAccountKey.json"; // Adjust path as necessary

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});
const endpointSecret = process.env.WEBHOOK_SECRET;

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
      console.log("Event Object:", JSON.stringify(event, null, 2));
      const amountSpent = event.data.object.amount_total / 100; // Convert from cents to dollars
      console.log("User spent:", `$${amountSpent}`);

      // Retrieve the user’s UID from the checkout session metadata
      const userUid = event.data.object.metadata?.user_uid;

      // Convert numOfTokens to an integer safely
      const numOfTokensString = event.data.object.metadata?.num_of_tokens;
      const numOfTokens = numOfTokensString
        ? parseInt(numOfTokensString, 10)
        : 0;

      if (!userUid) {
        console.error("User UID not found in metadata.");
        return new Response("User UID not found in metadata", { status: 400 });
      }

      console.log(userUid);
      // Retrieve user document in Firestore and add tokens
      const userDocRef = db.collection("users").doc(userUid);

      // Fetch the document data
      const userDoc = await userDocRef.get();
      const currentTokens = userDoc.exists ? userDoc.data().tokens || 0 : 0;
      const currentAmountSpent = userDoc.exists
        ? userDoc.data().amountSpent || 0
        : 0;
      const currentTimesPayed = userDoc.exists
        ? userDoc.data().amountOfTimesPayed || 0
        : 0;

      await userDocRef.update({
        tokens: currentTokens + numOfTokens,
        amountSpent: currentAmountSpent + amountSpent,
        amountOfTimesPayed: currentTimesPayed + 1,
      });

      console.log("Tokens added to user account successfully");
    } catch (error) {
      console.error("Error processing checkout session:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
