<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Compradores</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Nuevo Comprador</button>
      </div>

      <!-- Modal crear comprador -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Agregar Comprador</h2>

          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Frutas del Sur SpA" />
          </div>

          <div class="form-group">
            <label>Tipo</label>
            <select v-model="form.tipo">
              <option value="empresa">Empresa</option>
              <option value="persona">Persona</option>
            </select>
          </div>

          <div class="form-group">
            <label>Telefono (opcional)</label>
            <input v-model="form.telefono" type="text" placeholder="+56912345678" />
          </div>

          <div class="form-group">
            <label>Email (opcional)</label>
            <input v-model="form.email" type="email" placeholder="contacto@empresa.cl" />
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearComprador">Guardar</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando compradores...</div>
      <div v-else-if="compradores.length === 0" class="vacio">
        No hay compradores registrados aún.
      </div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comprador in compradores" :key="comprador.id">
              <td>{{ comprador.nombre }}</td>
              <td>
                <span v-if="comprador.tipo === 'empresa'" class="badge-activo">Empresa</span>
                <span v-else class="badge-contrato">Persona</span>
              </td>
              <td>{{ comprador.telefono || '—' }}</td>
              <td>{{ comprador.email || '—' }}</td>
              <td>
                <button class="btn-danger" @click="eliminarComprador(comprador.id)">Eliminar</button>
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
import { useCompradores } from '../../composables/useCompradores';

const {
  compradores, cargando, mostrarFormulario, error, form,
  cerrarFormulario, crearComprador, eliminarComprador
} = useCompradores();
</script>