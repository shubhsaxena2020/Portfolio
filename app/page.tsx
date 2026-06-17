import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import GridBg from "@/components/GridBg";

export default function Home() {
  return (
    <>
      <Nav />
      <GridBg className="fixed inset-0 -z-10 h-screen w-screen" />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
    </>
  );
}
