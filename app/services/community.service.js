const db = require('./db');

async function getBannersByCommunity(id) {
    const communities = await db.query(
		`SELECT 
						cc.url,
						e.id as id_establishment,
						a.id as id_athlete,
						a.name as athlete_name,
						a.lastname as athlete_lastname,
						cc.description
					FROM content cc
					INNER JOIN establishment e on cc.id_establishment = e.id
					INNER JOIN community c on c.id = e.id_community
					inner join athlete_establishment ae on ae.id_establishment = e.id
					INNER JOIN athlete a on a.id = ae.id_athlete
	where c.id = ${ id } AND cc.type = 1`)
    return communities;
} 

async function getEstablishmentsByCommunity(id) {
	const establishments = await db.query(
		`SELECT 
				e.id as id_establishment,
				e.name as establishment_name,
				e.address,
				e.capacity,
				c.razon_social,
				c.acronym,
				c.logo,
				c.contact,
				c.instagram,
				c.facebook,
				c.description,
				c.slogan
			FROM establishment e
			INNER JOIN community c ON c.id = e.id_community
		WHERE c.id = ${ id }`)
	return establishments;
}

async function getCommunityUsers(id) {
	const users = await db.query(
		`SELECT 
				ae.id_athlete, 
				ae.id_establishment,
				a.name as athlete_name, 
				a.lastname as athlete_lastname,
				a.birthdate,
				a.image
			FROM athlete_establishment ae 
			INNER JOIN athlete a ON a.id = ae.id_athlete
			INNER JOIN establishment e ON e.id = ae.id_establishment
			INNER JOIN community c ON c.id = e.id_community
		WHERE c.id = ${ id }`)
	return users;
}

async function getRoles() {
    return await db.query(`SELECT * FROM roles`)
}

async function getRolesByEstablishment(id_community) {
    return await db.query(`SELECT ur.mail_user, ur.id_establishment, r.id as id_role, r.role, u.name, u.lastname, u.nickname FROM user_has_roles ur
        join roles r on r.id = ur.id_role
        join user u on u.mail = ur.mail_user
		join establishment e on e.id = ur.id_establishment
		join community co on co.id = e.id_community
        WHERE co.id = ${id_community}`)
}


module.exports = {
    getBannersByCommunity,
	getCommunityUsers,
	getEstablishmentsByCommunity,
	getRoles,
	getRolesByEstablishment
}