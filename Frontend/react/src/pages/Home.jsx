import Contact from "../components/Contact";
import Featured from "../components/Featured";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Element } from "react-scroll";
import DonorTools from "../components/DonorTools";
import CheckBloodBank from "../components/CheckBloodBank";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Element name="hero">
        <Hero />
      </Element>

      <Element name="featured">
        <Featured />
      </Element>
      <Element name="tools">
        <DonorTools />
      </Element>
      <Element name="bloodbank">
        <CheckBloodBank />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>

      <Footer />
    </div>
  );
};

export default Home;
