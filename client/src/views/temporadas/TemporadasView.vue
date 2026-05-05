<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Temporadas</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">Nueva Temporada</button>
      </div>

      <!-- Modal crear temporada -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Crear Temporada</h2>
          <div class="form-group">
            <label>Huerto</label>
            <select v-model="form.huertoId">
              <option value="">Selecciona un huerto</option>
              <option v-for="h in huertos" :key="h.id" :value="h.id">
                {{ h.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Fruta / Verdura</label>
            <input v-model="form.fruta" type="text" placeholder="Ej: Manzana, Uva, Tomate" />
          </div>
          <div class="form-group">
            <label>Fecha inicio</label>
            <input v-model="form.fechaInicio" type="date" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Precio por bandeja ($)</label>
              <input v-model="form.precio_bandeja" type="number" placeholder="Ej: 500" />
            </div>
            <div class="form-group">
              <label>Precio por kilo ($)</label>
              <input v-model="form.precio_granel" type="number" placeholder="Ej: 300" />
            </div>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearTemporada">Crear</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando temporadas...</div>
      <div v-else-if="temporadas.length === 0" class="vacio">No hay temporadas registradas aún.</div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Huerto</th>
              <th>Fruta/Verdura</th>
              <th>Fecha inicio</th>
              <th>Precio bandeja</th>
              <th>Precio kilo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="temporada in temporadas" :key="temporada.id">
              <td>{{ nombreHuerto(temporada.huertoId) }}</td>
              <td>{{ temporada.fruta }}</td>
              <td>{{ temporada.fechaInicio }}</td>
              <td>${{ temporada.precio_bandeja?.toLocaleString('es-CL') }}</td>
              <td>${{ temporada.precio_granel?.toLocaleString('es-CL') }}</td>
              <td>
                <span v-if="temporada.estado === 'activa'" class="badge-activo">Activa</span>
                <span v-else class="badge-libre">Cerrada</span>
              </td>
              <td>
                <button
                  v-if="temporada.estado === 'activa'"
                  class="btn-danger"
                  @click="cerrarTemporada(temporada.id)"
                >
                  Cerrar
                </button>
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
import { useTemporadas } from '../../composables/useTemporadas';

const {
  temporadas, huertos, cargando,
  mostrarFormulario, error, form,
  cerrarFormulario, crearTemporada,
  cerrarTemporada, nombreHuerto
} = useTemporadas();
</script>