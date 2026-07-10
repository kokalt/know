# 个人知识库 - 系统设计文档 (SDD)

---

## 一、系统概述

### 1.1 系统基本信息
- **系统名称**：个人知识库
- **系统类型**：技术知识展示与学习平台
- **核心定位**：面向开发者群体的技术知识沉淀与持续学习平台
- **目标用户**：前端开发者、全栈工程师、技术爱好者

### 1.2 技术栈配置
- **前端框架**：React 18.3.1 + TypeScript
- **构建工具**：Vite 5.4.21
- **样式方案**：TailwindCSS
- **路由管理**：React Router DOM (History API 模式)
- **图标库**：React Icons (Font Awesome 5.15.x)
- **UI 组件库**：Shadcn UI
- **部署方式**：静态资源部署

### 1.3 设计原则
- **纯静态架构**：无需数据库，所有内容通过静态文件管理
- **响应式设计**：适配移动端/平板/桌面三端
- **性能优先**：代码分割、懒加载、优化首屏加载
- **可维护性**：模块化设计、清晰的目录结构、类型安全

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                  CDN / Web Server                    │
│              (静态资源托管服务)                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                   React 应用                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Layout    │  │   Routes    │  │   Pages     │ │
│  │  (全局布局)  │  │  (路由配置)  │  │  (页面组件)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Components  │  │    Data     │  │   Utils     │ │
│  │  (业务组件)  │  │  (知识库数据)│  │  (工具函数)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
/home/wuying/workspace/
├── src/
│   ├── components/
│   │   ├── common/          # 公共组件
│   │   │   └── PageMeta.tsx # TDK 信息注册组件
│   │   ├── generated/       # 业务组件
│   │   │   ├── CategoryGrid.tsx        # 分类卡片网格
│   │   │   ├── CategorySidebar.tsx     # 侧边栏导航
│   │   │   ├── MobileCategoryDrawer.tsx # 移动端导航抽屉
│   │   │   └── SubTopicCard.tsx        # 知识点卡片
│   │   └── ui/              # Shadcn UI 基础组件
│   ├── data/
│   │   └── knowledge/       # 知识库数据文件
│   │       ├── design-patterns.ts
│   │       ├── python.ts
│   │       ├── js-reverse.ts
│   │       ├── postgresql.ts
│   │       ├── k8s-commands.ts
│   │       └── linux-commands.ts
│   ├── pages/
│   │   ├── Home.tsx         # 首页
│   │   └── KnowledgeDetail.tsx  # 知识点详情页
│   ├── layout.tsx           # 全局布局组件
│   ├── routes.tsx           # 路由配置
│   ├── App.tsx              # 应用入口
│   └── main.tsx             # 程序入口
├── public/                  # 静态资源
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── tailwind.config.js       # TailwindCSS 配置
```

---

## 三、核心功能模块

### 3.1 首页模块 (Home.tsx)

**功能描述**：
- Hero 区域展示站点定位和核心价值
- 23 个知识分类的卡片网格展示
- 响应式布局适配多端
- 引导用户开始浏览

**核心组件**：
- `Hero Section`：渐变背景 + 标题 + 行动按钮
- `CategoryGrid`：分类卡片网格（5-6 列响应式）
- `底部提示`：鼓励性标语

**交互设计**：
- 卡片 hover 效果：上浮、阴影加深、图标旋转
- 按钮 hover：缩放 + 阴影变化
- 平滑滚动到分类区域

### 3.2 知识点详情模块 (KnowledgeDetail.tsx)

**功能描述**：
- 根据 URL 参数 (`:category`) 动态加载对应分类的知识数据
- 展示知识点列表（标题、摘要、日期、标签）
- 支持 Markdown 渲染和代码高亮
- 二级主题拆分展示

**数据结构**：
```typescript
interface KnowledgeItem {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;  // Markdown 格式
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  title: string;
  excerpt: string;
  codeExample: string;
  fullContent: string;
}
```

**核心算法**：
- `parseSubTopics()`：将 Markdown 内容按二级标题拆分为子主题
- 代码块提取：正则匹配 ``` 包裹的代码
- 摘要生成：去除代码和加粗标记，截取前 120 字符

### 3.3 导航系统

#### 3.3.1 侧边栏导航 (CategorySidebar.tsx)
- 桌面端固定侧边栏
- 23 个分类的完整列表
- 激活状态高亮显示
- 渐变背景 + 图标指示

#### 3.3.2 移动端导航 (MobileCategoryDrawer.tsx)
- 汉堡按钮（右下角悬浮）
- 抽屉式展开/收起
- 渐变 Header + 毛玻璃效果
- 激活状态脉动指示器

#### 3.3.3 分类卡片网格 (CategoryGrid.tsx)
- 响应式网格布局（2-6 列）
- 每个分类独立图标和配色
- Hover 动画效果
- 箭头指示图标

---

## 四、数据管理

### 4.1 知识库数据组织

**数据分类**（23 个）：
1. JavaScript
2. React
3. Vue
4. TypeScript
5. CSS
6. HTML
7. ES6
8. JS 手写
9. NodeJS
10. 浏览器原理
11. 网络/OS/数据结构
12. 事件循环
13. 前端安全
14. 前端工程化
15. 性能优化
16. 设计模式
17. 小程序
18. Git
19. Python
20. JS 逆向
21. PostgreSQL
22. K8s
23. Linux

**数据文件格式**（以 `python.ts` 为例）：
```typescript
export const pythonData = {
  name: "Python 核心知识点",
  description: "Python 基础语法、面向对象、标准库等核心知识",
  icon: "Py",
  items: [
    {
      id: "py-01",
      title: "Python 基础语法与数据类型",
      date: "2025/06/01",
      tags: ["Python", "基础", "数据类型"],
      excerpt: "深入理解 Python 的基础语法、变量、数据类型及操作",
      content: `## 变量与数据类型\n\nPython 是动态类型语言...\n\n\`\`\`python\n# 示例代码\nname = "Alice"\nage = 25\n\`\`\``
    },
    // ...更多知识点
  ]
};
```

### 4.2 数据注册机制

**KnowledgeDetail.tsx 中的注册**：
```typescript
const rawKnowledgeData: Record<string, {...}> = {
  javascript: { ... },
  react: { ... },
  vue: { ... },
  python: pythonData,
  "js-reverse": jsReverseData,
  postgresql: postgresqlData,
  "k8s-commands": k8sCommandsData,
  "linux-commands": linuxCommandsData,
  // ...共 23 个分类
};
```

---

## 五、路由系统

### 5.1 路由配置 (routes.tsx)

```typescript
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/knowledge/:category", element: <KnowledgeDetail /> },
      { path: "/knowledge/:category/:articleId/:subTopicId", element: <SubTopicDetail /> },
      // ...其他路由
    ],
  },
];
```

### 5.2 路由参数

| 路由路径 | 参数 | 用途 |
|---------|------|------|
| `/knowledge/:category` | category: 分类标识（如 javascript、python） | 展示指定分类的知识点列表 |
| `/knowledge/:category/:articleId/:subTopicId` | articleId: 文章 ID<br>subTopicId: 子主题 ID | 展示具体知识点的详细内容 |

---

## 六、视觉设计规范

### 6.1 色彩系统

**主色调**：
- 深蓝渐变：`from-purple-600 via-blue-600 to-indigo-700`
- 强调蓝：`#3B82F6` (blue-500)
- 辅助紫：`#A855F7` (purple-500)

**中性色**：
- 背景白：`#FFFFFF`
- 浅灰背景：`#F9FAFB` (gray-50)
- 文字深灰：`#1F2937` (gray-800)
- 次要文字：`#6B7280` (gray-500)

**分类配色**（示例）：
- JavaScript：`bg-yellow-400`
- React：`bg-cyan-400`
- Vue：`bg-green-500`
- TypeScript：`bg-blue-600`
- Python：`bg-blue-500`

### 6.2 字体规范

**标题字体**：
- H1：`text-2xl sm:text-3xl md:text-4xl lg:text-5xl` (24px-48px)
- H2：`text-xl sm:text-2xl md:text-3xl` (20px-30px)
- H3：`text-lg sm:text-xl` (18px-20px)

**正文字体**：
- 默认：`text-sm sm:text-base` (14px-16px)
- 代码块：`font-mono` (等宽字体)

### 6.3 间距规范

**页面边距**：
- 移动端：`px-4` (16px)
- 桌面端：`lg:px-8` (32px)

**垂直间距**：
- Hero 区域：`py-6 lg:py-10` (24px-40px)
- 区块间距：`mb-8 sm:mb-12` (32px-48px)

### 6.4 圆角规范

- 卡片：`rounded-xl` (12px)
- 按钮：`rounded-full` (全圆角)
- 图标容器：`rounded-xl` (12px)

### 6.5 阴影规范

- 普通卡片：`shadow-md`
- Hover 状态：`shadow-xl`
- Hero 区域：`shadow-xl`

---

## 七、响应式设计

### 7.1 断点定义

```typescript
// TailwindCSS 默认断点
sm: 640px   // 小屏手机
md: 768px   // 平板
lg: 1024px  // 桌面
xl: 1280px  // 大桌面
```

### 7.2 布局适配策略

**移动端 (< 640px)**：
- 单列布局
- 导航折叠为汉堡菜单
- 卡片网格：2 列
- 字体缩小一号

**平板 (640px - 1023px)**：
- 2-3 列卡片网格
- 侧边栏隐藏
- 中等字体大小

**桌面端 (≥ 1024px)**：
- 5-6 列卡片网格
- 固定侧边栏显示
- 完整字体大小
- 丰富 hover 效果

### 7.3 组件响应式示例

**Hero 标题**：
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  个人知识库
</h1>
```

**分类网格**：
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
  {/* 卡片 */}
</div>
```

---

## 八、性能优化

### 8.1 代码分割

**路由懒加载**：
```typescript
const Home = lazy(() => import('./pages/Home'));
const KnowledgeDetail = lazy(() => import('./pages/KnowledgeDetail'));
```

### 8.2 动画优化

**CSS 动画**：
- 使用 `transform` 和 `opacity` 避免重排
- 添加 `will-change` 提示浏览器优化
- 限制动画时长在 200-300ms

**动画示例**：
```tsx
className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
```

### 8.3 图片优化

**语义化图片服务**：
- 使用免费图库匹配图片
- URL 格式：`https://baas-api.wanwang.xin/toc/image/preview/{description}.jpg?w={width}&h={height}`
- 按需加载合适尺寸

---

## 九、开发规范

### 9.1 TypeScript 类型定义

**强制类型检查**：
```bash
pnpm run type-check
```

**核心接口**：
```typescript
interface KnowledgeItem {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  title: string;
  excerpt: string;
  codeExample: string;
  fullContent: string;
}
```

### 9.2 代码风格

**缩进**：2 个空格
**引号**：双引号
**分号**：使用
**最大行数**：260 行/文件（超出需拆分）

### 9.3 Lint 检查

```bash
pnpm run lint
```

---

## 十、部署与发布

### 10.1 构建流程

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm run type-check

# Lint 检查
pnpm run lint

# 生产构建
pnpm run build
```

### 10.2 构建产物

输出目录：`dist/`
- `index.html`
- `assets/` (JS、CSS 文件)
- 静态资源

### 10.3 部署要求

- 支持静态资源托管的平台
- 启用 Gzip 压缩
- 配置 HTTPS
- CDN 加速（可选）

---

## 十一、扩展性设计

### 11.1 新增知识分类

**步骤**：
1. 在 `/src/data/knowledge/` 创建新数据文件（如 `new-category.ts`）
2. 导出符合 `KnowledgeData` 接口的对象
3. 在 `KnowledgeDetail.tsx` 中导入并注册到 `rawKnowledgeData`
4. 在 `CategoryGrid.tsx`、`CategorySidebar.tsx`、`MobileCategoryDrawer.tsx` 中添加导航入口

### 11.2 新增页面

**步骤**：
1. 在 `/src/pages/` 创建页面组件
2. 在 `routes.tsx` 中添加路由配置
3. 在导航组件中添加入口链接

### 11.3 主题定制

修改 `tailwind.config.js` 中的色彩配置即可调整全站主题色。

---

## 十二、技术限制与注意事项

### 12.1 当前版本限制

- **轻量版**：不支持数据库、视频插件、高德地图
- **纯静态**：所有内容为硬编码，无法动态更新
- **无用户系统**：不支持登录、收藏、评论等交互功能

### 12.2 内容更新方式

如需更新知识点内容，需：
1. 修改对应的数据文件（如 `python.ts`）
2. 重新构建并部署

### 12.3 未来升级方向

如需支持动态内容管理，可升级至标准版并：
1. 开启 Supabase 数据库
2. 创建知识点数据表
3. 将静态数据迁移至数据库
4. 前端改为调用 Supabase Client 获取数据
5. 开发管理后台（或使用平台内置 CMS）

---

## 十三、附录

### 13.1 关键文件清单

| 文件路径 | 用途 | 行数 |
|---------|------|------|
| `src/pages/Home.tsx` | 首页组件 | ~80 |
| `src/pages/KnowledgeDetail.tsx` | 知识点详情页 | ~200+ |
| `src/components/generated/CategoryGrid.tsx` | 分类卡片网格 | ~60 |
| `src/components/generated/CategorySidebar.tsx` | 侧边栏导航 | ~80 |
| `src/components/generated/MobileCategoryDrawer.tsx` | 移动端导航 | ~100 |
| `src/routes.tsx` | 路由配置 | ~40 |
| `src/data/knowledge/*.ts` | 知识库数据文件 | 各~200-500 |

### 13.2 依赖包清单

**核心依赖**：
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^6.x
- `typescript`: ^5.x
- `vite`: ^5.4.21
- `tailwindcss`: ^3.x
- `react-icons`: ^5.5.0

**UI 组件**：
- Shadcn UI (通过 `pnpm dlx shadcn@late add` 添加)

---

**文档版本**：v1.0
**最后更新**：2026-06-29
**维护团队**：万小智 Agent
