import { useAppStore } from '@/store/app';
import { createRouter, createWebHistory } from 'vue-router'

const LoginView = () => import('@/views/LoginView.vue');
const VoteView = () => import('@/views/VoteView.vue');
const ReultsView = () => import('@/views/ResultsView.vue');

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Root',
        redirect: () => {
          // const store = useAppStore();

          // if (store.loggedIn) {
          //   return { name: 'Vote' }
          // } else {
          return { name: 'Login' }
          // }
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView
      },
      {
        path: 'vote',
        name: 'Vote',
        beforeEnter: () => {
          const store = useAppStore();

          if (!store.loggedIn) {
            return { name: 'Login' }
          }
        },
        component: VoteView
      },
      {
        path: 'results',
        name: 'Results',
        component: ReultsView
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
