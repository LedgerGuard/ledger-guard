import { useAppStore } from '@/store/app';
import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const VoteView = () => import('@/views/VoteView.vue');
const ReultsView = () => import('@/views/ResultsView.vue');
const CountDownView = () => import('@/views/CountDownView.vue');

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView
      },
      {
        path: 'voter',
        name: 'Voter',
        redirect: { name: 'Login' },
        children: [
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
            path: 'countdown',
            name: 'CountDown',
            beforeEnter: () => {
              const store = useAppStore();

              if (!store.voted) {
                return { name: 'Vote' }
              }
              else if (store.remainingTimeInMilliseconds() <= 0) {
                return { name: 'Results' }
              }
            },
            component: CountDownView
          },
          {
            path: 'results',
            name: 'Results',
            beforeEnter: () => {
              const store = useAppStore();

              if (!store.voted) {
                return { name: 'Vote' }
              }
              else if (store.remainingTimeInMilliseconds() > 0) {
                return { name: 'CountDown' }
              }
            },
            component: ReultsView
          }
        ]
      },
      {
        path: 'unicc',
        name: 'Unicc',
        component: HomeView
      },

    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
