const db = require('./db');
const utils = require('../utils/utils');

async function getAllElements(apparatuses) {
	if (apparatuses === undefined || apparatuses === null) {
		const communities = await db.query(
			`select 
				e.id, e.name, e.image, e.difficulty, a.name as apparatus, a.id as id_apparatus, a.image as apparatus_image, a.gender as apparatus_gender from element e
			left join apparatus a on e.id_apparatus = a.id`)
		return communities;
	}
    const communities = await db.query(
		`select 
				e.id, e.name, e.image, e.difficulty, a.name as apparatus, a.id as id_apparatus, a.image as apparatus_image, a.gender as apparatus_gender from element e
		left join apparatus a on e.id_apparatus = a.id
			where e.id_apparatus in (${ utils.arrayToText(apparatuses) });`)
    return communities;
} 

async function getAllElementsConnections(apparatuses) {
	if (apparatuses === undefined || apparatuses === null) {
		const communities = await db.query(
			`select 
					eee.id as id_element, 
					eee.name, 
					ee.image, 
					ee.id as id_element_connection, 
					ee.name as element_connection_name, 
					eee.image as element_connection_image,
					e.difficulty as difficulty,
					a.id as id_apparatus, 
					a.name as apparatus,
					a.image as apparatus_image
			from element_connection e
			left join element ee on e.id_element_connection = ee.id
			left join element eee on e.id_element = eee.id
			left join apparatus a on ee.id_apparatus = a.id`)
		return communities;
	}
	const communities = await db.query(
		`select 
				eee.id as id_element, 
				eee.name, 
				ee.image, 
				ee.id as id_element_connection, 
				ee.name as element_connection_name, 
				eee.image as element_connection_image,
				e.difficulty as difficulty,
				a.name as apparatus 
		from element_connection e
		left join element ee on e.id_element_connection = ee.id
		left join element eee on e.id_element = eee.id
		left join apparatus a on ee.id_apparatus = a.id
		where eee.id_apparatus in (${ utils.arrayToText(apparatuses) });`)
	return communities;
}

async function createElement(name, video, image, difficulty, id_apparatus) {
	const communities = await db.query(
		`INSERT INTO element (name, video, image, difficulty, id_apparatus) VALUES ('${name}', '${video}', '${image}', '${difficulty}', ${id_apparatus})`)
	return communities;
}

async function checkElementExists(name, id_apparatus) {
	const element = await db.query(
		`SELECT * FROM element where name = '${name}' and id_apparatus = ${id_apparatus}`)
	return element;
}

async function deleteElement(id_element) {
	const communities = await db.query(
		`DELETE FROM element where id = ${id_element}`)
	return communities;	
}

async function getApparatus() {
	const communities = await db.query(
		`SELECT * FROM apparatus`)
	return communities;
}

async function attachElement(id_element, id_element_connection, difficulty) {
	const communities = await db.query(
		`INSERT INTO element_connection (id_element, id_element_connection, difficulty) VALUES (${id_element}, ${id_element_connection}, '${difficulty}')`)
	return communities;
}

async function checkAttachmentExists(id_element, id_element_connection) {
	const element = await db.query(
		`SELECT * FROM element_connection where id_element = ${id_element} and id_element_connection = ${id_element_connection}`)
	return element;
}

async function detachElement(id_element, id_element_connection) {
	const communities = await db.query(
		`DELETE FROM element_connection where id_element = ${id_element} and id_element_connection = ${id_element_connection}`)
	return communities;
}

async function attachElementsToPlanification(id_planification, elements) {
	let query = `INSERT INTO planification_has_achievements (id_planification, id_element_achievement) VALUES `;
	elements.forEach(e => {
		query += `(${ id_planification }, ${ e }),`
	});
	query = query.slice(0, -1);
	return await db.query(query);
}

async function showAllElementsByPlanifications(planifications) {
	return await db.query(`select p.id as id_planification, e.name as element_achievement from planification_has_achievements cpp
		join planification p on p.id = cpp.id_planification
		join element e on e.id = cpp.id_element_achievement
	where p.id in (${ utils.arrayToText(planifications) });`);
}

async function deleteAchievementsAttachments(id_planification) {
	return await db.query(`DELETE FROM planification_has_achievements where id_planification = ${ id_planification }`)
}
/* changeImage(id_element, req.file.filename) */
async function changeImage(id_element, image) {
	const communities = await db.query(
		`UPDATE element SET image = '${image}' where id = ${id_element}`)
	return communities;
}

async function changeVideo(id_element, video) {
	const communities = await db.query(
		`UPDATE element SET video = '${video}' where id = ${id_element}`)
	return communities;
}

module.exports = {
    createElement,
	getAllElements,
	deleteElement,
	getAllElementsConnections,
	checkElementExists,
	getApparatus,
	attachElement,
	checkAttachmentExists,
	detachElement,
	attachElementsToPlanification,
	showAllElementsByPlanifications,
	deleteAchievementsAttachments,
	changeImage,
	changeVideo
}