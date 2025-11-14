# 校园美食管理系统 - API接口文档

## 接口概述
本文档详细描述校园美食管理系统所需的后端API接口，供后端开发人员参考实现。所有接口均基于RESTful设计风格，返回JSON格式数据。

## 基础配置
- **基础URL**: `http://127.0.0.1:8080/api`
- **请求头**: 
  - `Content-Type: application/json`
  - 认证接口成功后需在后续请求中添加: `Authorization: Bearer {token}`
- **响应格式**:
  ```json
  {
    "success": true/false,
    "data": {}, // 返回的数据
    "message": "操作结果描述"
  }
  ```

## 1. 认证接口

### 1.1 用户登录
- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录获取访问令牌
- **请求参数**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string"  // 密码
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "string", // JWT令牌
      "user": {
        "id": "string",
        "username": "string",
        "name": "string",
        "email": "string",
        "isAdmin": boolean
      }
    },
    "message": "登录成功"
  }
  ```

### 1.2 用户注册
- **URL**: `/auth/register`
- **方法**: `POST`
- **描述**: 新用户注册
- **请求参数**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string", // 密码
    "name": "string",     // 姓名
    "email": "string"     // 邮箱
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "name": "string",
      "email": "string"
    },
    "message": "注册成功"
  }
  ```

### 1.3 管理员登录
- **URL**: `/admin/login`
- **方法**: `POST`
- **描述**: 管理员专用登录接口
- **请求参数**:
  ```json
  {
    "username": "string", // 管理员用户名
    "password": "string"  // 管理员密码
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "token": "string",
      "userInfo": {
        "username": "string",
        "role": "admin",
        "isAdmin": true
      }
    },
    "message": "登录成功"
  }
  ```

### 1.4 管理员登出
- **URL**: `/admin/logout`
- **方法**: `POST`
- **描述**: 管理员登出
- **认证**: 需要管理员token
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

## 2. 用户接口

### 2.1 获取当前用户信息
- **URL**: `/users/me`
- **方法**: `GET`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要token
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "name": "string",
      "email": "string",
      "isAdmin": boolean,
      "createdAt": "string",
      "lastLogin": "string"
    }
  }
  ```

### 2.2 更新用户信息
- **URL**: `/users/me`
- **方法**: `PUT`
- **描述**: 更新当前用户的基本信息
- **认证**: 需要token
- **请求参数**:
  ```json
  {
    "name": "string",     // 姓名
    "email": "string"     // 邮箱
    // 可根据需求添加其他字段
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "name": "string",
      "email": "string"
    },
    "message": "更新成功"
  }
  ```

### 2.3 获取用户列表（管理员）
- **URL**: `/users`
- **方法**: `GET`
- **描述**: 获取系统中的所有用户列表
- **认证**: 需要管理员token
- **请求参数** (查询参数):
  - `page`: 页码，默认为1
  - `pageSize`: 每页数量，默认为10
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "username": "string",
          "name": "string",
          "email": "string",
          "isAdmin": boolean,
          "createdAt": "string",
          "lastLogin": "string"
        }
      ],
      "total": number,
      "page": number,
      "pageSize": number
    }
  }
  ```

### 2.4 更新用户角色（管理员）
- **URL**: `/users/:userId/role`
- **方法**: `PUT`
- **描述**: 更新指定用户的角色权限
- **认证**: 需要管理员token
- **路径参数**:
  - `userId`: 用户ID
- **请求参数**:
  ```json
  {
    "role": "string" // 角色类型，如 "admin" 或 "user"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "角色更新成功"
  }
  ```

### 2.5 删除用户（管理员）
- **URL**: `/users/:userId`
- **方法**: `DELETE`
- **描述**: 删除指定用户
- **认证**: 需要管理员token
- **路径参数**:
  - `userId`: 用户ID
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "用户删除成功"
  }
  ```

## 3. 食品接口

### 3.1 获取食品列表
- **URL**: `/foods`
- **方法**: `POST`
- **描述**: 获取食品列表，支持分页和筛选
- **请求参数**:
  ```json
  {
    "params": {
      "page": 1,
      "pageSize": 10,
      "category": "string", // 可选，按分类筛选
      "status": "string"    // 可选，按状态筛选
    }
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "price": number,
          "originalPrice": number,
          "image": "string",
          "category": "string",
          "status": "string", // available, unavailable
          "sales": number,
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "total": number,
      "page": number,
      "pageSize": number
    }
  }
  ```

### 3.2 获取食品分类列表
- **URL**: `/foods/categories`
- **方法**: `GET`
- **描述**: 获取所有食品分类
- **成功响应**:
  ```json
  {
    "success": true,
    "data": [
      "川菜", "粤菜", "北京菜", "江苏菜", "浙江菜", "湘菜", "福建菜", "徽菜"
    ]
  }
  ```

### 3.3 获取食品详情
- **URL**: `/foods/:id`
- **方法**: `GET`
- **描述**: 获取指定食品的详细信息
- **路径参数**:
  - `id`: 食品ID
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "originalPrice": number,
      "image": "string",
      "category": "string",
      "status": "string",
      "sales": number,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 3.4 创建食品（管理员）
- **URL**: `/foods`
- **方法**: `POST`
- **描述**: 创建新的食品
- **认证**: 需要管理员token
- **请求参数**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "originalPrice": number,
    "image": "string",
    "category": "string",
    "status": "string"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "originalPrice": number,
      "image": "string",
      "category": "string",
      "status": "string",
      "sales": 0,
      "createdAt": "string",
      "updatedAt": "string"
    },
    "message": "食品创建成功"
  }
  ```

### 3.5 更新食品信息（管理员）
- **URL**: `/foods/:id`
- **方法**: `PUT`
- **描述**: 更新指定食品的信息
- **认证**: 需要管理员token
- **路径参数**:
  - `id`: 食品ID
- **请求参数**:
  ```json
  {
    "name": "string",        // 可选
    "description": "string", // 可选
    "price": number,          // 可选
    "originalPrice": number,  // 可选
    "image": "string",       // 可选
    "category": "string",    // 可选
    "status": "string"       // 可选
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "originalPrice": number,
      "image": "string",
      "category": "string",
      "status": "string",
      "sales": number,
      "createdAt": "string",
      "updatedAt": "string"
    },
    "message": "食品更新成功"
  }
  ```

### 3.6 删除食品（管理员）
- **URL**: `/foods/:id`
- **方法**: `DELETE`
- **描述**: 删除指定食品
- **认证**: 需要管理员token
- **路径参数**:
  - `id`: 食品ID
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "食品删除成功"
  }
  ```

## 4. 订单接口

### 4.1 获取订单列表
- **URL**: `/orders`
- **方法**: `GET`
- **描述**: 获取订单列表，支持分页和筛选
- **认证**: 需要token，管理员可查看所有订单
- **请求参数** (查询参数):
  - `page`: 页码，默认为1
  - `pageSize`: 每页数量，默认为10
  - `status`: 可选，按状态筛选
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "user": {
            "id": "string",
            "name": "string",
            "phone": "string"
          },
          "items": [
            {
              "foodId": "string",
              "name": "string",
              "price": number,
              "quantity": number
            }
          ],
          "totalAmount": number,
          "status": "string",
          "createdAt": "string",
          "updatedAt": "string",
          "address": "string"
        }
      ],
      "total": number,
      "page": number,
      "pageSize": number
    }
  }
  ```

### 4.2 获取订单详情
- **URL**: `/orders/:id`
- **方法**: `GET`
- **描述**: 获取指定订单的详细信息
- **认证**: 需要token，管理员可查看所有订单详情
- **路径参数**:
  - `id`: 订单ID
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "phone": "string"
      },
      "items": [
        {
          "foodId": "string",
          "name": "string",
          "price": number,
          "quantity": number
        }
      ],
      "totalAmount": number,
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "address": "string"
    }
  }
  ```

### 4.3 创建订单
- **URL**: `/orders`
- **方法**: `POST`
- **描述**: 创建新订单
- **认证**: 需要token
- **请求参数**:
  ```json
  {
    "items": [
      {
        "foodId": "string",
        "name": "string",
        "price": number,
        "quantity": number
      }
    ],
    "totalAmount": number,
    "address": "string"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "phone": "string"
      },
      "items": [
        {
          "foodId": "string",
          "name": "string",
          "price": number,
          "quantity": number
        }
      ],
      "totalAmount": number,
      "status": "pending",
      "createdAt": "string",
      "updatedAt": "string",
      "address": "string"
    },
    "message": "订单创建成功"
  }
  ```

### 4.4 更新订单状态（管理员）
- **URL**: `/orders/:id/status`
- **方法**: `PUT`
- **描述**: 更新指定订单的状态
- **认证**: 需要管理员token
- **路径参数**:
  - `id`: 订单ID
- **请求参数**:
  ```json
  {
    "status": "string" // pending, confirmed, preparing, delivered, completed, cancelled
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "status": "string",
      "updatedAt": "string"
    },
    "message": "订单状态更新成功"
  }
  ```

### 4.5 获取用户订单列表
- **URL**: `/users/:userId/orders`
- **方法**: `GET`
- **描述**: 获取指定用户的订单列表
- **认证**: 需要token，用户只能查看自己的订单
- **路径参数**:
  - `userId`: 用户ID
- **请求参数** (查询参数):
  - `page`: 页码，默认为1
  - `pageSize`: 每页数量，默认为10
  - `status`: 可选，按状态筛选
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "items": [
            {
              "foodId": "string",
              "name": "string",
              "price": number,
              "quantity": number
            }
          ],
          "totalAmount": number,
          "status": "string",
          "createdAt": "string",
          "updatedAt": "string",
          "address": "string"
        }
      ],
      "total": number,
      "page": number,
      "pageSize": number
    }
  }
  ```

## 5. 管理员接口

### 5.1 获取管理员信息
- **URL**: `/admin/info`
- **方法**: `GET`
- **描述**: 获取当前管理员的信息和权限
- **认证**: 需要管理员token
- **成功响应**:
  ```json
  {
    "success": true,
    "data": {
      "username": "string",
      "role": "admin",
      "permissions": ["food:manage", "order:manage", "user:manage", "statistics:view"]
    }
  }
  ```

## 6. 数据字典

### 6.1 订单状态
- `pending`: 待处理
- `confirmed`: 已确认
- `preparing`: 准备中
- `delivered`: 已送达
- `completed`: 已完成
- `cancelled`: 已取消

### 6.2 食品状态
- `available`: 可购买
- `unavailable`: 不可购买

## 7. 错误码说明
- `400`: 请求参数错误
- `401`: 未授权或登录过期
- `403`: 没有权限执行此操作
- `404`: 请求的资源不存在
- `500`: 服务器内部错误

## 8. 安全性考虑
1. 所有敏感接口都需要进行认证和授权
2. 密码必须进行加密存储
3. JWT令牌需要设置合理的过期时间
4. 防止SQL注入、XSS攻击等常见安全问题
5. 对API请求进行限流，防止恶意请求