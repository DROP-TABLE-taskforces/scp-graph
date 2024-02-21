const webcrawler = require("./webcrawler");
const T = require("./types");
const parser = require('./parser');
const preproc = require('./pre-proc');
const fs = require('fs');
const os = require('process');

webcrawler.add('wrong-proposal');
webcrawler.next().then(page => {
    let data = parser.parse(page);
    console.log(data.str());
});
