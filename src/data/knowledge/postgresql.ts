import type { KnowledgeData } from "../../pages/KnowledgeDetail";

export const postgresqlData: KnowledgeData = {
  name: "PostgreSQL 数据库",
  description: "PostgreSQL 基础语法、高级特性、性能优化等知识",
  icon: "PG",
  items: [
    {
      id: "pg-01",
      title: "基础查询与过滤",
      tags: ["PostgreSQL", "SQL", "查询"],
      excerpt: "掌握 PostgreSQL 的基本查询语句和数据过滤方法",
      content: `## SELECT 基础查询

\`\`\`sql
-- 查询所有列
SELECT * FROM users;

-- 查询指定列
SELECT id, username, email FROM users;

-- 使用别名
SELECT
  id AS user_id,
  username AS name,
  email AS contact
FROM users;

-- 去重查询
SELECT DISTINCT city FROM users;
\`\`\`

## WHERE 条件过滤

\`\`\`sql
-- 等于条件
SELECT * FROM users WHERE age = 25;

-- 范围查询
SELECT * FROM products WHERE price BETWEEN 10 AND 100;

-- IN 查询
SELECT * FROM users WHERE city IN ('Beijing', 'Shanghai', 'Guangzhou');

-- LIKE 模糊查询
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- 多条件组合
SELECT * FROM users
WHERE age > 18 AND city = 'Beijing' AND status = 'active';
\`\`\`

## ORDER BY 排序

\`\`\`sql
-- 单字段排序
SELECT * FROM products ORDER BY price;

-- 降序排列
SELECT * FROM products ORDER BY created_at DESC;

-- 多字段排序
SELECT * FROM products
ORDER BY category ASC, price DESC;
\`\`\``,
    },
    {
      id: "pg-02",
      title: "聚合函数与分组",
      tags: ["PostgreSQL", "聚合", "GROUP BY"],
      excerpt: "学习使用聚合函数进行数据统计和分组分析",
      content: `## 常用聚合函数

\`\`\`sql
-- COUNT 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;

-- SUM 求和
SELECT SUM(amount) FROM orders;

-- AVG 平均值
SELECT AVG(price) FROM products;

-- MAX/MIN 最大最小值
SELECT MAX(salary), MIN(salary) FROM employees;
\`\`\`

## GROUP BY 分组

\`\`\`sql
-- 按城市统计用户数
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;

-- 多字段分组
SELECT category, brand, COUNT(*) as product_count
FROM products
GROUP BY category, brand;

-- HAVING 过滤分组
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 100;
\`\`\`

## 综合示例

\`\`\`sql
-- 统计每个分类的平均价格和商品数量
SELECT
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  MAX(price) as max_price,
  MIN(price) as min_price
FROM products
WHERE status = 'active'
GROUP BY category
HAVING COUNT(*) >= 5
ORDER BY avg_price DESC;
\`\`\``,
    },
    {
      id: "pg-03",
      title: "JOIN 连接查询",
      tags: ["PostgreSQL", "JOIN", "连接"],
      excerpt: "掌握各种表连接方式实现多表关联查询",
      content: `## INNER JOIN 内连接

\`\`\`sql
-- 查询用户及其订单
SELECT
  u.id,
  u.username,
  o.order_id,
  o.amount,
  o.created_at
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
\`\`\`

## LEFT JOIN 左连接

\`\`\`sql
-- 查询所有用户及其订单（包括无订单用户）
SELECT
  u.id,
  u.username,
  o.order_id,
  o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 找出没有订单的用户
SELECT u.id, u.username
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.order_id IS NULL;
\`\`\`

## 多表连接

\`\`\`sql
-- 三表连接查询
SELECT
  u.username,
  p.product_name,
  oi.quantity,
  oi.price
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.status = 'completed'
ORDER BY o.created_at DESC;
\`\`\``,
    },
    {
      id: "pg-04",
      title: "索引与性能优化",
      tags: ["PostgreSQL", "索引", "性能优化"],
      excerpt: "学习索引创建和 SQL 性能优化技巧",
      content: `## 创建索引

\`\`\`sql
-- 创建单列索引
CREATE INDEX idx_users_email ON users(email);

-- 创建复合索引
CREATE INDEX idx_orders_user_date
ON orders(user_id, created_at);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_username
ON users(username);

-- 部分索引（只索引满足条件的行）
CREATE INDEX idx_active_users
ON users(email)
WHERE status = 'active';
\`\`\`

## 查看执行计划

\`\`\`sql
-- EXPLAIN 查看执行计划
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- EXPLAIN ANALYZE 实际执行并分析
EXPLAIN ANALYZE
SELECT * FROM users
WHERE email = 'test@example.com';

-- 关注要点：
-- - Seq Scan vs Index Scan
-- - cost 成本估算
-- - actual time 实际耗时
-- - rows 行数估计
\`\`\`

## 优化技巧

\`\`\`sql
-- 1. 避免 SELECT *
SELECT id, username, email FROM users;

-- 2. 使用 EXISTS 代替 IN (子查询场景)
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- 3. 避免在索引列上使用函数
-- 不推荐
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
-- 推荐
SELECT * FROM users WHERE email ILIKE 'test@example.com';

-- 4. 使用 LIMIT 限制结果集
SELECT * FROM products ORDER BY created_at DESC LIMIT 10;
\`\`\``,
    },
    {
      id: "pg-05",
      title: "事务与锁机制",
      tags: ["PostgreSQL", "事务", "锁"],
      excerpt: "理解 PostgreSQL 的事务控制和锁机制",
      content: `## 事务控制

\`\`\`sql
-- 开始事务
BEGIN;

-- 执行多条语句
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 设置保存点
SAVEPOINT my_savepoint;
-- ... 执行一些操作
ROLLBACK TO my_savepoint;
\`\`\`

## 事务隔离级别

\`\`\`sql
-- 设置事务隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- PostgreSQL 默认隔离级别：READ COMMITTED
\`\`\`

## 锁类型

\`\`\`sql
-- 行级锁 (FOR UPDATE)
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- 其他事务无法修改此行直到当前事务结束
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- 表级锁
LOCK TABLE users IN ACCESS EXCLUSIVE MODE;

-- 查看当前锁
SELECT * FROM pg_locks;
\`\`\``,
    },
  ],
};
