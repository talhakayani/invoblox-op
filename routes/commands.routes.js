const controller = require("../controllers/commands.controller");
const router = require("express").Router();

router.post("/op", controller.addTaskToOpenProject);

module.exports = router;
