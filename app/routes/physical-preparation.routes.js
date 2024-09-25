const express = require('express');
const router = express.Router();
const physicalpreparationServices = require('../services/physical-preparation.service.js');

router.post('/physicalpreparation/create', async function (req, res, next) {
  try {
    const { name } = req.body;
    const exists = await physicalpreparationServices.checkPhysicalPreparationExists(name);
    if(exists.length !== 0) return res.status(409).json({ affectedRows: 0, message: "There is already a Physical Preparation with that name"})
    const result = await physicalpreparationServices.createPhysicalPreparation(name, id_element_for);
    return res.status(200).json({ id_physical_preparation: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while posting that physical preparations row:`, err.message);
    next(err);
  }
});

router.delete('/physicalpreparation/delete', async function (req, res, next) {
  try {
    const { id_physical_preparation } = req.query;
    const exists = await physicalpreparationServices.checkPhysicalPreparationExistsById(id_physical_preparation);
    if(exists.length == 0) return res.status(409).json({ affectedRows: 0, message: "There is no Physical Preparation with that id"})
    const result = await physicalpreparationServices.deletePhysicalPreparation(id_physical_preparation);
    return res.status(200).json({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error(`Error while deleting that physical preparation row:`, err.message);
    next(err);
  }
});

router.get('/physicalpreparation/show', async function (req, res, next) {
  try {
      const { id_classes } = req.body;
      const result = await physicalpreparationServices.showAllPhysicalPreparations();
      return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing those physical preparations:`, err.message);
    next(err);
  }
})

router.get('/physicalpreparation/showByClass', async function (req, res, next) {
  try {
    
    if (req.body != null) {
      const result = await physicalpreparationServices.showAllPhysicalPreparationsByClasses(req.body);
      return res.status(200).json(result);
    } else return res.status(409).json({ message: "You need to provide a class id"})
    
  } catch (err) {
    console.error(`Error while showing those physical preparations:`, err.message);
    next(err);
  }
})



module.exports = router;