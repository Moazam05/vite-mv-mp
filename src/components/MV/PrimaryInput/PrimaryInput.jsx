import { Box, InputAdornment, TextField } from "@mui/material";

const PrimaryInput = ({
  label,
  placeholder,
  type,
  fullWidth = true,
  startAdornment,
  endAdornment,
  name,
  onClick,
  onChange,
  value,
  onBlur,
  helperText,
  sx,
  minRows,
  maxRows,
  readOnly = false,
  multiline = false,
  required = false,
  error = false,
  disabled = false,
  variant,
  autoFocus,
  loading = false,
  borderRadius,
  background,
  ref,
  dir,
}) => {
  return (
    <TextField
      id={name}
      error={error}
      label={label}
      required={required}
      autoFocus={autoFocus}
      ref={ref}
      dir={dir || "ltr"}
      sx={[
        {
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& .MuiFormHelperText-root": {
            marginLeft: "2px !important",
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "14px",
          },
          "& .MuiOutlinedInput-input": {
            cursor: readOnly ? "not-allowed" : "",
          },
        },
        sx,
      ]}
      onChange={onChange}
      name={name}
      type={type}
      value={value || ""}
      variant={variant ? variant : "outlined"}
      fullWidth={fullWidth}
      multiline={multiline}
      placeholder={placeholder}
      onBlur={onBlur}
      disabled={disabled}
      helperText={helperText ? helperText : ""}
      minRows={minRows ? minRows : 6}
      maxRows={maxRows ? maxRows : 6}
      InputProps={{
        sx: {
          borderRadius: borderRadius ? borderRadius : "5px",
          background: background ? background : "#fff",
          height: multiline ? "auto" : "50px",
          border: "none",
        },
        readOnly: readOnly,
        startAdornment: startAdornment ? (
          <InputAdornment position="start">
            <Box
              sx={{
                display: "flex",
              }}
            >
              {startAdornment}
            </Box>
          </InputAdornment>
        ) : (
          ""
        ),
        endAdornment: endAdornment ? (
          <InputAdornment position="end">
            <Box
              onClick={onClick ? onClick : null}
              sx={{
                cursor: "pointer",
                display: "flex",
              }}
            >
              {endAdornment}
            </Box>
          </InputAdornment>
        ) : loading ? (
          "Loading...."
        ) : (
          ""
        ),
        inputProps: {
          min: 0,
          onKeyDown: (event) => {
            if (event.key === "-" && type === "number") {
              event.preventDefault();
            }
          },
        },
      }}
    />
  );
};

export default PrimaryInput;
