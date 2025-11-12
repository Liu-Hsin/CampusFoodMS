import api from './api'

// 模拟用户数据
const mockUsers = {
  // 普通用户
  user: {
    username: 'user',
    password: '123456',
    id: '1',
    name: '普通用户',
    email: 'user@example.com',
    isAdmin: false,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-12-01T00:00:00Z'
  },
  // 管理员用户
  admin: {
    username: 'admin',
    password: 'admin123',
    id: '2',
    name: '管理员',
    email: 'admin@example.com',
    isAdmin: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-12-01T00:00:00Z'
  }
}

// 用户登录
export const login = async (credentials) => {
  try {
    // 尝试发送实际请求
    const response = await api.post('/auth/login', credentials)
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟登录数据')
    
    // 检查是否为预设的模拟用户
    const username = credentials.username.toLowerCase()
    const password = credentials.password
    
    if (mockUsers[username] && mockUsers[username].password === password) {
      // 返回模拟的登录响应
      return {
        token: `mock-token-${username}-${Date.now()}`,
        user: mockUsers[username]
      }
    } else {
      // 模拟登录失败
      throw {
        response: {
          data: {
            message: '用户名或密码错误'
          }
        }
      }
    }
  }
}

// 用户注册
export const register = (userData) => {
  return api.post('/auth/register', userData)
}

// 获取用户信息
export const getUserInfo = () => {
  return api.get('/users/me')
}

// 更新用户信息
export const updateUserInfo = (userData) => {
  return api.put('/users/me', userData)
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