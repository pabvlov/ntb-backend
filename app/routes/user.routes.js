const express = require('express');
const router = express.Router();
const user = require('../services/user.service.js');
const userMapper = require('../mapping/user.mapping.js');

router.get('/user/find', async function (req, res, next) {
  try {
    // obtain the mail from the query request
    const { mail } = req.query;
    const validareResponse = await user.getUserByMail(mail);
    let count = 0;
    for (var row in validareResponse) count++;
    if (count === 1) {
      if (!validareResponse.length > 0) {
        return res.status(401).json({
          ok: false,
          message: 'Hubo un error',
        })
      }
      // destructuring
      const userInfo = validareResponse[0];
      // regenerar jwt con datos nuevos
      return res.status(202).json({
        ok: true,
        content: {
          name: userInfo.name,
          lastname: userInfo.lastname,
          nickname: userInfo.nickname
        },
      })
    } else {
      return res.status(401).json({
        ok: false,
        message: "Usuario no existe o contraseña incorrecta"
      })
    }

  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/user/communities', async function (req, res, next) {
  try {
    const { id } = req.query;
    const establishments = await user.getCommunitiesByAthleteId(id);
    return res.status(200).json({
      communities: userMapper.communityMapper(establishments)
    }
  );
    
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});


module.exports = router;