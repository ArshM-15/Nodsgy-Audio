import Image from "next/image";

export default function About() {
  return (
    <div>
      <div>
        <Image
          src="/about-title.png"
          width={140}
          height={40}
          className="mx-auto"
        />
        <h2 className="text-gray font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[60%] w-[90%] mt-3 text-center">
          A little more about Nodsgy
        </h2>
      </div>
      <div className="flex">
        <div>
          <p className="text-black font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[90%] w-[90%] mt-3 text-center">
            Nodsgy is developed so you can understand difficult concepts from
            your studies more easily
          </p>
        </div>
        <div>
          <p className="text-black font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[90%] w-[90%] mt-3 text-center">
            Convert your slides, powerpoint, pdf, into consise and easy to
            understand audio explanations
          </p>
        </div>
        <div>
          <p className="text-black font-semibold sm:text-[25px] text-[22px] mx-auto sm:w-[90%] w-[90%] mt-3 text-center">
            Upload your materials and enjoy personalized audio notes tailored to
            your learning style
          </p>
        </div>
      </div>
    </div>
  );
}
