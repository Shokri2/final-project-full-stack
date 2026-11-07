import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, pt: "82px" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default PublicLayout;
