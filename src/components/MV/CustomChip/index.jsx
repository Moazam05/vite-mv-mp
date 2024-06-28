import { Box, Chip } from "@mui/material";

const CustomChip = ({ label }) => {
  // convert color to rgb and make its opacity 0.5
  const convertColorToRgb = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const getChipData = (status) => {
    let color;
    let bgColor;

    switch (status) {
      case "Waiting":
      case "Preparing":
        color = "#AE5ABA";
        bgColor = convertColorToRgb(color);
        break;
      case "In-Examination":
        color = "#787E88";
        bgColor = convertColorToRgb(color);
        break;
      case "Booked":
      case "Dispatched":
        color = "#3A71DC";
        bgColor = "#EBF1FB";
        break;
      case "Waiting-Vitals Done":
      case "Vitals Taken":
        color = "#F8B536";
        bgColor = convertColorToRgb(color);
        break;
      case "Seen":
        color = "#13B981";
        bgColor = convertColorToRgb(color);
        break;
      case "Visited":
        color = "#13B981";
        bgColor = "#E7F8F2";
        break;
      case "Unpaid":
      case "Suspended":
      case "UnPaid":
      case "Rejected":
        color = "#c21717";
        bgColor = convertColorToRgb(color);
        break;
      case "Full Day":
      case "Cancelled":
        color = "#A75D5D";
        bgColor = convertColorToRgb(color);
        break;
      case "Short Leave":
        color = "#4bade8";
        bgColor = convertColorToRgb(color);
        break;
      case "Multi Days":
        color = "#FFBB0E";
        bgColor = convertColorToRgb(color);
        break;
      case "Followup Visit":
        color = "#f5a623";
        bgColor = convertColorToRgb(color);
        break;
      case "Paid":
        color = "#88b153";
        bgColor = convertColorToRgb(color);
        break;
      case "Undefined":
        color = "#88b153";
        bgColor = convertColorToRgb(color);
        break;
      case "Doctor":
        color = "#4b876c";
        bgColor = convertColorToRgb(color);
        break;
      case "Nurse":
        color = "#eb6fa9";
        bgColor = convertColorToRgb(color);
        break;
      case "Approved":
      case "Accepted":
        color = "#13B981";
        bgColor = "#E7F8F2";
        break;
      case "Complete":
        color = "#13B981";

        bgColor = "#E7F8F2";
        break;
      case "Staff":
        color = "#6CB4EE";
        bgColor = convertColorToRgb(color);
        break;
      case "Draft":
        color = `#292929`;
        bgColor = "#dcdee4";
        break;
      case "Regular":
        color = "#6CB4EE";
        bgColor = convertColorToRgb(color);
        break;
      case "Open":
        color = "#6CB4EE";
        bgColor = convertColorToRgb(color);
        break;
      case "Active":
        color = "#348BAD";
        bgColor = convertColorToRgb(color);
        break;
      case "Inactive":
      case "Deactivated":
      case "Delivered":
        color = "#FF8554";
        bgColor = convertColorToRgb(color);
        break;
      case "Follow-up":
        color = "#FF8554";
        bgColor = convertColorToRgb(color);
        break;
      case "Pending":
      case "In Process":
        color = "#f5a623";
        bgColor = convertColorToRgb(color);
        break;
      default:
        color = `#292929`;
        bgColor = "#dcdee4";
        break;
    }

    return {
      color,
      bgColor,
    };
  };

  const chipStyle = {
    width: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    backgroundColor: getChipData(label).bgColor,
    fontWeight: 600,
    border: `1px solid ${getChipData(label).color}`,
    fontSize: "12px",
    "@media (max-width: 530px)": {
      height: "30px",
      width: "105px",
    },
    padding: "0 10px",
    height: "30px",
  };

  return (
    <Box
      sx={{
        ...chipStyle,
      }}
    >
      <Chip
        label={label}
        color="success"
        variant="outlined"
        className="custom-chip"
        sx={{
          border: "none",
          color: getChipData(label).color,
          "@media (max-width: 530px)": {
            fontSize: "11px",
          },
        }}
      />
    </Box>
  );
};

export default CustomChip;
