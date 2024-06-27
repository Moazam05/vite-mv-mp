import { Box, Button, Container, InputBase, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";

function Newsletter() {
  const { translate } = useTranslation();
  const {
    // language, changeLanguage, getLanguage,
    getDirection,
  } = useTranslation();

  return (
    <Wrapper maxWidth={false}>
      <SubWrapper>
        <Heading>{translate("news.title")} </Heading>
        <SubHeading>{translate("news.subtitle")}</SubHeading>
        <SearchWrapper
          dir={getDirection()}
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            bgcolor: "white",
            borderRadius: "6px",
          }}
        >
          <SearchBar
            sx={{ padding: "10px", flex: 1 }}
            placeholder={translate("productlisting.here")}
          />

          <SearchButton aria-label="search" variant="contained">
            {translate("productlisting.search")}
          </SearchButton>
        </SearchWrapper>
      </SubWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  padding: "30px 0",
  // margin: "30px auto",
  backgroundColor: "#fff",
  // [theme.breakpoints.down("sm")]: {
  //   padding: "10px 5px",
  // },
}));
const SubWrapper = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "1.6rem",
  fontWeight: "800",
  color: "#000",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.3rem",
  },
}));
const SubHeading = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "500",
  color: "#505050",
  paddingBottom: "8px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    width: "80%",
    textAlign: "center",
  },
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "15px 0",
  gap: "10px",
  backgroundColor: "white",
  [theme.breakpoints.down("sm")]: {
    padding: "2px 5px",
    width: "90%",
  },
}));

const SearchBar = styled(InputBase)(({ theme }) => ({
  height: "40px",
  width: "300px",
  borderRadius: "6px",
  backgroundColor: "#fff",
  border: "1px solid #8B96A5",
  padding: "10px",
  flex: 1,
  [theme.breakpoints.down("sm")]: {
    height: "40px",
    width: "300px",
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#009444",
  color: "#fff",
  width: "110px",
  borderRadius: "6px",
  height: "40px",
  padding: "10px",
  fontSize: "12px",
  "&:hover": {
    border: "1px solid #009444",
    backgroundColor: "#fff",
    color: "#009444",
  },
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    padding: "8px",
    fontSize: "11px",
  },
}));

export default Newsletter;
