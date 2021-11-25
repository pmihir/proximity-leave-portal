import { NotifySlack } from "./slack.service.js";
import { NotifyTimely } from "./timely.service.js";
import { NotifyEmail } from "./email.service.js";
import {
  GetDatesList,
  FormatDateYYYYMMDD,
  ConvertDatesToStringArr,
} from "../utils/dates-util";

export const Notify = (
  userName,
  userEmail,
  leaveFromDate,
  leaveToDate,
  department,
  reasonForLeave,
  timelyBearerToken
) => {
  const slackChannel = "#" + process.env.slack.channel ?? "testing-slack-post";
  const response = { slack: false, timely: false, email: false };

  //slack update
  NotifySlack(
    slackChannel,
    userName,
    leaveFromDate,
    leaveToDate,
    reasonForLeave
  ).then((res) => {
    response.slack = true;
  });

  //timely update
  const leaveDates = GetDatesList(leaveFromDate, leaveToDate);
  NotifyTimely(
    timelyBearerToken,
    userEmail,
    ConvertDatesToStringArr(leaveDates),
    reasonForLeave
  ).then((res) => {
    response.timely = true;
  });

  //send email
  NotifyEmail(
    department,
    userEmail,
    userName,
    FormatDateYYYYMMDD(leaveFromDate),
    FormatDateYYYYMMDD(leaveToDate),
    reasonForLeave
  ).then((res) => {
    response.email = true;
  });

  return response;
};
