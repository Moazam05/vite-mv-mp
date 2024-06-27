import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
import {
  styled,
  Box,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";
// Loader Import
import { MoonLoader } from "react-spinners";
import { useFetchHotSellingOfferQuery } from "../../../../redux/MV/api/landingPageApiSlice";

function HotSellingOffer() {
  const navigate = useNavigate();

  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const [hotselling, setHotselling] = useState([]);

  // const routeUpdate = () => {
  //   window.location.href =
  //     "https://ai3rp-marketplace-stag.web.app/category/2846003233051";
  // };

  // todo: GET HOT SELLING DATA API CALL
  const { data, isLoading } = useFetchHotSellingOfferQuery({});

  useEffect(() => {
    if (data) {
      setHotselling(data);
    }
  }, [data]);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <CatTopbar dir={getDirection()}>
        <Typography
          sx={{ fontSize: "1.8rem", fontWeight: "800", color: "#0a0a33" }}
        >
          {translate("hotselling.title")}
        </Typography>
      </CatTopbar>

      {isLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
        >
          <MoonLoader color="#000" size={20} />
        </Box>
      ) : (
        <HotsellingWrapper maxWidth={false}>
          {hotselling.map((cat, index) => (
            <CatWrapper
              item
              key={index}
              xs={12}
              sm={4}
              md={2}
              lg={2}
              onClick={() => navigate(`/category/${cat.catId}`)}
            >
              <img
                src={cat.image}
                style={{ height: "140px", width: "140px" }}
                alt={cat.title}
              />
              <CatTitle>{language === "ar" ? cat.arb_name : cat.name}</CatTitle>
              <Box
                sx={{
                  bgcolor: "#FFD3D3",
                  display: "inline-block",
                  borderRadius: "14px",
                  p: "4px 10px",
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "500", color: "red" }}
                >
                  10%
                </Typography>
              </Box>
            </CatWrapper>
          ))}
        </HotsellingWrapper>
      )}
    </div>
  );
}

const CatTopbar = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "start",
  padding: "10px 20px",
}));

const Wrapper = styled(Container)(() => ({
  margin: "40px auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
  gap: "30px",
  padding: "20px 0",
  backgroundColor: "#fff",
}));

const HotsellingWrapper = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: '90%',
  gap: "20px",
  padding: "30px 10px",
  overflowX: "auto",
  scrollbarWidth: "none",
  "-ms-overflow-style": "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const CatWrapper = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "start",
  background: "cover",
  gap: "8px",
  padding: "5px",
  margin: "2px 0px",
  cursor: "pointer",
  backgroundColor: "#fff",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
  "&:hover": {
    boxShadow: "none",
    outline: "1px solid #000"
  }
}));

const CatTitle = styled(Typography)(() => ({
  fontSize: "18px",
  fontWeight: "600",
  color: "#000000",
  cursor: "pointer",
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "130px"
}));

export default HotSellingOffer;
