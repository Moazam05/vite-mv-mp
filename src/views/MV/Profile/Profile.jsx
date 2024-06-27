import { styled } from "@mui/system";
import { Outlet } from "react-router-dom";

// MUI Components Import
import { Container } from "@mui/material";

// Components Import
import Sidebar from "./components/Sidebar";
import Footer from "../Footer/Footer";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import Navbar from "../LandingPage/Components/Navbar";

const Profile = () => {
  const { getDirection } = useTranslation();
  return (
    <>
      <Wrapper maxWidth={false}>
        <Navbar />
        <ProfileWrapper dir={getDirection()}>
          <Sidebar />
          <Outlet />
        </ProfileWrapper>
        <Footer />
      </Wrapper>
    </>
  );
};

// Styled Components

const Wrapper = styled(Container)(() => ({
  padding: "0 !important",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const ProfileWrapper = styled(Container)(({ theme }) => ({
  padding: "0 !important",
  width: "100%",
  height: "auto",
  overflow: "auto",
  display: "flex",
  flexDirection: "row",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

export default Profile;
