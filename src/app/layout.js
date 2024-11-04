import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Nodsgy",
  description:
    "Nodsgy is developed so you can easily understand difficult concepts from your studies. It converts your notes into easy-to-understand audio explanations. Upload your materials and enjoy personalized audio notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CODE}`} // Correct usage with template literals
        />
        <Script id="google-analytics">
          {`
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
         
           gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CODE}'); // Correct usage
          `}
        </Script>
      </head>
      <body className={montserrat.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
