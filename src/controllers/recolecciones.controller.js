// Importamos db desde firebase
const { db } = require('../config/firebase');

const registrarRecoleccion = async (req, res) => {
  const { trabajadorId, huertoId, temporadaId, tipo, cantidad } = req.body;

  try {
    // Validamos que vengan todos los datos
    if (!trabajadorId || !huertoId || !temporadaId || !tipo || !cantidad) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Solo se permiten estos dos tipos de recoleccion
    const tiposPermitidos = ['bandeja', 'granel'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser bandeja o granel' });
    }

    // Validamos que la cantidad sea un numero positivo
    if (cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    // Verificamos que el trabajador exista y sea del rol correcto
    const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
    if (!trabajadorDoc.exists || trabajadorDoc.data().rol !== 'trabajador') {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    // Verificamos que el huerto exista
    const huertoDoc = await db.collection('huertos').doc(huertoId).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }

    // Verificamos que el trabajador este asignado a ese huerto
    const huertoData = huertoDoc.data();
    if (huertoData.trabajadorActivoId !== trabajadorId) {
      return res.status(400).json({ 
        error: 'El trabajador no esta asignado a este huerto' 
      });
    }

    // Verificamos que la temporada exista y este activa
    const temporadaDoc = await db.collection('temporadas').doc(temporadaId).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }

    const temporadaData = temporadaDoc.data();
    if (temporadaData.estado !== 'activa') {
      return res.status(400).json({ error: 'La temporada no esta activa' });
    }

    // Verificamos que la temporada pertenezca al huerto
    if (temporadaData.huertoId !== huertoId) {
      return res.status(400).json({ 
        error: 'La temporada no pertenece a este huerto' 
      });
    }

    // Construimos el objeto de la recoleccion
    const nuevaRecoleccion = {
      trabajadorId,
      huertoId,
      temporadaId,
      tipo,           // bandeja o granel
      cantidad,       // numero de bandejas o kilos
      fecha: new Date().toISOString(),
      registradoPor: req.usuario.uid
    };

    // Guardamos en Firestore
    const recoleccionRef = await db.collection('recolecciones').add(nuevaRecoleccion);

    return res.status(201).json({
      mensaje: 'Recoleccion registrada correctamente',
      id: recoleccionRef.id
    });

  } catch (error) {
    console.error('Error al registrar recoleccion:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerRecolecciones = async (req, res) => {
  try {
    const snapshot = await db.collection('recolecciones').get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const recolecciones = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(recolecciones);

  } catch (error) {
    console.error('Error al obtener recolecciones:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerRecoleccionesPorTrabajador = async (req, res) => {
  const { trabajadorId } = req.params;

  try {
    const snapshot = await db.collection('recolecciones')
      .where('trabajadorId', '==', trabajadorId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const recolecciones = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(recolecciones);

  } catch (error) {
    console.error('Error al obtener recolecciones por trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerRecoleccionesPorTemporada = async (req, res) => {
  const { temporadaId } = req.params;

  try {
    const snapshot = await db.collection('recolecciones')
      .where('temporadaId', '==', temporadaId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const recolecciones = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(recolecciones);

  } catch (error) {
    console.error('Error al obtener recolecciones por temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { 
  registrarRecoleccion, 
  obtenerRecolecciones, 
  obtenerRecoleccionesPorTrabajador,
  obtenerRecoleccionesPorTemporada
};