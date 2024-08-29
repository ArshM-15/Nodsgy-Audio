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

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [createUserDoc, setCreateUserDoc] = useState(false);
  const [numOfTokens, setNumOfTokens] = useState(20);
  const [isMounted, setIsMounted] = useState(false);

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
        const storedTokens = localStorage.getItem("tokens");
        setNumOfTokens(storedTokens ? parseInt(storedTokens, 10) : 20);
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
          const tokens = storedTokens ? parseInt(storedTokens, 10) : 20;

          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userDocRef, {
            username: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            tokens: tokens + 30,
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

  return (
    <div className="md:flex text-center mx-auto items-center justify-between w-[90%] my-7">
      <Image
        src="/long-logo.png"
        width={150}
        height={50}
        alt="logo"
        className="md:mx-0 mx-auto"
      />
      <div className="flex justify-center gap-20 font-normal text-[20px] md:mr-20">
        <ul className="md:my-0 my-5">About</ul>
        <ul className="md:my-0 my-5">Pricing</ul>
        <ul className="md:my-0 my-5">FAQ</ul>
      </div>

      <div className="flex items-center">
        <h2 className="mr-10 font-normal text-[20px]">
          {numOfTokens} tokens left
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
    </div>
  );
}
