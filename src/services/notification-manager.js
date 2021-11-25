import { NotifySlack } from "./slack.service.js";
import { NotifyTimely } from "./timely.service.js";
import { NotifyEmail } from "./email.service.js";
import {
  GetDatesList,
  FormatDateYYYYMMDD,
  ConvertDatesToStringArr,
} from "../utils/dates-util";

export const Notify = async (
  userName,
  userEmail,
  leaveFromDate,
  leaveToDate,
  department,
  reasonForLeave,
  timelyBearerToken
) => {
  console.log(timelyBearerToken);
  const slackChannel = "#" + process.env.slack.channel ?? "testing-slack-post";
  const response = { slack: false, timely: false, email: false };

  try {
    //slack update
    await NotifySlack(
      slackChannel,
      userName,
      leaveFromDate,
      leaveToDate,
      reasonForLeave
    );
    response.slack = true;
  } catch (err) {}

  try {
    //timely update
    const leaveDates = GetDatesList(leaveFromDate, leaveToDate);
    await NotifyTimely(
      timelyBearerToken,
      userEmail,
      ConvertDatesToStringArr(leaveDates),
      reasonForLeave
    );
    response.timely = true;
  } catch (err) {}

  try {
    //send email
    await NotifyEmail(
      department,
      userEmail,
      userName,
      FormatDateYYYYMMDD(leaveFromDate),
      FormatDateYYYYMMDD(leaveToDate),
      reasonForLeave
    );
    response.email = true;
  } catch (err) {}

  return response;
};
