const { db } = require('../config/firebase');

const obtenerReporte = async (req, res) => {
  const { duenoId, especie, temporadaId } = req.query;

  try {
    // Solo el admin puede ver reportes globales
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    let recoleccionesSnapshot = await db.collection('recolecciones').get();
    let recolecciones = recoleccionesSnapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    let ventasSnapshot = await db.collection('ventas').get();
    let ventas = ventasSnapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    let pagosSnapshot = await db.collection('pagos').get();
    let pagos = pagosSnapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    if (duenoId) {
      recolecciones = recolecciones.filter(r => r.registradoPor === duenoId);
      ventas = ventas.filter(v => v.duenoId === duenoId);
      pagos = pagos.filter(p => p.pagadoPor === duenoId);
    }

    if (especie) {
      recolecciones = recolecciones.filter(r => {
        // Buscamos la temporada para obtener la fruta
        return true; // lo resolveremos con el join abajo
      });
      ventas = ventas.filter(v =>
        v.especie.toLowerCase().includes(especie.toLowerCase())
      );
    }

    if (temporadaId) {
      recolecciones = recolecciones.filter(r => r.temporadaId === temporadaId);
      pagos = pagos.filter(p => p.temporadaId === temporadaId);
    }

    const totalBandejas = recolecciones
      .filter(r => r.tipo === 'bandeja')
      .reduce((acc, r) => acc + r.cantidad, 0);

    const totalKilosRecolectados = recolecciones
      .filter(r => r.tipo === 'granel')
      .reduce((acc, r) => acc + r.cantidad, 0);

    const totalVentas = ventas.reduce((acc, v) => acc + v.totalVenta, 0);
    const totalKilosVendidos = ventas.reduce((acc, v) => acc + v.cantidad, 0);
    const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);

    const ventasPorEspecie = ventas.reduce((acc, v) => {
      if (!acc[v.especie]) {
        acc[v.especie] = { especie: v.especie, cantidad: 0, total: 0 };
      }
      acc[v.especie].cantidad += v.cantidad;
      acc[v.especie].total += v.totalVenta;
      return acc;
    }, {});

    return res.status(200).json({
      resumen: {
        totalRecolecciones: recolecciones.length,
        totalBandejas,
        totalKilosRecolectados,
        totalVentas,
        totalKilosVendidos,
        totalPagado,
        cantidadVentas: ventas.length,
        cantidadPagos: pagos.length
      },
      ventasPorEspecie: Object.values(ventasPorEspecie),
      recolecciones,
      ventas,
      pagos
    });

  } catch (error) {
    console.error('Error al generar reporte:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Reporte de ultimos ingresos para el dashboard del admin
const obtenerUltimosIngresos = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const snapshot = await db.collection('recolecciones').get();
    const recolecciones = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 10); // ultimos 10

    return res.status(200).json(recolecciones);

  } catch (error) {
    console.error('Error al obtener ultimos ingresos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerReporteTemporada = async (req, res) => {
  const { temporadaId } = req.params;

  try {
    // Verificamos que la temporada exista
    const temporadaDoc = await db.collection('temporadas').doc(temporadaId).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }

    const temporadaData = temporadaDoc.data();

    // Verificamos que el productor solo vea su propia temporada
    if (req.usuario.rol !== 'admin' && temporadaData.creadoPor !== req.usuario.uid) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Obtenemos el huerto de la temporada
    const huertoDoc = await db.collection('huertos').doc(temporadaData.huertoId).get();
    const huertoData = huertoDoc.exists ? huertoDoc.data() : {};

    const recoleccionesSnapshot = await db.collection('recolecciones')
      .where('temporadaId', '==', temporadaId)
      .get();

    const recolecciones = recoleccionesSnapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    const pagosSnapshot = await db.collection('pagos')
      .where('temporadaId', '==', temporadaId)
      .get();

    const pagos = pagosSnapshot.docs.map(doc => ({
      id: doc.id, ...doc.data()
    }));

    const ventasSnapshot = await db.collection('ventas')
      .where('duenoId', '==', req.usuario.rol === 'admin' 
        ? temporadaData.creadoPor 
        : req.usuario.uid)
      .get();

    const ventas = ventasSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(v => v.especie === temporadaData.fruta);

    const totalBandejas = recolecciones
      .filter(r => r.tipo === 'bandeja')
      .reduce((acc, r) => acc + r.cantidad, 0);

    const totalKilos = recolecciones
      .filter(r => r.tipo === 'granel')
      .reduce((acc, r) => acc + r.cantidad, 0);

    const totalVentas = ventas.reduce((acc, v) => acc + v.totalVenta, 0);
    const totalKilosVendidos = ventas.reduce((acc, v) => acc + v.cantidad, 0);
    const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);

    const trabajadoresMap = new Map();

    recolecciones.forEach(r => {
      if (!trabajadoresMap.has(r.trabajadorId)) {
        trabajadoresMap.set(r.trabajadorId, {
          trabajadorId: r.trabajadorId,
          totalBandejas: 0,
          totalKilos: 0,
          totalPagado: 0
        });
      }
      const t = trabajadoresMap.get(r.trabajadorId);
      if (r.tipo === 'bandeja') t.totalBandejas += r.cantidad;
      if (r.tipo === 'granel') t.totalKilos += r.cantidad;
    });

    pagos.forEach(p => {
      if (trabajadoresMap.has(p.trabajadorId)) {
        trabajadoresMap.get(p.trabajadorId).totalPagado += p.monto;
      }
    });

    // Obtenemos los nombres de los trabajadores
    const detalleTrabajadores = await Promise.all(
      Array.from(trabajadoresMap.values()).map(async t => {
        const trabajadorDoc = await db.collection('usuarios').doc(t.trabajadorId).get();
        const nombre = trabajadorDoc.exists ? trabajadorDoc.data().nombre : 'Desconocido';
        return { ...t, nombre };
      })
    );

    const ventasPorEspecie = ventas.reduce((acc, v) => {
      if (!acc[v.especie]) {
        acc[v.especie] = { especie: v.especie, cantidad: 0, total: 0 };
      }
      acc[v.especie].cantidad += v.cantidad;
      acc[v.especie].total += v.totalVenta;
      return acc;
    }, {});

    return res.status(200).json({
      temporada: {
        id: temporadaId,
        fruta: temporadaData.fruta,
        fechaInicio: temporadaData.fechaInicio,
        fechaFin: temporadaData.fechaFin || null,
        estado: temporadaData.estado,
        anio: temporadaData.anio,
        huerto: huertoData.nombre || 'Desconocido',
        precioBandeja: temporadaData.precio_bandeja,
        precioGranel: temporadaData.precio_granel
      },
      resumen: {
        totalRecolecciones: recolecciones.length,
        totalBandejas,
        totalKilos,
        totalVentas,
        totalKilosVendidos,
        totalPagado,
        cantidadVentas: ventas.length,
        cantidadPagos: pagos.length,
        balance: totalVentas - totalPagado
      },
      detalleTrabajadores,
      ventasPorEspecie: Object.values(ventasPorEspecie),
      ventas,
      pagos
    });

  } catch (error) {
    console.error('Error al generar reporte de temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerReporte, obtenerUltimosIngresos, obtenerReporteTemporada };