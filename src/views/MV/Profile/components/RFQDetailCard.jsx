import { Box, Typography, styled } from "@mui/material";

function RFQDetailCard({ heading, data }) {
  return (
    <>
      <CardWrapper>
        <Box
          sx={{
            width: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <SubHeading>{heading}</SubHeading>
        </Box>

        <SubCard>
          <SubCardHeading>{data}</SubCardHeading>
        </SubCard>
      </CardWrapper>
    </>
  );
}

const CardWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "center",
  // gap: '5px',
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
}));
const SubCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#d9d9d9",
  height: "40px",
  width: "115px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "8px",
  [theme.breakpoints.down("md")]: {
    width: "60%",
  },
}));
const SubHeading = styled(Typography)(() => ({
  fontSize: "14px",
  fontWeight: "400",
}));
const SubCardHeading = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: "400",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.2",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

export default RFQDetailCard;
