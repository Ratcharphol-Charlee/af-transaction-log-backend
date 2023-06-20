const { Router } = require("express");
const userController = require("../controllers/userControllers");

const router = Router();
router.route("/").get(userController.getAll);
router.route("/login").post(userController.login);
router.route("/register").post(userController.register);

module.exports = router;
