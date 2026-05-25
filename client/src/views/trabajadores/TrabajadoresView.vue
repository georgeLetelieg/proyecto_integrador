<template>
  <div class="layout">
    <AppSidebar />
    <main class="content">
      <div class="content-header">
        <h1>Trabajadores</h1>
        <button class="btn-primary" @click="mostrarFormulario = true">+ Nuevo Trabajador</button>
      </div>

      <!-- Pestañas -->
      <div class="pestanas">
        <button :class="['btn-pestana', { activo: pestanaActiva === 'mis-trabajadores' }]"
          @click="pestanaActiva = 'mis-trabajadores'">
          Mis Trabajadores ({{ misTrabajadores?.length ?? 0 }})
        </button>
        <button :class="['btn-pestana', { activo: pestanaActiva === 'libres' }]" @click="pestanaActiva = 'libres'">
          Buscar Trabajadores Libres ({{ trabajadoresLibres?.length ?? 0 }})
        </button>
      </div>

      <!-- Modal crear trabajador -->
      <div v-if="mostrarFormulario" class="modal">
        <div class="modal-card">
          <h2>Registrar Trabajador</h2>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.nombre" type="text" placeholder="Nombre completo" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Tipo documento</label>
            <select v-model="form.tipo_documento">
              <option value="rut">RUT</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>
          <div class="form-group">
            <label>Número documento</label>
            <input v-model="form.numero_documento" type="text" placeholder="12.345.678-9" />
          </div>
          <div class="form-group">
            <label>Fecha nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" placeholder="+56912345678" />
          </div>
          <div class="form-group">
            <label>Nacionalidad</label>
            <select v-model="form.nacionalidad">
              <option value="chileno">Chileno</option>
              <option value="extranjero">Extranjero</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tipo contrato</label>
            <select v-model="form.tipo_contrato">
              <option value="con_contrato">Con contrato</option>
              <option value="sin_contrato">Sin contrato</option>
            </select>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn-primary" @click="crearTrabajador">Registrar</button>
          </div>
        </div>
      </div>

      <!-- Modal ficha trabajador -->
      <div v-if="fichaSeleccionada" class="modal">
        <div class="modal-card">
          <h2>Ficha del Trabajador</h2>
          <div class="ficha-info">
            <p><strong>Nombre:</strong> {{ fichaSeleccionada.trabajador.nombre }}</p>
            <p><strong>Email:</strong> {{ fichaSeleccionada.trabajador.email }}</p>
            <p><strong>Documento:</strong> {{ fichaSeleccionada.trabajador.numero_documento }}</p>
            <p><strong>Nacionalidad:</strong> {{ fichaSeleccionada.trabajador.nacionalidad }}</p>
            <p><strong>Contrato:</strong> {{ fichaSeleccionada.trabajador.tipo_contrato }}</p>
          </div>
          <h3>Estadísticas</h3>
          <div class="ficha-stats">
            <div class="stat">
              <span>Total recolecciones</span>
              <strong>{{ fichaSeleccionada.estadisticas.totalRecolecciones }}</strong>
            </div>
            <div class="stat">
              <span>Total bandejas</span>
              <strong>{{ fichaSeleccionada.estadisticas.totalBandejas }}</strong>
            </div>
            <div class="stat">
              <span>Total kilos</span>
              <strong>{{ fichaSeleccionada.estadisticas.totalKilos }}</strong>
            </div>
            <div class="stat">
              <span>Total recibido</span>
              <strong>${{ fichaSeleccionada.estadisticas.totalRecibido?.toLocaleString('es-CL') }}</strong>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="fichaSeleccionada = null">Cerrar</button>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="cargando">Cargando trabajadores...</div>

      <!-- Pestaña Mis Trabajadores -->
      <div v-else-if="pestanaActiva === 'mis-trabajadores'">
        <div v-if="misTrabajadores.length === 0" class="vacio">
          No tienes trabajadores asignados a tus huertos aún.
        </div>
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Nacionalidad</th>
                <th>Contrato</th>
                <th>Huerto asignado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trabajador in misTrabajadores" :key="trabajador.uid">
                <td>{{ trabajador.nombre }}</td>
                <td>{{ trabajador.tipo_documento?.toUpperCase() }}: {{ trabajador.numero_documento }}</td>
                <td>{{ trabajador.nacionalidad }}</td>
                <td>
                  <span v-if="trabajador.tipo_contrato === 'con_contrato'" class="badge-contrato">Con contrato</span>
                  <span v-else class="badge-sin-contrato">Sin contrato</span>
                </td>
                <td>
                  <span v-for="huerto in trabajador.huertos" :key="huerto.huertoId" class="badge-activo"
                    style="display:block; margin-bottom: 0.3rem">
                    {{ huerto.huertoNombre }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-info" @click="verFicha(trabajador.uid)">Ver ficha</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña Buscar Trabajadores Libres -->
      <div v-else-if="pestanaActiva === 'libres'">
        <div v-if="trabajadoresLibres.length === 0" class="vacio">
          No hay trabajadores libres disponibles.
        </div>
        <div v-else class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Nacionalidad</th>
                <th>Contrato</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trabajador in trabajadoresLibres" :key="trabajador.uid">
                <td>{{ trabajador.nombre }}</td>
                <td>{{ trabajador.tipo_documento?.toUpperCase() }}: {{ trabajador.numero_documento }}</td>
                <td>{{ trabajador.nacionalidad }}</td>
                <td>
                  <span v-if="trabajador.tipo_contrato === 'con_contrato'" class="badge-contrato">Con contrato</span>
                  <span v-else class="badge-sin-contrato">Sin contrato</span>
                </td>
                <td class="acciones">
                  <button class="btn-info" @click="verFicha(trabajador.uid)">Ver ficha</button>
                  <button class="btn-danger" @click="desactivarTrabajador(trabajador.uid)">Desactivar</button>
                </td>
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
import { useTrabajadores } from '../../composables/useTrabajadores';

const {
  misTrabajadores, trabajadoresLibres, cargando,
  mostrarFormulario, fichaSeleccionada, error, form,
  pestanaActiva, cerrarFormulario, crearTrabajador,
  verFicha, eliminarTrabajador, desactivarTrabajador
} = useTrabajadores();
</script>

<style scoped>
.pestanas {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.btn-pestana {
  padding: 0.7rem 1.2rem;
  border: 2px solid #2d6a4f;
  border-radius: 8px;
  background: white;
  color: #2d6a4f;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-pestana:hover {
  background-color: #d8f3dc;
}

.btn-pestana.activo {
  background-color: #2d6a4f;
  color: white;
}

.ficha-info p {
  margin-bottom: 0.5rem;
}

.ficha-info {
  margin-bottom: 1rem;
}

.ficha-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat {
  background-color: #f0f4f0;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat span {
  display: block;
  font-size: 0.85rem;
  color: #666;
}

.stat strong {
  font-size: 1.3rem;
  color: #2d6a4f;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}
</style>