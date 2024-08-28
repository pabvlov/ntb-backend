const db = require('./db')

async function createPhysicalPreparation(name, id_element_for) {
    return await db.query(`INSERT INTO gymnastics.physical_preparation (name, id_element_for) VALUES ('${ name }', ${ id_element_for })`)
}

async function attachPhysicalPreparationToClass(id_class, id_physical_preparation, quantity, id_quantity_type) {
    return await db.query(`INSERT INTO class_has_physical_preparation (id_class, id_physical_preparation, quantity, id_quantity_type) VALUES (${ id_class }, ${ id_physical_preparation }, ${ quantity }, ${ id_quantity_type })`)
}

async function deletePhysicalPreparation(id_physical_preparation) {
    return await db.query(`DELETE FROM physical_preparation where id = ${ id_physical_preparation }`)
}

async function deletePhysicalPreparationAttachment(id_class, id_physical_preparation) {
    return await db.query(`DELETE FROM class_has_physical_preparation where id_class = ${ id_class } and id_physical_preparation = ${ id_physical_preparation }`)
}

async function checkPhysicalPreparationExists(name, id_element_for) {
    return await db.query(`SELECT id FROM physical_preparation WHERE name = '${ name }' and id_element_for = ${ id_element_for }`)
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

module.exports = {
    createPhysicalPreparation,
    attachPhysicalPreparationToClass,
    deletePhysicalPreparation,
    deletePhysicalPreparationAttachment,
    checkPhysicalPreparationExists,
    checkPhysicalPreparationExistsById,
    showAllPhysicalPreparations,
    showAllPhysicalPreparationsByClass
}