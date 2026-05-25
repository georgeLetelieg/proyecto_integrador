import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

export function useReportes() {
  const reporte = ref(null);
  const ultimosIngresos = ref([]);
  const usuarios = ref([]);
  const temporadas = ref([]);
  const cargando = ref(false);
  const cargandoIngresos = ref(true);
  const error = ref('');

  const filtros = ref({
    duenoId: '',
    especie: '',
    temporadaId: ''
  });

  const limpiarFiltros = () => {
    filtros.value = { duenoId: '', especie: '', temporadaId: '' };
    reporte.value = null;
  };

  const cargarDatosBase = async () => {
    try {
      const [usuariosRes, temporadasRes, ingresosRes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/temporadas'),
        api.get('/reportes/ultimos-ingresos')
      ]);
      usuarios.value = usuariosRes.data.filter(u => u.rol === 'dueño');
      temporadas.value = temporadasRes.data;
      ultimosIngresos.value = ingresosRes.data;
    } catch (err) {
      console.error('Error cargando datos base:', err);
    } finally {
      cargandoIngresos.value = false;
    }
  };

  const generarReporte = async () => {
    error.value = '';
    reporte.value = null;

    try {
      cargando.value = true;

      const params = new URLSearchParams();
      if (filtros.value.duenoId) params.append('duenoId', filtros.value.duenoId);
      if (filtros.value.especie) params.append('especie', filtros.value.especie);
      if (filtros.value.temporadaId) params.append('temporadaId', filtros.value.temporadaId);

      const response = await api.get(`/reportes?${params.toString()}`);
      reporte.value = response.data;

    } catch (err) {
      error.value = err.response?.data?.error || 'Error al generar reporte';
    } finally {
      cargando.value = false;
    }
  };

  const nombreUsuario = (uid) => {
    const u = usuarios.value.find(u => u.uid === uid);
    return u ? u.nombre : 'Desconocido';
  };

  const nombreTemporada = (id) => {
    const t = temporadas.value.find(t => t.id === id);
    return t ? `${t.fruta} (${t.anio})` : 'Desconocido';
  };

  const especiesDisponibles = computed(() => {
  const especies = temporadas.value.map(t => t.fruta).filter(Boolean);
  return [...new Set(especies)].sort();
  });

  onMounted(cargarDatosBase);

  return {
    reporte, ultimosIngresos, usuarios, temporadas,
    cargando, cargandoIngresos, error, filtros,
    especiesDisponibles,
    limpiarFiltros, generarReporte,
    nombreUsuario, nombreTemporada
  };
}