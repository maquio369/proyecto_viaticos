const axios = require('axios');

async function testBackend() {
    try {
        console.log('Probando conexión local al backend...');
        const response = await axios.get('http://localhost:5000/');
        console.log('Respuesta base:', response.data);

        console.log('\nProbando endpoint de áreas (sin auth, debería dar 401 si existe, 404 si no existe el registro de ruta):');
        try {
            await axios.get('http://localhost:5000/api/areas/tree');
        } catch (error) {
            console.log('Código de error:', error.response ? error.response.status : error.message);
            if (error.response && error.response.status === 404) {
                console.log('ERROR: El endpoint NO existe (404). El backend probablemente necesita reiniciarse.');
            } else if (error.response && error.response.status === 401) {
                console.log('OK: El endpoint existe pero requiere autenticación (401). El registro de ruta es correcto.');
            }
        }
    } catch (error) {
        console.error('Error al conectar con el backend:', error.message);
    }
}

testBackend();
