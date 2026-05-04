const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  calcularPago,
  registrarPago,
  obtenerPagos,
  obtenerPagosPorTrabajador
} = require('../controllers/pagos.controller');

// Todas las rutas requieren autenticacion
router.use(verificarToken);

// POST /pagos/calcular → calcular pago sin registrarlo
router.post('/calcular', verificarRol('admin', 'dueño'), calcularPago);

// POST /pagos → registrar pago efectuado
router.post('/', verificarRol('admin', 'dueño'), registrarPago);

// GET /pagos → listar todos los pagos
router.get('/', verificarRol('admin', 'dueño'), obtenerPagos);

// GET /pagos/trabajador/:trabajadorId → pagos por trabajador
router.get('/trabajador/:trabajadorId', verificarRol('admin', 'dueño'), obtenerPagosPorTrabajador);

module.exports = router;