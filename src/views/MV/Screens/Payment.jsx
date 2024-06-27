import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";

// Import the images
import CardsImgs from "../../../assets/cards.webp";
import applepay from "../../../assets/applePay.webp";
import stc from "../../../assets/stc.webp";
import tabby from "../../../assets/tabby.webp";
import cod from "../../../assets/cod.webp";

// Components Import
import {
  Box,
  Grid,
  IconButton,
  Typography,
  styled,
  Button,
} from "@mui/material";

// import icons
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import Navbar from "../LandingPage/Components/Navbar";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import { baseUrl } from "../../../constants/MV/api";

function Payment() {
  const { translate, getLanguage, getDirection } = useTranslation();
  const [loading, setLoading] = useState(false);
  const token = window.localStorage.getItem("mp-user-token");
  const { id } = useParams();
  const [paymentForm, setPaymentForm] = useState();

  const [toggleState, setToggleState] = useState([false, true]); // Set "Cash on Delivery" (index 1) to true by default
  const navigate = useNavigate();

  const handlePayment = async () => {
    window.open(`${baseUrl}/api/payfort/payment/${id}`, '_blank');
  }

  const handleToggleChange = (index) => {
    const updatedToggleState = toggleState.map((state, i) =>
      i === index ? true : false
    );
    setToggleState(updatedToggleState);
  };


  return (
    <>
      <Navbar />
      <Wrapper dir={getDirection()}>
        <Grid
          container
          my={3}
          sx={{ display: "flex", gap: "50px", justifyContent: "center" }}
        >
          <Grid item md={6} sx={{ height: "auto", padding: "20px" }}>
            <Box
              sx={{
                border: " 1px solid #DDDDDD",
                marginBottom: "10px",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <CardHeading>{translate("checkout.option")}</CardHeading>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardBox>
                  <ToggleTextBox>
                    <IconButton onClick={() => handleToggleChange(0)}>
                      {toggleState[0] ? (
                        <RadioButtonChecked />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </IconButton>
                    <DataText>{translate("checkout.card")}</DataText>
                  </ToggleTextBox>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      height: "10px",
                      width: "auto",
                    }}
                  >
                    <img src={CardsImgs} alt="icon" />
                  </Box>
                </CardBox>

                <CardBox sx={{ opacity: "0.5", cursor: "not-allowed" }}>
                  <ToggleTextBox>
                    <IconButton>
                      <RadioButtonUnchecked />
                    </IconButton>
                    <DataText>{translate("checkout.apple")}</DataText>
                  </ToggleTextBox>

                  <ImageBox>
                    <img src={applepay} alt="icon" />
                  </ImageBox>
                </CardBox>
                <CardBox sx={{ opacity: "0.5", cursor: "not-allowed" }}>
                  <ToggleTextBox>
                    <IconButton>
                      <RadioButtonUnchecked />
                    </IconButton>
                    <DataText>{translate("checkout.stc")}</DataText>
                  </ToggleTextBox>

                  <ImageBox>
                    <img src={stc} alt="icon" />
                  </ImageBox>
                </CardBox>
                <CardBox sx={{ opacity: "0.5", cursor: "not-allowed" }}>
                  <ToggleTextBox>
                    <IconButton>
                      <RadioButtonUnchecked />
                    </IconButton>
                    <DataText>{translate("checkout.tabby")}</DataText>
                  </ToggleTextBox>

                  <ImageBox>
                    <img src={tabby} alt="icon" />
                  </ImageBox>
                </CardBox>

                <CardBox>
                  <ToggleTextBox>
                    <IconButton onClick={() => handleToggleChange(1)}>
                      {toggleState[1] ? (
                        <RadioButtonChecked />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </IconButton>
                    <DataText>{translate("checkout.cash")}</DataText>
                  </ToggleTextBox>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      height: "10px",
                      width: "auto",
                    }}
                  >
                    <img src={cod} alt="icon" />
                  </Box>
                </CardBox>
              </Box>
            </Box>
            <Button
              size="small"
              style={{
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                marginTop: "10px",
                padding: "4px 24px",
                width: "100%",
                height: "40px",
                borderRadius: "24px",
              }}
              color="primary"
              variant="contained"
              disableElevation
              onClick={() => {
                if (toggleState[1]) {
                  navigate("/profile/order-history");
                } else {
                  handlePayment();
                }
              }}
            >
              {" "}
              Proceed{" "}
            </Button>
          </Grid>
        </Grid>
      </Wrapper>
    </>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  margin: "40px ",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const CardHeading = styled(Typography)(() => ({
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 2px ",
}));

const CardBox = styled(Box)(() => ({
  padding: "10px",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  border: " 1px solid #DDDDDD",
  marginBottom: "10px",
  borderRadius: "10px",
  padding: "10px",
}));

const ToggleTextBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
  gap: "6px",
}));
const ImageBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  height: "10px",
  width: "auto",
  padding: "8px",
  border: "1px solid #DDDDDD",
  borderRadius: "5px",
}));

const DataText = styled(Typography)(() => ({
  fontSize: "13px",
  fontWeight: "400",
}));

export default Payment;
