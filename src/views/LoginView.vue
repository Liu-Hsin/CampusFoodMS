<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">校园美食管理系统</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="Avatar"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
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
import { login } from '../services/userService'

export default {
  name: 'LoginView',
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
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
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
        const response = await login(loginForm.username, loginForm.password)
        
        // 存储用户信息和token
        localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
        localStorage.setItem('token', response.token)
        
        // 显示成功消息
        ElMessage.success('登录成功')
        
        // 跳转到首页
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
        
        // 如果是表单验证失败，不显示错误消息
        if (error?.message !== 'Cancel') {
          ElMessage.error(error?.message || '登录失败，请检查用户名和密码')
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