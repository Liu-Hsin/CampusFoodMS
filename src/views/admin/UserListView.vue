<template>
  <div class="page-container admin-page">
    <h1>用户管理</h1>
    
    <div class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、姓名或邮箱"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="selectedRole"
          placeholder="选择角色"
          clearable
          class="role-select"
        >
          <el-option label="全部" value="" />
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
        <el-select
          v-model="selectedStatus"
          placeholder="选择状态"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="usersData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="isAdmin" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isAdmin ? 'danger' : 'primary'" size="small">
              {{ scope.row.isAdmin ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.lastLogin) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row.id)">详情</el-button>
            <el-button @click="handleEditRole(scope.row.id, scope.row.isAdmin)">
              {{ scope.row.isAdmin ? '取消管理员' : '设为管理员' }}
            </el-button>
            <el-button 
              :type="scope.row.status === 'active' ? 'danger' : 'success'" 
              @click="handleToggleStatus(scope.row.id, scope.row.status, scope.row.username)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
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
        :total="totalUsers"
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
import { getUserList, updateUserRole, deleteUser } from '../../services/userService'

export default {
  name: 'AdminUserListView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedRole = ref('')
    const selectedStatus = ref('')
    const users = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalUsers = ref(0)

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

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        const response = await getUserList({
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchQuery.value,
          role: selectedRole.value,
          status: selectedStatus.value
        })
        
        users.value = response.items || []
        totalUsers.value = response.total || 0
      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
        users.value = []
        totalUsers.value = 0
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchUsers()
    }

    // 查看详情
    const handleViewDetail = (id) => {
      router.push(`/admin/user-detail/${id}`)
    }

    // 修改用户角色
    const handleEditRole = async (id, isAdmin) => {
      const actionText = isAdmin ? '取消管理员' : '设为管理员'
      
      try {
        await ElMessageBox.confirm(
          `确定要${actionText}吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await updateUserRole(id, isAdmin ? 'user' : 'admin')
        ElMessage.success(`${actionText}成功`)
        fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('修改角色失败:', error)
          ElMessage.error(`${actionText}失败`)
        }
      }
    }

    // 切换用户状态
    const handleToggleStatus = async (id, status, username) => {
      const actionText = status === 'active' ? '禁用' : '启用'
      
      try {
        await ElMessageBox.confirm(
          `确定要${actionText}用户「${username}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 这里需要调用更新用户状态的接口
        // 暂时使用删除接口模拟
        if (status === 'active') {
          await deleteUser(id)
        }
        ElMessage.success(`${actionText}成功`)
        fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('切换状态失败:', error)
          ElMessage.error(`${actionText}失败`)
        }
      }
    }

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchUsers()
    }

    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchUsers()
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      searchQuery,
      selectedRole,
      selectedStatus,
      usersData: users,
      currentPage,
      pageSize,
      totalUsers,
      formatDate,
      handleSearch,
      handleViewDetail,
      handleEditRole,
      handleToggleStatus,
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

.role-select,
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
</style>