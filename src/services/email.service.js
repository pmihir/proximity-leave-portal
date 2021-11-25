import axios from "axios";
import userEmails from "../data/userEmails.json";

export const NotifyEmail = async (
  department,
  userEmail,
  userName,
  leaveFromDate,
  leaveToDate,
  reasonForLeave
) => {
  //call email api
  const emailToList = GetEmailList(department);
  const data = {
    emailToList,
    userEmail,
    userName,
    leaveFromDate,
    leaveToDate,
    reasonForLeave,
  };
  await axios.post("/api/email", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
  // await axios.post({
  //   method: "post",
  //   url: "/api/email",
  //   data: JSON.stringify(data),
  //   headers: { "Content-Type": "application/json" },
  // });
};

const GetEmailList = (department) => {
  let emailList = [];
  const defaultEmails = [
    "h@proximity.tech",
    "op@proximity.tech",
    "sana.k@proximity.tech",
    "pto@proximity.tech",
  ];

  emailList.push(defaultEmails);
  switch (department) {
    case "ENG":
      emailList.push("saket@proximity.tech");
      break;
    case "DES":
      emailList.push("chitrang@proximity.tech");
      break;
    default:
      break;
  }

  //TODO: overriding email list for testing purpose
  emailList = [
    "akash.a@proximity.tech",
    "mihir.p@proximity.tech",
    "ashwath.a@proximity.tech",
  ];

  return emailList;
};
