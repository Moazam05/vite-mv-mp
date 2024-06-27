import React, { useState } from "react";
import { styled } from "@mui/system";

// Contexts Import
import { useQoute } from "../../../contexts/MV/QouteContext";
import { useTranslation } from "../../../contexts/MV/LanguageContext";

// MUI Components Import
import {
  Box,
  Button,
  ButtonGroup,
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

// Components Import
import Footer from "../Footer/Footer";
import LoginNotifModal from "../../../views/MV/Modals/LoginNotifModal";
import Navbar from "../LandingPage/Components/Navbar";
import Loader from "../CommonComponents/Loader";

// Toastify Imports
import { toast } from "react-toastify";

// Datepicker Library Imports
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Utils import
import { getCurrentDate, thousandSeparator } from "../../../utils/MV/index";
import { useCreateRFQMutation } from "../../../redux/MV/api/rfqApiSlice";
import QouteCard from "../CommonComponents/QouteCard";
import RFQInputField from "../CommonComponents/RFQInputField";
import { useNavigate, useParams } from "react-router-dom";

const Qoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  console.log("id", id);

  const {
    qouteProducts,
    incrementByQouteId,
    decrementByQouteId,
    calculateTotalQoutePrice,
    emptyQoute,
  } = useQoute();

  const totalQoutePrice = calculateTotalQoutePrice();
  const { translate, getLanguage, getDirection } = useTranslation();
  const language = getLanguage();
  const currentDate = getCurrentDate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [rfqClosingDate, setRFQClosingDate] = useState(null);
  const [rfqDeliveryLocation, setRFQDeliveryLocation] = useState("");
  const [rfqPaymentTerms, setRFQPaymentTerms] = useState("");
  const [rfqTerms, setRFQTerms] = useState("");
  const [rfqNotes, setRFQNotes] = useState("");
  const [deliveryDates, setDeliveryDates] = useState({});
  const [deliveryLocations, setDeliveryLocations] = useState({});
  const [notes, setNotes] = useState({});

  const handleDateChange = (id, date) => {
    setDeliveryDates({ ...deliveryDates, [id]: date });
  };

  const handleLocationChange = (id, location) => {
    setDeliveryLocations({ ...deliveryLocations, [id]: location });
  };

  const handleNotesChange = (id, note) => {
    setNotes({ ...notes, [id]: note });
  };

  if (rfqClosingDate) {
    var rfqCloseDate = rfqClosingDate.toISOString().split("T")[0];
  }

  const handleIncrement = (id) => {
    const product = qouteProducts.find((p) => p.id === id);
    incrementByQouteId(id);
  };

  const handleDecrement = (id) => {
    decrementByQouteId(id);
  };

  const validateFields = () => {
    if (!rfqClosingDate || !rfqDeliveryLocation) {
      toast.error("RFQ Closing Date and Delivery Location are required.");
      return false;
    }

    for (const product of qouteProducts) {
      if (!deliveryLocations[product.id]) {
        toast.error(`Delivery Location for product ${product.id} is required.`);
        return false;
      }
    }

    return true;
  };

  // todo: CREATE RFQ API BIND
  const [createRFQ, { isLoading }] = useCreateRFQMutation();

  const handleRFQCreation = async (name) => {
    // Validate RFQ-level mandatory fields
    if (!rfqDeliveryLocation) {
      toast.error("RFQ Delivery Location is required.");
      return false;
    }

    if (!rfqClosingDate) {
      toast.error("RFQ Closing Date is required.");
      return false;
    }

    // Validate each product's mandatory fields
    for (const product of qouteProducts) {
      const productName =
        language === "ar"
          ? product?.commons?.ar?.productName
          : product?.commons?.en?.productName;

      if (!deliveryLocations[product.id]) {
        toast.error(
          `Delivery Location for product "${productName}" is required.`
        );
        return false;
      }

      if (!deliveryDates[product.id]) {
        toast.error(`Delivery Date for product "${productName}" is required.`);
        return false;
      }
    }
    const RFQStatus = name === "draft" ? 9 : 1;

    const payload = {
      rfq_status: RFQStatus,
      rfqDate: currentDate,
      rfqCloseDate: rfqCloseDate,
      deliveryLocation: rfqDeliveryLocation,
      paymentTerms: rfqPaymentTerms,
      termsAndConditions: rfqTerms,
      notes: rfqNotes,
      products: qouteProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.discounted_price || product.vat_onlinePrice,
        deliveryDate: deliveryDates[product.id] || "",
        deliveryLocation: deliveryLocations[product.id] || "",
        notes: notes[product.id] || "",
      })),
    };
    try {
      const create = await createRFQ(payload);
      if (!create?.error) {
        toast.success("RFQ Request submitted successfully!");
        emptyQoute();
        navigate("/profile/rfq-history");

        localStorage.removeItem("qouteProducts");
        localStorage.removeItem("qouteCount");
      }
      if (create?.error) {
        toast.error("Something went wrong", "error");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <Wrapper dir={getDirection()}>
        <LoginNotifModal open={loginModalOpen} setOpen={setLoginModalOpen} />
        <Typography sx={{ fontSize: "22px", fontWeight: "bold" }}>
          {translate("qoute.heading")}
        </Typography>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <RFQInputField
              label={translate("qoute.id")}
              size={2.8}
              disabled={true}
            />
            <RFQInputField
              label={translate("qoute.date")}
              size={2.8}
              value={currentDate}
              disabled={true}
            />
            <RFQInputField
              label={translate("qoute.loc")}
              size={2.8}
              value={rfqDeliveryLocation}
              onChange={(e) => setRFQDeliveryLocation(e.target.value)}
              disabled={false}
            />
            <Grid item md={2.8} my={2}>
              <Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
                {translate("qoute.closing")}
              </Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ paddingTop: "4px", width: "100%" }}
              >
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: "100%" }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    value={dayjs(rfqClosingDate)}
                    onChange={(value) => setRFQClosingDate(value)}
                    slotProps={{
                      textField: { size: "small", error: false },
                    }}
                    sx={{ background: "#fff" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3.8}>
              <Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
                {translate("qoute.payment")}
              </Typography>
              <StyledTextarea
                value={rfqPaymentTerms}
                onChange={(e) => setRFQPaymentTerms(e.target.value)}
                disabled={false}
              />
            </Grid>
            <Grid item md={3.8}>
              <Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
                {translate("qoute.terms")}
              </Typography>
              <StyledTextarea
                value={rfqTerms}
                onChange={(e) => setRFQTerms(e.target.value)}
                disabled={false}
              />
            </Grid>
            <Grid item md={3.8}>
              <Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
                {translate("qoute.notes")}
              </Typography>
              <StyledTextarea
                value={rfqNotes}
                onChange={(e) => setRFQNotes(e.target.value)}
                disabled={false}
              />
            </Grid>
          </Grid>
        </Box>
        <Grid container my={5} gap={"40px"} dir={getDirection()}>
          <Card item md={12}>
            <TableWrapper component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#DDDDDD" }}>
                  <TableRow>
                    <TableHeadings>#</TableHeadings>
                    <TableHeadings>{translate("qoute.img")}</TableHeadings>
                    <TableHeadings>{translate("qoute.sku")}</TableHeadings>
                    <TableHeadings>{translate("qoute.name")}</TableHeadings>
                    <TableHeadings>{translate("qoute.quality")}</TableHeadings>
                    <TableHeadings>{translate("qoute.price")}</TableHeadings>
                    <TableHeadings>{translate("qoute.location")}</TableHeadings>
                    <TableHeadings>{translate("qoute.deldate")}</TableHeadings>
                    <TableHeadings>{translate("qoute.note")}</TableHeadings>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <Loader />
                  ) : qouteProducts?.length === 0 ? (
                    <TableRow align="center">
                      <TableContent colSpan={6} align="center">
                        {translate("order-history.not")}
                      </TableContent>
                    </TableRow>
                  ) : (
                    qouteProducts?.map((product, index) => {
                      const variant = product?.variants?.find(
                        (v) => v.id === product?.id
                      );
                      return (
                        <TableRow key={index}>
                          <TableContent>{index + 1}</TableContent>
                          <TableContent>
                            <ImageBox
                              component="img"
                              image={
                                variant?.variantImage ||
                                (product &&
                                  product.images &&
                                  product.images[0]?.image)
                              }
                              alt="image"
                            />
                          </TableContent>
                          <TableContent>{product?.skU}</TableContent>
                          <TableContent>
                            {" "}
                            {language === "ar"
                              ? product?.commons?.ar?.productName
                              : product?.commons?.en?.productName}
                          </TableContent>
                          <TableContent>
                            <QuantityButtons
                              size="small"
                              aria-label="small outlined button group"
                            >
                              <IncButton
                                onClick={() => handleDecrement(product.id)}
                              >
                                -
                              </IncButton>
                              <Button sx={{ fontWeight: "bold" }}>
                                {product.quantity}
                              </Button>
                              <IncButton
                                onClick={() => handleIncrement(product.id)}
                              >
                                +
                              </IncButton>
                            </QuantityButtons>
                          </TableContent>
                          <TableContent>
                            {product.discounted_price === null
                              ? product.vat_onlinePrice
                              : product.discounted_price}
                          </TableContent>
                          <TableContent>
                            <TextField
                              id="outlined-size-small"
                              size="small"
                              color="secondary"
                              value={deliveryLocations[product.id] || ""}
                              onChange={(e) =>
                                handleLocationChange(product.id, e.target.value)
                              }
                            />
                          </TableContent>
                          <TableContent sx={{ fontWeight: "bold" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <Box components={["DatePicker"]} size="small">
                                <DatePicker
                                  value={deliveryDates[product.id] || null}
                                  onChange={(date) =>
                                    handleDateChange(product.id, date)
                                  }
                                />
                              </Box>
                            </LocalizationProvider>
                          </TableContent>
                          <TableContent sx={{ fontWeight: "bold" }}>
                            <StyledTextarea
                              value={notes[product.id] || ""}
                              onChange={(e) =>
                                handleNotesChange(product.id, e.target.value)
                              }
                            />
                          </TableContent>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </Card>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CheckoutButton
            sx={{
              backgroundColor: "#fff",
              color: "#400969",
              border: "1px solid #400969",
            }}
            onClick={() => handleRFQCreation("draft")}
          >
            Save as Draft
          </CheckoutButton>
          <DataWrapper>
            <PriceHeading>{translate("qoute.total")}</PriceHeading>
            <TotalPrice>
              <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
                {/* {parseFloat(totalQoutePrice || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} */}
                {thousandSeparator(Number(totalQoutePrice || 0).toFixed(2))}
              </Typography>
            </TotalPrice>
            <CheckoutButton onClick={() => handleRFQCreation("create")}>
              {translate("qoute.create")}
            </CheckoutButton>
          </DataWrapper>
        </Box>
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

const Card = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: "#fff",
  border: "1px solid #DDDDDD",
}));
const PriceHeading = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "800",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    fontWeight: "600",
  },
}));

const QuantityButtons = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "10px",
  width: "150px",
  height: "40px",
  backgroundColor: "#e1e3e2",
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

const TotalPrice = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "10px",
  width: "150px",
  height: "40px",
  backgroundColor: "#e1e3e2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    width: "auto",
    paddingInline: "6px",
    height: "40px",
  },
}));

const IncButton = styled(Box)(() => ({
  backgroundColor: "#400969",
  color: "#fff",
  height: "16px",
  width: "16px",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledTextarea = styled("textarea")(() => ({
  background: "#fff",
  borderRadius: "8px",
  fontSize: "16px",
  margin: "8px 0",
  height: "80px",
  width: "100%",
  border: "1px solid #C9CFD2",
}));

const HeaderTextarea = styled("textarea")(({ theme }) => ({
  background: "#fff",
  borderRadius: "8px",
  fontSize: "16px",
  margin: "8px 0",
  height: "40px",
  width: "250px",
  border: "1px solid #C9CFD2",
  [theme.breakpoints.down("xs")]: {
    width: "160px",
  },
}));

const DataWrapper = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  alignItems: "center",
  gap: "20px",
}));

const RfqEditCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
}));

const ImageBox = styled(CardMedia)(({ theme }) => ({
  width: "70px",
  height: "70px",
  objectFit: "contain",
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: {
    width: "50px",
    borderRadius: "10px",
    objectFit: "cover",
  },
}));

const TableWrapper = styled(TableContainer)(() => ({
  height: "auto",
  overflow: "auto",
  border: "none",
  boxShadow: "none",
}));

const TableHeadings = styled(TableCell)(() => ({
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "16px",
  color: "black",
  background: "#F2F4F5",
  textAlign: "center",
}));

const TableContent = styled(TableCell)(() => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "16px",
  color: "#71747D",
  border: "none",
  textAlign: "center",
}));

const CheckoutButton = styled(Button)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "40px",
  width: "200px",
  backgroundColor: "#400969",
  color: "#fff",
  borderRadius: "10px",
  "&:hover": {
    border: "1px solid #400969",
    backgroundColor: "transparent",
    color: "#400969",
  },
  [theme.breakpoints.down("sm")]: {
    width: "150px",
  },
}));

export default Qoute;
