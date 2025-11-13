<template>
  <div class="page-container food-detail-container">
    <el-button class="back-button" @click="$router.back()">返回美食列表</el-button>
    
    <div v-if="food" class="detail-content-wrapper">
      <div class="food-header-section">
        <h1 class="food-name">{{ food.name }}</h1>
        <div class="food-status-price">
          <el-tag :type="food.status === 'available' ? 'success' : 'danger'" size="large">
            {{ food.status === 'available' ? '在售' : '下架' }}
          </el-tag>
          <div class="price-container">
            <span class="current-price">¥{{ food.price.toFixed(2) }}</span>
            <span v-if="food.originalPrice > food.price" class="original-price">¥{{ food.originalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div class="food-main-info">
        <div class="food-image-container">
          <img v-if="food.image" :src="food.image" :alt="food.name" class="food-image">
          <div v-else class="no-image">暂无图片</div>
        </div>
        
        <div class="food-basic-info">
          <div class="info-group">
            <div class="info-item">
              <span class="info-label">分类：</span>
              <el-tag size="medium">{{ food.category || '未分类' }}</el-tag>
            </div>
            
            <div class="info-item">
              <span class="info-label">销量：</span>
              <span class="info-value">{{ food.sales || 0 }} 份</span>
            </div>
          </div>
          
          <div class="food-description-preview">
            <h3>简介</h3>
            <p>{{ food.description || '暂无描述' }}</p>
          </div>
        </div>
      </div>
      
      <div class="food-detail-section">
        <h2>详细介绍</h2>
        <div class="detail-content">
          {{ food.detailDescription || food.description || '暂无详细介绍' }}
        </div>
      </div>
      
      <div class="food-stats-section">
        <h3>美食信息</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">上架时间</span>
            <span class="stat-value">{{ formatDate(food.createdAt) || '未知' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最近更新</span>
            <span class="stat-value">{{ formatDate(food.updatedAt) || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading">
      <el-skeleton :rows="6" animated />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getFoodDetail } from '../services/foodService'
import { ElMessage } from 'element-plus'
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
        // 先尝试从详情接口获取
        let response = null
        try {
          response = await getFoodDetail(foodId.value)
        } catch (detailError) {
          // 如果详情接口失败，尝试从列表中查找或使用mock数据
          console.log('详情接口失败，尝试使用替代数据')
          
          // 模拟数据
          const mockFoods = [
            {
              id: '1',
              name: '宫保鸡丁',
              description: '经典川菜，麻辣鲜香，选用优质鸡肉与花生、干辣椒等配料精心烹制而成。鸡肉嫩滑，花生酥脆，麻辣适中，是下饭的绝佳选择。',
              price: 28.00,
              originalPrice: 32.00,
              image: 'https://picsum.photos/id/1/600/400',
              category: '川菜',
              status: 'available',
              sales: 1200,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z',
              detailDescription: '宫保鸡丁是一道闻名中外的汉族传统名菜，属于川菜系。这道菜由清朝山东巡抚、四川总督丁宝桢所创，他对烹饪颇有研究，喜欢吃鸡和花生米，并尤其喜好辣味。这道菜也被归纳为北京宫廷菜。后来他被调任四川总督，在四川时，他改良了这道菜的做法，加入了四川特有的辣椒，这道菜也最终发展成为了川菜的代表菜品之一。'
            },
            {
              id: '2',
              name: '麻婆豆腐',
              description: '麻辣嫩滑，下饭神器，豆腐软嫩，肉末鲜香，麻辣味十足。',
              price: 18.00,
              originalPrice: 22.00,
              image: 'https://picsum.photos/id/2/600/400',
              category: '川菜',
              status: 'available',
              sales: 1500,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z',
              detailDescription: '麻婆豆腐是四川省传统名菜之一，属于川菜系。主要原料为配料和豆腐，材料主要有豆腐、牛肉末（也可以用猪肉）、辣椒和花椒等。麻来自花椒，辣来自辣椒，这道菜突出了川菜麻辣的特点。其口味独特，口感顺滑。'
            },
            {
              id: '3',
              name: '糖醋排骨',
              description: '酸甜可口，色泽红亮，排骨肉质鲜嫩，酸甜开胃。',
              price: 38.00,
              originalPrice: 42.00,
              image: 'https://picsum.photos/id/3/600/400',
              category: '粤菜',
              status: 'available',
              sales: 980,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z'
            },
            {
              id: '4',
              name: '清蒸鱼',
              description: '鲜嫩多汁，原汁原味，保留了鱼肉的鲜美和营养。',
              price: 68.00,
              originalPrice: 78.00,
              image: 'https://picsum.photos/id/4/600/400',
              category: '粤菜',
              status: 'available',
              sales: 850,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z'
            },
            {
              id: '5',
              name: '北京烤鸭',
              description: '外酥里嫩，北京特产，皮脆肉嫩，配以薄饼和酱料风味独特。',
              price: 128.00,
              originalPrice: 158.00,
              image: 'https://picsum.photos/id/5/600/400',
              category: '北京菜',
              status: 'available',
              sales: 1800,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z'
            },
            {
              id: '6',
              name: '扬州炒饭',
              description: '配料丰富，香气四溢，米饭粒粒分明，色泽金黄。',
              price: 22.00,
              originalPrice: 26.00,
              image: 'https://picsum.photos/id/6/600/400',
              category: '江苏菜',
              status: 'available',
              sales: 2100,
              createdAt: '2023-01-10T00:00:00Z',
              updatedAt: '2023-12-05T00:00:00Z'
            }
          ]
          
          response = mockFoods.find(item => item.id === foodId.value) || null
        }
        
        if (response) {
          food.value = response
        } else {
          ElMessage.error('未找到该美食信息')
        }
      } catch (error) {
        console.error('获取美食详情失败:', error)
        ElMessage.error('获取美食详情失败')
      }
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      } catch (e) {
        return ''
      }
    }
    
    onMounted(() => {
      fetchFoodDetail()
    })
    
    return {
      food,
      fetchFoodDetail,
      formatDate
    }
  }
}
</script>

<style scoped>
.food-detail-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #ffffff;
  overflow-y: auto;
}

.back-button {
  margin-bottom: 20px;
}

.detail-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.food-header-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.food-name {
  font-size: 32px;
  color: #303133;
  margin-bottom: 15px;
  font-weight: bold;
}

.food-status-price {
  display: flex;
  align-items: center;
  gap: 20px;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 20px;
  color: #909399;
  text-decoration: line-through;
}

.food-main-info {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.food-image-container {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  height: 350px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.food-image:hover {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 18px;
}

.food-basic-info {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
}

.info-value {
  color: #303133;
  font-size: 16px;
}

.food-description-preview {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.food-description-preview h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #303133;
}

.food-description-preview p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.food-detail-section {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.food-detail-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
}

.detail-content {
  color: #606266;
  line-height: 1.8;
  font-size: 16px;
}

.food-stats-section {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.food-stats-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .food-detail-container {
    padding: 10px;
  }
  
  .food-name {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .food-image-container {
    height: 250px;
    max-width: 100%;
  }
  
  .food-main-info {
    flex-direction: column;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>