const axios = require('axios');
const pool = require('../config/database');
const { formatCurrencyMXN } = require('../utils/numberToWords');

class JasperService {
  constructor() {
    this.jasperServerUrl = process.env.JASPER_SERVER_URL || 'http://172.16.35.75:3015';
    this.credentials = {
      username: process.env.JASPER_USERNAME || 'jasperadmin',
      password: process.env.JASPER_PASSWORD || 'jasperadmin'
    };

    console.log('🔧 JasperService inicializado');
    console.log('📍 URL:', this.jasperServerUrl);
  }

  // Autenticación
  async authenticate() {
    try {
      console.log('🔐 Autenticando con JasperReports...');
      const loginUrl = `${this.jasperServerUrl}/login`;
      
      const response = await axios.post(
        loginUrl,
        null,
        {
          auth: this.credentials,
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400
        }
      );

      console.log('✅ Autenticación exitosa');
      return response.headers['set-cookie'];
    } catch (error) {
      console.error('❌ Error de autenticación:', error.message);
      throw new Error('No se pudo conectar con JasperReports Server');
    }
  }

  // Generar reporte genérico
  async generateReport(reportPath, format = 'pdf', parameters = {}) {
    try {
      console.log('📊 Generando reporte:', reportPath);
      const cookies = await this.authenticate();

      const params = new URLSearchParams();
      Object.keys(parameters).forEach(key => {
        if (parameters[key] !== null && parameters[key] !== undefined) {
          params.append(key, parameters[key]);
        }
      });

      const cleanPath = reportPath.startsWith('/') ? reportPath.substring(1) : reportPath;
      const pathSegments = cleanPath.split('/');
      const encodedPath = pathSegments.map(segment => encodeURIComponent(segment)).join('/');

      const reportUrl = `${this.jasperServerUrl}/rest_v2/reports/${encodedPath}.${format}`;
      const fullUrl = params.toString() ? `${reportUrl}?${params.toString()}` : reportUrl;

      console.log('🚀 Llamando a JasperServer:', fullUrl);

      const headers = { 'Accept': this.getAcceptHeader(format) };
      if (cookies && cookies.length > 0) {
        headers['Cookie'] = cookies.join('; ');
      }

      const response = await axios.get(fullUrl, {
        auth: this.credentials,
        headers: headers,
        responseType: 'arraybuffer',
        timeout: 60000
      });

      return {
        success: true,
        data: response.data,
        contentType: this.getContentType(format),
        filename: `reporte_${Date.now()}.${format}`
      };
    } catch (error) {
      console.error('❌ Error generando reporte:', error.message);
      throw new Error(`Error al generar reporte: ${error.message}`);
    }
  }

  // Especializado para Memorandum de Comisión
  async generateMemorandumReport(idMemorandum) {
    try {
      // 1. Calcular el total para convertirlo a letras
      const totalQuery = `
        SELECT (
          COALESCE((SELECT SUM(monto_calculado) FROM viaticos.detalles_viaticos WHERE id_memorandum_comision = $1), 0) +
          COALESCE((SELECT SUM(pasaje + combustible + otros) FROM viaticos.detalles_viaticos WHERE id_memorandum_comision = $1), 0) +
          COALESCE((SELECT SUM(pasaje + combustible + otros) FROM viaticos.gastos_globales_memorandum WHERE id_memorandum_comision = $1 AND esta_borrado = false), 0)
        ) as total
      `;
      const result = await pool.query(totalQuery, [idMemorandum]);
      const total = parseFloat(result.rows[0].total || 0);
      const totalTexto = formatCurrencyMXN(total);

      console.log(`💰 Total calculado: ${total} -> ${totalTexto}`);

      const reportPath = '/Reportes_del_sistema_de_viaticos/memoradum_de_comision_';
      const parameters = { 
        ID_MEMORANDUM: idMemorandum, 
        TOTAL_TEXTO: totalTexto 
      };
      return await this.generateReport(reportPath, 'pdf', parameters);
    } catch (error) {
      console.error('❌ Error en generateMemorandumReport:', error.message);
      throw error;
    }
  }

  // Especializado para Memorandum Oficial
  async generateOfficialMemorandumReport(idMemorandum) {
    try {
      const reportPath = '/Reportes_del_sistema_de_viaticos/reporte_actividad';
      const parameters = { 
        id_memo: idMemorandum
      };
      return await this.generateReport(reportPath, 'pdf', parameters);
    } catch (error) {
      console.error('❌ Error en generateOfficialMemorandumReport:', error.message);
      throw error;
    }
  }

  getContentType(format) {
    const types = { 'pdf': 'application/pdf', 'html': 'text/html', 'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    return types[format] || 'application/octet-stream';
  }

  getAcceptHeader(format) {
    const headers = { 'pdf': 'application/pdf', 'html': 'text/html', 'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    return headers[format] || 'application/octet-stream';
  }
}

module.exports = new JasperService();
