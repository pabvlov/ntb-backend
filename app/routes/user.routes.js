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

router.get('/user/athletes', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const response = await user.getAthletesByEstablishment(id_establishment);
    return res.status(200).json({
      users: userMapper.mapUserAthletes(response)
    }
  );
    
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

/* create athlete */
router.post('/user/athlete/create', async function (req, res, next) {
  try {
    const { name, lastname, birthdate, id_user_in_charge, id_establishment, id_workline } = req.body;

    const result = await user.createAthlete(name, lastname, birthdate, id_workline, id_user_in_charge);
    const attach = await user.attachAthleteToEstablishment(result.insertId, id_establishment, 1);

    return res.status(200).json({ id_athlete: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while posting that athlete row:`, err.message);
    next(err);
  }
});

/* create user athlete inactive */
router.post('/user/athlete/createInactive', async function (req, res, next) {
  try {
    const { mail, id_establishment } = req.body;
    let result;

    const u = await user.getUserByMail(mail);
    if (u.length === 0) {
      return res.status(404).json({  id_athlete: 0, affectedRows: 0, message: 'User not found' });
    } else {
      const date = new Date(u[0].birthdate);
      result = await user.createAthlete(u[0].name, u[0].lastname, date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }), null, u[0].id);
      const attach = await user.attachAthleteToEstablishment(result.insertId, id_establishment, 0);
    }

    return res.status(200).json({ id_athlete: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while posting that athlete row:`, err.message);
    next(err);
  }
});


module.exports = router;