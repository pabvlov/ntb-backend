const db = require('./db');
const utils = require('../utils/utils');

async function createGroup(name, id_difficulty_category, id_establishment) {
	const communities = await db.query(
		`INSERT INTO gymnastics.group (name, id_difficulty_category, id_establishment) VALUES ('${name}', ${id_difficulty_category}, ${id_establishment})`)
	return communities;
}

async function insertAthleteIntoGroup(id_group, id_athlete) {
	const communities = await db.query(
		`INSERT INTO gymnastics.group_has_athletes (id_group, id_athlete) VALUES (${id_group}, ${id_athlete})`)
	return communities;
}

async function getGroupsWithAthletes(id_community) {
	const groups = await db.query(
		`select 
			gr.id as group_id,
			gr.name as group_name,  
			dc.name as difficulty,
			a.id as athlete_id,
			CONCAT(a.name, " ", a.lastname) as athlete,
			a.image as athlete_image,
			e.id as establishment_id
		from gymnastics.group_has_athletes ga
			join gymnastics.group gr on ga.id_group = gr.id
			join gymnastics.athlete a on ga.id_athlete = a.id
			join gymnastics.difficulty_category dc on gr.id_difficulty_category = dc.id
			join gymnastics.establishment e on gr.id_establishment = e.id
			join gymnastics.community co on e.id_community = co.id
		where co.id = ${id_community}`)
	return groups;
}

async function getGroupsWithAthletesById(id_establishment, id_group) {
	const groups = await db.query(
		`select 
			gr.id as group_id,
			gr.name as group_name,  
			dc.name as difficulty,
			a.id as athlete_id,
			CONCAT(a.name, " ", a.lastname) as athlete,
			a.image as athlete_image
		from gymnastics.group_has_athletes ga
			join gymnastics.group gr on ga.id_group = gr.id
			join gymnastics.athlete a on ga.id_athlete = a.id
			join gymnastics.difficulty_category dc on gr.id_difficulty_category = dc.id
		where gr.id_establishment = ${id_establishment} and gr.id_group = ${id_group}`)
	return groups;
}


async function checkExistsAthleteInGroup(id_group, id_athlete) {
	const groups = await db.query(
		`select * from gymnastics.group_has_athletes where id_group = ${id_group} and id_athlete = ${id_athlete}`)
	return groups;
}

async function getGroups(id_community) {
	const groups = await db.query(
		`select 
			g.id, 
			g.name, 
			dc.name as difficulty_category ,
			e.id as establishment_id
		from gymnastics.group g
			join difficulty_category dc on dc.id = g.id_difficulty_category 
			join establishment e on e.id = g.id_establishment
			join community c on c.id = e.id_community
		where c.id = ${id_community}`)
	return groups;
}

async function getDifficulties() {
	const difficulties = await db.query(
		`select * from gymnastics.difficulty_category`)
	return difficulties;
}


module.exports = {
	createGroup,
	insertAthleteIntoGroup,
	getGroupsWithAthletes,
	getGroups,
	checkExistsAthleteInGroup,
	getGroupsWithAthletesById,
	getDifficulties
}