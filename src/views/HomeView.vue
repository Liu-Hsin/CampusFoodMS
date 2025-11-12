<template>
  <div class="page-container">
    <h2 class="page-title">欢迎使用校园美食管理系统</h2>
    
    <div class="stats-card">
      <div class="stat-item">
        <el-card shadow="hover">
          <div class="stat-content">
            <div class="stat-number">{{ foodCount }}</div>
            <div class="stat-label">美食总数</div>
          </div>
        </el-card>
      </div>
      
      <div class="stat-item">
        <el-card shadow="hover">
          <div class="stat-content">
            <div class="stat-number">{{ orderCount }}</div>
            <div class="stat-label">今日订单</div>
          </div>
        </el-card>
      </div>
      
      <div class="stat-item">
        <el-card shadow="hover">
          <div class="stat-content">
            <div class="stat-number">{{ userCount }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </el-card>
      </div>
    </div>
    
    <div class="table-container">
      <h3 style="padding: 16px 16px 0; margin-bottom: 16px;">最近订单</h3>
      <el-table :data="recentOrders" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getFoodList } from '../services/foodService'
import { getOrderList } from '../services/orderService'
import { getUserList } from '../services/userService'
import { ElMessage } from 'element-plus'

export default {
  name: 'HomeView',
  setup() {
    const foodCount = ref(0)
    const orderCount = ref(0)
    const userCount = ref(0)
    const recentOrders = ref([])
    
    // 获取统计数据
    const fetchStats = async () => {
      try {
        // 获取食品总数
        const foodResponse = await getFoodList()
        foodCount.value = foodResponse.total || 0
        
        // 获取今日订单数
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
        const orderResponse = await getOrderList({ createdAt: startOfDay })
        orderCount.value = orderResponse.total || 0
        
        // 获取最近订单
        recentOrders.value = orderResponse.items || []
        
        // 获取用户总数
        const userResponse = await getUserList()
        userCount.value = userResponse.total || 0
      } catch (error) {
        ElMessage.error('获取统计数据失败')
      }
    }
    
    // 获取订单状态对应的标签类型
    const getStatusTagType = (status) => {
      switch (status) {
        case '待处理':
          return 'warning'
        case '已完成':
          return 'success'
        case '已取消':
          return 'danger'
        default:
          return 'info'
      }
    }
    
    onMounted(() => {
      fetchStats()
    })
    
    return {
      foodCount,
      orderCount,
      userCount,
      recentOrders,
      getStatusTagType
    }
  }
}
</script>

<style scoped>
/* 页面特定样式已移至全局样式文件 */

/* 首页特定样式 */
.recent-orders-title {
  margin-left: 16px;
}
</style>