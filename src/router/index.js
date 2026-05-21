import { createRouter, createWebHistory } from 'vue-router';
// import { getAuth } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  // {
  //   path: '/movies',
  //   name: 'movies',
  //   component: () => import('../views/MoviesView.vue')
  // },
  // {
  //   path: '/factory',
  //   name: 'factory',
  //   component: () => import('../views/FactoryView.vue'),
  //   meta: { requiresAuth: true } //.................................. this path needed auth.....   /remove META if no needed AURH
  // },

  {
    path: '/fishwiki',
    name: 'fishwiki',
    component: () => import('../views/FishwikiVeiw.vue')
  },


  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {  //go to up page 
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }
    }
  }
})

// Security check for route authentication
// router.beforeEach((to, from) => {
//   const auth = getAuth()
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

//   if (requiresAuth) {
//     const user = auth.currentUser;
//     if (!user) {
//       return '/'       // return path   /
//     }
//     // id user exist  continue (undefined)
//   }
//   // no needed of authentication, (continue normal)
// })

export default router;








