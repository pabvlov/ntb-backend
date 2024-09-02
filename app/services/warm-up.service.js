const db = require('./db')
const utils = require('../utils/utils')

async function createWarmUp(name, single_name) {
    return await db.query(`INSERT INTO gymnastics.warmup (name, single_name) VALUES ('${ name }', '${ single_name }')`)
}

async function attachWarmUpToClass(id_class, id_warmup, quantity, id_quantity_type) {
    return await db.query(`INSERT INTO class_has_warmup (id_class, id_warmup, quantity, id_quantity_type) VALUES (${ id_class }, ${ id_warmup }, ${ quantity }, ${ id_quantity_type })`)
}

async function existsWarmUpAttachment(id_class, id_warmup) {
    return await db.query(`SELECT * FROM class_has_warmup where id_class = ${ id_class } and id_warmup = ${ id_warmup }`)
}

async function deleteWarmUp(id_warmup) {
    return await db.query(`DELETE FROM warmup where id = ${ id_warmup }`)
}

async function deleteWarmUpAttachment(id_class, id_warmup) {
    return await db.query(`DELETE FROM class_has_warmup where id_class = ${ id_class } and id_warmup = ${ id_warmup }`)
}

async function checkWarmUpExists(name) {
    return await db.query(`SELECT id FROM warmup WHERE name = '${ name }'`)
}

async function checkWarmUpExistsById(id_warmup) {
    return await db.query(`SELECT id FROM warmup WHERE id = ${ id_warmup }`)
}

async function showAllWarmUps() {
    return await db.query(`SELECT id, name FROM warmup`)
}

async function showAllWarmUpsByClass(id_class) {
    return await db.query(`select c.id as id_class, w.name as warm_up, cw.quantity, q.name as quantity_typ, q.single_name as quantity_type_singlee from class_has_warmup cw
        join class c on c.id = cw.id_class
        join warmup w on w.id = cw.id_warmup
        join quantity_type q on q.id = cw.id_quantity_type
    where c.id = ${ id_class };`)
}

async function showAllWarmUpsByClasses(classes) {
    return await db.query(`select c.id as id_class, pp.name as warm_up, cpp.quantity, q.name as quantity_type, q.single_name as quantity_type_single from class_has_warmup cpp
        join class c on c.id = cpp.id_class
        join warmup pp on pp.id = cpp.id_warmup
        join quantity_type q on q.id = cpp.id_quantity_type
    where c.id in (${ utils.arrayToText(classes) });`);
}


module.exports = {
    createWarmUp,
    attachWarmUpToClass,
    existsWarmUpAttachment,
    deleteWarmUp,
    deleteWarmUpAttachment,
    checkWarmUpExists,
    checkWarmUpExistsById,
    showAllWarmUps,
    showAllWarmUpsByClass,
    showAllWarmUpsByClasses
}