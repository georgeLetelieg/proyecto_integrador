<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Pagos</h1>
        <button class="btn-primary" @click="mostrarCalculador = true">Calcular Pago</button>
      </div>

      <!-- Modal calcular pago -->
      <div v-if="mostrarCalculador" class="modal">
        <div class="modal-card">
          <h2>Calcular Pago</h2>

          <div class="form-group">
            <label>Trabajador</label>
            <select v-model="form.trabajadorId">
              <option value="">Selecciona un trabajador</option>
              <option v-for="t in trabajadores" :key="t.uid" :value="t.uid">
                {{ t.nombre }}
              </option>
            </select>
          </div>

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
            <label>Temporada</label>
            <select v-model="form.temporadaId">
              <option value="">Selecciona una temporada</option>
              <option v-for="t in temporadas" :key="t.id" :value="t.id">
                {{ t.fruta }} - {{ t.estado }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Periodo</label>
            <select v-model="form.periodo">
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha inicio</label>
              <input v-model="form.fechaInicio" type="date" />
            </div>
            <div class="form-group">
              <label>Fecha fin</label>
              <input v-model="form.fechaFin" type="date" />
            </div>
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <!-- Resultado del cálculo -->
          <div v-if="resultado && resultado.resumen" class="resultado">
  <h3>Resumen del pago</h3>
  <div class="resultado-items">
    <div class="resultado-item">
      <span>Total bandejas</span>
      <strong>{{ resultado.resumen?.totalBandejas ?? 0 }}</strong>
    </div>
    <div class="resultado-item">
      <span>Monto bandejas</span>
      <strong>${{ resultado.resumen?.montoBandejas?.toLocaleString('es-CL') ?? 0 }}</strong>
    </div>
    <div class="resultado-item">
      <span>Total kilos</span>
      <strong>{{ resultado.resumen?.totalKilos ?? 0 }}</strong>
    </div>
    <div class="resultado-item">
      <span>Monto granel</span>
      <strong>${{ resultado.resumen?.montoGranel?.toLocaleString('es-CL') ?? 0 }}</strong>
    </div>
  </div>
  <div class="total-pagar">
    <span>Total a pagar</span>
    <strong>${{ resultado.resumen?.totalAPagar?.toLocaleString('es-CL') ?? 0 }}</strong>
  </div>
</div>

<!-- Cuando no hay recolecciones en el periodo -->
<div v-else-if="resultado && !resultado.resumen" class="vacio">
  {{ resultado.mensaje }}
</div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarCalculador">Cancelar</button>
            <button class="btn-primary" @click="calcularPago">Calcular</button>
            <button v-if="resultado" class="btn-success" @click="registrarPago">
              Registrar Pago
            </button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando pagos...</div>
      <div v-else-if="pagos.length === 0" class="vacio">No hay pagos registrados aún.</div>

      <div v-else class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>Periodo</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pago in pagos" :key="pago.id">
              <td>{{ nombreTrabajador(pago.trabajadorId) }}</td>
              <td>{{ pago.periodo }}</td>
              <td>{{ pago.fechaInicio }}</td>
              <td>{{ pago.fechaFin }}</td>
              <td>${{ pago.monto?.toLocaleString('es-CL') }}</td>
              <td>
                <span class="badge-pagado">{{ pago.estado }}</span>
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
import { usePagos } from '../../composables/usePagos';

const {
  pagos, trabajadores, huertos, temporadas,
  cargando, mostrarCalculador, resultado, error, form,
  cerrarCalculador, nombreTrabajador, calcularPago, registrarPago
} = usePagos();
</script>

<style scoped>
.resultado {
  background-color: #f0f4f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.resultado-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.resultado-item {
  background: white;
  padding: 0.7rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.total-pagar {
  background-color: #2d6a4f;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.total-pagar strong { font-size: 1.4rem; }
</style>