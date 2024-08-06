import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/long-logo.png"
        width={200}
        height={50}
        alt="logo"
        className="-translate-y-40"
      />

      <h1 className="font-bold text-[35px] mb-10 text-center">
        Create audio explanations from your
        <span className="text-yellow"> Notes</span>
      </h1>

      <h2 className="font-light text-[25px] text-center mt-20">
        Coming Soon...
      </h2>
    </div>
  );
}
