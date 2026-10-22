import { Box } from "@mui/material";
import Footer from "../../Components/Common/Footer";
import Home from "../Home/Home";
import Header from "../../Components/Common/Header";
import Features from "../Features/Features";
import FeaturesSection from "../../Components/FeaturesSection/FeaturesSection";

export default function LandingPage() {
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        bgcolor: "#F7FAF5",
      }}
    >
      <Header />

      <Home />
      <Features />
      <FeaturesSection />
      <Footer />
    </Box>
  );
}
