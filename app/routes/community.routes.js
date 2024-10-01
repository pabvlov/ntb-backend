const express = require('express');
const router = express.Router();
const communityService = require('../services/community.service.js');
const communityMapper = require('../mapping/community.mapping.js');
const userMapper = require('../mapping/user.mapping.js');
const userService = require('../services/user.service.js');

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