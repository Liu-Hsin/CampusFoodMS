-- 校园美食管理系统数据库脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS CampusFoodMS DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE CampusFoodMS;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号码',
    is_admin BOOLEAN DEFAULT FALSE COMMENT '是否为管理员',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    status VARCHAR(20) DEFAULT 'active' COMMENT '用户状态: active, inactive, locked'
);

-- 创建食品分类表
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY COMMENT '分类ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 创建食品表
CREATE TABLE IF NOT EXISTS foods (
    id VARCHAR(36) PRIMARY KEY COMMENT '食品ID',
    name VARCHAR(100) NOT NULL COMMENT '食品名称',
    description TEXT COMMENT '食品描述',
    price DECIMAL(10, 2) NOT NULL COMMENT '价格',
    original_price DECIMAL(10, 2) COMMENT '原价',
    image VARCHAR(255) COMMENT '图片URL',
    category_id VARCHAR(36) NOT NULL COMMENT '分类ID',
    status VARCHAR(20) DEFAULT 'available' COMMENT '状态: available, unavailable',
    sales INT DEFAULT 0 COMMENT '销量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '总金额',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '订单状态: pending, confirmed, preparing, delivered, completed, cancelled',
    address VARCHAR(255) NOT NULL COMMENT '配送地址',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY COMMENT '订单项ID',
    order_id VARCHAR(36) NOT NULL COMMENT '订单ID',
    food_id VARCHAR(36) NOT NULL COMMENT '食品ID',
    food_name VARCHAR(100) NOT NULL COMMENT '食品名称（快照）',
    unit_price DECIMAL(10, 2) NOT NULL COMMENT '单价（快照）',
    quantity INT NOT NULL COMMENT '数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- 创建管理员权限表
CREATE TABLE IF NOT EXISTS admin_permissions (
    id VARCHAR(36) PRIMARY KEY COMMENT '权限ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '权限名称',
    description TEXT COMMENT '权限描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

-- 创建管理员-权限关联表
CREATE TABLE IF NOT EXISTS admin_permission_mapping (
    admin_id VARCHAR(36) NOT NULL COMMENT '管理员ID',
    permission_id VARCHAR(36) NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (admin_id, permission_id),
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES admin_permissions(id) ON DELETE CASCADE
);

-- 插入模拟数据

-- 插入默认管理员权限
INSERT INTO admin_permissions (id, name, description)
VALUES 
('1', 'food:manage', '管理食品'),
('2', 'order:manage', '管理订单'),
('3', 'user:manage', '管理用户'),
('4', 'statistics:view', '查看统计');

-- 插入食品分类
INSERT INTO categories (id, name, description)
VALUES 
('1', '川菜', '以麻辣鲜香著称的四川菜系'),
('2', '粤菜', '注重食材原味的广东菜系'),
('3', '北京菜', '以宫廷菜为特色的菜系'),
('4', '江苏菜', '清淡精致的江苏菜系'),
('5', '浙江菜', '注重刀工的浙江菜系'),
('6', '湘菜', '以辣著称的湖南菜系'),
('7', '福建菜', '以海鲜为特色的福建菜系'),
('8', '徽菜', '重油重色的安徽菜系'),
('9', '快餐', '快捷方便的食品'),
('10', '饮品', '各种饮料和饮品'),
('11', '西餐', '西方风格的餐饮');

-- 插入模拟用户
INSERT INTO users (id, username, password, name, email, phone, is_admin, last_login)
VALUES 
('1', 'admin', '$2a$10$e8WjP3JqN4V8tJZ5k6X7UuG6Y7H9I8O7P6N5M4L3K2J1H0G9F7E6D5C4B3A2Z1', '系统管理员', 'admin@campusfood.com', '13800138000', TRUE, '2023-12-01 00:00:00'),
('2', 'user', '$2a$10$e8WjP3JqN4V8tJZ5k6X7UuG6Y7H9I8O7P6N5M4L3K2J1H0G9F7E6D5C4B3A1', '普通用户', 'user@campusfood.com', '13800138001', FALSE, '2023-12-01 00:00:00'),
('3', 'zhangsan', '$2a$10$e8WjP3JqN4V8tJZ5k6X7UuG6Y7H9I8O7P6N5M4L3K2J1H0G9F7E6D5C4B3A1', '张三', 'zhangsan@campusfood.com', '13800138002', FALSE, '2023-12-01 00:00:00'),
('4', 'lisi', '$2a$10$e8WjP3JqN4V8tJZ5k6X7UuG6Y7H9I8O7P6N5M4L3K2J1H0G9F7E6D5C4B3A1', '李四', 'lisi@campusfood.com', '13800138003', FALSE, '2023-12-01 00:00:00'),
('5', 'wangwu', '$2a$10$e8WjP3JqN4V8tJZ5k6X7UuG6Y7H9I8O7P6N5M4L3K2J1H0G9F7E6D5C4B3A1', '王五', 'wangwu@campusfood.com', '13800138004', FALSE, '2023-12-01 00:00:00');

-- 为管理员分配权限
INSERT INTO admin_permission_mapping (admin_id, permission_id)
VALUES 
('1', '1'),
('1', '2'),
('1', '3'),
('1', '4');

-- 插入模拟食品数据
INSERT INTO foods (id, name, description, price, original_price, image, category_id, status, sales)
VALUES 
('1', '宫保鸡丁', '经典川菜，麻辣鲜香', 28.00, 32.00, 'https://picsum.photos/id/1/300/200', '1', 'available', 1200),
('2', '麻婆豆腐', '麻辣嫩滑，下饭神器', 18.00, 22.00, 'https://picsum.photos/id/2/300/200', '1', 'available', 1500),
('3', '糖醋排骨', '酸甜可口，色泽红亮', 38.00, 42.00, 'https://picsum.photos/id/3/300/200', '2', 'available', 980),
('4', '清蒸鱼', '鲜嫩多汁，原汁原味', 68.00, 78.00, 'https://picsum.photos/id/4/300/200', '2', 'available', 850),
('5', '北京烤鸭', '外酥里嫩，北京特产', 128.00, 158.00, 'https://picsum.photos/id/5/300/200', '3', 'available', 1800),
('6', '扬州炒饭', '配料丰富，香气四溢', 22.00, 26.00, 'https://picsum.photos/id/6/300/200', '4', 'available', 2100),
('7', '香辣牛肉汉堡', '香辣多汁的牛肉汉堡', 18.50, 22.00, 'https://picsum.photos/id/7/300/200', '9', 'available', 850),
('8', '台式卤肉饭', '经典台湾风味，肉质松软', 15.00, 18.00, 'https://picsum.photos/id/8/300/200', '9', 'available', 1300),
('9', '珍珠奶茶', 'Q弹珍珠搭配香浓奶茶', 12.00, 15.00, 'https://picsum.photos/id/9/300/200', '10', 'available', 3200),
('10', '黑椒牛排意面', '口感丰富的意大利经典', 28.00, 35.00, 'https://picsum.photos/id/10/300/200', '11', 'available', 680);

-- 插入模拟订单数据
INSERT INTO orders (id, user_id, total_amount, status, address, phone)
VALUES 
('1', '3', 78.00, 'pending', '学生公寓A栋101室', '13800138002'),
('2', '4', 56.00, 'confirmed', '学生公寓B栋203室', '13800138003'),
('3', '3', 196.00, 'completed', '学生公寓A栋101室', '13800138002'),
('4', '5', 90.00, 'preparing', '教师公寓C栋302室', '13800138004'),
('5', '2', 98.00, 'cancelled', '学生公寓D栋405室', '13800138001'),
('6', '2', 196.00, 'delivered', '学生公寓E栋502室', '13800138001');

-- 插入模拟订单项数据
INSERT INTO order_items (id, order_id, food_id, food_name, unit_price, quantity)
VALUES 
('1', '1', '1', '宫保鸡丁', 28.00, 2),
('2', '1', '6', '扬州炒饭', 22.00, 1),
('3', '2', '2', '麻婆豆腐', 18.00, 1),
('4', '2', '3', '糖醋排骨', 38.00, 1),
('5', '3', '4', '清蒸鱼', 68.00, 1),
('6', '3', '5', '北京烤鸭', 128.00, 1),
('7', '4', '1', '宫保鸡丁', 28.00, 1),
('8', '4', '2', '麻婆豆腐', 18.00, 1),
('9', '4', '6', '扬州炒饭', 22.00, 2),
('10', '5', '3', '糖醋排骨', 38.00, 2),
('11', '5', '6', '扬州炒饭', 22.00, 1),
('12', '6', '5', '北京烤鸭', 128.00, 1),
('13', '6', '4', '清蒸鱼', 68.00, 1);

-- 创建索引以提高查询性能
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_foods_category_id ON foods(category_id);
CREATE INDEX idx_foods_status ON foods(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_food_id ON order_items(food_id);

-- 添加一些视图，方便查询

-- 用户订单统计视图
CREATE VIEW user_order_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    u.name,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS total_spent,
    MAX(o.created_at) AS last_order_date
FROM 
    users u
LEFT JOIN 
    orders o ON u.id = o.user_id
GROUP BY 
    u.id, u.username, u.name;

-- 食品销售统计视图
CREATE VIEW food_sales_stats AS
SELECT 
    f.id AS food_id,
    f.name AS food_name,
    f.category_id,
    COUNT(oi.id) AS total_order_count,
    SUM(oi.quantity) AS total_sold,
    SUM(oi.unit_price * oi.quantity) AS total_revenue
FROM 
    foods f
LEFT JOIN 
    order_items oi ON f.id = oi.food_id
GROUP BY 
    f.id, f.name, f.category_id;

-- 订单状态分布视图
CREATE VIEW order_status_distribution AS
SELECT 
    status,
    COUNT(*) AS count,
    ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM orders), 2) AS percentage
FROM 
    orders
GROUP BY 
    status;

-- 数据库注释
COMMENT ON DATABASE CampusFoodMS IS '校园美食管理系统数据库';

-- 显示创建的表和视图
SHOW TABLES;

-- 显示数据库基本信息
SELECT '数据库初始化完成' AS message,
       (SELECT COUNT(*) FROM users) AS user_count,
       (SELECT COUNT(*) FROM foods) AS food_count,
       (SELECT COUNT(*) FROM orders) AS order_count,
       CURRENT_TIMESTAMP AS completion_time;