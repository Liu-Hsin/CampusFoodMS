// 管理员服务
import request  from './api'

// 模拟管理员数据
export const mockAdminUser = {
  username: 'admin',
  password: 'admin123', // 实际项目中应该使用加密密码
  isAdmin: true
}

/**
 * 管理员登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const adminLogin = async (credentials) => {
  try {
    // 实际项目中调用API
    const response = await request.post('/admin/login', credentials)
    if (response.data.success) {
      // 登录成功，保存token
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('isAdmin', 'true')
      return response.data
    } else {
      throw new Error(response.data.message || '登录失败')
    }
  } catch (error) {
    console.error('管理员登录失败:', error.message || '登录失败')
    // 模拟API调用延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        // 简单验证
        if (credentials.username === mockAdminUser.username && 
            credentials.password === mockAdminUser.password) {
          resolve({
            success: true,
            data: {
              token: 'admin-token',
              userInfo: {
                username: mockAdminUser.username,
                role: 'admin',
                isAdmin: true
              }
            },
            message: '登录成功'
          })
        } else {
          resolve({
            success: false,
            message: '用户名或密码错误'
          })
        }
      }, 1000)
    })
  }
}

/**
 * 获取管理员信息
 * @returns {Promise<Object>} 管理员信息
 */
export const getAdminInfo = async () => {
  try {
    // 实际项目中调用API
    // const response = await request.get('/admin/info')
    // return response.data
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            username: mockAdminUser.username,
            role: 'admin',
            permissions: ['food:manage', 'order:manage', 'user:manage', 'statistics:view']
          }
        })
      }, 500)
    })
  } catch (error) {
    console.error('获取管理员信息失败:', error)
    // 提供默认回退方案
    return {
      success: false,
      message: error.message || '获取信息失败'
    }
  }
}

/**
 * 管理员登出
 * @returns {Promise<Object>} 登出结果
 */
export const adminLogout = async () => {
  try {
    // 实际项目中调用API
    // const response = await request.post('/admin/logout')
    // return response.data
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true
        })
      }, 500)
    })
  } catch (error) {
    console.error('管理员登出失败:', error)
    // 提供默认回退方案
    return {
      success: false,
      message: error.message || '登出失败'
    }
  }
}