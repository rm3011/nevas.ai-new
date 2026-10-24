import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import YoutubeVideos from "../components/YoutubeVideos";
import NeuralNetworks from "../components/NeuralNetworks";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import ScrollytellingGSAP from "../components/ScrollyTellingGSAP";

export default function Home() {
  return (
    <>
      <Hero/>
      <About />
      <Services />
      <YoutubeVideos />
      <NeuralNetworks />
      <BlogSection />
      <ScrollytellingGSAP />
      <ContactSection />
    </>
  );
}