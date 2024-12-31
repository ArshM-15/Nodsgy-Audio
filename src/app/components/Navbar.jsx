"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import Image from "next/image";
import { auth, db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname from next/navigation

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [createUserDoc, setCreateUserDoc] = useState(false);
  const [numOfCredits, setNumOfCredits] = useState(2);
  const [isMounted, setIsMounted] = useState(false);
  // const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        let storedCredits = localStorage.getItem("credits");

        if (storedCredits === null) {
          localStorage.setItem("credits", 0);
          setNumOfCredits(0);
        } else {
          setNumOfCredits(parseInt(storedCredits, 10));
        }
      } catch (error) {
        console.error("Error reading credits from local storage:", error);
      }
    }
  }, [isMounted]);

  const checkCredits = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const currentCredits = userData.credits;
        setNumOfCredits(currentCredits);

        localStorage.setItem("credits", currentCredits);
      }
    } catch (error) {
      console.error("Error fetching credits from Firestore:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkCredits();
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setCreateUserDoc(true);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  useEffect(() => {
    if (!createUserDoc) return;

    const createUserInFirestore = async (currentUser) => {
      if (!auth.currentUser) return;

      try {
        const emailQuery = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(emailQuery);

        if (querySnapshot.empty) {
          const storedCredits = localStorage.getItem("credits");
          const credits = storedCredits ? parseInt(storedCredits, 10) : 0;

          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userDocRef, {
            username: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            credits: credits,
            amountSpent: 0,
            amountOfTimesPayed: 0,
          });

          // localStorage.setItem("credits", credits + 3);
          // setNumOfCredits(credits + 3);
        } else {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setNumOfCredits(userData.credits);
            localStorage.setItem("credits", userData.credits);
          });
        }
      } catch (error) {
        console.error("Error checking or creating user in Firestore:", error);
      }
    };

    createUserInFirestore(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserDoc]);

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

  const handleNavigation = (id) => {
    if (pathname !== "/") {
      // Navigate to the homepage
      router.push("/");
    }
    // Use setTimeout to allow time for navigation before scrolling
    setTimeout(() => scrollToComponent(id), 0);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="md:flex text-center mx-auto items-center justify-between w-[90%] my-7"
      id="navbar"
    >
      <div className="md:flex block">
        <Link href="/">
          <Image
            src="/long-title.png"
            width={150}
            height={50}
            alt="logo"
            className="md:mx-0 mx-auto cursor-pointer"
          />
        </Link>

        <div className="flex justify-center gap-[3rem] font-normal text-[20px] mx-auto md:translate-x-7 md:ml-5 ml-0">
          <button
            onClick={() => handleNavigation("about")}
            className="md:my-0 my-5 hover:text-gray transition duration-200"
          >
            About
          </button>
          <button
            onClick={() => handleNavigation("pricing")}
            className="md:my-0 my-5 hover:text-gray transition duration-200"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavigation("faq")}
            className="md:my-0 my-5 hover:text-gray transition duration-200"
          >
            FAQ
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="flex items-center justify-center md:justify-normal">
          <h2 className="mr-3 font-normal text-[20px]">
            <div className="flex items-center">
              <p className="font-semibold">{numOfCredits}</p>
              <Image
                src="/credit-image.png"
                width={40}
                height={40}
                alt="credit"
                className="ml-1"
              />
            </div>
          </h2>
          {user ? (
            <div className="flex items-center">
              <button
                className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl mr-5"
                onClick={() => handleNavigation("pricing")}
              >
                Buy Credits
              </button>
              <Image
                src={user.photoURL}
                width={50}
                height={50}
                alt="User Profile"
                className="rounded-full"
              />
            </div>
          ) : (
              <button
                className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl"
                onClick={handleSignIn}
              >
                Sign In
              </button>
          )}
        </div>
      )}
    </div>
  );
}
