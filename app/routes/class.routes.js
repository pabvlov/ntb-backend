const express = require('express');
const router = express.Router();
const classService = require('../services/class.service.js');
const warmupService = require('../services/warm-up.service.js')
const physicalpreparationService = require('../services/physical-preparation.service.js')
const mapping = require('../mapping/class.mapping.js')
const groupService = require('../services/group.service.js')

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
    const { id_establishment, id_class } = req.query;
    const classes = await classService.getClasses(id_establishment);
    let class_ids = [];
    let planning_ids = [];

    classes.forEach(c => {
      class_ids.push({ id: c.id });
      planning_ids.push({ id: c.id_planification});
      });
      
    plannings = await classService.showPlanningAchievements(planning_ids);
    warmups = await warmupService.showAllWarmUpsByClasses(class_ids);
    physicalpreparations = await physicalpreparationService.showAllPhysicalPreparationsByClasses(class_ids);
    groups = await groupService.getGroupsWithAthletes(id_establishment);    
    
    result = mapping.mapEntireClass( classes, plannings, warmups, physicalpreparations, groups );

    return res.status(200).json(result);
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

router.post('/class/insertWarmUp', async function (req, res, next) {
  try {
    const { id_class, id_warmup, quantity, id_quantity_type } = req.body;
    if (id_class == null || id_warmup == null) return res.status(400).json({ affectedRows: 0, message: 'Class or WarmUp ID´s can´t be null' });
    const exist = await classService.checkClassExists(id_class);    
    if (exist.length == 0) return res.status(404).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' })
    
    const classWarmUpInsert = await warmupService.attachWarmUpToClass(id_class, id_warmup, quantity, id_quantity_type);
    return res.status(200).json({ affectedRows: classWarmUpInsert.affectedRows });
  } catch (err) {
    console.error(`Error while posting that warm up:`, err.message);
    next(err);
  }
});

router.delete('/class/deleteWarmUp', async function (req, res, next) {
  try {
    const { id_class, id_warmup, quantity, id_quantity_type } = req.body;
    if (id_class == null || id_warmup == null) return res.status(400).json({ affectedRows: 0, message: 'Class or WarmUp ID´s can´t be null' });
    const exist = await classService.checkClassExists(id_class);
    if (exist.length === 0) return res.status(204).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' });

    const classDeletWarmUpAttachment = await warmupService.deleteWarmUpAttachment(id_class, id_warmup);
    return res.status(200).json({ affectedRows: classDeletWarmUpAttachment.affectedRows })
  } catch (err) {
      console.error(`Error while deleting that warmup`)
  }
})

router.post('/class/insertPhysicalPreparation', async function (req, res, next) {
  try {
    const { id_class, id_physical_preparation, quantity, id_quantity_type } = req.body;
    if (id_class == null || id_physical_preparation == null) return res.status(400).json({ affectedRows: 0, message: 'Class or PhysicalPreparation ID´s can´t be null' });
    const classExist = await classService.checkClassExists(id_class);    
    if (classExist.length == 0) return res.status(404).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' })
    const physicalPreparationExist = await physicalpreparationService.existsPhysicalPreparationAttachment(id_class, id_physical_preparation);
    if (physicalPreparationExist.length !== 0) return res.status(404).json({ affectedRows: 0, message: 'The physical preparation you provided already exists' });
    
    
    const classPhysicalPreparationInsert = await physicalpreparationService.attachPhysicalPreparationToClass(id_class, id_physical_preparation, quantity, id_quantity_type);
    return res.status(200).json({ affectedRows: classPhysicalPreparationInsert.affectedRows });
  } catch (err) {
    console.error(`Error while posting that physical preparation:`, err.message);
    next(err);
  }
});

router.delete('/class/deletePhysicalPreparation', async function (req, res, next) {
  try {
    const { id_class, id_physical_preparation, quantity, id_quantity_type } = req.body;
    if (id_class == null || id_physical_preparation == null) return res.status(400).json({ affectedRows: 0, message: 'Class or PhysicalPreparation ID´s can´t be null' });
    const exist = await classService.checkClassExists(id_class);
    if (exist.length === 0) return res.status(204).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' });

    const classDeletPhysicalPreparationAttachment = await physicalpreparationService.deletePhysicalPreparationAttachment(id_class, id_physical_preparation);
    return res.status(200).json({ affectedRows: classDeletPhysicalPreparationAttachment.affectedRows })
  } catch (err) {
      console.error(`Error while deleting that physical preparation`)
  }
})

router.post('/class/planning/create', async function (req, res, next) {
  try {
    const { id_class } = req.body;
    const planning = await classService.createPlanning();
    const class_affected = await classService.attachPlanningToClass(planning.insertId, id_class);
    if (class_affected.affectedRows == 0) {
      return res.status(404).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' });
    } else {
      return res.status(200).json({ id_planification: planning.insertId, id_class });
    }
  } catch (err) {
    console.error(`Error while posting that in class service:`, err.message);
    next(err);
  }
});

router.post('/class/planning/achievement', async function (req, res, next) {
  try {
    const { id_element, id_routine, id_planning, comment } = req.body;
    if (classService.achievementExists(id_element, id_planning).length > 0) {
      return res.status(409).json({ affectedRows: 0, message: 'This achievement already exists in this planning' });
    }
    const planning = await classService.attachAchievementToPlanning(id_element, id_routine, id_planning, comment);
    return res.status(200).json({ affectedRows: planning.affectedRows, message: 'Achievement attached to planning' });
  } catch (err) {
    console.error(`Error while posting that in class service:`, err.message);
    next(err);
  }
});

router.get('/class/planning/achievements', async function (req, res, next) {
  try {
    const { id_planning } = req.query;
    const achievements = await classService.showPlanningAchievements([{id: id_planning}]);
    return res.status(200).json(achievements);
  } catch (err) {
    console.error(`Error while getting that in class service:`, err.message);
    next(err);
  }
});


module.exports = router;