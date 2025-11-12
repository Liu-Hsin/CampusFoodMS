<template>
  <div class="page-container">
    <el-button class="back-button" @click="$router.back()">返回</el-button>
    
    <div v-if="food">
      <div class="detail-header">
        <h2 class="food-name">{{ food.name }}</h2>
        <el-tag :type="food.status === 'available' ? 'success' : 'danger'">
          {{ food.status === 'available' ? '在售' : '下架' }}
        </el-tag>
      </div>
      
      <div class="form-wrapper">
          <div class="food-image">
            <!-- 这里可以放食品图片 -->
            <img v-if="food.imageUrl" :src="food.imageUrl" alt="{{ food.name }}">
            <div v-else class="no-image">暂无图片</div>
          </div>
        
        <div class="food-info">
          <div class="info-item">
            <span class="info-label">价格：</span>
            <span class="info-value">¥{{ food.price }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">分类：</span>
            <span class="info-value">{{ food.categoryName }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">描述：</span>
            <span class="info-value">{{ food.description }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">创建时间：</span>
            <span class="info-value">{{ formatDate(food.createdAt) }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">更新时间：</span>
            <span class="info-value">{{ formatDate(food.updatedAt) }}</span>
          </div>
        </div>
      </div>
      
      <div class="food-description">
        <h3>详细介绍</h3>
        <p>{{ food.detailDescription || '暂无详细介绍' }}</p>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>
    
    <div v-else class="loading">
      <el-empty description="加载中..." />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getFoodDetail, deleteFood } from '../services/foodService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'FoodDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const food = ref(null)
    const foodId = ref(route.params.id)
    
    // 获取食品详情
    const fetchFoodDetail = async () => {
      try {
        const response = await getFoodDetail(foodId.value)
        food.value = response
      } catch (error) {
        ElMessage.error('获取食品详情失败')
      }
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
    
    // 编辑食品
    const handleEdit = () => {
      router.push(`/food/${foodId.value}/edit`)
    }
    
    // 删除食品
    const handleDelete = async () => {
      try {
        await ElMessageBox.confirm('确定要删除这个食品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await deleteFood(foodId.value)
        ElMessage.success('删除成功')
        router.push('/food-list')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }
    
    onMounted(() => {
      fetchFoodDetail()
    })
    
    return {
      food,
      fetchFoodDetail,
      formatDate,
      handleEdit,
      handleDelete
    }
  }
}
</script>

<style scoped>
/* 页面特定样式已移至全局样式文件 */

/* 美食详情页特定样式 */
.food-info h2 {
  margin-bottom: 15px;
}

.food-price {
  font-size: 28px;
  color: #f56c6c;
  margin-bottom: 15px;
  font-weight: bold;
}

.food-category {
  display: inline-block;
  padding: 4px 12px;
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  margin-bottom: 15px;
}

.food-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 30px;
}
</style>