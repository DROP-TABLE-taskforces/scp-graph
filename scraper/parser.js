const { Page, Data } = require('./types');

const rexs = {
    title: /<div id="page-title">[ \n\t]*(.*?)[ \n\t]*<\/div>/,
    link: /href="(https?:\/\/scp-wiki\.wikidot\.com)?\/([^#]*?)"/g,
    tag: /<a href="\/system:page-tags\/tag\/([^_]*?)#pages">([^_]*?)<\/a>/g,
    invalid_link: /^local--files|^creditlink$|(component|^system):/
}

/** Is this string a crawlable link? */
function is_link(str) {
    return !(rexs.invalid_link.test(match[2]) || match[2] == '');
}

const known_types = [
    'supplement',
    'author',
    'hub',
    'goi-format',
    'goi',
    'tale',
    'scp',
    'archived',
    'admin',
    'component',
    'resource'
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
        if (is_link(match[2]))
            links.push(match[2]);
    let tags = [];
    let type = /-hub$/.test(page.id) ? 'hub' : /^scp-/.test(page.id) ? 'scp' : 'unknown';
    for (let match of page.tags.matchAll(rexs.tag))
        if (match[1] == match[2] && match[1] != 'component') {
            tags.push(match[1]);
            for (let ptype of known_types)
                if (match[1] == ptype) {
                    type = match[1];
                    break;
                }
        }
    console.log('\ttype ' + type + '; links ' + links);
    return new Data(page.id, title, links, tags, type);
}

module.exports.parse = get_data;
module.exports.valid = is_link;