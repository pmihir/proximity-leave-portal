export const GetDatesList = (fromDate, toDate) => {
  var dateArray = [];
  var currentDate = fromDate;
  while (currentDate <= toDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

export const ConvertDatesToStringArr = (datesList) => {
  return datesList.map((date) => FormatDateYYYYMMDD(date));
};

export const FormatDateYYYYMMDD = (date) => {
  return date.toISOString().split("T")[0];
};
