import axios from "axios";

export const SendEmail = (
  emailToList,
  userEmail,
  userName,
  leaveFromDate,
  leaveToDate,
  reasonForLeave
) => {
  //call email api
  const data = {
    emailToList,
    userEmail,
    userName,
    leaveFromDate,
    leaveToDate,
    reasonForLeave,
  };
  return axios.post({
    method: "post",
    url: "/api/email",
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};
