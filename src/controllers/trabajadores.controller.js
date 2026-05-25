const { db } = require('../config/firebase');

const obtenerTrabajadoresLibres = async (req, res) => {
  try {
    // Obtenemos todos los trabajadores
    const usuariosSnapshot = await db.collection('usuarios')
      .where('rol', '==', 'trabajador')
      .get();

    if (usuariosSnapshot.empty) {
      return res.status(200).json([]);
    }

    // Obtenemos todos los huertos
    const huertosSnapshot = await db.collection('huertos').get();

    // Trabajadores ocupados en cualquier huerto
    const trabajadoresOcupados = new Set();

    huertosSnapshot.docs.forEach(doc => {
      const activos = doc.data().trabajadoresActivos || [];
      activos.forEach(uid => trabajadoresOcupados.add(uid));
    });

    // Solo devolvemos los que no están en ningún huerto
    const trabajadoresLibres = usuariosSnapshot.docs
  .map(doc => ({ uid: doc.id, ...doc.data() }))
  .filter(t => !trabajadoresOcupados.has(t.uid) && t.activo !== false);

    return res.status(200).json(trabajadoresLibres);

  } catch (error) {
    console.error('Error al obtener trabajadores libres:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerMisTrabajadores = async (req, res) => {
  try {
    let huertosSnapshot;

    if (req.usuario.rol === 'admin') {
      huertosSnapshot = await db.collection('huertos').get();
    } else {
      huertosSnapshot = await db.collection('huertos')
        .where('duenoId', '==', req.usuario.uid)
        .get();
    }

    if (huertosSnapshot.empty) {
      return res.status(200).json([]);
    }

    // Recopilamos todos los trabajadores únicos con sus huertos
    const trabajadoresMap = new Map();

    await Promise.all(
      huertosSnapshot.docs.map(async doc => {
        const huertoData = doc.data();
        const activos = huertoData.trabajadoresActivos || [];

        await Promise.all(
          activos.map(async trabajadorId => {
            if (!trabajadoresMap.has(trabajadorId)) {
              const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
              if (trabajadorDoc.exists && trabajadorDoc.data().activo !== false) {
                  trabajadoresMap.set(trabajadorId, {
                    uid: trabajadorDoc.id,
                    ...trabajadorDoc.data(),
                    huertos: []
                  });
                }
            }
            if (trabajadoresMap.has(trabajadorId)) {
              trabajadoresMap.get(trabajadorId).huertos.push({
                huertoId: doc.id,
                huertoNombre: huertoData.nombre
              });
            }
          })
        );
      })
    );

    return res.status(200).json(Array.from(trabajadoresMap.values()));

  } catch (error) {
    console.error('Error al obtener mis trabajadores:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerTrabajadoresLibres, obtenerMisTrabajadores };