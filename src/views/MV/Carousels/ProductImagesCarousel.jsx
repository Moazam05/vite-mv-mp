import React, { useState } from "react";
import { Grid, IconButton, Box, CardMedia } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { styled } from "@mui/system";
import ReactPlayer from "react-player";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import { useTranslation } from "../../../contexts/MV/LanguageContext";

const ProductImagesCarousel = ({
  images,
  videoUrl,
  selectedImageIndex,
  setSelectedImageIndex,
}) => {
  const { getDirection } = useTranslation();
  const direction = getDirection();

  //   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowVideo(false); // Hide video when an image is clicked
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const prevImage = () => {
    if (showVideo) {
      setShowVideo(false);
    } else {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    if (!showVideo && selectedImageIndex === images.length - 1) {
      setShowVideo(true);
    } else {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <CarouselContainer dir={direction}>
      {showVideo ? (
        <Box>
          <ReactPlayer
            url={videoUrl}
            width="600px"
            height="400px"
            controls={true}
            config={{
              facebook: {
                attributes: {
                  "data-width": "600px",
                  "data-height": "400px",
                },
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "80%",
            height: "400px",
            display: "flex",
            borderRadius: "15px",
            border: "1px solid #E4E7E9",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SelectedImage src={images[selectedImageIndex]} />
        </Box>
      )}
      <ImagesData
        container
        md={9}
        sx={{ display: "flex", alignItems: "center", mt: "40px" }}
      >
        <IconButton onClick={prevImage}>
          {direction === "ltr" ? (
            <ArrowBack
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                bgcolor: "#009444",
                right: "20px",
                color: "white",
              }}
            />
          ) : (
            <ArrowForward
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                bgcolor: "#009444",
                right: "20px",
                color: "white",
              }}
            />
          )}
        </IconButton>
        {images.map((image, index) => (
          <Thumbnail
            item
            md={1.3}
            sx={{ ml: "20px" }}
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <ThumbnailImage src={image} />
          </Thumbnail>
        ))}
        {videoUrl && (
          <Thumbnail item md={1.3} sx={{ ml: "20px" }} onClick={toggleVideo}>
            <ThumbnailVideo src={videoUrl}>
              <SmartDisplayOutlinedIcon fontSize="large" />
            </ThumbnailVideo>
          </Thumbnail>
        )}
        <IconButton onClick={nextImage}>
          {direction === "ltr" ? (
            <ArrowForward
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                bgcolor: "#009444",
                right: "20px",
                color: "white",
              }}
            />
          ) : (
            <ArrowBack
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                bgcolor: "#009444",
                right: "20px",
                color: "white",
              }}
            />
          )}
        </IconButton>
      </ImagesData>
    </CarouselContainer>
  );
};

// Styled Components
const CarouselContainer = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
}));

const Thumbnail = styled(Grid)(() => ({
  cursor: "pointer",
  transition: "opacity 0.2s ease-in-out",
  width: "20%",
  height: "70px",
  "&:hover": {
    opacity: 0.7,
  },
}));
const ImagesData = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  mt: "40px",
  [theme.breakpoints.down("sm")]: {

  },
}));

const ThumbnailImage = styled("img")({
  maxWidth: "100%",
  height: "100%",
  alignItems: "center",
  border: "1px solid #E4E7E9",
});

const ThumbnailVideo = styled(CardMedia)({
  maxWidth: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #E4E7E9",
});

const SelectedImage = styled("img")({
  maxWidth: "100%",
  height: "100%",
  borderRadius: "15px",
});

export default ProductImagesCarousel;
