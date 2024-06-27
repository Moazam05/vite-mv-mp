import { useEffect, useState } from "react";
// MUI Components Import
import { Container, styled } from "@mui/material";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css";
import { useFetchBannersQuery } from "../../../../redux/MV/api/landingPageApiSlice";
import Loader from "../../../../components/MV/Loaders/Loader";

const Banner = {
  width: "100%",
  height: "500px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  borderRadius: "12px",
  background: "none",
  cursor: "pointer",
  objectFit: "cover",
};

function BannersCarousel() {
  const [banners, setBanners] = useState([]);

  // todo: GET BANNERS DATA API CALL
  const { data, isLoading } = useFetchBannersQuery({});

  useEffect(() => {
    if (data) {
      setBanners(data);
    }
  }, [data]);

  return (
    <Wrapper>
      {isLoading && <Loader />}
      <Swiper
        className="mySwiper"
        autoHeight="true"
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        speed={1000}
        effect="fade"
      >
        {banners?.map((img, index) => (
          <SwiperSlide key={index} style={Banner}>
            <img
              src={img.image}
              alt="Banner"
              style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  );
}

// Styled Components

const Wrapper = styled(Container)({
  margin: "0px auto",
});

export default BannersCarousel;
