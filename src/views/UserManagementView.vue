<template>
  <div class="page-container">
    <!-- <h2 class="page-title">用户管理</h2> -->
    
    <div class="search-filter">
      <el-input v-model="username" placeholder="用户名" clearable style="width: 200px; margin-right: 10px"></el-input>
      <el-input v-model="email" placeholder="邮箱" clearable style="width: 200px; margin-right: 10px"></el-input>
      <el-select v-model="roleFilter" placeholder="用户角色" style="width: 150px; margin-right: 10px">
        <el-option label="全部" value=""></el-option>
        <el-option label="普通用户" value="user"></el-option>
        <el-option label="管理员" value="admin"></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    
    <div class="table-container">
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180"></el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row.id)">查看</el-button>
            <el-button type="warning" size="small" @click="handleToggleRole(scope.row)">切换角色</el-button>
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
import { getUserList, updateUserRole } from '../services/userService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'UserManagementView',
  setup() {
    const router = useRouter()
    const users = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const username = ref('')
    const email = ref('')
    const roleFilter = ref('')
    
    // 获取用户列表
    const fetchUserList = async () => {
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value
        }
        
        if (username.value) {
          params.username = username.value
        }
        
        if (email.value) {
          params.email = email.value
        }
        
        if (roleFilter.value) {
          params.role = roleFilter.value
        }
        
        const response = await getUserList(params)
        users.value = response.items || []
        total.value = response.total || 0
      } catch (error) {
        ElMessage.error('获取用户列表失败')
      }
    }
    
    // 搜索用户
    const handleSearch = () => {
      currentPage.value = 1
      fetchUserList()
    }
    
    // 查看用户详情
    const handleViewDetail = (id) => {
      router.push(`/user/${id}`)
    }
    
    // 切换用户角色
    const handleToggleRole = async (user) => {
      try {
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        await ElMessageBox.confirm(`确定要将 ${user.username} 的角色切换为 ${newRole === 'admin' ? '管理员' : '普通用户'} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await updateUserRole(user.id, newRole)
        ElMessage.success('角色切换成功')
        fetchUserList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('操作失败')
        }
      }
    }
    
    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchUserList()
    }
    
    const handleCurrentChange = (current) => {
      currentPage.value = current
      fetchUserList()
    }
    
    onMounted(() => {
      fetchUserList()
    })
    
    return {
      users,
      total,
      currentPage,
      pageSize,
      username,
      email,
      roleFilter,
      fetchUserList,
      handleSearch,
      handleViewDetail,
      handleToggleRole,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
/* 页面特定样式已移至全局样式文件 */
</style>