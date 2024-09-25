const db = require('./db')
const utils = require('../utils/utils')

async function createPhysicalPreparation(name) {
    return await db.query(`INSERT INTO gymnastics.physical_preparation (name) VALUES ('${ name }')`)
}

async function attachPhysicalPreparationToClass(id_class, id_physical_preparation, quantity, id_quantity_type) {
    return await db.query(`INSERT INTO class_has_physical_preparation (id_class, id_physical_preparation, quantity, id_quantity_type) VALUES (${ id_class }, ${ id_physical_preparation }, ${ quantity }, ${ id_quantity_type })`)
}

async function existsPhysicalPreparationAttachment(id_class, id_physical_preparation) {
    return await db.query(`SELECT * FROM class_has_physical_preparation where id_class = ${ id_class } and id_physical_preparation = ${ id_physical_preparation }`)
}

async function deletePhysicalPreparation(id_physical_preparation) {
    return await db.query(`DELETE FROM physical_preparation where id = ${ id_physical_preparation }`)
}

async function deletePhysicalPreparationAttachment(id_class, id_physical_preparation) {
    return await db.query(`DELETE FROM class_has_physical_preparation where id_class = ${ id_class } and id_physical_preparation = ${ id_physical_preparation }`)
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

async function showAllPhysicalPreparationsByClass(id_class) {
    return await db.query(`select c.id as id_class, pp.name as physical_preparation, cpp.quantity, q.name as quantity_type from class_has_physical_preparation cpp
        join class c on c.id = cpp.id_class
        join physical_preparation pp on pp.id = cpp.id_physical_preparation
        join quantity_type q on q.id = cpp.id_quantity_type
    where c.id = ${ id_class };`)
}

async function showAllPhysicalPreparationsByClasses(classes) {   
    
    return await db.query(`select c.id as id_class, pp.name as physical_preparation, cpp.quantity, q.name as quantity_type from class_has_physical_preparation cpp
        join class c on c.id = cpp.id_class
        join physical_preparation pp on pp.id = cpp.id_physical_preparation
        join quantity_type q on q.id = cpp.id_quantity_type
    where c.id in (${ utils.arrayToText(classes) });`)
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
    showAllPhysicalPreparationsByClass,
    showAllPhysicalPreparationsByClasses
}