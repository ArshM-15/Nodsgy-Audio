import React, { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

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

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={toggleAudio}
        type="button"
        className="mx-auto bg-yellow p-5 w-max rounded-full sm:-my-10 my-5"
      >
        {!play ? (
          <FaPlay
            className="text-3xl text-black translate-x-[3px]"
            aria-hidden="true"
          />
        ) : (
          <FaPause className="text-3xl text-black" aria-hidden="true" />
        )}
      </button>
      <audio ref={oceanRef} loop src={"/explain-nodsgy.mp3"} />
    </div>
  );
};

export default ExplainAudio;
