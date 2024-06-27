import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Context Import
import { useTranslation } from "../../../../contexts/MV/LanguageContext";
// MUI Components Import
import { Box, Button, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { MoonLoader } from "react-spinners";
import MUITable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../../components/MV/MUITable";
import {
  useDispatchGoodsNoteMutation,
  useGetGoodsReceiptNoteQuery,
  useUpdateGoodsNoteMutation,
} from "../../../../redux/MV/api/rfqApiSlice";
import { onKeyDown } from "../../../../utils/MV";
import Loader from "../../CommonComponents/Loader";
import { GRSchema } from "../validations/GRSchema";
import { toast } from "react-toastify";
import CustomChip from "../../../../components/MV/CustomChip";

const tableHead = [
  "SKU",
  "Image",
  "Product Name",
  "QTY Ordered",
  "DN Qty",
  "Received Quantity",
  "Qty Due",
];

const GoodsReceiptNote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDirection, getLanguage } = useTranslation();
  const language = getLanguage();

  const [formType, setFormType] = React.useState("");
  const [formValues, setFormValues] = useState({
    dnNo: "",
    dnDate: "",
    vendorName: "",
    location: "",
    vehicleNo: "",
    driverName: "",
    contactNo: "",
    products: [],
  });

  // todo: GET CATEGORIES DATA API CALL
  const { data, isLoading } = useGetGoodsReceiptNoteQuery({
    id,
  });

  useEffect(() => {
    if (data) {
      const temp = data?.products?.map((item) => ({
        sku: item?.product?.skU,
        image: item?.product?.images[0]?.image,
        productName:
          language === "ar"
            ? item?.product?.commons?.ar?.productName
            : item?.product?.commons?.en?.productName,
        qoutedQuantity: Number(item?.qouted_quantity),
        dnQuantity: Number(item?.due_quantity),
        rfqPId: item?.rfqPId,
        recQty: Number(item?.recv_quantity) || Number(item?.due_quantity) || "",
      }));

      setFormValues({
        dnNo: data?.dn?.dnNo,
        dnDate: new Date(data?.dn?.dnDate).toLocaleString(),
        vendorName: data?.dn?.supplierName,
        location: data?.dn?.location,
        vehicleNo: data?.dn?.vehicleNo,
        driverName: data?.dn?.driverName,
        contactNo: data?.dn?.contactNo,
        products: temp,
      });
    }
  }, [data]);

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

  // todo: SEND GOODS NOTE API BIND
  const [updateGoodsNote, { isLoading: updateGoodNoteLoading }] =
    useUpdateGoodsNoteMutation();

  // todo: DISPATCH GOODS NOTE API BIND
  const [dispatchGoodNote, { isLoading: dispatchGoodNoteLoading }] =
    useDispatchGoodsNoteMutation();

  const AddDoctorHandler = async (values) => {
    const products = values.products.map((item) => {
      return {
        rfqPId: item.rfqPId,
        recv_quantity: item.recQty,
      };
    });

    const payload = {
      products,
    };

    // todo: SAVE GOODS NOTE
    if (formType === "save") {
      try {
        const update = await updateGoodsNote({
          body: payload,
          id: data?.uuid,
        });

        if (!update?.error) {
          toast.success("Good Note Saved Successfully!");
          setFormType("");
        }
        if (update?.error) {
          toast.error("Something went wrong", "error");
        }
      } catch (error) {
        console.error("Good Notee Saved Error:", error);
        toast.error(error.response.data.message);
      }

      return;
    }

    // todo: DISPATCH GOODS NOTE
    if (formType === "dispatch") {
      try {
        const update = await dispatchGoodNote({
          id,
        });

        if (!update?.error) {
          toast.success("Dispatch Sended Successfully!");
          setFormType("");
          navigate("/profile/rfq-history");
        }
        if (update?.error) {
          toast.error("Something went wrong", "error");
        }
      } catch (error) {
        console.error("Dispatch  Sended Error:", error);
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <>
      <Wrapper
        dir={getDirection()}
        sx={{
          width: "95%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h3>Goods Receipt</h3>
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            Status: <CustomChip label={data?.dn?.rfq?.status_display} />
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
            <Typography sx={styleOne}>DN No </Typography>

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
              {formValues?.dnNo}
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography sx={styleOne}>DN Date </Typography>

            <Typography sx={styleTwo}>
              {new Date(formValues.dnDate).toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography sx={styleOne}>Vendor Name </Typography>

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
              {formValues?.vendorName}
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography sx={styleOne}>Location </Typography>

            <Typography sx={styleTwo}>{formValues?.location} </Typography>
          </Box>
        </Box>
        {/* 2nd */}
        <Box
          sx={{
            margin: "10px 0 30px 0",
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "20px",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography sx={styleOne}>Vehicle No </Typography>

            <Typography sx={styleTwo}>{formValues?.vehicleNo} </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography sx={styleOne}>Driver Name </Typography>

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
              {formValues?.driverName}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography sx={styleOne}>Contact No </Typography>

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
              {formValues?.contactNo}
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}></Box>
        </Box>

        <Formik
          initialValues={formValues}
          onSubmit={(values) => {
            AddDoctorHandler(values);
          }}
          validationSchema={GRSchema}
          enableReinitialize
        >
          {(props) => {
            const { values, errors, handleBlur, handleChange } = props;

            return (
              <Form onKeyDown={onKeyDown} style={{ width: "100%" }}>
                <Box
                  sx={{
                    margin: "20px 0",
                  }}
                >
                  <MUITable tableHead={tableHead}>
                    {isLoading ? (
                      <Loader />
                    ) : values?.products?.length > 0 ? (
                      values?.products?.map((item, index) => {
                        const qtyDue =
                          item.dnQuantity -
                          (values.products[index]?.recQty || 0);
                        const newQTY = qtyDue === 0 ? "0" : qtyDue;

                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{item?.sku}</StyledTableCell>
                            <StyledTableCell>
                              <Box
                                alt="product_image"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "5px",
                                  marginRight: "8px",
                                  objectFit: "fill",
                                }}
                              >
                                <img
                                  src={item?.image}
                                  alt="Product"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item?.productName}
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextField
                                size="small"
                                color="secondary"
                                value={item?.qoutedQuantity}
                                disabled={true}
                                sx={{
                                  width: "120px",
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextField
                                type="text"
                                placeholder="QTY Ordered"
                                disabled={true}
                                value={item?.dnQuantity}
                                size="small"
                                sx={{
                                  width: "120px",
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextField
                                type="number"
                                placeholder="REC Qty"
                                name={`products.${index}.recQty`}
                                value={values.products[index].recQty}
                                onChange={(e) => {
                                  if (e.target.value > item?.dnQuantity) {
                                    e.target.value = item?.dnQuantity;
                                  }
                                  handleChange(e, index, "recQty");
                                }}
                                onBlur={handleBlur}
                                error={
                                  errors.products &&
                                  errors.products[index]?.recQty
                                }
                                helperText={
                                  errors.products &&
                                  errors.products[index]?.recQty
                                }
                                size="small"
                                sx={{
                                  width: "120px",
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextField
                                type="text"
                                placeholder="Qty Due"
                                disabled={true}
                                value={newQTY}
                                size="small"
                                sx={{
                                  width: "120px",
                                }}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })
                    ) : (
                      ""
                    )}
                  </MUITable>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "30px 0",
                    gap: "20px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      height: "40px",
                      width: "180px",
                      borderRadius: "5px",
                    }}
                    onClick={() => {
                      setFormType("save");
                    }}
                  >
                    {updateGoodNoteLoading ? (
                      <MoonLoader color="#029444" size={20} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      setFormType("dispatch");
                    }}
                    variant="contained"
                    color="secondary"
                    sx={{
                      height: "40px",
                      width: "180px",
                      borderRadius: "5px",
                    }}
                  >
                    {dispatchGoodNoteLoading ? (
                      <MoonLoader color="#fff" size={20} />
                    ) : (
                      "Mark as Delivered"
                    )}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Wrapper>
    </>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  width: "80%",
  margin: "10px",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

export default GoodsReceiptNote;
