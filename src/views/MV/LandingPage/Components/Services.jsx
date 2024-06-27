import React from "react";

import { Box, Container, Grid, Typography, styled } from "@mui/material";

// Assets Import
import secure from "../../../../assets/secure.webp";
import service from "../../../../assets/service.webp";
import shipping from "../../../../assets/shipping.webp";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";

function Services() {
  const { translate, getDirection } = useTranslation();
  const serviceList = [
    {
      detail: translate("services.delivery"),
      heading: translate("services.fast"),
      image: shipping,
    },
    // {
    //     detail: translate("services.all"),
    //     heading: translate("services.back"),
    //     image: returnData,
    // },
    {
      detail: translate("services.online"),
      heading: translate("services.easy"),
      image: secure,
    },
    {
      detail: translate("services.any"),
      heading: translate("services.support"),
      image: service,
    },
  ];
  return (
    <Wrapper>
      <ServiceWrapper container  >
        {serviceList.map((service, index) => (
          <ServiceCard
            item
            key={index}
            xs={12}
            sm={4}
            md={4}
            lg={4}
            dir={getDirection()}
          >
            <ImgBox>
              <img
                src={service.image}
                style={{ height: "25px", maxWidth: "100%" }}
                alt={service.heading}
              />
            </ImgBox>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#454545",
                  textAlign: "start",
                }}
              >
                {service.heading}
              </Typography>
              <Typography
                sx={{ fontSize: "11px", color: "#61676A", textAlign: "start" }}
              >
                {service.detail}
              </Typography>
            </Box>
          </ServiceCard>
        ))}
      </ServiceWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(Container)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0",
  margin: "40px auto",
  gap: "20px",
});

const ServiceCard = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
});
const ServiceWrapper = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  gap: '0px',
  [theme.breakpoints.down("sm")]: {
    gap: '10px',
  },
}));

const ImgBox = styled(Grid)({
  height: "70px",
  width: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#e3e2de",
});

export default Services;
