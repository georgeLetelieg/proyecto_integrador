<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Reporte de Temporada</h1>
      </div>

      <!-- Selector de temporada -->
      <div class="filtros-container">
        <h3>Selecciona una temporada</h3>
        <div class="filtros-grid">
          <div class="form-group">
            <label>Temporada</label>
            <select v-model="temporadaSeleccionada">
              <option value="">-- Selecciona --</option>
              <option v-for="t in temporadas" :key="t.id" :value="t.id">
                {{ t.fruta }} — {{ t.anio }} ({{ t.estado }})
              </option>
            </select>
          </div>
        </div>
        <div class="filtros-acciones">
          <button
            class="btn-primary"
            @click="generarReporte"
            :disabled="cargando || !temporadaSeleccionada"
          >
            {{ cargando ? 'Generando...' : 'Generar Reporte' }}
          </button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <!-- Reporte generado -->
      <div v-if="reporte">

        <!-- Info de la temporada -->
        <div class="temporada-header">
          <div class="temporada-info">
            <h2>{{ reporte.temporada.fruta }} — {{ reporte.temporada.anio }}</h2>
            <p>Huerto: <strong>{{ reporte.temporada.huerto }}</strong></p>
            <p>Periodo: <strong>{{ reporte.temporada.fechaInicio }}</strong>
              — <strong>{{ reporte.temporada.fechaFin || 'En curso' }}</strong>
            </p>
            <p>
              Precio bandeja: <strong>${{ reporte.temporada.precioBandeja?.toLocaleString('es-CL') }}</strong>
              | Precio kilo: <strong>${{ reporte.temporada.precioGranel?.toLocaleString('es-CL') }}</strong>
            </p>
          </div>
          <span :class="reporte.temporada.estado === 'activa' ? 'badge-activo' : 'badge-libre'">
            {{ reporte.temporada.estado }}
          </span>
        </div>

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
            <strong>{{ reporte.resumen.totalKilos }} kg</strong>
          </div>
          <div class="card-reporte">
            <span>Total kilos vendidos</span>
            <strong>{{ reporte.resumen.totalKilosVendidos }} kg</strong>
          </div>
          <div class="card-reporte">
            <span>Total ventas</span>
            <strong>${{ reporte.resumen.totalVentas?.toLocaleString('es-CL') }}</strong>
          </div>
          <div class="card-reporte">
            <span>Total pagado a trabajadores</span>
            <strong>${{ reporte.resumen.totalPagado?.toLocaleString('es-CL') }}</strong>
          </div>
          <div class="card-reporte card-balance">
            <span>Balance de temporada</span>
            <strong>${{ reporte.resumen.balance?.toLocaleString('es-CL') }}</strong>
          </div>
        </div>

        <!-- Detalle por trabajador -->
        <div class="seccion-reporte" v-if="reporte.detalleTrabajadores.length > 0">
          <h3>Detalle por trabajador</h3>
          <div class="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Total bandejas</th>
                  <th>Total kilos</th>
                  <th>Total pagado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in reporte.detalleTrabajadores" :key="t.trabajadorId">
                  <td>{{ t.nombre }}</td>
                  <td>{{ t.totalBandejas }}</td>
                  <td>{{ t.totalKilos }} kg</td>
                  <td>${{ t.totalPagado?.toLocaleString('es-CL') }}</td>
                </tr>
              </tbody>
            </table>
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

        <!-- Detalle de ventas -->
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
                  <th>Precio x kilo</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="venta in reporte.ventas" :key="venta.id">
                  <td>{{ venta.fecha }}</td>
                  <td>{{ venta.comprador }}</td>
                  <td>{{ venta.especie }}</td>
                  <td>{{ venta.cantidad }} kg</td>
                  <td>${{ venta.precioVenta?.toLocaleString('es-CL') }}</td>
                  <td>${{ venta.totalVenta?.toLocaleString('es-CL') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="reporte.detalleTrabajadores.length === 0 &&
                reporte.ventas.length === 0"
          class="vacio"
        >
          No hay datos registrados para esta temporada aún.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue';
import { useReporteTemporada } from '../../composables/useReporteTemporada';

const {
  reporte, temporadas, temporadaSeleccionada,
  cargando, cargandoTemporadas, error,
  generarReporte
} = useReporteTemporada();
</script>

<style scoped>
.filtros-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}

.filtros-container h3 { color: #2d6a4f; margin-bottom: 1rem; }

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.filtros-acciones {
  display: flex;
  justify-content: flex-end;
}

.temporada-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.temporada-info h2 { color: #2d6a4f; margin-bottom: 0.5rem; }
.temporada-info p { color: #444; margin-bottom: 0.3rem; font-size: 0.95rem; }

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

.card-reporte strong { font-size: 1.4rem; color: #2d6a4f; }

.card-balance {
  background-color: #1b4332;
  grid-column: span 3;
}

.card-balance span { color: rgba(255,255,255,0.8); }
.card-balance strong { color: white; font-size: 1.8rem; }

.seccion-reporte { margin-bottom: 1.5rem; }
.seccion-reporte h3 { color: #2d6a4f; margin-bottom: 1rem; }
</style>