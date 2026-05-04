const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  registrarRecoleccion,
  obtenerRecolecciones,
  obtenerRecoleccionesPorTrabajador,
  obtenerRecoleccionesPorTemporada
} = require('../controllers/recolecciones.controller');

// Todas las rutas requieren autenticacion
router.use(verificarToken);

// POST /recolecciones → registrar recoleccion
router.post('/', verificarRol('admin', 'dueño'), registrarRecoleccion);

// GET /recolecciones → listar todas
router.get('/', verificarRol('admin', 'dueño'), obtenerRecolecciones);

// GET /recolecciones/trabajador/:trabajadorId → por trabajador
router.get('/trabajador/:trabajadorId', verificarRol('admin', 'dueño'), obtenerRecoleccionesPorTrabajador);

// GET /recolecciones/temporada/:temporadaId → por temporada
router.get('/temporada/:temporadaId', verificarRol('admin', 'dueño'), obtenerRecoleccionesPorTemporada);

module.exports = router;