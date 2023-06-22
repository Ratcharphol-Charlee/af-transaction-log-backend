const { Router } = require("express");
const uploadController = require("../controllers/statementControllers");

const router = Router();
router.route("/insert").post(uploadController.insert);

module.exports = router;
