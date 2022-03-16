const controller = require("../controllers/commands.controller");
const router = require("express").Router();

router.post("/op", controller.addTaskToOpenProject);
router.post("/test", controller.testCommand);

module.exports = router;
