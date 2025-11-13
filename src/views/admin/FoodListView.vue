<template>
  <div class="food-list-container">
    <h1 class="page-title">美食管理</h1>
    
    <!-- 搜索和添加功能区 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-container">
        <div class="search-left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索美食名称"
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
          />
          <el-select
            v-model="categoryFilter"
            placeholder="选择分类"
            class="category-select"
            clearable
          >
            <el-option
              v-for="category in foodCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            搜索
          </el-button>
        </div>
        <div class="search-right">
          <el-button type="success" icon="el-icon-plus" @click="handleAddFood">
            添加美食
          </el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 美食列表表格 -->
    <el-card class="food-table-card" shadow="hover">
      <el-table
        :data="filteredFoods"
        stripe
        style="width: 100%"
        :row-class-name="rowClassHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image || defaultFoodImage"
              :preview-src-list="[row.image || defaultFoodImage]"
              class="food-image"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === '上架' ? 'success' : 'danger'"
              :effect="'dark'"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="handleEditFood(row.id)">
              编辑
            </el-button>
            <el-button
              :type="row.status === '上架' ? 'warning' : 'success'"
              text
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === '上架' ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" text size="small" @click="handleDeleteFood(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredFoods.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 批量操作区域 -->
    <div class="batch-operations">
      <span>已选择 {{ selectedRows.length }} 项</span>
      <el-button
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
      <el-button
        type="primary"
        :disabled="selectedRows.length === 0"
        @click="handleBatchPublish"
      >
        批量上架
      </el-button>
      <el-button
        type="warning"
        :disabled="selectedRows.length === 0"
        @click="handleBatchUnpublish"
      >
        批量下架
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminFoodList, getAdminFoodCategories, mockAdminFoods, mockAdminCategories } from '@/services/foodService'

export default {
  name: 'FoodListView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const categoryFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const selectedRows = ref([])
    const foodList = ref([])
    const foodCategories = ref([])
    const defaultFoodImage = require('@/assets/images/default-food.png')
    
    // 获取食品列表数据
    const fetchFoodList = async () => {
      try {
        const data = await getAdminFoodList()
        if (data.list && data.list.length > 0) {
          foodList.value = data.list
        } else {
          // 使用模拟数据
          foodList.value = mockAdminFoods
        }
      } catch (error) {
        console.error('获取食品列表失败:', error)
        ElMessage.error('获取食品列表失败')
        
        // 提供默认模拟数据
        foodList.value = mockAdminFoods
      }
    }
    
    // 获取食品分类
    const fetchFoodCategories = async () => {
      try {
        const categories = await getAdminFoodCategories()
        if (categories && categories.length > 0) {
          foodCategories.value = categories
        } else {
          // 使用模拟分类数据
          foodCategories.value = mockAdminCategories
        }
      } catch (error) {
        console.error('获取食品分类失败:', error)
        // 使用模拟分类数据
        foodCategories.value = mockAdminCategories
      }
    }
    
    // 根据搜索条件筛选食品
    const filteredFoods = computed(() => {
      let result = foodList.value
      
      // 根据名称搜索
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(food => 
          food.name.toLowerCase().includes(query)
        )
      }
      
      // 根据分类筛选
      if (categoryFilter.value) {
        result = result.filter(food => 
          food.category === categoryFilter.value
        )
      }
      
      // 分页处理
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return result.slice(start, end)
    })
    
    // 行样式处理
    const rowClassHandler = ({ row }) => {
      return row.status === '下架' ? 'row-disabled' : ''
    }
    
    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1 // 重置到第一页
    }
    
    // 添加美食
    const handleAddFood = () => {
      router.push('/admin/foodList/add')
    }
    
    // 编辑美食
    const handleEditFood = (id) => {
      router.push(`/admin/foodList/edit/${id}`)
    }
    
    // 切换美食状态（上架/下架）
    const handleToggleStatus = async (row) => {
      try {
        const newStatus = row.status === '上架' ? '下架' : '上架'
        const confirm = await ElMessageBox.confirm(
          `确定要将「${row.name}」${newStatus}吗？`,
          '状态变更确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API更新状态
          row.status = newStatus
          ElMessage.success(`操作成功，已${newStatus}「${row.name}」`)
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    // 删除美食
    const handleDeleteFood = async (id) => {
      try {
        const food = foodList.value.find(f => f.id === id)
        const confirm = await ElMessageBox.confirm(
          `确定要删除美食「${food?.name}」吗？`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API删除美食
          foodList.value = foodList.value.filter(f => f.id !== id)
          ElMessage.success('删除成功')
          
          // 如果当前页没有数据了，回到上一页
          if (filteredFoods.value.length === 0 && currentPage.value > 1) {
            currentPage.value--
          }
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    // 批量删除
    const handleBatchDelete = async () => {
      try {
        const confirm = await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedRows.value.length} 项美食吗？`,
          '批量删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API批量删除
          const idsToDelete = selectedRows.value.map(row => row.id)
          foodList.value = foodList.value.filter(f => !idsToDelete.includes(f.id))
          selectedRows.value = []
          ElMessage.success(`成功删除 ${idsToDelete.length} 项美食`)
          
          // 如果当前页没有数据了，回到上一页
          if (filteredFoods.value.length === 0 && currentPage.value > 1) {
            currentPage.value--
          }
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    // 批量上架
    const handleBatchPublish = async () => {
      try {
        const confirm = await ElMessageBox.confirm(
          `确定要将选中的 ${selectedRows.value.length} 项美食上架吗？`,
          '批量上架确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API批量更新
          selectedRows.value.forEach(row => {
            row.status = '上架'
          })
          selectedRows.value = []
          ElMessage.success('批量上架成功')
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    // 批量下架
    const handleBatchUnpublish = async () => {
      try {
        const confirm = await ElMessageBox.confirm(
          `确定要将选中的 ${selectedRows.value.length} 项美食下架吗？`,
          '批量下架确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        if (confirm) {
          // 在实际项目中，这里应该调用API批量更新
          selectedRows.value.forEach(row => {
            row.status = '下架'
          })
          selectedRows.value = []
          ElMessage.success('批量下架成功')
        }
      } catch (error) {
        // 用户取消操作
      }
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
    }
    
    const handleCurrentChange = (current) => {
      currentPage.value = current
    }
    
    onMounted(() => {
      fetchFoodList()
      fetchFoodCategories()
    })
    
    return {
      searchQuery,
      categoryFilter,
      currentPage,
      pageSize,
      selectedRows,
      foodList,
      foodCategories,
      defaultFoodImage,
      filteredFoods,
      rowClassHandler,
      handleSearch,
      handleAddFood,
      handleEditFood,
      handleToggleStatus,
      handleDeleteFood,
      handleBatchDelete,
      handleBatchPublish,
      handleBatchUnpublish,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 所有样式已移至 page-common.css */
</style>