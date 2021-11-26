import { cloneDeep } from 'lodash'; 

export const GetDatesList = (fromDate, toDate) => {
  var dateArray = [];
  var currentDate = cloneDeep(fromDate);
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
  return convertDate(date);
};

function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();
  var mmChars = mm.split('');
  var ddChars = dd.split('');
  return yyyy + '-' + (mmChars[1]?mm:'0'+mmChars[0]) + '-' + (ddChars[1]?dd:'0'+ddChars[0]);
}
