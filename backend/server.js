const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const catalogosRoutes = require('./routes/catalogos');
const actividadesRoutes = require('./routes/actividades');
const memorandumRoutes = require('./routes/memorandum');
const firmasRoutes = require('./routes/firmas');
const empleadosRoutes = require('./routes/empleados');

const app = express();

app.use(cors({
  origin: [
    'http://sag.chiapas.gob.mx:27',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/memorandum', memorandumRoutes);
app.use('/api/firmas', firmasRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/tarifas', require('./routes/tarifas'));
app.use('/api/viaticos', require('./routes/viaticos'));
app.use('/api/gastos-globales', require('./routes/gastosGlobales'));
app.use('/api/tramites', require('./routes/tramites'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/reportes', require('./routes/reportes'));

app.get('/', (req, res) => {
  res.json({ message: 'API Sistema de Viáticos funcionando' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});