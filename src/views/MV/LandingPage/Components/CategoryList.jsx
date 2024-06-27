import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
import { styled, Box, Container, Grid, Typography } from "@mui/material";
// Loader Import
import { MoonLoader } from "react-spinners";
import { useFetchCategoriesQuery } from "../../../../redux/MV/api/landingPageApiSlice";

function CategoryList() {
  const navigate = useNavigate();

  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const [category, setCategory] = useState([]);

  // todo: GET CATEGORIES DATA API CALL
  const { data, isLoading } = useFetchCategoriesQuery({});

  useEffect(() => {
    if (data) {
      setCategory(data);
    }
  }, [data]);

  // const routeUpdate = () => {
  //   window.location.href =
  //     "https://ai3rp-marketplace-stag.web.app/category/2846003233051";
  // };

  return (
    <div>
      <CatTopbar dir={getDirection()}>
        <Typography
          sx={{ fontSize: "1.8rem", fontWeight: "800", color: "#0a0a33" }}
        >
          {translate("category.budget")}
        </Typography>
      </CatTopbar>

      {isLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
        >
          <MoonLoader color="#000" size={20} />
        </Box>
      ) : (
        <CategoryWrapper maxWidth={false}>
          {category.map((cat, index) => (
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
                style={{ height: "150px", width: "150px" }}
                alt={cat.title}
              />
              <CatTitle>{language === "ar" ? cat.arb_name : cat.name}</CatTitle>
            </CatWrapper>
          ))}
        </CategoryWrapper>
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

const CategoryWrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "90%",
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
  margin: "2px 0px",
  padding: "5px",
  cursor: "pointer",
  backgroundColor: "#fff",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
  "&:hover": {
    boxShadow: "none",
    outline: "1px solid #000",
  },
}));

const CatTitle = styled(Typography)(() => ({
  fontSize: "1.0rem",
  fontWeight: "bold",
  color: "#000000",
  cursor: "pointer",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "130px",
}));

export default CategoryList;
