
## API接口说明

## 地址 
- `http://localhost:8081/`

eg：http://localhost:8081/api/users/register

### 访问接口文档
项目启动后，可以通过以下地址访问Swagger接口文档：
- Swagger UI: http://localhost:8081/api/swagger-ui.html
- API文档: http://localhost:8081/api/v3/api-docs

### 认证相关
1. 所有需要认证的接口必须在请求头中包含 `Authorization: Bearer {token}`
2. 时间格式统一为 `yyyy-MM-dd HH:mm:ss`
3. 金额使用BigDecimal类型，保留2位小数
4. 分页参数从1开始计数
5. 管理员接口需要用户具有管理员权限，普通用户接口则不需要。


- `POST /api/users/register` - 用户注册 
```json
请求示例
{
  "username": "string", 
  "password": "string", 
  "name": "string",   
  "email": "string" 
}
响应示例
{
    "success": true,
    "data": {
        "id": "5830214e-24cc-410b-aa37-927366bc8ede",
        "username": "admin123",
        "name": "admin",
        "email": "liuhsin@qq.com",
        "phone": null,
        "isAdmin": false,
        "status": "active",
        "createdAt": null,
        "lastLogin": null
    },
    "message": "注册成功"
}
```

- `POST /api/users/login` - 用户登录
```json
请求示例
{
  "username": "string", 
  "password": "string"  
}
响应示例
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbjEyMyIsImlhdCI6MTc2MzQ0NTA5MiwiZXhwIjoxNzYzNTMxNDkyfQ.2p9Eya-CPMy5e0u-OUmevJKuAbVw-9u1J9V1EeWoyPfyW1DuKv7QGdZZHADMObqj-0_U5i-gvgegVuIjw6zVEA",
        "user": {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": "admin",
            "email": "liuhsin@qq.com",
            "phone": null,
            "isAdmin": false,
            "status": "active",
            "createdAt": "2025-11-18 13:46:42",
            "lastLogin": "2025-11-18 13:51:32"
        }
    },
    "message": "登录成功"
}
```

- `GET /api/users/profile` - 获取当前用户信息
```json
响应示例
{
    "success": true,
    "data": {
        "id": "5830214e-24cc-410b-aa37-927366bc8ede",
        "username": "admin123",
        "name": "admin",
        "email": "liuhsin@qq.com",
        "phone": null,
        "isAdmin": false,
        "status": "active",
        "createdAt": "2025-11-18 13:46:42",
        "lastLogin": "2025-11-18 13:51:33"
    },
    "message": "操作成功"
}
```
- `PUT /api/users/profile` - 更新用户信息
```json
请求示例
{
  "name": "admin1234",     
  "email": "liuhsin@vip.qq.com",  
  "phone":"12345678901"
}
响应示例
{
    "success": true,
    "data": {
        "id": "5830214e-24cc-410b-aa37-927366bc8ede",
        "username": "admin123",
        "name": "admin1234",
        "email": "liuhsin@vip.qq.com",
        "phone": "12345678901",
        "isAdmin": false,
        "status": "active",
        "createdAt": "2025-11-18 13:46:42",
        "lastLogin": "2025-11-18 13:51:33"
    },
    "message": "更新成功"
}
```

### 食品相关
- `GET /api/foods` - 获取食品列表（支持分页、搜索、筛选）
```json 
响应示例
{
    "items": [
        {
            "id": "1",
            "name": "宫保鸡丁",
            "description": "经典川菜，麻辣鲜香",
            "price": 28.00,
            "originalPrice": 28.00,
            "image": "https://picsum.photos/id/1/300/200",
            "category": "川菜",
            "status": "available",
            "sales": 1200,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        },
        {
            "id": "10",
            "name": "黑椒牛排意面",
            "description": "口感丰富的意大利经典",
            "price": 28.00,
            "originalPrice": 28.00,
            "image": "https://picsum.photos/id/10/300/200",
            "category": "西餐",
            "status": "available",
            "sales": 680,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        },
        {
            "id": "2",
            "name": "麻婆豆腐",
            "description": "麻辣嫩滑，下饭神器",
            "price": 18.00,
            "originalPrice": 18.00,
            "image": "https://picsum.photos/id/2/300/200",
            "category": "川菜",
            "status": "available",
            "sales": 1500,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
}
```

- `GET /api/foods/available` - 获取可用食品列表
```json
响应示例
{
    "items": [
        {
            "id": "1",
            "name": "宫保鸡丁",
            "description": "经典川菜，麻辣鲜香",
            "price": 28.00,
            "originalPrice": 28.00,
            "image": "https://picsum.photos/id/1/300/200",
            "category": "川菜",
            "status": "available",
            "sales": 1200,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        },
        {
            "id": "10",
            "name": "黑椒牛排意面",
            "description": "口感丰富的意大利经典",
            "price": 28.00,
            "originalPrice": 28.00,
            "image": "https://picsum.photos/id/10/300/200",
            "category": "西餐",
            "status": "available",
            "sales": 680,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        },
        {
            "id": "2",
            "name": "麻婆豆腐",
            "description": "麻辣嫩滑，下饭神器",
            "price": 18.00,
            "originalPrice": 18.00,
            "image": "https://picsum.photos/id/2/300/200",
            "category": "川菜",
            "status": "available",
            "sales": 1500,
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
}
```

- `GET /api/foods/{foodId}` - 获取食品详情
```json
请求示例
GET /api/foods/1
响应示例
{
    "success": true,
    "data": {
        "id": "1",
        "name": "宫保鸡丁",
        "description": "经典川菜，麻辣鲜香",
        "price": 28.00,
        "originalPrice": 28.00,
        "image": "https://picsum.photos/id/1/300/200",
        "category": "川菜",
        "status": "available",
        "sales": 1200,
        "createdAt": "2025-11-18 02:21:15",
        "updatedAt": "2025-11-18 02:21:15"
    },
    "message": "操作成功"
}
```

- `POST /api/foods` - 创建食品（管理员）
请求示例
```json
{
  "name": "宫保鸡丁更新",        
  "description": "经典川菜，麻辣鲜香更新", 
  "price": 35,          
  "originalPrice": 39,  
  "image": "https://picsum.photos/id/1/300/200",       
  "category": "川菜",    
  "status": "available"       
}
```
响应示例
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "宫保鸡丁更新",
    "description": "经典川菜，麻辣鲜香更新",
    "price": 35,
    "originalPrice": 35,
    "image": "https://picsum.photos/id/1/300/200",
    "category": "川菜",
    "status": "available",
    "sales": 1200,
    "createdAt": "2025-11-18 02:21:15",
    "updatedAt": "2025-11-18 14:25:14"
  },
  "message": "食品创建成功"
}
```
- `PUT /api/foods/{foodId}` - 更新食品信息（管理员）
```json
请求示例
PUT /api/foods/1
{
  "name": "宫保鸡丁更新",        // 可选
  "description": "经典川菜，麻辣鲜香更新", // 可选
  "price": 35,          // 可选
  "originalPrice": 39,  // 可选
  "image": "https://picsum.photos/id/1/300/200",       // 可选
  "category": "川菜",    // 可选
  "status": "available"       // 可选
}
响应示例
{
    "success": true,
    "data": {
        "id": "1",
        "name": "宫保鸡丁更新",
        "description": "经典川菜，麻辣鲜香更新",
        "price": 35,
        "originalPrice": 35,
        "image": "https://picsum.photos/id/1/300/200",
        "category": "川菜",
        "status": "available",
        "sales": 1200,
        "createdAt": "2025-11-18 02:21:15",
        "updatedAt": "2025-11-18 14:25:14"
    },
    "message": "食品更新成功"
}
```

- `DELETE /api/foods/{foodId}` - 删除食品（管理员）
```json
请求示例
DELETE /api/foods/1
响应示例
{
    "success": true,
    "data": null,
    "message": "食品删除成功"
}
```

- `PUT /api/foods/{foodId}/stock` - 更新食品库存（管理员）
```json
请求示例
PUT /api/foods/1/stock?quantity=100
响应示例  
{
    "success": true,
    "data": null,
    "message": "库存更新成功"
}
```


### 订单相关
- `POST /api/orders` - 创建订单
```json 
请求示例
{
    "user": "admin123",
    "items": [
        {
            "foodId": "1", // 食品ID，必填
            "name": "宫保鸡丁更新", // 食品名称
            "price": 35.00, // 单价
            "quantity": 2 // 数量
        }
    ],
    "totalAmount": 70.00, // 总金额，必填，必须大于0
    "address": "学生宿舍A栋101室" // 配送地址，必填
}
响应示例
{
    "success": true,
    "data": {
        "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
        "user": {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": null,
            "email": null,
            "phone": null,
            "isAdmin": null,
            "status": null,
            "createdAt": null,
            "lastLogin": null
        },
        "items": [
            {
                "foodId": "1",
                "name": "宫保鸡丁更新",
                "price": 35.00,
                "quantity": 2
            }
        ],
        "totalAmount": 70.00,
        "status": "pending",
        "address": "学生宿舍A栋101室",
        "createdAt": "2025-11-18 15:26:17",
        "updatedAt": null
    },
    "message": "订单创建成功"
}

```

- `GET /api/orders` - 获取登录用户订单列表
```json
响应示例
{
    "items": [
        {
            "id": "441fd998-e92c-4d7d-a2d0-8ff74610a385",
            "user": {
                "id": "5830214e-24cc-410b-aa37-927366bc8ede",
                "username": "admin123",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [
                {
                    "foodId": "1",
                    "name": "宫保鸡丁更新",
                    "price": 35.00,
                    "quantity": 2
                }
            ],
            "totalAmount": 70.00,
            "status": "pending",
            "address": "学生宿舍A栋101室",
            "createdAt": "2025-11-19 11:02:37",
            "updatedAt": "2025-11-19 11:02:37"
        },
        {
            "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
            "user": {
                "id": "5830214e-24cc-410b-aa37-927366bc8ede",
                "username": "admin123",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [
                {
                    "foodId": "1",
                    "name": "宫保鸡丁更新",
                    "price": 35.00,
                    "quantity": 2
                }
            ],
            "totalAmount": 70.00,
            "status": "preparing",
            "address": "学生宿舍A栋101室",
            "createdAt": "2025-11-18 15:26:18",
            "updatedAt": "2025-11-19 11:21:57"
        }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 10
}
```

- `GET /api/orders/{orderId}` - 获取订单详情
```json
请求示例
GET /api/orders/682ff962-ca64-4878-b118-62dbdba2cc85
响应示例
{
    "success": true,
    "data": {
        "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
        "user": {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": null,
            "email": null,
            "phone": null,
            "isAdmin": null,
            "status": null,
            "createdAt": null,
            "lastLogin": null
        },
        "items": [
            {
                "foodId": "1",
                "name": "宫保鸡丁更新",
                "price": 35.00,
                "quantity": 2
            }
        ],
        "totalAmount": 70.00,
        "status": "preparing",
        "address": "学生宿舍A栋101室",
        "createdAt": "2025-11-18 15:26:18",
        "updatedAt": "2025-11-19 11:21:57"
    },
    "message": "操作成功"
}
```

- `PUT /api/orders/{orderId}/status` - 更新订单状态
- 订单状态，必填，如：pending, confirmed, preparing, delivering, completed, cancelled
```json
请求示例
PUT /api/orders/682ff962-ca64-4878-b118-62dbdba2cc85/status
{
    "status": "cancelled"
}
响应示例
{
    "success": true,
    "data": {
        "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
        "user": {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": null,
            "email": null,
            "phone": null,
            "isAdmin": null,
            "status": null,
            "createdAt": null,
            "lastLogin": null
        },
        "items": [
            {
                "foodId": "1",
                "name": "宫保鸡丁更新",
                "price": 35.00,
                "quantity": 2
            }
        ],
        "totalAmount": 70.00,
        "status": "cancelled",
        "address": "学生宿舍A栋101室",
        "createdAt": "2025-11-18 15:26:18",
        "updatedAt": "2025-11-20 09:52:48"
    },
    "message": "订单状态更新成功"
}
```

- `GET /api/orders/admin` - 获取所有订单（管理员）
```json
请求示例
GET /api/orders/admin
响应示例
{
    "items": [
        {
            "id": "441fd998-e92c-4d7d-a2d0-8ff74610a385",
            "user": {
                "id": "5830214e-24cc-410b-aa37-927366bc8ede",
                "username": "admin123",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [
                {
                    "foodId": "1",
                    "name": "宫保鸡丁更新",
                    "price": 35.00,
                    "quantity": 2
                }
            ],
            "totalAmount": 70.00,
            "status": "pending",
            "address": "学生宿舍A栋101室",
            "createdAt": "2025-11-19 11:02:37",
            "updatedAt": "2025-11-19 11:02:37"
        },
        {
            "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
            "user": {
                "id": "5830214e-24cc-410b-aa37-927366bc8ede",
                "username": "admin123",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [
                {
                    "foodId": "1",
                    "name": "宫保鸡丁更新",
                    "price": 35.00,
                    "quantity": 2
                }
            ],
            "totalAmount": 70.00,
            "status": "cancelled",
            "address": "学生宿舍A栋101室",
            "createdAt": "2025-11-18 15:26:18",
            "updatedAt": "2025-11-20 09:52:49"
        },
        {
            "id": "1",
            "user": {
                "id": "3",
                "username": "zhangsan",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [],
            "totalAmount": 78.00,
            "status": "pending",
            "address": "学生公寓A栋101室",
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        },
        {
            "id": "2",
            "user": {
                "id": "4",
                "username": "lisi",
                "name": null,
                "email": null,
                "phone": null,
                "isAdmin": null,
                "status": null,
                "createdAt": null,
                "lastLogin": null
            },
            "items": [],
            "totalAmount": 56.00,
            "status": "confirmed",
            "address": "学生公寓B栋203室",
            "createdAt": "2025-11-18 02:21:15",
            "updatedAt": "2025-11-18 02:21:15"
        }
    ],
    "total": 4,
    "page": 1,
    "pageSize": 10
}
```
- `PUT /api/orders/admin/{orderId}/status` - 管理员更新订单状态
```json
请求示例
PUT /api/orders/admin/682ff962-ca64-4878-b118-62dbdba2cc85/status
{
    "status": "completed"
}
响应示例
{
    "success": true,
    "data": {
        "id": "682ff962-ca64-4878-b118-62dbdba2cc85",
        "user": {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": null,
            "email": null,
            "phone": null,
            "isAdmin": null,
            "status": null,
            "createdAt": null,
            "lastLogin": null
        },
        "items": [
            {
                "foodId": "1",
                "name": "宫保鸡丁更新", 
                "price": 35.00,
                "quantity": 2
            }
        ],
        "totalAmount": 70.00,
        "status": "completed",
        "address": "学生宿舍A栋101室",
        "createdAt": "2025-11-18 15:26:18",
        "updatedAt": "2025-11-20 09:52:49"
    },
    "message": "订单状态更新成功"
}
```

### 用户管理（管理员）
- `GET /api/users` - 获取所有用户
```json
响应示例
{
    "items": [
        {
            "id": "5830214e-24cc-410b-aa37-927366bc8ede",
            "username": "admin123",
            "name": "admin1234",
            "email": "liuhsin@vip.qq.com",
            "phone": "12345678901",
            "isAdmin": true,
            "status": "active",
            "createdAt": "2025-11-18 13:46:42",
            "lastLogin": "2025-11-20 09:47:14"
        },
        {
            "id": "2",
            "username": "user",
            "name": "普通用户",
            "email": "user@campusfood.com",
            "phone": "13800138001",
            "isAdmin": false,
            "status": "active",
            "createdAt": "2025-11-18 02:21:15",
            "lastLogin": "2023-12-01 00:00:00"
        },
        {
            "id": "3",
            "username": "zhangsan",
            "name": "张三",
            "email": "zhangsan@campusfood.com",
            "phone": "13800138002",
            "isAdmin": false,
            "status": "active",
            "createdAt": "2025-11-18 02:21:15",
            "lastLogin": "2023-12-01 00:00:00"
        },
        {
            "id": "4",
            "username": "lisi",
            "name": "李四",
            "email": "lisi@campusfood.com",
            "phone": "13800138003",
            "isAdmin": false,
            "status": "active",
            "createdAt": "2025-11-18 02:21:15",
            "lastLogin": "2023-12-01 00:00:00"
        },
        {
            "id": "5",
            "username": "wangwu",
            "name": "王五",
            "email": "wangwu@campusfood.com",
            "phone": "13800138004",
            "isAdmin": false,
            "status": "active",
            "createdAt": "2025-11-18 02:21:15",
            "lastLogin": "2023-12-01 00:00:00"
        }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
}
``` 
- `PUT /api/users/{userId}/role` - 更新用户角色
```json
请求示例
PUT /api/users/5830214e-24cc-410b-aa37-927366bc8ede/role?role=admin
响应示例
{
    "success": true,
    "data": null,
    "message": "角色更新成功"
}
```

- `DELETE /api/users/{userId}` - 删除用户
```json
请求示例
DELETE /api/users/5830214e-24cc-410b-aa37-927366bc8ede
响应示例
{
    "success": true,
    "data": null,
    "message": "用户删除成功"
}
```