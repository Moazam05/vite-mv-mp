import { styled } from "@mui/system";
import { useEffect, useState } from "react";

// MUI Components Import
import {
  Box,
  Button,
  Container,
  Grid,
  Rating,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Footer from "../Footer/Footer";
import Navbar from "../LandingPage/Components/Navbar";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import axios from "axios";
import { baseUrl } from "../../../constants/MV/api";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import ProductCard from "../Cards/ProductCard";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useLoaderContext } from "../../../contexts/MV/LoaderContext";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css";
import Loader from "../CommonComponents/Loader";

const priceRange = [
  "All Price",
  "Under $20",
  "$25 to $100",
  "$100 to $300",
  "$300 to $500",
  "$500 to $1,000",
  "$1,000 to $10,000",
];

const Banner = {
  width: "100%",
  height: "500px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  borderRadius: "12px",
  background: "none",
  cursor: "pointer",
  objectFit: "cover",
};

const Vendordetail = () => {
  const token = window.localStorage.getItem("mp-user-token");
  const { loading, handleLoader } = useLoaderContext();

  const [vendorSeller, setVendorSeller] = useState([]);
  const { translate } = useTranslation();
  const { getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const [catExpand, setCatExpand] = useState(false);
  //   const [subcatExpand, setSubcatExpand] = useState(false);
  const [priceExpand, setPriceExpand] = useState(false);
  const [brandExpand, setBrandExpand] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  //   const [selectedSubcategory, setSelectedSubategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleCategoryToggle = () => {
    setCatExpand(!catExpand);
  };
  //   const handleSubCategoryToggle = () => {
  //     setSubcatExpand(!subcatExpand);
  //   };
  const handlePriceToggle = () => {
    setPriceExpand(!priceExpand);
  };
  const handleBrandToggle = () => {
    setBrandExpand(!brandExpand);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  //   const handleSubcategoryChange = (event) => {
  //     setSelectedSubategory(event.target.value);
  //   };
  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
  };
  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const { slug } = useParams();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const fetchVendorSeller = async (slug) => {
    handleLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/mv/api/store/profile/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setVendorSeller(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoader(false);
    }
  };

  useEffect(() => {
    fetchVendorSeller(slug);
  }, []);

  const filteredProducts = selectedCategory
    ? vendorSeller?.products.filter((product) => {
        return product.productCategory === selectedCategory;
      })
    : vendorSeller?.products;

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Wrapper maxWidth={false}>
        {isSmallScreen ? (
          <SmHeader>
            {vendorSeller?.banners && vendorSeller?.banners.length > 0 ? (
              <SmallBanner>
                <Swiper
                  className="mySwiper"
                  autoHeight="true"
                  slidesPerView={1}
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={1000}
                  effect="fade"
                >
                  {vendorSeller?.banners.map((img, index) => (
                    <SwiperSlide key={index} style={Banner}>
                      <img
                        src={img.image}
                        alt="Banner"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </SmallBanner>
            ) : null}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingInline: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  border: "4px solid #e1e3eb",
                  backgroundColor: "#fff",
                }}
              >
                <StorefrontOutlinedIcon
                  sx={{ fontSize: "30px", color: "#009444" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "700", color: "#3866DF" }}
                >
                  {vendorSeller?.profile?.company_name}
                </Typography>
                <Typography
                  sx={{ fontSize: "10px", fontWeight: "500", color: "#9BA0B1" }}
                >
                  <span style={{ fontWeight: "700", color: "#404553" }}>
                    76%
                  </span>{" "}
                  Positive Ratings
                </Typography>
                {vendorSeller?.ratings_count > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#404553",
                      }}
                    >
                      {vendorSeller?.ratings_count}
                    </Typography>
                    <Rating
                      name="read-only"
                      value={vendorSeller?.avg_rating}
                      size="small"
                      readOnly
                    />
                  </Box>
                ) : (
                  ""
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <VendorSubDetail>
                  <LocalPhoneOutlinedIcon
                    sx={{ fontSize: "14px", color: "#009444" }}
                  />
                  <SubHeading>{vendorSeller?.profile?.phone_number}</SubHeading>
                </VendorSubDetail>
                <VendorSubDetail>
                  <EmailOutlinedIcon
                    sx={{ fontSize: "14px", color: "#009444" }}
                  />
                  <SubHeading>{vendorSeller?.profile?.email}</SubHeading>
                </VendorSubDetail>
                {vendorSeller?.profile?.company_address ? (
                  <VendorSubDetail>
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: "14px", color: "#009444" }}
                    />
                    <SubHeading>
                      {vendorSeller?.profile?.company_address}
                    </SubHeading>
                  </VendorSubDetail>
                ) : (
                  ""
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VendorSubDetail sx={{ width: "90%" }}>
                <QuoteBtn onClick={() => vendorSeller?.profile?.website}>
                  More Info <ArrowOutwardIcon />{" "}
                </QuoteBtn>
                <QuoteBtn>
                  Share <ShareOutlinedIcon />{" "}
                </QuoteBtn>
              </VendorSubDetail>
            </Box>
          </SmHeader>
        ) : (
          <Header>
            <BannerCard dir={getDirection()}>
              <ShopImage>
                <StorefrontOutlinedIcon
                  sx={{ fontSize: "30px", color: "#009444" }}
                />
              </ShopImage>
              <VendorDetail dir={getDirection()}>
                <Typography
                  sx={{ fontSize: "16px", fontWeight: "800", color: "#3866DF" }}
                >
                  {vendorSeller?.profile?.company_name}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "600", color: "#9BA0B1" }}
                >
                  <span style={{ fontWeight: "800", color: "#404553" }}>
                    76%
                  </span>{" "}
                  Positive Ratings
                </Typography>
              </VendorDetail>
              {vendorSeller?.ratings_count > 0 ? (
                <VendorDetail>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "26px",
                        fontWeight: "bold",
                        color: "#404553",
                      }}
                    >
                      {vendorSeller?.ratings_count}
                    </Typography>
                    <Rating
                      name="read-only"
                      value={vendorSeller?.avg_rating}
                      readOnly
                    />
                  </Box>
                  <SubHeading>
                    Based on {vendorSeller?.ratings_count} ratings
                  </SubHeading>
                </VendorDetail>
              ) : (
                ""
              )}
              <VendorDetail
                sx={{ paddingRight: "5px", gap: "10px" }}
                dir={getDirection()}
              >
                <VendorSubDetail>
                  <LocalPhoneOutlinedIcon
                    sx={{ fontSize: "22px", color: "#009444" }}
                  />
                  <SubHeading>{vendorSeller?.profile?.phone_number}</SubHeading>
                </VendorSubDetail>
                <VendorSubDetail>
                  <EmailOutlinedIcon
                    sx={{ fontSize: "22px", color: "#009444" }}
                  />
                  <SubHeading>{vendorSeller?.profile?.email}</SubHeading>
                </VendorSubDetail>
              </VendorDetail>
              {vendorSeller?.profile?.company_address ? (
                <VendorSubDetail>
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: "22px", color: "#009444" }}
                  />
                  <SubHeading>
                    {vendorSeller?.profile?.company_address}
                  </SubHeading>
                </VendorSubDetail>
              ) : (
                ""
              )}
              <ButtonWrapper>
                <QuoteBtn onClick={() => vendorSeller?.profile?.website}>
                  More Info <ArrowOutwardIcon />{" "}
                </QuoteBtn>
                <QuoteBtn>
                  Share <ShareOutlinedIcon />{" "}
                </QuoteBtn>
              </ButtonWrapper>
            </BannerCard>
            {vendorSeller?.banners && vendorSeller?.banners.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SwiperStyle
                  className="mySwiper"
                  autoHeight="true"
                  slidesPerView={1}
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={1000}
                  effect="fade"
                >
                  {vendorSeller?.banners.map((img, index) => (
                    <SwiperSlide key={index} style={Banner}>
                      <img
                        src={img.image}
                        alt="Banner"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </SwiperStyle>
              </Box>
            ) : null}
          </Header>
        )}
        ,<Heading>{translate("vendor.title")}</Heading>
        <VendorWrapper container my={5} dir={getDirection()}>
          <FiltersWrapper item lg={3} md={4} sm={4} xs={12}>
            <FilterBox my={3} dir={getDirection()}>
              <Box
                variant="contained"
                onClick={handleCategoryToggle}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>
                  {translate("productlisting.cat")}
                </Typography>
                <Button>
                  {catExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
              </Box>
              {catExpand && (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {vendorSeller?.categories.map((category, index) => (
                      <FormControlLabel
                        key={index}
                        value={category.name}
                        control={<Radio />}
                        label={
                          language === "ar" ? category.arb_name : category.name
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </FilterBox>

            {/* <FilterBox my={3} dir={getDirection()}>
              <Box variant="contained" onClick={handleSubCategoryToggle} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', }} >
                <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>{translate("productlisting.sub")}</Typography>
                <Button >
                  {subcatExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
              </Box>

              {subcatExpand && (
                <FormControl component="fieldset">
                  <RadioGroup aria-label="category" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                    {vendorSeller?.subcategories.map((subcategory, index) => (
                      <FormControlLabel key={index} value={subcategory.name} control={<Radio />}
                        label={
                          language === "ar"
                            ? subcategory.arb_name
                            : subcategory.name} />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </FilterBox> */}

            <FilterBox my={3} dir={getDirection()}>
              <Box
                variant="contained"
                onClick={handlePriceToggle}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>
                  {translate("productlisting.range")}
                </Typography>
                <Button>
                  {priceExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
              </Box>

              {priceExpand && (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="category"
                    value={selectedPrice}
                    onChange={handlePriceChange}
                  >
                    {priceRange.map((category, index) => (
                      <FormControlLabel
                        key={index}
                        value={category}
                        control={<Radio />}
                        label={category}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </FilterBox>

            <FilterBox my={3} dir={getDirection()}>
              <Box
                variant="contained"
                onClick={handleBrandToggle}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>
                  {translate("productlisting.brand")}
                </Typography>
                <Button>
                  {brandExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
              </Box>

              {brandExpand && (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="category"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                  >
                    {vendorSeller?.brands.map((brands, index) => (
                      <FormControlLabel
                        key={index}
                        value={brands.name}
                        control={<Radio />}
                        label={
                          language === "ar" ? brands.arb_name : brands.name
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </FilterBox>
          </FiltersWrapper>
          <ProductsWrapper item lg={9} md={8} sm={8} xs={12}>
            {filteredProducts?.map((product, index) => (
              <ProductCard key={index} product={product} id={product?.prodId} />
            ))}
          </ProductsWrapper>
        </VendorWrapper>
      </Wrapper>
      <Footer />
    </>
  );
};

// Styled Components

const Wrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  padding: "40px 0",
  width: "100%",
  backgroundColor: "#fff",
}));

const ShopImage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100px",
  width: "100px",
  borderRadius: "50%",
  border: "4px solid #e1e3eb",
  backgroundColor: "#fff",
  [theme.breakpoints.down("md")]: {
    height: "70px",
    width: "70px",
  },
}));

const Header = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  height: "auto",
}));
const SmHeader = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "auto",
  gap: "20px",
}));
const SwiperStyle = styled(Swiper)(() => ({
  width: "100%",
  height: "250px",
}));

const SmallBanner = styled(Container)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // padding: "0 20px",
  width: "100%",
  height: "200px",
  borderRadius: "8px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.down("xs")]: {
    width: "100%",
  },
}));

const BannerCard = styled(Container)(() => ({
  width: "100%",
  padding: "20px 10px",
  marginRight: "0",
  display: "flex",
  flexDirection: "row",
  alignItems: "start",
  justifyContent: "space-between",
  zIndex: "1",
}));

const VendorDetail = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "5px",
}));

const VendorSubDetail = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  // [theme.breakpoints.down("md")]: {

  // },
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#404553",
  width: "90%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",

  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
}));

const Heading = styled(Typography)(() => ({
  fontSize: "28px",
  color: "#1C1C1C",
  fontWeight: "bold",
  textAlign: "center",
}));

const FilterBox = styled(Box)(({ theme }) => ({
  width: "auto",
  display: "flex",
  flexDirection: "column",
  boxShadow: "none",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #EFEFEF",
  gap: "5px",
  [theme.breakpoints.down("xs")]: {
    justifyContent: "center",
  },
}));

const QuoteBtn = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  backgroundColor: "#fff",
  width: "100px",
  height: "35px",
  border: "1px solid #009444",
  color: "#009444",
  display: "flex",
  alignItems: "center",
  fontSize: 12,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#006222",
    color: "#fff",
  },
  [theme.breakpoints.down("sm")]: {
    width: "40%",
  },
}));

const FiltersWrapper = styled(Grid)(() => ({
  height: "auto",
  flexGrow: 1,
}));

const VendorWrapper = styled(Grid)(() => ({
  margin: "20px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  padding: "0 30px",
}));

const ProductsWrapper = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
  width: "100%",
  padding: 0,
  margin: 0,
  height: "auto",
  overflowX: "hidden",

  "& > *": {
    flex: "0 0 auto",
    minWidth: "230px",
  },
  "&::-webkit-slider-thumb": {
    "-webkit-appearance": "none",
    width: "15px",
    height: "15px",
    border: "1px solid black",
  },

  [theme.breakpoints.down("sm")]: {
    height: "400px",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    overflowX: "auto",
    "& > *": {
      flex: "0 0 auto", // Prevent cards from stretching to fill the container
      minWidth: "230px", // Adjust the minimum width of each card as needed
    },
  },
}));

export default Vendordetail;
