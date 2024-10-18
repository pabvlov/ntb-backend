const express = require('express');
const router = express.Router();
const warmupServices = require('../services/warm-up.service.js');
const multer = require('multer');

const storageEngineProfile = multer.diskStorage({
  destination: "./app/images/warmups",
  filename: (req, file, cb) => {
    console.log(req);
    
      cb(null, `warmup-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
storage: storageEngineProfile,
limits: { fileSize: 100000000 },
});

router.post('/user/upload', upload.single("file"), (req, res) => {
  try {
      if (req.file) {
        user.uploadImage(req.file.filename, req.body.id_warmup)
          res.json(
              {
                  ok: true,
                  message: {
                    "image": req.file.filename,
                  }
              }
          );
          
      } else {
          res.status(400).json({
              ok: false,
              message: "No file uploaded, please upload a valid one",
          });
      }
  } catch (err) {
      console.error(`Error while getting all works: `, err.message);
      next(err);
  }
});

router.post('/warmup/create', async function (req, res, next) {
  try {
    const { name, single_name } = req.body;
    if (!name || !single_name) {
      return res.status(400).json({ message: 'Missing parameters: You have to provide a name and a single name' });
    }
    const exists = await warmupServices.checkWarmUpExists(name, single_name);
    if(exists.length !== 0) return res.status(409).json({ affectedRows: 0, message: "There is already a Warm Up with that name"})
    const result = await warmupServices.createWarmUp(name, single_name);
    return res.status(200).json({ id_warmup: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/warmup/delete', async function (req, res, next) {
  try {
    const { id_warmup } = req.query;
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

router.get('/warmup/showByPlanification', async function (req, res, next) {
  try {
    if (req.body != null) {
      const result = await warmupServices.showAllWarmUpsByPlanifications(req.body);
      return res.status(200).json(result);
    } else return res.status(409).json({ message: "You need to provide a planification id"})
  } catch (err) {
    console.error(`Error while showing those physical preparations:`, err.message);
    next(err);
  }
})




module.exports = router;