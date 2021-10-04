export const getIsNavExpanded = () => {
  const isNavExpanded = localStorage.getItem("isNavExpanded");
  if (isNavExpanded === null) return true;
  else return isNavExpanded === "true";
};

// export const getUsableDate = (dateStr) => {
//   const dateArr = dateStr.split("-");
//   return [dateArr[2], dateArr[1], dateArr[0]].join("-");
// };

export const getReadableDate = (dateStr) => {
  const dateArr = dateStr
    .split("-")
    ?.reverse()
    .map((el) => +el);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  dateArr[1] = months[dateArr[1] - 1];
  return dateArr.join(" ");
};

export const getReadableCreationDate = (dateStr) => {
  const dateArr = dateStr.split(" ");
  dateArr[0] = getReadableDate(dateArr[0]);
  return `Created on ${dateArr[0]} at ${dateArr[1]}`;
};
