const https = require('https');
const Page = require('./types').Page;

/** @type {string[]} */
const queue = [];
/** @type {Object.<string, boolean>} */
const foundpages = {};

const contex = /<div id="main-content">[ \n\t]*(.*?)[ \n\t]*<div class="licensebox">/;
const tagex = /<div class="page-tags">[ \n\t]*<span>[ \n\t]*(.*?)[ \n\t]*<\/span>[ \n\t]*<\/div>/;

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
        let id = queue.shift();
        foundpages[id] = true;
        let data = '';
        options.path = '/' + id;
        https.get(options, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                bad({place: 'crawler', reason: 'code', code: res.statusCode});
                return;
            }
            res.on('data', (chunk) => { data = data + chunk; });
            res.on('close', () => {
                pagecontent = data.match(contex)[1];
                pagetags = data.match(tagex)[1];
                good(new Page(false, pagecontent, pagetags));
            });
        }).on('error', bad({place: 'crawler', reason: 'connection'}));
    });
}

module.exports.next = next_page;
module.exports.add = add_to_queue;