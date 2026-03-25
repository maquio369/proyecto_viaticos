const http = require('http');

function checkEndpoint(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`Endpoint: ${path} -> Código: ${res.statusCode}`);
            resolve(res.statusCode);
        });

        req.on('error', (e) => {
            console.error(`Error en ${path}: ${e.message}`);
            resolve(null);
        });

        req.end();
    });
}

async function runTests() {
    console.log('--- Verificando estado del Backend ---');
    await checkEndpoint('/');
    const status = await checkEndpoint('/api/areas/tree');

    if (status === 404) {
        console.log('\nCONFIRMADO: El backend no reconoce la ruta /api/areas/tree.');
        console.log('Esto sucede porque el proceso de node no ha sido reiniciado.');
    } else if (status === 401) {
        console.log('\nOK: El backend reconoce la ruta (requiere Token).');
    }
}

runTests();
