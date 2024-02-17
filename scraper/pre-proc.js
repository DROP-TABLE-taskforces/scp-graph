const fs = require('fs');
const Data = require('./types').Data;

/**
 * @type {{
 *  pages: {
 *      id: string,
 *      title: string,
 *      type: number,
 *      links: number[],
 *      tags: number[],
 *  }[],
 *  tags: string[],
 *  types: string[]
 * }}
 */
let db = {
    pages: [],
    tags: [],
    types: []
};

/**
 * Adds a page to the database.
 * @param {Data} item Page data to be added to the database.
 * @returns {void}
 */
function add_to_db(item) {
    let npage = {
        id: item.id,
        title: item.title
    };
    let tagnums = item.tags.map((tag) => db.tags.findIndex((t) => tag == t));
    for (let i = 0; i < tagnums.length; i++)
        if (tagnums[i] < 0) {
            tagnums[i] = db.tags.length;
            db.tags.push(item.tags[i]);
        }
    npage.tags = tagnums;
    for (let page of db.pages)
        for (let i = 0; i < page.links.length; i++)
            if (page.links[i] == page.id)
                page.links[i] = db.pages.length;
    let tidx = db.types.findIndex(t => t == item.type);
    if (tidx < 0) {
        tidx = db.types.length;
        db.types.push(item.type);
    }
    npage.type = tidx;
    db.pages.push(npage);
}

module.exports.add = add_to_db;
module.exports.write = () => { fs.writeFileSync('../database.json', JSON.stringify(db), {encoding: 'ascii'}); };