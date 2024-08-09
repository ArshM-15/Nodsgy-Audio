import Image from "next/image";
import { FaPlay } from "react-icons/fa";

export default function Home() {
  return (
    <div className="md:mt-40 mt-10">
      <h1 className="font-bold sm:text-[35px] text-[32px] text-center">
        Create audio explanations from your
        <span className="text-yellow"> Notes</span>
      </h1>
      <h2 className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[60%] w-[90%] mt-5 text-center">
        Simply upload your PDF, PowerPoint, slides and Nodsgy will convert them
        into clear and straightforward audio explanations
      </h2>
      <div className="flex justify-center">
        <button className="font-medium text-[20px] bg-yellow py-2 px-4 rounded-3xl mt-10">
          Upload a File
        </button>
      </div>
      <p
        className="font-normal text-[20px] text-center mt-8 
         rotate-0 translate-x-0 sm:rotate-[345deg] sm:translate-x-[-170px]"
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
      <div className="bg-yellow p-5 w-max rounded-full mx-auto sm:-my-10 my-5 ">
        <FaPlay className="text-3xl text-black translate-x-[3px]" />
      </div>
    </div>
  );
}
