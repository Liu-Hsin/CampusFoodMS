<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2 class="login-title">校园美食管理系统 - 登录</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { login } from '../services/userService'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const loginForm = ref({
      username: '',
      password: ''
    })
    const loginLoading = ref(false)
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      // 表单验证
      const valid = await loginFormRef.value.validate().catch(() => false)
      if (!valid) {
        return
      }
      
      loginLoading.value = true
      try {
        const response = await login(loginForm.value)
        if (response.token) {
          // 存储token和用户信息
          localStorage.setItem('token', response.token)
          localStorage.setItem('userInfo', JSON.stringify(response.user))
          localStorage.setItem('isAdmin', response.user.isAdmin)
          
          ElMessage.success('登录成功')
          
          // 跳转到首页
          router.push('/')
        }
      } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error(error.response?.data?.message || '登录失败，请重试')
      } finally {
        loginLoading.value = false
      }
    }
    
    return {
      loginFormRef,
      loginForm,
      rules,
      loginLoading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
}
</style>