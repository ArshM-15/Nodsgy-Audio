"use client";

import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export const getCheckoutUrl = async (app, priceId, numOfTokens) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  // Create a new checkout session in Firestore
  const docRef = await addDoc(checkoutSessionRef, {
    mode: "payment",
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  console.log("Checkout session created:", docRef.id);

  // Listen for changes to the Firestore document and retrieve the URL
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, async (snap) => {
      const data = snap.data();
      if (!data) {
        console.log("No data in Firestore snapshot");
        return;
      }

      const { error, url, payment_status } = data;

      console.log("Snapshot data:", data);

      if (error) {
        unsubscribe();
        console.error("Stripe error:", error.message);
        return reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      }

      // Check for successful payment status
      if (payment_status === "paid") {
        console.log("Payment status is paid, updating tokens...");
        unsubscribe(); // Unsubscribe before the token update to prevent multiple triggers
        try {
          // Reference the user's document
          const userDocRef = doc(db, "users", userId);

          // Get current tokens from the user's document
          const userSnap = await getDoc(userDocRef);
          const userData = userSnap.data();
          const currentTokens = userData?.tokens || 0;

          console.log(
            `Current tokens: ${currentTokens}, Adding: ${numOfTokens}`
          );

          // Update the user's token balance
          await updateDoc(userDocRef, {
            tokens: currentTokens + numOfTokens,
          });

          console.log("Tokens successfully updated!");
        } catch (updateError) {
          console.error("Failed to update tokens:", updateError);
          reject(updateError);
        }
      } else {
        console.log(`Payment status: ${payment_status}`);
      }
    });
  });
};

// "use client";
// import { useEffect, useState } from "react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Import getAuth
// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// import { db } from "../firebase/config";

// export default function Success() {
//   const router = useRouter(); // Initialize the router
//   const [isLoading, setIsLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const auth = getAuth(); // Initialize authentication
//     const user = auth.currentUser;

//     const checkUserVisited = async () => {
//       if (user) {
//         const userDocRef = doc(db, "users", user.uid);

//         try {
//           const userSnap = await getDoc(userDocRef);

//           // Check if user document exists
//           if (!userSnap.exists()) {
//             console.error("No such user document!");
//             setIsLoading(false); // Stop loading if user document does not exist
//             return;
//           }

//           const userData = userSnap.data();

//           // Check if user has visited the success page
//           if (userData.hasVisitedSuccess) {
//             // Allow access to the Success page
//             console.log("Access granted to Success page.");

//             // Update the hasVisitedSuccess field to false
//             await updateDoc(userDocRef, {
//               hasVisitedSuccess: false,
//             });
//             setIsLoading(false); // Stop loading after the update
//           } else {
//             // If they have already visited, redirect to the home page
//             console.log("Access denied, redirecting to home.");
//             router.push("/"); // Redirect to localhost:3000
//           }
//         } catch (error) {
//           console.error("Error fetching user document:", error);
//         }
//       } else {
//         console.error("User is not authenticated");
//         router.push("/"); // Redirect to localhost:3000
//       }
//     };

//     checkUserVisited();
//   }, [router]); // Include router in the dependency array

//   // If loading, return a loading message or spinner
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // Render the success message once the loading is complete
//   return <div>Success</div>;
// }
