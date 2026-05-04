const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { obtenerFicha, obtenerFichas } = require('../controllers/fichas.controller');

// Todas las rutas requieren autenticacion
router.use(verificarToken);

// GET /fichas → listar resumen de todas las fichas
router.get('/', verificarRol('admin', 'dueño'), obtenerFichas);

// GET /fichas/:trabajadorId → ver ficha completa de un trabajador
router.get('/:trabajadorId', verificarRol('admin', 'dueño'), obtenerFicha);

module.exports = router;