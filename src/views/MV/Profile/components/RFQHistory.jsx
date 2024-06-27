import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MUI Components Import
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";
import { AiOutlineTable } from "react-icons/ai";
// Loader Import
import Loader from "../../CommonComponents/Loader";
import CustomChip from "../../../../components/MV/CustomChip";
import { FiShoppingCart } from "react-icons/fi";
import { MoonLoader } from "react-spinners";
// Icons Import
import VisibilityIcon from "@mui/icons-material/Visibility";
import OffersIcon from "@mui/icons-material/AssessmentOutlined";
import { TiDocument } from "react-icons/ti";

// React Toastify Imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
import { baseUrl } from "../../../../constants/MV/api";
import { FiSave } from "react-icons/fi";

const statusColor = {
  1: "#BCFFB6",
  2: "#add8e6",
  3: "#FF0000",
  4: "#FFF6A9",
  5: "#67C6E3",
};

function RFQHistory() {
  const { translate, getDirection } = useTranslation();

  const token = window.localStorage.getItem("mp-user-token");

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [rfqs, setRfqs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, isLoading] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState("");
  const [loadingTwo, setLoaderTwo] = useState(false);
  const [RFQResponse, setRFQResponse] = useState("");

  const fetchRfqHistory = () => {
    isLoading(true);
    axios
      .get(`${baseUrl}/mv/api/customer/rfqs?limit=${rowsPerPage}&offset=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        // console.log("response", response?.data?.results);
        setRfqs(response.data.results);
        setCount(response.data.total_count);
        isLoading(false);
      })
      .catch((err) => {
        console.log("Error", err);
        isLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchRfqHistory();
  }, [page]);

  const calculateTimeRemaining = (rfqCloseDate) => {
    const now = new Date();
    const closeDate = new Date(rfqCloseDate);

    if (isNaN(closeDate.getTime())) {
      return "Invalid Date";
    }

    const timeDiff = closeDate - now;

    if (timeDiff <= 0) {
      return "0d 0h 0m";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const transformedRFQData = (arr) => {
    return arr?.flatMap((item) => {
      return item?.users?.map((user) => ({
        rfqId: item.rfqId,
        payment_status_display: item.payment_status_display,
        vendorName: user.vendor?.company_name,
        vendorRfqStatus: user.status_display,
        status_display: item.status_display,
        deliveryLocation: item.deliveryLocation,
        created_at: item.created_at,
        updated_at: item.updated_at,
        rfqCloseDate: item.rfqCloseDate,
        is_closed: item.is_closed,
        rfqUId: user.rfqUId,
        uuid: item.uuid,
        vendorStatus: user.status,
        customerStatus: item?.createdBy?.status,
        dnID: item?.dn?.uuid,
        gr: item?.gr,
      }));
    });
  };

  const transformedRfqs = transformedRFQData(rfqs);

  // todo: GOODS RECEIPT API CALL
  const RFQStatusHandle = async (id) => {
    try {
      setLoaderTwo(true);
      const res = await axios.get(`${baseUrl}/mv/api/goods/receipt/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      if (res) {
        setRFQResponse(res?.data);
        fetchRfqHistory();
        setLoaderTwo(false);
        navigate(`/profile/rfq-good-receipt/${res?.data?.uuid}`);
      }
    } catch (error) {
      console.error("Error fetching RFQ status:", error);
      setLoaderTwo(false);
    }
  };

  return (
    <>
      <Wrapper dir={getDirection()}>
        <Grid container>
          <CardHeading>{translate("rfq-history.history")}</CardHeading>
          <Card item md={12}>
            <TableWrapper component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#DDDDDD" }}>
                  <TableRow>
                    <TableHeadings>#</TableHeadings>
                    <TableHeadings>{translate("rfq-history.id")}</TableHeadings>
                    <TableHeadings>
                      {" "}
                      {translate("rfq-history.status")}
                    </TableHeadings>
                    <TableHeadings>Vendor Name</TableHeadings>
                    <TableHeadings>Vendor RFQ Status</TableHeadings>
                    <TableHeadings>
                      {translate("rfq-history.rfqStatus")}
                    </TableHeadings>
                    <TableHeadings>
                      {translate("rfq-history.address")}{" "}
                    </TableHeadings>
                    <TableHeadings>
                      {translate("rfq-history.update")}
                    </TableHeadings>
                    <TableHeadings>Time Remaining</TableHeadings>
                    <TableHeadings>
                      {translate("rfq-history.action")}
                    </TableHeadings>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <Loader />
                  ) : transformedRfqs.length === 0 ? (
                    <TableRow align="center">
                      <TableContent colSpan={8} align="center">
                        {translate("rfq-history.not")}
                      </TableContent>
                    </TableRow>
                  ) : (
                    transformedRfqs.map((row, index) => {
                      // console.log("row", row?.gr?.uuid);
                      return (
                        <TableRow key={index}>
                          <TableContent>{index + 1}</TableContent>
                          <TableContent>{row.rfqId}</TableContent>
                          <TableContent>
                            {<CustomChip label={row.payment_status_display} />}
                          </TableContent>
                          <TableContent>{row.vendorName}</TableContent>
                          <TableContent>
                            {<CustomChip label={row.vendorRfqStatus} />}
                          </TableContent>
                          <TableContent>
                            {row.status_display === "Open" ? (
                              <Box>
                                {<CustomChip label={row.status_display} />}
                              </Box>
                            ) : row.status_display === "Close" ? (
                              <CustomChip label={row?.status_display} />
                            ) : (
                              <CustomChip label={row?.status_display} />
                            )}
                          </TableContent>
                          <TableContent>{row.deliveryLocation}</TableContent>
                          <TableContent>
                            {new Date(row.updated_at).toLocaleString()}
                          </TableContent>
                          <TableContent>
                            {calculateTimeRemaining(row?.rfqCloseDate)}
                          </TableContent>
                          <TableContent sx={{ width: "120px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "40px",
                                }}
                              >
                                <Tooltip
                                  // title={translate("rfq-history.view")}
                                  title="View Detail"
                                  placement="top"
                                >
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      navigate(`/profile/rfqdetail/${row.uuid}`)
                                    }
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              {row?.is_closed &&
                              row?.vendorStatus === 2 &&
                              row?.customerStatus === 1 ? (
                                <Tooltip title="View Offers" placement="top">
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      navigate(
                                        `/profile/rfqresponse/${row?.uuid}/${row?.rfqUId}`
                                      )
                                    }
                                  >
                                    <TiDocument />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                              {/* RFQ Status */}
                              {row.status_display === "Draft" && (
                                <Tooltip title="Submit RFQ" placement="top">
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      navigate(
                                        `/profile/rfqdetail/${row?.uuid}`,
                                        {
                                          state: { RFQStatus: "Submit" },
                                        }
                                      )
                                    }
                                  >
                                    <FiSave />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {/* Cart */}
                              {loadingTwo && selectedRFQ?.uuid === row?.uuid ? (
                                <Tooltip title="Delivery" placement="top">
                                  <IconButton color="primary">
                                    <MoonLoader color="#000" size={18} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                row?.vendorStatus === 2 &&
                                row?.customerStatus === 4 && (
                                  <Tooltip
                                    title="Goods Receipt"
                                    placement="top"
                                  >
                                    <IconButton
                                      color="primary"
                                      onClick={() => {
                                        if (row?.gr === null) {
                                          setSelectedRFQ(row);
                                          RFQStatusHandle(row?.dnID);
                                        } else {
                                          navigate(
                                            `/profile/rfq-good-receipt/${row?.gr?.uuid}`
                                          );
                                        }
                                      }}
                                    >
                                      <FiShoppingCart />
                                    </IconButton>
                                  </Tooltip>
                                )
                              )}
                            </Box>
                          </TableContent>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableWrapper>
            <Box
              sx={{
                padding: "10px",
                background: "#fff",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Pagination
                count={Math.ceil(count / rowsPerPage)}
                shape="rounded"
                onChange={handleChangePage}
              />
            </Box>
          </Card>
        </Grid>
      </Wrapper>
    </>
  );
}

// Styled Component

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

export default RFQHistory;
