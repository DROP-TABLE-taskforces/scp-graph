const fs = require('fs');

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
const dbstr = fs.readFileSync('../database.json');
const db = JSON.parse(dbstr) || {pages: [], tags: [], types: []};

console.log('Database statistics');
console.log('' + db.pages.length + ' articles');
const types = db.pages.reduce((accu, page) => {
    accu[db.types[page.type]] = (accu[db.types[page.type]] || 0) + 1;
    return accu;
}, {});
for (let type in types)
    console.log('\t' + types[type] + ' ' + type + 's');
console.log('' + db.tags.length + ' tags');
console.log('' + Math.ceil(dbstr.length / 1024) + ' kilobytes on disk');
const articles = {};
const queue_size = db.pages.reduce((size, elem) => size + elem.links.reduce((count, link) => {
    if (typeof link != 'string')
        return count;
    if (articles[link])
        return count;
    articles[link] = true;
    return count + 1;
}, 0), 0);
console.log('currently ' + queue_size + ' uncrawled articles');