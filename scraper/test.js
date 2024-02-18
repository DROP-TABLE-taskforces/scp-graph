const webcrawler = require("./webcrawler");
const T = require("./types");
const parser = require('./parser');
const preproc = require('./pre-proc');
const fs = require('fs');

webcrawler.add('taboo');
webcrawler.next().then((page) => {
    let data = parser.parse(page);
    console.log(data.title);
    console.log(data.tags);
    console.log(data.type);
    console.log(data.links);
}).catch((err) => {
    console.log('Error: ' + JSON.stringify(err));
});
