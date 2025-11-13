<template>
  <div class="page-container home-container">
    <header class="home-header">
      <h1 class="home-title">校园美食系统</h1>
      <nav class="category-nav">
        <el-radio-group v-model="selectedCategory" size="medium" @change="filterFoods">
          <el-radio-button label="" class="category-item">全部</el-radio-button>
          <el-radio-button v-for="category in categories" :key="category" :label="category" class="category-item">
            {{ category }}
          </el-radio-button>
        </el-radio-group>
      </nav>
    </header>

    <main class="food-card-container">
      <el-card
        v-for="food in filteredFoods"
        :key="food.id"
        class="food-card"
        hoverable
        @click="goToDetail(food.id)"
      >
        <template #header>
          <div class="food-card-header">
            <el-tag :type="food.status === 'available' ? 'success' : 'danger'" size="small">
              {{ food.status === 'available' ? '在售' : '下架' }}
            </el-tag>
          </div>
        </template>
        
        <div class="food-image-wrapper">
          <img :src="food.image" :alt="food.name" class="food-image" />
        </div>
        
        <div class="food-info">
          <h3 class="food-name">{{ food.name }}</h3>
          <p class="food-description">{{ food.description }}</p>
          
          <div class="food-footer">
            <div class="food-price">
              <span class="current-price">¥{{ food.price.toFixed(2) }}</span>
              <span v-if="food.originalPrice > food.price" class="original-price">¥{{ food.originalPrice.toFixed(2) }}</span>
            </div>
            <div class="food-sales">销量: {{ food.sales }}</div>
          </div>
          
          <div class="food-category">
            <el-tag size="small">{{ food.category }}</el-tag>
          </div>
        </div>
      </el-card>
    </main>

    <footer class="home-footer">
      <div class="admin-entry">
        <el-button type="primary" @click="goToAdminLogin">管理入口</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getFoodList } from '../services/foodService'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const foods = ref([])
    const categories = ref([])
    const selectedCategory = ref('')
    
    // 获取美食数据
    const fetchFoods = async () => {
      try {
        // 直接调用getFoodList方法，该方法已包含后端服务不可用时返回mock数据的逻辑
        const response = await getFoodList()
        
        // 确保数据正确处理，处理mock数据和真实数据的兼容性
        // 确保foodItems始终是一个数组
        let foodItems = []
        if (Array.isArray(response)) {
          foodItems = response
        } else if (response && Array.isArray(response.items)) {
          foodItems = response.items
        } else if (response && Array.isArray(response.list)) {
          foodItems = response.list
        }
        
        foods.value = foodItems
        
        // 提取所有不重复的分类（仅当foodItems是数组且不为空时）
        if (Array.isArray(foodItems) && foodItems.length > 0) {
          const uniqueCategories = [...new Set(foodItems.map(food => food.category))]
          categories.value = uniqueCategories.sort()
        } else {
          categories.value = []
        }
      } catch (error) {
        console.error('获取美食数据失败:', error)
        // 当foodService中的mock数据也无法获取时，显示空状态
        foods.value = []
        categories.value = []
      }
    }
    
    // 根据选中的分类筛选美食
    const filteredFoods = computed(() => {
      if (!selectedCategory.value) {
        return foods.value
      }
      return foods.value.filter(food => food.category === selectedCategory.value)
    })
    
    // 跳转到美食详情页面
    const goToDetail = (foodId) => {
      router.push(`/food/${foodId}`)
    }
    
    // 跳转到管理登录页面
    const goToAdminLogin = () => {
      router.push('/admin/login')
    }
    
    // 筛选美食
    const filterFoods = () => {
      // 分类变更时的处理逻辑（可选）
    }
    
    onMounted(() => {
      fetchFoods()
    })
    
    return {
      foods,
      categories,
      selectedCategory,
      filteredFoods,
      goToDetail,
      goToAdminLogin,
      filterFoods
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.home-header {
  text-align: center;
  margin-bottom: 30px;
}

.home-title {
  font-size: 36px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: bold;
}

.category-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 10px;
}

.category-item {
  margin: 0 5px;
}

.food-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.food-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.food-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.food-card-header {
  display: flex;
  justify-content: flex-end;
}

.food-image-wrapper {
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.food-card:hover .food-image {
  transform: scale(1.05);
}

.food-info {
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
}

.food-name {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.food-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.food-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  margin-top: auto;
}

.current-price {
  font-size: 22px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 16px;
  color: #909399;
  text-decoration: line-through;
  margin-left: 5px;
}

.food-sales {
  font-size: 14px;
  color: #909399;
}

.food-category {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

.home-footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
}

.admin-entry {
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  
  .home-title {
    font-size: 28px;
  }
  
  .food-card-container {
    grid-template-columns: 1fr;
  }
  
  .food-image-wrapper {
    height: 180px;
  }
}
</style>