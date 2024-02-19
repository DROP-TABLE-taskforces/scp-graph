const Page = require('./types').Page;
const Data = require('./types').Data;

const rexs = {
    title: /<div id="page-title">[ \n\t]*(.*?)[ \n\t]*<\/div>/,
    link: /href="(https?:\/\/scp-wiki\.wikidot\.com|https?:\/\/www\.scp-wiki\.net)?\/(.*?)"/g,
    tag: /<a href="\/system:page-tags\/tag\/([^_]*?)#pages">([^_]*?)<\/a>/g
}

const known_types = [
    'scp',
    'tale',
    'admin',
    'hub',
    'goi',
    'author',
    'component'
]

/**
 * Parse a page and extract the useful data.
 * @param {Page} page Page to parse content of.
 * @returns {Data} Data extracted from the page.
 */
function get_data(page) {
    let title = page.text.match(rexs.title)[1];
    let links = [];
    for (let match of page.text.matchAll(rexs.link))
        if (!(/system:/.test(match[2]) || match[2] == '' || links.find(l => l == match[2])))
            links.push(match[2]);
    let tags = [];
    let type = /-hub$/.test(page.id) ? 'hub' : /^scp-/.test(page.id) ? 'scp' : 'unknown';
    for (let match of page.tags.matchAll(rexs.tag)) if (match[1] == match[2]) {
        tags.push(match[1]);
        for (let ptype of known_types)
            if (match[1] == ptype) {
                type = match[1];
                break;
            }
    }
    console.log('\ttype ' + type);
    return new Data(page.id, title, links, tags, type);
}

module.exports.parse = get_data;