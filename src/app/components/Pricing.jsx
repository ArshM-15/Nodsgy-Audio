"use client";

import Image from "next/image";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/config"; // Assuming this is the correct path

export default function Pricing() {
  const handleCheckout = async (numOfCredits) => {
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user

    if (!user) {
      alert("Please create an account before purchasing credits.");
      return; // Ensure the user is logged in
    }

    try {
      // Update Firestore analytics before proceeding
      const analyticsDocRef = doc(db, "other-analytics", "numOfTimesClicked");
      await updateDoc(analyticsDocRef, {
        buyButton: increment(1), // Increment the buyButton field by 1
      });
      // Call your API to create the checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numOfCredits,
          userUid: user.uid, // Pass the user's UID
        }),
      });

      const session = await response.json();

      if (response.ok) {
        // Redirect to the checkout URL returned from your API
        window.location.href = session.url;
      } else {
        console.error("Error creating checkout session:", session);
      }
    } catch (error) {
      console.error(
        "Error during checkout or updating analytics:",
        error.message
      );
    }
  };

  return (
    <div className="mt-[5rem]" id="pricing">
      <div>
        <Image
          src="/pricing-title.png"
          width={140}
          height={40}
          className="mx-auto"
          alt="Pricing"
        />
        <h2 className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto lg:w-[50%] w-[90%] mt-6 text-center">
          It costs 1 credit when you input text and 3 credits when you input a
          file. You can purchase credits by creating an account.
        </h2>
      </div>
      <div className="block md:flex justify-between w-[80%] mx-auto mt-10">
        <div className="font-semibold text-[22px] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] px-5 py-7 rounded-2xl flex flex-col items-center md:w-[30%] w-[20rem] mt-10 mx-auto">
          <div className="h-[200px] w-full flex items-center justify-center overflow-hidden">
            <Image
              src="/pricing-img-1.png"
              alt="pricing image"
              className="h-full object-contain"
              width={200}
              height={100}
            />
          </div>
          <p className="text-center mt-[1rem]">50 Credits</p>
          {/* <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.10 per audio
          </p> */}
          <button
            className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer mt-[1rem]"
            onClick={() => handleCheckout(50)}
          >
            Buy for $2.49
          </button>
        </div>

        <div className="relative font-semibold text-[22px] shadow-[0px_0px_10px_5px_rgba(255,229,0,100)] px-5 py-7 rounded-2xl flex flex-col items-center md:w-[30%] w-[20rem] mt-10 mx-auto border-4 border-yellow ">
          <div className="absolute top-[-28px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded-tl-lg rounded-tr-lg bg-yellow">
            MOST POPULAR
          </div>
          <div className="h-[200px] w-full flex items-center justify-center overflow-hidden">
            <Image
              src="/pricing-img-2.png"
              alt="pricing image"
              className="h-full object-contain"
              width={100}
              height={100}
            />
          </div>
          <p className="text-center mt-[1rem]">100 Credits</p>
          {/* <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.09 per audio
          </p> */}
          <button
            className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer mt-[1rem]"
            onClick={() => handleCheckout(100)}
          >
            Buy for $3.99
          </button>
        </div>

        <div className="font-semibold text-[22px] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] px-5 py-7 rounded-2xl flex flex-col items-center md:w-[30%] w-[20rem] mt-10 mx-auto">
          <div className="h-[200px] w-full flex items-center justify-center overflow-hidden">
            <Image
              src="/pricing-img-3.png"
              alt="pricing image"
              className="h-full object-contain"
              width={200}
              height={100}
            />
          </div>
          <p className="text-center mt-[1rem]">250 Credits</p>
          {/* <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.08 per audio
          </p> */}
          <button
            className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer mt-[1rem]"
            onClick={() => handleCheckout(250)}
          >
            Buy for $9.99
          </button>
        </div>
      </div>
      {/* <h2 className="font-semibold sm:text-[25px] text-[20px] bg-faintyellow pt-5 pb-5 text-center mt-[3rem] group">
        <span className="mx-5">We do not issue refunds at this time</span>
      </h2> */}
    </div>
  );
}
