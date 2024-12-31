"use client";

import Image from "next/image";
import { getAuth } from "firebase/auth";

export default function Pricing() {
  const handleCheckout = async (numOfCredits) => {
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user

    if (!user) {
      alert("Please create an account before purchasing credits.");
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
          Each explanation costs 1 credit. You can purchase credits by creating
          an account.
        </h2>
      </div>
      {/* <div className="mt-10 rounded-2xl py-3 px-5 sm:px-8 mx-auto w-[24rem] sm:w-[40rem] font-semibold text-[22px] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)]">
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <div className="flex items-center w-[4rem]">
            <span>10</span>
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1"
            />
          </div>
          <span>$0.99</span>
          <button
            className="bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(10)}
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <div className="flex items-center w-[3.66rem]">
            <span>25</span>
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1"
            />
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-30px] hidden md:block"
            />
          </div>
          <span>$1.49</span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(25)}
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between py-3 border-b-[#e0e0e0] border-b border-solid items-center">
          <div className="flex items-center w-[3.9rem]">
            <span>50</span>
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1"
            />
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-30px]"
            />
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-60px]"
            />
          </div>
          <span>$2.99</span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(50)}
          >
            Buy
          </button>
        </div>
        <div className="flex justify-between pt-3 pb-3 items-center">
          <div className="flex items-center w-[4.05rem]">
            <span>100</span>
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1"
            />
              <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-30px]"
            />
            <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-60px]"
            />
              <Image
              src="/credit-image.png"
              width={40}
              height={40}
              alt="credit"
              className="ml-1 translate-x-[-90px]"
            />
          </div>
          <span>$4.99</span>
          <button
            className=" bg-yellow py-1 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(100)}
          >
            Buy
          </button>
        </div>
      </div> */}

      <div className="block md:flex justify-between w-[80%] mx-auto">
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
          <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.10 per audio
          </p>
          <button className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(50)}
            >
            Buy for $5
          </button>
        </div>

        <div className="font-semibold text-[22px] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] px-5 py-7 rounded-2xl flex flex-col items-center md:w-[30%] w-[20rem] mt-10 mx-auto">
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
          <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.09 per audio
          </p>
          <button className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(100)}
            >
            Buy for $9
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
          <p className="text-center mb-[1rem] font-normal text-[20px]">
            $0.08 per audio
          </p>
          <button className="bg-yellow py-1.5 px-4 rounded-3xl cursor-pointer"
            onClick={() => handleCheckout(250)}
            >
            Buy for $20
          </button>
        </div>
      </div>
      {/* <h2 className="font-semibold sm:text-[25px] text-[20px] bg-faintyellow pt-5 pb-5 text-center mt-[3rem] group">
        <span className="mx-5">We do not issue refunds at this time</span>
      </h2> */}
    </div>
  );
}
