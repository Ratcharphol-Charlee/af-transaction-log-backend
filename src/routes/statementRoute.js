const { Router } = require("express");
const uploadController = require("../controllers/statementControllers");

const router = Router();
router.route("/upload").post(uploadController.uploadFile);

module.exports = router;
