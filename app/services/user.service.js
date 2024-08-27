const db = require('./db');

async function getUsers(){
    return await db.query(`SELECT u.rut, u.dv, u.mail, u.nombres, u.apellidos FROM usuario u;`);
}

async function getUserByMail(mail) {
    if(!!mail) return await db.query(`select * 
    FROM user u
    WHERE u.mail = '${ mail }' LIMIT 1;`)
}

async function uploadImage(imgName, rut) {
    return await db.query(`UPDATE usuario SET foto = "${ imgName }" WHERE rut = "${ rut }"`)
}

async function getImage(rut) {
    return await db.query(`SELECT foto FROM usuario WHERE rut = "${ rut }"`)
}

async function updateUser(user) {
    
    const rut = user.rut.split('-')[0]
    const dv = user.rut.split('-')[1]
    return await db.query(`UPDATE usuario SET mail = "${ user.mail }", nombres = "${ user.nombres }", apellidos = "${ user.apellidos }", direccion = "${ user.direccion }", fecha_nacimiento = "${ user.fecha_nacimiento }" WHERE rut = "${ rut }"`)
}

async function getCommunitiesByAthleteId(id) {
    const communities = await db.query(`SELECT
            ae.id_athlete,
            ae.id_establishment,
            e.address,
            e.NAME AS establishment_name,
            e.id_community,
            c.razon_social,
            c.acronym,
            c.logo,
            c.contact,
            c.instagram,
            c.facebook
        FROM
            athlete_establishment ae
            JOIN establishment e ON e.id = ae.id_establishment
            JOIN community c ON c.id = e.id_community 
        WHERE
            ae.id_athlete = ${id} 
            AND ae.active = 1;`)
    return communities;
} 


module.exports = {
    getUsers,
    getUserByMail,
    uploadImage,
    getImage,
    updateUser,
    getCommunitiesByAthleteId,
}