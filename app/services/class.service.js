const db = require('./db');
const utils = require('../utils/utils')

async function createClass(start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group, id_period, date_period_end) {
	if (id_period == 0) {
		const classId = await db.query(
			`INSERT INTO class (start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group) 
							VALUES ('${start_date}', '${end_date}', ${id_establishment}, ${id_planification}, ${id_user_teacher}, ${teacher_assistence}, ${id_group})`)
		return classId;
	} else {
		const classId = await db.query(
			`INSERT INTO class (start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group, id_period, date_period_end) 
							VALUES ('${start_date}', '${end_date}', ${id_establishment}, ${id_planification}, ${id_user_teacher}, ${teacher_assistence}, ${id_group}, ${id_period}, '${date_period_end}')`)
		return classId;
	}
}

async function getClasses(id_establishment) {
	const classes = await db.query(
		`SELECT c.id, 
				c.start_date, 
				c.end_date, 
				c.id_establishment, 
				c.id_planification, 
				c.id_user_teacher, 
				c.teacher_assistence, 
				c.id_group,
				c.id_period,
				c.date_period_end,
				u.name as teacher_name,
				u.lastname as teacher_lastname
			FROM class c
			join user u on u.id = c.id_user_teacher
			where id_establishment = ${id_establishment}
			ORDER BY TIME(start_date) asc`)
	return classes;
}

async function getClassesBetweenDates(id_establishment, start_date, end_date) {
	const classes = await db.query(
		`SELECT c.id, 
				c.start_date, 
				c.end_date, 
				c.id_establishment, 
				c.id_planification, 
				c.id_user_teacher, 
				c.teacher_assistence, 
				c.id_group,
				c.id_period,
				c.date_period_end,
				u.name as teacher_name,
				u.lastname as teacher_lastname
			FROM class c
			join user u on u.id = c.id_user_teacher
			where id_establishment = ${id_establishment} and start_date >= '${start_date}' and end_date <= '${end_date}'`)
	return classes;
}
// 0 = no period, 1 = daily, 2 = weekly same day
async function getTodayClasses(id_community) {

	let today = new Date().toLocaleDateString('es-CL').slice(0, 10);
	/* format YYYY-MM-DD */
	today = today.split('-').reverse().join('-');

	const classes = await db.query(
		`SELECT 
			c.id, 
			c.start_date, 
			c.end_date, 
			c.id_establishment, 
			c.id_planification, 
			c.id_user_teacher, 
			c.teacher_assistence, 
			c.id_group,
			c.id_period,
			c.date_period_end,
			u.name as teacher_name,
			u.lastname as teacher_lastname
		FROM 
			class c
		JOIN 
			user u ON u.id = c.id_user_teacher
		JOIN
			establishment e ON e.id = c.id_establishment
		JOIN
			community co ON co.id = e.id_community
		LEFT JOIN 
			period p ON p.id = c.id_period
		WHERE 
			co.id = ${id_community}
			AND (
				-- Clases que se repiten semanalmente el mismo día (id_period = 2)
				(c.id_period = 2 AND DAYOFWEEK(STR_TO_DATE('${today}','%Y-%m-%d')) = DAYOFWEEK(c.start_date))
				OR 
				-- Clases específicas creadas para el día de hoy
				(STR_TO_DATE(c.start_date,'%Y-%m-%d') = STR_TO_DATE('${today}','%Y-%m-%d'))
				OR
				-- Clases que se repiten todos los días
				(c.id_period = 1)				
    		)
		ORDER BY TIME(start_date) asc;`
		);
	return classes;
}

async function presences(classes_ids) {
	const presence = await db.query(
		`SELECT * FROM athlete_presence where id_class IN (${classes_ids.map(c => c.id).join(',')})`)
	return presence;
}

async function createAthletePresence(id_class, athlete_ids) {
	const chileDateTime = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() 

	const result = await db.query(
		`INSERT INTO athlete_presence (id_class, id_athlete, date) VALUES ${athlete_ids.map(a => `(${id_class}, ${a.id}, CURDATE())`).join(',')}`
	)
	return result;
}

async function getClassesByTeacher(id_user_teacher) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group, c.id_period FROM class where id_user_teacher = ${id_user_teacher}`)
	return classes;
}

async function getClassesByGroup(id_group) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group FROM class where id_group = ${id_group}`)
	return classes;
}

async function deleteClass(id_class) {
	const classes = await db.query(
		`DELETE FROM class where id = ${id_class}`)
	return classes;
}

async function changeClassDate(id_class, start_date, end_date) {
	const classes = await db.query(
		`UPDATE class SET start_date = '${start_date}', end_date = '${end_date}' where id = ${id_class}`)
	return classes;
}

async function changeClassTeacher(id_class, id_user_teacher) {
	const classes = await db.query(
		`UPDATE class SET id_user_teacher = ${id_user_teacher} where id = ${id_class}`)
	return classes;
}

async function checkClassExists(id_class) {
	const classes = await db.query(`SELECT id FROM class where id = ${id_class}`);
	return classes;
}

async function attachPlanificationToClasses(classes, id_planification) {
	let query = `UPDATE class SET id_planification = ${id_planification} WHERE id IN (`;
	classes.forEach(c => {
		query += `${c.id},`;
	});
	query = query.slice(0, -1);
	query += ')';
	const result = await db.query(query);
	
	return result;
}

module.exports = {
	createClass,
	getClasses,
	deleteClass,
	changeClassDate,
	changeClassTeacher,
	getClassesBetweenDates,
	getClassesByTeacher,
	getClassesByGroup,
	checkClassExists,
	getTodayClasses,
	attachPlanificationToClasses,
	presences,
	createAthletePresence
}