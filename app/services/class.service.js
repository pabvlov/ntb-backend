const db = require('./db');
const utils = require('../utils/utils');

async function createClass(start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group) {
    const classId = await db.query(
		`INSERT INTO class (start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group) 
						VALUES ('${ start_date }', '${ end_date }', ${ id_establishment }, ${ id_planification }, ${ id_user_teacher }, ${ teacher_assistence }, ${ id_group })`)
    return classId;
} 

async function getClasses(id_establishment) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group FROM class where id_establishment = ${ id_establishment }`)
	return classes;
}

async function getClassesBetweenDates(id_establishment, start_date, end_date) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group FROM class where id_establishment = ${ id_establishment } and start_date >= '${ start_date }' and end_date <= '${ end_date }'`)
		return classes;
}

async function getClassesByTeacher(id_user_teacher) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group FROM class where id_user_teacher = ${ id_user_teacher }`)
	return classes;
}

async function getClassesByGroup(id_group) {
	const classes = await db.query(
		`SELECT id, start_date, end_date, id_establishment, id_planification, id_user_teacher, teacher_assistence, id_group FROM class where id_group = ${ id_group }`)
	return classes;
}

async function deleteClass(id_class) {
	const classes = await db.query(
		`DELETE FROM class where id = ${ id_class }`)
	return classes;	
}

async function changeClassDate(id_class, start_date, end_date) {
	const classes = await db.query(
		`UPDATE class SET start_date = '${ start_date }', end_date = '${ end_date }' where id = ${ id_class }`)
	return classes;
}

async function changeClassTeacher(id_class, id_user_teacher) {
	const classes = await db.query(
		`UPDATE class SET id_user_teacher = ${ id_user_teacher } where id = ${ id_class }`)
	return classes;
}

async function checkClassExists(id_class) {
	const classes = await db.query(`SELECT id FROM class where id = ${ id_class }`);
	return classes;
}

async function createPlanning() {
	const planning = await db.query(
		`INSERT INTO planification (id) VALUES (null)`);
	return planning;
}

async function attachPlanningToClass(id_planning, id_class)  {
	const update = await db.query(
		`UPDATE class SET id_planification = ${ id_planning } where id = ${ id_class }`);
	return update;
}

async function getAllPlanningAchievements(id_class) {
	const achievements = await db.query(
		`SELECT * FROM achievement where id_class = ${ id_class }`);
	return achievements;
}

async function attachAchievementToPlanning(id_element, id_routine, id_planning, comment) {
	const insert = await db.query(
		`INSERT INTO planification_has_achievements (id_planification, id_element_achievement, id_routine_achievement, comment, id_period) VALUES (${ id_planning }, ${ id_element }, ${ id_routine }, '${ comment }', null)`);
	return insert;
}

async function achievementExists(id_element, id_planning) {
	const achievements = await db.query(
		`SELECT * FROM planification_has_achievements where id_element_achievement = ${ id_element } and id_planification = ${ id_planning }`);
	return achievements;
}

async function showPlanningAchievements(plannings) {
		
    return await db.query(`select pa.id_planification, e.id as id_element, e.name as element_name, e.video as element_video, e.image as element_image, e.difficulty, a.name as apparatus, a.gender from planification_has_achievements pa
        join planification p on p.id = pa.id_planification
        left join element e on e.id = pa.id_element_achievement
        left join routine r on r.id = pa.id_routine_achievement
		join apparatus a on a.id = e.id_apparatus
where pa.id_planification in (${ utils.arrayToText(plannings) });`)
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
	createPlanning,
	attachPlanningToClass,
	getAllPlanningAchievements,
	attachAchievementToPlanning,
	achievementExists,
	showPlanningAchievements
}