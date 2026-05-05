<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Huertos</h2>
      <p>{{ authStore.usuario?.nombre }}</p>
      <span class="rol">{{ authStore.usuario?.rol }}</span>
    </div>
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/huertos">Huertos</router-link>
      <router-link to="/temporadas">Temporadas</router-link>
      <router-link to="/trabajadores">Trabajadores</router-link>
      <router-link to="/pagos">Pagos</router-link>
    </nav>
    <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>