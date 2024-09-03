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

async function getAthletesByEstablishment(id_establishment) {
    const response = await db.query(`select 	a.id as athlete_id,
							a.name as athlete_name,
							a.lastname as athlete_lastname,
							a.birthdate as athlete_birthdate,
							a.image as athlete_image,
                            ea.active,
							w.identifier as work_line,
							u.id as client_id,
							u.mail as client_mail,
							u.contact as client_contact,
							u.name as client_name,
							u.lastname as client_lastname,
							u.birthdate as client_birthdate
			from athlete_establishment ea 
				left join athlete a on ea.id_athlete = a.id
				left join user u on a.id_user_in_charge = u.id
				left join workline w on a.id_workline = w.id
			where ea.id_establishment = ${ id_establishment };`);
    return response;
}

async function createAthlete(name, lastname, birthdate, id_workline, id_user_in_charge) {
    return await db.query(`INSERT INTO athlete (name, lastname, birthdate, id_workline, id_user_in_charge, image) VALUES ('${name}', '${lastname}', STR_TO_DATE('${birthdate}', '%d-%m-%Y'), ${id_workline}, ${id_user_in_charge}, null)`)
}

async function attachAthleteToEstablishment(id_athlete, id_establishment, active) {
    return await db.query(`INSERT INTO athlete_establishment (id_athlete, id_establishment, active) VALUES (${id_athlete}, ${id_establishment}, ${active})`)
}


module.exports = {
    getUsers,
    getUserByMail,
    uploadImage,
    getImage,
    updateUser,
    getCommunitiesByAthleteId,
    getAthletesByEstablishment,
    createAthlete,
    attachAthleteToEstablishment
}