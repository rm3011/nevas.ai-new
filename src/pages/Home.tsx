import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import YoutubeVideos from "../components/YoutubeVideos";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero/>
      <About />
      <Services />
      <YoutubeVideos />
      <BlogSection />
      <ContactSection />
    </>
  );
}