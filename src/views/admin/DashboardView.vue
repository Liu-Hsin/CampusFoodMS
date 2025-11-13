<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">美食管理仪表盘</h1>
    
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-info">
              <div class="stats-number">{{ totalFoods }}</div>
              <div class="stats-label">美食总数</div>
            </div>
            <div class="stats-icon food-icon">
              <el-icon><ShoppingBag /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-info">
              <div class="stats-number">{{ totalOrders }}</div>
              <div class="stats-label">今日订单</div>
            </div>
            <div class="stats-icon order-icon">
              <el-icon><Document /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <div class="stats-info">
              <div class="stats-number">{{ totalUsers }}</div>
              <div class="stats-label">用户总数</div>
            </div>
            <div class="stats-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近添加的美食 -->
    <el-card class="recent-foods-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>最近添加的美食</span>
          <el-button type="primary" text @click="navigateToFoodList">
            查看全部
          </el-button>
        </div>
      </template>
      
      <el-table :data="recentFoods" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100" formatter="priceFormat" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="editFood(row.id)">
              编辑
            </el-button>
            <el-button type="danger" text size="small" @click="deleteFood(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <el-button type="primary" icon="el-icon-plus" @click="addNewFood">
        添加美食
      </el-button>
      <el-button type="success" icon="el-icon-document" @click="navigateToOrders">
        管理订单
      </el-button>
      <el-button type="info" icon="el-icon-user" @click="navigateToUsers">
        管理用户
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingBag, Document, User } from '@element-plus/icons-vue'
import { getDashboardStats, getRecentFoods, mockDashboardStats, mockRecentFoods } from '@/services/foodService'

export default {
  name: 'DashboardView',
  components: {
    ShoppingBag,
    Document,
    User
  },
  setup() {
    const router = useRouter()
    const totalFoods = ref(0)
    const totalOrders = ref(0)
    const totalUsers = ref(0)
    const recentFoods = ref([])
    
    // 获取统计数据
    const fetchStatistics = async () => {
      try {
        // 并行获取统计数据和最近添加的美食
        const [statsData, recentFoodsData] = await Promise.all([
          getDashboardStats(),
          getRecentFoods(5)
        ])
        
        // 设置统计数据
        totalFoods.value = statsData.totalFoods
        totalOrders.value = statsData.totalOrders
        totalUsers.value = statsData.totalUsers
        
        // 设置最近添加的美食
        if (recentFoodsData && recentFoodsData.length > 0) {
          recentFoods.value = recentFoodsData
        } else {
          recentFoods.value = mockRecentFoods
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败')
        
        // 提供默认模拟数据
        totalFoods.value = mockDashboardStats.totalFoods
        totalOrders.value = mockDashboardStats.totalOrders
        totalUsers.value = mockDashboardStats.totalUsers
        recentFoods.value = mockRecentFoods
      }
    }
    
    // 价格格式化
    const priceFormat = (row, column, cellValue) => {
      return `¥${cellValue.toFixed(2)}`
    }
    
    // 导航到美食列表
    const navigateToFoodList = () => {
      router.push('/admin/foodList')
    }
    
    // 导航到订单管理
    const navigateToOrders = () => {
      router.push('/admin/orderManagement')
    }
    
    // 导航到用户管理
    const navigateToUsers = () => {
      router.push('/admin/userManagement')
    }
    
    // 添加新美食
    const addNewFood = () => {
      router.push('/admin/foodList/add')
    }
    
    // 编辑美食
    const editFood = (id) => {
      router.push(`/admin/foodList/edit/${id}`)
    }
    
    // 删除美食
    const deleteFood = async (id) => {
      try {
        const confirm = await ElMessageBox.confirm(
          '确定要删除该美食吗？',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API删除美食
          ElMessage.success('删除成功')
          // 重新获取数据
          fetchStatistics()
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    onMounted(() => {
      fetchStatistics()
    })
    
    return {
      totalFoods,
      totalOrders,
      totalUsers,
      recentFoods,
      priceFormat,
      navigateToFoodList,
      navigateToOrders,
      navigateToUsers,
      addNewFood,
      editFood,
      deleteFood
    }
  }
}
</script>

<style scoped>
/* 所有样式已移至 page-common.css */
</style>