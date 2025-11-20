import api from './api'

// 获取订单列表（普通用户）
export const getOrderList = async (params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/orders', { params })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟订单列表数据')
    
    // 模拟筛选和分页
    let filteredOrders = [...mockOrders]
    
    // 按状态筛选
    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }
    
    // 按用户ID筛选
    if (params.userId) {
      filteredOrders = filteredOrders.filter(order => order.user.id === params.userId)
    }
    
    // 模拟分页
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize)
    
    return {
      items: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
}

// 获取订单详情
export const getOrderDetail = async (id) => {
  try {
    // 尝试发送实际请求
    const response = await api.get(`/orders/${id}`)
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟订单详情数据')
    
    const order = mockOrders.find(o => o.id === id)
    if (order) {
      return order
    } else {
      throw {
        response: {
          data: {
            message: '订单不存在'
          }
        }
      }
    }
  }
}

// 创建订单
export const createOrder = async (orderData) => {
  try {
    // 尝试发送实际请求
    const response = await api.post('/orders', orderData)
    return response
  } catch (error) {
    // 后端服务不可用时，模拟创建成功
    console.log('后端服务不可用，模拟创建订单成功')
    
    // 从localStorage获取当前用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
      id: '101',
      name: '当前用户',
      phone: '13800138000'
    }
    
    const newOrder = {
      id: Date.now().toString(),
      user: userInfo,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockOrders.unshift(newOrder)
    return newOrder
  }
}

// 更新订单状态
export const updateOrderStatus = async (id, status) => {
  try {
    // 尝试发送实际请求
    const response = await api.put(`/orders/${id}/status`, { status })
    return response
  } catch (error) {
    // 后端服务不可用时，模拟更新成功
    console.log('后端服务不可用，模拟更新订单状态成功')
    
    const order = mockOrders.find(o => o.id === id)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
      return order
    } else {
      throw {
        response: {
          data: {
            message: '订单不存在'
          }
        }
      }
    }
  }
}

// 获取所有订单（管理员）
export const getAllOrders = async (params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/orders/admin', { params })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟所有订单数据')
    
    // 模拟筛选和分页
    let filteredOrders = [...mockOrders]
    
    // 按状态筛选
    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }
    
    // 模拟分页
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize)
    
    return {
      items: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
}

// 获取用户的订单
export const getUserOrders = async (userId, params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/orders', { params })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟用户订单数据')
    
    // 筛选用户订单
    let userOrders = mockOrders.filter(order => order.user.id === userId)
    
    // 按状态筛选
    if (params.status) {
      userOrders = userOrders.filter(order => order.status === params.status)
    }
    
    // 模拟分页
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const paginatedOrders = userOrders.slice(startIndex, startIndex + pageSize)
    
    return {
      items: paginatedOrders,
      total: userOrders.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
}

// 取消订单
export const cancelOrder = async (id) => {
  try {
    // 尝试发送实际请求
    const response = await api.put(`/orders/${id}/cancel`)
    return response
  } catch (error) {
    // 后端服务不可用时，模拟取消成功
    console.log('后端服务不可用，模拟取消订单成功')
    
    const order = mockOrders.find(o => o.id === id)
    if (order && ['pending', 'confirmed'].includes(order.status)) {
      order.status = 'cancelled'
      order.updatedAt = new Date().toISOString()
      return order
    } else if (order) {
      throw {
        response: {
          data: {
            message: '该订单状态不允许取消'
          }
        }
      }
    } else {
      throw {
        response: {
          data: {
            message: '订单不存在'
          }
        }
      }
    }
  }
}