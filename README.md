# 校园美食管理系统

## 项目简介
校园美食管理系统是一个基于Vue 3 + Vite开发的前端单页应用，为校园餐饮管理提供了完整的解决方案，包括美食展示、订单管理和用户管理等功能。

## 功能特点

### 1. 用户功能
- 登录认证与权限控制
- 美食浏览与搜索
- 订单创建与查询
- 个人信息管理

### 2. 管理员功能
- 美食管理（增删改查、分类管理、状态管理）
- 订单管理（查看订单详情、更新订单状态）
- 用户管理（查看用户信息、修改用户角色）

### 3. 系统特色
- 响应式设计，适配不同设备屏幕
- 优雅的UI界面，基于Element Plus组件库
- 完善的错误处理和数据验证
- 模块化设计，易于维护和扩展

## 技术栈
- **前端框架**：Vue 3
- **构建工具**：Vite
- **路由管理**：Vue Router 4
- **UI组件库**：Element Plus
- **HTTP客户端**：Axios
- **状态管理**：Vue内置状态管理
- **图标库**：Element Plus Icons

## 项目结构
```
CampusFoodMS/
├── dist/             # 构建输出目录
├── node_modules/     # 项目依赖
├── public/           # 静态资源
├── src/              # 源代码
│   ├── assets/       # 资源文件
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── services/     # API服务
│   ├── utils/        # 工具函数
│   ├── views/        # 视图组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── index.html        # HTML模板
├── package.json      # 项目配置和依赖
└── vite.config.js    # Vite配置文件
```

## 安装与运行

### 环境要求
- Node.js >= 16.0.0（推荐20.19+或22.12+）
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装步骤
1. 克隆项目到本地
```bash
git clone <项目仓库地址>
cd CampusFoodMS
```

2. 安装依赖
```bash
npm install
# 或使用yarn
# yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或使用yarn
# yarn dev
```

4. 打开浏览器访问
默认地址：http://localhost:5173

## 构建项目

### 生产环境构建
```bash
npm run build
# 或使用yarn
# yarn build
```
构建后的文件将生成在`dist`目录中，可以部署到任何静态文件服务器。

### 预览构建结果
```bash
npm run preview
# 或使用yarn
# yarn preview
```

## 开发说明

### 路由配置
路由配置位于`src/router/index.js`，包括了所有页面的路由定义和权限控制。

### API服务
所有与后端的交互都通过`src/services/`目录下的服务文件进行封装，使用Axios发送HTTP请求。

### 组件开发
- 页面组件放在`src/views/`目录下
- 可复用组件放在`src/components/`目录下
- 使用Element Plus组件库构建界面

### 模拟数据
为了在没有后端服务的情况下也能完整测试系统功能，项目已内置了丰富的模拟数据支持：

#### 模拟用户账户
- **普通用户**：用户名 `user`，密码 `123456`
- **管理员**：用户名 `admin`，密码 `admin123`

#### 模拟食品数据
系统包含6种预设的食品数据：
- 宫保鸡丁
- 麻婆豆腐
- 糖醋排骨
- 清蒸鱼
- 北京烤鸭
- 扬州炒饭

每种食品都包含完整的信息（名称、价格、描述、图片、分类等）。

#### 模拟订单数据
系统包含6个不同状态的预设订单：
- 待处理（pending）
- 已确认（confirmed）
- 准备中（preparing）
- 已送达（delivered）
- 已完成（completed）
- 已取消（cancelled）

#### 数据使用方式
当后端服务不可用时，系统会自动切换到模拟数据模式，无需额外配置。模拟数据支持以下操作：
- 用户登录认证
- 浏览和搜索食品
- 查看食品详情
- 创建和查看订单
- 管理食品（管理员）
- 管理订单（管理员）

所有模拟数据都定义在`src/services/`目录下的对应服务文件中。

## 常见问题

### 1. 构建失败
- 检查Node.js版本是否符合要求
- 确保所有依赖已正确安装
- 查看具体错误信息，针对性解决

### 2. 依赖冲突
- 尝试删除`node_modules`和`package-lock.json`后重新安装
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. 接口请求失败
- 确认后端服务是否正常运行
- 检查API地址和端口配置是否正确

## 许可证
MIT License

## 致谢
感谢Vue.js、Vite、Element Plus等开源项目提供的技术支持。