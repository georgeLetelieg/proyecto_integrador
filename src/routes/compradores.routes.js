const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { crearComprador, obtenerCompradores, eliminarComprador } = require('../controllers/compradores.controller');

router.use(verificarToken);
router.post('/', verificarRol('admin', 'dueño'), crearComprador);
router.get('/', verificarRol('admin', 'dueño'), obtenerCompradores);
router.delete('/:id', verificarRol('admin', 'dueño'), eliminarComprador);

module.exports = router;