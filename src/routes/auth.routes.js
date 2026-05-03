const express = require('express');
const router = express.Router();
const { registro, login } = require('../controllers/auth.controllers');


//El manejo returas de momento lo estaremos haciendo de esta forma:

// POST /auth/registro
router.post('/registro', registro);
// POST /auth/login
router.post('/login', login);

module.exports = router;


