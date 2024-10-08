const express = require('express');
const router = express.Router();
const auth = require('../services/auth.service.js');
const mailing = require('../services/mail.service.js');
const { generarJWT, validarJWT } = require('../utils/jwt');

router.post('/auth/login', async function (req, res, next) {
  try {
    const { mail, password } = req.body;
    const validareResponse = await auth.validateLogin(mail, password);
    let count = 0;
    for (var row in validareResponse.content) count++;
    if (count === 1) {
      if (!validareResponse.ok) {
        return res.status(401).json({
          ok: false,
          message: 'Hubo un error',
        })
      }
      // destructuring
      const userInfo = validareResponse.content[0];
      // regenerar jwt con datos nuevos
      const token = await generarJWT(userInfo)
      return res.status(202).json({
        ok: true,
        content: {
          user: userInfo,
          token
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

router.post('/auth/register', async function (req, res, next) {
  try {
    const { mail, nickname, name, lastname, gender, password, contact, birthdate } = req.body;
    const userExists = await auth.validateMail(mail, password)
    if (!userExists) {
      await auth.createUser(mail, nickname, name, lastname, gender, birthdate, password, contact).then(async sentence => {
        if( sentence ) {
          await mailing.sendMail(mail, 'Registro exitoso', 'Bienvenido a la plataforma de Pablo')
          return res.status(202).json({
            ok: true,
            message: 'Usuario creado con éxito'
          })
        } else {
          return res.status(200).json({
            ok: false,
            message: 'Error al crear usuario'
          })
        }
        
      }).catch((err) => {
        console.error(err)
        return
      })
      
      
    } else {
      return res.status(200).json({
        ok: false,
        message: 'El correo que usted especificó ya está registrado'
      })
    }
  } catch (err) {
    console.error(`Error while getting that auth service: `, err.message);
    next(err);
  }
});

router.post('/auth/renew', async function (req, res, next) {
  try {
    const { token } = req.body
    if (!token) return res.status(200).json({
      ok: false,
      message: 'Error en el token: ' + res
    })

    try {
      const userInfo = validarJWT(token)
      return res.status(201).json({
        ok: true,
        content: {
          user: userInfo,
          token
        }
      })
    } catch (error) {
      return res.status(200).json({
        ok: false,
        message: 'Token no valido: ' + error
      })
    }
  } catch (err) {
    console.error(`Error while getting that auth service `, err.message);
    next(err);
  }
});

router.post('/auth/regenerate', async function (req, res, next) {
  try {
    const { token } = req.body
    if (!token) res.status(200).json({
      ok: false,
      message: 'No existe token'
    })
    try {
      const userInfo = validarJWT(token)
      const rows = await user.getUserByMail(userInfo.mail)
      if (rows.length > 0) {
        if (!rows[0]) {
          return res.status(401).json({
            ok: false,
            message: 'Hubo un error',
          })
        } else {
          const userInfoNew = rows[0];
          // regenerar jwt con datos nuevos
          const token = await generarJWT(userInfoNew)
          return res.status(202).json({
            ok: true,
            content: {
              user: rows[0],
              token
            }
          })
        }
      } else {
        return res.status(400).json({
          ok: false,
          message: "No existe un usuario con ese rut"
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        ok: false,
        message: 'Token no valido: ' + error
      })
    }
  } catch (err) {
    console.error(`Error while getting that auth service `, err.message);
    next(err);
  }
});

module.exports = router;