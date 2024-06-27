import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
// MUI Components Import
import { Container, Box, Typography } from "@mui/material";
import ProductCard from "../../Cards/ProductCard";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
// Loader Import
import { MoonLoader } from "react-spinners";
import { useFetchBestSellersQuery } from "../../../../redux/MV/api/landingPageApiSlice";

function BestSeller() {
  const [bestSellers, setBestSellers] = useState([]);
  const { translate } = useTranslation();
  const { getDirection } = useTranslation();

  // todo: GET BEST SELLERS API CALL
  const { data, isLoading } = useFetchBestSellersQuery({});

  useEffect(() => {
    if (data) {
      setBestSellers(data);
    }
  }, [data]);

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
        <Heading>{translate("bestseller.title")} </Heading>
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

      {isLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
        >
          <MoonLoader color="#000" size={20} />
        </Box>
      ) : (
        <BestProductsWrapper
          sx={
            bestSellers?.length < 6
              ? { justifyContent: "center" }
              : { justifyContent: "flex-start" }
          }
        >
          {bestSellers.map((product, index) => (
            <ProductCard key={index} product={product} id={product.prodId} />
          ))}
        </BestProductsWrapper>
      )}
    </Wrapper>
  );
}

// Styled Components

const Wrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  // justifyContent: 'center',
  // alignItems: 'center',
  gap: "30px",
  padding: "50px 0",
  margin: "30px 0",
  backgroundColor: "#fff",
  width: "100%",
}));

const Heading = styled(Typography)({
  fontSize: "1.6rem",
  fontWeight: "600",
  color: "#0a0a33",
});

const BestProductsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  width: "100%",
  height: "auto",
  overflowX: "auto", // Ensure horizontal scroll for the container
  overflowY: "hidden", // Hide vertical overflow
  padding: "0px",
  "& > *": {
    flex: "0 0 auto",
    minWidth: "230px",
  },

  "&::-webkit-scrollbar": {
    height: "8px", // Adjust the height of the scrollbar
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888", // Color of the scrollbar thumb
    borderRadius: "10px", // Rounded corners for the scrollbar thumb
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555", // Color when hovering over the scrollbar thumb
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    overflowX: "auto",
    "& > *": {
      flex: "0 0 auto",
      minWidth: "230px",
    },
  },
}));

export default BestSeller;
