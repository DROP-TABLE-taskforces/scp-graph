const webcrawler = require("./webcrawler");
const T = require("./types");
const parser = require('./parser');
const preproc = require('./pre-proc');

webcrawler.add('scp-001');
let page = await webcrawler.next();

console.log('Tags: ' + page.tags);
console.log('Text: ' + page.text);