module.exports = {
  reactStrictMode: true,
  env: {
    timely: {
      redirectUri: "https://localhost:3000/",
      applicationId: "QjxE7NN2ZLOhZ0LabUj513b5FIQ-ZRXqlRokq1KcdIk",
      clientSecret: "eyQcPCLrikEJSAQgt3qodh9oSw0mM--5HZh2FJ5FUo4",
    },
    app: {
      callbackUri: "https://localhost:3000/",
    },
    slack: {
      channel: "testing-slack-post",
      webhookUrl:
        "https://hooks.slack.com/services/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",
    },
  },
};
