import { useRef, useState, useEffect } from "react";
import { Seekbar } from "react-seekbar";
import { LuShare } from "react-icons/lu";
import { GrPlayFill, GrPauseFill } from "react-icons/gr";

const AudioComponent = ({ src, name, keyPoints }) => {
  const [play, setPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [position, setPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
  const toggleKeyPoints = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4 w-[95%] md:w-[55%] py-7 rounded-xl mx-auto mb-[4rem] shadow-[0px_0px_10px_3px_rgba(0,0,0,0.15)]">
      <p className="font-semibold sm:text-[25px] text-[22px] text-center w-[90%]">
        {name}
      </p>

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
            <GrPlayFill
              className="text-3xl text-black translate-x-[3px]"
              aria-hidden="true"
            />
          ) : (
            <GrPauseFill
              className="text-3xl text-black font-extralight"
              aria-hidden="true"
            />
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
      {/* <p
        onClick={toggleKeyPoints}
        className="cursor-pointer hover:text-gray underline transition duration-200 font-normal text-[20px] flex items-center justify-between w-[88%]"
      > */}
      {/* <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        /> */}
      <p
        onClick={toggleKeyPoints}
        className="mx-auto mt-[1rem] cursor-pointer hover:text-gray underline transition duration-200 font-normal text-[20px]"
      >
        Summary Points
      </p>

      {/* <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        /> */}
      {/* </p> */}
      {isOpen && (
        <ul className="font-normal text-[20px] text-start w-[80%] list-disc ml-5 mt-4">
          {keyPoints
            .split("->")
            .filter((point) => point.trim() !== "")
            .map((point, index) => (
              <li key={index} className="my-3">
                {point.trim()}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AudioComponent;
