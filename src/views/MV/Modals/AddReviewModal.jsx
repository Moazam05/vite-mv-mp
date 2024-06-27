import { styled } from "@mui/material/styles";
import { useState } from "react";

// MUI Components Import
import { Box, Button, Grid, Modal, Rating, Typography } from "@mui/material";

import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../constants/MV/api";
import LoginNotifModal from "./LoginNotifModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "center",
  gap: "12px",
};

function AddReviewModal({ open, setOpen, slug }) {
  // const { translate, getLanguage, getDirection } = useTranslation();
  // const language = getLanguage();
  // eslint-disable-next-line no-unused-vars
  const [saving, setSaving] = useState(false);
  const [ratings, setRatings] = useState();
  const [comments, setComments] = useState();

  const token = window.localStorage.getItem("mp-user-token");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const addProductRating = () => {
    setSaving(true);
    axios
      .post(
        `${baseUrl}/api/rating/create`,
        {
          rating: ratings,
          comment: comments,
          slug: slug,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        toast.success("Review added successfully!");
        setSaving(false);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Review couldn't be added!");
        setSaving(false);
      });
  };

  const checkToken = () => {
    if (token === null) {
      setLoginModalOpen(true);
    } else {
      addProductRating();
    }
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <LoginNotifModal open={loginModalOpen} setOpen={setLoginModalOpen} />
          {/* <MainRow>
                        <Heading>Add a review</Heading>
                        <CancelOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => setOpen(false)} />

                    </MainRow>
                    <CartWrapper item md={12}>
                        <ImageWrapper>

                            <ImageBox component='img' image={picture} alt="image" />
                        </ImageWrapper>
                        <Detailbox>
                            <Heading>
                                card heading
                            </Heading>
                            <SubHeading>
                                subhead
                            </SubHeading>
                            <SubHeading sx={{ color: '#E92E67' }}>
                                price
                            </SubHeading>

                        </Detailbox>
                    </CartWrapper> */}

          <ReviewBox>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                gap: "4px",
              }}
            >
              <Rating
                name="simple-controlled"
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
              />
            </Box>
            <Heading>Write a review</Heading>
            <StyledTextarea
              value={comments}
              onChange={(e) => setComments(e.currentTarget.value)}
            />
          </ReviewBox>

          <Grid container>
            <Grid
              item
              sm={12}
              md={12}
              display={"flex"}
              justifyContent={"end"}
              gap={"15px"}
            >
              <BottomButton
                variant="outlined"
                color="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </BottomButton>
              <BottomButton
                onClick={() => checkToken()}
                variant="contained"
                color="secondary"
              >
                Submit
              </BottomButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

const BottomButton = styled(Button)(({ theme }) => ({
  height: "40px",
  width: "20%",
  mt: "23px",
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: {
    width: "45%",
  },
}));

const Heading = styled(Typography)(() => ({
  fontSize: "18px",
  fontWeight: "600",
}));

// const MainRow = styled(Box)(() => ({
//   width: "100%",
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
// }));

const ReviewBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
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
// const CartWrapper = styled(Grid)(({ theme }) => ({
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
//   display: "flex",
//   flexDirection: "row",
//   gap: "20px",
//   width: "100%",
//   border: " 1px solid #DDDDDD",
//   [theme.breakpoints.down("sm")]: {
//     padding: "10px",
//   },
// }));
// const Detailbox = styled(Box)({
//   width: "100%",
//   height: "auto",
//   display: "flex",
//   flexDirection: "column",
// });

// const ImageWrapper = styled(Box)(({ theme }) => ({
//   width: "100px",
//   height: "100px",
//   [theme.breakpoints.down("sm")]: {
//     width: "50px",
//   },
// }));

// const ImageBox = styled(CardMedia)(({ theme }) => ({
//   width: "100px",
//   height: "100px",
//   objectFit: "contain",
//   borderRadius: "20px",
//   [theme.breakpoints.down("sm")]: {
//     width: "50px",
//     borderRadius: "10px",
//     objectFit: "cover",
//   },
// }));

// const SubHeading = styled(Typography)(({ theme }) => ({
//   fontSize: "16px",
//   fontWeight: "500",
//   [theme.breakpoints.down("sm")]: {
//     fontSize: "10px",
//   },
// }));

export default AddReviewModal;
