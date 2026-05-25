const { db } = require('../config/firebase');

const crearComprador = async (req, res) => {
  const { nombre, tipo, telefono, email } = req.body;

  try {
    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'Nombre y tipo son obligatorios' });
    }

    const tiposPermitidos = ['empresa', 'persona'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser empresa o persona' });
    }

    const nuevoComprador = {
      nombre,
      tipo,
      telefono: telefono || null,
      email: email || null,
      duenoId: req.usuario.uid,
      creadoEn: new Date().toISOString()
    };

    const compradorRef = await db.collection('compradores').add(nuevoComprador);

    return res.status(201).json({
      mensaje: 'Comprador creado correctamente',
      id: compradorRef.id
    });

  } catch (error) {
    console.error('Error al crear comprador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerCompradores = async (req, res) => {
  try {
    let snapshot;

    if (req.usuario.rol === 'admin') {
      snapshot = await db.collection('compradores').get();
    } else {
      snapshot = await db.collection('compradores')
        .where('duenoId', '==', req.usuario.uid)
        .get();
    }

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const compradores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(compradores);

  } catch (error) {
    console.error('Error al obtener compradores:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarComprador = async (req, res) => {
  const { id } = req.params;

  try {
    const compradorDoc = await db.collection('compradores').doc(id).get();
    if (!compradorDoc.exists) {
      return res.status(404).json({ error: 'Comprador no encontrado' });
    }

    await db.collection('compradores').doc(id).delete();
    return res.status(200).json({ mensaje: 'Comprador eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar comprador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearComprador, obtenerCompradores, eliminarComprador };