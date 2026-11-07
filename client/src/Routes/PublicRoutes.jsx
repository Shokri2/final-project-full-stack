import { Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage/LandingPage.jsx";
import Home from "../Pages/Home/Home.jsx";
import About from "../Pages/About/About.jsx";
import Services from "../Pages/Services/Services.jsx";
import CropGuide from "../Pages/CropGuide/CropGuide.jsx";
import CropDetails from "../Pages/CropDetails/CropDetails.jsx";
import Register from "../Components/Auth/Register.jsx";
import Login from "../Components/Auth/Login.jsx";
import PublicLayout from "../Components/Layouts/PublicLayout.jsx";
import SmartFarming from "../Pages/SmartFarming/SmartFarming.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import GuestRoute from "./GuestRoute.jsx";
import VerifyEmail from "../Pages/VerifyEmail/VerifyEmail.jsx";

export const publicRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<About />} />
    <Route path="/verify-email" element={<VerifyEmail />} />

    <Route element={<PublicLayout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/crop-guide" element={<CropGuide />} />
      <Route path="/crops/:id" element={<CropDetails />} />
      <Route path="/smart-farming" element={<SmartFarming />} />
      <Route path="/contact" element={<Contact />} />
    </Route>

    <Route element={<GuestRoute />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Route>
  </>
);
