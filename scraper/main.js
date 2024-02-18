const webcrawler = require('./webcrawler');
const parser = require('./parser');
const preproc = require('./pre-proc');

function loop() {
    webcrawler.next().then((page) => {
        if (page.id) {
            let data = parser.parse(page);
            for (let link of data.links)
                webcrawler.add(link);
            preproc.add(data);
            loop();
            preproc.write();
        }
    }).catch((err) => console.log(JSON.stringify(err)));
}

webcrawler.add('taboo');
loop();