<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Registro de Ventas</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Nueva Venta</button>
      </div>

      <!-- Resumen -->
      <div class="resumen-ventas">
        <div class="resumen-item">
          <span>Total ventas</span>
          <strong>{{ ventas.length }}</strong>
        </div>
        <div class="resumen-item">
          <span>Total kilos vendidos</span>
          <strong>{{ totalKilos() }} kg</strong>
        </div>
        <div class="resumen-item resumen-total">
          <span>Total recaudado</span>
          <strong>${{ totalVentas().toLocaleString('es-CL') }}</strong>
        </div>
      </div>

      <!-- Modal registrar venta -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Registrar Venta</h2>

          <div class="form-group">
            <label>Comprador</label>
            <select v-model="form.compradorId" @change="onCompradorChange">
              <option value="">Selecciona un comprador</option>
              <option v-for="c in compradores" :key="c.id" :value="c.id">
                {{ c.nombre }} — {{ c.tipo }}
              </option>
            </select>
            <small v-if="compradores.length === 0" class="aviso">
              No hay compradores registrados. Agrega uno en la seccion Compradores.
            </small>
          </div>

          <div class="form-group">
            <label>Fecha de venta</label>
            <input
              v-model="form.fecha"
              type="date"
              :max="new Date().toISOString().split('T')[0]"
            />
          </div>

          <div class="form-group">
            <label>Especie / Fruta</label>
            <input v-model="form.especie" type="text" placeholder="Ej: Arandano, Frambuesa" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Cantidad (kg)</label>
              <input v-model="form.cantidad" type="number" min="1" placeholder="Ej: 500" />
            </div>
            <div class="form-group">
              <label>Precio por kilo ($)</label>
              <input v-model="form.precioVenta" type="number" min="1" placeholder="Ej: 1200" />
            </div>
          </div>

          <!-- Vista previa del total -->
          <div v-if="form.cantidad && form.precioVenta" class="preview-total">
            <span>Total estimado:</span>
            <strong>${{ (Number(form.cantidad) * Number(form.precioVenta)).toLocaleString('es-CL') }}</strong>
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="registrarVenta">Registrar</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando ventas...</div>
      <div v-else-if="ventas.length === 0" class="vacio">No hay ventas registradas aún.</div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Comprador</th>
              <th>Especie</th>
              <th>Cantidad</th>
              <th>Precio x kilo</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventas" :key="venta.id">
              <td>{{ venta.fecha }}</td>
              <td>{{ venta.comprador }}</td>
              <td>{{ venta.especie }}</td>
              <td>{{ venta.cantidad }} kg</td>
              <td>${{ venta.precioVenta?.toLocaleString('es-CL') }}</td>
              <td>${{ venta.totalVenta?.toLocaleString('es-CL') }}</td>
              <td>
                <button class="btn-danger" @click="eliminarVenta(venta.id)">Eliminar</button>
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
import { useVentas } from '../../composables/useVentas';

const {
  ventas, compradores, cargando, mostrarFormulario, error, form,
  cerrarFormulario, onCompradorChange, registrarVenta, eliminarVenta,
  totalVentas, totalKilos
} = useVentas();
</script>

<style scoped>
.resumen-ventas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resumen-item {
  background: white;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  text-align: center;
}

.resumen-item span {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.resumen-item strong {
  font-size: 1.5rem;
  color: #2d6a4f;
}

.resumen-total {
  background-color: #2d6a4f;
}

.resumen-total span { color: rgba(255,255,255,0.8); }
.resumen-total strong { color: white; }

.preview-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #d8f3dc;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #2d6a4f;
}

.preview-total strong { font-size: 1.2rem; }

.aviso {
  color: #e63946;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  display: block;
}
</style>