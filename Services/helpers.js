exports.sendMessage = (message) => {
  return [
    {
      type: "section",
      text: { type: "mrkdwn", text: message },
    },
  ];
};
