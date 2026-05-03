//vamos a importar los metodos de admin y db, que vienen desde config de firebase
const { admin, db } = require('../config/firebase');

// Creamos el registro, revisar que esten las variables creadas de req y res
const registro = async (req, res) => {
  //En esta constante prestar atencion ya que creamos los parametros que utilizaremos
  //y lo igualamos a la variable request, es decir lo que enviaremos
  const {
    nombre,
    email,
    password,
    rol,
    tipo_documento,
    numero_documento,
    fecha_nacimiento,
    telefono,
    nacionalidad,
    tipo_contrato
  } = req.body;

  try {
    // Vamos a validar que vengan todos los datos (Recordar el signo ! es para negar algo)
    if (!nombre || !email || !password || !rol || !tipo_documento || !numero_documento || !fecha_nacimiento) {
      //Prestar atencion que estamos retornando una respuesta "response"
      //Estamos agregando un status con un numero(esto lo van a buscar en internet para averiguar los numeros de estatus)
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Definimos los roles que estaran en la aplicación
    const rolesPermitidos = ['admin', 'dueño', 'trabajador'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol incorrecto' });
    }

    // Tipos de documento permitidos (rut para chilenos, pasaporte para extranjeros)
    const tiposDocumento = ['rut', 'pasaporte'];
    if (!tiposDocumento.includes(tipo_documento)) {
      return res.status(400).json({ error: 'Tipo de documento no válido' });
    }

    // Validaciones especificas para el rol trabajador
    if (rol === 'trabajador') {
      // La nacionalidad es obligatoria para trabajadores
      if (!nacionalidad) {
        return res.status(400).json({ error: 'La nacionalidad es obligatoria para trabajadores' });
      }
      // El tipo de contrato es obligatorio para trabajadores
      if (!tipo_contrato) {
        return res.status(400).json({ error: 'El tipo de contrato es obligatorio para trabajadores' });
      }
      // Solo se permiten estos dos tipos de contrato
      const contratosPermitidos = ['con_contrato', 'sin_contrato'];
      if (!contratosPermitidos.includes(tipo_contrato)) {
        return res.status(400).json({ error: 'Tipo de contrato no válido' });
      }
    }

    // vamos a crear usuario en Firebase Auth, prestar atencion en el await
    const usuarioFirebase = await admin.auth().createUser({
      email,
      password,
      displayName: nombre
    });

    // Construimos el objeto base del usuario con los campos que todos los roles comparten
    const nuevoUsuario = {
      uid: usuarioFirebase.uid,
      nombre,
      email,
      rol,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono: telefono || null, // Si no viene telefono, guardamos null
      creadoEn: new Date().toISOString()
    };

    // Agregamos campos extras solo si el usuario es trabajador
    if (rol === 'trabajador') {
      nuevoUsuario.nacionalidad = nacionalidad;
      nuevoUsuario.tipo_contrato = tipo_contrato;
    }

    // Guardar datos extras en Firestore (rol, nombre, etc.)
    await db.collection('usuarios').doc(usuarioFirebase.uid).set(nuevoUsuario);

    //retornamos un mensaje
    return res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      uid: usuarioFirebase.uid
    });

    //Capturamos el error
  } catch (error) {
    // errores comunes de Firebase Auth
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    //Agregamos un error en la consola
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Ingreso, tomar en cuenta que estamos trabajando con solo email y password
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hacemos lo mismo de arriba, preguntamos por los datos antes de mandar un error
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    // preguntamos a "Firebase Auth" si el email existe
    const usuarioFirebase = await admin.auth().getUserByEmail(email);

    // obtener datos del usuario desde "Firestore"
    const usuarioDoc = await db.collection('usuarios').doc(usuarioFirebase.uid).get();

    //En caso de no tener la existencia del usuario usamos el famoso 404
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    //Una vez que tengamos los datos de usuarioFirebase, el token, usuarioDoc, vamos a tener la data del usuario
    const usuarioData = usuarioDoc.data();

    // Los trabajadores no tienen acceso al sistema por el momento
    if (usuarioData.rol === 'trabajador') {
      return res.status(403).json({ error: 'Los trabajadores no tienen acceso al sistema' });
    }

    //Creamos un token personalizado para el usuario
    const token = await admin.auth().createCustomToken(usuarioFirebase.uid);

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        uid: usuarioData.uid,
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol
      }
    });

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registro, login };