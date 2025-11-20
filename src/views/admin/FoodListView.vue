<template>
  <div class="page-container admin-page">
    <h1>美食管理</h1>
    
    <div class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索美食名称或描述"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          class="category-select"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
        <el-select
          v-model="selectedStatus"
          placeholder="选择状态"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="在售" value="available" />
          <el-option label="下架" value="unavailable" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleAddFood">添加美食</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="foodsData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="180">
          <template #default="scope">
            <div class="food-name-cell">
              <div class="food-info">
                <span class="food-name">{{ scope.row.name }}</span>
                <el-tag :type="scope.row.status === 'available' ? 'success' : 'danger'" size="small">
                  {{ scope.row.status === 'available' ? '在售' : '下架' }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <div class="price-display">
              <span class="current-price">¥{{ scope.row.price.toFixed(2) }}</span>
              <span v-if="scope.row.originalPrice > scope.row.price" class="original-price">¥{{ scope.row.originalPrice.toFixed(2) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row.id)">详情</el-button>
            <el-button @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id, scope.row.name)">
              {{ scope.row.status === 'available' ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalFoods"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getFoodList, getCategories, createFood, deleteFood, updateFoodStatus } from '../../services/foodService'

export default {
  name: 'AdminFoodListView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const foods = ref([])
    const categories = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalFoods = ref(0)

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

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        categories.value = response
      } catch (error) {
        console.error('获取分类失败:', error)
        ElMessage.error('获取分类失败')
      }
    }

    // 获取食品列表
    const fetchFoods = async () => {
      try {
        const response = await getFoodList({
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchQuery.value,
          category: selectedCategory.value,
          status: selectedStatus.value
        })
        
        foods.value = response.items || []
        totalFoods.value = response.total || 0
      } catch (error) {
        console.error('获取食品列表失败:', error)
        ElMessage.error('获取食品列表失败')
        foods.value = []
        totalFoods.value = 0
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1 // 重置为第一页
      fetchFoods()
    }

    // 查看详情
    const handleViewDetail = (id) => {
      router.push(`/admin/food-detail/${id}`)
    }

    // 编辑食品
    const handleEdit = async (id) => {
      try {
        // 跳转到编辑页面
        router.push(`/admin/food-edit/${id}`)
      } catch (error) {
        console.error('跳转编辑页面失败:', error)
        ElMessage.error('跳转失败')
      }
    }

    // 删除/上架食品
    const handleDelete = async (id, name) => {
      const food = foods.value.find(item => item.id === id)
      const actionText = food?.status === 'available' ? '下架' : '上架'
      
      try {
        await ElMessageBox.confirm(
          `确定要${actionText}「${name}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 更新状态
        await updateFoodStatus(id, food?.status === 'available' ? 'unavailable' : 'available')
        ElMessage.success(`${actionText}成功`)
        fetchFoods() // 重新加载列表
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新状态失败:', error)
          ElMessage.error(`${actionText}失败`)
        }
      }
    }

    // 添加食品
    const handleAddFood = () => {
      router.push('/admin/food-add')
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchFoods()
    }

    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchFoods()
    }

    onMounted(() => {
      fetchCategories()
      fetchFoods()
    })

    return {
      searchQuery,
      selectedCategory,
      selectedStatus,
      foodsData: foods,
      categories,
      currentPage,
      pageSize,
      totalFoods,
      formatDate,
      handleSearch,
      handleViewDetail,
      handleEdit,
      handleDelete,
      handleAddFood,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>