import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

export function useTemporadas() {
  const temporadas = ref([]);
  const huertos = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const mostrarCierre = ref(false);
  const temporadaACerrar = ref(null);
  const fechaCierre = ref('');
  const error = ref('');
  const errorCierre = ref('');
  const anioFiltro = ref(new Date().getFullYear());

  const form = ref({
    huertoId: '', fruta: '', fechaInicio: '',
    precio_bandeja: '', precio_granel: ''
  });

  const aniosDisponibles = computed(() => {
    const anios = temporadas.value.map(t => t.anio).filter(Boolean);
    const unicos = [...new Set(anios)].sort((a, b) => b - a);
    if (!unicos.includes(new Date().getFullYear())) {
      unicos.unshift(new Date().getFullYear());
    }
    return unicos;
  });

  const temporadasFiltradas = computed(() => {
    return temporadas.value.filter(t => t.anio === anioFiltro.value);
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      huertoId: '', fruta: '', fechaInicio: '',
      precio_bandeja: '', precio_granel: ''
    };
  };

  const abrirCierre = (temporada) => {
    temporadaACerrar.value = temporada;
    fechaCierre.value = '';
    errorCierre.value = '';
    mostrarCierre.value = true;
  };

  const cerrarModalCierre = () => {
    mostrarCierre.value = false;
    temporadaACerrar.value = null;
    fechaCierre.value = '';
    errorCierre.value = '';
  };

  const cargarDatos = async () => {
    try {
      cargando.value = true;
      const [temporadasRes, huertosRes] = await Promise.all([
        api.get('/temporadas'),
        api.get('/huertos')
      ]);
      temporadas.value = temporadasRes.data;
      huertos.value = huertosRes.data;
    } catch (err) {
      console.error('Error cargando temporadas:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearTemporada = async () => {
    error.value = '';
    try {
      if (!form.value.huertoId || !form.value.fruta ||
          !form.value.fechaInicio || !form.value.precio_bandeja ||
          !form.value.precio_granel) {
        error.value = 'Todos los campos son obligatorios';
        return;
      }
      await api.post('/temporadas', {
        ...form.value,
        precio_bandeja: Number(form.value.precio_bandeja),
        precio_granel: Number(form.value.precio_granel)
      });
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear temporada';
    }
  };

  const cerrarTemporada = async () => {
    errorCierre.value = '';
    try {
      if (!fechaCierre.value) {
        errorCierre.value = 'La fecha de cierre es obligatoria';
        return;
      }
      await api.put(`/temporadas/${temporadaACerrar.value.id}/cerrar`, {
        fechaFin: fechaCierre.value
      });
      cerrarModalCierre();
      await cargarDatos();
    } catch (err) {
      errorCierre.value = err.response?.data?.error || 'Error al cerrar temporada';
    }
  };

  const eliminarTemporada = async (id) => {
    if (!confirm('¿Eliminar esta temporada?')) return;
    try {
      await api.delete(`/temporadas/${id}`);
      await cargarDatos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar temporada');
    }
  };

  const nombreHuerto = (id) => {
    const h = huertos.value.find(h => h.id === id);
    return h ? h.nombre : 'Desconocido';
  };

  onMounted(cargarDatos);

  return {
    temporadas, huertos, cargando,
    mostrarFormulario, mostrarCierre, temporadaACerrar,
    fechaCierre, error, errorCierre, form,
    anioFiltro, aniosDisponibles, temporadasFiltradas,
    cerrarFormulario, abrirCierre, cerrarModalCierre,
    crearTemporada, cerrarTemporada,
    eliminarTemporada, nombreHuerto
  };
}