<template>
  <div class="login-container admin-login">
    <div class="login-box">
      <h2 class="login-title">管理员登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入管理员用户名"
            clearable
            prefix-icon="Avatar"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入管理员密码"
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="loginLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { adminLogin } from '../../services/adminService'

export default {
  name: 'AdminLoginView',
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const loginLoading = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const loginRules = {
      username: [
        { required: true, message: '请输入管理员用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入管理员密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      try {
        // 表单验证
        await loginFormRef.value.validate()
        
        // 设置加载状态
        loginLoading.value = true
        
        // 调用登录接口
        const response = await adminLogin(loginForm.username, loginForm.password)
        
        // 存储管理员信息和token
        localStorage.setItem('adminInfo', JSON.stringify(response.adminInfo))
        localStorage.setItem('token', response.token)
        localStorage.setItem('isAdmin', 'true')
        
        // 显示成功消息
        ElMessage.success('管理员登录成功')
        
        // 跳转到管理仪表盘
        router.push('/admin/dashboard')
      } catch (error) {
        console.error('管理员登录失败:', error)
        
        // 如果是表单验证失败，不显示错误消息
        if (error?.message !== 'Cancel') {
          ElMessage.error(error?.message || '管理员登录失败，请检查用户名和密码')
        }
      } finally {
        // 重置加载状态
        loginLoading.value = false
      }
    }
    
    return {
      loginFormRef,
      loginForm,
      loginRules,
      loginLoading,
      handleLogin
    }
  }
}
</script>