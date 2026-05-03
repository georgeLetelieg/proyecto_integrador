const { admin } = require('../config/firebase');

//Seguimos usando el request y rest, pero agregamos una variable llamada next
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  try {
    // vamos a verificar que venga el header "Authorization"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // debemos extraer el token del header
    // El header viene así: "Bearer eyJhbGci..."
    const token = authHeader.split(' ')[1];

    // verificar el token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // adjuntar los datos del usuario a la petición
    req.usuario = decodedToken;
    
    //odo ok, continuar al controlador
    next(); 


  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expirado, vuelve a iniciar sesión' });
    }
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'No autorizado' });
  }
  
};

module.exports = { verificarToken };