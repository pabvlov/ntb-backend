const jwt = require('jsonwebtoken')
require('dotenv').config()

const generarJWT = ( userInfo ) => {
    const payload = userInfo;
    console.log(jwt.decode(payload));
    
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '23h'
        }, (err, token) => {
            if(err){ reject(err) }
            else { 
                resolve(token)
            }
        })
    })
}

const validarJWT = ( token ) => {
    console.log(jwt.verify(token, process.env.SECRET_JWT_SEED) + "holi");
    
    return userInfo = jwt.verify(token, process.env.SECRET_JWT_SEED)
}

module.exports = {
    generarJWT,
    validarJWT
}