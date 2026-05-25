import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null,
    uid: localStorage.getItem('uid') || null
  }),

  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password });
      const { usuario } = response.data;

      localStorage.setItem('uid', usuario.uid);
      this.uid = usuario.uid;
      this.usuario = usuario;
    },

    async cargarUsuario() {
      const uid = localStorage.getItem('uid');
      if (!uid) return;

      try {
        const response = await api.get(`/usuarios/${uid}`);
        this.usuario = response.data;
        this.uid = uid;
      } catch (err) {
        console.error('Error cargando usuario:', err);
        this.logout();
      }
    },

    logout() {
      localStorage.removeItem('uid');
      this.uid = null;
      this.usuario = null;
    }
  }
});