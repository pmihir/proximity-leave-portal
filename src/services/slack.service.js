import axios from "axios";

const webhookUrl =
  "https://hooks.slack.com/services/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";

const formatMessage = (leaveFromDate, leaveToDate, reasonForLeave) => {
  return `Hi Guys, I will be taking leave from ${leaveFromDate} to ${leaveToDate}\n
    Reason: ${reasonForLeave}\n
    Thanks !!!`;
};

export const Notify = async (
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
