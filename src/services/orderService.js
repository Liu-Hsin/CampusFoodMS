import api from './api'

// 模拟订单数据
const mockOrders = [
  {
    id: '1',
    user: {
      id: '3', // 对应数据库中的张三用户ID
      name: '张三',
      phone: '13800138002'
    },
    items: [
      { foodId: '1', name: '宫保鸡丁', price: 28.00, quantity: 2 },
      { foodId: '6', name: '扬州炒饭', price: 22.00, quantity: 1 }
    ],
    totalAmount: 78.00,
    status: 'pending', // pending, confirmed, preparing, delivered, completed, cancelled
    createdAt: '2023-12-06T12:30:45Z',
    updatedAt: '2023-12-06T12:30:45Z',
    address: '学生公寓A栋101室'
  },
  {
    id: '2',
    user: {
      id: '4', // 对应数据库中的李四用户ID
      name: '李四',
      phone: '13800138003'
    },
    items: [
      { foodId: '2', name: '麻婆豆腐', price: 18.00, quantity: 1 },
      { foodId: '3', name: '糖醋排骨', price: 38.00, quantity: 1 }
    ],
    totalAmount: 56.00,
    status: 'confirmed',
    createdAt: '2023-12-06T11:20:30Z',
    updatedAt: '2023-12-06T11:30:15Z',
    address: '学生公寓B栋203室'
  },
  {
    id: '3',
    user: {
      id: '3', // 对应数据库中的张三用户ID
      name: '张三',
      phone: '13800138002'
    },
    items: [
      { foodId: '4', name: '清蒸鱼', price: 68.00, quantity: 1 },
      { foodId: '5', name: '北京烤鸭', price: 128.00, quantity: 1 }
    ],
    totalAmount: 196.00,
    status: 'completed',
    createdAt: '2023-12-05T18:45:10Z',
    updatedAt: '2023-12-05T19:30:25Z',
    address: '学生公寓A栋101室'
  },
  {
    id: '4',
    user: {
      id: '5', // 对应数据库中的王五用户ID
      name: '王五',
      phone: '13800138004'
    },
    items: [
      { foodId: '1', name: '宫保鸡丁', price: 28.00, quantity: 1 },
      { foodId: '2', name: '麻婆豆腐', price: 18.00, quantity: 1 },
      { foodId: '6', name: '扬州炒饭', price: 22.00, quantity: 2 }
    ],
    totalAmount: 90.00,
    status: 'preparing',
    createdAt: '2023-12-06T10:15:50Z',
    updatedAt: '2023-12-06T10:25:30Z',
    address: '教师公寓C栋302室'
  },
  {
    id: '5',
    user: {
      id: '2', // 对应数据库中的普通用户ID
      name: '普通用户',
      phone: '13800138001'
    },
    items: [
      { foodId: '3', name: '糖醋排骨', price: 38.00, quantity: 2 },
      { foodId: '6', name: '扬州炒饭', price: 22.00, quantity: 1 }
    ],
    totalAmount: 98.00,
    status: 'cancelled',
    createdAt: '2023-12-06T09:40:20Z',
    updatedAt: '2023-12-06T09:50:10Z',
    address: '学生公寓D栋405室'
  },
  {
    id: '6',
    user: {
      id: '2', // 对应数据库中的普通用户ID
      name: '普通用户',
      phone: '13800138001'
    },
    items: [
      { foodId: '5', name: '北京烤鸭', price: 128.00, quantity: 1 },
      { foodId: '4', name: '清蒸鱼', price: 68.00, quantity: 1 }
    ],
    totalAmount: 196.00,
    status: 'delivered',
    createdAt: '2023-12-06T13:20:15Z',
    updatedAt: '2023-12-06T14:05:30Z',
    address: '学生公寓E栋502室'
  }
]

// 获取订单列表
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

// 获取用户的订单
export const getUserOrders = async (userId, params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get(`/users/${userId}/orders`, { params })
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