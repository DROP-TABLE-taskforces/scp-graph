const webcrawler = require('./webcrawler');
const parser = require('./parser');
const preproc = require('./pre-proc');
const os = require('process');

function loop() {
    setTimeout(() => {
        webcrawler.next().then((page) => {
            if (page.id) {
                let data = parser.parse(page);
                if (data.type == 'component') {
                    loop();
                    return;
                }
                for (let link of data.links)
                    if (link != 'creditlink')
                        webcrawler.add(link);
                preproc.add(data);
                loop();
            } else {
                preproc.write();
            }
        }).catch((err) => {
            preproc.write();
            console.log(JSON.stringify(err));
        });
    }, 3000);
}

for (let i = 0; i < 10; i++)
    webcrawler.add('scp-00' + i);
for (let i = 10; i < 100; i++)
    webcrawler.add('scp-0' + i);
for (let i = 100; i < 4000; i++)
    webcrawler.add('scp-' + i);

webcrawler.add('deconstruction-of-a-god');
webcrawler.add('taboo');
os.on('SIGINT', function() {
    preproc.write();
    // listener disables standard effect, must be produced by hand
    os.exit();
});
loop();
