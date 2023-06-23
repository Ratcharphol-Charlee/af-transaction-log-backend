const { Router } = require('express');
const uploadController = require('../controllers/statementControllers');
const selectController = require('../controllers/selectController');
const deleteController = require('../controllers/deleteController');

const router = Router();

// Upload Route
router.route('/upload').post(uploadController.uploadFile);

// Select Route
router.route('/select').get(async (req, res) => {
  try {
    const result = await selectController.selectStatement();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      result: err.message,
    });
  }
});

// Delete Route
router.route('/delete').delete(async (req, res) => {
    const { year, month, seq } = req.query;
  
    try {
      const result = await deleteController.deleteStatement(year, month, seq);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({
        message: 'Internal Server Error',
        result: err.message,
      });
    }
  });

module.exports = router;
