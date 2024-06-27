import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import styled from "styled-components";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import Navbar from "../LandingPage/Components/Navbar";
import Footer from "../Footer/Footer";
import { useGetBlogsQuery } from "../../../redux/MV/api/cmsApiSlice";
import Loader from "../CommonComponents/Loader";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { formatDateString } from "../../../utils/MV";
import { FaArrowLeftLong } from "react-icons/fa6";

// Helper function to manipulate HTML
const manipulateHTML = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Extract image and content
  const img = doc.querySelector("img")?.src;
  const text = doc.body.innerText || doc.body.textContent;

  return { img, text };
};

const Blogs = () => {
  const { getLanguage, getDirection } = useTranslation();
  const language = getLanguage();
  const navigate = useNavigate();

  // todo: GET ALL BLOGS API call
  const { data, isLoading } = useGetBlogsQuery({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (data?.results) {
      const parsedBlogs = data.results.map((item) => {
        const content = language === "en" ? item?.en_content : item?.ar_content;
        const { img, text } = manipulateHTML(content);
        return {
          title: language === "en" ? item?.en_title : item?.ar_title,
          img,
          text,
          slug: item?.slug,
          date: item?.created_at,
        };
      });
      setBlogs(parsedBlogs);
    }
  }, [data, language]);

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Navbar />
      <Wrapper dir={getDirection()}>
        <Grid container spacing={4}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                onClick={() => handleBlogClick(blog?.slug)}
                sx={{
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  height: "420px",
                  transition: "transform 0.2s",
                  backgroundColor: "fff",
                }}
              >
                {blog?.img ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "200px",
                    }}
                  >
                    <img
                      src={blog?.img}
                      alt={blog?.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
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
                      {blog?.title?.charAt(0)}
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    marginTop: "20px",
                    height: "50px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontWeight: "700",
                  }}
                >
                  {blog?.title}
                </Box>
                <Box
                  sx={{
                    height: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  <BlogContent>{blog?.text}</BlogContent>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "30px",
                    color: "#76429e",
                  }}
                >
                  <Box
                    sx={{
                      color: "#76429e",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {language === "en" ? "READ MORE" : "قراءة المزيد"}
                    <Box
                      sx={{
                        fontSize: "20px",
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      {getDirection() === "ltr" ? (
                        <FaArrowRightLong />
                      ) : (
                        <FaArrowLeftLong />
                      )}
                    </Box>
                  </Box>
                  <Box> {formatDateString(blog?.date, "slash")}</Box>
                </Box>
              </Box>
            </Grid>
          ))}
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

const BlogContent = styled(Typography)({
  fontSize: "1rem",
  color: "#666",
});

export default Blogs;
