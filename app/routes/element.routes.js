const express = require('express');
const router = express.Router();
const elementService = require('../services/element.service.js');
const elementMapper = require('../mapping/element.mapping.js');

router.get('/elements', async function (req, res, next) {
  try {
    const { id_apparatus } = req.query;
    const elements = await elementService.getAllElements(id_apparatus);
    const elementsConnections = await elementService.getAllElementsConnections(id_apparatus);
    if (elements.length === 0) {
      return res.status(404).json({ message: 'No elements found' });
    }
    return res.status(200).json(elementMapper.mapElementComposed(elements, elementsConnections));
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.post('/element/create', async function (req, res, next) {
  try {
    const { name, video, image, difficulty, id_apparatus } = req.body;
    const exists = await elementService.checkElementExists(name);
    
    
    if (!name || !video || !image || !difficulty || !id_apparatus) {
      return res.status(400).json({ message: 'Missing parameters' });
    } 
    if (exists.length > 0) {
      return res.status(409).json({ message: 'Element already exists' });
    }
    const element = await elementService.createElement(name, video, image, difficulty, id_apparatus);
    return res.status(200).json({ id_element: element.insertId, affectedRows: element.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/element/delete', async function (req, res, next) {
  try {
    const { id_element } = req.body;
    const groupId = await elementService.deleteElement(id_element);
    return res.status(200).json({ affectedRows: groupId.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});


module.exports = router;