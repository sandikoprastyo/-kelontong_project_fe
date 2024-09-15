import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/new',
      name: 'dashboard-create',
      component: () => import('../views/DashboardPageNew.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/:id',
      name: 'dashboard-detail',
      component: () => import('../views/DashboardPageEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token') // Atur ini sesuai dengan cara Anda menyimpan status login

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Periksa jika pengalihan sudah dilakukan
      if (!sessionStorage.getItem('redirected')) {
        // Tandai bahwa pengalihan telah dilakukan
        sessionStorage.setItem('redirected', 'true')
        next('/') // Arahkan pengguna ke halaman login jika tidak terautentikasi
      } else {
        // Jika pengalihan sudah dilakukan, lanjutkan ke halaman yang tidak ditemukan atau rute default
        next('/not-found')
      }
    } else {
      next() // Lanjutkan ke rute yang diminta jika terautentikasi
    }
  } else {
    next() // Lanjutkan ke rute yang diminta jika tidak memerlukan autentikasi
  }
})

export default router
