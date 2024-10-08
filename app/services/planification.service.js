const db = require('./db');
const utils = require('../utils/utils');

async function createPlanning(name, id_establishment) {
	let query;

	if( name === undefined || name === null ) {
		query = `INSERT INTO planification (id_establishment) VALUES (${ id_establishment })`;
	} else {
		query = `INSERT INTO planification (name, id_establishment) VALUES ('${ name }', ${ id_establishment })`;
	}

	const planning = await db.query( query );
	return planning;
}

async function getAllPlanningAchievements(id_class) {
	const achievements = await db.query(
		`SELECT * FROM achievement where id_class = ${ id_class }`);
	return achievements;
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

async function attachPlanification(id_class, id_planification) {
	const update = await db.query(
		`UPDATE class SET id_planification = ${ id_planification } where id = ${ id_class }`);
	return update;
}

async function attachAchievementToPlanning(id_element, id_routine, id_planning, comment) {
	const insert = await db.query(
		`INSERT INTO planification_has_achievements (id_planification, id_element_achievement, id_routine_achievement, comment, id_period) VALUES (${ id_planning }, ${ id_element }, ${ id_routine }, '${ comment }', null)`);
	return insert;
}

async function showPlanification(id_establishment) {
    const planning = await db.query(
        `SELECT * FROM planification 
        where id_establishment = ${ id_establishment }`);
    return planning;
}

async function checkPlanificationExists(id_planification) {
	const planning = await db.query(
		`SELECT * FROM planification where id = ${ id_planification }`);
	return planning;
}

async function deletePlanification(id_planification) {
	const deletePlanification = await db.query(
		`DELETE FROM planification where id = ${ id_planification }`);
	return deletePlanification;
}

module.exports = {
    createPlanning,
    getAllPlanningAchievements,
    achievementExists,
    showPlanningAchievements,
    attachPlanification,
    attachAchievementToPlanning,
    showPlanification,
	checkPlanificationExists,
	deletePlanification
}