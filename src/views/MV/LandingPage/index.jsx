// MUI Components Import
import { Container } from "@mui/material";

// Components Import
import Navbar from "./Components/Navbar";
import BannersCarousel from "./ComponentsØCarousel";
import CategoryList from "./Components/CategoryList";
import BestSeller from "./Components/BestSeller";
import Recomendation from "./Components/Recomendation";
import Services from "./Components/Services";
import Footer from "../Footer/Footer";
import HotSellingOffer from "./Components/HotSellingOffer";
import DiscountedProducts from "./Components/DiscountedProducts";
import DiscountBanner from "./Components/DiscountBanner";
import Newsletter from "./Components/Newsletter";

const LandingPage = () => {
  return (
    <Container maxWidth={true} disableGutters={true}>
      <Navbar />
      <div
        style={{
          width: "100%",
          backgroundColor: "#FBF5FF",
          paddingTop: "40px",
        }}
      >
        <BannersCarousel />
        <CategoryList />
        <BestSeller />
        <HotSellingOffer />
        <Recomendation />
        <DiscountBanner />
        <DiscountedProducts />
        <Services />
        <Newsletter />
        <Footer />
      </div>
    </Container>
  );
};

export default LandingPage;
