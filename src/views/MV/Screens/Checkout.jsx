import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/MV/CartContext";

// MUI Components Import
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@mui/material";

// Loader Import
import { MoonLoader } from "react-spinners";

// React Toastify Imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components Import
import Navbar from "../LandingPage/Components/Navbar";
import Footer from "../Footer/Footer";

// import icons
import EditIcon from "@mui/icons-material/EditCalendarOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import SelectAddressModal from "../Modals/SelectAddressModal";
import { baseUrl } from "../../../constants/MV/api";

const Checkout = () => {
  const token = window.localStorage.getItem("mp-user-token");
  const user = window.localStorage.getItem("username");

  const navigate = useNavigate();

  const { cartProducts, calculateTotalPrice, emptyCart } = useCart();
  const totalPrice = calculateTotalPrice();

  const [selectAddressModalOpen, setSelectAddressModalOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [modalFor, setModalFor] = useState(null);

  const [orderNotes, setOrderNotes] = useState("");
  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();
  const [updating, setUpdating] = useState(false);

  // const orderProducts = cartProducts.map((product) => ({
  //   quantity: product.quantity,
  //   product: product?.product === true ? product.id : product.productID,
  //   variant: product?.product === true ? null : product.id,
  // }));

  const orderProducts = cartProducts.map(item => ({
    vendor: item.vendor.id,
    products: item.products.map(product => ({
      product: product.id,
      quantity: product.quantity,
      variant: product?.variants?.length > 0 ? product?.variants[0]?.id : null
    }))
  }));

  const placeOrder = () => {
    if (!billingAddress) {
      toast.error("Please set an address.");
      return;
    }
    setUpdating(true);
    axios
      .post(
        `${baseUrl}/mv/api/order`,
        {
          status: 1,
          total_price: totalPrice,
          tax: 0,
          shipping: 1,
          order_products: orderProducts,
          order_address: shippingAddress.id,
          other_address: billingAddress.id,
          notes: orderNotes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          setUpdating(false);
          navigate(`/payment/${response.data.order_id}`);
          emptyCart();
        }, 3000);
      })
      .catch((error) => {
        console.log("Error", error);
        toast.error("There was an error placing your order!");
        setUpdating(false);
      });
  };

  const fetchBillingAddress = () => {
    axios
      .get(`${baseUrl}/api/addresses/type/billing`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setBillingAddress(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchShippingAddress = () => {
    axios
      .get(`${baseUrl}/api/addresses/type/shipping`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setShippingAddress(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModal = (modalFor) => {
    setSelectAddressModalOpen(true);
    const modalForKeyword = modalFor === "billing" ? "billing" : "shipping";
    setModalFor(modalForKeyword);
  };

  useEffect(() => {
    fetchBillingAddress();
    fetchShippingAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />

      <Wrapper dir={getDirection()}>
        <SelectAddressModal
          open={selectAddressModalOpen}
          setOpen={setSelectAddressModalOpen}
          setBillingAddress={setBillingAddress}
          setShippingAddress={setShippingAddress}
          modalFor={modalFor}
        />
        <Grid
          container
          my={3}
          sx={{ display: "flex", gap: "50px", justifyContent: "center" }}
        >
          <Grid item md={6} sx={{ height: "auto", padding: "20px" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardHeading>{translate("checkout.to")}</CardHeading>
              <AddButton
                size="medium"
                color="secondary"
                variant="contained"
                onClick={() => navigate("/profile/addresses")}
              >
                <AddIcon sx={{ color: "#fff", fontSize: "16px" }} />
                {translate("checkout.new")}
              </AddButton>
            </Box>
            <DataBox>
              <DataText>{user}</DataText>
            </DataBox>
            {billingAddress ? (
              <DataBox>
                <CardHeading>Billing Address</CardHeading>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5px",
                      flexDirection: "row",
                    }}
                  >
                    <Label>{billingAddress?.address_label_display}</Label>
                    <EditIcon
                      sx={{ color: "#000", size: "16px", cursor: "pointer" }}
                      onClick={() => handleOpenModal("billing")}
                    />
                  </Box>
                  <Typography>{billingAddress?.fullname}</Typography>
                  <Typography>{billingAddress?.phonenumber}</Typography>
                  <Typography>
                    {" "}
                    {billingAddress?.address}, {billingAddress?.city},{" "}
                    {billingAddress?.country}{" "}
                  </Typography>
                </Box>
              </DataBox>
            ) : null}
            {shippingAddress ? (
              <DataBox>
                <CardHeading>Shipping Address</CardHeading>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5px",
                      flexDirection: "row",
                    }}
                  >
                    <Label>{shippingAddress?.address_label_display}</Label>
                    <EditIcon
                      sx={{ color: "#000", size: "16px", cursor: "pointer" }}
                      onClick={() => handleOpenModal("shipping")}
                    />
                  </Box>
                  <Typography>{shippingAddress?.fullname}</Typography>
                  <Typography>{shippingAddress?.phonenumber}</Typography>
                  <Typography>
                    {" "}
                    {shippingAddress?.address}, {shippingAddress?.city},{" "}
                    {shippingAddress?.country}{" "}
                  </Typography>
                </Box>
              </DataBox>
            ) : null}
            <Grid item my={3}>
              <CardHeading>{translate("checkout.add")}</CardHeading>
              <Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
                {translate("checkout.order")}
              </Typography>
              <StyledTextarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.currentTarget.value)}
              />
            </Grid>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#178F49",
                cursor: "pointer",
              }}
              onClick={() => navigate(-1)}
            >
              {translate("checkout.return")}
            </Typography>
          </Grid>
          <Grid
            item
            md={4}
            sx={{
              border: " 1px solid #DDDDDD",
              borderRadius: "10px",
              padding: "20px 4px",
            }}
          >
            <Typography
              sx={{
                color: "#191C1F",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "15px 10px",
              }}
            >
              {translate("checkout.summary")}
            </Typography>
            {cartProducts.length === 0 ? (
              <Typography sx={{ textAlign: "center", padding: "15px" }}>
                {translate("checkout.no")}
              </Typography>
            ) : (
              cartProducts?.map((cart) => (
                <Box key={cart.vendor.id} 
                  sx={{ marginBottom: "20px", padding: "20px", border: " 1px solid #DDDDDD", borderRadius: "12px" }}>
                  <Typography
                    sx={{ fontSize: "12px", fontWeight:"600", marginBottom: "15px", cursor: "pointer", borderBottom: "1px solid #f6f6f6" }}>
                    {cart.vendor.name}
                  </Typography>
                  {cart?.products?.map((product, index) => {
                    // Assuming variants data is available as shown in the original code
                    const variant = product?.variants?.find((v) => v.id === product?.id);
                    return (
                      <Box key={index}>
                        <Box
                          style={{
                            display: "flex",
                            gap: "8px",
                            padding: "10px 10px",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={variant?.variantImage || product?.image}
                              alt="pic"
                              style={{
                                width: "55px",
                                height: "55px",
                                borderRadius: "5px",
                                marginRight: "8px",
                              }}
                            />
                            <Box
                              display={"flex"}
                              flexDirection={"column"}
                              gap={"5px"}
                            >
                              <Typography fontSize={"13px"} textAlign={"justify"}>
                                {language === "ar"
                                  ? product?.nameAr
                                  : product?.nameEn}
                              </Typography>
                              <Typography fontSize={"14px"}>
                                {product.quantity} *{" "}
                                <span style={{ color: "#2DA5F3" }}>
                                  {" "}
                                  {product.discountedPrice === null
                                    ? product.vatOnlinePrice
                                    : product.discountedPrice}{" "}
                                  SAR
                                </span>{" "}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {variant?.variantCombination && (
                              <>
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#5F6C72" }}
                                  >
                                    Variant
                                  </Typography>
                                </Box>
                                <Box>
                                  <Button
                                    sx={{
                                      border: "1px solid #00A9BF",
                                      textTransform: "none",
                                      padding: "2px 12px",
                                      backgroundColor: "#00A9BF",
                                      color: "#fff",
                                      margin: "5px 0 10px 0",
                                      cursor: "auto",
                                      "&:hover": {
                                        backgroundColor: "#00A9BF",
                                        color: "#fff",
                                      },
                                    }}
                                  >
                                    {variant?.variantCombination}
                                  </Button>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ))
            )}
            <Box display={"flex"} flexDirection={"column"} padding={"10px"}>
              <DiscountWrapper>
                <Discountbar placeholder={translate("checkout.code")} />
                <IconButton
                  type="button"
                  sx={{
                    borderRadius: "18px",
                    width: "25%",
                    border: "1px solid #178F49",
                  }}
                  aria-label="search"
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#178F49",
                      fontWeight: "600",
                    }}
                  >
                    {translate("checkout.apply")}
                  </Typography>
                </IconButton>
              </DiscountWrapper>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography sx={{ fontSize: "14px", color: "#5F6C72" }}>
                  {translate("checkout.sub")}
                </Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  {parseFloat(totalPrice || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  SAR
                </Typography>
              </Box>
              <Box mt={"8px"} display={"flex"} justifyContent={"space-between"}>
                <Typography sx={{ fontSize: "14px", color: "#5F6C72" }}>
                  {translate("checkout.dis")}
                </Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  0
                </Typography>
              </Box>
              <Box mt={"8px"} display={"flex"} justifyContent={"space-between"}>
                <Typography sx={{ fontSize: "14px", color: "#5F6C72" }}>
                  {translate("checkout.tax")}
                </Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  15%
                </Typography>
              </Box>
              <Box
                mt={"20px"}
                display={"flex"}
                justifyContent={"space-between"}
                borderTop={"1px solid #DDDDDD"}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "black",
                    fontWeight: "bold",
                    mt: "10px",
                  }}
                >
                  {translate("checkout.grand")}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold", mt: "10px" }}
                >
                  {parseFloat(totalPrice || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  SAR
                </Typography>
              </Box>
            </Box>
            <Box
              mt={2}
              mb={4}
              gap={2}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                size="small"
                style={{
                  textTransform: "none",
                  padding: "4px 24px",
                  width: "95%",
                  height: "40px",
                  borderRadius: "24px",
                }}
                color="secondary"
                variant="contained"
                onClick={() => placeOrder()}
              >
                {updating ? (
                  <>
                    <MoonLoader color="#fff" size={20} />
                  </>
                ) : (
                  translate("checkout.payment")
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Wrapper>
      <Footer />
    </>
  );
};

// Styled Components

const Wrapper = styled(Box)(({ theme }) => ({
  margin: "40px ",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  width: "auto",
  height: "35px",
  borderRadius: "30px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "40%",
  },
}));

const CardHeading = styled(Typography)(() => ({
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 2px ",
}));
const StyledTextarea = styled("textarea")(() => ({
  background: "#fff",
  borderRadius: "8px",
  fontSize: "16px",
  margin: "8px 0",
  height: "100px",
  width: "100%",
  border: "1px solid #C9CFD2",
}));

const Label = styled(Box)(() => ({
  fontSize: "10px",
  fontWeight: "700",
  background: "#a3a2a2",
  color: "#000",
  padding: "8px",
  borderRadius: "5px",
}));

const CardBox = styled(Box)(() => ({
  padding: "10px",
  width: "30%",
  display: "flex",
  flexDirection: "column",
  // margin: '15px 0',
  justifyContent: "center",
  alignItems: "center",
}));

const DataBox = styled(Box)(() => ({
  padding: "10px 15px",
  backgroundColor: "#F9F9F9",
  width: "auto",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  margin: "15px 0",
  position: "relative",
}));

const DataText = styled(Typography)(() => ({
  fontSize: "13px",
  fontWeight: "400",
}));
const ToogleWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const DiscountWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingTop: "20px",
  paddingBottom: "30px",
}));

const Discountbar = styled(InputBase)(() => ({
  height: "40px",
  width: "70%",
  borderRadius: "20px",
  border: "1px solid #B4B4B4",
  padding: "10px",
}));

export default Checkout;
