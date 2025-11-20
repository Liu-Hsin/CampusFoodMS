<template>
  <div class="app-container">
    <!-- 管理员页面布局 -->
    <div v-if="isAdminPage">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-left">
          <h1 class="app-title">校园美食管理系统</h1>
        </div>
        <div class="header-right">
          <span class="user-info">欢迎，{{ userInfo?.username || '管理员' }}</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      
      <div class="main-content">
        <!-- 侧边栏 -->
        <el-aside class="app-sidebar" width="200px">
          <el-menu :default-active="activeMenu" class="sidebar-menu" @select="handleMenuSelect" router>
            <el-menu-item index="adminDashboard">
              <template #title>
                <el-icon><House /></el-icon>
                <span>仪表盘</span>
              </template>
            </el-menu-item>
            <el-menu-item index="foodManagement">
              <template #title>
                <el-icon><ShoppingBag /></el-icon>
                <span>美食管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="orderList">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>订单管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="userList">
              <template #title>
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        
        <!-- 主内容区域 -->
        <el-main class="app-main">
          <RouterView />
        </el-main>
      </div>
    </div>
    
    <!-- 公共前端页面布局 -->
    <div v-else>
      <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import './styles/page-common.css'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
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
    const userInfo = ref(localStorage.getItem('userInfo') ? (localStorage.getItem('userInfo')) : null)
    const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')
    const activeMenu = ref(route.name || 'adminDashboard')
    
    // 判断当前是否为管理员页面
    const isAdminPage = ref(route.path.startsWith('/admin') && route.path !== '/admin/login')
    
    // 更新用户信息函数
    const updateUserInfo = () => {
      const newUserInfo = localStorage.getItem('userInfo')
      userInfo.value = newUserInfo ? JSON.parse(newUserInfo) : null
      isAdmin.value = localStorage.getItem('isAdmin') === 'true'
    }
    
    // 监听路由变化，更新页面类型和激活的菜单
    watch(
      () => route.path,
      (newPath) => {
        const isAdminRoute = newPath.startsWith('/admin') && newPath !== '/admin/login'
        isAdminPage.value = isAdminRoute
        
        if (isAdminRoute) {
          activeMenu.value = route.name || 'adminDashboard'
          updateUserInfo()
          
          // 确保只有管理员能访问管理页面
          if (!isAdmin.value) {
            ElMessage.error('您没有权限访问管理页面')
            router.push('/')
          }
        }
      },
      { immediate: true }
    )
    
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
      router.push('/admin/login')
    }
    
    // 监听路由变化，更新激活的菜单
    router.afterEach((to) => {
      activeMenu.value = to.name || 'home'
    })
    
    return {
      userInfo,
      isAdmin,
      activeMenu,
      isAdminPage,
      handleMenuSelect,
      handleLogout
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* 移除body的默认边距 */
body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

/* 确保没有滚动条溢出 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
}

.app-header {
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  flex-shrink: 0;
  margin: 0;
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
  position: relative;
}

.app-sidebar {
  background-color: #303133;
  overflow-y: auto;
  flex-shrink: 0;
  width: 200px !important;
}

.sidebar-menu {
  background-color: #303133;
  color: white;
  border-right: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu {
  color: #c0c4cc;
  height: 60px; /* 固定高度为60px，确保统一 */
  line-height: 60px; /* 与高度保持一致 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  border-radius: 0; /* 确保没有圆角影响 */
}

.sidebar-menu .el-sub-menu__title {
  color: #c0c4cc;
  height: 60px; /* 确保子菜单标题高度一致 */
  line-height: 60px;
  padding: 0 20px; /* 调整内边距 */
}

.sidebar-menu .el-sub-menu__title:hover,
.sidebar-menu .el-menu-item:hover {
  background-color: #404040;
  color: white;
}

.sidebar-menu .el-menu-item.is-active,
.sidebar-menu .el-sub-menu.is-active > .el-sub-menu__title {
  color: white;
  background-color: #409eff;
  height: 60px; /* 确保激活状态高度一致 */
  line-height: 60px;
}

/* 修复子菜单的样式问题 */
.sidebar-menu .el-sub-menu__title i {
  color: #c0c4cc;
}

.sidebar-menu .el-sub-menu__title:hover i,
.sidebar-menu .el-sub-menu.is-active > .el-sub-menu__title i {
  color: white;
}

/* 修复点击时的临时状态样式 */
.sidebar-menu .el-menu-item:focus,
.sidebar-menu .el-sub-menu__title:focus {
  background-color: #404040;
  outline: none; /* 移除默认焦点轮廓 */
}

.sidebar-menu .el-menu-item:active {
  background-color: #409eff; /* 点击时立即显示激活背景色 */
}

.app-main {
  flex: 1;
  background-color: #f5f5f5;
  overflow-y: auto;
  padding: 0;
  position: relative;
  margin: 0;
  width: calc(100% - 200px);
  min-width: 0;
}

/* 响应式设计 - 以PC端为主，适配移动端 */
@media (max-width: 1024px) {
  .app-sidebar {
    width: 180px !important;
  }
  
  .app-title {
    font-size: 20px;
  }
  
  .app-main {
    width: calc(100% - 180px);
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 10px;
  }
  
  .app-title {
    font-size: 18px;
  }
  
  .user-info {
    display: none;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .app-sidebar {
    width: 100% !important;
    height: auto;
    max-height: 200px;
    border-bottom: 1px solid #404040;
  }
  
  .app-main {
    width: 100%;
  }
  
  .sidebar-menu {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    height: auto;
  }
  
  .sidebar-menu .el-menu-item,
  .sidebar-menu .el-sub-menu {
    min-width: 100px;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
  }
  
  .app-main {
    height: calc(100vh - 60px - 50px);
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 16px;
  }
  
  .header-right {
    gap: 10px;
  }
}
</style>