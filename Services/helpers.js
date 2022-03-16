exports.sendMessage = (message) => {
  return [
    {
      type: "section",
      text: { type: "mrkdwn", text: message },
    },
  ];
};
const createCapitalizeName = (name) => {
  return name
    .replace("@", "")
    .replace(" ", "")
    .split(".")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

exports.createMessageToTask = (createTask) => {
  try {
    if (createTask.includes("|")) {
      const response = createTask.split("|");
      if (response.length === 3) {
        const object = {
          task: response[0].split(":")[1],
          description: response[1].split(":")[1],
          assignee: createCapitalizeName(response[2].split(":")[1]),
        };
        return object;
      }
      return 0;
    }
    return -1;
  } catch (err) {
    throw err;
  }
};
