import { useEffect, useState } from "react";
import { Box, Container, Typography, styled } from "@mui/material";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import Navbar from "../LandingPage/Components/Navbar";
import Footer from "../Footer/Footer";
import { useGetStaticPagesQuery } from "../../../redux/MV/api/cmsApiSlice";
import Loader from "../CommonComponents/Loader";
import { formatDate } from "../../../utils/MV";
import parse from "html-react-parser";

function ReturnPolicy() {
  const { getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const [policyData, setPolicyData] = useState();

  // todo: GET STATIC PAGES DATA API CALL
  const { data, isLoading } = useGetStaticPagesQuery({});

  useEffect(() => {
    if (data) {
      const filteredData = data.results.filter(
        (item) => item?.en_title === "Return Policy"
      );
      setPolicyData(filteredData[0]);
    }
  }, [data]);

  const manipulateHTML = (htmlString) => {
    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Convert the manipulated HTML back to string
    const manipulatedHTMLString = doc.body.innerHTML;

    return manipulatedHTMLString;
  };

  const pageData =
    language === "en" ? policyData?.en_content : policyData?.ar_content;

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
            {language === "en" ? policyData?.en_title : policyData?.ar_title}
          </Heading>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#969696",
            }}
          >
            {language === "en" ? "Last Update:" : "اخر تحديث:"}{" "}
            {formatDate(policyData?.updated_at)}
          </Typography>
        </Box>

        <DataWrapper>
          {sectionOne}

          {/* <SubHeading>{translate("return.subhead")}</SubHeading>
          <ol>
            <li>
              <DataText>{translate("return.return1")}</DataText>
            </li>
            <li>
              <DataText>{translate("return.return2")}</DataText>
            </li>
            <li>
              <DataText>{translate("return.return3")}</DataText>
            </li>
            <li>
              <DataText>{translate("return.return4")}</DataText>
            </li>
            <li>
              <DataText>{translate("return.return5")}</DataText>
            </li>
          </ol> */}
        </DataWrapper>
      </Wrapper>
      <Footer />
    </>
  );
}

// Styled Components

const Wrapper = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  // alignItems: 'start',
  gap: "30px",
  padding: "50px 20px",
  margin: "30px auto",
}));

const DataWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  gap: "15px",
}));

const Heading = styled(Typography)({
  fontSize: "2.2rem",
  fontWeight: "800",
  color: "#0a0a33",
});

export default ReturnPolicy;
