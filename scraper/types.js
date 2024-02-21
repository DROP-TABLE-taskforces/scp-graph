/**
 * Class that contains relevant blocks from the page.
 * @class
 * @constructor
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
         */
        this.id = id;
        /**
         * Page content as long string, if not found before.
         * @type {string}
         */
        this.text = text;
        /**
         * Tag list of page as long string, if not found before.
         * @type {string}
         */
        this.tags = tags;
    }
};

/**
 * Class containing extracted information from a page.
 * @class
 * @constructor
 */
class Data {
    /**
     * Standard constructor.
     * @param {string} id Page path / reference.
     * @param {string} title Page title.
     * @param {string[]} links Links found within the page, as simplified references.
     * @param {string[]} tags Tags of the page, as strings.
     * @param {string} type Type of page.
     */
    constructor(id, title, links, tags, type) {
        /**
         * Page path / reference.
         * @type {string}
         */
        this.id = id;
        /**
         * Page title.
         * @type {string}
         */
        this.title = title;
        /**
         * Links found within the page.
         * @type {string[]}
         */
        this.links = links;
        /**
         * Tags found within the page.
         * @type {string[]}
         */
        this.tags = tags;
        /**
         * Type of page.
         * @type {string}
         */
        this.type = type;
    }

    str = () => {
        return this.title + ' @ /' + this.id
            + ";" + this.tags.reduce((accu, tag) => accu + ' ' + tag, '')
            + this.links.reduce((accu, link) => accu + '\n\t' + link, '');
    }
}

/**
 * Class containing personalized errors.
 * @class
 * @constructor
 
 */
class PError {
    /**
     * @type {any}
     */
    #_more = {};
    /**
     * Make new error object.
     * @param {string} place Module in which the error occured.
     * @param {string} reason Reason for error appearance.
     * @param {string} page Page identifier, as string.
     * @param {any} more Object containing other properties that should be attached to the error.
     */
    constructor(place, reason, page, more) {
        if (!more) more = {};
        /**
         * Module in which the error occured.
         * @type {string}
         */
        this.place = place;
        /**
         * Assumed reason for which the error occured.
         * @type {string}
         */
        this.reason = reason;
        /**
         * Scraped page for which the error occured.
         * @type {string}
         */
        this.page = page;
        this.#_more = more;
        for (let field in more)
            this[field] = more[field];
    }

    str = () => {
        return 'PError @ ' + this.place
            + '; cause ' + this.reason
            + ', page ' + this.page
            + '. Info: ' + JSON.stringify(this.#_more);
    }
}

module.exports.Page = Page;
module.exports.Data = Data;
module.exports.PError = PError;