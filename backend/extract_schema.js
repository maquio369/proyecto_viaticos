const { Client } = require('pg');

const args = process.argv.slice(2);
const connectionString = args[0];
const outputFile = args[1];

async function extractSchema() {
    const client = new Client({ connectionString });
    await client.connect();

    try {
        const query = `
            SELECT table_name, column_name, data_type, character_maximum_length, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position
        `;
        const { rows } = await client.query(query);
        
        const fs = require('fs');
        fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2));
        console.log(`Schema extracted to ${outputFile}: ${rows.length} columns found.`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}
extractSchema();
