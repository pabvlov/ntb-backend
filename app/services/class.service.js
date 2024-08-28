const db = require('./db');

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
	const classes = await db.query(`SELECT id FROM class where id = ${ id_class }`)
	return classes;
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
	checkClassExists
}