const fs = require('fs');
const path = require('path');
try {
    const content = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
    console.log('FILE CONTENT START');
    console.log(content);
    console.log('FILE CONTENT END');
} catch (err) {
    console.error('ERROR READING FILE:', err);
}
