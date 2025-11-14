import api from './api'

// 模拟食品数据（前端展示用）
export const mockFoods = [
  {
    id: '1',
    name: '宫保鸡丁',
    description: '经典川菜，麻辣鲜香',
    price: 28.00,
    originalPrice: 32.00,
    image: 'https://picsum.photos/id/1/300/200',
    category: '川菜',
    status: 'available',
    sales: 1200,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '2',
    name: '麻婆豆腐',
    description: '麻辣嫩滑，下饭神器',
    price: 18.00,
    originalPrice: 22.00,
    image: 'https://picsum.photos/id/2/300/200',
    category: '川菜',
    status: 'available',
    sales: 1500,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '3',
    name: '糖醋排骨',
    description: '酸甜可口，色泽红亮',
    price: 38.00,
    originalPrice: 42.00,
    image: 'https://picsum.photos/id/3/300/200',
    category: '粤菜',
    status: 'available',
    sales: 980,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '4',
    name: '清蒸鱼',
    description: '鲜嫩多汁，原汁原味',
    price: 68.00,
    originalPrice: 78.00,
    image: 'https://picsum.photos/id/4/300/200',
    category: '粤菜',
    status: 'available',
    sales: 850,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '5',
    name: '北京烤鸭',
    description: '外酥里嫩，北京特产',
    price: 128.00,
    originalPrice: 158.00,
    image: 'https://picsum.photos/id/5/300/200',
    category: '北京菜',
    status: 'available',
    sales: 1800,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  },
  {
    id: '6',
    name: '扬州炒饭',
    description: '配料丰富，香气四溢',
    price: 22.00,
    originalPrice: 26.00,
    image: 'https://picsum.photos/id/6/300/200',
    category: '江苏菜',
    status: 'available',
    sales: 2100,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z'
  }
]

// 管理页面模拟食品数据
export const mockAdminFoods = [
  { id: '1', name: '香辣牛肉汉堡', category: '快餐', price: 18.5, image: '', status: 'available', createdAt: '2023-10-01 10:30:00' },
  { id: '2', name: '台式卤肉饭', category: '主食', price: 15.0, image: '', status: 'available', createdAt: '2023-10-02 14:20:00' },
  { id: '3', name: '宫保鸡丁', category: '炒菜', price: 22.0, image: '', status: 'available', createdAt: '2023-10-03 09:15:00' },
  { id: '4', name: '珍珠奶茶', category: '饮品', price: 12.0, image: '', status: 'unavailable', createdAt: '2023-10-04 16:45:00' },
  { id: '5', name: '黑椒牛排意面', category: '西餐', price: 28.0, image: '', status: 'available', createdAt: '2023-10-05 11:00:00' },
  { id: '6', name: '糖醋排骨', category: '炒菜', price: 25.0, image: '', status: 'available', createdAt: '2023-10-06 13:30:00' }
]

// Dashboard页面最近添加的美食模拟数据
export const mockRecentFoods = [
  { id: '1', name: '香辣牛肉汉堡', category: '快餐', price: 18.5, status: 'available' },
  { id: '2', name: '台式卤肉饭', category: '主食', price: 15.0, status: 'available' },
  { id: '3', name: '宫保鸡丁', category: '炒菜', price: 22.0, status: 'available' },
  { id: '4', name: '珍珠奶茶', category: '饮品', price: 12.0, status: 'unavailable' },
  { id: '5', name: '黑椒牛排意面', category: '西餐', price: 28.0, status: 'available' }
]

// Dashboard页面统计数据
export const mockDashboardStats = {
  totalFoods: 6,
  totalOrders: 25,
  totalUsers: 120
}

// 模拟食品分类
export const mockCategories = ['川菜', '粤菜', '北京菜', '江苏菜', '浙江菜', '湘菜', '福建菜', '徽菜']

// 管理页面模拟食品分类
export const mockAdminCategories = [
  { label: '快餐', value: '快餐' },
  { label: '主食', value: '主食' },
  { label: '炒菜', value: '炒菜' },
  { label: '饮品', value: '饮品' },
  { label: '西餐', value: '西餐' },
  { label: '甜点', value: '甜点' },
  { label: '其他', value: '其他' }
]

// 获取食品列表
export const getFoodList = async (params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.post('/foods', { params })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟食品列表数据')
    
    // 模拟分页和筛选
    let filteredFoods = [...mockFoods]
    
    // 按分类筛选
    if (params.category) {
      filteredFoods = filteredFoods.filter(food => food.category === params.category)
    }
    
    // 按状态筛选
    if (params.status) {
      filteredFoods = filteredFoods.filter(food => food.status === params.status)
    }
    
    // 模拟分页
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const paginatedFoods = filteredFoods.slice(startIndex, startIndex + pageSize)
    
    return {
      items: paginatedFoods,
      total: filteredFoods.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
}
export const  getCategories = async () => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/foods/categories')
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟食品分类数据')
    return mockCategories
  }
}
// 获取食品详情
export const getFoodDetail = async (id) => {
  try {
    // 尝试发送实际请求
    const response = await api.get(`/foods/${id}`)
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟食品详情数据')
    
    const food = mockFoods.find(f => f.id === id)
    if (food) {
      return food
    } else {
      throw {
        response: {
          data: {
            message: '食品不存在'
          }
        }
      }
    }
  }
}

// 创建食品
export const createFood = async (foodData) => {
  try {
    // 尝试发送实际请求
    const response = await api.post('/foods', foodData)
    return response
  } catch (error) {
    // 后端服务不可用时，模拟创建成功
    console.log('后端服务不可用，模拟创建食品成功')
    
    const newFood = {
      id: Date.now().toString(),
      ...foodData,
      sales: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockFoods.unshift(newFood)
    return newFood
  }
}

// 更新食品
export const updateFoodStatus = async (id, foodData) => {
  try {
    // 尝试发送实际请求
    const response = await api.put(`/foods/${id}`, foodData)
    return response
  } catch (error) {
    // 后端服务不可用时，模拟更新成功
    console.log('后端服务不可用，模拟更新食品成功')
    
    const index = mockFoods.findIndex(f => f.id === id)
    if (index !== -1) {
      mockFoods[index] = {
        ...mockFoods[index],
        ...foodData,
        updatedAt: new Date().toISOString()
      }
      return mockFoods[index]
    } else {
      throw {
        response: {
          data: {
            message: '食品不存在'
          }
        }
      }
    }
  }
}

// 删除食品
export const deleteFood = async (id) => {
  try {
    // 尝试发送实际请求
    const response = await api.delete(`/foods/${id}`)
    return response
  } catch (error) {
    // 后端服务不可用时，模拟删除成功
    console.log('后端服务不可用，模拟删除食品成功')
    
    const index = mockFoods.findIndex(f => f.id === id)
    if (index !== -1) {
      mockFoods.splice(index, 1)
      return { success: true }
    } else {
      throw {
        response: {
          data: {
            message: '食品不存在'
          }
        }
      }
    }
  }
}

// 获取管理页面食品分类
export const getAdminFoodCategories = async () => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/foods/categories')
    return response.map(cat => ({ label: cat, value: cat }))
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟管理页面食品分类数据')
    return mockAdminCategories
  }
}

// 获取管理页面食品列表
export const getAdminFoodList = async (params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/admin/foods', { params })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟管理页面食品列表数据')
    
    let foods = mockAdminFoods.map(food => ({
      ...food,
      id: food.id || Math.floor(Math.random() * 1000),
      status: food.status || '上架',
      createdAt: food.createdAt || new Date().toLocaleString()
    }))
    
    return {
      list: foods,
      total: foods.length
    }
  }
}

// 获取Dashboard统计数据
export const getDashboardStats = async () => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/admin/dashboard/stats')
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟Dashboard统计数据')
    
    // 生成一些随机数据增加真实感
    return {
      totalFoods: mockDashboardStats.totalFoods,
      totalOrders: Math.floor(Math.random() * 50) + 10,
      totalUsers: Math.floor(Math.random() * 200) + 50
    }
  }
}

// 获取最近添加的美食
export const getRecentFoods = async (limit = 5) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/admin/foods/recent', { params: { limit } })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟最近添加的美食数据')
    return mockRecentFoods.slice(0, limit)
  }
}

// 搜索食品
export const searchFoods = async (keyword) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/foods/search', { params: { keyword } })
    return response
  } catch (error) {
    // 后端服务不可用时，使用模拟数据
    console.log('后端服务不可用，使用模拟搜索数据')
    
    const results = mockFoods.filter(food => 
      food.name.toLowerCase().includes(keyword.toLowerCase()) ||
      food.description.toLowerCase().includes(keyword.toLowerCase()) ||
      food.category.toLowerCase().includes(keyword.toLowerCase())
    )
    
    return results
  }
}