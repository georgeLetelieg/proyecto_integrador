// Importamos db desde firebase
const { db } = require('../config/firebase');

const obtenerFicha = async (req, res) => {
  const { trabajadorId } = req.params;

  try {
    // Verificamos que el trabajador exista y sea del rol correcto
    const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
    if (!trabajadorDoc.exists) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    const trabajadorData = trabajadorDoc.data();
    if (trabajadorData.rol !== 'trabajador') {
      return res.status(400).json({ error: 'El usuario no es un trabajador' });
    }

    // Obtenemos el historial de huertos donde ha trabajado
    const huertosSnapshot = await db.collection('huertos')
      .where('trabajadorActivoId', '==', trabajadorId)
      .get();

    const huertos = huertosSnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      ubicacion: doc.data().ubicacion
    }));

    // Obtenemos todas las recolecciones del trabajador
    const recoleccionesSnapshot = await db.collection('recolecciones')
      .where('trabajadorId', '==', trabajadorId)
      .get();

    const recolecciones = recoleccionesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculamos estadisticas generales
    let totalBandejas = 0;
    let totalKilos = 0;

    recolecciones.forEach(r => {
      if (r.tipo === 'bandeja') totalBandejas += r.cantidad;
      if (r.tipo === 'granel') totalKilos += r.cantidad;
    });

    // Obtenemos el historial de pagos del trabajador
    const pagosSnapshot = await db.collection('pagos')
      .where('trabajadorId', '==', trabajadorId)
      .get();

    const pagos = pagosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculamos el total recibido en pagos
    const totalRecibido = pagos.reduce((acc, pago) => acc + pago.monto, 0);

    // Construimos la ficha completa del trabajador
    const ficha = {
      trabajador: {
        uid: trabajadorData.uid,
        nombre: trabajadorData.nombre,
        email: trabajadorData.email,
        tipo_documento: trabajadorData.tipo_documento,
        numero_documento: trabajadorData.numero_documento,
        fecha_nacimiento: trabajadorData.fecha_nacimiento,
        telefono: trabajadorData.telefono,
        nacionalidad: trabajadorData.nacionalidad,
        tipo_contrato: trabajadorData.tipo_contrato,
        creadoEn: trabajadorData.creadoEn
      },
      huertosActivos: huertos,
      estadisticas: {
        totalRecolecciones: recolecciones.length,
        totalBandejas,
        totalKilos,
        totalPagos: pagos.length,
        totalRecibido
      },
      historialRecolecciones: recolecciones,
      historialPagos: pagos
    };

    return res.status(200).json(ficha);

  } catch (error) {
    console.error('Error al obtener ficha:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerFichas = async (req, res) => {
  try {
    // Obtenemos todos los trabajadores
    const snapshot = await db.collection('usuarios')
      .where('rol', '==', 'trabajador')
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    // Para cada trabajador construimos un resumen de su ficha
    const fichas = await Promise.all(snapshot.docs.map(async doc => {
      const trabajadorData = doc.data();

      // Obtenemos recolecciones del trabajador
      const recoleccionesSnapshot = await db.collection('recolecciones')
        .where('trabajadorId', '==', doc.id)
        .get();

      let totalBandejas = 0;
      let totalKilos = 0;

      recoleccionesSnapshot.docs.forEach(r => {
        const data = r.data();
        if (data.tipo === 'bandeja') totalBandejas += data.cantidad;
        if (data.tipo === 'granel') totalKilos += data.cantidad;
      });

      // Obtenemos pagos del trabajador
      const pagosSnapshot = await db.collection('pagos')
        .where('trabajadorId', '==', doc.id)
        .get();

      const totalRecibido = pagosSnapshot.docs.reduce((acc, pago) => {
        return acc + pago.data().monto;
      }, 0);

      return {
        uid: trabajadorData.uid,
        nombre: trabajadorData.nombre,
        nacionalidad: trabajadorData.nacionalidad,
        tipo_contrato: trabajadorData.tipo_contrato,
        estadisticas: {
          totalRecolecciones: recoleccionesSnapshot.size,
          totalBandejas,
          totalKilos,
          totalPagos: pagosSnapshot.size,
          totalRecibido
        }
      };
    }));

    return res.status(200).json(fichas);

  } catch (error) {
    console.error('Error al obtener fichas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerFicha, obtenerFichas };