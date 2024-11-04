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

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [createUserDoc, setCreateUserDoc] = useState(false);
  const [numOfTokens, setNumOfTokens] = useState(30);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        let storedTokens = localStorage.getItem("tokens");

        if (storedTokens === null) {
          localStorage.setItem("tokens", 30);
          setNumOfTokens(30);
        } else {
          setNumOfTokens(parseInt(storedTokens, 10));
        }
      } catch (error) {
        console.error("Error reading tokens from local storage:", error);
      }
    }
  }, [isMounted]);

  const checkTokens = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const currentTokens = userData.tokens;
        setNumOfTokens(currentTokens);

        localStorage.setItem("tokens", currentTokens);
      }
    } catch (error) {
      console.error("Error fetching tokens from Firestore:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkTokens();
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
          const storedTokens = localStorage.getItem("tokens");
          const tokens = storedTokens ? parseInt(storedTokens, 10) : 30;

          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userDocRef, {
            username: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            tokens: tokens + 30,
            amountSpent: 0,
            amountOfTimesPayed: 0,
          });

          localStorage.setItem("tokens", tokens + 30);
          setNumOfTokens(tokens + 30);
        } else {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setNumOfTokens(userData.tokens);
            localStorage.setItem("tokens", userData.tokens);
          });
        }
      } catch (error) {
        console.error("Error checking or creating user in Firestore:", error);
      }
    };

    createUserInFirestore(user);
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
      <Link href="/">
        <Image
          src="/long-title.png"
          width={150}
          height={50}
          alt="logo"
          className="md:mx-0 mx-auto cursor-pointer"
        />
      </Link>

      <div className="flex justify-center gap-[2rem] md:gap-[3rem] lg:gap-[5rem] font-normal text-[20px] mx-auto md:translate-x-7">
        <button
          onClick={() => scrollToComponent("about")}
          className="md:my-0 my-5 hover:text-gray transition duration-200"
        >
          About
        </button>
        <button
          onClick={() => scrollToComponent("pricing")}
          className="md:my-0 my-5 hover:text-gray transition duration-200"
        >
          Pricing
        </button>
        <button
          onClick={() => scrollToComponent("faq")}
          className="md:my-0 my-5 hover:text-gray transition duration-200"
        >
          FAQ
        </button>
      </div>

      {!isLoading && (
        <div className="flex items-center justify-center md:justify-normal">
          <h2 className="mr-5 font-normal text-[20px]">
            {numOfTokens} Tokens Left
          </h2>
          {user ? (
            <Image
              src={user.photoURL}
              width={50}
              height={50}
              alt="User Profile"
              className="rounded-full"
            />
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
