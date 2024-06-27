import { styled } from "@mui/material/styles";

// MUI Components Import
import { Grid, Typography, TextField } from "@mui/material";

function RFQInputField(props) {
  const { label, size, value, onChange, disabled } = props;

  return (
    <>
      <Wrapper item md={size} my={2}>
        <Label>{label}</Label>
        <Input
          mt={3}
          disabled={disabled}
          type="text"
          size="small"
          color="success"
          variant="outlined"
          InputProps={{ sx: { borderRadius: 3 } }}
          sx={{ backgroundColor: disabled ? "#e1e3e2" : "#fff" }}
          value={value}
          onChange={onChange}
        />
      </Wrapper>
    </>
  );
}

const Wrapper = styled(Grid)({
  display: "flex",
  flexDirection: "column",
});

const Label = styled(Typography)({
  fontSize: "12px",
  fontWeight: "500",
});

const Input = styled(TextField)({
  marginTop: "5px",
  borderRadius: "12px",
});

export default RFQInputField;
