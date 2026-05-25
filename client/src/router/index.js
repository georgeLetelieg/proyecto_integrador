import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import DashboardView from '../views/dashboard/DashboardView.vue';
import HuertosView from '../views/huertos/HuertosView.vue';
import TrabajadoresView from '../views/trabajadores/TrabajadoresView.vue';
import PagosView from '../views/pagos/PagosView.vue';
import TemporadasView from '../views/temporadas/TemporadasView.vue';
import UsuariosView from '../views/usuarios/UsuariosView.vue';
import VentasView from '../views/ventas/VentasView.vue';
import CompradoresView from '../views/compradores/CompradoresView.vue';
import ReportesView from '../views/reportes/ReportesView.vue';
import ReporteTemporadaView from '../views/reportes/ReporteTemporadaView.vue';



const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/huertos',
    name: 'huertos',
    component: HuertosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/trabajadores',
    name: 'trabajadores',
    component: TrabajadoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos',
    name: 'pagos',
    component: PagosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/temporadas',
    name: 'temporadas',
    component: TemporadasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: VentasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/compradores',
    name: 'compradores',
    component: CompradoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: ReportesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reporte-temporada',
    name: 'reporte-temporada',
    component: ReporteTemporadaView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const uid = localStorage.getItem('uid');
  if (to.meta.requiresAuth && !uid) {
    next('/login');
  } else if (to.path === '/login' && uid) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;