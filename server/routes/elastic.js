const express = require('express');
const router = express.Router();

router.get('/all', (req, res) => {
  res.status(501).send('Nothing here');
});

module.exports = router;
