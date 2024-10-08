const express = require('express');
const router = express.Router();
const planificationService = require('../services/planification.service.js');
const warmupService = require('../services/warm-up.service.js')
const physicalpreparationService = require('../services/physical-preparation.service.js')
const elementService = require('../services/element.service.js')

router.post('/planification/insertWarmUp', async function (req, res, next) {
  try {
    const { id_planification, id_warmup, quantity, id_quantity_type } = req.body;
    if (id_planification == null || id_warmup == null) return res.status(400).json({ affectedRows: 0, message: 'Class or WarmUp ID´s can´t be null' });
    const exist = await planificationService.checkClassExists(id_planification);
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
    const exist = await planificationService.checkClassExists(id_planification);
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
    const classExist = await planificationService.checkClassExists(id_planification);
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
    const exist = await planificationService.checkClassExists(id_planification);
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
    const planning = await planificationService.createPlanning();
    const class_affected = await planificationService.attachPlanningToClass(planning.insertId, id_class);
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
    if (planificationService.achievementExists(id_element, id_planification).length > 0) {
      return res.status(409).json({ affectedRows: 0, message: 'This achievement already exists in this planning' });
    }
    const planning = await planificationService.attachAchievementToPlanning(id_element, id_routine, id_planification, comment);
    return res.status(200).json({ affectedRows: planning.affectedRows, message: 'Achievement attached to planning' });
  } catch (err) {
    console.error(`Error while posting that in class service:`, err.message);
    next(err);
  }
});

router.get('/planification/achievements', async function (req, res, next) {
  try {
    const { id_planning } = req.query;
    const achievements = await planificationService.showPlanningAchievements([{ id: id_planning }]);
    return res.status(200).json(achievements);
  } catch (err) {
    console.error(`Error while getting that in class service:`, err.message);
    next(err);
  }
});

router.get('/planification/show', async function (req, res, next) {
  try {
    const { id_establishment } = req.query;
    const planning = await planificationService.showPlanification(id_establishment);
    let planning_ids = [];

    planning.forEach(p => {
      planning_ids.push({ id: p.id });
    });
    const result = await getPlanificationInfo(planning_ids)

    planning.forEach(p => {
      p.warmups = result.warmups.filter(w => w.id_planification == p.id);
      p.physicalpreparations = result.physicalpreparations.filter(pp => pp.id_planification == p.id);
      p.achievements = result.elements.filter(e => e.id_planification == p.id);
    });

    return res.status(200).json(planning);
  } catch (err) {
    console.error(`Error while getting that in class service:`, err.message);
    next(err);
  }
});

router.post('/planification/build', async function (req, res, next) {
  try {
    const { elements, physicalpreparations, warmups, id_establishment } = req.body;

    const planning = await planificationService.createPlanning(null, id_establishment);
    const planning_id = planning.insertId;

    const pp = await physicalpreparationService.attachPhysicalPreparationsToPlanification(planning_id, physicalpreparations);
    const w = await warmupService.attachWarmUpsToPlanification(planning_id, warmups);
    const e = await elementService.attachElementsToPlanification(planning_id, elements);

    const successMessage = `Planning ${planning_id} built with ${pp.affectedRows}/${physicalpreparations.length} physical preparations, ${w.affectedRows}/${warmups.length} warmups and ${e.affectedRows}/${elements.length} elements`;
    const errorMessage = `Error while building planning ${planning_id}`;

    const result = await getPlanificationInfo([{ id: planning_id }]);

    return res.status(200).json({
      planification: {
        id: planning_id,
        warmups: result.warmups,
        physicalpreparations: result.physicalpreparations,
        elements: result.elements
      },
      affectedRows: planning.affectedRows,
      message: planning.affectedRows > 0 ? successMessage : errorMessage,
    });
  } catch (err) {
    console.error(`Hubo un error mientras se creaba la planificación:`, err.message);
    next(err);
  }
});

router.delete('/planification/delete', async function (req, res, next) {
  try {
    const { id_planification } = req.query;
    const exists = await planificationService.checkPlanificationExists(id_planification);
    if (exists.length == 0) return res.status(409).json({ affectedRows: 0, message: "There is no Planification with that id" })
    const deleteWarmUps = await warmupService.deleteWarmUpAttachments(id_planification);
    const deletePhysicalPreparations = await physicalpreparationService.deletePhysicalPreparationAttachments(id_planification);
    const deleteElements = await elementService.deleteAchievementsAttachments(id_planification);
    const result = await planificationService.deletePlanification(id_planification);
    return res.status(200).json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while deleting that planification row:`, err.message);
    next(err);
  }
});


async function getPlanificationInfo(planning_ids) {
  let warmups = [];
  let physicalpreparations = [];
  let elements = [];

  if (planning_ids.length !== 0) {
    warmups = await warmupService.showAllWarmUpsByPlanifications(planning_ids);
    physicalpreparations = await physicalpreparationService.showAllPhysicalPreparationsByPlannifications(planning_ids);
    elements = await elementService.showAllElementsByPlanifications(planning_ids);
  }

  const result = { warmups, physicalpreparations, elements };

  return result;
}




module.exports = router;