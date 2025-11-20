import api from './api'

// 获取食品列表
export const getFoodList = async (params = {}) => {
  const response = await api.get('/foods', { params })
  return response
}
export const getCategories = async () => {
  const response = await api.get('/foods/categories')
  return response
}
// 获取食品详情
export const getFoodDetail = async (id) => {
  const response = await api.get(`/foods/${id}`)
  return response
}

// 创建食品
export const createFood = async (foodData) => {
  const response = await api.post('/foods', foodData)
  return response
}

// 更新食品
export const updateFoodStatus = async (id, foodData) => {
  const response = await api.put(`/foods/${id}`, foodData)
  return response
}

// 删除食品
export const deleteFood = async (id) => {
  const response = await api.delete(`/foods/${id}`)
  return response
}

// 获取管理页面食品分类
export const getAdminFoodCategories = async () => {
  const response = await api.get('/foods')
  const categories = [...new Set(response.items.map(food => food.category))]
  return categories.map(cat => ({ label: cat, value: cat }))
}

// 获取管理页面食品列表
export const getAdminFoodList = async (params = {}) => {
  const response = await api.get('/foods', { params })
  return response
}

// 获取仪表盘统计数据
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats')
  return response
}

// 获取最近添加的食品
export const getRecentFoods = async () => {
  const response = await api.get('/foods/recent')
  return response
}

// 搜索食品
export const searchFoods = async (keyword) => {
  const response = await api.get('/foods/search', { params: { keyword } })
  return response
}