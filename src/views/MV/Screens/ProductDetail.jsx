import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Context Import

// MUI Components Import
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Typography,
  styled,
} from "@mui/material";

// Components Import

// Import the images and Icon
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import world from "../../../assets/services/OIP.jpg";
import Mada from "../../../assets/services/payment-service-four.webp";
import Urway from "../../../assets/services/payment-service-one.webp";
import Paypal from "../../../assets/services/payment-service-three.webp";
import Checkout from "../../../assets/services/payment-service-two.webp";
import amazon from "../../../assets/services/th.jpg";
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import { useCart } from "../../../contexts/MV/CartContext";
import { baseUrl } from "../../../constants/MV/api";
import Navbar from "../LandingPage/Components/Navbar";
import ProductImagesCarousel from "../Carousels/ProductImagesCarousel";
import Tabbar from "../CommonComponents/Tabbar";
import Footer from "../Footer/Footer";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useQoute } from "../../../contexts/MV/QouteContext";

const img = [Urway, Checkout, Paypal, Mada, amazon, world];

const ProductDetail = () => {
  const { translate, getLanguage, getDirection } = useTranslation();
  const {
    addToCart,
    incrementById,
    decrementById,
    cartProducts,
    removeFromCart,
    isOrderLimitExceeded,
  } = useCart();

  const {
    addToQoute,
    incrementByQouteId,
    decrementByQouteId,
    qouteProducts,
    removeFromQoute,
  } = useQoute();

  const language = getLanguage();
  const [isInCartState, setIsInCartState] = useState();
  const [isInQouteState, setIsInQouteState] = useState();
  const [quantity, setQuantity] = useState(0);
  const [qouteQuantity, setQouteQuantity] = useState(0);

  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const token = window.localStorage.getItem("mp-user-token");
  const [reviews, setReviews] = useState([]);

  // For Carousel
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/ratings/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews details:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/product/detail/${id}`);
      const _images = [];
      for (let i = 0; i < response.data[0].images.length; i++) {
        _images.push(response.data[0].images[i].image);
      }
      setImages(_images);
      // add new key product: true on setProductDetail
      setProductDetail({ ...response.data[0], product: true });
      setProductVariants(response.data[0].variants);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const productInCart = cartProducts.some((vendorItem) =>
      vendorItem.products.some(
        (productItem) => productItem.id === productDetail.id
      )
    );

    if (productInCart) {
      const foundProduct = cartProducts.find((vendorItem) =>
        vendorItem.products.some(
          (productItem) => productItem.id === productDetail.id
        )
      );
      const productQuantity = foundProduct.products.find(
        (productItem) => productItem.id === productDetail.id
      ).quantity;

      setQuantity(productQuantity);
      setIsInCartState(true);
    } else {
      setQuantity(0);
      setIsInCartState(false);
    }
  }, [productDetail, cartProducts]);

  const handleAddToCart = () => {
    addToCart(productDetail);
  };

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
    if (isInCartState) {
      decrementById(id, vendorId);
      const updatedQuantity = cartProducts
        .find(
          (item) =>
            item.vendor.id === vendorId &&
            item.products.some((p) => p.id === id)
        )
        ?.products.find((p) => p.id === id)?.quantity;
      if (updatedQuantity <= 0) {
        const vendor = cartProducts.find(
          (item) =>
            item.vendor.id === vendorId &&
            item.products.some((p) => p.id === id)
        );
        if (vendor && vendor.products.length === 0) {
          removeFromCart(id, vendorId);
          setIsInCartState(false);
        }
      }
    }
  };

  // ADD TO QOUTE

  useEffect(() => {
    const product = qouteProducts.find((item) => item.id === productDetail.id);
    if (product) {
      setQouteQuantity(product?.quantity);
      setIsInQouteState(true);
    }
  }, [productDetail, qouteProducts]);

  useEffect(() => {
    const product = qouteProducts.find((item) => item.id === productDetail.id);

    if (product?.quantity === undefined) {
      setIsInQouteState(false);
      setQouteQuantity(0);
    }
  }, [qouteProducts, productDetail.id, quantity]);

  const handleAddToQoute = () => {
    addToQoute(productDetail);
  };

  const handleIncrementQoute = (id) => {
    // const product = qouteProducts.find((p) => p.id === id);
    incrementByQouteId(id);
  };

  const handleDecrementQoute = (id) => {
    if (isInQouteState) {
      decrementByQouteId(id);

      // Access updated quantity from the cart
      const updatedQouteQuantity = qouteProducts.find(
        (item) => item.id === id
      )?.quantity;

      if (updatedQouteQuantity <= 0) {
        removeFromQoute(id);
        setIsInQouteState(false);
      } else {
        setQouteQuantity(updatedQouteQuantity);
      }
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

  const handleVariant = (combination) => {
    setSelectedVariant(combination);
  };

  useEffect(() => {
    if (selectedVariant) {
      setProductDetail((prevState) => ({
        ...prevState,
        vat_onlinePrice: selectedVariant?.vat_onlinePrice,
        productQuantity: selectedVariant?.variantQuantity,
        id: selectedVariant?.id,
        product: false,
        productID: selectedVariant?.product,
      }));

      if (selectedVariant?.variantImage !== null) {
        // Add selected variant image to the beginning of the images array if it doesn't already exist
        if (!images.includes(selectedVariant.variantImage)) {
          setImages((prevState) => [
            selectedVariant.variantImage,
            ...prevState,
          ]);
        }

        // Ensure that the selected variant image is at the 0 index of the images array
        const updatedImages = images.filter(
          (image) => image !== selectedVariant.variantImage
        );
        setImages([selectedVariant.variantImage, ...updatedImages]);

        setSelectedImageIndex(0);
      }
    }
  }, [selectedVariant]);

  const allKeys = productVariants?.reduce((keys, variant) => {
    if (!variant?.variants) return keys;
    Object?.keys(variant.variants).forEach((key) => {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
    return keys;
  }, []);

  return (
    <Container>
      <Navbar />
      <Wrapper container my={4} dir={getDirection()}>
        <Grid item sm={11} md={5.7}>
          <ProductImagesCarousel
            images={images}
            videoUrl={productDetail.video_url}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />
        </Grid>

        <ProductData item sm={11} md={5.9}>
          <Ratebox width={"100%"} display={"flex"} alignItems={"center"}>
            <StarRatings
              rating={4}
              starRatedColor="#FFBD00"
              numberOfStars={4}
              starDimension="15px"
              starSpacing="0px"
            />
            <Typography fontSize={14} color={"#666"} fontWeight={"bold"}>
              {translate("productdetail.rate")}
            </Typography>
            <Typography fontSize={12} color={"#666"}>
              ({translate("productdetail.feed")})
            </Typography>
          </Ratebox>
          <Title>
            <Typography fontSize={20} color={"black"} fontWeight={"bold"}>
              {language === "ar"
                ? productDetail?.commons?.ar?.productName
                : productDetail?.commons?.en?.productName}
            </Typography>
          </Title>

          <Shop
            onClick={() =>
              navigate(`/vendordetail/${productDetail?.user_profile.slug}`)
            }
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "25px",
                width: "25px",
                borderRadius: "50%",
                border: "1px solid #e1e3eb",
                backgroundColor: "#ff98",
              }}
            >
              <StorefrontOutlinedIcon
                sx={{ fontSize: "16px", color: "#009444" }}
              />
            </Box>

            <Typography fontSize={17} color={"black"} fontWeight={"700"}>
              {productDetail?.user_profile?.company_name}
            </Typography>
          </Shop>

          <GridItems>
            <Items item my={1} md={6}>
              <Typography fontWeight={"bold"} fontSize={14} color={"#666"}>
                {translate("productdetail.sku")}{" "}
                <span style={{ color: "black" }}> {productDetail?.skU}</span>
              </Typography>
              <Typography fontWeight={"bold"} fontSize={14} color={"#666"}>
                {translate("productdetail.brand")}{" "}
                <span style={{ color: "black" }}>{productDetail?.brand}</span>
              </Typography>
            </Items>
            <Items item my={1} md={6}>
              <Typography fontWeight={"bold"} fontSize={14} color={"#666"}>
                {translate("productdetail.avail")}
                <span style={{ color: "#2DB224" }}>
                  {" "}
                  {productDetail?.stock?.productQuantity > 0
                    ? translate("productdetail.in")
                    : translate("productdetail.out")}
                </span>
              </Typography>
              <Typography fontWeight={"bold"} fontSize={14} color={"#666"}>
                {translate("productdetail.category")}
                <span style={{ color: "black" }}>
                  {" "}
                  {productDetail?.productCategory}
                </span>
              </Typography>
            </Items>
          </GridItems>
          <Box
            display={"flex"}
            flexDirection={"row"}
            width={"90%"}
            alignItems={"center"}
            gap={"12px"}
            height={"50px"}
          >
            {productDetail?.discounted_price === null ? (
              <Typography fontSize={24} color={"#E92E67"} fontWeight={"bold"}>
                {productDetail?.vat_onlinePrice} SAR
              </Typography>
            ) : (
              <>
                <Typography fontSize={24} color={"#E92E67"} fontWeight={"bold"}>
                  {productDetail?.discounted_price} SAR
                </Typography>
                <Typography
                  fontSize={18}
                  color={"#666"}
                  sx={{ textDecoration: "line-through" }}
                >
                  {productDetail?.vat_onlinePrice} SAR
                </Typography>
                <VarientBox>
                  <VarientText>
                    {productDetail?.discount_type === 1
                      ? productDetail.discount + " % OFF"
                      : productDetail.discount + " SAR OFF"}
                  </VarientText>
                </VarientBox>
              </>
            )}
          </Box>
          <Typography fontSize={12} color={"#2c2c2c"}>
            *Final price will have vat included in it
          </Typography>
          {productDetail?.available_quantity === "0.00" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "30%",
              }}
            >
              <Heading sx={{ color: "red", fontSize: "16px" }}>
                Out of Stock!
              </Heading>
            </Box>
          ) : (
            <Box>
              {productVariants?.length > 0 && (
                <Box sx={{ margin: "8px 0 8px 0" }}>
                  <Box
                    sx={{
                      marginBottom: "16px",
                    }}
                  >
                    <h3>Product Variants</h3>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      marginBottom: "15px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "25%",
                        display: "flex",
                        height: "fit-content",
                      }}
                    >
                      {allKeys?.join(", ")}
                    </Box>
                    <Box sx={{ width: "75%", display: "flex", gap: "10px" }}>
                      {[
                        ...new Set(
                          productVariants?.map(
                            (variant) => variant.variantCombination
                          )
                        ),
                      ].map((combination, index) => {
                        return (
                          <Box key={index}>
                            <Button
                              sx={{
                                border: "1px solid #00A9BF",
                                textTransform: "none",
                                padding: "2px 12px",
                                backgroundColor:
                                  selectedVariant?.variantCombination ===
                                  combination
                                    ? "#00A9BF"
                                    : "white",
                                color:
                                  selectedVariant?.variantCombination ===
                                  combination
                                    ? "white"
                                    : "#00A9BF",
                                "&:hover": {
                                  backgroundColor:
                                    selectedVariant?.variantCombination ===
                                    combination
                                      ? "#00A9BF"
                                      : "white",
                                  color:
                                    selectedVariant?.variantCombination ===
                                    combination
                                      ? "white"
                                      : "#00A9BF",
                                },
                              }}
                              onClick={() =>
                                handleVariant(
                                  productVariants.find(
                                    (variant) =>
                                      variant.variantCombination === combination
                                  )
                                )
                              }
                            >
                              {combination}
                            </Button>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              )}

              <ButtonWrapper my={1}>
                {isInCartState ? (
                  <>
                    <QuantityButtons
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrement(
                            productDetail.id,
                            productDetail.user_profile.id
                          );
                        }}
                      >
                        -
                      </Button>
                      <Button sx={{ fontWeight: "bold" }}>{quantity}</Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(
                            productDetail.id,
                            productDetail.user_profile.id
                          );
                        }}
                      >
                        +
                      </Button>
                    </QuantityButtons>
                  </>
                ) : (
                  <>
                    <CartBTN
                      color="secondary"
                      sx={{ cursor: "pointer", fontSize: "12px" }}
                      onClick={() => handleAddToCart()}
                    >
                      {translate("productdetail.add")}
                    </CartBTN>
                  </>
                )}

                {isInQouteState ? (
                  <>
                    <QuantityButtons
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrementQoute(productDetail.id);
                        }}
                      >
                        -
                      </Button>
                      <Button sx={{ fontWeight: "bold" }}>
                        {qouteQuantity}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrementQoute(productDetail.id);
                        }}
                      >
                        +
                      </Button>
                    </QuantityButtons>
                  </>
                ) : (
                  <>
                    <CartBTN
                      color="secondary"
                      sx={{ cursor: "pointer", fontSize: "12px" }}
                      onClick={() => handleAddToQoute()}
                    >
                      {translate("productdetail.qoute")}
                    </CartBTN>
                  </>
                )}
              </ButtonWrapper>
            </Box>
          )}

          <ImageBox my={1}>
            <Text>{translate("productdetail.safe")}</Text>
            <ImageWrapper>
              {img.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "40px",
                    border: "1px solid #E4E7E9 ",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={item} style={{ width: "80%" }} alt="Product" />
                </Box>
              ))}
            </ImageWrapper>
          </ImageBox>
        </ProductData>
        <Tabbar data={productDetail} reviews={reviews} />
      </Wrapper>
      <Footer />
    </Container>
  );
};

// Styled Components

const Container = styled(Box)(() => ({}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    fontSize: "11px",
  },
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
  },
}));
const ProductData = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    paddingInline: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Shop = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
}));

const Text = styled(Typography)(() => ({
  fontSize: "15px",
  color: "black",
  fontWeight: "bold",
}));

const VarientBox = styled(Box)(({ theme }) => ({
  width: "auto",
  backgroundColor: "#EE0000",
  padding: "8px",
  borderRadius: "25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "5px",
  },
}));

const VarientText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "700",
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    fontWeight: "500",
    textAlign: "center",
  },
}));

const CartBTN = styled(Button)(({ theme }) => ({
  width: "150px",
  height: "40px",
  gap: "10px",
  textTransform: "none",
  borderRadius: "30px",
  border: "1px solid #009444",
  background: "#009444",
  color: "#fff",
  "&:hover": {
    color: "#009444",
  },
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
}));
const ButtonWrapper = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: "25px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    display: "flex",
    gap: "10px",
    width: "60%",
  },
}));

const QuantityButtons = styled(ButtonGroup)(() => ({
  border: "1px solid #009444",
  borderRadius: "20px",
  width: "120px",
  display: "flex",
  justifyContent: "center",
  "& .MuiButton-root": {
    border: "none",
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  padding: "20px",
  height: "auto",
  borderRadius: "15px",
  border: ".5px solid #009444",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
  },
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  marginTop: "20px",
  gap: "10px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
const Title = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "80%",
  },
}));
const Ratebox = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "4px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
const Items = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: "80%",
  },
}));
const GridItems = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flexDirection: "column",
  },
}));

export default ProductDetail;
