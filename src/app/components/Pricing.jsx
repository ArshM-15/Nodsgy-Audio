"use client";

import Image from "next/image";
import { getAuth } from "firebase/auth";

export default function Pricing() {
  const handleCheckout = async (priceId, numOfTokens) => {
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user

    if (!user) {
      alert(
        "Please create an account before purchasing tokens. You get 30 FREE tokens when you first create an account!"
      );
      return; // Ensure the user is logged in
    }

    try {
      // Call your API to create the checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          numOfTokens,
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
      console.error("Error during checkout:", error.message);
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
          Each explanation costs 10 tokens. You can purchase tokens by creating
          an account.
        </h2>
      </div>
      <div className="mt-10 rounded-2xl py-3 px-5 sm:px-8 mx-auto w-[24rem] sm:w-[40rem] font-semibold text-[22px] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <span>50 tokens</span>
          <span>
            $2.99
            <span className="font-normal text-[13px]"> USD</span>
          </span>
          <button
            className="bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() =>
              handleCheckout(process.env.NEXT_PUBLIC_FIRST_PRICE_ID, 50)
            }
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <span>100 tokens</span>
          <span>
            $5.49
            <span className="font-normal text-[13px]"> USD</span>
          </span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() =>
              handleCheckout(process.env.NEXT_PUBLIC_SECOND_PRICE_ID, 100)
            }
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <span>250 tokens</span>
          <span>
            $12.99
            <span className="font-normal text-[13px]"> USD</span>
          </span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() =>
              handleCheckout(process.env.NEXT_PUBLIC_THIRD_PRICE_ID, 250)
            }
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between pt-3 pb-3 items-center">
          <span>400 tokens</span>
          <span>
            $19.99
            <span className="font-normal text-[13px]"> USD</span>
          </span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() =>
              handleCheckout(process.env.NEXT_PUBLIC_FOURTH_PRICE_ID, 400)
            }
          >
            Buy
          </button>
        </div>
      </div>
      <h2 className="font-semibold sm:text-[25px] text-[20px] bg-faintyellow pt-5 pb-5 text-center mt-[3rem] group">
        <span className="inline-block transition-transform transform group-hover:animate-confetti">
          😊
        </span>
        <span className="mx-5">We do not offer any refunds at this time</span>
        <span className="inline-block transition-transform transform group-hover:animate-confetti">
          😊
        </span>
      </h2>
    </div>
  );
}
