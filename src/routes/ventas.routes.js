const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { registrarVenta, obtenerVentas, eliminarVenta } = require('../controllers/ventas.controller');

router.use(verificarToken);

router.post('/', verificarRol('admin', 'dueño'), registrarVenta);
router.get('/', verificarRol('admin', 'dueño'), obtenerVentas);
router.delete('/:id', verificarRol('admin', 'dueño'), eliminarVenta);

module.exports = router;