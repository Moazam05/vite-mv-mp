import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// MUI Components Import
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";

// Components Import
import ProductCard from "../Cards/ProductCard";

// Icons Import
import SearchIcon from "@mui/icons-material/Search";

// Loader Import
import { MoonLoader } from "react-spinners";
import { useTranslation } from "../../../contexts/MV/LanguageContext";

import { baseUrl } from "../../../constants/MV/api";
import Navbar from "../LandingPage/Components/Navbar";
import { useLoaderContext } from "../../../contexts/MV/LoaderContext";

function ProductsListing() {

  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const { handleLoader } = useLoaderContext()

  const { catId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState();
  const [activeCategory, setActiveCategory] = useState(catId);
  const [searchHistory, setSearchHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [catSubcats, setCatSubcats] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [minRange, setMinRange] = useState("0");
  const [maxRange, setMaxRange] = useState("0");

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMinRange, setSelectedMinRange] = useState(null);
  const [selectedMaxRange, setSelectedMaxRange] = useState(null);


  const fetchCategories = () => {
    handleLoader(true);
    axios
      .get(`${baseUrl}/api/categories`)
      .then((response) => {
        setCategories(response.data);
        handleLoader(false);
      })
      .catch(() => {
        handleLoader(false);
      });
  };

  const fetchCategoryProducts = () => {
    setCategoryProducts([]);
    handleLoader(true);
    axios
      .get(`${baseUrl}/api/products/category/${catId}`)
      .then((response) => {
        setCategoryProducts(response.data);
        handleLoader(false);
      })
      .catch(() => {
        handleLoader(false);
      });
  };

  const fetchCatSubcategories = () => {
    handleLoader(true);
    axios
      .get(`${baseUrl}/api/subcategories/${catId}`)
      .then((response) => {
        setCatSubcats(response.data);
        handleLoader(false);
      })
      .catch(() => {
        handleLoader(false);
      });
  };

  const searchProducts = (id) => {
    handleLoader(true);
    axios
      .post(`${baseUrl}/api/products/search`, {
        search_term: searchTerm,
        price_from: minRange,
        price_to: maxRange,
        subId: id,
        cat_id: catId,
      })
      .then((response) => {
        setCategoryProducts(response.data);
        handleLoader(false);
      })
      .catch((err) => {
        handleLoader(false);
      });
  };

  const handleSubcategorySelect = (subcatId, subcatName) => {
    setSelectedSubcategory(subcatName); // Store the name instead of the ID
    searchProducts(subcatId, selectedMinRange, selectedMaxRange);
  };

  const handlePriceRangeSelect = (minRange, maxRange) => {
    setSelectedMinRange(minRange.toString());
    setSelectedMaxRange(maxRange.toString());
    searchProducts(
      selectedSubcategory,
      minRange.toString(),
      maxRange.toString()
    );
    setMinRange("0");
    setMaxRange("0");
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      const updatedSearchHistory = searchHistory.filter((term) => {
        if (term.startsWith("Price") || term.startsWith("Subcategory")) {
          return term;
        }
      });
      setSearchHistory([...updatedSearchHistory, searchTerm]);
      setSearchTerm("");
      searchProducts();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleRemove = (index) => {
    const updatedSearchHistory = [...searchHistory];
    updatedSearchHistory.splice(index, 1);
    setSearchHistory(updatedSearchHistory);
    if (updatedSearchHistory.length > 0) {
      // If there are other search history items, trigger searchProducts with remaining search history items
      searchProducts(updatedSearchHistory[updatedSearchHistory.length - 1]);
    } else {
      // If there are no other search history items, fetch category products
      fetchCategoryProducts();
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCategoryProducts();
    fetchCatSubcategories();
    setActiveCategory(catId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId]);


  return (
    <>
      <Navbar />
      <CategoriesNav>
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#00A9BF", fontWeight: "bold", fontSize: "14px" }}
              >
                {translate("productlisting.cat")}
              </Typography>
              <FormControl
                size="small"
                sx={{
                  border: "1px solid #EFEFEF",
                  width: "100%",
                  mt: "5px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                }}
              >
                <Select
                  sx={{ borderRadius: "12px", border: "none" }}
                  value={activeCategory}
                  onChange={(e) => {
                    setCategoryProducts([]);
                    const selectedCategoryId = e.target.value;
                    navigate(`/category/${selectedCategoryId}`);
                    setSelectedSubcategory(null);
                    handleRemove();
                  }}
                >
                  {categories.map((cat, index) => (
                    <MenuItem key={index} value={cat.catId}>
                      {language === "ar"
                        ? cat.arb_name
                        : cat.name + " Supplies"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "5px",
              }}
            >
              {searchHistory.length > 0 && (
                <Chip
                  label={searchHistory[searchHistory.length - 1]}
                  onDelete={() => handleRemove(searchHistory.length - 1)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    paddingLeft: "8px",
                  }}
                />
              )}
              {selectedSubcategory && (
                <Chip
                  label={`Subcategory: ${selectedSubcategory}`}
                  onDelete={() => {
                    setSelectedSubcategory(null);
                    searchProducts(null, selectedMinRange, selectedMaxRange);
                    fetchCategoryProducts();
                  }}
                  color="primary"
                  variant="outlined"
                  sx={{
                    paddingLeft: "8px",
                  }}
                />
              )}
              {selectedMinRange && selectedMaxRange && (
                <Chip
                  label={`Price Range: ${selectedMinRange} - ${selectedMaxRange}`}
                  onDelete={() => {
                    setSelectedMinRange(null);
                    setSelectedMaxRange(null);
                    searchProducts(selectedSubcategory, null, null);
                    fetchCategoryProducts();
                  }}
                  color="primary"
                  variant="outlined"
                  sx={{
                    paddingLeft: "8px",
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <SearchBar
              type="text"
              placeholder="Search within this category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton
              type="button"
              sx={{
                marginRight: "5px",
                padding: "10px",
                bgcolor: "#00A9BF",
                "&:hover": {
                  color: "#00A9BF",
                  border: "1px solid #00A9BF",
                },
              }}
              aria-label="search"
              onClick={() => handleSearch()}
            >
              <SearchIcon
                sx={{
                  color: "white",
                  "&:hover": {
                    color: "#00A9BF",
                  },
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </CategoriesNav>
      <Wrapper container my={5} dir={getDirection()}>
        <FiltersWrapper item lg={3} md={4} sm={4} xs={12}>
          <FilterBox my={3} dir={getDirection()}>
            <FilterHeading>{translate("productlisting.sub")}</FilterHeading>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <MoonLoader color="#000" size={20} />
              </Box>
            ) : catSubcats.length === 0 ? (
              <Typography sx={{ color: "#878787", fontSize: "18px" }}>
                {translate("productlisting.no")}
              </Typography>
            ) : (
              catSubcats.map((subcat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleSubcategorySelect(
                      subcat.subId,
                      language === "ar" ? subcat.arb_name : subcat.name
                    )
                  }
                >
                  {language === "ar" ? (
                    <Typography sx={{ color: "#878787", fontSize: "18px" }}>
                      {subcat.arb_name}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "#878787", fontSize: "18px" }}>
                      {subcat.name}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bolder",
                      borderRadius: "50%",
                      background: "#00A9BF",
                      height: "30px",
                      width: "30px",
                      color: "#fff",
                    }}
                  >
                    {subcat.num_products}
                  </Typography>
                </Box>
              ))
            )}
          </FilterBox>

          <FilterBox my={3} dir={getDirection()}>
            <FilterHeading>{translate("productlisting.range")}</FilterHeading>
            <Stack
              direction="row"
              gap="10px"
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                label="Min"
                value={minRange}
                color="success"
                size="small"
                onChange={(e) => setMinRange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Max"
                value={maxRange}
                color="success"
                size="small"
                onChange={(e) => setMaxRange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Stack>
            <ApplyBtn
              onClick={() => handlePriceRangeSelect(minRange, maxRange)}
            >
              {translate("productlisting.apply")}
            </ApplyBtn>
          </FilterBox>
        </FiltersWrapper>
        <ProductsWrapper item lg={9} md={8} sm={8} xs={12}>
          {loading ? (
            <Box
              sx={{
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MoonLoader color="#000" size={40} />
            </Box>
          ) : categoryProducts.length === 0 ? (
            <Typography> {translate("productlisting.this")}</Typography>
          ) : (
            categoryProducts?.map((product, index) => (
              <ProductCard key={index} product={product} id={product.prodId} />
            ))
          )}
        </ProductsWrapper>
      </Wrapper>
    </>
  );
}

// Styled Components
const Wrapper = styled(Grid)(() => ({
  margin: "20px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  padding: "0 40px",
}));

const CategoriesNav = styled(Grid)(() => ({
  // margin: "20px 0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 40px",
  borderBottom: "1px solid #DEE2E7",
}));

const FiltersWrapper = styled(Grid)(() => ({
  height: "auto",
  flexGrow: 1,
  // margin: "0 50px",
}));

const FilterBox = styled(Box)(({ theme }) => ({
  width: "auto",
  display: "flex",
  flexDirection: "column",
  boxShadow: "none",
  padding: "25px 20px",
  borderRadius: "10px",
  border: "1px solid #EFEFEF",
  gap: "5px",
  [theme.breakpoints.down("xs")]: {
    justifyContent: "center",
  },
}));

const FilterHeading = styled(Typography)(() => ({
  color: "#00A9BF",
  fontWeight: "bold",
  fontSize: "20px",
  paddingBottom: "10px",
}));

// const SearchWrapper = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "start",
//   alignItems: "center",
//   padding: "15px 0",
//   backgroundColor: "white",
//   [theme.breakpoints.down("sm")]: {
//     padding: "2px 5px",
//     width: "80%",
//   },
// }));

const SearchBar = styled(InputBase)(() => ({
  height: "45px",
  width: "80%",
  borderRadius: "20px",
  backgroundColor: "#fff",
  padding: "10px 20px",
  border: "1px solid #EFEFEF",
}));

const ApplyBtn = styled(Button)(() => ({
  height: "40px",
  borderRadius: "20px",
  background: "#178F49",
  color: "#fff",
  textTransform: "capitalize",
  fontSize: "12px",
  top: "10px",
  cursor: "pointer",
  "&:hover": {
    color: "#178F49",
    border: "1px solid #178F49",
  },
}));

const ProductsWrapper = styled(Grid)(() => ({
  width: "80%",
  height: "auto",
  display: "flex",
  marginTop: "20px",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
  padding: "0 20px",
}));

export default ProductsListing;
