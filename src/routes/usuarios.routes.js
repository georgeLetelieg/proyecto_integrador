const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  editarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios.controller');

// Todas las rutas requieren autenticacion
router.use(verificarToken);

// GET /usuarios - solo admin puede ver todos
router.get('/', verificarRol('admin'), obtenerUsuarios);

// GET /usuarios/:id - admin y dueño pueden ver uno
router.get('/:id', verificarRol('admin', 'dueño'), obtenerUsuarioPorId);

// PUT /usuarios/:id - admin puede editar cualquiera
router.put('/:id', verificarRol('admin'), editarUsuario);

// DELETE /usuarios/:id - solo admin puede eliminar
router.delete('/:id', verificarRol('admin'), eliminarUsuario);

module.exports = router;