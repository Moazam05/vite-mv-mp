import React from "react";

// Assets Import
import biokats from "../../assets/biokats.webp";
import burgess from "../../assets/burgess.webp";
import croci from "../../assets/croci.webp";
import flamingo from "../../assets/flamingo.webp";
import garpi from "../../assets/garpi.webp";
import gimbi from "../../assets/gimbi.webp";
import gimborn from "../../assets/gimborn.webp";
import gimcat from "../../assets/gimcat.webp";
import gimdog from "../../assets/gimdog.webp";
import nutram from "../../assets/nutram.webp";
import Vitakraft from "../../assets/Vitakraft.webp";

import { Container, Box, styled } from "@mui/material";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css";

function Partners() {
  const partners = [
    { image: biokats },
    { image: burgess },
    { image: croci },
    { image: flamingo },
    { image: garpi },
    { image: gimbi },
    { image: gimborn },
    { image: gimcat },
    { image: gimdog },
    { image: nutram },
    { image: Vitakraft },
  ];
  return (
    <Wrapper>
      <Swiper
        spaceBetween={0}
        loop={true}
        speed={2000}
        // slidesPerView={6}
        modules={[Autoplay]}
        className="mySwiper"
        breakpoints={{
          0: {
            slidesPerView: 0.7,
          },
          375: {
            slidesPerView: 0.9,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1340: {
            slidesPerView: 2.5,
          },
        }}
      >
        {partners.length > 0 &&
          partners?.map((partner, index) => (
            <SwiperSlide
              key={index}
              style={{
                maxWidth: "10%",
                height: "100px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={partner.image}
                alt={`Partner ${index}`}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </Wrapper>
  );
}

const Wrapper = styled(Container)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  backgroundColor: "#fff",
});

const ImgBox = styled(Box)({
  // maxWidth: "100%",
  // height : "auto"

  flex: "0 0 auto",
  maxWidth: "calc(33.33% - 12px)",
  height: "auto",
});

export default Partners;
