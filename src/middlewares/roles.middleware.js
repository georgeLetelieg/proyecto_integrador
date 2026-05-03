const { db } = require('../config/firebase');

const verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      // obtener el uid del usuario que viene del middleware anterior
      const uid = req.usuario.uid;

      // buscamos el usuario en Firestore para obtener su rol
      const usuarioDoc = await db.collection('usuarios').doc(uid).get();

      //verificamos si existe
      if (!usuarioDoc.exists) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { rol } = usuarioDoc.data();

      // vamos a verificar si su rol esta permitido
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ 
          error: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}` 
        });
      }

      // adjuntar el rol a la peticion, ya que lo usaremos despoues
      req.rol = rol;

      // Todo ok, continuar
      next(); 

    } catch (error) {
      console.error('Error verificando rol:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

module.exports = { verificarRol };