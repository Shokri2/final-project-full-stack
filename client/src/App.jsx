import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { publicRoutes } from "./Routes/PublicRoutes.jsx";
import { userRoutes } from "./Routes/UserRoutes.jsx";
import { agronomistRoutes } from "./Routes/AgronomistRoutes.jsx";
import { adminRoutes } from "./Routes/AdminRoutes.jsx";
import Unauthorized from "./Pages/Unauthorized/Unauthorized.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {publicRoutes}
        {userRoutes}
        {agronomistRoutes}
        {adminRoutes}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
