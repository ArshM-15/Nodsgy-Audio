import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <div className="md:flex text-center mx-auto items-center justify-between w-[90%] my-7">
      <Image
        src="/long-logo.png"
        width={150}
        height={50}
        alt="logo"
        className="md:mx-0 mx-auto"
      />
      <div className="flex justify-center gap-20 font-normal text-[20px] md:mr-20 ">
        <ul className="md:my-0 my-5">About</ul>
        <ul className="md:my-0 my-5">Pricing</ul>
        <ul className="md:my-0 my-5">FAQ</ul>
      </div>
      <button className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl">
        Sign In
      </button>
    </div>
  );
}
