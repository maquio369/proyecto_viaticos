const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jasperService = require('../services/JasperService');

// Generar PDF de Memorandum de Comisión
router.get('/memorandum/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📄 Petición de reporte para Memorandum #${id}`);

    const report = await jasperService.generateMemorandumReport(id);

    res.setHeader('Content-Type', report.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${report.filename}`);
    res.send(report.data);

  } catch (error) {
    console.error('❌ Error en ruta de reporte:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
});

// Generar PDF de Memorandum Oficial
router.get('/memorandum-oficial/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📄 Petición de reporte para Memorandum Oficial #${id}`);

    const report = await jasperService.generateOfficialMemorandumReport(id);

    res.setHeader('Content-Type', report.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=Memorandum_Oficial_${id}.pdf`);
    res.send(report.data);

  } catch (error) {
    console.error('❌ Error en ruta de reporte oficial:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte oficial',
      error: error.message
    });
  }
});

module.exports = router;
