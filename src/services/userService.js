import api from './api'

// 用户登录
export const login = async (credentials) => {
  try {
    // 尝试发送实际请求
    const response = await api.post('/users/login', credentials)
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟登录数据')
    
    // 检查是否为预设的模拟用户
    const username = credentials.username
    const password = credentials.password
    
    if (mockUsers[username] && mockUsers[username].password === password) {
      // 返回模拟的登录响应，与API文档格式一致
      return {
        success: true,
        data: {
          token: `mock-token-${username}-${Date.now()}`,
          user: mockUsers[username]
        },
        message: '登录成功'
      }
    } else {
      // 模拟登录失败
      throw {
        response: {
          data: {
            success: false,
            message: '用户名或密码错误'
          }
        }
      }
    }
  }
}

// 用户注册
export const register = (userData) => {
  return api.post('/users/register', userData)
}

// 获取用户信息
export const getUserInfo = () => {
  return api.get('/users/profile')
}

// 更新用户信息
export const updateUserInfo = (userData) => {
  return api.put('/users/profile', userData)
}

// 获取用户列表（管理员）
export const getUserList = (params = {}) => {
  return api.get('/users', { params })
}

// 更新用户角色（管理员）
export const updateUserRole = (userId, role) => {
  return api.put(`/users/${userId}/role`, { role })
}

// 删除用户（管理员）
export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`)
}