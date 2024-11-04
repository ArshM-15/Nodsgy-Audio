import React, { useRef, useState, useEffect } from "react";
import { GrPlayFill, GrPauseFill } from "react-icons/gr";

const ExplainAudio = () => {
  const [play, setPlay] = useState(false);
  const oceanRef = useRef(null);

  function toggleAudio() {
    if (play) {
      oceanRef.current?.pause();
      setPlay(false);
    } else {
      oceanRef.current?.play();
      setPlay(true);
    }
  }

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
