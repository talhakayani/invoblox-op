require("dotenv").config();
const express = require("express");
const routes = require("./routes");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", routes);
// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   socketMode: true,
//   appToken: process.env.APP_TOKEN,
// });

// (async () => {
//   const port = 3000;
//   await app.start(process.env.PORT || port);
//   console.log("⚡️ Slack Bolt app is running on port ", port);
// })();

app.listen(PORT, async () => {
  console.log(`Server is up and is running`);
});
