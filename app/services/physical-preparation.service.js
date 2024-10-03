const db = require('./db')
const utils = require('../utils/utils')

async function createPhysicalPreparation(name) {
    return await db.query(`INSERT INTO gymnastics.physical_preparation (name) VALUES ('${ name }')`)
}

async function attachPhysicalPreparationToClass(id_planification, id_physical_preparation, quantity, id_quantity_type) {
    return await db.query(`INSERT INTO planification_has_physical_preparation (id_planification, id_physical_preparation, quantity, id_quantity_type) VALUES (${ id_planification }, ${ id_physical_preparation }, ${ quantity }, ${ id_quantity_type })`)
}

async function existsPhysicalPreparationAttachment(id_planification, id_physical_preparation) {
    return await db.query(`SELECT * FROM planification_has_physical_preparation where id_planification = ${ id_planification } and id_physical_preparation = ${ id_physical_preparation }`)
}

async function deletePhysicalPreparation(id_physical_preparation) {
    return await db.query(`DELETE FROM physical_preparation where id = ${ id_physical_preparation }`)
}

async function deletePhysicalPreparationAttachment(id_planification, id_physical_preparation) {
    return await db.query(`DELETE FROM planification_has_physical_preparation where id_planification = ${ id_planification } and id_physical_preparation = ${ id_physical_preparation }`)
}

async function checkPhysicalPreparationExists(name) {
    return await db.query(`SELECT id FROM physical_preparation WHERE name = '${ name }'`)
}

async function checkPhysicalPreparationExistsById(id_physical_preparation) {
    return await db.query(`SELECT id FROM physical_preparation WHERE id = ${ id_physical_preparation }`)
}

async function showAllPhysicalPreparations() {
    return await db.query(`SELECT id, name FROM physical_preparation`)
}

async function showAllPhysicalPreparationsByPlanification(id_planification) {
    return await db.query(`select p.id as id_planification, pp.name as physical_preparation, cpp.quantity, q.name as quantity_type from planification_has_physical_preparation cpp
        join planification p on p.id = cpp.id_planification
        join physical_preparation pp on pp.id = cpp.id_physical_preparation
        join quantity_type q on q.id = cpp.id_quantity_type
    where p.id = ${ id_planification };`)
}

async function showAllPhysicalPreparationsByPlannifications(planifications) {   
    
    return await db.query(`select p.id as id_planification, pp.name as physical_preparation, cpp.quantity, q.name as quantity_type from planification_has_physical_preparation cpp
        join planification p on p.id = cpp.id_planification
        join physical_preparation pp on pp.id = cpp.id_physical_preparation
        join quantity_type q on q.id = cpp.id_quantity_type
    where p.id in (${ utils.arrayToText(planifications) });`)
}

module.exports = {
    createPhysicalPreparation,
    attachPhysicalPreparationToClass,
    existsPhysicalPreparationAttachment,
    deletePhysicalPreparation,
    deletePhysicalPreparationAttachment,
    checkPhysicalPreparationExists,
    checkPhysicalPreparationExistsById,
    showAllPhysicalPreparations,
    showAllPhysicalPreparationsByPlanification,
    showAllPhysicalPreparationsByPlannifications
}