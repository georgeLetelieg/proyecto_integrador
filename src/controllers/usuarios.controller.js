// Importamos admin y db desde firebase
const { admin, db } = require('../config/firebase');

const obtenerUsuarios = async (req, res) => {
  try {
    const snapshot = await db.collection('usuarios').get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    // Mapeamos los documentos, pero nunca devolvemos el password
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(usuarios);

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioDoc = await db.collection('usuarios').doc(id).get();

    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      id: usuarioDoc.id,
      ...usuarioDoc.data()
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, fecha_nacimiento, tipo_contrato, nacionalidad } = req.body;

  try {
    // Verificamos que el usuario exista
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Construimos solo los campos que llegaron para actualizar
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (telefono) datosActualizados.telefono = telefono;
    if (fecha_nacimiento) datosActualizados.fecha_nacimiento = fecha_nacimiento;
    if (tipo_contrato) datosActualizados.tipo_contrato = tipo_contrato;
    if (nacionalidad) datosActualizados.nacionalidad = nacionalidad;

    // Verificamos que haya algo que actualizar
    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    // Actualizamos en Firestore
    await db.collection('usuarios').doc(id).update(datosActualizados);

    // Si cambio el nombre, actualizamos tambien en Firebase Auth
    if (nombre) {
      await admin.auth().updateUser(id, { displayName: nombre });
    }

    return res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error al editar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificamos que el usuario exista
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitimos que un usuario se elimine a si mismo
    if (id === req.usuario.uid) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }

    // Eliminamos de Firebase Auth y de Firestore
    await admin.auth().deleteUser(id);
    await db.collection('usuarios').doc(id).delete();

    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, editarUsuario, eliminarUsuario };