import React, { useEffect, useState } from "react";
import { Box, Container, Typography, styled } from "@mui/material";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import Navbar from "../LandingPage/Components/Navbar";
import Footer from "../Footer/Footer";
import { useGetStaticPagesQuery } from "../../../redux/MV/api/cmsApiSlice";
import Loader from "../CommonComponents/Loader";
import parse from "html-react-parser";
import { formatDate, formatDateString } from "../../../utils/MV";

function PrivacyPolicy() {
  const { changeLanguage, getLanguage, getDirection } = useTranslation();
  const { translate } = useTranslation();
  const language = getLanguage();

  const [privacyData, setPrivacyData] = useState({});

  // todo: GET STATIC PAGES DATA API CALL
  const { data, isLoading } = useGetStaticPagesQuery({});

  useEffect(() => {
    if (data) {
      const filteredData = data.results.filter(
        (item) => item?.en_title === "Privacy Policy"
      );
      setPrivacyData(filteredData[0]);
    }
  }, [data]);

  const manipulateHTML = (htmlString) => {
    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Example manipulation: Add a class to all <p> tags
    doc.querySelectorAll("p").forEach((p) => {
      p.classList.add("privacy-paragraph");
      p.style.fontSize = "16px";
      p.style.lineHeight = "24px";
    });

    // Convert the manipulated HTML back to string
    const manipulatedHTMLString = doc.body.innerHTML;

    return manipulatedHTMLString;
  };

  const pageData =
    language === "en" ? privacyData?.en_content : privacyData?.ar_content;

  const manipulatedHTML = manipulateHTML(pageData);

  const sectionOne = parse(manipulatedHTML, { replace: (domNode) => domNode });

  return (
    <>
      {isLoading && <Loader />}
      <Navbar />
      <Wrapper dir={getDirection()}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Heading>
            {language === "en" ? privacyData?.en_title : privacyData?.ar_title}
          </Heading>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#969696",
            }}
          >
            {language === "en" ? "Last Update:" : "اخر تحديث:"}{" "}
            {formatDate(privacyData?.updated_at || new Date())}
          </Typography>
        </Box>
        <DataWrapper>
          <DataText>
            {sectionOne}
            {/* {translate("privacy.privacypolicy")} */}
          </DataText>
        </DataWrapper>
        {/* <DataWrapper>
          <SubHeading>{translate("privacy.collectdata-heading")}</SubHeading>
          <DataText>{translate("privacy.collectdata")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.inforSec-heading")}</SubHeading>
          <DataText>{translate("privacy.inforSec")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.inforStorage-heading")}</SubHeading>
          <DataText>{translate("privacy.inforStorage")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.email-heading")}</SubHeading>
          <DataText>{translate("privacy.email")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.cookies-heading")}</SubHeading>
          <DataText>{translate("privacy.cookies")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.webLink-heading")}</SubHeading>
          <DataText>{translate("privacy.webLink")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.personalData-heading")}</SubHeading>
          <DataText>{translate("privacy.personalData")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.contactList-heading")}</SubHeading>
          <DataText>{translate("privacy.contactList")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.Updates-heading")}</SubHeading>
          <DataText>{translate("privacy.Updates")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.Admission-heading")}</SubHeading>
          <DataText>{translate("privacy.Admission")}</DataText>
        </DataWrapper>
        <DataWrapper>
          <SubHeading>{translate("privacy.StoringData-heading")}</SubHeading>
          <DataText>{translate("privacy.StoringData")}</DataText>
        </DataWrapper> */}
      </Wrapper>
      <Footer />
    </>
  );
}

// Styled Components

const Wrapper = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  // alignItems: 'start',
  gap: "30px",
  padding: "50px 20px",
  margin: "30px auto",
}));

const DataWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  gap: "8px",
}));

const Heading = styled(Typography)({
  fontSize: "2.2rem",
  fontWeight: "800",
  color: "#0a0a33",
});
const DataText = styled(Typography)({
  fontSize: "14px",
  fontWeight: "500",
  color: "#000",
  textAlign: "start",
});
const SubHeading = styled(Typography)({
  fontSize: "16px",
  fontWeight: "700",
  color: "#000",
});

export default PrivacyPolicy;
