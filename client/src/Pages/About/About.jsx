import AboutHero from "../../Components/AboutHero/AboutHero";
import Header from "../../Components/Common/Header";
import OurStory from "../../Components/AboutHero/OurStory";
import OurServices from "../../Components/AboutHero/OurServices";
import ContactUs from "../../Components/AboutHero/ContactUs";
import Footer from "../../Components/Common/Footer";

export default function About() {
  return (
    <>
      <Header />
      <AboutHero />
      <OurStory />
      <OurServices />
      <ContactUs />

      <Footer />
    </>
  );
}
