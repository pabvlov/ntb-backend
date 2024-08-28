const express = require('express');
const router = express.Router();
const warmupServices = require('../services/warm-up.service.js');

router.post('/warmup/create', async function (req, res, next) {
  try {
    const { name } = req.body;
    const exists = await warmupServices.checkWarmUpExists(name);
    if(exists.length !== 0) return res.status(409).json({ affectedRows: 0, message: "There is already a Warm Up with that name"})
    const result = await warmupServices.createWarmUp(name);
    return res.status(200).json({ id_warmup: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/warmup/delete', async function (req, res, next) {
  try {
    const { id_warmup } = req.body;
    const exists = await warmupServices.checkWarmUpExistsById(id_warmup);
    if(exists.length == 0) return res.status(409).json({ affectedRows: 0, message: "There is no Warm Up with that id"})
    const result = await warmupServices.deleteWarmUp(id_warmup);
    return res.status(200).json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while deleting that warm up row:`, err.message);
    next(err);
  }
});

router.get('/warmup/show', async function (req, res, next) {
  try {
      const result = await warmupServices.showAllWarmUps();
      return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing those warm ups:`, err.message);
    next(err);
  }
})

router.get('/warmup/showByClass', async function (req, res, next) {
  try {
    const { id_class } = req.query;
    if (id_class != null) {
      const result = await warmupServices.showAllWarmUpsByClass(id_class);
      return res.status(200).json(result);
    } else return res.status(409).json({ message: "You need to provide a class id"})
    
  } catch (err) {
    console.error(`Error while showing those warm ups:`, err.message);
    next(err);
  }
})



module.exports = router;