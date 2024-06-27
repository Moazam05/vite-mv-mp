import { Box, Container, Grid } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Navbar from "../../LandingPage/Components/Navbar";
import Footer from "../../Footer/Footer";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { formatDate } from "../../../../utils/MV";
import PetImage from "../../../../assets/BGimage2.webp";
import { useGetSingleBlogQuery } from "../../../../redux/MV/api/cmsApiSlice";
import Loader from "../../CommonComponents/Loader";
import parse from "html-react-parser";

const SingleBlog = () => {
  const { getLanguage, getDirection } = useTranslation();
  const language = getLanguage();
  const navigate = useNavigate();
  const { slug } = useParams();

  // todo: GET SINGLE BLOG
  const { data, isLoading } = useGetSingleBlogQuery(slug);

  // Helper function to manipulate HTML
  const manipulateHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Extract image and content
    const img = doc.querySelector("img")?.src;

    return { img };
  };

  const content = language === "en" ? data?.en_content : data?.ar_content;
  const title = language === "en" ? data?.en_title : data?.ar_title;
  const { img } = manipulateHTML(content);

  const manipulateHTMLTwo = (htmlString) => {
    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // remove image from the content
    doc.querySelectorAll("img").forEach((img) => {
      img.remove();
    });

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

  const manipulatedHTMLTwo = manipulateHTMLTwo(content);

  const sectionOne = parse(manipulatedHTMLTwo, {
    replace: (domNode) => domNode,
  });

  return (
    <>
      {isLoading && <Loader />}
      <Navbar />
      <Wrapper dir={getDirection()}>
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                color: "#76429e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "30px",
                "@media (max-width: 576px)": {
                  gap: "20px",
                },
              }}
            >
              <Box
                sx={{
                  fontSize: "25px",
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/blogs")}
              >
                <FaArrowLeftLong />
              </Box>
              <Box
                sx={{
                  fontSize: "35px",
                  fontWeight: "700",
                  "@media (max-width: 576px)": {
                    fontSize: "25px",
                  },
                }}
              >
                {title}
              </Box>
            </Box>
            <Box
              sx={{
                color: "#969696",
                margin: "40px 0",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "center",
                "@media (max-width: 576px)": {
                  margin: "30px 0",
                },
              }}
            >
              <Box> Posted On {formatDate(data?.created_at)}</Box>
            </Box>
          </Grid>
          {/* 2nd */}
          <Grid item xs={12} md={2}></Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {img ? (
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  overflow: "hidden",
                  "@media (max-width: 576px)": {
                    height: "100%",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt="blog"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    "@media (max-width: 576px)": {
                      height: "100%",
                    },
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <Box sx={{ fontSize: "4rem", color: "#bbb" }}>
                  {title?.charAt(0)}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                margin: "50px 0",
                "@media (max-width: 576px)": {
                  margin: "30px 0",
                },
              }}
            >
              {sectionOne}
            </Box>
          </Grid>
          <Grid item xs={12} md={2}></Grid>
        </Grid>
      </Wrapper>
      <Footer />
    </>
  );
};

const Wrapper = styled(Container)(({ theme }) => ({
  padding: "50px 20px",
  margin: "30px auto",
}));

export default SingleBlog;
