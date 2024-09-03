const db = require('./db')

async function worklines() {
    const worklines = await db.query(
        `SELECT * FROM workline`)
    return worklines;
}

module.exports = {
    worklines
}