const webcrawler = require("./webcrawler");
const T = require("./types");
const parser = require('./parser');
const preproc = require('./pre-proc');
const fs = require('fs');

webcrawler.add('scp-001');
webcrawler.next().then((page) => {
    console.log('Tags: ' + page.tags);
    console.log('Text: ' + page.text);
}).catch((err) => {
    console.log('Error: ' + JSON.stringify(err));
});
