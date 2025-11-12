<script setup>
</script>

<template>
  <div class="app-container">
    <!-- 条件渲染：只有登录后才显示顶部导航栏和侧边栏 -->
    <div v-if="userInfo">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-left">
          <h1 class="app-title">校园美食管理系统</h1>
        </div>
        <div class="header-right">
          <span class="user-info">欢迎，{{ userInfo.username }}</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      
      <div class="main-content">
        <!-- 侧边栏 -->
        <el-aside class="app-sidebar" width="200px">
          <el-menu :default-active="activeMenu" class="sidebar-menu" @select="handleMenuSelect" router>
            <el-menu-item index="home">
              <template #title>
                <el-icon><House /></el-icon>
                <span>首页</span>
              </template>
            </el-menu-item>
            <el-menu-item index="foodList">
              <template #title>
                <el-icon><ShoppingBag /></el-icon>
                <span>美食列表</span>
              </template>
            </el-menu-item>
            <el-sub-menu index="management" v-if="isAdmin">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>管理中心</span>
              </template>
              <el-menu-item index="orderManagement">订单管理</el-menu-item>
              <el-menu-item index="userManagement">用户管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <!-- 主内容区域 -->
        <el-main class="app-main">
          <RouterView />
        </el-main>
      </div>
    </div>
    
    <!-- 未登录时直接显示路由内容 -->
    <div v-else>
      <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import './styles/page-common.css'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { House, ShoppingBag, Setting } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    House,
    ShoppingBag,
    Setting
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')))
    const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')
    const activeMenu = ref(route.name || 'home')
    
    // 处理菜单选择
    const handleMenuSelect = (index) => {
      // 确保路由存在
      const routeExists = router.hasRoute(index)
      if (routeExists) {
        router.push({ name: index })
      } else {
        console.error(`路由 ${index} 不存在`)
      }
    }
    
    // 处理退出登录
    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isAdmin')
      userInfo.value = null
      isAdmin.value = false
      ElMessage.success('退出登录成功')
      router.push('/login')
    }
    
    // 监听路由变化，更新激活的菜单
    router.afterEach((to) => {
      activeMenu.value = to.name || 'home'
    })
    
    return {
      userInfo,
      isAdmin,
      activeMenu,
      handleMenuSelect,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.app-title {
  font-size: 24px;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  color: white;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-sidebar {
  background-color: #303133;
  overflow-y: auto;
}

.sidebar-menu {
  background-color: #303133;
  color: white;
  border-right: none;
}

.sidebar-menu .el-menu-item {
  color: #c0c4cc;
}

.sidebar-menu .el-menu-item.is-active {
  color: white;
  background-color: #409eff;
}

.app-main {
  flex: 1;
  background-color: #f5f5f5;
  overflow-y: auto;
  padding: 20px;
}
</style>