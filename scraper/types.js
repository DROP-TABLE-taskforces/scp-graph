/**
 * Class that contains relevant blocks from the page.
 * @class
 * @constructor
 * @public
 */
class Page {
    /**
     * Standard constructor.
     * @param {string} id Page reference on the SCP wiki.
     * @param {string} text Main content of the page, as large string.
     * @param {string} tags Tags of page, as large string.
     */
    constructor(id, text, tags) {
        /**
         * Page reference.
         * @type {string}
         * @public
         */
        this.id = id;
        /**
         * Page content as long string, if not found before.
         * @type {string}
         * @public
         */
        this.text = text;
        /**
         * Tag list of page as long string, if not found before.
         * @type {string}
         * @public
         */
        this.tags = tags;
    }
};

/**
 * Class containing extracted information from a page.
 * @class
 * @constructor
 * @public
 */
class Data {
    /**
     * Standard constructor.
     * @param {string} id Page path / reference.
     * @param {string[]} links Links found within the page, as simplified references.
     * @param {string[]} tags Tags of the page, as strings.
     * @param {string} type Type of page.
     */
    constructor(id, links, tags, type) {
        /**
         * Page path / reference.
         * @type {string}
         * @public
         */
        this.id = id;
        /**
         * Links found within the page.
         * @type {string[]}
         * @public
         */
        this.links = links;
        /**
         * Tags found within the page.
         * @type {string[]}
         * @public
         */
        this.tags = tags;
        /**
         * Type of page.
         * @type {string}
         * @public
         */
        this.type = type;
    }
}

module.exports.Page = Page;
module.exports.Data = Data;