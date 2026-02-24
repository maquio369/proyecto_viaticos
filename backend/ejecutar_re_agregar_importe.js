const fs = require('fs');
const pool = require('./config/database');
const path = require('path');

const sqlFile = path.join(__dirname, 're_agregar_importe.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

pool.query(sql)
    .then(() => {
        console.log('Columna importe agregada correctamente');
        pool.end();
    })
    .catch(err => {
        console.error('Error ejecutando SQL:', err);
        pool.end();
    });
