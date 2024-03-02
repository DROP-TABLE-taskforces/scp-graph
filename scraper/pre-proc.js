const fs = require('fs');
const { Data } = require('./types');
const webcrawler = require('./webcrawler');
const { valid } = require('./parser');

/**
 * @type {{
 *  pages: {
 *      id: string,
 *      title: string,
 *      type: number,
 *      links: (number | string)[],
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

let db_raw_size = 0;

/**
 * Restore old, unwalked links, if any exist.
 * @returns {number} Number of links that remain unexplored.
 */
function restore_old_links() {
    rawstr = fs.readFileSync('../database.json', {encoding: 'utf-8'});
    db = JSON.parse(rawstr);
    db_raw_size = rawstr.length;
    console.log('' + db.pages.length + ' recovered');
    let count = 0;
    for (let page of db.pages) {
        webcrawler.remove(page.id);
        for (let link of page.links)
            if (typeof link == 'string' && valid(link))
                count += webcrawler.add(link) ? 1 : 0;
    }
    console.log('' + count + ' uncrawled pages');
    return count;
}

/**
 * Change a string identifier that returns a 301 into the header provided location.
 * @param {string} oldlink Old page reference.
 * @param {number | string | undefined} newlink New page reference, or internal database ID.
 * Leave undefined for page *removal*.
 * @returns {void} Nothing.
 */
function change_link(oldlink, newlink) {
    console.log('\tredirecting ' + oldlink + ' to ' + newlink);
    if (newlink == undefined) {
        let idx = db.pages.findIndex(p => p.id == oldlink);
        if (idx >= 0) {
            db_raw_size -= JSON.stringify(db.pages[idx]).length;
            db.pages.splice(idx, 1);
        }
        for (let page of db.pages)
            for (let i = 0; i < page.links.length; i++)
                if (page.links[i] === oldlink) {
                    db_raw_size -= oldlink - 2;
                    page.links.splice(i, 1);
                    i--;
                }
        return;
    }
    const delta = (typeof newlink == 'number' ? 7 : newlink.length) - oldlink.length;
    for (let page of db.pages) {
        if (page.id === oldlink) {
            page.id = newlink;
            db_raw_size += delta;
        }
        for (let i = 0; i < page.links.length; i++)
            if (page.links[i] === oldlink) {
                page.links[i] = newlink;
                db_raw_size += delta;
            }
    }
    console.log('\tdone');
}

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
    db_raw_size += item.id.length + item.title.length + 8 * item.tags.length + 50;
    let tagnums = item.tags.map((tag) => db.tags.findIndex((t) => tag == t));
    for (let i = 0; i < tagnums.length; i++)
        if (tagnums[i] < 0) {
            tagnums[i] = db.tags.length;
            db.tags.push(item.tags[i]);
            db_raw_size += item.tags[i].length;
        }
    console.log('\tnumbered tags');
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
    console.log('\ttyped');
    npage.type = tidx;
    npage.links = [];
    for (let i = 0; i < item.links.length; i++) {
        let j = 0;
        for (; j < db.pages.length; j++)
            if (item.links[i] === db.pages[j].id) {
                npage.links.push(j);
                db_raw_size += 8;
                break;
            }
        if (j == db.pages.length) {
            npage.links.push(item.links[i]);
            db_raw_size += item.links[i].length + 1;
        }
    }
    console.log('\taltered internal links');
    change_link(item.id, db.pages.length);
    console.log('\tnew raw size ' + Math.ceil(db_raw_size / 1024) + ' KB')
    db.pages.push(npage);
}

module.exports.add = add_to_db;
module.exports.write = () => { fs.writeFileSync('../database.json', JSON.stringify(db), {encoding: 'utf-8'}); };
module.exports.redirect = change_link;
module.exports.restore = restore_old_links;