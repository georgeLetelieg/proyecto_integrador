const { db } = require('../config/firebase');

const registrarVenta = async (req, res) => {
  const { comprador, fecha, especie, cantidad, precioVenta } = req.body;

  try {
    if (!comprador || !fecha || !especie || !cantidad || !precioVenta) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (cantidad <= 0 || precioVenta <= 0) {
      return res.status(400).json({ error: 'Cantidad y precio deben ser mayores a 0' });
    }

    // No permitimos fechas futuras
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha > hoy) {
      return res.status(400).json({ error: 'No puedes registrar ventas en fechas futuras' });
    }

    const nuevaVenta = {
      comprador,
      fecha,
      especie,
      cantidad: Number(cantidad),
      precioVenta: Number(precioVenta),
      totalVenta: Number(cantidad) * Number(precioVenta),
      registradoPor: req.usuario.uid,
      duenoId: req.usuario.uid,
      creadoEn: new Date().toISOString()
    };

    const ventaRef = await db.collection('ventas').add(nuevaVenta);

    return res.status(201).json({
      mensaje: 'Venta registrada correctamente',
      id: ventaRef.id
    });

  } catch (error) {
    console.error('Error al registrar venta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerVentas = async (req, res) => {
  try {
    let snapshot;

    // Admin ve todas, dueño solo las suyas
    if (req.usuario.rol === 'admin') {
      snapshot = await db.collection('ventas').get();
    } else {
      snapshot = await db.collection('ventas')
        .where('duenoId', '==', req.usuario.uid)
        .get();
    }

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const ventas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(ventas);

  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const ventaDoc = await db.collection('ventas').doc(id).get();
    if (!ventaDoc.exists) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    await db.collection('ventas').doc(id).delete();
    return res.status(200).json({ mensaje: 'Venta eliminada correctamente' });

  } catch (error) {
    console.error('Error al eliminar venta:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registrarVenta, obtenerVentas, eliminarVenta };