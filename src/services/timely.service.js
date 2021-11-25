import axios from "axios";
import { ServiceResponseModel } from "../utils/Models";

export const NotifyTimely = async (
  bearerToken,
  userEmail,
  dates,
  reasonForLeave,
  hoursPerDay = 8
) => {
  const responseModel = new ServiceResponseModel(true);
  if (!bearerToken) {
    responseModel.success = false;
    responseModel.error = "No bearer token provided";
    return responseModel;
  }

  await InitializeEventCreation(
    bearerToken,
    userEmail,
    dates,
    reasonForLeave,
    hoursPerDay
  );
};

const InitializeEventCreation = async (
  bearerToken,
  userEmail,
  dates,
  reasonForLeave,
  hoursPerDay
) => {
  //const accessToken = await GetAccessToken(authCode);

  const requestConfig = {
    headers: { Authorization: `Bearer ${bearerToken}` },
  };

  const accountId = await GetAccountId(requestConfig);
  const projectId = await GetPTOProjectId(accountId, requestConfig);
  const userId = await GetCurrentUserId(userEmail, accountId, requestConfig);
  await CreateTimelyPTOEvent(
    accountId,
    projectId,
    userId,
    dates,
    reasonForLeave,
    hoursPerDay,
    requestConfig
  );

  return true;
};

const GetAccountId = async (requestConfig) => {
  const accountsUrl = "https://api.timelyapp.com/1.1/accounts";
  const accounts = await axios.get(accountsUrl, requestConfig);
  if (accounts && accounts.data.length > 0) {
    const proximityAccount = accounts.data.filter(
      (account) => account.name === "Proximity Labs"
    )[0];
    return proximityAccount.id;
  }
};

const GetPTOProjectId = async (accountId, requestConfig) => {
  const projectsUrl = `https://api.timelyapp.com/1.1/${accountId}/projects`;
  const projects = await axios.get(projectsUrl, requestConfig);
  if (projects && projects.data.length > 0) {
    const ptoProject = projects.data.filter((project) =>
      project.name.toLowerCase().startsWith("pto")
    )[0];
    console.log(ptoProject);
    return ptoProject.id;
  }
};

const GetCurrentUserId = async (userEmail, accountId, requestConfig) => {
  const usersUrl = `https://api.timelyapp.com/1.1/${accountId}/users`;
  const users = await axios.get(usersUrl, requestConfig);
  if (users && users.data.length > 0) {
    const currUser = users.data.filter(
      (user) => user.email.toLowerCase() === userEmail.toLowerCase()
    )[0];
    console.log(currUser);
    return currUser.id;
  }
};

const CreateTimelyPTOEvent = async (
  accountId,
  projectId,
  userId,
  dates,
  reasonForLeave,
  hoursPerDay,
  requestConfig
) => {
  const eventsUrl = `https://api.timelyapp.com/1.1/${accountId}/projects/${projectId}/events`;
  for (let i = 0; i < dates.length; i++) {
    const data = {
      event: {
        hours: hoursPerDay,
        minutes: 0,
        day: dates[i],
        note: reasonForLeave,
        created_from: "Leave Management System",
        user_id: userId,
        account_id: accountId,
        project_id: projectId,
      },
    };

    requestConfig.headers["Content-Type"] = "application/json";
    await axios.post(eventsUrl, JSON.stringify(data), requestConfig);
  }
};
