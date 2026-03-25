const fs = require('fs');
const path = require('path');
const diff = require('./diff.json');

const tables = diff.missingTablesInProd;
const usedTables = new Set();

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.') || file.endsWith('.json') || file.endsWith('.txt')) continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.sql'))) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                for (const t of tables) {
                    // Search for exact word match
                    const regex = new RegExp(`\\b${t}\\b`, 'i');
                    if (regex.test(content)) {
                        usedTables.add(t);
                    }
                }
            } catch (e) {
                // Ignore read errors
            }
        }
    }
}

searchDir('.');
console.log('--- Used Tables ---');
console.log(Array.from(usedTables).sort());

const unused = tables.filter(t => !usedTables.has(t));
console.log('\n--- Unused Tables ---');
console.log(unused.sort());
