const db = require('./db');

async function getBannersByCommunity(id) {
    const communities = await db.query(
		`SELECT 
						cc.id as id_content,
						cc.url,
						e.id as id_establishment,
						u.id as id_user,
						u.name as user_name,
						u.lastname as user_lastname,
						u.mail as user_mail,
						cc.description
					FROM content cc
					INNER JOIN establishment e on cc.id_establishment = e.id
					INNER JOIN community c on c.id = e.id_community
					INNER JOIN user u on u.id = cc.id_user
	where c.id = ${ id } AND cc.type = 1`)
    return communities;
} 

async function uploadImage(imgName, id_content) {
	return await db.query(`UPDATE content SET url = "${ imgName }" AND id = ${ id_content }`)
}

async function uploadContent(id_establishment, description, type, id_user, url) {
	/* Chile's Date */
	const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	return await db.query(`INSERT INTO content (id_establishment, description, type, id_user, url, date) VALUES (${ id_establishment }, '${ description }', ${ type }, ${ id_user }, '${ url }', '${ date }')`)
}

async function uploadContentAttachment(id_content, id_community) {
	return await db.query(`INSERT INTO community_content (id_content, id_community) VALUES (${ id_content }, ${ id_community })`)
}

async function getCommentsByCommunity(id) {
	const comments = await db.query(
		`SELECT 
				cc.id as id_content,
				cc.url,
				u.id as id_user,
				u.name as user_name,
				u.lastname as user_lastname,
				u.mail as user_mail,
				cc.description,
				cc.date
			FROM content cc
			INNER JOIN user u on u.id = cc.id_user
			INNER JOIN community_content ccc on ccc.id_content = cc.id
		WHERE ccc.id_community = ${ id } AND cc.type = 2`)
	return comments;
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

async function deleteContent(id) {
	let content = await db.query(`SELECT * FROM community_content WHERE id_content = ${id}`)
	if (content.length === 0) {
		return await db.query(`DELETE FROM content WHERE id = ${id}`)
	} else {
		await db.query(`DELETE FROM community_content WHERE id_content = ${id}`)
		return await db.query(`DELETE FROM content WHERE id = ${id}`)
	}
}


module.exports = {
    getBannersByCommunity,
	getCommunityUsers,
	getEstablishmentsByCommunity,
	getRoles,
	getRolesByEstablishment,
	uploadImage,
	uploadContent,
	deleteContent,
	uploadContentAttachment,
	getCommentsByCommunity
}