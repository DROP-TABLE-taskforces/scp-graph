const webcrawler = require('./webcrawler');
const parser = require('./parser');
const preproc = require('./pre-proc');

while (queue.length > 0) {
    let page = await webcrawler.next();
    let data = parser.parse(id, page);
    for (let newid of data.links)
        webcrawler.add(newid);
    preproc.add(data);
}

preproc.write();