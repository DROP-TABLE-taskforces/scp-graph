const { fstat } = require('fs');
const https = require('https');
const Page = require('./types').Page;
const redirect = require('./pre-proc').redirect;

/** @type {string[]} */
const queue = [];
let queue_size = 0;
/** @type {Object.<string, boolean>} */
const foundpages = {};

const contex = [
    /<div id="main-content">\s*/,
    /(\s*<div class="licensebox">|\s*<div class="page-tags">)/
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
        queue_size += id.length + 25;
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
 * @callback ThenCallback
 * @param {Page} page The page ad the address.
 * @returns {void} Nothing.
 */

/**
 * @callback CatchCallback
 * @param {any} err Error object.
 * @returns {void} Nothing.
 */

/**
 * Auxiliary function for recursion purposes.
 * @param {ThenCallback} good Success callback.
 * @param {CatchCallback} bad Fail callback.
 * @returns {void} Nothing.
 */
function np_aux(good, bad) {
    while (foundpages[queue[0]]) {
        queue_size -= queue.shift().length;
    }
    if (queue.length == 0) {
        good(new Page('', '', ''));
        return;
    }
    let id = queue.shift();
    queue_size -= id.length;
    let currdate = new Date();
    console.log(currdate.toLocaleDateString() + ' ' + currdate.toLocaleTimeString() + ' - ' + id);
    console.log('\tqueue size ' + queue.length + ' / ' + Math.ceil(queue_size / 1024) + ' KB');
    foundpages[id] = true;
    let data = '';
    options.path = '/' + id;
    let errorfound = false;
    https.get(options, (res) => {
        if (errorfound) return;
        if (res.statusCode < 200 || res.statusCode > 299) {
            if (res.statusCode == 301) {
                queue.unshift(res.headers.location.match(/(https?:\/\/scp-wiki\.wikidot\.com|https?:\/\/www\.scp-wiki\.net)?\/(.*)/)[2]);
                redirect(id, queue[0]);
                foundpages[queue[0]] = false;
                np_aux(good, bad);
                return;
            }
            errorfound = true;
            bad({place: 'crawler', reason: 'code', code: res.statusCode});
            return;
        }
        res.on('data', (chunk) => { data = data + chunk; })
            .on('close', () => { if (!errorfound) {
            console.log('\tgot page');
            let pgctstmatch = data.match(contex[0]);
            let pagecontent = data.substring(pgctstmatch.index + pgctstmatch[0].length, data.match(contex[1]).index);
            let tagmatch = data.match(tagex);
            let pagetags = tagmatch ? tagmatch[1] : '';
            good(new Page(id, pagecontent, pagetags));
        } else bad({place: 'crawler', reason: 'errfound', page: id})});
    }).on('error', (err) => {
        errorfound = true;
        bad({place: 'crawler', reason: 'connection', error: err, page: id});
    });
}

/**
 * Gets page and isolates content.
 * @returns {Promise<Page>} Content of page.
 */
async function next_page() {
    return new Promise(np_aux);
}

module.exports.next = next_page;
module.exports.add = add_to_queue;