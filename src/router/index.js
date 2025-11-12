import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FoodListView from '../views/FoodListView.vue'
import OrderManagementView from '../views/OrderManagementView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import FoodDetailView from '../views/FoodDetailView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/food-list',
      name: 'foodList',
      component: FoodListView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/food/:id',
      name: 'foodDetail',
      component: FoodDetailView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order-management',
      name: 'orderManagement',
      component: OrderManagementView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/user-management',
      name: 'userManagement',
      component: UserManagementView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router