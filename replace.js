const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.html')) {
            let text = fs.readFileSync(p, 'utf8');
            let newText = text
                .replace(/class="grid grid-cols-2/g, 'class="grid grid-cols-1 md:grid-cols-2')
                .replace(/class="grid grid-cols-3/g, 'class="grid grid-cols-1 lg:grid-cols-3')
                .replace(/class="grid grid-cols-4/g, 'class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
                .replace(/class="grid grid-cols-6/g, 'class="grid grid-cols-2 md:grid-cols-6');
            if (text !== newText) {
                fs.writeFileSync(p, newText);
                console.log('Updated ' + p);
            }
        }
    });
}
walk('frontend-colegio/src/app');
