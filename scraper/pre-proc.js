const fs = require('fs');
const Data = require('./types').Data;

let db = JSON.parse(fs.readFileSync('../data.json', {encoding: 'ascii'}));

/**
 * Adds a page to the database.
 * @param {Data} item Page data to be added to the database.
 * @returns {void}
 */
function add_to_db(item) {

}

module.exports.add = add_to_db;
module.exports.write = () => { fs.writeFileSync('../data.json', JSON.stringify(db), {encoding: 'ascii'}); };