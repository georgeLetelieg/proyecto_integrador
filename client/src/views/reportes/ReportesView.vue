<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Reportes y Estadisticas</h1>
      </div>

      <!-- Filtros -->
      <div class="filtros-container">
        <h3>Filtros</h3>
        <div class="filtros-grid">
          <div class="form-group">
            <label>Productor</label>
            <select v-model="filtros.duenoId">
              <option value="">Todos los productores</option>
              <option v-for="u in usuarios" :key="u.uid" :value="u.uid">
                {{ u.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Especie / Fruta</label>
            <select v-model="filtros.especie">
                <option value="">Todas las especies</option>
                <option v-for="especie in especiesDisponibles" :key="especie" :value="especie">
                {{ especie }}
                </option>
            </select>
        </div>

          <div class="form-group">
            <label>Temporada</label>
            <select v-model="filtros.temporadaId">
              <option value="">Todas las temporadas</option>
              <option v-for="t in temporadas" :key="t.id" :value="t.id">
                {{ t.fruta }} — {{ t.anio }}
              </option>
            </select>
          </div>
        </div>

        <div class="filtros-acciones">
          <button class="btn-secondary" @click="limpiarFiltros">Limpiar</button>
          <button class="btn-primary" @click="generarReporte" :disabled="cargando">
            {{ cargando ? 'Generando...' : 'Generar Reporte' }}
          </button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <!-- Resultado del reporte -->
      <div v-if="reporte">

        <!-- Tarjetas resumen -->
        <div class="cards-reporte">
          <div class="card-reporte">
            <span>Total recolecciones</span>
            <strong>{{ reporte.resumen.totalRecolecciones }}</strong>
          </div>
          <div class="card-reporte">
            <span>Total bandejas</span>
            <strong>{{ reporte.resumen.totalBandejas }}</strong>
          </div>
          <div class="card-reporte">
            <span>Total kilos recolectados</span>
            <strong>{{ reporte.resumen.totalKilosRecolectados }} kg</strong>
          </div>
          <div class="card-reporte">
            <span>Total kilos vendidos</span>
            <strong>{{ reporte.resumen.totalKilosVendidos }} kg</strong>
          </div>
          <div class="card-reporte">
            <span>Total ventas</span>
            <strong>${{ reporte.resumen.totalVentas?.toLocaleString('es-CL') }}</strong>
          </div>
          <div class="card-reporte card-verde">
            <span>Total pagado a trabajadores</span>
            <strong>${{ reporte.resumen.totalPagado?.toLocaleString('es-CL') }}</strong>
          </div>
        </div>

        <!-- Ventas por especie -->
        <div class="seccion-reporte" v-if="reporte.ventasPorEspecie.length > 0">
          <h3>Ventas por especie</h3>
          <div class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Especie</th>
                  <th>Kilos vendidos</th>
                  <th>Total recaudado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in reporte.ventasPorEspecie" :key="item.especie">
                  <td>{{ item.especie }}</td>
                  <td>{{ item.cantidad }} kg</td>
                  <td>${{ item.total?.toLocaleString('es-CL') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ultimas ventas -->
        <div class="seccion-reporte" v-if="reporte.ventas.length > 0">
          <h3>Detalle de ventas</h3>
          <div class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Comprador</th>
                  <th>Especie</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="venta in reporte.ventas" :key="venta.id">
                  <td>{{ venta.fecha }}</td>
                  <td>{{ venta.comprador }}</td>
                  <td>{{ venta.especie }}</td>
                  <td>{{ venta.cantidad }} kg</td>
                  <td>${{ venta.totalVenta?.toLocaleString('es-CL') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagos realizados -->
        <div class="seccion-reporte" v-if="reporte.pagos.length > 0">
          <h3>Pagos a trabajadores</h3>
          <div class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Temporada</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pago in reporte.pagos" :key="pago.id">
                  <td>{{ pago.periodo }}</td>
                  <td>{{ pago.fechaInicio }}</td>
                  <td>{{ pago.fechaFin }}</td>
                  <td>{{ nombreTemporada(pago.temporadaId) }}</td>
                  <td>${{ pago.monto?.toLocaleString('es-CL') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="reporte.ventas.length === 0 && reporte.pagos.length === 0"
          class="vacio"
        >
          No hay datos para los filtros seleccionados.
        </div>
      </div>

      <!-- Ultimos ingresos -->
      <div v-if="!reporte" class="seccion-reporte">
        <h3>Ultimos registros ingresados</h3>
        <div v-if="cargandoIngresos" class="cargando">Cargando...</div>
        <div v-else-if="ultimosIngresos.length === 0" class="vacio">
          No hay registros aún.
        </div>
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ultimosIngresos" :key="r.id">
                <td>{{ r.fecha?.split('T')[0] }}</td>
                <td>{{ r.tipo === 'bandeja' ? 'Bandeja' : 'Granel' }}</td>
                <td>{{ r.cantidad }} {{ r.tipo === 'bandeja' ? 'bandejas' : 'kg' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useReportes } from '../../composables/useReportes';

const {
  reporte, ultimosIngresos, usuarios, temporadas,
  especiesDisponibles,
  cargando, cargandoIngresos, error, filtros,
  limpiarFiltros, generarReporte,
  nombreUsuario, nombreTemporada
} = useReportes();
</script>

<style scoped>
.filtros-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}

.filtros-container h3 {
  color: #2d6a4f;
  margin-bottom: 1rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.filtros-acciones {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cards-reporte {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-reporte {
  background: white;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  text-align: center;
}

.card-reporte span {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.card-reporte strong {
  font-size: 1.4rem;
  color: #2d6a4f;
}

.card-verde {
  background-color: #2d6a4f;
}

.card-verde span { color: rgba(255,255,255,0.8); }
.card-verde strong { color: white; }

.seccion-reporte {
  margin-bottom: 1.5rem;
}

.seccion-reporte h3 {
  color: #2d6a4f;
  margin-bottom: 1rem;
}
</style>