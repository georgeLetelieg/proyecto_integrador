const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { 
  crearHuerto, 
  obtenerHuertos, 
  obtenerHuertoPorId, 
  editarHuerto, 
  eliminarHuerto 
} = require('../controllers/huertos.controller');

// Cualquier ruta de huertos requiere estar autenticado
router.use(verificarToken);

// POST /huertos solo admin y dueño pueden crear
router.post('/', verificarRol('admin', 'dueño'), crearHuerto);

// GET /huertos admin y dueño pueden ver todos
router.get('/', verificarRol('admin', 'dueño'), obtenerHuertos);

// GET /huertos/:id admin y dueño pueden ver uno
router.get('/:id', verificarRol('admin', 'dueño'), obtenerHuertoPorId);

// PUT /huertos/:id admin y dueño pueden editar
router.put('/:id', verificarRol('admin', 'dueño'), editarHuerto);

// DELETE /huertos/:id solo admin puede eliminar
router.delete('/:id', verificarRol('admin'), eliminarHuerto);

module.exports = router;