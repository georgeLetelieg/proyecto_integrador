<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Gestión de Huertos</h1>
      <p class="subtitle">Ingresa tus credenciales para continuar</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Ingrese su Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});

const error = ref('');
const cargando = ref(false);

const handleLogin = async () => {
  error.value = '';
  cargando.value = true;

  try {
    await authStore.login(form.value.email, form.value.password);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f0;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2d6a4f;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #444;
  font-weight: bold;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

input:focus {
  border-color: #2d6a4f;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #2d6a4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

button:hover {
  background-color: #1b4332;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.error {
  color: #e63946;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
</style>