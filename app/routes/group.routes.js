const express = require('express');
const router = express.Router();
const groupService = require('../services/group.service.js');
const groupMapper = require('../mapping/group.mapping.js');

router.post('/group/create', async function (req, res, next) {
  try {
    const { name, id_difficulty_category, id_establishment } = req.body;
    const groupId = await groupService.createGroup(name, id_difficulty_category, id_establishment);
    return res.status(200).json({ id_group: groupId.insertId, affectedRows: groupId.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.post('/group/insertAthlete', async function (req, res, next) {
  try {
    const { id_group, id_athlete } = req.body;
    const exist = await groupService.checkExistsAthleteInGroup(id_group, id_athlete);
    if (exist.length > 0) {
      return res.status(409).json({ affectedRows: 0, message: 'Athlete already in group' });
    }
    const groupId = await groupService.insertAthleteIntoGroup(id_group, id_athlete);
    return res.status(200).json({ affectedRows: groupId.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/group/withAthletes', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const groups = await groupService.getGroupsWithAthletes(id_establishment);
    return res.status(200).json(groups);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/groups', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const groups = await groupService.getGroups(id_establishment);
    const athletes = await groupService.getGroupsWithAthletes(id_establishment);
    return res.status(200).json(groupMapper.mapAthletesIntoGroups(groups, athletes));
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

module.exports = router;