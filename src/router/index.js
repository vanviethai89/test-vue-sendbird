import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/messenger',
    name: 'Messenger',
    component: () => import('../views/Messenger.vue'),
  },
  {
    path: '/sync-manager',
    name: 'SyncManager',
    component: () => import('../views/SyncManager.vue'),
  },
  {
    path: '/connection-event',
    name: 'SendbirdConnectionEvent',
    component: () => import('../views/SendbirdConnectionEvent.vue'),
  },
  {
    path: '/sync-manager-2',
    name: 'SyncManager2',
    component: () => import('../views/SyncManager2.vue'),
  },
  {
    path: '/messenger-2',
    name: 'Messenger2',
    component: () => import('../views/Messenger2.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
