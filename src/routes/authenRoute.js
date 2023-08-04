const { Router } = require('express');
const authenController = require('../controllers/authenServiceControllers');


const router = Router();
router.route("").get(authenController.getAuthorize);

module.exports = router;
