# 校园美食管理系统

## 项目介绍
校园美食管理系统是一个专为高校食堂或校园餐饮服务设计的综合管理平台，提供食品管理、订单处理、用户管理等功能，旨在提升校园餐饮服务的效率和用户体验。

## 项目结构
```
src/
├── assets/             # 静态资源文件
├── router/             # 路由配置
│   └── index.js        # 路由主文件
├── services/           # 服务层
│   ├── api.js          # API基础配置
│   ├── adminService.js # 管理员相关服务
│   ├── foodService.js  # 食品相关服务
│   ├── orderService.js # 订单相关服务
│   └── userService.js  # 用户相关服务
├── styles/             # 样式文件
│   └── page-common.css # 公共页面样式
├── views/              # 视图组件
│   ├── admin/          # 管理员页面
│   │   ├── DashboardView.vue     # 管理员仪表盘
│   │   ├── FoodListView.vue      # 管理员食品列表
│   │   └── LoginView.vue         # 管理员登录页
│   ├── FoodDetailView.vue        # 食品详情页
│   ├── FoodListView.vue          # 食品列表页
│   ├── HomeView.vue              # 首页
│   ├── OrderManagementView.vue   # 订单管理页
│   └── UserManagementView.vue    # 用户管理页
├── App.vue             # 根组件
├── main.js             # 入口文件
└── style.css           # 全局样式
```

## 页面清单

### 公共页面
1. **首页** (`/`) - 系统首页，展示校园美食信息
2. **食品列表** (`/food`) - 展示所有可订购的食品
3. **食品详情** (`/food/:id`) - 展示特定食品的详细信息

### 管理员页面
1. **管理员登录** (`/admin/login`) - 管理员登录界面
2. **管理员仪表盘** (`/admin/dashboard`) - 管理员后台主界面
3. **美食管理** (`/admin/food-management`) - 管理食品信息，包括添加、编辑、删除和状态管理
4. **订单管理** (`/admin/order-management`) - 查看和管理所有订单
5. **用户管理** (`/admin/user-management`) - 管理系统用户，包括查看、编辑和删除用户

## 技术栈
- **前端框架**: Vue 3
- **路由管理**: Vue Router 4
- **UI组件库**: Element Plus 2.5.0
- **HTTP客户端**: Axios 1.6.0
- **构建工具**: Vite 7.2.2
- **开发语言**: JavaScript

## 项目启动方式

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 功能特性

### 1. 用户管理
- 用户注册和登录
- 用户信息管理
- 用户权限控制

### 2. 食品管理
- 食品信息的增删改查
- 食品分类管理
- 食品状态管理（上架/下架）

### 3. 订单管理
- 创建和查看订单
- 订单状态更新
- 订单历史记录查询

### 4. 管理员功能
- 管理员登录和身份验证
- 系统数据概览
- 全面的用户、食品和订单管理权限

## 注意事项
1. 当前系统使用模拟数据进行演示，实际部署时需要连接后端API
2. API基础URL配置在 `services/api.js` 中，可根据实际后端地址进行修改
3. 系统包含路由守卫，确保管理员页面只有授权用户可以访问
4. 登录状态通过localStorage进行管理，在生产环境中建议使用更安全的方式

## 浏览器兼容性
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 开发说明
- 项目使用Vue 3的Composition API进行开发
- 采用组件化和模块化的开发方式
- 支持响应式布局，适配不同屏幕尺寸