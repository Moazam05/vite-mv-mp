import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";

// MUI Components Import
import { Box, Grid, Modal, Typography } from "@mui/material";

// Loader Import
import { baseUrl } from "../../../constants/MV/api";

// Icons Import

// React Toastify Imports
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "../../../contexts/MV/LanguageContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  maxHeight: "80%",
  overflow: "auto",
  backgroundColor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

function SelectAddressModal({
  open,
  setOpen,
  setBillingAddress,
  setShippingAddress,
  modalFor,
}) {
  const { translate } = useTranslation();

  const token = window.localStorage.getItem("mp-user-token");

  const [addressList, setAddressList] = useState([]);

  const fetchUserAddresses = () => {
    axios
      .get(`${baseUrl}/api/addresses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setAddressList(response.data);
      })
      .catch((error) => console.log("Error", error));
  };

  const changeAddress = (address) => {
    if (modalFor === "billing") {
      setBillingAddress(address);
    } else {
      setShippingAddress(address);
    }
    setOpen();
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Grid container display={"flex"} gap={"12px"}>
            <Grid item md={3} textAlign={"start"}>
              <Heading sx={{ padding: "10px 0" }}>Select an address</Heading>
            </Grid>
            {addressList?.map((item, index) => (
              <AddressBox key={index} onClick={() => changeAddress(item)}>
                <DetailBox>
                  <Text>{item.fullname}</Text>
                  <Text>{item.phonenumber}</Text>
                  <Text>
                    {" "}
                    {item.address}, {item.city}, {item.country}{" "}
                  </Text>
                  <LabelsWrapper>
                    <Label>{item.address_label_display}</Label>
                    {item.is_billing ? (
                      <Label>{translate("address.default")}</Label>
                    ) : null}
                    {item.is_shipping ? (
                      <Label>{translate("address.ship")}</Label>
                    ) : null}
                  </LabelsWrapper>
                </DetailBox>
              </AddressBox>
            ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

// Styled Components

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "500",
  color: "#000",
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
}));

const AddressBox = styled(Box)({
  width: "100%",
  height: "auto",
  padding: "20px",
  background: "#fff",
  boxShadow:
    "0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017",
  cursor: "pointer",
});

const DetailBox = styled(Box)(({ theme }) => ({
  width: "80%",
  textAlign: "start",
  [theme.breakpoints.down("sm")]: {
    width: "70%",
  },
}));

const Text = styled(Typography)(() => ({
  fontSize: "12px",
  marginBottom: "8px",
}));

const LabelsWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "12px",
}));

const Label = styled(Box)(() => ({
  fontSize: "10px",
  background: "#f5f5f5",
  color: "#000",
  padding: "8px",
  borderRadius: "5px",
}));

export default SelectAddressModal;
