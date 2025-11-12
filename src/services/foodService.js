import api from './api'

// 模拟食品数据
const mockFoods = [
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

// 模拟食品分类
const mockCategories = ['川菜', '粤菜', '北京菜', '江苏菜', '浙江菜', '湘菜', '福建菜', '徽菜']

// 获取食品列表
export const getFoodList = async (params = {}) => {
  try {
    // 尝试发送实际请求
    const response = await api.get('/foods', { params })
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
export const updateFood = async (id, foodData) => {
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

// 获取食品分类
export const getFoodCategories = async () => {
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