const express = require('express');
const router = express.Router();
const classService = require('../services/class.service.js');
const warmupService = require('../services/warm-up.service.js')
const physicalpreparationService = require('../services/physical-preparation.service.js')
const mapping = require('../mapping/class.mapping.js')
const groupService = require('../services/group.service.js')
const planificationService = require('../services/planification.service.js')

router.post('/class/create', async function (req, res, next) {
  try {
    const { start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group, id_period, date_period_end } = req.body;
    const classId = await classService.createClass(start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group, id_period, date_period_end);

    return res.status(200).json({ id_class: classId.insertId, affectedRows: classId.affectedRows });
  } catch (err) {
    console.error(`Error while creating the class:`, err.message);
    next(err);
  }
});

router.get('/class/show', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const classes = await classService.getClasses(id_establishment);
    if (classes.length == 0) return res.status(404).json({ message: 'There are no classes in that period' });
    let planning_ids = [];

    classes.forEach(c => {
      planning_ids.push({ id: c.id_planification });
    });


    plannings = [];
    warmups = [];
    physicalpreparations = [];

    planning_ids = planning_ids.filter(p => p.id != null);
    if (planning_ids.length !== 0) {
      plannings = await planificationService.showPlanningAchievements(planning_ids);
      warmups = await warmupService.showAllWarmUpsByPlanifications(planning_ids);
      physicalpreparations = await physicalpreparationService.showAllPhysicalPreparationsByPlannifications(planning_ids);
    }

    groups = await groupService.getGroupsWithAthletes(id_establishment);

    result = mapping.mapEntireClass(classes, plannings, warmups, physicalpreparations, groups);

    return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing classes by establishment:`, err.message);
    next(err);
  }
});

router.get('/class/showBetweenDates', async function (req, res, next) {
  try {
    const { id_establishment, start_date, end_date } = req.query;
    const classes = await classService.getClassesBetweenDates(id_establishment, start_date, end_date);
    if (classes.length == 0) return res.status(404).json({ message: 'There are no classes in that period' });
    let planning_ids = [];

    classes.forEach(c => {
      planning_ids.push({ id: c.id_planification });
    });


    elements = [];
    warmups = [];
    physicalpreparations = [];

    planning_ids = planning_ids.filter(p => p.id != null);
    if (planning_ids.length !== 0) {
      elements = await planificationService.showPlanningAchievements(planning_ids);
      warmups = await warmupService.showAllWarmUpsByPlanifications(planning_ids);
      physicalpreparations = await physicalpreparationService.showAllPhysicalPreparationsByPlannifications(planning_ids);
    }

    groups = await groupService.getGroupsWithAthletes(id_establishment);

    result = mapping.mapEntireClass(classes, elements, warmups, physicalpreparations, groups);

    return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing class by dates:`, err.message);
    next(err);
  }
});

router.get('/class/today', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;    
    const classes = await classService.getTodayClasses(id_establishment);
    if (classes.length == 0) return res.status(404).json({ message: 'There are no classes in that period' });
    let planning_ids = [];
    let classes_ids = [];

    classes.forEach(c => {
      classes_ids.push({ id: c.id });
      planning_ids.push({ id: c.id_planification });
    });


    elements = [];
    warmups = [];
    physicalpreparations = [];

    planning_ids = planning_ids.filter(p => p.id != null);
    if (planning_ids.length !== 0) {
      elements = await planificationService.showPlanningAchievements(planning_ids);
      warmups = await warmupService.showAllWarmUpsByPlanifications(planning_ids);
      physicalpreparations = await physicalpreparationService.showAllPhysicalPreparationsByPlannifications(planning_ids);
    }
    if (classes_ids.length !== 0) {
      presences = await classService.presences(classes_ids);
    }

    groups = await groupService.getGroupsWithAthletes(id_establishment);

    result = mapping.mapEntireClass(classes, elements, warmups, physicalpreparations, groups, presences);

    return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing class by dates:`, err.message);
    next(err);
  }
});

router.get('/class/showByTeacher', async function (req, res, next) {
  try {
    const { id_user_teacher } = req.query;
    const classes = await classService.getClassesByTeacher(id_user_teacher);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while showing class by teacher:`, err.message);
    next(err);
  }
});

router.get('/class/showByGroup', async function (req, res, next) {
  try {
    const { id_group } = req.query;
    const classes = await classService.getClassesByGroup(id_group);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while showing classes by group:`, err.message);
    next(err);
  }
});

router.delete('/class/delete', async function (req, res, next) {
  try {
    const { id_class } = req.query;
    const classes = await classService.deleteClass(id_class);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while deleting class:`, err.message);
    next(err);
  }
});

router.put('/class/changeDate', async function (req, res, next) {
  try {
    const { id_class, start_date, end_date } = req.body;
    const classes = await classService.changeClassDate(id_class, start_date, end_date);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while changing date:`, err.message);
    next(err);
  }
});

router.put('/class/changeTeacher', async function (req, res, next) {
  try {
    const { id_class, id_user_teacher } = req.body;
    const classes = await classService.changeClassTeacher(id_class, id_user_teacher);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while changing teacher:`, err.message);
    next(err);
  }
});

router.put('/class/attachPlanification', async function (req, res, next) {
  try {
    const { id_class, id_planification } = req.body;
    const classes = await classService.attachPlanification(id_class, id_planification);
    return res.status(200).json(classes);
  } catch (err) {
    console.error(`Error while attaching planification to class:`, err.message);
    next(err);
  }
});

router.put('/class/attachPlanifications', async function (req, res, next) {
  try {
    const { classes, id_planification } = req.body;
    const result = await classService.attachPlanificationToClasses(classes, id_planification);
    return res.status(200).json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while attaching planifications to class:`, err.message);
    next(err);
  }
});

/* post athlete presence */
router.post('/class/presence', async function (req, res, next) {
  try {
    const { id_class, athlete_ids } = req.body;
    const result = await classService.createAthletePresence(id_class, athlete_ids);
    return res.status(200).json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while updating athlete presence:`, err.message);
    next(err);
  }
});

module.exports = router;