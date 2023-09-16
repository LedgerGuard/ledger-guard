import { useAppStore } from '@/store/app';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const VoteView = () => import('@/views/VoteView.vue');
const ReultsView = () => import('@/views/ResultsView.vue');
const CountDownView = () => import('@/views/CountDownView.vue');

const routes: Readonly<RouteRecordRaw[]> = [
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
        ]
      },
      {
        path: 'unicc',
        name: 'Unicc',
        redirect: { name: 'CountDown' },
      },
      {
        path: 'countdown',
        name: 'CountDown',
        beforeEnter: (to) => {
          const store = useAppStore();

          if (!store.voted && to.path.includes('voter')) {
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
        beforeEnter: (to) => {
          const store = useAppStore();

          if (!store.voted && to.path.includes('voter')) {
            return { name: 'Vote' }
          }
          else if (store.remainingTimeInMilliseconds() > 0) {
            return { name: 'CountDown' }
          }
        },
        component: ReultsView
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
