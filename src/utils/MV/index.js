// thousand separator
export const thousandSeparator = (value) => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// get current date
export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

export function formatDateString(inputDate, slash) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  if (slash) {
    return `${day}/${month}/${year}`;
  } else {
    return `${year}-${month}-${day}`;
  }
}

// prevent auto form submission
export function onKeyDown(keyEvent) {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    keyEvent.preventDefault();
  }
}

// 2024-06-13T11:52:41.948664Z => 30 Apr 2024
export function formatDate(date) {
  const newDate = new Date(date);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  return newDate.toLocaleDateString("en-GB", options).replace(",", "");
}
