<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <h1>Bienvenido, {{ authStore.usuario?.nombre }}</h1>
      <p class="fecha">{{ fechaHoy }}</p>

      <div class="cards">
        <div class="card">
          <h3>Huertos</h3>
          <p class="card-numero">{{ totales.huertos }}</p>
        </div>
        <div class="card">
          <span class="card-icon"></span>
          <h3>Trabajadores</h3>
          <p class="card-numero">{{ totales.trabajadores }}</p>
        </div>
        <div class="card">
          <h3>Recolecciones</h3>
          <p class="card-numero">{{ totales.recolecciones }}</p>
        </div>
        <div class="card">
          <h3>Pagos realizados</h3>
          <p class="card-numero">{{ totales.pagos }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import AppSidebar from '../../components/AppSidebar.vue';
import api from '../../services/api';

const authStore = useAuthStore();

const totales = ref({
  huertos: 0,
  trabajadores: 0,
  recolecciones: 0,
  pagos: 0
});

const fechaHoy = new Date().toLocaleDateString('es-CL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

onMounted(async () => {
  try {
    const [huertos, usuarios, recolecciones, pagos] = await Promise.all([
      api.get('/huertos'),
      api.get('/usuarios'),
      api.get('/recolecciones'),
      api.get('/pagos')
    ]);

    totales.value.huertos = huertos.data.length;
    totales.value.trabajadores = usuarios.data.filter(u => u.rol === 'trabajador').length;
    totales.value.recolecciones = recolecciones.data.length;
    totales.value.pagos = pagos.data.length;
  } catch (error) {
    console.error('Error cargando totales:', error);
  }
});
</script>

<style scoped>
.fecha {
  color: #888;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  text-align: center;
}

.card-icon { font-size: 2rem; }
.card h3 { color: #444; margin: 0.5rem 0; font-size: 0.95rem; }
.card-numero { font-size: 2rem; font-weight: bold; color: #2d6a4f; }
</style>