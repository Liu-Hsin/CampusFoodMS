<template>
  <div class="page-container home-container page-common">
    <header class="home-header">
      <h1 class="home-title">校园美食系统</h1>
      <nav class="category-nav">
        <el-radio-group v-model="selectedCategory" size="medium" @change="filterFoods">
          <el-radio-button v-for="category in categories" :key="category" :label="category" class="category-item">
            {{ category }}
          </el-radio-button>
        </el-radio-group>
      </nav>
    </header>

    <main class="food-card-container">
      <el-card v-for="food in filteredFoods" :key="food.id" class="food-card" hoverable @click="goToDetail(food.id)">
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
              <span v-if="food.originalPrice > food.price" class="original-price">¥{{ food.originalPrice.toFixed(2)
                }}</span>
            </div>
            <div class="food-sales">销量: {{ food.sales }}</div>
          </div>

          <div class="food-category">
            <el-tag size="small">{{ food.category }}</el-tag>
          </div>
        </div>
      </el-card>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getFoodList, mockFoods } from '../services/foodService'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const foods = ref([])
    const categories = ref([])
    const selectedCategory = ref('')
    
    // 默认的mock数据，确保在无服务端和无外部mock数据时仍能正常显示
    const defaultMockFoods = [
      {
        id: '1',
        name: '宫保鸡丁',
        description: '经典川菜，鸡肉与花生的完美搭配',
        price: 18.00,
        originalPrice: 22.00,
        image: '/images/food1.jpg',
        category: '热菜',
        status: 'available',
        sales: 128
      },
      {
        id: '2',
        name: '鱼香肉丝',
        description: '酸甜可口，色泽红亮',
        price: 16.00,
        originalPrice: 19.00,
        image: '/images/food2.jpg',
        category: '热菜',
        status: 'available',
        sales: 96
      },
      {
        id: '3',
        name: '酸辣土豆丝',
        description: '开胃小菜，爽脆可口',
        price: 10.00,
        originalPrice: 12.00,
        image: '/images/food3.jpg',
        category: '凉菜',
        status: 'available',
        sales: 85
      }
    ]

    // 获取美食数据
    const fetchFoods = async () => {
      try {
        // 尝试从服务获取数据
        const response = await getFoodList()

        // 确保数据正确处理，处理mock数据和真实数据的兼容性
        let foodItems = []
        if (Array.isArray(response)) {
          foodItems = response
        } else if (response && Array.isArray(response.items)) {
          foodItems = response.items
        } else if (response && Array.isArray(response.list)) {
          foodItems = response.list
        }

        // 如果获取到有效的数据，使用获取的数据
        if (Array.isArray(foodItems) && foodItems.length > 0) {
          foods.value = foodItems
        } else if (Array.isArray(mockFoods) && mockFoods.length > 0) {
          // 尝试使用foodService中的mock数据
          foods.value = mockFoods
        } else {
          // 使用默认mock数据
          foods.value = defaultMockFoods
        }

        // 提取唯一分类
        const uniqueCategories = [...new Set(foods.value.map(food => food.category))]
        categories.value = uniqueCategories.sort()
      } catch (error) {
        console.error('获取美食数据失败:', error)
        // 出错时使用mock数据
        if (Array.isArray(mockFoods) && mockFoods.length > 0) {
          foods.value = mockFoods
        } else {
          foods.value = defaultMockFoods
        }
        // 提取唯一分类
        const uniqueCategories = [...new Set(foods.value.map(food => food.category))]
        categories.value = uniqueCategories.sort()
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

    // 筛选美食
    const filterFoods = () => {
      // 分类变更时的处理逻辑
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
      filterFoods
    }
  }
}
</script>