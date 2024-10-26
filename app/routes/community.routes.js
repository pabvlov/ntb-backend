const express = require('express');
const router = express.Router();
const communityService = require('../services/community.service.js');
const communityMapper = require('../mapping/community.mapping.js');
const multer = require('multer');
const path = require('path');

// Usar path para resolver rutas correctamente
const storageEngineProfileBanner = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../app/images/banners')); // Ajustamos la ruta con path
  },
  filename: (req, file, cb) => {
    cb(null, `banner-ntb-${Date.now()}-${file.originalname}`);
  },
});

const storageEngineProfileContent = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../app/images/content')); // Ajustamos la ruta con path
  },
  filename: (req, file, cb) => {
    cb(null, `content-ntb-${Date.now()}-${file.originalname}`);
  },
});

const storageEngineProfileProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../app/images/profiles')); // Ajustamos la ruta con path
  },
  filename: (req, file, cb) => {
    cb(null, `profile-ntb-${Date.now()}-${file.originalname}`);
  },
});

const uploadBanner = multer({
  storage: storageEngineProfileBanner,
  limits: { fileSize: 100000000 }, // Límite de 100MB
});

const uploadContent = multer({
  storage: storageEngineProfileContent,
  limits: { fileSize: 100000000 }, // Límite de 100MB
});

const uploadProfile = multer({
  storage: storageEngineProfileProfile,
  limits: { fileSize: 100000000 }, // Límite de 100MB
});

router.put('/community/logo/upload', uploadProfile.single("file"), (req, res, next) => {
  try {
    let { id_community } = req.body;
    if (req.file) {
      /* check if its an image */
      if (!req.file.mimetype.includes('image')) {
        return res.status(400).json({
          affectedRows: 0,
          message: "Invalid file format, please upload a valid image",
        });
      }
      let logo = communityService.uploadLogo(id_community, req.file.filename);

      res.json({
        affectedRows: logo.affectedRows,
        image: req.file.filename
      });
    } else {
      res.status(400).json({
        affectedRows: 0,
        message: "No file uploaded, please upload a valid one",
      });
    }
  } catch (err) {
    console.error(`Error while uploading logo: `, err.message);
    next(err);
  }
});

router.post('/community/banner/upload', uploadBanner.single("file"), (req, res, next) => {
  try {
    let { type, id_establishment, description, id_user } = req.body;
    type = 1;
    if (req.file) {
      let banner = communityService.uploadContent(id_establishment, description, type, id_user, req.file.filename);

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

router.post('/community/comment/upload', uploadContent.single("file"), async (req, res, next) => {
  try {
    let { comment, id_user, id_community } = req.body;
    type = 2;
    if (req.file) {
      let banner = await communityService.uploadContent(null, comment, type, id_user, req.file.filename);
      let attachment = await communityService.uploadContentAttachment(banner.insertId, id_community);
      if (banner.affectedRows === 0 || attachment.affectedRows === 0) {
        res.status(400).json({
          affectedRows: banner.affectedRows + attachment.affectedRows,
          message: "Error while uploading comment: " + banner.message,
        });
      } else {
        res.json({
          affectedRows: banner.affectedRows + attachment.affectedRows,
          image: req.file.filename
        });
      }
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

router.delete('/community/comment/delete', (req, res, next) => {
  try {
    let { id } = req.query;
    let banner = communityService.deleteContent(id);

    res.json({
      affectedRows: banner.affectedRows
    });
  } catch (err) {
    console.error(`Error while uploading banner: `, err.message);
    next(err);
  }
});

router.delete('/community/banner/delete', (req, res, next) => {
  try {
    let { id } = req.query;
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
    const comments = await communityService.getCommentsByCommunity(id);
    
    const response = communityMapper.bannerMapper(banners, athletes, establishments, comments);

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