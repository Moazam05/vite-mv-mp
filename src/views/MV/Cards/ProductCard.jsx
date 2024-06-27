import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUIComponents Import
import {
  styled,
  Card,
  Box,
  Button,
  Typography,
  ButtonGroup,
} from "@mui/material";

// React Toastify Imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rating } from "@mui/material";

// Default Image import
import { useTranslation } from "../../../contexts/MV/LanguageContext";
import { useCart } from "../../../contexts/MV/CartContext";
import { useQoute } from "../../../contexts/MV/QouteContext";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import ArticleIcon from "@mui/icons-material/Article";
import { MdOutlineMedicalServices } from "react-icons/md";

// Default Image import
import DefaultImg from "../../../assets/logo.webp";

function truncateString(str, num) {
  if (str) return str?.length > num ? `${str?.substring(0, num)}...` : str;
}

function ProductCard({ product, id, service }) {
  console.log("id", id);
  const { translate, getLanguage, getDirection } = useTranslation();
  const {
    addToCart,
    incrementById,
    decrementById,
    cartProducts,
    removeFromCart,
    isOrderLimitExceeded,
  } = useCart();

  const navigate = useNavigate();
  const language = getLanguage();

  const [isInCartState, setIsInCartState] = useState(false);
  const [isInQouteState, setIsInQouteState] = useState(false);
  const {
    addToQoute,
    incrementByQouteId,
    decrementByQouteId,
    qouteProducts,
    removeFromQoute,
  } = useQoute();

  const getCartItemQuantity = () => {
    const vendorItem = cartProducts.find((vendorItem) =>
      vendorItem.products.some((productItem) => productItem.id === product.id)
    );
    if (vendorItem) {
      const productItem = vendorItem.products.find(
        (item) => item.id === product.id
      );
      return productItem ? productItem.quantity : 0;
    }
    return 0;
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      orderLimit: product.orderLimit,
      minQty: product.minQty,
      product: true,
    });
    setIsInCartState(true);
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

  const getQouteItemQuantity = () => {
    const cartItem = qouteProducts.find((item) => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  };
  const handleAddToQoute = () => {
    addToQoute({
      ...product,
      orderLimit: product.orderLimit,
      minQty: product.minQty,
      product: true,
    });
    setIsInQouteState(true);
  };

  const handleIncrementQoute = (id) => {
    // const product = qouteProducts.find((p) => p.id === id);
    incrementByQouteId(id);
  };

  const handleDecrementQoute = (id) => {
    if (setIsInQouteState) {
      decrementByQouteId(id);
      const updatedQuantity = qouteProducts.find(
        (item) => item.id === id
      ).quantity;

      if (updatedQuantity <= 0) {
        removeFromQoute(id);
        setIsInQouteState(false);
      }
    }
  };

  useEffect(() => {
    const isInCart = cartProducts.some((vendorItem) =>
      vendorItem.products.some((productItem) => productItem.id === product.id)
    );

    const isInQoute = qouteProducts.some((item) => item.id === product.id);
    setIsInCartState(isInCart);
    setIsInQouteState(isInQoute);
  }, [cartProducts, qouteProducts, product]);

  return (
    <>
      <Wrapper
        onClick={() => navigate(`/productdetail/${product?.slug}`)}
        dir={getDirection()}
      >
        <ImageWrapper>
          <img
            src={
              product.images.length > 0 ? product.images[0].image : DefaultImg
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="product_img"
          />
          <AvailableBadge>
            {translate("productdetail.stock")}{" "}
            {parseFloat(product?.available_quantity).toFixed(0)}
          </AvailableBadge>
          {product?.discount_type !== 0 ? (
            <DiscountBadge>
              {parseFloat(product?.discount).toFixed(0)}
              {product?.discount_type !== 1 ? "%" : "SAR"} OFF
            </DiscountBadge>
          ) : null}
        </ImageWrapper>
        <div dir={getDirection()} style={{ padding: "20px" }}>
          <Box>
            {language === "ar" ? (
              <ProductName>
                {truncateString(product?.commons?.ar?.productName, 50)}
              </ProductName>
            ) : (
              <ProductName>
                {truncateString(product?.commons?.en?.productName, 50)}
              </ProductName>
            )}
            <Typography fontSize={12} color={"black"} fontWeight={"700"}>
              {product?.user_profile?.company_name}
            </Typography>
            <Box sx={{ display: "flex", gap: "5px", margin: "5px 0px" }}>
              <Rating
                name="read-only"
                readOnly
                value={product?.avg_rating}
                sx={{ fontSize: "16px" }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ChatIcon
                  sx={{ fontSize: "14px", color: "#f1c40f", marginLeft: "5px" }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#f1c40f",
                    marginLeft: "5px",
                    fontWeight: "bold",
                  }}
                >
                  {product?.total_ratings}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <CategoryBox>{product?.productCategory}</CategoryBox>
            </Box>

            {product?.discount_type !== 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Price
                  sx={{
                    color: "#000",
                    fontSize: "15px",
                    textDecoration: "line-through",
                  }}
                >
                  {parseFloat(product.vat_onlinePrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </Price>
                <Price>
                  {parseFloat(product.discounted_price).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  SAR
                </Price>
              </Box>
            ) : (
              <>
                <Price>
                  {parseFloat(product.vat_onlinePrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  SAR
                </Price>
              </>
            )}
          </Box>
          <ActionsWrapper>
            <>
              {isInCartState ? (
                <Box sx={{ marginTop: "22px" }}>
                  <QuantityButtons sx={{ height: "48px" }}>
                    <Button
                      sx={{ fontWeight: "bold", width: "100px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(product.id, product.user_profile.id);
                      }}
                    >
                      -
                    </Button>
                    <Button sx={{ fontWeight: "bold", width: "100px" }}>
                      {getCartItemQuantity()}
                    </Button>
                    <Button
                      sx={{ fontWeight: "bold", width: "100px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(product.id, product.user_profile.id);
                      }}
                    >
                      +
                    </Button>
                  </QuantityButtons>
                </Box>
              ) : (
                <>
                  <CartBTN
                    sx={{
                      backgroundColor:
                        product?.available_quantity === "0.00"
                          ? "#ccc"
                          : "#178F49",
                      cursor:
                        product?.available_quantity === "0.00" || service
                          ? "not-allowed"
                          : "pointer",
                      "&:hover": {
                        backgroundColor:
                          product?.available_quantity === "0.00"
                            ? "#ccc"
                            : "#178F49",
                        opacity: "0.8",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (qouteProducts.length > 0) {
                        toast.error(
                          "You can't add product to qoute and cart at the same time"
                        );
                        return;
                      }
                      if (service) {
                        return;
                      } else if (product?.available_quantity !== "0.00") {
                        handleAddToCart(product.prodId);
                      }
                    }}
                  >
                    {product?.available_quantity === "0.00" ? (
                      <Heading>Out of Stock!</Heading>
                    ) : (
                      <>
                        {service ? (
                          <Box
                            sx={{
                              fontSize: "20px",
                              width: "20px",
                              marginLeft: "5px",
                              marginTop: "2px",
                            }}
                          >
                            <MdOutlineMedicalServices />
                          </Box>
                        ) : (
                          <CartIcon
                            sx={{
                              color: "#fff",
                              fontSize: "22px",
                              marginLeft: "10px",
                            }}
                          />
                        )}

                        {service ? (
                          "Book Now"
                        ) : (
                          <> {translate("productdetail.add")}</>
                        )}
                      </>
                    )}
                  </CartBTN>
                </>
              )}
            </>
            <>
              {isInQouteState ? (
                <Box sx={{ marginTop: "18px" }}>
                  <QuantityButtons sx={{ height: "48px", marginTop: "5px" }}>
                    <Button
                      sx={{ fontWeight: "bold", width: "100px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrementQoute(product.id);
                      }}
                    >
                      -
                    </Button>
                    <Button sx={{ fontWeight: "bold", width: "100px" }}>
                      {getQouteItemQuantity()}
                    </Button>
                    <Button
                      sx={{ fontWeight: "bold", width: "100px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrementQoute(product.id);
                      }}
                    >
                      +
                    </Button>
                  </QuantityButtons>
                </Box>
              ) : (
                <>
                  <CartBTN
                    sx={{
                      backgroundColor:
                        product?.available_quantity === "0.00"
                          ? "#ccc"
                          : "#178F49",
                      cursor:
                        product?.available_quantity === "0.00" || service
                          ? "not-allowed"
                          : "pointer",
                      "&:hover": {
                        backgroundColor:
                          product?.available_quantity === "0.00"
                            ? "#ccc"
                            : "#178F49",
                        opacity: "0.8",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartProducts.length > 0) {
                        toast.error(
                          "You can't add product to qoute and cart at the same time"
                        );
                        return;
                      }
                      handleAddToQoute(product.prodId);
                    }}
                  >
                    <ArticleIcon
                      sx={{
                        color: "#fff",
                        fontSize: "22px",
                        marginLeft: "10px",
                      }}
                    />
                    {translate("productdetail.qoute")}
                  </CartBTN>
                </>
              )}
            </>
          </ActionsWrapper>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled(Card)(() => ({
  width: "280px",
  height: "auto",
  borderRadius: "10px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  margin: "10px",
}));

const Price = styled(Typography)(() => ({
  color: "#178F49",
  fontSize: "20px",
  fontWeight: "bold",
  height: "30px",
}));

const ImageWrapper = styled(Box)({
  width: "100%",
  height: "250px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
});

const ProductName = styled(Typography)(() => ({
  fontSize: "15px",
  fontWeight: "bold",
  marginTop: "10px",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    fontSize: "11px",
  },
}));

const ActionsWrapper = styled(Box)(() => ({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
}));

const QuantityButtons = styled(ButtonGroup)(() => ({
  borderRadius: "5px",
  border: "1px solid #009444",
  height: "40px",
  width: "120px",
  display: "flex",
  justifyContent: "center",
  "& .MuiButton-root": {
    border: "none",
  },
}));

const CartBTN = styled(Button)(() => ({
  width: "50%",
  height: "50px",
  borderRadius: "10px",
  background: "#178F49",
  marginTop: "1.5rem",
  fontWeight: "bold",
  color: "#fff",
  textTransform: "capitalize",
  fontSize: "12px",
  cursor: "pointer",
  backgroundColor: "#178F49",
}));

const AvailableBadge = styled(Box)(() => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#178F49",
  color: "#fff",
  fontWeight: "bold",
  padding: "5px 7px",
  borderRadius: "20px",
  fontSize: "12px",
}));

const DiscountBadge = styled(Box)(() => ({
  position: "absolute",
  top: "10px",
  left: "10px",
  backgroundColor: "red",
  color: "#fff",
  fontWeight: "bold",
  padding: "5px 7px",
  borderRadius: "20px",
  fontSize: "12px",
}));

const CategoryBox = styled(Box)(() => ({
  backgroundColor: "#80c7ff",
  color: " #007ad9 ",
  fontWeight: "bolder",
  fontSize: "14px",
  width: "fit-content",
  padding: "2px 8px",
  borderRadius: "5px",
  margin: "5px 0px",
}));

export default ProductCard;
