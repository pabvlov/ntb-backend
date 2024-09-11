const db = require('./db');

async function getAllElements(id_apparatus) {
	if (id_apparatus === undefined || id_apparatus === null) {
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
			where e.id_apparatus = ${id_apparatus}`)
    return communities;
} 

async function getAllElementsConnections(id_apparatus) {
	if (id_apparatus === undefined || id_apparatus === null) {
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
		where eee.id_apparatus = ${id_apparatus}`)
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

module.exports = {
    createElement,
	getAllElements,
	deleteElement,
	getAllElementsConnections,
	checkElementExists,
	getApparatus,
	attachElement,
	checkAttachmentExists,
	detachElement
}