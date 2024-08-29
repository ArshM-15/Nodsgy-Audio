"use client";
import { useState, useEffect } from "react";
import { fileStorage, db, auth } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { OpenAI } from "openai";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import ExplainAudio from "./ExplainAudio";
import AudioComponent from "./AudioComponent";
import { onAuthStateChanged } from "firebase/auth";
import LandingPageHeader from "./LandingPageHeader";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function LandingPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioFilesTitles, setAudioFilesTitles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [displayAudioFiles, setDisplayAudioFiles] = useState(false);
  const [customId, setCustomId] = useState();
  const [isClient, setIsClient] = useState(false);
  const [loadTitles, setLoadTitles] = useState(false);
  const [numOfTokens, setNumOfTokens] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkTokens = async () => {
    if (user) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const currentTokens = userData.tokens;
        setNumOfTokens(currentTokens);
      }
    } else {
      const localTokens = parseInt(localStorage.getItem("tokens"), 10) || 0;
      setNumOfTokens(localTokens);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        checkTokens();
      } else {
        setUser(null);
        checkTokens();
      }
      setIsClient(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedAudioFiles = localStorage.getItem("audioFiles");
    if (storedAudioFiles) {
      setAudioFiles(JSON.parse(storedAudioFiles));
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (audioFiles.length > 0) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
  }, [audioFiles, isClient]);

  const handleFileChange = (event) => {
    if (numOfTokens - 10 < 0) {
      alert(
        "You do not have enough tokens. Create an account to receive 30 FREE tokens"
      );
      return;
    }
    const file = event.target.files[0];
    setSelectedFile(file);
    setCustomId(uuidv4());
    setAudioFiles([]);
  };

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }

    async function handleFileUpload(selectedFile) {
      if (!selectedFile) return;

      console.log(audioFiles.length);
      setLoadTitles(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to extract text from the file.");
        }

        const data = await response.json();
        const extractedText = data.text;
        await createSubtopicsAudio(extractedText);
      } catch (error) {
        console.log(error);
      }
    }

    async function createSubtopicsAudio(text) {
      const subtopics = await generateSubtopics(text);

      setAudioFilesTitles(subtopics);
      window.scrollTo({
        top: window.scrollY + 500,
        behavior: "smooth",
      });
      setLoadTitles(false);

      for (const subtopic of subtopics) {
        await createAudioForSubtopic(subtopic);
      }
    }

    async function generateSubtopics(text) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Generate relevant subtopics from the following content. Generate a maximum of 5 subtopics. Ensure that the subtopics are in order to the given content and make sure they cover everything in the content. Subtopics should only be about the concepts in the content, nothing else. They shouldn't be about, a video resource, or assignments, or anything else that is not a teachable concept in the content.",
          },
          { role: "user", content: text },
        ],
        model: "gpt-4o-mini",
      });

      const subtopicResponse = completion.choices[0].message.content;
      const subtopics = subtopicResponse
        .split("\n")
        .filter((t) => t.trim())
        .slice(0, 5);

      console.log("Generated Subtopics:", subtopics);
      return subtopics;
    }

    async function createAudioForSubtopic(subtopic) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Provide a detailed explanation of the following subtopic. Talk like how a human talks, use human-like words, and add a few extra commas. No need to create an opening sentence, just dive straight into the topic. Don't go over 400 words:",
          },
          { role: "user", content: subtopic },
        ],
        model: "gpt-4o-mini",
      });

      const subtopicText = completion.choices[0].message.content;
      await textToSpeech(subtopicText, subtopic);
    }

    async function textToSpeech(writtenResponse, subtopic) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: writtenResponse,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());

      const audioRef = ref(fileStorage, `audioFiles/${subtopic}.mp3`);

      await uploadBytes(audioRef, buffer);

      const downloadURL = await getDownloadURL(audioRef);
      const customDocId = `${customId}_${subtopic}`;
      console.log(customId);

      const docRef = doc(collection(db, "audioFiles"));

      await setDoc(docRef, {
        name: customDocId,
        url: downloadURL,
        createdAt: new Date(),
      });

      setDisplayAudioFiles(true);
    }
  }, [selectedFile]);

  useEffect(() => {
    const audioFilesRef = collection(db, "audioFiles");

    const unsubscribe = onSnapshot(
      query(audioFilesRef, orderBy("createdAt", "asc")),
      (snapshot) => {
        const files = snapshot.docs
          .map((doc) => doc.data())
          .filter((file) => file.name.slice(0, 36) === customId);

        if (files.length > audioFiles.length) {
          setAudioFilesTitles((prevTitles) => prevTitles.slice(1));
          setAudioFiles(files);
        }
      }
    );
    if (audioFiles.length === 5 && displayAudioFiles === true) {
      deductTokens();
    }

    setDisplayAudioFiles(false);

    return () => unsubscribe();
  }, [displayAudioFiles]);

  const deductTokens = async () => {
    if (user) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        if (numOfTokens >= 10) {
          await updateDoc(userDocRef, {
            tokens: numOfTokens - 10,
          });
          setNumOfTokens(numOfTokens - 10);
          console.log("Tokens deducted by 10");
        }
      } catch (error) {
        console.error("Error updating tokens:", error);
      }
    } else {
      const localTokens = parseInt(localStorage.getItem("tokens"), 10) || 0;
      if (localTokens >= 10) {
        localStorage.setItem("tokens", localTokens - 10);
        setNumOfTokens(localTokens - 10);
        console.log("Tokens deducted by 10 from local storage");
      } else {
        alert("You do not have enough tokens");
      }
    }
  };

  useEffect(() => {
    if (audioFiles.length > 0) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
  }, [audioFiles]);
  return (
    <div className="md:mt-40 mt-10">
      <LandingPageHeader />
      <div className="flex justify-center">
        <label
          htmlFor="file-upload"
          className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl mt-10 cursor-pointer"
        >
          Upload a File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf, .pptx, .ppt"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p
        className="font-normal text-[20px] text-center mt-8
            rotate-0 sm:rotate-[345deg] w-28 mx-auto sm:translate-x-[-10rem] translate-x-0"
      >
        Still
        <br />
        confused?
      </p>
      <Image
        src="/home-arrow.png"
        width={100}
        height={50}
        alt="arrow"
        className="mx-auto translate-x-[-90px] hidden sm:block"
      />
      <ExplainAudio />

      {isClient ? (
        <>
          <div className="audio-files mt-[10rem]">
            {/* {audioFiles.length > 0 &&
              audioFiles.map((file, index) => (
                <div key={index} className="audio-file mb-4">
                  <AudioComponent src={file.url} name={file.name.slice(37)} />
                </div>
              ))} */}

            {loadTitles ? (
              <Image
                src={"loading-spinner.svg"}
                width={100}
                height={10}
                alt="loading spinner"
                className="mx-auto pt-10"
              />
            ) : (
              <div>
                <ul>
                  {audioFilesTitles.map((title, index) => (
                    <div className="flex mt-10 font-semibold text-[20px] w-[95%] md:w-[50%] px-4 py-3  mx-auto rounded-xl shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)]">
                      <li key={index}>{title}</li>
                      <Image
                        src="subititle-loading.svg"
                        width={30}
                        height={10}
                        alt="subtitle is loading"
                        className="ml-2 translate-y-[5px]"
                      />
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <Image
          src={"loading-spinner.svg"}
          width={100}
          height={10}
          alt="loading spinner"
          className="mx-auto pt-10"
        />
      )}
    </div>
  );
}
