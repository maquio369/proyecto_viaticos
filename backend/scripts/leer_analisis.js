const fs = require('fs');
try {
    const content = fs.readFileSync('analysis_output.txt', 'utf16le');
    console.log(content);
} catch (err) {
    console.error(err);
}
