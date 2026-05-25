const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  editarUsuario,
  eliminarUsuario,
  desactivarUsuario
} = require('../controllers/usuarios.controller');

router.use(verificarToken);
router.get('/', verificarRol('admin', 'dueño'), obtenerUsuarios);
router.get('/:id', verificarRol('admin', 'dueño'), obtenerUsuarioPorId);
router.put('/:id', verificarRol('admin'), editarUsuario);
router.delete('/:id', verificarRol('admin', 'dueño'), eliminarUsuario);
router.put('/:id/desactivar', verificarRol('admin', 'dueño'), desactivarUsuario);

module.exports = router;