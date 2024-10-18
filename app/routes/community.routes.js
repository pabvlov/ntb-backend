const express = require('express');
const router = express.Router();
const communityService = require('../services/community.service.js');
const communityMapper = require('../mapping/community.mapping.js');
const userMapper = require('../mapping/user.mapping.js');
const userService = require('../services/user.service.js');
const multer = require('multer');

const storageEngineProfile = multer.diskStorage({
  destination: "./app/images/banners",
  filename: (req, file, cb) => {
    console.log(req);
    
      cb(null, `banner-ntb-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
storage: storageEngineProfile,
limits: { fileSize: 100000000 },
});

router.post('/community/banner/upload', upload.single("file"), (req, res) => {
  try {
      let { type, id_establishment, description, id_user } = req.body;
      type = 1;
      if (req.file) {

        let banner = communityService.uploadBanner(id_establishment, description, type, id_user, req.file.filename);

          res.json(
              {
                  ok: true,
                  affectedRows: banner.affectedRows,
              }
          );

          res.json(
              {
                  ok: true,
                  image: req.file.filename
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