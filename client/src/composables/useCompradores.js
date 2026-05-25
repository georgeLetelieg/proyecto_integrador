import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useCompradores() {
  const compradores = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const error = ref('');

  const form = ref({
    nombre: '',
    tipo: 'empresa',
    telefono: '',
    email: ''
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      nombre: '',
      tipo: 'empresa',
      telefono: '',
      email: ''
    };
  };

  const cargarCompradores = async () => {
    try {
      cargando.value = true;
      const response = await api.get('/compradores');
      compradores.value = response.data;
    } catch (err) {
      console.error('Error cargando compradores:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearComprador = async () => {
    error.value = '';
    try {
      if (!form.value.nombre || !form.value.tipo) {
        error.value = 'Nombre y tipo son obligatorios';
        return;
      }
      await api.post('/compradores', form.value);
      cerrarFormulario();
      await cargarCompradores();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear comprador';
    }
  };

  const eliminarComprador = async (id) => {
    if (!confirm('¿Eliminar este comprador?')) return;
    try {
      await api.delete(`/compradores/${id}`);
      await cargarCompradores();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar comprador');
    }
  };

  onMounted(cargarCompradores);

  return {
    compradores, cargando, mostrarFormulario, error, form,
    cerrarFormulario, crearComprador, eliminarComprador
  };
}