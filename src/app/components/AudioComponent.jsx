import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { Seekbar } from "react-seekbar";
import { LuShare } from "react-icons/lu";

const AudioComponent = ({ src, name }) => {
  const [play, setPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [position, setPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    const audio = audioRef.current;

    if (play) {
      audio.pause();
    } else {
      audio.play();
    }

    setPlay(!play);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const changeSpeed = () => {
    let newSpeed;
    if (playbackSpeed === 0.5) {
      newSpeed = 1;
    } else if (playbackSpeed === 1) {
      newSpeed = 1.5;
    } else if (playbackSpeed === 1.5) {
      newSpeed = 2;
    } else {
      newSpeed = 0.5;
    }
    setPlaybackSpeed(newSpeed);
    audioRef.current.playbackRate = newSpeed;
  };

  const exportAudio = () => {
    const audioUrl = audioRef.current.src;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeek = (newPosition) => {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration * newPosition) / 100;
    setPosition(newPosition);
  };

  const handleAudioEnd = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setPlay(false);
    setPosition(0);
    setCurrentTime(0);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updatePosition = () => {
      const currentPos = (audio.currentTime / audio.duration) * 100;
      setPosition(currentPos);
      setCurrentTime(audio.currentTime);
    };
    setAudioDuration(audio.duration);

    const updateDuration = () => {
      setAudioDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updatePosition);
    audio.addEventListener("timeupdate", updateDuration);
    audio.addEventListener("ended", handleAudioEnd);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updatePosition);
      audio.removeEventListener("timeupdate", updateDuration);
      audio.removeEventListener("ended", handleAudioEnd);
      audio.addEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-4 shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)] w-[95%] md:w-[50%] py-5 rounded-xl mx-auto mt-10">
      <p className="font-semibold text-[20px] text-center">{name}</p>
      <div className="flex items-center space-x-2">
        <span className="w-8">{formatTime(currentTime)}</span>
        <Seekbar
          position={position}
          duration={100}
          onSeek={handleSeek}
          className="custom-seekbar"
        />
        <span className="w-8">{formatTime(audioDuration)}</span>
      </div>
      <div className="flex justify-between items-center w-[90%]">
        <button
          onClick={changeSpeed}
          type="button"
          className="bg-yellow px-[15px] py-[10px] rounded-full w-11 text-center font-medium"
        >
          <p
            className={`${
              playbackSpeed === 1.5 || playbackSpeed === 0.5
                ? "translate-x-[-7px]"
                : ""
            }`}
          >
            {playbackSpeed}x
          </p>
        </button>

        <button
          onClick={toggleAudio}
          type="button"
          className="bg-yellow p-5 w-max rounded-full"
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
        <button
          onClick={exportAudio}
          type="button"
          className="bg-yellow p-3 rounded-full"
        >
          <LuShare className="text-xl text-black" />
        </button>

        <audio ref={audioRef} src={src} />
      </div>
    </div>
  );
};

export default AudioComponent;
