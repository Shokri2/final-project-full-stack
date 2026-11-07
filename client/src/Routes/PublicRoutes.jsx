import { Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage/LandingPage.jsx";
import Home from "../Pages/Home/Home.jsx";
import About from "../Pages/About/About.jsx";
import Services from "../Pages/Services/Services.jsx";
import CropGuide from "../Pages/CropGuide/CropGuide.jsx";
import Register from "../Components/Auth/Register.jsx";
import Login from "../Components/Auth/Login.jsx";
import PublicLayout from "../Components/Layouts/PublicLayout.jsx";
import UnderConstruction from "../Pages/UnderConstruction/UnderConstruction.jsx";
import GuestRoute from "./GuestRoute.jsx";
import VerifyEmail from "../Pages/VerifyEmail/VerifyEmail.jsx";

export const publicRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<About />} />
    <Route path="/crop-guide" element={<CropGuide />} />
    <Route path="/verify-email" element={<VerifyEmail />} />

    <Route element={<PublicLayout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/crops/:id" element={<UnderConstruction title="Crop Details" />} />
      <Route path="/feedback" element={<UnderConstruction title="Reviews" />} />
      <Route path="/contact" element={<UnderConstruction title="Contact Us" />} />
    </Route>

    <Route element={<GuestRoute />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Route>
  </>
);
