const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { obtenerReporte, obtenerUltimosIngresos, obtenerReporteTemporada } = require('../controllers/reportes.controller');

router.use(verificarToken);
router.get('/', verificarRol('admin'), obtenerReporte);
router.get('/ultimos-ingresos', verificarRol('admin'), obtenerUltimosIngresos);
router.get('/temporada/:temporadaId', verificarRol('admin', 'dueño'), obtenerReporteTemporada);

module.exports = router;