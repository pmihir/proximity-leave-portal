// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

var nodemailer = require("nodemailer");

const emailSender = {
  emailId: "leave.proximity@gmail.com",
  password: "Password@123",
};
const emailSubject = "Sending email via Node app";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400);
    return;
  }
  console.log(req.body);
  const {
    emailToList,
    userEmail,
    userName,
    leaveFromDate,
    leaveToDate,
    reasonForLeave,
  } = req.body;

  console.log(emailToList);
  const emailBody = formatMail(
    userEmail,
    userName,
    leaveFromDate,
    leaveToDate,
    reasonForLeave
  );

  console.log(emailBody);

  const emailTo = formatEmailToList(emailToList);
  const mailOptions = {
    from: emailSender.emailId,
    to: emailTo,
    subject: emailSubject,
    text: emailBody,
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSender.emailId,
      pass: emailSender.password,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json(info.response);
      console.log("Email Sent: " + info.response);
    }
  });
}

function formatMail(
  userEmail,
  userName,
  leaveFromDate,
  leaveToDate,
  reasonForLeave
) {
  return `Hi Team,
I will be taking off. Please find the details below,\n
Name: ${userName}
Email: ${userEmail}
Leave From: ${formatDate(leaveFromDate)}
Leave To: ${formatDate(leaveToDate)}
Reason: ${reasonForLeave}\n\n
Thanks a lot !!!`;
}

function formatEmailToList(emailToList) {
  return emailToList.join(";");
}

function formatDate(date) {
  return new Date(date).toDateString();
}
