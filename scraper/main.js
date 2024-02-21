const webcrawler = require('./webcrawler');
const parser = require('./parser');
const preproc = require('./pre-proc');
const T = require('./types');
const os = require('process');

let count = 0;

function loop() {
    setTimeout(() => {
        webcrawler.next().then((page) => {
            if (page && page.id) {
                let data = parser.parse(page);
                if (data.type == 'component') {
                    loop();
                    return;
                }
                for (let link of data.links)
                    if (link != 'creditlink')
                        webcrawler.add(link);
                preproc.add(data);
                count++;
                if (count % 100 == 0) {
                    console.log('backing up database to file');
                    preproc.write();
                }
                loop();
            } else {
                preproc.write();
            }
        }).catch((/** @type {T.PError} */ err) => {
            if (err.reason == 'code' && err.code > 499)
                webcrawler.add(err.page, true);
            setTimeout(loop, 120000);
            preproc.write();
            console.log(err.str());
        });
    }, 6000);
}

function fresh() {
    webcrawler.add('scp-001');
    webcrawler.add('scp-000');
    for (let i = 1; i < 6; i++) {
        webcrawler.add('scp-' + (i * 1000));
        webcrawler.add('scp-' + (i * 1000 - 1));
    }
}

console.log(os.argv[2]);
if (os.argv[2] == 'restore') {
    if (preproc.restore() == 0)
        fresh();
} else
    fresh();

os.on('SIGINT', function() {
    preproc.write();
    // listener disables standard effect, must be produced by hand
    os.exit();
});
loop();
