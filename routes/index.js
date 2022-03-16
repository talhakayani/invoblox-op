const router = require("express").Router();
const commands = require("./commands.routes");
router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

router.use("/slack/slash-commands", commands);

module.exports = router;
