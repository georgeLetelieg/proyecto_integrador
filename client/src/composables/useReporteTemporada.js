import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useReporteTemporada() {
  const reporte = ref(null);
  const temporadas = ref([]);
  const temporadaSeleccionada = ref('');
  const cargando = ref(false);
  const cargandoTemporadas = ref(true);
  const error = ref('');

  const cargarTemporadas = async () => {
    try {
      cargandoTemporadas.value = true;
      const response = await api.get('/temporadas');
      temporadas.value = response.data;
    } catch (err) {
      console.error('Error cargando temporadas:', err);
    } finally {
      cargandoTemporadas.value = false;
    }
  };

  const generarReporte = async () => {
    error.value = '';
    reporte.value = null;

    if (!temporadaSeleccionada.value) {
      error.value = 'Debes seleccionar una temporada';
      return;
    }

    try {
      cargando.value = true;
      const response = await api.get(`/reportes/temporada/${temporadaSeleccionada.value}`);
      reporte.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al generar reporte';
    } finally {
      cargando.value = false;
    }
  };

  onMounted(cargarTemporadas);

  return {
    reporte, temporadas, temporadaSeleccionada,
    cargando, cargandoTemporadas, error,
    generarReporte
  };
}