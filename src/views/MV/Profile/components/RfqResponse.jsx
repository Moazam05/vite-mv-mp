import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { MoonLoader } from "react-spinners";
// Components Import
import { toast } from "react-toastify";
import { baseUrl } from "../../../../constants/MV/api";
import { useRfqStatusChangeMutation } from "../../../../redux/MV/api/rfqApiSlice";
import { thousandSeparator } from "../../../../utils/MV";
import Loader from "../../CommonComponents/Loader";
import CustomChip from "../../../../components/MV/CustomChip";

function RfqResponse() {
  const navigate = useNavigate();
  const { id, rfqId } = useParams();
  const { translate, getDirection, getLanguage } = useTranslation();
  const language = getLanguage();

  const token = window.localStorage.getItem("mp-user-token");

  const [rfqResponse, setRfqResponse] = useState([]);
  const [loading, isLoading] = useState(false);
  const [statusValue, setStatusValue] = useState("");

  const fetchRfqResponse = (id, rfqId) => {
    isLoading(true);
    axios
      .get(`${baseUrl}/mv/api/customer/rfq/proposal/${id}/${rfqId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setRfqResponse(response.data);
        isLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        isLoading(false);
      });
  };

  useEffect(() => {
    fetchRfqResponse(id, rfqId);
  }, [id]);

  // todo: STATUS CHANGE API BIND
  const [statusRFQ, { isLoading: statusRFQLoading }] =
    useRfqStatusChangeMutation();

  const statusHandler = async (status) => {
    const payload = {
      status: status === "approve" ? 2 : 7,
    };

    try {
      const create = await statusRFQ({
        body: payload,
        id: rfqResponse?.uuid,
      });

      if (!create?.error) {
        toast.success("Status Changed successfully!");
        setStatusValue("");
        fetchRfqResponse(id, rfqId);
        navigate("/profile/rfq-history");
      }

      if (create?.error) {
        toast.error("Something went wrong", "error");
      }
    } catch (error) {
      console.error("Status Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const styleOne = {
    fontSize: "14px",
    fontWeight: "400",
    marginBottom: "5px",
  };
  const styleTwo = {
    fontSize: "14px",
    fontWeight: "400",
    backgroundColor: "#d9d9d9",
    borderRadius: "8px",
    padding: "8px",
    overflow: "auto",
  };

  const quotedPriceTotal = () => {
    const totalPrice = rfqResponse?.products?.reduce((total, product) => {
      const { qouted_quantity, qouted_price } = product;
      return total + qouted_quantity * qouted_price;
    }, 0);

    return thousandSeparator(Number(totalPrice).toFixed(2));
  };

  const actualPriceTotal = () => {
    const totalPrice = rfqResponse?.products?.reduce((total, product) => {
      const { quantity, price } = product;
      return total + quantity * price;
    }, 0);

    return thousandSeparator(Number(totalPrice).toFixed(2));
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
            <CardHeading>RFQ Response</CardHeading>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              Status: <CustomChip label={rfqResponse?.status_display} />
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
                {rfqResponse?.rfqId}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.rfqDate")}
              </Typography>

              <Typography sx={styleTwo}>
                {new Date(rfqResponse?.rfqDate).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.rfqclosing")}
              </Typography>

              <Typography sx={styleTwo}>
                {new Date(rfqResponse?.rfqCloseDate).toLocaleString()}
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
                {rfqResponse?.deliveryLocation}
              </Typography>
            </Box>
          </Box>
          {/* <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <RFQDetailCard
                  heading={translate("rfq-detail.id")}
                  data={rfqResponse?.rfqId}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <RFQDetailCard
                  heading={translate("rfq-detail.rfqDate")}
                  data={new Date(rfqResponse?.rfqDate).toLocaleString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <RFQDetailCard
                  heading={translate("rfq-detail.rfqclosing")}
                  data={new Date(rfqResponse?.rfqCloseDate).toLocaleString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <RFQDetailCard
                  heading={translate("rfq-detail.loc")}
                  data={rfqResponse?.deliveryLocation}
                />
              </Grid>
            </Grid>
          </Box> */}

          {/* 2nd card */}
          {/* <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading={translate("rfq-detail.pay")}
                  data={rfqResponse?.paymentTerms}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading={translate("rfq-detail.term")}
                  data={rfqResponse?.termsAndConditions}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading={translate("rfq-detail.notes")}
                  data={rfqResponse?.notes}
                />
              </Grid>
            </Grid>
          </Box> */}

          <Box
            sx={{
              margin: "15px 0 0 0",
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
                {rfqResponse?.paymentTerms}
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.term")}
              </Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqResponse?.termsAndConditions}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>
                {translate("rfq-detail.notes")}
              </Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqResponse?.notes}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}></Box>
          </Box>

          {/* 3rd */}
          {/* <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading="Response Terms"
                  data={rfqResponse?.user?.responesNotes}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading="Response Terms & Conditions"
                  data={rfqResponse?.user?.responsePaymentTerms}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <RFQCard
                  heading="Response Notes"
                  data={rfqResponse?.user?.responseTermsAndConditions}
                />
              </Grid>
            </Grid>
          </Box> */}

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
              <Typography sx={styleOne}>Response Terms</Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqResponse?.user?.responesNotes}
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>Response Terms & Conditions</Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqResponse?.user?.responsePaymentTerms}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography sx={styleOne}>Response Notes</Typography>

              <Typography sx={{ ...styleTwo, height: "80px" }}>
                {rfqResponse?.user?.responseTermsAndConditions}
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}></Box>
          </Box>

          <Card item md={12}>
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
                    <TableHeadings>Comments</TableHeadings>
                    <TableHeadings>Response Comments</TableHeadings>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <Loader />
                  ) : (
                    rfqResponse?.products?.map((row, index) => (
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
                          {" "}
                          {language === "ar"
                            ? row.product?.commons?.ar?.productName
                            : row.product?.commons?.en?.productName}{" "}
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
                          {thousandSeparator(Number(row?.qouted_price))}
                          <br />
                          SAR
                        </TableContent>
                        <TableContent>{row?.deliveryLocation}</TableContent>
                        <TableContent>
                          {new Date(row?.deliveryDate).toLocaleString()}
                        </TableContent>
                        <TableContent sx={{ width: "120px" }}>
                          {row?.notes}
                        </TableContent>
                        <TableContent sx={{ width: "120px" }}>
                          {row?.responseNotes}
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0 0px 0",
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

        <Box
          sx={{
            margin: "20px 0",
            display: "flex",
            justifyContent: "end",
            gap: "30px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={() => {
              setStatusValue("cancel");
              statusHandler("cancel");
            }}
            sx={{
              minWidth: "100px",
              borderRadius: 0,
              border: "1px solid #03a9bf",
            }}
          >
            {statusValue === "cancel" && statusRFQLoading ? (
              <MoonLoader color="#03a9bf" size={20} />
            ) : (
              "Cancel"
            )}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#400969",
              color: "#fff",
              minWidth: "100px",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "#400969",
                color: "#fff",
              },
            }}
            onClick={() => {
              setStatusValue("approve");
              statusHandler("approve");
            }}
          >
            {statusValue === "approve" && statusRFQLoading ? (
              <MoonLoader color="#fff" size={20} />
            ) : (
              "Approve"
            )}
          </Button>
        </Box>
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

export default RfqResponse;
