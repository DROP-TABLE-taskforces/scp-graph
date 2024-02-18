const { fstat } = require('fs');
const https = require('https');
const Page = require('./types').Page;
const fs = require('fs');

/** @type {string[]} */
const queue = [];
/** @type {Object.<string, boolean>} */
const foundpages = {};

const contex = [
    /<div id="main-content">\s*/,
    /\s*<div class="licensebox">/
];
const tagex = /<div class="page-tags">\s*<span>\s*(.*?)\s*<\/span>\s*<\/div>/;

/**
 * Add new page to internal page list.
 * @param {string} id New page reference to memorize. 
 * @returns {void} Nothing.
 */
function add_to_queue(id) {
    if (!(foundpages.hasOwnProperty(id))) {
        queue.push(id);
        foundpages[id] = false;
    }
}

const options = {
    hostname: 'scp-wiki.wikidot.com',
    port: 443,
    path: '/',
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
}
options.agent = https.Agent(options);

/**
 * Gets page and isolates content.
 * @returns {Promise<Page>} Content of page.
 */
async function next_page() {
    return new Promise((good, bad) => {
        while (foundpages[queue[0]])
            queue.shift();
        if (queue.length == 0) {
            good(new Page('', '', ''));
            return;
        }
        let id = queue.shift();
        foundpages[id] = true;
        let data = '';
        options.path = '/' + id;
        let errorfound = false;
        https.get(options, (res) => {
            if (errorfound) return;
            if (res.statusCode < 200 || res.statusCode > 299) {
                if (res.statusCode == 301) {
                    
                }
                errorfound = true;
                bad({place: 'crawler', reason: 'code', code: res.statusCode});
                return;
            }
            res.on('data', (chunk) => { data = data + chunk; })
                .on('close', () => { if (!errorfound) {
                let pgctstmatch = data.match(contex[0]);
                let pagecontent = data.substring(pgctstmatch.index + pgctstmatch[0].length, data.match(contex[1]).index);
                let pagetags = data.match(tagex)[1];
                good(new Page(id, pagecontent, pagetags));
            } else bad({place: 'crawler', reason: 'errfound'})});
        }).on('error', (err) => {
            errorfound = true;
            bad({place: 'crawler', reason: 'connection', error: err});
        });
    });
}

module.exports.next = next_page;
module.exports.add = add_to_queue;