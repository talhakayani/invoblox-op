const { sendPrivateMessage } = require("../Services/command.services");
const { sendMessage } = require("../Services/helpers");
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

    const config = {
      method: "post",
      url: "https://projects.invozone.com/api/v3/work_packages/",
      headers: {
        Authorization: `Basic ${process.env.OP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    const response = await axios(config);

    sendPrivateMessage(
      channel_id,
      user_id,
      "Your Task Added with ID: #" + response?.data?.id
    );
  } catch (err) {
    console.log("Errors ===> ", err.message);
  }
};
