import axios from "axios";

const formatMessage = (
  leaveFromDate,
  leaveToDate,
  reasonForLeave,
  userName
) => {
  const text = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Hey Guys :wave:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${userName} here,`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `I will be taking off from ${leaveFromDate.toDateString()} to ${leaveToDate.toDateString()}\nReason: ${reasonForLeave}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Thanks a lot !!!",
      },
    },
  ];

  return text;
};

export const NotifySlack = async (
  channelName,
  userName,
  leaveFromDate,
  leaveToDate,
  reasonForLeave,
  slackWebhookUrl
) => {
  const message = formatMessage(
    leaveFromDate,
    leaveToDate,
    reasonForLeave,
    userName
  );
  const data = {
    channel: channelName,
    username: userName,
    blocks: message,
  };
  const response = await axios.post(slackWebhookUrl, JSON.stringify(data), {
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
