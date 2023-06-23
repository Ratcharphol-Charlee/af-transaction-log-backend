const { Router } = require('express');
const uploadController = require('../controllers/statementControllers');


const router = Router();
router.route("/insert").post(uploadController.insert);

// Select Route
router.route('/select').post(uploadController.selectStatement);

// Delete Route
router.route('/delete').post(uploadController.deleteStatement);

// Query Route
router.route('/query').post(uploadController.queryStatement);

module.exports = router;
