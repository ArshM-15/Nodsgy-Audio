"use client";
import Image from "next/image";
import Script from "next/script";

export default function About() {
  // Function to handle scrolling
  const scrollToNavbar = () => {
    const navbarElement = document.getElementById("navbar");
    if (navbarElement) {
      // Calculate the position with a 100px offset
      const navbarPosition =
        navbarElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: navbarPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-[8rem]" id="about">
      <div>
        <Image
          src="/about-title.png"
          width={140}
          height={40}
          className="mx-auto"
          alt="sub-title"
        />
        <h2 className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[60%] w-[90%] mt-6 text-center">
          A little more about Nodsgy
        </h2>
      </div>

      {/* Embedded YouTube Video */}
      <div className="mt-10 flex justify-center  shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] px-3 py-3 rounded-2xl sm:w-fit w-5rem mx-auto">
        <iframe
          width="557"
          height="315"
          src="https://www.youtube.com/embed/sw-EmYm1-iw?autoplay=1&mute=1&loop=1&playlist=sw-EmYm1-iw"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="md:mt-[5rem] w-[80%] mx-auto text-black font-semibold sm:text-[25px] text-[22px]">
        <div className="my-5 md:flex w-[100%] justify-between items-center">
          <div className="md:w-[45%] text-center md:text-left">
            <p className="font-semibold sm:text-[25px] text-[22px]">
              Convert your questions and notes into concise and simple audio explanations
            </p>
            <p className="font-normal text-[20px] mt-5">
              Ask a question or upload your file, and you’re all set! Nodsgy will generate natural, human-like
              audio explanations for your content. Each sub-section is then
              summarized into short, easy-to-follow bullet points.
            </p>
          </div>
          <div className="aboutScreenWidth:translate-x-[-10rem]">
            <Image
              src="/about-image-1.png"
              width={250}
              height={10}
              alt="about 1"
              className="mx-auto md:mx-0 mt-5 md:mt-0 text-center"
            />
          </div>
        </div>
        <div className="my-5 md:flex w-[100%] justify-between items-center md:mt-[7rem]">
          <div className="aboutScreenWidth:translate-x-[10rem]">
            <Image
              src="/about-image-2.png"
              width={250}
              height={50}
              alt="about 2"
              className="hidden md:block"
            />
          </div>
          <div className="md:w-[45%] text-center md:text-right">
            <p className="font-semibold sm:text-[25px] text-[22px]">
              Upload your materials and enjoy short yet easy to understand audio
              notes tailored to your notes
            </p>
            <p className="font-normal text-[20px] mt-5">
              Whether you&apos;re revising for an exam or simply need to refresh
              on tough topics, Nodsgy turns your study materials into customized
              audio notes, making learning more convenient and enjoyable.
            </p>
          </div>

          <Image
            src="/about-image-2.png"
            width={250}
            height={50}
            alt="about 2"
            className="md:hidden block mx-auto md:mx-0 mt-10 md:mt-0"
          />
        </div>
        <div className="my-5 md:flex w-[100%] justify-between items-center md:mt-[7rem]">
          <div className="md:w-[45%] text-center md:text-left">
            <p className="font-semibold sm:text-[25px] text-[22px]">
              Nodsgy’s credit system lets you turn notes into audio effortlessly
            </p>
            <p className="font-normal text-[20px] mt-5">
              Each audio explanation is priced at 1 credit, and you can buy
              additional credits from the pricing section. Simply sign up,
              purchase credits, and simplify tough topics in seconds.
            </p>
          </div>
          <div className="aboutScreenWidth:translate-x-[-10rem]">
            <Image
              src="/about-image-3.png"
              width={200}
              height={50}
              alt="about 3"
              className="mx-auto md:mx-0 mt-10 md:mt-0"
            />
          </div>
        </div>
      </div>
      {/* <Script
        id="adsense-script-horizontal-2"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1414881818179517"
        crossorigin="anonymous"
      />

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1414881818179517"
        data-ad-slot="4399670817"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="google-ad">
        {`
    (adsbygoogle = window.adsbygoogle || []).push({});
  `}
      </Script> */}

      <div className="bg-faintyellow pt-5 mt-[5rem] pb-10 text-center">
        <p className="font-bold md:text-[65px] text-[35px] w-[65%] mx-auto">
          Take your study experience to the next level with Nodsgy
        </p>
        <button
          onClick={scrollToNavbar}
          className="font-semibold text-[22px] bg-yellow py-2 px-4 rounded-3xl cursor-pointer mt-8"
        >
          Try Nodsgy
        </button>
      </div>
    </div>
  );
}
