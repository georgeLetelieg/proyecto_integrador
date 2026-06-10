<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-header">
        <h2>Huertos</h2>
        <p>{{ authStore.usuario?.nombre }}</p>
        <span class="rol">{{ authStore.usuario?.rol }}</span>
      </div>
      <button class="btn-menu" @click="menuAbierto = !menuAbierto">
        {{ menuAbierto ? '✕' : '☰' }}
      </button>
    </div>

    <nav :class="{ 'nav-abierto': menuAbierto }">
      <router-link to="/dashboard" @click="menuAbierto = false">Dashboard/Inicio</router-link>
      <router-link to="/usuarios" @click="menuAbierto = false">Usuarios</router-link>
      <router-link to="/huertos" @click="menuAbierto = false">Huertos</router-link>
      <router-link to="/temporadas" @click="menuAbierto = false">Temporadas</router-link>
      <router-link to="/trabajadores" @click="menuAbierto = false">Trabajadores</router-link>
      <router-link to="/recolecciones" @click="menuAbierto = false">Recolecciones</router-link>
      <router-link to="/ventas" @click="menuAbierto = false">Ventas</router-link>
      <router-link to="/compradores" @click="menuAbierto = false">Compradores</router-link>
      <router-link to="/pagos" @click="menuAbierto = false">Pagos</router-link>
      <router-link to="/reportes" @click="menuAbierto = false">Reportes</router-link>
      <router-link to="/reporte-temporada" @click="menuAbierto = false">Reporte Temporada</router-link>
    </nav>

    <button class="btn-logout" @click="handleLogout">Cerrar sesion</button>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const menuAbierto = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>