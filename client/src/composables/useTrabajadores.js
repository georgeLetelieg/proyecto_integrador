import { ref, onMounted } from 'vue';
import api from '../services/api';

export function useTrabajadores() {
  const misTrabajadores = ref([]);
  const trabajadoresLibres = ref([]);
  const cargando = ref(true);
  const mostrarFormulario = ref(false);
  const fichaSeleccionada = ref(null);
  const error = ref('');
  const pestanaActiva = ref('mis-trabajadores');

  const form = ref({
    nombre: '', email: '', password: '', rol: 'trabajador',
    tipo_documento: 'rut', numero_documento: '', fecha_nacimiento: '',
    telefono: '', nacionalidad: 'chileno', tipo_contrato: 'con_contrato'
  });

  const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    error.value = '';
    form.value = {
      nombre: '', email: '', password: '', rol: 'trabajador',
      tipo_documento: 'rut', numero_documento: '', fecha_nacimiento: '',
      telefono: '', nacionalidad: 'chileno', tipo_contrato: 'con_contrato'
    };
  };


  /*
  const cargarTrabajadores = async () => {
    try {
      cargando.value = true;
      const [misRes, libresRes] = await Promise.all([
        api.get('/trabajadores/mis-trabajadores'),
        api.get('/trabajadores/libres')
      ]);
      misTrabajadores.value = misRes.data;
      trabajadoresLibres.value = libresRes.data;
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    } finally {
      cargando.value = false;
    }
  };*/
  const cargarTrabajadores = async () => {
    try {
      cargando.value = true;
      const [misRes, libresRes] = await Promise.all([
        api.get('/trabajadores/mis-trabajadores'),
        api.get('/trabajadores/libres')
      ]);
      console.log('Mis trabajadores:', misRes.data);
      console.log('Trabajadores libres:', libresRes.data);
      misTrabajadores.value = misRes.data;
      trabajadoresLibres.value = libresRes.data;
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    } finally {
      cargando.value = false;
    }
  };

  const crearTrabajador = async () => {
    error.value = '';
    try {
      await api.post('/auth/registro', form.value);
      cerrarFormulario();
      await cargarTrabajadores();
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrar trabajador';
      console.error('Error:', err.response?.data);
      alert('Error:', err.response?.data);
    }
  };

  const desactivarTrabajador = async (uid) => {
  if (!confirm('¿Desactivar este trabajador? Su historial se conservará.')) return;
  try {
    await api.put(`/usuarios/${uid}/desactivar`);
    await cargarTrabajadores();
  } catch (err) {
    alert(err.response?.data?.error || 'Error al desactivar trabajador');
  }
  };

  const verFicha = async (uid) => {
    try {
      const response = await api.get(`/fichas/${uid}`);
      fichaSeleccionada.value = response.data;
    } catch (err) {
      alert('Error al cargar ficha');
    }
  };

  const eliminarTrabajador = async (uid) => {
    if (!confirm('¿Estás seguro de eliminar este trabajador?')) return;
    try {
      await api.delete(`/usuarios/${uid}`);
      await cargarTrabajadores();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar trabajador');
    }
  };

  onMounted(cargarTrabajadores);

  return {
    misTrabajadores, trabajadoresLibres, cargando,
    mostrarFormulario, fichaSeleccionada, error, form,
    pestanaActiva, cerrarFormulario, crearTrabajador,
    verFicha, eliminarTrabajador, cargarTrabajadores, desactivarTrabajador
  };
}