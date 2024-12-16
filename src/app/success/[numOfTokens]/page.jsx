"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Success() {
  const { numOfCredits } = useParams();
  const [userSpent, setUserSpent] = useState();

  useEffect(() => {
    if (numOfCredits == 10) {
      setUserSpent(0.99);
    } else if (numOfCredits == 25) {
      setUserSpent(1.49);
    } else if (numOfCredits == 50) {
      setUserSpent(2.99);
    } else {
      setUserSpent(4.99);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="md:mt-[15rem] text-center h-[50vh]">
      <h1 className="font-bold text-[35px] text-center w-[85%] mx-auto">
        Thank you for your purchase!
      </h1>
      <h1 className="font-bold text-[35px] text-center w-[85%] mx-auto mt-2">
        <span className="text-yellow">{numOfCredits} Credits </span>
        have been added to your account
      </h1>
      <p className="font-normal text-[20px] text-center mt-5">
        (you were charged ${userSpent})
      </p>

      <Link
        className="text-gray font-semibold sm:text-[25px] text-[22px] mt-5 w-max hover:border-b-[3px] pb-0 cursor-pointer"
        href="/"
      >
        Return to home page
      </Link>
    </div>
  );
}
