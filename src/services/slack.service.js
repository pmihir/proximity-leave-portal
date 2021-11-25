import axios from "axios";

const webhookUrl = process.env.slack.webhookUrl;
const formatMessage = (leaveFromDate, leaveToDate, reasonForLeave) => {
  return `Hi Guys, I will be taking off from ${leaveFromDate.toDateString()} to ${leaveToDate.toDateString()}
Reason: ${reasonForLeave}
Thanks !!!`;
};

export const NotifySlack = async (
  channelName,
  userName,
  leaveFromDate,
  leaveToDate,
  reasonForLeave
) => {
  const message = formatMessage(leaveFromDate, leaveToDate, reasonForLeave);
  const data = {
    channel: channelName,
    username: userName,
    text: message,
  };
  const response = await axios.post(webhookUrl, JSON.stringify(data), {
    withCredentials: false,
    transformRequest: [
      (data, headers) => {
        delete headers.post["Content-Type"];
        return data;
      },
    ],
  });

  if (response.status === 200) {
    return true;
  } else {
    return response;
  }
};
