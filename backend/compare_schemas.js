const fs = require('fs');

const localSchema = JSON.parse(fs.readFileSync('local_schema.json', 'utf8'));
const prodSchema = JSON.parse(fs.readFileSync('prod_schema.json', 'utf8'));

const localTables = [...new Set(localSchema.map(c => c.table_name))];
const prodTables = [...new Set(prodSchema.map(c => c.table_name))];

const missingTablesInProd = localTables.filter(t => !prodTables.includes(t));
const missingTablesInLocal = prodTables.filter(t => !localTables.includes(t));

console.log('--- TABLES ---');
console.log('Tables missing in Prod:', missingTablesInProd);
console.log('Tables missing in Local:', missingTablesInLocal);

console.log('\n--- COLUMNS ---');
for (const table of localTables) {
    if (missingTablesInProd.includes(table)) continue;

    const localCols = localSchema.filter(c => c.table_name === table);
    const prodCols = prodSchema.filter(c => c.table_name === table);

    const localColNames = localCols.map(c => c.column_name);
    const prodColNames = prodCols.map(c => c.column_name);

    const missingInProd = localCols.filter(c => !prodColNames.includes(c.column_name));
    const missingInLocal = prodCols.filter(c => !localColNames.includes(c.column_name));

    if (missingInProd.length > 0) {
        console.log(`Table '${table}' missing columns in Prod:`, missingInProd.map(c => c.column_name));
    }
    if (missingInLocal.length > 0) {
        console.log(`Table '${table}' missing columns in Local:`, missingInLocal.map(c => c.column_name));
    }
    
    // Check type differences
    for (const lCol of localCols) {
        const pCol = prodCols.find(c => c.column_name === lCol.column_name);
        if (pCol) {
            if (pCol.data_type !== lCol.data_type) {
                console.log(`Table '${table}' column '${lCol.column_name}' type mismatch: Local(${lCol.data_type}) vs Prod(${pCol.data_type})`);
            }
        }
    }
}
