import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FoodListView from '../views/FoodListView.vue'
import OrderManagementView from '../views/OrderManagementView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import FoodDetailView from '../views/FoodDetailView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false // 首页无需登录
      }
    },
    {
      path: '/food',
      name: 'foodList',
      component: FoodListView,
      meta: {
        requiresAuth: false // 食品列表无需登录
      }
    },
    {
      path: '/food/:id',
      name: 'foodDetail',
      component: FoodDetailView,
      meta: {
        requiresAuth: false // 美食详情无需登录
      }
    },
    // 管理页面路由组
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'adminDashboard',
          component: DashboardView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: 'order-management',
          name: 'orderManagement',
          component: OrderManagementView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: 'user-management',
          name: 'userManagement',
          component: UserManagementView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true
          }
        }
      ]
    },
    // 管理登录页面
    {
      path: '/admin/login',
      name: 'LoginView',
      component: LoginView
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  // 如果是访问管理页面，需要管理员权限
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!isAuthenticated) {
      next('/admin/login')
    } else if (!isAdmin) {
      // 不是管理员但已登录，重定向到首页
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router