const { sendPrivateMessage } = require("../Services/command.services");
const { sendMessage, createMessageToTask } = require("../Services/helpers");
const dayjs = require("dayjs");

const { PAYLOAD } = require("../Services/constants");

const axios = require("axios");

require("dotenv").config("../.env");

console.log("TOKEN => ", process.env.OP_TOKEN);
// https://projects.invozone.com/api/v3/work_packages

exports.addTaskToOpenProject = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { channel_id, user_id, command, text } = req.body;
    const startDate = dayjs().format("YYYY-MM-DD");
    console.log("Starting Date", startDate);
    // const currentDate = new Date();
    // const completeDate = {
    //   day: currentDate.getDay(),
    //   month: currentDate.getMonth(),
    //   year: currentDate.getFullYear(),
    // };
    // const startDate = `${currentDate.getFullYear()}-${
    //   completeDate.month < 10 ? "0" + completeDate.month : completeDate.month
    // }-${completeDate.day < 10 ? "0" + completeDate.day : completeDate.day}`;

    const payload = {
      ...PAYLOAD,
      startDate: startDate,
      subject: text,
      description: { raw: text },
    };

    const configAssignee = {
      method: "get",
      url: "https://projects.invozone.com/api/v3/projects/16/available_assignees",
      headers: {
        Authorization: `Basic ${process.env.OP_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    const assigneeResponse = await axios(configAssignee);

    const configAddTask = {
      method: "post",
      url: "https://projects.invozone.com/api/v3/work_packages/",
      headers: {
        Authorization: `Basic ${process.env.OP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    const response = await axios(configAddTask);

    sendPrivateMessage(
      channel_id,
      user_id,
      "Your Task Added with ID: #" + response?.data?.id
    );
  } catch (err) {
    console.log("Errors ===> ", err.message);
  }
};

exports.testCommand = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { channel_id, user_id, command, text } = req.body;
    console.log("Text", text);

    const createdTaskFromMessage = createMessageToTask(text);

    if (!createdTaskFromMessage) {
      return res.send(
        "Something missing in the command \n Example Command: Task: Your Task Name | Description: Your Description | Assignee: @Your Assignee"
      );
    }

    if (createdTaskFromMessage < 0) {
      return res.send(
        "Text Command is not Correct \n Example Command: Task: Your Task Name | Description: Your Description | Assignee: @Your Assignee"
      );
    }

    const configAssignee = {
      method: "get",
      url: "https://projects.invozone.com/api/v3/projects/16/available_assignees",
      headers: {
        Authorization: `Basic ${process.env.OP_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    const assigneeResponse = await axios(configAssignee);
    const users = assigneeResponse?.data?._embedded?.elements;
    const assigneeFound = users.find((user) =>
      user?.name?.match(createdTaskFromMessage?.assignee, "gi")
    );
    console.log("USER FOUND ==> ", assigneeFound);

    if (assigneeFound) {
      const assigneeHref = assigneeFound?._links?.self?.href;
      console.log(assigneeHref);

      const startDate = dayjs().format("YYYY-MM-DD");

      const { _links } = PAYLOAD;

      const payload = {
        ...PAYLOAD,
        startDate: startDate,
        subject: createdTaskFromMessage?.task,
        description: { raw: createdTaskFromMessage?.description },
        _links: { ..._links, assignee: { href: assigneeHref } },
      };

      console.log("Payload", payload);

      const configAddTask = {
        method: "post",
        url: "https://projects.invozone.com/api/v3/work_packages/",
        headers: {
          Authorization: `Basic ${process.env.OP_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      };

      const response = await axios(configAddTask);

      console.log("Response ===>", response);

      if (response?.data) {
        sendPrivateMessage(
          channel_id,
          user_id,
          "Your Task Added with ID: #" + response?.data?.id + " With Assignee"
        );
        return;
      }
      sendPrivateMessage(channel_id, user_id, response);
      return;
    }
    sendPrivateMessage(channel_id, user_id, "User Not Found");
    // return res.send("Assingee Not Found!");
  } catch (err) {
    console.log("Error", err.message);
  }
};
