const crypto = require('crypto');
const db = require('./db');
const helper = require('../../config/helper.js');

async function validateLogin(mail, password) {
    const userSalt = await db.query(`SELECT salt FROM user where mail = '${mail}'`);
    if (userSalt[0].salt == null || userSalt[0].salt == undefined) {
        return { ok: true, message: 'El usuario no existe en nuestra base de datos' }
    } else {
        const sha256Hasher = crypto.createHmac("sha256", userSalt[0].salt)
        const hash = sha256Hasher.update(password, "utf8").digest("base64")
        const login = await db.query(`select *
        FROM user u
        WHERE u.mail = '${mail}' and u.password = '${hash}'`);
        if (login.length === 0) {
            return { ok: false, message: 'La contraseña es incorrecta' }
        } else return { ok: true, content: login };
    }
}


async function validateMail(mail) {
    const fullname = await db.query(`SELECT name, lastname, mail FROM user where mail = '${mail}'`);

    if (fullname.length > 0) {
        
        if (fullname[0].mail === mail) return true;
        else return false;
    } else return false;
}

async function createUser(mail, nickname, name, lastname, gender, birthdate, password, contact) {
    const salt = helper.generateRandomString(6)
    const sha256Hasher = crypto.createHmac("sha256", salt)
    const hash = sha256Hasher.update(password, "utf8").digest("base64");

    const create = await db.query(`INSERT INTO user (id, mail, nickname, name, lastname, gender, contact, birthdate, password, salt) 
                                        VALUES 
                                            (null, '${mail}', '${nickname}', '${name}', '${lastname}', '${gender}', ${contact}, '${birthdate}', '${hash}', '${salt}');`)
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.error(err)
            return false;
        })
    return create;
}



module.exports = {
    validateLogin,
    validateMail,
    createUser,
}

/* 

{
    "rut": "20482869",
    "dv": "5",
    "nombres": "Pablo Javier",
    "apellidos": "Prieto Cepeda",
    "mail": "pablojavierprietocepeda@gmail.com",
    "password": "1q2w3e4r"
}

*/