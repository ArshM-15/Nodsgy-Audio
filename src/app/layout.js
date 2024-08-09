import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Nodsgy",
  description:
    "Nodsgy is developed so you can easily understand difficult concepts from your studies. It convert your notes into easy to understand audio explanations. Upload your materials and enjoy personalized audio notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
