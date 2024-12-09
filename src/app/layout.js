import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";
import Head from "next/head";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Nodsgy",
  description:
    "Nodsgy is developed so you can easily understand difficult concepts from your studies. All you have to do is upload your PDF, PowerPoint, or Slides, and Nodsgy will convert them into the simplest explanations you've ever heard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Head>
          <title>Nodsgy</title> {/* Explicitly set the title */}
          <meta
            name="description"
            content="Nodsgy is developed so you can easily understand difficult concepts from your studies. All you have to do is upload your PDF, PowerPoint, or Slides, and Nodsgy will convert them into the simplest explanations you've ever heard."
          />
        </Head>
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
        {/* <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1414881818179517"
          crossorigin="anonymous"
        /> */}
      </head>
      <body className={montserrat.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
