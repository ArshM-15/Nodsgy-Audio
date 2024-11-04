import About from "./components/About";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Pricing from "./components/Pricing";

export default function Home() {
  return (
    <div>
      <div>
        <LandingPage />
        <About />
        <Pricing />
        <FAQ />
      </div>
    </div>
  );
}
