import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../contexts/MV/CartContext";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
import FavoriteIcon from "@mui/icons-material/Favorite";

// MUI Components Import
import {
  Badge,
  Box,
  Button,
  FormControl,
  IconButton,
  InputBase,
  Menu,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

// Assets/Icons Import
import arabicIcon from "../../../../assets/ksa.webp";
import englishIcon from "../../../../assets/uk.webp";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/Person";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { baseUrl } from "../../../../constants/MV/api";
import { useFetchCategoriesQuery } from "../../../../redux/MV/api/landingPageApiSlice";
import ClassIcon from "@mui/icons-material/Class";
import { useQoute } from "../../../../contexts/MV/QouteContext";

function Navbar() {
  const token = window.localStorage.getItem("mp-user-token");
  const fullname = window.localStorage.getItem("username");

  const { language, translate, changeLanguage, getLanguage, getDirection } =
    useTranslation();
  const { getTotalCartCount, calculateTotalPrice } = useCart();
  const { qouteProducts } = useQoute();
  const totalPrice = calculateTotalPrice();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState();
  // eslint-disable-next-line no-unused-vars
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const languageOptions = [
    {
      value: "en",
      label: (
        <>
          <img
            src={englishIcon}
            alt="language icon"
            style={{ width: "18px", height: "18px" }}
          />{" "}
          {translate("en")}
        </>
      ),
    },
    {
      value: "ar",
      label: (
        <>
          <img
            src={arabicIcon}
            alt="language icon"
            style={{ width: "18px", height: "18px" }}
          />{" "}
          {translate("ar")}
        </>
      ),
    },
  ];

  const navLinks = [
    {
      link: "home",
      route: "/",
    },
    {
      link: "contact",
      route: "/contact-us",
    },
    {
      link: "privacy",
      route: "/privacy-policy",
    },
    {
      link: "shipping",
      route: "/return-policy",
    },
    {
      link: "blogs",
      route: "/blogs",
    },
  ];

  const [category, setCategory] = useState([]);

  // todo: GET CATEGORIES DATA API CALL
  const { data } = useFetchCategoriesQuery({});

  useEffect(() => {
    if (data) {
      setCategory(data);
    }
  }, [data]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const suggestSearch = (value) => {
    setSearchTerm(value);
    axios
      .post(`${baseUrl}/api/products/suggestions`, {
        search_term: value,
      })
      .then((response) => {
        setSuggestions(response.data);
        setResultsLoaded(true);
      })
      .catch(() => {});
  };

  const searchProducts = (searchTerm) => {
    if (window.location.pathname.includes("/search/")) {
      // If the current page is the search results page, update the search term in the URL
      const urlParts = window.location.pathname.split("/");
      urlParts[urlParts.length - 1] = searchTerm;
      const newUrl = urlParts.join("/");
      window.history.replaceState(null, "", newUrl);
    } else {
      // If not, navigate to the search results page
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProducts(searchTerm);
    }
  };
  const [logoData, setLogoData] = useState([]);

  const fetchLogo = () => {
    axios
      .get(`${baseUrl}/api/auth/open/settings`, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setLogoData(response.data.logo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLogo();
    const isSearch = window.location.pathname.includes("search");
    if (isSearch) {
      const query = window.location.pathname.split("/")[2];
      setSearchTerm(query);
    }
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  // const categories = ["Category 1", "Category 2", "Category 3"];
  const url = "https://erp-staging.3ndey.com/";

  return (
    <NavWrapper>
      <NavTopbar>
        <Box
          sx={{
            height: "70px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logoData}
            alt="Logo"
            style={{ height: "100%", objectFit: "contain" }}
          />
        </Box>

        <SearchWrapper
          dir={getDirection()}
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "500px",
            bgcolor: "white",
            borderRadius: "6px",
          }}
        >
          <SearchBar
            sx={{ padding: "10px", flex: 1 }}
            placeholder={translate("productlisting.here")}
            value={searchTerm}
            onChange={(e) => suggestSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FormControl
            size="small"
            sx={{
              width: "120px",
              backgroundColor: "#fff",
              borderRadius: "none",
            }}
          >
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              sx={{ width: "100%", height: "40px", borderRadius: "0px" }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {category.map((cat, index) => (
                <MenuItem
                  key={index}
                  value={language === "ar" ? cat.arb_name : cat.name}
                >
                  {language === "ar" ? cat.arb_name : cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <SearchButton
            aria-label="search"
            onClick={() => searchProducts(searchTerm)}
            variant="contained"
          >
            {translate("productlisting.search")}
          </SearchButton>
        </SearchWrapper>

        <AccountVitals dir={getDirection()}>
          {token ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => navigate("/profile")}
              >
                <UserIcon sx={{ color: "#8B96A5", fontSize: "22px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                    gap: "0px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#8B96A5",
                      fontSize: "12px",
                      fontWeight: "300",
                      cursor: "pointer",
                    }}
                  >
                    {translate("navbar.signin")}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#8B96A5",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {fullname}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <LoginBtn onClick={() => navigate("/login")}> Login </LoginBtn>
          )}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/cart")}
          >
            <Badge color="error">
              <ChatIcon
                sx={{ color: "#8B96A5", fontSize: "22px", cursor: "pointer" }}
              />
            </Badge>
            <Typography
              sx={{ color: "#8B96A5", fontSize: "14px", fontWeight: "600" }}
            >
              {translate("navbar.message")}
            </Typography>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0px",
              cursor: "pointer",
            }}
          >
            <Badge color="error">
              <FavoriteIcon
                sx={{ color: "#8B96A5", fontSize: "22px", cursor: "pointer" }}
              />
            </Badge>
            <Typography
              sx={{ color: "#8B96A5", fontSize: "14px", fontWeight: "600" }}
            >
              {translate("navbar.order")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/cart")}
          >
            <Badge badgeContent={getTotalCartCount()} color="error">
              <CartIcon
                sx={{ color: "#8B96A5", fontSize: "22px", cursor: "pointer" }}
              />
            </Badge>
            <Typography
              sx={{ color: "#8B96A5", fontSize: "14px", fontWeight: "600" }}
            >
              {parseFloat(totalPrice || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              SR
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/qoute")}
          >
            <Badge badgeContent={qouteProducts.length} color="error">
              <ClassIcon
                sx={{ color: "#8B96A5", fontSize: "22px", cursor: "pointer" }}
              />
            </Badge>
            <Typography
              sx={{ color: "#8B96A5", fontSize: "14px", fontWeight: "600" }}
            >
              {translate("navbar.getQoute")}
            </Typography>
          </Box>
        </AccountVitals>
      </NavTopbar>

      <NavBottombar dir={getDirection()}>
        <LinksWrapper
          sx={{ display: { xs: "none", sm: "flex", width: "100%" } }}
        >
          {navLinks.map((link, index) => (
            <Button
              key={index}
              style={{ textTransform: "none", color: "#000" }}
              onClick={() => navigate(link.route)}
            >
              {translate(`navbar.navlinks.${link.link}`)}
            </Button>
          ))}
        </LinksWrapper>

        <ItemsWapper>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <IconButton
              onClick={handleMenuOpen}
              sx={{ display: { xs: "block", sm: "none", color: "#000" } }}
            >
              <MenuIcon sx={{ color: "#000" }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              {navLinks.map((link, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleMenuClose();
                    navigate(link.route);
                  }}
                >
                  {translate(`navbar.navlinks.${link.link}`)}
                </MenuItem>
              ))}
            </Menu>
            <LanguageSelector>
              <FormControl variant="standard" fullWidth sx={{ minWidth: 100 }}>
                <LanguageDropdown
                  disableUnderline={true}
                  defaultValue={getLanguage()}
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  sx={{
                    ".MuiSelect-icon": { color: "black" },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      backgroundColor: "transparent",
                      color: "#000",
                      cursor: "pointer",
                    },
                  }}
                >
                  {languageOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </LanguageDropdown>
              </FormControl>
            </LanguageSelector>
          </Box>
          <SellerButton aria-label="search" variant="contained" href={url}>
            {translate("navbar.seller")}
          </SellerButton>
        </ItemsWapper>
      </NavBottombar>
    </NavWrapper>
  );
}

// Styled Components

const NavWrapper = styled(Box)(() => ({
  // width: "100%",
  backgroundColor: "#fff",
}));

const NavTopbar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 50px",
  borderBottom: "1px solid #E0E0E0",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
    flexDirection: "column",
    gap: "10px",
  },
  [theme.breakpoints.down("md")]: {
    padding: "10px",
    flexDirection: "column",
    gap: "10px",
  },
}));

const AccountVitals = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const LoginBtn = styled(Button)({
  textTransform: "none",
  color: "#400969",
  background: "#fff",
  fontWeight: "bold",
  fontSize: "15px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const NavBottombar = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 50px",
  borderBottom: "1px solid #E0E0E0",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
  },
}));

const ItemsWapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  alignItems: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "space-between",
  },
}));

const LanguageSelector = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
});

const LanguageDropdown = styled(Select)({
  width: "100%",
  height: "auto",
  outline: "none",
  color: "#000",
});

const LinksWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "1px",
  },
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "15px 0",
  backgroundColor: "white",
  [theme.breakpoints.down("sm")]: {
    padding: "2px 5px",
    width: "90%",
  },
}));

const SearchBar = styled(InputBase)(() => ({
  height: "40px",
  width: "300px",
  borderRadius: "0px",
  backgroundColor: "#fff",
  border: "1px solid #E0E0E0",
  padding: "10px",
  flex: 1,
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#400969",
  color: "#fff",
  width: "80px",
  borderRadius: "0px",
  height: "40px",
  padding: "10px",
  fontSize: "12px",
  boxShadow: "none",
  "&:hover": {
    border: "1px solid #400969",
    backgroundColor: "#fff",
    color: "#400969",
  },
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    padding: "8px",
    fontSize: "10px",
    borderRadius: "0px",
  },
}));

const SellerButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#400969",
  color: "#fff",
  width: "150px",
  borderRadius: "0px",
  boxShadow: "none",
  height: "40px",
  padding: "10px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#fff",
    border: "1px solid #400969",
    color: "#400969",
  },
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    padding: "8px",
    fontSize: "10px",
    borderRadius: "0px",
  },
}));

export default Navbar;
