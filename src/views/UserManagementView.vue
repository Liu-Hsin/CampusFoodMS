<template>
  <div class="page-container admin-page">
    <h1>用户管理</h1>
    
    <div class="search-filter-section">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名或用户ID"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="selectedRole"
          placeholder="选择用户角色"
          clearable
          class="role-select"
        >
          <el-option label="全部" value="" />
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
        <el-select
          v-model="selectedStatus"
          placeholder="选择用户状态"
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
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="getRoleTagType(scope.row.role)">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleStatusChange(scope.row.id, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleViewDetail(scope.row.id)">详情</el-button>
            <el-button type="info" @click="handleToggleRole(scope.row.id, scope.row.username, scope.row.role)">
              切换角色
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

export default {
  name: 'UserManagementView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedRole = ref('')
    const selectedStatus = ref('')
    const users = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalUsers = ref(0)

    // 角色映射
    const getRoleText = (role) => {
      const roleMap = {
        'user': '普通用户',
        'admin': '管理员'
      }
      return roleMap[role] || role
    }

    const getRoleTagType = (role) => {
      const typeMap = {
        'user': 'primary',
        'admin': 'warning'
      }
      return typeMap[role] || 'info'
    }

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        // 在实际项目中，这里应该调用API获取用户列表
        // const response = await getUserList({
        //   page: currentPage.value,
        //   pageSize: pageSize.value,
        //   keyword: searchQuery.value,
        //   role: selectedRole.value,
        //   status: selectedStatus.value
        // })
        
        // 使用mock数据
        const mockUsers = [
          {
            id: 'U001',
            username: 'zhangsan',
            nickname: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138001',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-01 10:30:00'
          },
          {
            id: 'U002',
            username: 'lisi',
            nickname: '李四',
            email: 'lisi@example.com',
            phone: '13800138002',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-02 14:20:00'
          },
          {
            id: 'U003',
            username: 'wangwu',
            nickname: '王五',
            email: 'wangwu@example.com',
            phone: '13800138003',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-03 09:15:00'
          },
          {
            id: 'U004',
            username: 'zhaoliu',
            nickname: '赵六',
            email: 'zhaoliu@example.com',
            phone: '13800138004',
            role: 'user',
            status: 'inactive',
            createdAt: '2024-01-04 16:45:00'
          },
          {
            id: 'U005',
            username: 'sunqi',
            nickname: '孙七',
            email: 'sunqi@example.com',
            phone: '13800138005',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-05 11:30:00'
          },
          {
            id: 'U006',
            username: 'admin',
            nickname: '系统管理员',
            email: 'admin@example.com',
            phone: '13800138000',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-01 00:00:00'
          }
        ]

        // 处理筛选
        let filteredUsers = [...mockUsers]
        
        if (searchQuery.value) {
          const keyword = searchQuery.value.toLowerCase()
          filteredUsers = filteredUsers.filter(
            item => item.id.toLowerCase().includes(keyword) || 
                   item.username.toLowerCase().includes(keyword) ||
                   item.nickname.toLowerCase().includes(keyword)
          )
        }
        
        if (selectedRole.value) {
          filteredUsers = filteredUsers.filter(item => item.role === selectedRole.value)
        }

        if (selectedStatus.value) {
          filteredUsers = filteredUsers.filter(item => item.status === selectedStatus.value)
        }

        // 处理分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        
        users.value = filteredUsers.slice(start, end)
        totalUsers.value = filteredUsers.length

      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取用户列表失败')
        users.value = []
        totalUsers.value = 0
      }
    }

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1 // 重置为第一页
      fetchUsers()
    }

    // 查看详情
    const handleViewDetail = (id) => {
      ElMessage.info('用户详情功能开发中')
    }

    // 切换角色
    const handleToggleRole = async (id, username, currentRole) => {
      try {
        const newRole = currentRole === 'user' ? 'admin' : 'user'
        
        await ElMessageBox.confirm(
          `确定要将用户「${username}」的角色切换为「${getRoleText(newRole)}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 在实际项目中，这里应该调用API更新用户角色
        // await updateUserRole(id, newRole)
        
        ElMessage.success('角色切换成功')
        fetchUsers() // 重新加载列表
      } catch (error) {
        // 用户取消
      }
    }

    // 修改用户状态
    const handleStatusChange = async (id, newStatus) => {
      try {
        // 在实际项目中，这里应该调用API更新用户状态
        // await updateUserStatus(id, newStatus)
        
        ElMessage.success('用户状态更新成功')
      } catch (error) {
        ElMessage.error('用户状态更新失败')
        // 恢复原状态
        fetchUsers()
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
      getRoleText,
      getRoleTagType,
      handleSearch,
      handleViewDetail,
      handleToggleRole,
      handleStatusChange,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>