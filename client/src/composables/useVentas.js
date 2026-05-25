import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useVentas() {
  const ventas = ref([]);
  const compradores = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const error = ref('');

  const form = ref({
    compradorId: '',
    comprador: '',
    fecha: new Date().toISOString().split('T')[0],
    especie: '',
    cantidad: '',
    precioVenta: ''
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      compradorId: '', comprador: '',
      fecha: new Date().toISOString().split('T')[0],
      especie: '', cantidad: '', precioVenta: ''
    };
  };

  // Cuando selecciona comprador guardamos el nombre también
  const onCompradorChange = () => {
    const compradorSeleccionado = compradores.value.find(c => c.id === form.value.compradorId);
    form.value.comprador = compradorSeleccionado ? compradorSeleccionado.nombre : '';
  };

  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [ventasRes, compradoresRes] = await Promise.all([
        api.get('/ventas'),
        api.get('/compradores')
      ]);
      ventas.value = ventasRes.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      compradores.value = compradoresRes.data;
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      cargando.value = false;
    }
  };

  const registrarVenta = async () => {
    error.value = '';
    try {
      if (!form.value.compradorId || !form.value.fecha ||
          !form.value.especie || !form.value.cantidad || !form.value.precioVenta) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      await api.post('/ventas', {
        comprador: form.value.comprador,
        compradorId: form.value.compradorId,
        fecha: form.value.fecha,
        especie: form.value.especie,
        cantidad: Number(form.value.cantidad),
        precioVenta: Number(form.value.precioVenta)
      });
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar venta';
    }
  };

  const eliminarVenta = async (id) => {
    if (!confirm('¿Eliminar esta venta?')) return;
    try {
      await api.delete(`/ventas/${id}`);
      await cargarDatos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar venta');
    }
  };

  const totalVentas = () => ventas.value.reduce((acc, v) => acc + v.totalVenta, 0);
  const totalKilos = () => ventas.value.reduce((acc, v) => acc + v.cantidad, 0);

  onMounted(cargarDatos);

  return {
    ventas, compradores, cargando, mostrarFormulario, error, form,
    cerrarFormulario, onCompradorChange, registrarVenta, eliminarVenta,
    totalVentas, totalKilos
  };
}