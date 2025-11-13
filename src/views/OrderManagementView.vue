<template>
  <div class="page-container admin-page">
    <h1>订单管理</h1>
    
    <div class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单号或用户信息"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="selectedStatus"
          placeholder="选择订单状态"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="ordersData" style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="150" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="foodName" label="美食名称" width="150" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="totalAmount" label="总价" width="100">
          <template #default="scope">
            ¥{{ scope.row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row.id)">详情</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'" 
              type="success" 
              @click="handleCompleteOrder(scope.row.id, scope.row.id)"
            >
              完成订单
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
        :total="totalOrders"
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

export default {
  name: 'OrderManagementView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const dateRange = ref(null)
    const orders = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalOrders = ref(0)

    // 订单状态映射
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待处理',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }

    const getStatusTagType = (status) => {
      const typeMap = {
        'pending': 'warning',
        'completed': 'success',
        'cancelled': 'danger'
      }
      return typeMap[status] || 'info'
    }

    // 获取订单列表
    const fetchOrders = async () => {
      try {
        // 在实际项目中，这里应该调用API获取订单列表
        // const response = await getOrderList({
        //   page: currentPage.value,
        //   pageSize: pageSize.value,
        //   keyword: searchQuery.value,
        //   status: selectedStatus.value,
        //   startDate: dateRange.value?.[0],
        //   endDate: dateRange.value?.[1]
        // })
        
        // 使用mock数据
        const mockOrders = [
          {
            id: 'ORD20240101001',
            userId: 'U001',
            userName: '张三',
            foodName: '宫保鸡丁',
            quantity: 2,
            totalAmount: 56.00,
            status: 'completed',
            createdAt: '2024-01-01 12:30:45'
          },
          {
            id: 'ORD20240101002',
            userId: 'U002',
            userName: '李四',
            foodName: '麻婆豆腐',
            quantity: 1,
            totalAmount: 18.00,
            status: 'pending',
            createdAt: '2024-01-01 13:45:20'
          },
          {
            id: 'ORD20240101003',
            userId: 'U003',
            userName: '王五',
            foodName: '糖醋排骨',
            quantity: 3,
            totalAmount: 114.00,
            status: 'cancelled',
            createdAt: '2024-01-01 14:20:10'
          },
          {
            id: 'ORD20240101004',
            userId: 'U001',
            userName: '张三',
            foodName: '清蒸鱼',
            quantity: 1,
            totalAmount: 68.00,
            status: 'completed',
            createdAt: '2024-01-01 18:00:50'
          },
          {
            id: 'ORD20240102001',
            userId: 'U004',
            userName: '赵六',
            foodName: '北京烤鸭',
            quantity: 1,
            totalAmount: 128.00,
            status: 'pending',
            createdAt: '2024-01-02 11:15:30'
          },
          {
            id: 'ORD20240102002',
            userId: 'U005',
            userName: '孙七',
            foodName: '扬州炒饭',
            quantity: 2,
            totalAmount: 44.00,
            status: 'completed',
            createdAt: '2024-01-02 12:40:15'
          }
        ]

        // 处理筛选
        let filteredOrders = [...mockOrders]
        
        if (searchQuery.value) {
          const keyword = searchQuery.value.toLowerCase()
          filteredOrders = filteredOrders.filter(
            item => item.id.toLowerCase().includes(keyword) || 
                   item.userName.toLowerCase().includes(keyword) ||
                   item.foodName.toLowerCase().includes(keyword)
          )
        }
        
        if (selectedStatus.value) {
          filteredOrders = filteredOrders.filter(item => item.status === selectedStatus.value)
        }

        // 处理分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        
        orders.value = filteredOrders.slice(start, end)
        totalOrders.value = filteredOrders.length

      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
        orders.value = []
        totalOrders.value = 0
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1 // 重置为第一页
      fetchOrders()
    }

    // 查看详情
    const handleViewDetail = (id) => {
      ElMessage.info('订单详情功能开发中')
    }

    // 完成订单
    const handleCompleteOrder = async (id, orderNumber) => {
      try {
        await ElMessageBox.confirm(
          `确定要完成订单「${orderNumber}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 在实际项目中，这里应该调用API更新订单状态
        // await completeOrder(id)
        
        ElMessage.success('订单已完成')
        fetchOrders() // 重新加载列表
      } catch (error) {
        // 用户取消
      }
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchOrders()
    }

    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchOrders()
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      searchQuery,
      selectedStatus,
      dateRange,
      ordersData: orders,
      currentPage,
      pageSize,
      totalOrders,
      getStatusText,
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