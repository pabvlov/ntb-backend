const express = require('express');
const router = express.Router();
const classService = require('../services/class.service.js');
const warmupService = require('../services/warm-up.service.js')
const physicalpreparationService = require('../services/physical-preparation.service.js')

router.post('/planification/insertWarmUp', async function (req, res, next) {
    try {
      const { id_planification, id_warmup, quantity, id_quantity_type } = req.body;
      if (id_planification == null || id_warmup == null) return res.status(400).json({ affectedRows: 0, message: 'Class or WarmUp ID´s can´t be null' });
      const exist = await classService.checkClassExists(id_planification);    
      if (exist.length == 0) return res.status(404).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' })
      
      const classWarmUpInsert = await warmupService.attachWarmUpToClass(id_planification, id_warmup, quantity, id_quantity_type);
      return res.status(200).json({ affectedRows: classWarmUpInsert.affectedRows });
    } catch (err) {
      console.error(`Error while posting that warm up:`, err.message);
      next(err);
    }
  });
  
  router.delete('/planification/deleteWarmUp', async function (req, res, next) {
    try {
      const { id_planification, id_warmup, quantity, id_quantity_type } = req.body;
      if (id_planification == null || id_warmup == null) return res.status(400).json({ affectedRows: 0, message: 'Class or WarmUp ID´s can´t be null' });
      const exist = await classService.checkClassExists(id_planification);
      if (exist.length === 0) return res.status(204).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' });
  
      const classDeletWarmUpAttachment = await warmupService.deleteWarmUpAttachment(id_planification, id_warmup);
      return res.status(200).json({ affectedRows: classDeletWarmUpAttachment.affectedRows })
    } catch (err) {
        console.error(`Error while deleting that warmup`)
    }
  })
  
  router.post('/planification/insertPhysicalPreparation', async function (req, res, next) {
    try {
      const { id_planification, id_physical_preparation, quantity, id_quantity_type } = req.body;
      if (id_planification == null || id_physical_preparation == null) return res.status(400).json({ affectedRows: 0, message: 'Class or PhysicalPreparation ID´s can´t be null' });
      const classExist = await classService.checkClassExists(id_planification);    
      if (classExist.length == 0) return res.status(404).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' })
      const physicalPreparationExist = await physicalpreparationService.existsPhysicalPreparationAttachment(id_planification, id_physical_preparation);
      if (physicalPreparationExist.length !== 0) return res.status(404).json({ affectedRows: 0, message: 'The physical preparation you provided already exists' });
      
      
      const classPhysicalPreparationInsert = await physicalpreparationService.attachPhysicalPreparationToClass(id_planification, id_physical_preparation, quantity, id_quantity_type);
      return res.status(200).json({ affectedRows: classPhysicalPreparationInsert.affectedRows });
    } catch (err) {
      console.error(`Error while posting that physical preparation:`, err.message);
      next(err);
    }
  });
  
  router.delete('/planification/deletePhysicalPreparation', async function (req, res, next) {
    try {
      const { id_planification, id_physical_preparation, quantity, id_quantity_type } = req.body;
      if (id_planification == null || id_physical_preparation == null) return res.status(400).json({ affectedRows: 0, message: 'Class or PhysicalPreparation ID´s can´t be null' });
      const exist = await classService.checkClassExists(id_planification);
      if (exist.length === 0) return res.status(204).json({ affectedRows: 0, message: 'The class you provided doesn´t exists' });
  
      const classDeletPhysicalPreparationAttachment = await physicalpreparationService.deletePhysicalPreparationAttachment(id_planification, id_physical_preparation);
      return res.status(200).json({ affectedRows: classDeletPhysicalPreparationAttachment.affectedRows })
    } catch (err) {
        console.error(`Error while deleting that physical preparation`)
    }
  })

  router.post('/planification/create', async function (req, res, next) {
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
  
  router.post('/planification/achievement', async function (req, res, next) {
    try {
      const { id_element, id_routine, id_planification, comment } = req.body;
      if (classService.achievementExists(id_element, id_planification).length > 0) {
        return res.status(409).json({ affectedRows: 0, message: 'This achievement already exists in this planning' });
      }
      const planning = await classService.attachAchievementToPlanning(id_element, id_routine, id_planification, comment);
      return res.status(200).json({ affectedRows: planning.affectedRows, message: 'Achievement attached to planning' });
    } catch (err) {
      console.error(`Error while posting that in class service:`, err.message);
      next(err);
    }
  });

  router.get('/planification/achievements', async function (req, res, next) {
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