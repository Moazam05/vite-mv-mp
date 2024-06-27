import { styled } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Contexts Import
import { useCart } from "../../../contexts/MV/CartContext";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
// MUI Components Import
import {
  Box,
  Button,
  ButtonGroup,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
// Components Import
import Footer from "../Footer/Footer";
import LoginNotifModal from "../../../views/MV/Modals/LoginNotifModal";
// Icons import
import EmptyCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { toast } from "react-toastify";
import Navbar from "../LandingPage/Components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartProducts,
    incrementById,
    decrementById,
    calculateTotalPrice,
    emptyCart,
    isOrderLimitExceeded,
  } = useCart();
  const totalPrice = calculateTotalPrice();
  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleIncrement = (id, vendorId) => {
    if (isOrderLimitExceeded(id, vendorId)) {
      const vendorObj = cartProducts.find((v) => v.vendor.id === vendorId);
      const productObj = vendorObj.products.find((p) => p.id === id);
      toast.warning(
        `Order limit (${parseFloat(productObj.orderLimit).toFixed(
          0
        )}) cannot be exceeded!`
      );
      return;
    }
    incrementById(id, vendorId);
  };

  const handleDecrement = (id, vendorId) => {
    decrementById(id, vendorId);
  };

  const isAnyProductBelowMinQty = cartProducts.some((vendor) =>
    vendor.products.some(
      (product) => product.quantity < parseFloat(product.minQty)
    )
  );

  const checkToken = () => {
    const token = window.localStorage.getItem("mp-user-token");

    if (token === null) {
      setLoginModalOpen(true);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        <LoginNotifModal open={loginModalOpen} setOpen={setLoginModalOpen} />
        <Grid container my={5} gap={"40px"} dir={getDirection()}>
          <Grid item md={7.5}>
            <ProductBox>
              {cartProducts?.length === 0 ? (
                <Typography sx={{ textAlign: "center", padding: "15px" }}>
                  {translate("cart.no")}
                </Typography>
              ) : (
                <>
                  <EmptyCartBtn
                    endIcon={<EmptyCartIcon sx={{ marginRight: "8px" }} />}
                    variant="outlined"
                    color="success"
                    onClick={() => emptyCart()}
                  >
                    empty cart
                  </EmptyCartBtn>
                  {cartProducts.map((cart) => (
                    <Box
                      key={cart.vendor.id}
                      sx={{
                        marginBottom: "20px",
                        padding: "20px",
                        border: " 1px solid #DDDDDD",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        onClick={() =>
                          navigate(`/vendordetail/${cart.vendor.profile}`)
                        }
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "15px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f6f6f6",
                        }}
                      >
                        {cart.vendor.name}
                      </Typography>
                      {cart.products.map((product, index) => {
                        // Assuming variants data is available as shown in the original code
                        const variant = product?.variants?.find(
                          (v) => v.id === product?.id
                        );

                        return (
                          <CartWrapper key={index} item md={12}>
                            <ImageWrapper>
                              <ImageBox
                                component="img"
                                image={variant?.variantImage || product.image}
                                alt="image"
                              />
                            </ImageWrapper>
                            <Detailbox>
                              <Heading>
                                {language === "ar"
                                  ? product.nameAr
                                  : product.nameEn}
                              </Heading>
                              <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                mt={"15px"}
                              >
                                <Box
                                  display={"flex"}
                                  flexDirection={"row"}
                                  alignItems={"center"}
                                  gap={"5px"}
                                >
                                  <Heading sx={{ color: "#E92E67" }}>
                                    {product.discountedPrice === null
                                      ? product.vatOnlinePrice
                                      : product.discountedPrice}
                                  </Heading>
                                </Box>
                                <QuantityButtons
                                  size="small"
                                  aria-label="small outlined button group"
                                >
                                  <Button
                                    onClick={() =>
                                      handleDecrement(
                                        product.id,
                                        product.vendorId
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <Button sx={{ fontWeight: "bold" }}>
                                    {product.quantity}
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleIncrement(
                                        product.id,
                                        product.vendorId
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                </QuantityButtons>
                              </Box>
                              {product.quantity < product.minQty && (
                                <Typography
                                  variant="body2"
                                  sx={{ color: "red" }}
                                >
                                  Selected Quantity is below the minimum order
                                  limit: {parseFloat(product.minQty).toFixed(0)}
                                </Typography>
                              )}
                              {variant?.variantCombination && (
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#5F6C72" }}
                                  >
                                    Variant
                                  </Typography>
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
                              )}
                            </Detailbox>
                          </CartWrapper>
                        );
                      })}
                    </Box>
                  ))}
                </>
              )}
            </ProductBox>
          </Grid>
          <Grid
            item
            md={4}
            display={"flex"}
            flexDirection={"column"}
            gap={"20px"}
          >
            <CartTotal item md={10}>
              <Typography
                sx={{
                  color: "#191C1F",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "15px 10px",
                }}
              >
                {translate("cart.total")}
              </Typography>

              <Box
                display={"flex"}
                flexDirection={"column"}
                padding={"0px 10px 20px"}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography sx={{ fontSize: "14px", color: "#5F6C72" }}>
                    {translate("cart.sub")}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                    {parseFloat(totalPrice || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    SAR
                  </Typography>
                </Box>
                <Box
                  mt={"8px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Typography sx={{ fontSize: "14px", color: "#5F6C72" }}>
                    {translate("cart.dis")}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                    0
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
                    {translate("cart.tot")}
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
                  onClick={() => checkToken()}
                  disabled={isAnyProductBelowMinQty}
                >
                  {translate("cart.proceed")}
                </Button>
              </Box>
            </CartTotal>
          </Grid>
        </Grid>
      </Wrapper>
      <Footer />
    </>
  );
};

// Styled Components
const Wrapper = styled(Box)(({ theme }) => ({
  margin: "40px",
  [theme.breakpoints.down("sm")]: {
    margin: "5px",
    padding: "10px",
  },
}));

const QuantityButtons = styled(ButtonGroup)(({ theme }) => ({
  border: "1px solid #009444",
  borderRadius: "20px",
  width: "150px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiButton-root": {
    border: "none",
  },
  "& .MuiButton-root:first-child": {
    border: "none",
  },
  "& .MuiButton-root:last-child": {},
  [theme.breakpoints.down("sm")]: {
    width: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "25px",
    gap: "2px",
    "& .MuiButtonBase-root": {
      padding: "8px",
      minWidth: "unset",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },
}));

const EmptyCartBtn = styled(Button)(() => ({
  width: "auto",
  alignSelf: "flex-end",
  textTransform: "capitalize",
}));

const CartWrapper = styled(Grid)(({ theme }) => ({
  // padding: "20px",
  borderRadius: "10px",
  boxShadow: ".2px .2px 2px 0px rgba(255,255,255,.4)",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  // border: " 1px solid #DDDDDD",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
  },
}));

const CartTotal = styled(Grid)(({ theme }) => ({
  padding: "10px",
  borderRadius: "10px",
  boxShadow: ".2px .2px 2px 0px rgba(255,255,255,.4)",
  height: "300px",
  border: " 1px solid #DDDDDD",
  [theme.breakpoints.down("sm")]: {
    width: "290px",
  },
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "16px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  width: "100px",
  height: "100px",
  [theme.breakpoints.down("sm")]: {
    width: "50px",
  },
}));

const ProductBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    display: "flex",
    gap: "10px",
    width: "100%",
  },
}));

const Detailbox = styled(Box)({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
});

const ImageBox = styled(CardMedia)(({ theme }) => ({
  width: "100px",
  height: "100px",
  objectFit: "contain",
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: {
    width: "50px",
    borderRadius: "10px",
    objectFit: "cover",
  },
}));

export default Cart;
