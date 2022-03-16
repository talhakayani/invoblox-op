const { app, client } = require("../Connections/slack.connections");

require("dotenv").config("../.env");

exports.sendPrivateMessage = async (channel_id, userid, text) => {
  try {
    await app.client.chat.postEphemeral({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel_id,
      user: userid,
      text: text,
    });
  } catch (err) {
    return err.message;
  }
};
