"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import ExplainAudio from "./ExplainAudio";
import AudioComponent from "./AudioComponent";
import { onAuthStateChanged } from "firebase/auth";
import LandingPageHeader from "./LandingPageHeader";

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
  const [isLoading, setIsLoading] = useState(true);
  const [numOfChunks, setNumOfChunks] = useState(null);
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);

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
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isClient) return;
    const storedAudioFiles = localStorage.getItem("audioFiles");
    if (storedAudioFiles) {
      setAudioFiles(JSON.parse(storedAudioFiles));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (audioFiles.length == numOfChunks) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFiles, isClient]);

  const handleFileChange = (event) => {
    if (numOfTokens - 10 < 0) {
      alert(
        "You do not have enough tokens. You can purchase tokens from the pricing section. If you have not already, claim 30 FREE tokens when you create an account."
      );
      return;
    }

    const file = event.target.files[0];

    const supportedFormats = ["pptx", "xlsx", "odt", "odp", "ods", "pdf"];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!supportedFormats.includes(fileExtension)) {
      alert(
        `File type .${fileExtension} is not supported. Please upload one of the following: pptx, xlsx, odt, odp, ods, pdf.`
      );
      return;
    }

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

      // Check for local storage availability
      if (typeof Storage === "undefined") {
        alert("You must create an account because you have local storage off.");
        return; // Exit the function if local storage is not available
      }

      window.scrollBy({
        top: 500,
        behavior: "smooth",
      });

      setLoadTitles(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const responseTitles = await fetch("/api/audioTitles", {
          method: "POST",
          body: formData,
        });
        if (!responseTitles.ok) {
          throw new Error("Failed to fetch audio titles.");
        }
        setLoadTitles(false);
        const titlesData = await responseTitles.json();
        setAudioFilesTitles(titlesData.titles);
        setNumOfChunks(titlesData.numOfChunks);
        createAudioFiles(titlesData.titles, titlesData.chunks);
      } catch (error) {
        alert("There is an error. Refresh to retry.");
      }
    }

    const createAudioFiles = async (titles, chunks) => {
      if (isCreatingAudio) {
        alert("Audio creation is already in progress. Please wait.");
        return;
      }

      setIsCreatingAudio(true);

      try {
        const response = await fetch("/api/audioFiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titles: titles,
            customId: customId,
            chunks: chunks,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });

          const events = result.split("\n\n");
          events.forEach((event) => {
            if (event.startsWith("data: ")) {
              const jsonData = event.slice(6);
              try {
                const data = JSON.parse(jsonData);
                if (data.success) {
                  setDisplayAudioFiles(true);
                } else if (data.error) {
                  console.error("Error during audio creation:", data.error);
                }
              } catch (parseError) {
                console.error("Failed to parse event data:", parseError);
              }
            }
          });
        }
      } catch (error) {
        console.error("Failed to create audio files:", error);
      } finally {
        setIsCreatingAudio(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  useEffect(() => {
    if (displayAudioFiles) {
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

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayAudioFiles]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isCreatingAudio) {
        // Alert the user
        event.preventDefault();
        event.returnValue =
          "Audio creation is in progress. Are you sure you want to leave or reload the page?";
      }
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when component is unmounted or when API call is done
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCreatingAudio]); // Runs whenever isCreatingAudio changes

  const deductTokens = async () => {
    if (user) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        if (numOfTokens >= 10) {
          await updateDoc(userDocRef, {
            tokens: numOfTokens - 10,
          });
          setNumOfTokens(numOfTokens - 10);
        }
      } catch (error) {
        console.error("Error updating tokens:", error);
      }
      checkTokens();
    } else {
      const localTokens = parseInt(localStorage.getItem("tokens"), 10) || 0;
      if (localTokens >= 10) {
        localStorage.setItem("tokens", localTokens - 10);
        setNumOfTokens(localTokens - 10);
      } else {
        alert("You do not have enough tokens");
      }
      checkTokens();
    }
  };

  useEffect(() => {
    if (audioFiles.length > 0 && audioFiles == numOfChunks) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
    if (audioFiles.length == numOfChunks && displayAudioFiles === true) {
      deductTokens();
      setDisplayAudioFiles(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFiles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="animate-slideInFromBottom">
        <LandingPageHeader />
        <div className="flex justify-center animate-slideInFromBottom">
          <label
            htmlFor="file-upload"
            className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl mt-10 cursor-pointer"
          >
            Upload a File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf, .pptx, .txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p
          className="font-normal text-[20px] text-center mt-8 
            rotate-0 sm:rotate-[345deg] w-28 mx-auto sm:translate-x-[-10rem] translate-x-0 leading-6"
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
      </div>
      {!user && !isLoading && (
        <h2 className="font-semibold sm:text-[25px] text-[20px] bg-faintyellow pt-5 pb-5 text-center mt-[5rem] group">
          <span className="inline-block transition-transform transform group-hover:animate-confetti">
            🎉
          </span>
          <span className="mx-5">
            Get 30 Tokens for FREE when you create an account
          </span>
          <span className="inline-block transition-transform transform group-hover:animate-confetti">
            🎉
          </span>
        </h2>
      )}

      {isClient ? (
        <>
          <div className="mt-[8rem]">
            {audioFiles.length > 0 &&
              audioFiles.map((file, index) => (
                <div key={index} className="audio-file mb-4">
                  <AudioComponent
                    src={file.url}
                    name={file.name.slice(37)}
                    keyPoints={file.keyPoints}
                  />
                </div>
              ))}

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
                    <>
                      <div
                        key={index}
                        className="mt-10 font-semibold text-[20px] w-[95%] md:w-[55%] px-4 py-3 mx-auto rounded-xl shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)]"
                      >
                        <li>
                          {title}
                          <span className="inline-block ml-2">
                            <Image
                              src="subititle-loading.svg"
                              width={30}
                              height={10}
                              alt="subtitle is loading"
                              className="translate-y-[11px]"
                            />
                          </span>
                        </li>
                      </div>
                    </>
                  ))}
                  <li>
                    <p className="mt-5 text-center">
                      If an error occurs while generating, refresh the page and
                      try again.
                    </p>
                  </li>
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
