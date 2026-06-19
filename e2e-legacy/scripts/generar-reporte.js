const { generarReportes } = require('./utils/reporter');
const path = require('path');

const reportsDir = path.resolve(__dirname, 'reports');
generarReportes(reportsDir);
console.log('✅ Reportes de usabilidad generados en:', reportsDir);
