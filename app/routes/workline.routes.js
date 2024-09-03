const express = require('express');
const router = express.Router();
const worklineService = require('../services/workline.service.js');

/* Mostrar todas las worklines */
router.get('/worklines', async function (req, res, next) {
  try {
    const worklines = await worklineService.worklines();
    return res.status(200).json(worklines);
  } catch (err) {
    console.error(`Error while showing those worklines:`, err.message);
    next(err);
  }
})

module.exports = router;