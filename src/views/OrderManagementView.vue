<template>
  <div class="page-container">
    <!-- <h2 class="page-title">订单管理</h2> -->
    
    <div class="search-filter">
      <el-input v-model="orderId" placeholder="订单ID" clearable style="width: 200px; margin-right: 10px"></el-input>
      <el-input v-model="username" placeholder="用户名" clearable style="width: 200px; margin-right: 10px"></el-input>
      <el-select v-model="statusFilter" placeholder="订单状态" style="width: 150px; margin-right: 10px">
        <el-option label="全部" value=""></el-option>
        <el-option label="待处理" value="pending"></el-option>
        <el-option label="已完成" value="completed"></el-option>
        <el-option label="已取消" value="cancelled"></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    
    <div class="table-container">
      <el-table :data="orders" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="150"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="completedAt" label="完成时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row.id)">查看</el-button>
            <el-button v-if="scope.row.status === 'pending'" type="success" size="small" @click="handleCompleteOrder(scope.row.id)">完成</el-button>
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
import { getOrderList, updateOrderStatus } from '../services/orderService'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'OrderManagementView',
  setup() {
    const router = useRouter()
    const orders = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const orderId = ref('')
    const username = ref('')
    const statusFilter = ref('')
    
    // 获取订单列表
    const fetchOrderList = async () => {
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value
        }
        
        if (orderId.value) {
          params.id = orderId.value
        }
        
        if (username.value) {
          params.username = username.value
        }
        
        if (statusFilter.value) {
          params.status = statusFilter.value
        }
        
        const response = await getOrderList(params)
        orders.value = response.items || []
        total.value = response.total || 0
      } catch (error) {
        ElMessage.error('获取订单列表失败')
      }
    }
    
    // 获取订单状态对应的标签类型
    const getStatusTagType = (status) => {
      switch (status) {
        case 'pending':
          return 'warning'
        case 'completed':
          return 'success'
        case 'cancelled':
          return 'danger'
        default:
          return 'info'
      }
    }
    
    // 搜索订单
    const handleSearch = () => {
      currentPage.value = 1
      fetchOrderList()
    }
    
    // 查看订单详情
    const handleViewDetail = (id) => {
      router.push(`/order/${id}`)
    }
    
    // 完成订单
    const handleCompleteOrder = async (id) => {
      try {
        await updateOrderStatus(id, 'completed')
        ElMessage.success('订单已完成')
        fetchOrderList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchOrderList()
    }
    
    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchOrderList()
    }
    
    onMounted(() => {
      fetchOrderList()
    })
    
    return {
      orders,
      total,
      currentPage,
      pageSize,
      orderId,
      username,
      statusFilter,
      fetchOrderList,
      getStatusTagType,
      handleSearch,
      handleViewDetail,
      handleCompleteOrder,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 页面特定样式已移至全局样式文件 */
</style>