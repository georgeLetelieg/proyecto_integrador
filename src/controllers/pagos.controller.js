// Importamos db desde firebase
const { db } = require('../config/firebase');

// ─── CALCULAR PAGO ────────────────────────────────────────
const calcularPago = async (req, res) => {
  const { trabajadorId, huertoId, temporadaId, periodo, fechaInicio, fechaFin } = req.body;

  try {
    // Validamos que vengan todos los datos
    if (!trabajadorId || !huertoId || !temporadaId || !periodo || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Solo se permiten estos dos periodos
    const periodosPermitidos = ['quincenal', 'mensual'];
    if (!periodosPermitidos.includes(periodo)) {
      return res.status(400).json({ error: 'Periodo debe ser quincenal o mensual' });
    }

    // Verificamos que la temporada exista y obtengamos los precios
    const temporadaDoc = await db.collection('temporadas').doc(temporadaId).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }

    const temporadaData = temporadaDoc.data();

    // Obtenemos las recolecciones del trabajador en el periodo indicado
    const snapshot = await db.collection('recolecciones')
      .where('trabajadorId', '==', trabajadorId)
      .where('huertoId', '==', huertoId)
      .where('temporadaId', '==', temporadaId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ 
        mensaje: 'No hay recolecciones en este periodo',
        total: 0
      });
    }

    // Filtramos las recolecciones por el rango de fechas
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    const recolecciones = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(r => {
        const fechaRecoleccion = new Date(r.fecha);
        return fechaRecoleccion >= fechaInicioDate && fechaRecoleccion <= fechaFinDate;
      });

    if (recolecciones.length === 0) {
      return res.status(200).json({ 
        mensaje: 'No hay recolecciones en este periodo',
        total: 0
      });
    }

    // Calculamos el total separando bandejas y granel
    let totalBandejas = 0;
    let totalGranel = 0;
    let montoBandejas = 0;
    let montoGranel = 0;

    recolecciones.forEach(r => {
      if (r.tipo === 'bandeja') {
        totalBandejas += r.cantidad;
        montoBandejas += r.cantidad * temporadaData.precio_bandeja;
      } else if (r.tipo === 'granel') {
        totalGranel += r.cantidad;
        montoGranel += r.cantidad * temporadaData.precio_granel;
      }
    });

    const totalMonto = montoBandejas + montoGranel;

    return res.status(200).json({
      trabajadorId,
      huertoId,
      temporadaId,
      periodo,
      fechaInicio,
      fechaFin,
      resumen: {
        totalBandejas,
        precioPorBandeja: temporadaData.precio_bandeja,
        montoBandejas,
        totalKilos: totalGranel,
        precioPorKilo: temporadaData.precio_granel,
        montoGranel,
        totalAPagar: totalMonto
      }
    });

  } catch (error) {
    console.error('Error al calcular pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── REGISTRAR PAGO ───────────────────────────────────────
const registrarPago = async (req, res) => {
  const { trabajadorId, huertoId, temporadaId, periodo, fechaInicio, fechaFin, monto } = req.body;

  try {
    // Validamos que vengan todos los datos
    if (!trabajadorId || !huertoId || !temporadaId || !periodo || !fechaInicio || !fechaFin || !monto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificamos que el trabajador exista
    const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
    if (!trabajadorDoc.exists) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    // Construimos el objeto del pago
    const nuevoPago = {
      trabajadorId,
      huertoId,
      temporadaId,
      periodo,
      fechaInicio,
      fechaFin,
      monto,
      estado: 'pagado',
      pagadoPor: req.usuario.uid,
      fechaPago: new Date().toISOString()
    };

    // Guardamos en Firestore
    const pagoRef = await db.collection('pagos').add(nuevoPago);

    return res.status(201).json({
      mensaje: 'Pago registrado correctamente',
      id: pagoRef.id
    });

  } catch (error) {
    console.error('Error al registrar pago:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── OBTENER TODOS LOS PAGOS ──────────────────────────────
const obtenerPagos = async (req, res) => {
  try {
    const snapshot = await db.collection('pagos').get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const pagos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(pagos);

  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── OBTENER PAGOS POR TRABAJADOR ─────────────────────────
const obtenerPagosPorTrabajador = async (req, res) => {
  const { trabajadorId } = req.params;

  try {
    const snapshot = await db.collection('pagos')
      .where('trabajadorId', '==', trabajadorId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const pagos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(pagos);

  } catch (error) {
    console.error('Error al obtener pagos por trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { calcularPago, registrarPago, obtenerPagos, obtenerPagosPorTrabajador };