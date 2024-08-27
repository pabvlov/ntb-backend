const crypto = require('crypto');

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
  }
  
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function generateSalt() {
    //return Math.round((new Date().valueOf() * Math.random())) + '';
    crypto.randomBytes(16, function(err, buf) {
        if (err) throw err;
        return buf;
    });
    return crypto.randomBytes(16); // fails to
}

const  generateRandomString = (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1= ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}
  
module.exports = {
    getOffset,
    emptyOrRows,
    generateSalt,
    generateRandomString
}