const webcrawler = require("./webcrawler");
const T = require("./types");
const parser = require('./parser');
const preproc = require('./pre-proc');
const fs = require('fs');
const os = require('process');

const db = JSON.parse(fs.readFileSync('../database.json', {encoding: 'utf-8'}));

const newtidx = db.types.length - 3;
for (let type of ['experiment', 'interview']) {
    const tidx = db.types.findIndex(t => t == type);
    db.types.splice(tidx, 1);
    for (let page of db.pages) if (page.type == tidx) page.type = newtidx;
}
db.types.push('supplement');

fs.writeFileSync('./database.json', JSON.stringify(db), {encoding: 'utf-8'});
