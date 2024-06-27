import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";

// MUI Components Import
import { Container, Box, Typography } from "@mui/material";
import ProductCard from "../../Cards/ProductCard";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";

// Loader Import
import { MoonLoader } from "react-spinners";

import { baseUrl } from "../../../../constants/MV/api";

function DiscountedProducts() {
  const token = window.localStorage.getItem("mp-user-token");

  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState([]);
  const { translate, getDirection } = useTranslation();

  const fetchRecommendation = () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/recommendations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setRecommendation(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  return (
    <Wrapper maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: "20px",
        }}
        dir={getDirection()}
      >
        <Heading>{translate("discount.title")} </Heading>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#505050",
            cursor: "pointer",
          }}
        >
          {translate("category.SeeAll")}
        </Typography>
      </Box>
      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
        >
          <MoonLoader color="#000" size={20} />
        </Box>
      ) : (
        <DiscountedProductsWrapper sx={recommendation?.length < 6 ? {justifyContent: "center",}: {justifyContent: "flex-start",}}>
          {recommendation.map((product, index) => (
            <ProductCard key={index} product={product} id={product.prodId} />
          ))}
        </DiscountedProductsWrapper>
      )}
    </Wrapper>
  );
}

// Styled Components

const Wrapper = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // justifyContent: 'center',
  // alignItems: 'center',
  gap: "30px",
  padding: "40px 0",
  width: "100%",
  margin: "30px auto",
  backgroundColor: "#fff",
}));

const Heading = styled(Typography)({
  fontSize: "1.6rem",
  fontWeight: "600",
  color: "#000",
});

const DiscountedProductsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  width: "100%",
  height: 'auto',
  overflowX: "auto", // Ensure horizontal scroll for the container
  overflowY: "hidden", // Hide vertical overflow
  padding: "0px",
  '& > *': {
      flex: "0 0 auto", 
      minWidth: "230px",
  },

  '&::-webkit-scrollbar': {
      height: '8px', // Adjust the height of the scrollbar
  },
  '&::-webkit-scrollbar-thumb': {
      background: '#888', // Color of the scrollbar thumb
      borderRadius: '10px', // Rounded corners for the scrollbar thumb
  },
  '&::-webkit-scrollbar-thumb:hover': {
      background: '#555', // Color when hovering over the scrollbar thumb
  },

  [theme.breakpoints.down('sm')]: {
      justifyContent: "flex-start", 
      flexWrap: "nowrap",
      overflowX: "auto", 
      '& > *': {
          flex: "0 0 auto",
          minWidth: "230px",
      },
  }
}));
export default DiscountedProducts;
