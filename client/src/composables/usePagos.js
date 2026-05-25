import { ref, onMounted } from 'vue';
import api from '../services/api';

export function usePagos() {
  const pagos = ref([]);
  const trabajadores = ref([]);
  const huertos = ref([]);
  const temporadas = ref([]);
  const cargando = ref(true);
  const mostrarCalculador = ref(false);
  const resultado = ref(null);
  const error = ref('');

  const form = ref({
    trabajadorId: '', huertoId: '', temporadaId: '',
    periodo: 'quincenal', fechaInicio: '', fechaFin: ''
  });

  const cerrarCalculador = () => {
    mostrarCalculador.value = false;
    resultado.value = null;
    error.value = '';
    form.value = {
      trabajadorId: '', huertoId: '', temporadaId: '',
      periodo: 'quincenal', fechaInicio: '', fechaFin: ''
    };
  };

  const nombreTrabajador = (uid) => {
    const t = trabajadores.value.find(t => t.uid === uid);
    return t ? t.nombre : uid;
  };

  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [pagosRes, usuariosRes, huertosRes, temporadasRes] = await Promise.all([
        api.get('/pagos'),
        api.get('/usuarios'),
        api.get('/huertos'),
        api.get('/temporadas')
      ]);
      pagos.value = pagosRes.data;
      trabajadores.value = usuariosRes.data.filter(u => u.rol === 'trabajador');
      huertos.value = huertosRes.data;
      temporadas.value = temporadasRes.data;
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      cargando.value = false;
    }
  };

  const calcularPago = async () => {
    error.value = '';
    resultado.value = null;
    try {
      if (!form.value.trabajadorId || !form.value.huertoId ||
        !form.value.temporadaId || !form.value.fechaInicio || !form.value.fechaFin) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      const response = await api.post('/pagos/calcular', form.value);
      console.log('Respuesta backend:', response.data);
      resultado.value = response.data;
    } catch (err) {
      console.log('Error completo:', err.response);
      error.value = err.response?.data?.error || 'Error al calcular pago';
    }
  };

  const registrarPago = async () => {
    try {
      await api.post('/pagos', {
        ...form.value,
        monto: resultado.value.resumen.totalAPagar
      });
      cerrarCalculador();
      await cargarDatos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar pago';
    }
  };

  onMounted(cargarDatos);

  return {
    pagos, trabajadores, huertos, temporadas,
    cargando, mostrarCalculador, resultado, error, form,
    cerrarCalculador, nombreTrabajador, calcularPago, registrarPago
  };
}