<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Huertos</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">Nuevo Huerto</button>
      </div>

      <!-- Modal crear huerto -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Crear Huerto</h2>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Huerto Los Aromos" />
          </div>
          <div class="form-group">
            <label>Ubicación</label>
            <input v-model="form.ubicacion" type="text" placeholder="Ej: Chillán, Chile" />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearHuerto">Crear</button>
          </div>
        </div>
      </div>

      <!-- Modal asignar trabajador -->
      <div v-if="mostrarAsignar" class="modal">
        <div class="modal-card">
          <h2>Asignar Trabajador</h2>
          <p class="huerto-nombre">Huerto: <strong>{{ huertoSeleccionado?.nombre }}</strong></p>
          <div class="form-group">
            <label>Selecciona un trabajador</label>
            <select v-model="formAsignar.trabajadorId">
              <option value="">-- Selecciona --</option>
              <option v-for="t in trabajadores" :key="t.uid" :value="t.uid">
                {{ t.nombre }}
              </option>
            </select>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarAsignar">Cancelar</button>
            <button class="btn-primary" @click="asignarTrabajador">Asignar</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando huertos...</div>
      <div v-else-if="huertos.length === 0" class="vacio">No hay huertos registrados aún.</div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Trabajador activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="huerto in huertos" :key="huerto.id">
              <td>{{ huerto.nombre }}</td>
              <td>{{ huerto.ubicacion }}</td>
              <td>
                <span v-if="huerto.trabajadorActivoId" class="badge-activo">
                  {{ nombreTrabajador(huerto.trabajadorActivoId) }}
                </span>
                <span v-else class="badge-libre">Libre</span>
              </td>
              <td class="acciones">
                <button
                  v-if="!huerto.trabajadorActivoId"
                  class="btn-info"
                  @click="abrirAsignar(huerto)"
                >
                  Asignar
                </button>
                <button
                  v-else
                  class="btn-secondary"
                  @click="desasignarTrabajador(huerto.id)"
                >
                  Desasignar
                </button>
                <button class="btn-danger" @click="eliminarHuerto(huerto.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useHuertos } from '../../composables/useHuertos';

const {
  huertos, trabajadores, cargando,
  mostrarFormulario, mostrarAsignar,
  huertoSeleccionado, error, form, formAsignar,
  cerrarFormulario, cerrarAsignar, abrirAsignar,
  crearHuerto, eliminarHuerto,
  asignarTrabajador, desasignarTrabajador,
  nombreTrabajador
} = useHuertos();
</script>

<style scoped>
.acciones { display: flex; gap: 0.5rem; }
.huerto-nombre { margin-bottom: 1rem; color: #444; }
</style>