import { styled } from "@mui/material/styles";
import { Box, Button, Container, Typography } from "@mui/material";
import banner from "../../../../assets/Banner.webp"; // Corrected the import path
import { useTranslation } from "../../../../contexts/MV/LanguageContext";

function DiscountBanner() {
  const { translate, getDirection } = useTranslation();

  return (
    <Wrapper>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        dir={getDirection()}
      >
        <TextWrapper dir={getDirection()}>
          <Heading>{translate("banner.title")}</Heading>
          <SubHeading>{translate("hotselling.subtitle")}</SubHeading>
        </TextWrapper>

        <DiscountButton aria-label="search" variant="contained">
          {translate("hotselling.redeem")}
        </DiscountButton>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  width: "100%",
  height: "100px",
  margin: "30px auto",
  borderRadius: "8px",
  backgroundImage: `url(${banner})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "800",
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    fontSize: "15px",
  },
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "400",
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
}));

const TextWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const DiscountButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#009444",
  color: "#fff",
  width: "auto",
  borderRadius: "6px",
  height: "40px",
  padding: "10px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#fff",
    border: "1px solid #009444",
    color: "#009444",
  },
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    padding: "8px",
    fontSize: "11px",
  },
}));

export default DiscountBanner;
