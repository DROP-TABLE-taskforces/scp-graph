const webcrawler = require('./webcrawler');
const parser = require('./parser');
const preproc = require('./pre-proc');
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
        }).catch((err) => {
            if (err.reason == 'code' && err.code > 499)
                setTimeout(loop, 60000);
            if (err.reason == 'connection')
                setTimeout(loop, 120000);
            preproc.write();
            console.log(JSON.stringify(err));
        });
    }, 6000);
}

webcrawler.add('scp-001');
webcrawler.add('scp-000');
for (let i = 1; i < 6; i++) {
    webcrawler.add('scp-' + (i * 1000));
    webcrawler.add('scp-' + (i * 1000 - 1));
}

os.on('SIGINT', function() {
    preproc.write();
    // listener disables standard effect, must be produced by hand
    os.exit();
});
loop();
