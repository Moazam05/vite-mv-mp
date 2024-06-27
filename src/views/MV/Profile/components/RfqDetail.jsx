import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Context Import
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
// MUI Components Import
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// Components Import
import { skipToken } from "@reduxjs/toolkit/query";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import CustomChip from "../../../../components/MV/CustomChip";
import { baseUrl } from "../../../../constants/MV/api";
import { useSubmitRFQStatusQuery } from "../../../../redux/MV/api/rfqApiSlice";
import { thousandSeparator } from "../../../../utils/MV";
import Loader from "../../CommonComponents/Loader";

function RfqDetail() {
  const { id } = useParams();
  const { translate, getDirection, getLanguage } = useTranslation();
  const language = getLanguage();
  const location = useLocation();
  const { RFQStatus } = location?.state || {};
  const navigate = useNavigate();

  const token = window.localStorage.getItem("mp-user-token");

  const [rfqDetail, setRfqDetail] = useState([]);
  const [loading, isLoading] = useState(false);
  const [RFQID, setRFQID] = useState(skipToken);

  const fetchRfqDetails = (id) => {
    isLoading(true);
    axios
      .get(`${baseUrl}/mv/api/customer/rfq/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setRfqDetail(response.data);
        isLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        isLoading(false);
      });
  };

  useEffect(() => {
    fetchRfqDetails(id);
  }, [id]);

  const styleOne = { fontSize: "14px", fontWeight: "400", marginBottom: "5px" };
  const styleTwo = {
    fontSize: "14px",
    fontWeight: "400",
    backgroundColor: "#d9d9d9",
    borderRadius: "8px",
    padding: "8px",
    overflow: "auto",
  };

  const quotedPriceTotal = () => {
    const totalPrice = rfqDetail?.products?.reduce((total, product) => {
      const { qouted_quantity, qouted_price } = product;
      return total + qouted_quantity * qouted_price;
    }, 0);

    return thousandSeparator(Number(totalPrice).toFixed(2));
  };

  const actualPriceTotal = () => {
    const totalPrice = rfqDetail?.products?.reduce((total, product) => {
      const { quantity, price } = product;
      return total + quantity * price;
    }, 0);

    return thousandSeparator(Number(totalPrice).toFixed(2));
  };

  // todo: RFQ STATUS CHANGE API CALL
  const {
    data: submitRFQ,
    isSuccess: RFQSuccess,
    isLoading: RFQLoading,
  } = useSubmitRFQStatusQuery({
    id: RFQID,
  });

  useEffect(() => {
    if (RFQSuccess) {
      handleRFQCreation(submitRFQ);
    }
  }, [RFQSuccess]);

  const handleRFQCreation = async (data) => {
    if (data) {
      toast.success("RFQ Request submitted successfully!");
      navigate("/profile/rfq-history");
    }
  };

  return (
    <>
      <Wrapper dir={getDirection()}>
        <Grid container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <CardHeading>{translate("rfq-detail.Detail")}</CardHeading>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              Status: <CustomChip label={rfqDetail?.status_display} />
            </Box>
          </Box>

          <Box
            sx={{
              margin: "10px 0 0",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              gap: "20px",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography sx={styleOne}>
                {translate("rfq-detail.id")}
              </Typography>

              <Typography
                sx={{
                  ...styleTwo,
                  width: "213px",
                  whiteSpace: "nowrap",
                  "@media (max-width: 576px)": {
                    width: "96%",
                  },
                }}
              >
                {rfqDetail?.rfqId}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.rfqDate")}
              </Typography>

              <Typography sx={styleTwo}>
                {new Date(rfqDetail?.rfqDate).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.rfqclosing")}
              </Typography>

              <Typography sx={styleTwo}>
                {new Date(rfqDetail?.rfqCloseDate).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.loc")}
              </Typography>

              <Typography
                sx={{
                  ...styleTwo,
                  width: "213px",
                  whiteSpace: "nowrap",
                  "@media (max-width: 576px)": {
                    width: "96%",
                  },
                }}
              >
                {rfqDetail?.deliveryLocation}
              </Typography>
            </Box>
          </Box>
          {/* 2nd card */}
          <Box
            sx={{
              margin: "15px 0 20px 0",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              gap: "20px",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography sx={styleOne}>
                {translate("rfq-detail.pay")}
              </Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqDetail?.paymentTerms || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.term")}
              </Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqDetail?.termsAndConditions || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.notes")}
              </Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqDetail?.notes || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}></Box>
          </Box>
          <Card item md={12} mb={2}>
            <TableWrapper component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#DDDDDD" }}>
                  <TableRow>
                    <TableHeadings>#</TableHeadings>
                    <TableHeadings>
                      {" "}
                      {translate("rfq-detail.prdImg")}
                    </TableHeadings>
                    <TableHeadings>{translate("rfq-detail.sku")}</TableHeadings>
                    <TableHeadings>
                      {translate("rfq-detail.name")}
                    </TableHeadings>
                    <TableHeadings>
                      {/* {translate("rfq-detail.qantity")} */}
                      Actual Quantity
                    </TableHeadings>
                    <TableHeadings>Quoted Quantity</TableHeadings>
                    <TableHeadings>
                      {/* {translate("rfq-detail.price")} */}
                      Actual Price
                    </TableHeadings>
                    <TableHeadings>Quoted Price</TableHeadings>
                    <TableHeadings>
                      {translate("rfq-detail.address")}
                    </TableHeadings>
                    <TableHeadings>
                      {translate("rfq-detail.date")}
                    </TableHeadings>
                    <TableHeadings>
                      {translate("rfq-detail.notes")}
                    </TableHeadings>
                    <TableHeadings>Response Notes</TableHeadings>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <Loader />
                  ) : (
                    rfqDetail?.products?.map((row, index) => (
                      <TableRow key={index}>
                        <TableContent>{index + 1}</TableContent>
                        <TableContent>
                          <ImageBox
                            component="img"
                            src={row?.product.images[0].image}
                            alt="image"
                          />
                        </TableContent>
                        <TableContent> {row?.product?.skU} </TableContent>
                        <TableContent>
                          {language === "ar"
                            ? row.product?.commons?.ar?.productName
                            : row.product?.commons?.en?.productName}
                        </TableContent>

                        <TableContent>
                          {thousandSeparator(Number(row?.quantity))}
                        </TableContent>
                        <TableContent>
                          {thousandSeparator(Number(row?.qouted_quantity))}
                        </TableContent>

                        <TableContent>
                          {thousandSeparator(Number(row?.price))} <br /> SAR
                        </TableContent>
                        <TableContent>
                          {thousandSeparator(Number(row?.qouted_price))} <br />
                          SAR
                        </TableContent>

                        <TableContent>{row?.deliveryLocation}</TableContent>
                        <TableContent>
                          {new Date(row?.deliveryDate).toLocaleString()}
                        </TableContent>
                        <TableContent>{row?.notes || "N/A"}</TableContent>
                        <TableContent>
                          {row?.responseNotes || "N/A"}
                        </TableContent>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
          </Card>
        </Grid>
        {/* )} */}
        {RFQStatus ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "15px 0",
            }}
          >
            <CheckoutButton
              disabled={RFQLoading}
              // onClick={() => handleRFQCreation()}
              onClick={() => {
                setRFQID(rfqDetail?.uuid);
              }}
            >
              {RFQLoading ? (
                <MoonLoader color="#fff" size={20} />
              ) : (
                "Submit RFQ"
              )}
            </CheckoutButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0 20px 0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <Typography>Total Actual Price (SAR)</Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "16px",
                  background: "#e1e3e2",
                  borderRadius: "10px",
                  padding: "10px 30px",
                }}
              >
                {actualPriceTotal()}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <Typography>Total Quoted Price (SAR)</Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "16px",
                  background: "#e1e3e2",
                  borderRadius: "10px",
                  padding: "10px 30px",
                }}
              >
                {quotedPriceTotal()}
              </Typography>
            </Box>
          </Box>
        )}
      </Wrapper>
    </>
  );
}

// Styled Components

const Wrapper = styled(Box)(({ theme }) => ({
  width: "80%",
  margin: "10px",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

const Card = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: "#fff",
  border: "1px solid #DDDDDD",
}));

const CardHeading = styled(Typography)(() => ({
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 2px",
  width: "100%",
}));

const CheckoutButton = styled(Button)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "40px",
  width: "150px",
  backgroundColor: "#400969",
  color: "#fff",
  borderRadius: "0px",
  "&:hover": {
    border: "1px solid #400969",
    backgroundColor: "transparent",
    color: "#400969",
  },
  [theme.breakpoints.down("sm")]: {
    width: "150px",
  },
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

export default RfqDetail;
