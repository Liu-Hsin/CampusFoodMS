<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2 class="login-title">管理员登录</h2>
        <p class="login-subtitle">校园美食管理系统</p>
      </div>
      
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        class="login-form"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入管理员用户名"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入管理员密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="isLoading"
            class="login-button"
            size="large"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-footer">
          <el-link type="info" @click="goToHome">返回首页</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { adminLogin } from '@/services/adminService'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const isLoading = ref(false)
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
      ]
    }
    
    // 登录方法现在使用服务层的adminLogin函数
    
    const handleLogin = async () => {
      // 表单验证
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        isLoading.value = true
        
        // 调用服务层的登录方法
        const result = await adminLogin({
          username: loginForm.value.username,
          password: loginForm.value.password
        })
        
        if (result.success) {
          // 存储登录信息
          localStorage.setItem('token', result.data.token)
          localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo))
          localStorage.setItem('isAdmin', 'true')
          
          ElMessage.success('登录成功！')
          router.push('/admin/dashboard')
        } else {
          ElMessage.error(result.message || '用户名或密码错误，请确认您是管理员')
        }
        
        isLoading.value = false
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请稍后再试')
        isLoading.value = false
      }
    }
    
    const goToHome = () => {
      router.push('/')
    }
    
    return {
      loginForm,
      loginFormRef,
      rules,
      isLoading,
      handleLogin,
      goToHome
    }
  }
}
</script>

<style scoped>
/* 所有样式已移至 page-common.css */
</style>