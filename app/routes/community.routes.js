const express = require('express');
const router = express.Router();
const communityService = require('../services/community.service.js');
const communityMapper = require('../mapping/community.mapping.js');
const multer = require('multer');
const path = require('path');

// Usar path para resolver rutas correctamente
const storageEngineProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../app/images/banners')); // Ajustamos la ruta con path
  },
  filename: (req, file, cb) => {
    cb(null, `banner-ntb-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngineProfile,
  limits: { fileSize: 100000000 }, // Límite de 100MB
});

router.post('/community/banner/upload', upload.single("file"), (req, res, next) => {
  try {
    let { type, id_establishment, description, id_user } = req.body;
    type = 1;
    if (req.file) {
      let banner = communityService.uploadBanner(id_establishment, description, type, id_user, req.file.filename);

      res.json({
        affectedRows: banner.affectedRows,
        image: req.file.filename
      });
    } else {
      res.status(400).json({
        affectedRows: banner.affectedRows,
        message: "No file uploaded, please upload a valid one",
      });
    }
  } catch (err) {
    console.error(`Error while uploading banner: `, err.message);
    next(err);
  }
});

router.post('/community/comment/upload', upload.single("file"), (req, res, next) => {
  try {
    let { id_establishment, comment, id_user } = req.body;
    type = 2;
    if (req.file) {
      let banner = communityService.uploadContent(id_establishment, comment, type, id_user, req.file.filename);
      let attachment = communityService.uploadContentAttachment(banner.insertId, req.file.filename);
      res.json({
        affectedRows: banner.affectedRows + attachment.affectedRows,
        image: req.file.filename
      });
    } else {
      res.status(400).json({
        affectedRows: banner.affectedRows,
        message: "No file uploaded, please upload a valid one",
      });
    }
  } catch (err) {
    console.error(`Error while uploading banner: `, err.message);
    next(err);
  }
});

router.delete('/community/comment/delete', upload.single("file"), (req, res, next) => {
  try {
    let { id } = req.body;
    let banner = communityService.deleteContent(id);

    res.json({
      affectedRows: banner.affectedRows
    });
  } catch (err) {
    console.error(`Error while uploading banner: `, err.message);
    next(err);
  }
});

router.delete('/community/banner/delete', upload.single("file"), (req, res, next) => {
  try {
    let { id } = req.body;
    let banner = communityService.deleteContent(id);

    res.json({
      affectedRows: banner.affectedRows
    });
  } catch (err) {
    console.error(`Error while uploading banner: `, err.message);
    next(err);
  }
});

router.get('/community/info', async function (req, res, next) {
  try {
    const { id } = req.query;
    const banners = await communityService.getBannersByCommunity(id);
    const athletes = await communityService.getCommunityUsers(id);
    const establishments = await communityService.getEstablishmentsByCommunity(id);
    
    const response = communityMapper.bannerMapper(banners, athletes, establishments);

    return res.status(200).json(response);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/establishment/roles', async function (req, res, next) {
  try {
    const { id } = req.query;
    const establishments = await communityService.getRolesByEstablishment(id);

    return res.status(200).json(establishments);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});



module.exports = router;