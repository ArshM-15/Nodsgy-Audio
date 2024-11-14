"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname from next/navigation
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  const scrollToComponent = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleContactClick = () => {
    window.location.href = "mailto:creatorofnodsgy@gmail.com";
  };

  const handleNavigation = (id) => {
    if (pathname !== "/") {
      // Navigate to the homepage
      router.push("/");
    }
    // Use setTimeout to allow time for navigation before scrolling
    setTimeout(() => scrollToComponent(id), 0);
  };

  return (
    <div className="bg-faintyellow">
      <div className="md:flex flex-none justify-between w-[80%] mx-auto pt-10 md:pt-0 pb-10">
        <div className="mt-8">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/long-title.png"
              width={140}
              height={40}
              className="mx-auto md:mx-0"
              alt="logo"
            />
          </Link>
          <div className="flex justify-between mt-5">
            <Link href="https://www.linkedin.com/in/arshvir-mundi/">
              <FaLinkedinIn className="text-2xl" />
            </Link>
            <Link href="https://x.com/Nodsgy">
              <FaXTwitter className="text-2xl" />
            </Link>

            <Link href="https://www.youtube.com/channel/UC1x2t5XUBA6h95BWnE3pz2w">
              <FaYoutube className="text-2xl" />
            </Link>
          </div>
        </div>

        <div className="md:flex flex-none mt-10 md:mt-0">
          <div className="mr-[5rem] text-[20px]">
            <h2 className="mt-5 font-bold">INFORMATION</h2>
            <button
              onClick={() => handleNavigation("about")}
              className="hover:text-gray transition duration-200 mt-3 block"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("pricing")}
              className="hover:text-gray transition duration-200 block"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavigation("faq")}
              className="hover:text-gray transition duration-200 block"
            >
              FAQ
            </button>
            <button
              onClick={handleContactClick}
              className="hover:text-gray transition duration-200 block"
            >
              Contact
            </button>
          </div>
          <div className="text-[20px]">
            <h2 className="mt-5 font-bold">LEGAL</h2>
            <Link
              className="mt-3 hover:text-gray transition duration-200 block"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              // href="/terms-and-conditions"
              href="/"
              className="hover:text-gray transition duration-200 block"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
