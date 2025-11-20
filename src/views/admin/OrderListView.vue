<template>
  <div class="page-container admin-page">
    <h1>订单管理</h1>
    
    <div class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单ID、用户名或地址"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="selectedStatus"
          placeholder="选择状态"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="待确认" value="pending" />
          <el-option label="已确认" value="confirmed" />
          <el-option label="准备中" value="preparing" />
          <el-option label="配送中" value="delivering" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="ordersData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="订单ID" width="200">
          <template #default="scope">
            <span class="order-id">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.username" label="用户" width="120" />
        <el-table-column label="商品" width="200">
          <template #default="scope">
            <div class="order-items">
              <div v-for="item in scope.row.items" :key="item.foodId" class="order-item">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity">×{{ item.quantity }}</span>
                <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="scope">
            <span class="total-amount">¥{{ scope.row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="配送地址" width="200" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row.id)">详情</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'" 
              type="success" 
              @click="handleUpdateStatus(scope.row.id, 'confirmed')"
            >
              确认
            </el-button>
            <el-button 
              v-if="scope.row.status === 'confirmed'" 
              type="warning" 
              @click="handleUpdateStatus(scope.row.id, 'preparing')"
            >
              准备
            </el-button>
            <el-button 
              v-if="scope.row.status === 'preparing'" 
              type="info" 
              @click="handleUpdateStatus(scope.row.id, 'delivering')"
            >
              配送
            </el-button>
            <el-button 
              v-if="scope.row.status === 'delivering'" 
              type="success" 
              @click="handleUpdateStatus(scope.row.id, 'completed')"
            >
              完成
            </el-button>
            <el-button 
              v-if="['pending', 'confirmed', 'preparing'].includes(scope.row.status)" 
              type="danger" 
              @click="handleUpdateStatus(scope.row.id, 'cancelled')"
            >
              取消
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
import { getAllOrders, updateOrderStatus } from '../../services/orderService'

export default {
  name: 'AdminOrderListView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const dateRange = ref([])
    const orders = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalOrders = ref(0)

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '暂无'
      try {
        const date = new Date(dateString)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      } catch (e) {
        return '格式错误'
      }
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const typeMap = {
        pending: 'warning',
        confirmed: 'info',
        preparing: 'primary',
        delivering: 'warning',
        completed: 'success',
        cancelled: 'danger'
      }
      return typeMap[status] || 'info'
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const textMap = {
        pending: '待确认',
        confirmed: '已确认',
        preparing: '准备中',
        delivering: '配送中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return textMap[status] || status
    }

    // 获取订单列表
    const fetchOrders = async () => {
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchQuery.value,
          status: selectedStatus.value
        }
        
        // 添加日期筛选
        if (dateRange.value && dateRange.value.length === 2) {
          params.startDate = dateRange.value[0]
          params.endDate = dateRange.value[1]
        }
        
        const response = await getAllOrders(params)
        orders.value = response.items || []
        totalOrders.value = response.total || 0
      } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
        orders.value = []
        totalOrders.value = 0
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchOrders()
    }

    // 查看详情
    const handleViewDetail = (id) => {
      router.push(`/admin/order-detail/${id}`)
    }

    // 更新订单状态
    const handleUpdateStatus = async (id, status) => {
      const statusText = getStatusText(status)
      
      try {
        await ElMessageBox.confirm(
          `确定要将订单状态更新为「${statusText}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await updateOrderStatus(id, status)
        ElMessage.success('状态更新成功')
        fetchOrders()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新状态失败:', error)
          ElMessage.error('状态更新失败')
        }
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
      formatDate,
      getStatusType,
      getStatusText,
      handleSearch,
      handleViewDetail,
      handleUpdateStatus,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.search-filter-section {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-bar .el-input {
  width: 300px;
}

.status-select {
  width: 120px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
}

.order-id {
  font-family: monospace;
  font-size: 12px;
}

.order-items {
  max-height: 100px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-quantity {
  margin: 0 8px;
  color: #666;
}

.item-price {
  color: #f56c6c;
  font-weight: bold;
}

.total-amount {
  color: #f56c6c;
  font-weight: bold;
  font-size: 14px;
}
</style>