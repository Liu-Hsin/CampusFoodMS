<template>
  <div class="page-container">
    <!-- <h2 class="page-title">美食列表</h2> -->
    
    <div class="search-filter">
      <el-input v-model="searchKeyword" placeholder="搜索美食" clearable style="width: 300px; margin-right: 10px">
        <template #append>
          <el-button @click="handleSearch" icon="el-icon-search"></el-button>
        </template>
      </el-input>
      
      <el-select v-model="categoryFilter" placeholder="选择分类" style="width: 150px; margin-right: 10px">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
      </el-select>
      
      <el-button type="primary" @click="handleAddFood">添加美食</el-button>
    </div>
    
    <div class="table-container">
      <el-table :data="foods" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120"></el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'available' ? 'success' : 'danger'">
              {{ scope.row.status === 'available' ? '在售' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row.id)">查看</el-button>
            <el-button type="success" size="small" @click="handleEditFood(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteFood(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
    </div>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getFoodList, getFoodCategories, deleteFood } from '../services/foodService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'FoodListView',
  setup() {
    const router = useRouter()
    const foods = ref([])
    const categories = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const searchKeyword = ref('')
    const categoryFilter = ref('')
    
    // 获取食品列表
    const fetchFoodList = async () => {
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value
        }
        
        if (searchKeyword.value) {
          params.keyword = searchKeyword.value
        }
        
        if (categoryFilter.value) {
          params.categoryId = categoryFilter.value
        }
        
        const response = await getFoodList(params)
        foods.value = response.items || []
        total.value = response.total || 0
      } catch (error) {
        ElMessage.error('获取食品列表失败')
      }
    }
    
    // 获取食品分类
    const fetchCategories = async () => {
      try {
        const response = await getFoodCategories()
        categories.value = response || []
      } catch (error) {
        ElMessage.error('获取食品分类失败')
      }
    }
    
    // 搜索食品
    const handleSearch = () => {
      currentPage.value = 1
      fetchFoodList()
    }
    
    // 查看食品详情
    const handleViewDetail = (id) => {
      router.push(`/food/${id}`)
    }
    
    // 编辑食品
    const handleEditFood = (food) => {
      // 这里可以打开编辑对话框或者跳转到编辑页面
      router.push(`/food/${food.id}/edit`)
    }
    
    // 删除食品
    const handleDeleteFood = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这个食品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await deleteFood(id)
        ElMessage.success('删除成功')
        fetchFoodList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }
    
    // 添加食品
    const handleAddFood = () => {
      // 这里可以打开添加对话框或者跳转到添加页面
      router.push('/food/create')
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchFoodList()
    }
    
    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchFoodList()
    }
    
    onMounted(() => {
      fetchFoodList()
      fetchCategories()
    })
    
    return {
      foods,
      categories,
      total,
      currentPage,
      pageSize,
      searchKeyword,
      categoryFilter,
      fetchFoodList,
      handleSearch,
      handleViewDetail,
      handleEditFood,
      handleDeleteFood,
      handleAddFood,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 页面特定样式已移至全局样式文件 */
</style>