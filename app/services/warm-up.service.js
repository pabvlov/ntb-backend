const db = require('./db')
const utils = require('../utils/utils')

async function createWarmUp(name, single_name) {
    return await db.query(`INSERT INTO gymnastics.warmup (name, single_name) VALUES ('${ name }', '${ single_name }')`)
}

async function attachWarmUpToClass(id_planification, id_warmup, quantity, id_quantity_type) {
    return await db.query(`INSERT INTO planification_has_warmup (id_planification, id_warmup, quantity, id_quantity_type) VALUES (${ id_planification }, ${ id_warmup }, ${ quantity }, ${ id_quantity_type })`)
}

async function existsWarmUpAttachment(id_planification, id_warmup) {
    return await db.query(`SELECT * FROM planification_has_warmup where id_planification = ${ id_planification } and id_warmup = ${ id_warmup }`)
}

async function deleteWarmUp(id_warmup) {
    return await db.query(`DELETE FROM warmup where id = ${ id_warmup }`)
}

async function deleteWarmUpAttachment(id_planification, id_warmup) {
    return await db.query(`DELETE FROM planification_has_warmup where id_planification = ${ id_planification } and id_warmup = ${ id_warmup }`)
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

async function showAllWarmUpsByPlanification(id_planification) {
    return await db.query(`select p.id as id_planification, w.name as warm_up, cw.quantity, q.name as quantity_typ, q.single_name as quantity_type_singlee from planification_has_warmup cw
        join planification p on p.id = cw.id_planification
        join warmup w on w.id = cw.id_warmup
        join quantity_type q on q.id = cw.id_quantity_type
    where p.id = ${ id_planification };`)
}

async function showAllWarmUpsByPlanifications(planifications) {
    return await db.query(`select p.id as id_planification, pp.name as warm_up, cpp.quantity, q.name as quantity_type, q.single_name as quantity_type_single from planification_has_warmup cpp
        join planification p on p.id = cpp.id_planification
        join warmup pp on pp.id = cpp.id_warmup
        join quantity_type q on q.id = cpp.id_quantity_type
    where p.id in (${ utils.arrayToText(planifications) });`);
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
    showAllWarmUpsByPlanification,
    showAllWarmUpsByPlanifications
}