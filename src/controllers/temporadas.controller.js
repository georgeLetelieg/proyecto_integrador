// Importamos db desde firebase
const { db } = require('../config/firebase');

// Creamos la temporada
const crearTemporada = async (req, res) => {
  const { huertoId, fruta, fechaInicio, precio_bandeja, precio_granel } = req.body;

  try {
    // Validamos que vengan los datos obligatorios
    if (!huertoId || !fruta || !fechaInicio || !precio_bandeja || !precio_granel) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios incluyendo precios' });
    }

    // Validamos que los precios sean numeros positivos
    if (precio_bandeja <= 0 || precio_granel <= 0) {
      return res.status(400).json({ error: 'Los precios deben ser mayores a 0' });
    }

    // Verificamos que el huerto exista
    const huertoDoc = await db.collection('huertos').doc(huertoId).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }

    // Verificamos que el huerto no tenga una temporada activa
    const temporadaActiva = await db.collection('temporadas')
      .where('huertoId', '==', huertoId)
      .where('estado', '==', 'activa')
      .get();

    if (!temporadaActiva.empty) {
      return res.status(400).json({ 
        error: 'El huerto ya tiene una temporada activa' 
      });
    }

    // Construimos el objeto de la temporada con precios
    const nuevaTemporada = {
      huertoId,
      fruta,
      fechaInicio,
      fechaFin: null,
      precio_bandeja,
      precio_granel,
      estado: 'activa',
      creadoPor: req.usuario.uid,
      creadoEn: new Date().toISOString()
    };

    const temporadaRef = await db.collection('temporadas').add(nuevaTemporada);

    return res.status(201).json({
      mensaje: 'Temporada creada correctamente',
      id: temporadaRef.id
    });

  } catch (error) {
    console.error('Error al crear temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listamos todas las temporadas
const obtenerTemporadas = async (req, res) => {
    try {
        const snapshot = await db.collection('temporadas').get();

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const temporadas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(temporadas);

    } catch (error) {
        console.error('Error al obtener temporadas:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtenemos la temporada gracias al id
const obtenerTemporadaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const temporadaDoc = await db.collection('temporadas').doc(id).get();

        if (!temporadaDoc.exists) {
            return res.status(404).json({ error: 'Temporada no encontrada' });
        }

        return res.status(200).json({
            id: temporadaDoc.id,
            ...temporadaDoc.data()
        });

    } catch (error) {
        console.error('Error al obtener temporada:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Fin de temporada
const cerrarTemporada = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificamos que la temporada exista
        const temporadaDoc = await db.collection('temporadas').doc(id).get();
        if (!temporadaDoc.exists) {
            return res.status(404).json({ error: 'Temporada no encontrada' });
        }

        const temporadaData = temporadaDoc.data();

        // Verificamos que la temporada este activa
        if (temporadaData.estado !== 'activa') {
            return res.status(400).json({ error: 'La temporada ya esta cerrada' });
        }

        // Cerramos la temporada agregando la fecha de fin y cambiando el estado
        await db.collection('temporadas').doc(id).update({
            estado: 'cerrada',
            fechaFin: new Date().toISOString()
        });

        return res.status(200).json({ mensaje: 'Temporada cerrada correctamente' });

    } catch (error) {
        console.error('Error al cerrar temporada:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { crearTemporada, obtenerTemporadas, obtenerTemporadaPorId, cerrarTemporada };