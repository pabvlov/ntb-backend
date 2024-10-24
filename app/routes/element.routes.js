const express = require('express');
const router = express.Router();
const elementService = require('../services/element.service.js');
const elementMapper = require('../mapping/element.mapping.js');
const multer = require('multer');
const path = require('path');

// Usar path para resolver rutas correctamente
const storageEngineProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../app/images/elements')); // Ajustamos la ruta con path
  },
  filename: (req, file, cb) => {
    cb(null, `element-ntb-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngineProfile,
  limits: { fileSize: 100000000 }, // Límite de 100MB
});

router.post('/element/image/upload', upload.single("file"), (req, res, next) => {
  try {
    let { id_element } = req.body;
    if (req.file) {
      /* discrimine if image or video for 
      let image = elementService.changeImage(id_element, req.file.filename);
      let image = elementService.changeVideo(id_element, req.file.filename);
      */
      console.log(req.file.mimetype);
      let image;
      if (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/gif' || req.file.mimetype === 'image/webp') {
        image = elementService.changeImage(id_element, req.file.filename);
      } else {
        image = elementService.changeVideo(id_element, req.file.filename);
      }
      

      res.json({
        affectedRows: image.affectedRows,
        image: req.file.filename
      });
    } else {
      res.status(400).json({
        affectedRows: image.affectedRows,
        message: "No file uploaded, please upload a valid one",
      });
    }
  } catch (err) {
    console.error(`Error while uploading image: `, err.message);
    next(err);
  }
});

router.post('/elements', async function (req, res, next) {
  try {
    const { apparatuses } = req.body;
    const elements = await elementService.getAllElements(apparatuses);
    const elementsConnections = await elementService.getAllElementsConnections(apparatuses);
    if (elements.length === 0) {
      return res.status(404).json({ message: 'No elements found' });
    }
    return res.status(200).json(elementMapper.mapElementComposed(elements, elementsConnections, apparatuses));
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.post('/element/create', upload.single("file"), async function (req, res, next) {
  try {
    const { name, video, image, difficulty, id_apparatus } = req.body;
    const exists = await elementService.checkElementExists(name, id_apparatus);
    
    if (req.file) {
      let image = elementService.changeImage(id_element, );
    }
    if (!name || !video || !image || !difficulty || !id_apparatus) {
      return res.status(400).json({ message: 'Missing parameters' });
    } 
    if (exists.length > 0) {
      return res.status(409).json({ message: 'Element already exists' });
    }
    if (req.file.filename != null || req.file.filename != undefined) {
      const element = await elementService.createElement(name, video, image, difficulty, id_apparatus);
    } else {
      const element = await elementService.createElement(name, video, image, difficulty, id_apparatus);
    }
    
    return res.status(200).json({ id_element: element.insertId, affectedRows: element.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/element/delete', async function (req, res, next) {
  try {
    const { id_element } = req.query;
    const groupId = await elementService.deleteElement(id_element);
    return res.status(200).json({ affectedRows: groupId.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.post('/element/attach', async function (req, res, next) {
  try {
    const { id_element, id_element_connection, difficulty } = req.body;
    if (!id_element || !id_element_connection || !difficulty) {
      return res.status(400).json({ message: 'Missing parameters' });
    }
    checkAttachmentExists = await elementService.checkAttachmentExists(id_element, id_element_connection);
    if (checkAttachmentExists.length > 0) {
      return res.status(409).json({ message: 'Element already attached' });
    }
    const element = await elementService.attachElement(id_element, id_element_connection, difficulty);
    return res.status(200).json({ affectedRows: element.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.delete('/element/detach', async function (req, res, next) {
  try {
    const { id_element, id_element_connection } = req.query;
    const element = await elementService.detachElement(id_element, id_element_connection);
    return res.status(200).json({ affectedRows: element.affectedRows });
  } catch (err) {
    console.error(`Error while getting that auth service:`, err.message);
    next(err);
  }
});

router.get('/apparatus/show', async function (req, res, next) {
  try {
    const result = await elementService.getApparatus();
    return res.status(200).json(result);
  } catch (err) {
    console.error(`Error while showing those elements:`, err.message);
    next(err);
  }
});


module.exports = router;