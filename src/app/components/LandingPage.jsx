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
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import ExplainAudio from "./ExplainAudio";
import AudioComponent from "./AudioComponent";
import { onAuthStateChanged } from "firebase/auth";
import LandingPageHeader from "./LandingPageHeader";
import Script from "next/script";

export default function LandingPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioFilesTitles, setAudioFilesTitles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [displayAudioFiles, setDisplayAudioFiles] = useState(false);
  const [customId, setCustomId] = useState();
  const [isClient, setIsClient] = useState(false);
  const [loadTitles, setLoadTitles] = useState(false);
  const [numOfCredits, setNumOfCredits] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numOfChunks, setNumOfChunks] = useState(null);
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);
  const [numOfUsers, setNumOfUsers] = useState();
  const [numOfAudioFiles, setNumOfAudioFiles] = useState();
  const [inputValue, setInputValue] = useState(null);
  const [audioFileCreatedUsingInput, setAudioFileCreatedUsingInput] =
    useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved state from localStorage on initial render
  useEffect(() => {
    if (!isClient) return;

    // Only load from localStorage if we don't have a new file or input
    if (!selectedFile && !inputValue) {
      const storedAudioFiles = localStorage.getItem("audioFiles");
      const storedCustomId = localStorage.getItem("customId");

      if (storedAudioFiles && storedCustomId) {
        setAudioFiles(JSON.parse(storedAudioFiles));
        setCustomId(storedCustomId);
      }
    }
  }, [isClient, selectedFile, inputValue]);

  useEffect(() => {
    if (!isClient) return;

    const storedAudioFiles = localStorage.getItem("audioFiles");
    const storedCustomId = localStorage.getItem("customId");
    const storedGenerationStatus = localStorage.getItem("generationStatus");
    
    if (storedAudioFiles && storedCustomId) {
      const parsedAudioFiles = JSON.parse(storedAudioFiles);
      setAudioFiles(parsedAudioFiles);
      setCustomId(storedCustomId);
      
      // Check if the previous generation was incomplete
      if (storedGenerationStatus === "incomplete") {
        setIsGenerationIncomplete(true);
        // Clear generation status to prevent repeated warnings
        localStorage.removeItem("generationStatus");
      }
    }
  }, [isClient]);

  const clearPreviousState = () => {
    localStorage.removeItem("audioFiles");
    localStorage.removeItem("customId");
    localStorage.removeItem("inputValue");
    setAudioFiles([]);
    setDisplayAudioFiles(false);
  };

  const handleFileChange = (event) => {
    if (numOfCredits - 3 < 0) {
      alert(
        "You do not have enough credits. You can purchase credits from the pricing section."
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

    clearPreviousState();
    setSelectedFile(file);
    setCustomId(uuidv4());
    setInputValue(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (numOfCredits - 1 < 0) {
        alert(
          "You do not have enough credits. You can purchase credits from the pricing section."
        );
        return;
      }

      clearPreviousState();
      setSelectedFile(null);
      setInputValue(event.target.value);
      setCustomId(uuidv4());
    }
  };
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return;

    if (audioFiles.length > 0) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
    if (customId) {
      localStorage.setItem("customId", customId);
    }
    if (inputValue) {
      localStorage.setItem("inputValue", inputValue);
    }
  }, [audioFiles, customId, inputValue, isClient]);

  const checkCredits = async () => {
    if (user) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const currentCredits = userData.credits;
        setNumOfCredits(currentCredits);
      }
    } else {
      const localCredits = parseInt(localStorage.getItem("credits"), 10) || 0;
      setNumOfCredits(localCredits);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        checkCredits();
      } else {
        setUser(null);
        checkCredits();
      }
      setIsClient(true);
    });
    return () => unsubscribe();
  });

  // const handleFileChange = (event) => {
  //   if (numOfCredits - 3 < 0) {
  //     alert(
  //       "You do not have enough credits. You can purchase credits from the pricing section."
  //     );
  //     return;
  //   }

  //   const file = event.target.files[0];
  //   const supportedFormats = ["pptx", "xlsx", "odt", "odp", "ods", "pdf"];
  //   const fileExtension = file.name.split(".").pop().toLowerCase();

  //   if (!supportedFormats.includes(fileExtension)) {
  //     alert(
  //       `File type .${fileExtension} is not supported. Please upload one of the following: pptx, xlsx, odt, odp, ods, pdf.`
  //     );
  //     return;
  //   }

  //   // Clear previous state when uploading a new file
  //   localStorage.removeItem("inputValue");
  //   setInputValue(null);
  //   setSelectedFile(file);
  //   const newCustomId = uuidv4();
  //   setCustomId(newCustomId);
  //   setAudioFiles([]);
  // };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     if (numOfCredits - 1 < 0) {
  //       alert(
  //         "You do not have enough credits. You can purchase credits from the pricing section."
  //       );
  //       return;
  //     }

  //     const newInputValue = event.target.value;
  //     // Clear previous state when entering new text
  //     localStorage.removeItem("audioFiles");
  //     setSelectedFile(null);
  //     setInputValue(newInputValue);
  //     const newCustomId = uuidv4();
  //     setCustomId(newCustomId);
  //     setAudioFiles([]);
  //   }
  // };
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
        alert("There is an error. Refresh and retry.");
      }
    }

    if (inputValue !== null) {
      handleInputValue(inputValue);
    }
    async function handleInputValue(inputValue) {
      if (inputValue == null) return;

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
      formData.append("inputValue", inputValue);

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
        createAudioFiles(titlesData.titles, inputValue);
      } catch (error) {
        alert("There is an error. Refresh and retry.");
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
        setAudioFileCreatedUsingInput(true);
      } catch (error) {
        console.error("Failed to create audio files:", error);
      } finally {
        setIsCreatingAudio(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, inputValue]);

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

  const deductCredits = async () => {
    if (user) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        if (numOfCredits >= 1) {
          if (!selectedFile) {
            await updateDoc(userDocRef, {
              credits: numOfCredits - 1,
            });
            setNumOfCredits(numOfCredits - 1);
          } else {
            await updateDoc(userDocRef, {
              credits: numOfCredits - 3,
            });
            setNumOfCredits(numOfCredits - 3);
          }
        }
      } catch (error) {
        console.error("Error updating credits:", error);
      }
      checkCredits();
    } else {
      const localCredits = parseInt(localStorage.getItem("credits"), 10) || 0;
      if (localCredits >= 1) {
        if (!selectedFile) {
          localStorage.setItem("credits", localCredits - 1);
          setNumOfCredits(localCredits - 1);
        } else {
          localStorage.setItem("credits", localCredits - 3);
          setNumOfCredits(localCredits - 3);
        }
      } else {
        alert("You do not have enough credits");
      }
      checkCredits();
    }
  };

  useEffect(() => {
    if (audioFiles.length > 0 && audioFiles == numOfChunks) {
      localStorage.setItem("audioFiles", JSON.stringify(audioFiles));
    }
    if (audioFiles.length == numOfChunks && displayAudioFiles === true) {
      deductCredits();
      setDisplayAudioFiles(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFiles]);

  useEffect(() => {
    if (!audioFileCreatedUsingInput) return;
    if (audioFileCreatedUsingInput && !selectedFile) {
      deductCredits();
      setAudioFileCreatedUsingInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFileCreatedUsingInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   // Initialize Firebase

  //   const fetchCounts = async () => {
  //     try {
  //       const usersSnapshot = await getDocs(collection(db, "users"));
  //       setNumOfUsers(usersSnapshot.size);
  //       const audioFilesSnapshot = await getDocs(collection(db, "audioFiles"));
  //       setNumOfAudioFiles(audioFilesSnapshot.size);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchCounts();
  // }, []);

  return (
    <div>
      <div className="animate-slideInFromBottom">
        <LandingPageHeader />
        <div className="animate-slideInFromBottom text-center">
          <input
            className="w-[90%] md:w-[55%] bg-lightGray py-2 px-[1rem] rounded-3xl mt-8 focus:outline-none text-center text-[22px] font-medium"
            placeholder='"How did WWI and WWII happen?" then press "Enter"'
            onKeyPress={handleKeyPress}
            maxLength={1000}
          />
          <div className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[60%] w-[90%] mt-5 text-center">
            OR
            <br /> upload your document for a longer explanation
          </div>
          <div className="block mt-10">
            <label
              htmlFor="file-upload"
              className="font-medium text-[20px] bg-yellow py-3 px-4 rounded-3xl mt-10 cursor-pointer"
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
        <h3 className="text-center font-semibold text-[35px] mt-[5rem]">
          {/* Join <span className="text-yellow">{numOfUsers}</span> users creating{" "} */}
          {/* <span className="text-yellow">{numOfAudioFiles}</span> audio files so */}
          Join <span className="text-yellow">325</span> users creating{" "}
          <span className="text-yellow">5392</span> audio files so far!
        </h3>
      </div>
      {/* <Script
        id="adsense-script-horizontal"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1414881818179517"
        crossorigin="anonymous"
      />

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1414881818179517"
        data-ad-slot="1965079168"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="google-ads">
        {`
    (adsbygoogle = window.adsbygoogle || []).push({});
  `}
      </Script> */}

      {isClient ? (
        <>
          <div className="mt-[5rem]">
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
              <>
                <Image
                  src={"loading-spinner.svg"}
                  width={100}
                  height={10}
                  alt="loading spinner"
                  className="mx-auto pt-10"
                />
                <p className="mt-5 text-center">
                  If an error occurs while generating, refresh the page and try
                  again.
                </p>
              </>
            ) : (
              <div>
                <ul>
                  {audioFilesTitles.map((title, index) => (
                    <>
                      <div>
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
                      </div>
                    </>
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
