import moment from "moment"

export const formatDate = (date) => {
    const formattedDate = moment(date).format('MMMM Do YY');
    return formattedDate;
}