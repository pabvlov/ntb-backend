const express = require('express');
const router = express.Router();
const classService = require('../services/class.service.js');

router.post('/class/create', async function (req, res, next) {
  try {
    const { start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group } = req.body;
    const classId = await classService.createClass(start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group);

    return res.status(200).json({ id_class: classId.insertId, affectedRows: classId.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/class/show', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const classes = await classService.getClasses(id_establishment);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/class/showBetweenDates', async function (req, res, next) {
  try {
    const { id_establishment, start_date, end_date } = req.query;
    const classes = await classService.getClassesBetweenDates(id_establishment, start_date, end_date);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/class/showByTeacher', async function (req, res, next) {
  try {
    const { id_user_teacher } = req.query;
    const classes = await classService.getClassesByTeacher(id_user_teacher);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/class/showByGroup', async function (req, res, next) {
  try {
    const { id_group } = req.query;
    const classes = await classService.getClassesByGroup(id_group);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/class/delete', async function (req, res, next) {
  try {
    const { id_class } = req.query;
    const classes = await classService.deleteClass(id_class);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.put('/class/changeDate', async function (req, res, next) {
  try {
    const { id_class, start_date, end_date } = req.body;
    const classes = await classService.changeClassDate(id_class, start_date, end_date);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.put('/class/changeTeacher', async function (req, res, next) {
  try {
    const { id_class, id_user_teacher } = req.body;
    const classes = await classService.changeClassTeacher(id_class, id_user_teacher);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

module.exports = router;