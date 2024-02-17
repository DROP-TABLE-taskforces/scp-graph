const Page = require('./types').Page;
const Data = require('./types').Data;

const rexs = {
    title: /<div id="page-title">[ \n\t]*(.*?)[ \n\t]*<\/div>/,
    link: /href="(https?:\/\/scp-wiki\.wikidot\.com|https?:\/\/www\.scp-wiki\.net)?\/(.*?)"/,
    tag: /<a href="\/(system:page-tags\/tag\/.*?#pages)>(.*?)<\/a>/
}

/**
 * Parse a page and extract the useful data.
 * @param {Page} page Page to parse content of.
 * @returns {Data} Data extracted from the page.
 */
function get_data(page) {
    
}

module.exports.parse = get_data;