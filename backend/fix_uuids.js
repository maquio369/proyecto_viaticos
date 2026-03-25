const fs = require('fs');

const inputFile = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\728f3161-df00-4431-9c27-c3014369ef02\\formato_comision_completo.jrxml';
const content = fs.readFileSync(inputFile, 'utf8');

let counter = 1;
const newContent = content.replace(/uuid="[^"]+"/g, (match) => {
    // Generate a valid hex UUID based on counter
    const hex = counter.toString(16).padStart(12, '0');
    counter++;
    return `uuid="5eb6e12a-0000-4000-8000-${hex}"`;
});

fs.writeFileSync(inputFile, newContent);
console.log('UUIDs replaced successfully.');
