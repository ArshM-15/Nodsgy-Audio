import React, { useRef, useState, useEffect } from "react";
import { GrPlayFill, GrPauseFill } from "react-icons/gr";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/config";

const ExplainAudio = () => {
  const [play, setPlay] = useState(false);
  const oceanRef = useRef(null);

  const updateAnalytics = async (field) => {
    try {
      const docRef = doc(db, "other-analytics", "numOfTimesClicked");
      await updateDoc(docRef, {
        [field]: increment(1),
      });
    } catch (error) {
      console.error(`Error updating ${field} counter:`, error);
    }
  };

  const toggleAudio = () => {
    if (play) {
      oceanRef.current?.pause();
      setPlay(false);
      updateAnalytics("pauseButton");
    } else {
      oceanRef.current?.play();
      setPlay(true);
      updateAnalytics("playButton");
    }
  };

  useEffect(() => {
    const audio = oceanRef.current;

    const handleAudioEnd = () => {
      setPlay(false);
    };

    if (audio) {
      audio.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={toggleAudio}
        type="button"
        className="mx-auto bg-yellow p-5 w-max rounded-full sm:-my-10 my-5"
      >
        {!play ? (
          <GrPlayFill
            className="text-3xl text-black translate-x-[3px]"
            aria-hidden="true"
          />
        ) : (
          <GrPauseFill className="text-3xl text-black" aria-hidden="true" />
        )}
      </button>
      <audio ref={oceanRef} loop={false} src={"/explain-nodsgy.mp3"} />
    </div>
  );
};

export default ExplainAudio;
