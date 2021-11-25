import SlackService from "./slack.service.js";
import TimelyService from "./timely.service.js";
import EmailService from "./email.service.js";
import { GetDatesList, FormatDateYYYYMMDD } from "../utils/dates-util";

export const Notify = async ({
  userName,
  userEmail,
  leaveFromDate,
  leaveToDate,
  department,
  reasonForLeave,
  timelyAuthCode,
}) => {
  const slackChannel = "#" + process.env.slack.channel ?? "testing-slack-post";
  const response = { slack: false, timely: false, email: false };

  try {
    await SlackService.Notify(
      slackChannel,
      userName,
      leaveFromDate,
      leaveToDate,
      reasonForLeave
    );
    response.slack = true;
  } catch (err) {
    response.slack = false;
  }

  try {
    const leaveDates = GetDatesList(leaveFromDate, leaveToDate);
    await TimelyService.Notify(
      timelyAuthCode,
      userEmail,
      ConvertDatesToStringArr(leaveDates),
      reasonForLeave
    );
    response.timely = true;
  } catch (err) {
    response.timely = false;
  }

  try {
    await EmailService.Notify(
      department,
      userEmail,
      userName,
      FormatDateYYYYMMDD(leaveFromDate),
      FormatDateYYYYMMDD(leaveToDate),
      reasonForLeave
    );
    response.email = true;
  } catch {
    response.email = false;
  }

  return response;
};
