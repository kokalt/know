// Front-end interview knowledge base — 14 分类完整面试题
// ✅ 全中文，无 date 字段

export const reactData = {
  name: "React 核心知识",
  description: "React 基础、Hooks、状态管理、性能优化等核心知识",
  icon: "R",
  items: [
    {
      id: "react-01",
      title: "React Hooks 深入解析：useState / useEffect / useRef 原理与最佳实践",
      tags: ["React", "Hooks", "状态管理"],
      excerpt: "从原理到最佳实践，全面掌握 React 18 核心 Hooks 的使用场景与常见陷阱",
      content:
`## useState 函数式更新与批量处理

\`\`\`tsx
// ❌ 闭包陷阱：连续调用只 +1
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);   // 两次都基于旧值 0，最终 count = 1
  }
  return <button onClick={handleClick}>+</button>;
}

// ✅ 函数式更新：避免闭包陷阱
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // 第一次 prev=0→1，第二次 prev=1→2
  }
  return <button onClick={handleClick}>+</button>;
}
\`\`\`

**代码解释：** setState 异步批处理，React 18 对所有事件、Timeout 均自动批处理。函数式更新参数 prev 保证拿最新状态。useState 初始值函数仅在首次渲染执行。

## useEffect 四种依赖模式与清理

\`\`\`tsx
// ① 空依赖数组：仅挂载时执行一次
useEffect(() => { fetch("/api/user").then(r => r.json()).then(setUser); }, []);

// ② 有依赖项：依赖变化时重新执行
useEffect(() => { document.title = \`\${count} 条未读\`; }, [count]);

// ③ 清理函数：避免内存泄漏
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, []);
\`\`\`

## useRef 三种用法

\`\`\`tsx
// ① 访问 DOM 元素
const ref = useRef<HTMLInputElement>(null);
// ② 保存可变值（不触发重渲染）
const countRef = useRef(0); countRef.current++;
// ③ 保存上一次渲染的值
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
\`\`\`

## useMemo / useCallback 何时使用

useMemo 缓存计算结果，useCallback 缓存函数引用。配合 React.memo 才有意义。滥用反而增加内存消耗。useCallback(fn, deps) ≈ useMemo(() => fn, deps)。`,

    },
    {
      id: "react-02",
      title: "虚拟 DOM 与 Diff 算法：React 为什么快？",
      tags: ["React", "虚拟DOM", "Diff"],
      excerpt: "深入理解虚拟 DOM 的设计动机、三大 Diff 策略与 key 的核心作用",
      content:
`## 虚拟 DOM 本质

虚拟 DOM 是轻量 JS 对象模拟 DOM 树。直接操作真实 DOM 代价高——React 在 JS 层 Diff 计算最小变更集，一次性提交 DOM，实现批量更新。

## Diff 算法三大策略

\`\`\`jsx
// ① 同级比较：不跨层级 → O(n³) 降到 O(n)
// ② 类型不同 → 整棵子树替换（div→span 销毁重建）
// ③ key 标记节点身份 → 区分移动/新增/删除

// ❌ key 用 index 的问题
// 数组中间插入一项后，后续所有项的 index 变化 → React 对比错位 → 输入框状态错乱
// ✅ 用唯一稳定的 id
{items.map(item => <Item key={item.id} data={item} />)}
\`\`\`

## React Fiber 架构

React 15 Stack Reconciler 同步递归不可中断。React 16+ Fiber：工作单元 + 链表结构 + 可中断 + Lane 优先级。

\`\`\`
Render 阶段（可中断）→ 构建 Fiber 树、标记 flags
Commit 阶段（不可中断）→ DOM 更新、执行 useEffect
\`\`\`

高优先级更新（用户输入/动画）可打断低优先级更新（数据请求）。startTransition 标记低优先级。`,

    },
    {
      id: "react-03",
      title: "React 状态管理：Redux / Zustand / Context 对比与选型",
      tags: ["React", "Redux", "状态管理"],
      excerpt: "对比主流状态管理方案，理解各自适用场景和核心原理",
      content:
`## Redux Toolkit

\`\`\`typescript
const counterSlice = createSlice({
  name: 'counter', initialState: { value: 0 },
  reducers: { increment: state => { state.value += 1; } },
});
// 单向数据流：View → dispatch(action) → Reducer → Store → View 重渲染
\`\`\`

## Zustand 极简方案

\`\`\`typescript
const useStore = create(set => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }));
// 组件内：const count = useStore(s => s.count); — 选择性订阅，精确重渲染
\`\`\`

## 三方案对比

| | Context | Redux | Zustand |
|---|---|---|---|
| 适用 | 主题/语言等不频繁变化 | 大型应用复杂状态 | 中小型全局状态 |
| 优点 | 内置无依赖 | 中间件、DevTools | 极简 API、高性能 |
| 缺点 | Provider 嵌套性能差 | 模板代码较多 | 生态较小 |`,

    },
    {
      id: "react-04",
      title: "React 性能优化：memo / 懒加载 / 虚拟列表",
      tags: ["React", "性能", "优化"],
      excerpt: "掌握 React.memo、代码分割、虚拟滚动等核心优化手段",
      content:
`## React.memo 正确用法

\`\`\`tsx
const ExpensiveChild = React.memo(({ user }: { user: User }) => <div>{user.name}</div>);
// ❌ 每次渲染传新对象 → memo 失效：<Child user={{ name: "Alice" }} />
// ✅ useMemo 稳定引用：const user = useMemo(() => ({ name: "Alice" }), []);
// ❌ 每次渲染传新函数 → memo 失效：<Child onSave={() => api.save()} />
// ✅ useCallback 稳定引用：const onSave = useCallback(() => api.save(), []);
\`\`\`

## 代码分割与懒加载

\`\`\`tsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
<Suspense fallback={<Skeleton />}><Routes><Route path="/dash" element={<Dashboard />} /></Routes></Suspense>
\`\`\`

## 虚拟列表（长列表优化）

\`\`\`tsx
<FixedSizeList height={600} itemCount={100000} itemSize={50} width="100%">
  {({ index, style }) => <div style={style}>第 {index} 行</div>}
</FixedSizeList>
// 100000 条数据，DOM 节点仅 ~20 个
\`\`\`

## 优化清单

- 列表用稳定 key（不用 index）
- 事件处理函数 useCallback 稳定引用
- 昂贵计算 useMemo 缓存
- 大组件拆小，状态就近存放
- 路由懒加载 + Suspense
- 长列表用虚拟滚动`,

    },
  ],
};

export const browserData = {
  name: "浏览器原理核心知识点",
  description: "浏览器渲染原理、事件循环、安全策略等核心知识",
  icon: "Br",
  items: [
    {
      id: "browser-01",
      title: "从 URL 输入到页面渲染：浏览器全流程解析",
      tags: ["浏览器", "渲染", "网络"],
      excerpt: "经典面试题：完整分解浏览器导航与渲染的每一步",
      content:
`## 一、导航阶段

DNS 解析（浏览器缓存→hosts→路由器→ISP DNS→根DNS→TLD→权威DNS）→ TCP 三次握手 → TLS 握手（HTTPS）→ 发送 HTTP 请求。

## 二、渲染阶段

HTML → DOM Tree。CSS → CSSOM Tree。DOM + CSSOM → Render Tree。Layout 计算位置 → Paint 绘制 → Composite 合成。

\`\`\`html
<script src="heavy.js"></script>        <!-- 同步：阻塞解析 -->
<script async src="analytics.js"></script> <!-- async：下载完执行，不保证顺序 -->
<script defer src="app.js"></script>      <!-- defer：DOM 解析完执行，保证顺序 -->
\`\`\`

## 三、重排与重绘

\`\`\`javascript
// 触发重排（代价高）：改几何属性、innerHTML、offsetHeight（强制同步布局）
element.style.width = "200px";
el.offsetHeight; // 强制同步布局！

// 只触发重绘（代价低）：改 color/background
element.style.color = "red";

// ✅ 优化：先批量读，再批量写
const heights = items.map(i => i.offsetHeight);  // 批量读
items.forEach((i, idx) => i.style.height = heights[idx] + "px"); // 批量写
\`\`\``,

    },
    {
      id: "browser-02",
      title: "浏览器缓存全攻略：强缓存 / 协商缓存 / Service Worker",
      tags: ["浏览器", "缓存", "HTTP"],
      excerpt: "掌握 HTTP 缓存的所有细节及 Service Worker 离线缓存方案",
      content:
`## 强缓存（直接从缓存取）

\`\`\`http
Cache-Control: max-age=31536000   # 1年内有效（推荐）
Cache-Control: no-cache            # 不直接用缓存→转协商
Cache-Control: no-store             # 完全不缓存
\`\`\`

## 协商缓存（发请求验证）

\`\`\`http
# Last-Modified / If-Modified-Since（秒级精度）
# ETag / If-None-Match（内容哈希，更精确）
# 没变化 → 304 Not Modified
\`\`\`

**最佳策略：** HTML → no-cache 每次验证。带 hash 的 CSS/JS → 永久缓存。图片/字体 → 30天。

## Service Worker

\`\`\`javascript
self.addEventListener("install", e => e.waitUntil(caches.open("v1").then(c => c.addAll(["/","/app.js"]))));
self.addEventListener("fetch", e => e.respondWith(caches.match(e.request).then(c => c || fetch(e.request))));
\`\`\``,

    },
    {
      id: "browser-03",
      title: "跨域解决方案：JSONP / CORS / 代理 / PostMessage",
      tags: ["浏览器", "跨域", "安全"],
      excerpt: "彻底搞懂同源策略和各种跨域方案的原理与适用场景",
      content:
`## 同源策略：协议 + 域名 + 端口 三者一致

## JSONP（仅 GET）

\`\`\`javascript
// 原理：<script> 不受同源限制
function jsonp(url, cb) {
  const s = document.createElement("script");
  const n = "cb_" + Date.now();
  window[n] = d => { cb(d); delete window[n]; s.remove(); };
  s.src = \`\${url}?callback=\${n}\`;
  document.body.appendChild(s);
}
\`\`\`

## CORS（现代标准）

服务端返回 Access-Control-Allow-Origin / Allow-Methods / Allow-Headers。非简单请求先发 OPTIONS 预检。

## 代理（开发环境）

\`\`\`javascript
// vite.config.ts
server: { proxy: { "/api": { target: "http://backend:3000", changeOrigin: true } } }
\`\`\`

## PostMessage（iframe/窗口通信）

\`\`\`javascript
iframe.contentWindow.postMessage(data, "https://child.com");
window.addEventListener("message", e => { if (e.origin !== "https://parent.com") return; });
\`\`\``,

    },
    {
      id: "browser-04",
      title: "浏览器存储：Cookie / localStorage / sessionStorage / IndexedDB 全方位对比",
      tags: ["浏览器", "存储", "IndexedDB"],
      excerpt: "从容量、生命周期、API 到实战场景，彻底搞懂浏览器四类存储方案",
      content:
`## 四种存储速查

| | Cookie | localStorage | sessionStorage | IndexedDB |
|---|---|---|---|---|
| 容量 | ~4KB | ~5MB | ~5MB | 数百MB+ |
| 生命周期 | 可设过期 | 永久(手动清) | 标签页关闭 | 永久 |
| 请求携带 | ✅ 自动 | ❌ | ❌ | ❌ |
| 同源策略 | 可配 domain/path | 同源 | 同标签页+同源 | 同源 |
| API | document.cookie | getItem/setItem | getItem/setItem | 事务+对象仓库 |
| 异步 | ❌ | ❌ | ❌ | ✅ |

## Cookie 详解

\`\`\`javascript
// 设置 Cookie
document.cookie = "token=abc123; max-age=86400; path=/; domain=.example.com; SameSite=Lax; Secure; HttpOnly";

// 读取（只能读到非 HttpOnly 的）
console.log(document.cookie); // "token=abc123; theme=dark"

// ⚠️ 每次 HTTP 请求自动携带，所以体积务必控制，只存必要的标识
// HttpOnly: JS 无法读取，防 XSS
// Secure: 仅 HTTPS 传输
// SameSite: Strict(完全禁止跨站) / Lax(允许链接跳转带) / None(需配合 Secure)
\`\`\`

## localStorage vs sessionStorage

\`\`\`javascript
// localStorage — 标签页关闭后仍存在
localStorage.setItem("theme", "dark");
localStorage.getItem("theme"); // "dark"
localStorage.removeItem("theme");
localStorage.clear();

// sessionStorage — 标签页关闭即清除（即使是同源的不同标签页也隔离）
sessionStorage.setItem("step", "2");

// 监听其他标签页的 storage 变化（localStorage 专属）
window.addEventListener("storage", e => {
  console.log(e.key, e.oldValue, e.newValue); // 其他标签页改了啥
});
\`\`\`

## IndexedDB — 大容量异步存储

\`\`\`javascript
// 打开/创建数据库
const db = await new Promise((resolve, reject) => {
  const req = indexedDB.open("myDB", 1);
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
  req.onupgradeneeded = e => {
    const db = e.target.result;
    const store = db.createObjectStore("users", { keyPath: "id" });
    store.createIndex("name", "name", { unique: false });
  };
});

// 写入
const tx = db.transaction("users", "readwrite");
tx.objectStore("users").add({ id: 1, name: "Alice" });

// 读取
const user = await new Promise(r => {
  db.transaction("users").objectStore("users").get(1).onsuccess = e => r(e.target.result);
});
\`\`\`

## 选型决策

\`\`\`
服务端需要读 → Cookie
临时数据跨页面 → sessionStorage
长期偏好设置 → localStorage
大量结构化数据 → IndexedDB
\`\`\``,

    },
    {
      id: "browser-05",
      title: "浏览器安全策略：同源策略、CORS 预检、Cookie SameSite、CSP",
      tags: ["浏览器", "安全", "同源策略"],
      excerpt: "理解浏览器的核心安全机制，掌握 CORS 预检流程与 SameSite 的防护原理",
      content:
`## 同源策略 — 浏览器安全的基石

\`\`\`
同源 = 协议 + 域名 + 端口 三者相同
https://a.com:443/page 与 https://a.com:443/api → 同源 ✅
https://a.com 与 http://a.com → 不同源（协议）
a.example.com 与 b.example.com → 不同源（子域）
\`\`\`

**限制：** ① 无法读取不同源的 Cookie/LocalStorage/IndexedDB ② 无法读取不同源的 DOM ③ 无法向不同源发 AJAX（可发但拿不到响应）。

## CORS — 跨域资源共享

\`\`\`http
# 服务端返回以下头，告诉浏览器"我允许跨域"
Access-Control-Allow-Origin: https://my-site.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
\`\`\`

**简单请求 vs 预检请求：**
\`\`\`
简单请求（不发 OPTIONS）：GET/HEAD/POST + 仅三种 Content-Type + 无自定义头
不满足 → 浏览器先发 OPTIONS 预检 → 服务端返回 Allow 头 → 再发真实请求
\`\`\`

## SameSite Cookie — CSRF 克星

\`\`\`
SameSite=Strict: 完全禁止第三方请求携带 Cookie（最安全，但影响体验）
SameSite=Lax: 允许顶级导航(GET链接跳转)携带，禁止 iframe/img/ajax 携带（推荐，Chrome 默认）
SameSite=None: 无限制，必须配合 Secure（HTTPS）
\`\`\`

\`\`\`http
Set-Cookie: session=xxx; SameSite=Lax; Secure; HttpOnly
\`\`\`

## CSP — 内容安全策略

\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'unsafe-inline'; img-src *; frame-ancestors 'none'; connect-src 'self' https://api.example.com
\`\`\`

**关键指令：**
- \`script-src 'nonce-xxx'\`：只允许带匹配 nonce 的 script 标签执行（防 XSS）
- \`frame-ancestors 'none'\`：禁止被 iframe 嵌入（防点击劫持）
- \`connect-src\`：限制 fetch/XHR/WebSocket 的目标域名
- 可代替 X-Frame-Options，功能更强

## 安全头速查

\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload  # HSTS
X-Content-Type-Options: nosniff                                        # 禁止 MIME 嗅探
X-Frame-Options: DENY                                                  # 禁止被嵌入
Referrer-Policy: strict-origin-when-cross-origin                       # 控制 Referer
Permissions-Policy: camera=(), microphone=()                           # 禁用 API
\`\`\``,

    },
    {
      id: "browser-06",
      title: "V8 引擎工作原理：解析、JIT 编译、隐藏类、垃圾回收全解",
      tags: ["浏览器", "V8", "JS引擎"],
      excerpt: "从源码到机器码，深入理解 V8 引擎的 Ignition + TurboFan 分层编译管线",
      content:
`## V8 完整编译管线

\`\`\`
① Parser → 生成 AST
② Ignition (解释器) → AST 转为字节码并立即执行（快启动）
③ 运行时 Profiler 收集热点信息（哪些函数被频繁调用，哪些变量类型稳定）
④ TurboFan (优化编译器) → 热点字节码编译为高度优化的机器码
⑤ 如果类型预测失败 → Deoptimization → 退回 Ignition 字节码
⑥ 如果再次稳定 → 重新优化（这个循环叫 "优化-去优化" 循环）
\`\`\`

## Ignition — 字节码解释器

\`\`\`javascript
// Ignition 把 AST 转为紧凑的字节码，启动比机器码快得多
function add(a, b) { return a + b; }
// 生成类似如下的字节码：
// Ldar a1      — 加载参数 a
// Add a2       — 与参数 b 相加
// Return       — 返回结果
\`\`\`

**Ignition 比旧版 Full-Codegen 的优势：** 更小的内存占用，更快的启动时间，统一的字节码格式供 TurboFan 复用。

## TurboFan — 激进优化编译器

\`\`\`javascript
function sum(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}
// V8 发现 sum 被频繁调用且 arr 总是 int 数组
// → TurboFan 编译成假设"arr[i] 一定是 int"的高效机器码
// → 跳过类型检查，直接做整数加法

sum([1, 2, 3]);
sum([4, 5, 6]);
sum([7, "oops"]); // ← 第 7 个元素是字符串！
// TurboFan 的假设失败 → Deoptimization → 退回字节码
\`\`\`

## 隐藏类（Hidden Class / Map）

\`\`\`javascript
// V8 给相同结构的对象分配相同的"隐藏类"，加速属性查找
function Point(x, y) { this.x = x; this.y = y; }
const p1 = new Point(1, 2); // 隐藏类 = HC₁
const p2 = new Point(3, 4); // 隐藏类 = HC₁（相同！）
p1.z = 5;                   // 隐藏类变成 HC₂ → 从此 p1 和 p2 不再共享！
// ✅ 构造函数中初始化所有属性，避免运行时动态添加
\`\`\`

## 垃圾回收 (GC)

\`\`\`
新生代 (Young Gen): Scavenge 算法 (快，高频，复制存活对象)
老生代 (Old Gen): 标记-清除 (Mark-Sweep) + 标记-整理 (Mark-Compact)
大型对象直接进老生代

◆ 增量标记：标记拆分与 JS 交替执行 → 减少 GC 停顿时间
◆ 并发标记：标记在后台线程执行 → 不阻塞主线程
◆ 惰性清理：只在需要时清理 → 分摊 GC 工作量

内存泄漏排查：Chrome DevTools → Memory → Heap Snapshot → 对比前后 → Delta 排序
\`\`\``,

    },
  ],
};

export const typescriptData = {
  name: "TypeScript 核心知识点",
  description: "TypeScript 类型系统、泛型、工具类型等核心知识",
  icon: "TS",
  items: [
    {
      id: "ts-01",
      title: "TypeScript 泛型与高级类型编程",
      tags: ["TypeScript", "泛型", "类型系统"],
      excerpt: "从基础泛型到条件类型、infer、映射类型，深入类型体操",
      content:
`## 泛型基础

\`\`\`typescript
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first([1, 2, 3]); // T 推断为 number

interface ApiRes<T> { code: number; data: T; msg: string; }

// 泛型约束
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
\`\`\`

## 条件类型与 infer

\`\`\`typescript
type Unwrap<T> = T extends Promise<infer R> ? R : T;  // Unwrap<Promise<string>> → string
type Return<T> = T extends (...args: any[]) => infer R ? R : never;
type Params<T> = T extends (...args: infer P) => any ? P : never;
\`\`\`

## 映射类型

\`\`\`typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends keyof any, V> = { [P in K]: V };
\`\`\`

## type vs interface

interface 可声明合并 + extends；type 支持联合/交叉/元组。日常对象优先 interface，联合/映射用 type。`,

    },
    {
      id: "ts-02",
      title: "类型守卫、模板字面量类型与实战技巧",
      tags: ["TypeScript", "类型守卫", "实战"],
      excerpt: "掌握 5 种类型收窄方式与模板字面量类型的高级用法",
      content:
`## 五种类型收窄

\`\`\`typescript
// ① typeof: typeof val === "number"
// ② instanceof: t instanceof Date
// ③ in: "fly" in animal
// ④ 可辨识联合：switch (action.type) { case "add": ... }
// ⑤ 自定义守卫：function isString(v: unknown): v is string { return typeof v === "string"; }
\`\`\`

## 模板字面量类型

\`\`\`typescript
type Lang = "en" | "zh";
type Key = \`lang.\${Lang}\`;  // "lang.en" | "lang.zh"

type Events = "click" | "focus";
type Handlers = { [K in Events as \`on\${Capitalize<K>}\`]: () => void };
// { onClick: () => void; onFocus: () => void }
\`\`\`

## 协变与逆变

返回值协变：()=>Dog 可赋给 ()=>Animal。参数逆变：(a:Animal)=>void 可赋给 (d:Dog)=>void。strictFunctionTypes 下生效。`,

    },
  ],
};

export const cssData = {
  name: "CSS 知识汇总",
  description: "CSS 布局、动画、响应式设计、预处理器等知识",
  icon: "C",
  items: [
    {
      id: "css-01",
      title: "Flexbox 与 Grid 布局：从属性速查到实战",
      tags: ["CSS", "Flexbox", "Grid", "布局"],
      excerpt: "全面对比两大现代布局，附所有核心属性与经典布局模板",
      content:
`## Flexbox 核心

\`\`\`css
.container { display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 12px; }
.item { flex: 1; }      /* flex: 1 0 200px — 固定 200px 基础宽度 */
.item { align-self: center; order: -1; }
\`\`\`

## Grid 核心

\`\`\`css
.grid { display: grid; grid-template-columns: repeat(12, 1fr); }
.grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); } /* 响应式卡片！不写 media query */
.item { grid-column: 1 / -1; }  /* 占据整行 */
.item { grid-column: span 2; }  /* 占 2 列 */
\`\`\`

## 6 种居中方案

① Flex: justify-content+align-items center ② Grid: place-items center ③ Absolute+translate(-50%,-50%) ④ Absolute+Margin:auto（需宽高） ⑤ Table-cell: vertical-align middle ⑥ Line-height 单行文本。`,

    },
    {
      id: "css-02",
      title: "BFC / 盒模型 / 层叠上下文 / CSS 动画性能",
      tags: ["CSS", "BFC", "盒模型", "动画"],
      excerpt: "深入理解 CSS 核心机制",
      content:
`## BFC（Block Formatting Context）

形成方式：overflow:hidden/auto、display:flow-root（现代推荐）、float、position:absolute、flex/grid。

三大作用：① 清除浮动（父元素 overflow:hidden）② 防止外边距折叠 ③ 自适应两栏布局。

## 盒模型

\`\`\`css
*, *::before, *::after { box-sizing: border-box; } /* 全局推荐 */
/* content-box: width=content-width。border-box: width=content+padding+border */
\`\`\`

## CSS 动画性能

✅ 高性能：只用 transform + opacity（只触发 Composite，GPU 合成）
❌ 低性能：动画 top/left/width（触发 Layout/Paint）`,

    },
    {
      id: "css-03",
      title: "CSS 响应式设计：媒体查询、容器查询、移动端适配",
      tags: ["CSS", "响应式", "适配"],
      excerpt: "从 media query 到容器查询，掌握现代响应式设计的完整方案",
      content:
`## 媒体查询（Media Query）

\`\`\`css
/* 移动端优先：先写基础样式，再用 min-width 逐级覆盖 */
.card { padding: 12px; }                  /* 手机 */

@media (min-width: 640px) { .card { padding: 16px; } }  /* 平板 */
@media (min-width: 1024px){ .card { padding: 20px; } }  /* 桌面 */
@media (min-width: 1280px){ .card { padding: 24px; } }  /* 大屏 */

/* 常用断点：sm:640 / md:768 / lg:1024 / xl:1280 / 2xl:1536 */
\`\`\`

## 容器查询（Container Query）— 新时代

\`\`\`css
/* 父容器定义 containment */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 根据父容器宽度而不是视口宽度来决定样式！ */
@container card (min-width: 400px) {
  .card { display: flex; }
}
@container card (min-width: 600px) {
  .card { font-size: 1.2rem; }
}
/* 同一个组件放在窄栏 vs 宽栏自动适配，不依赖全局 viewport */
\`\`\`

## 移动端适配方案

\`\`\`html
<!-- viewport — 移动端必备 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
\`\`\`

\`\`\`css
/* ① rem 方案 — 根元素字体等比缩放 */
html { font-size: calc(100vw / 375 * 100); } /* 375 设计稿，1rem=100px */
/* 或 flexible 方案：JS 动态设置 html font-size */

/* ② vw/vh 方案（现代推荐） */
.hero { height: 100vh; padding: 5vw; }
/* 100vw 始终等于视口宽度，自然等比 */

/* ③ clamp() — 弹性范围 */
.card { width: clamp(300px, 80%, 600px); } /* 最小300，最大600，中间80% */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); } /* 字体随视口弹性变化 */

/* ④ 1px 物理像素边框 — 高清屏适配 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .hairline { border-width: 0.5px; }
}
@media (-webkit-min-device-pixel-ratio: 3) {
  .hairline { border-width: 0.333px; }
}
\`\`\`

## 响应式图片

\`\`\`html
<!-- srcset + sizes：浏览器自动选最优 -->
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
     alt="响应式图片" />

<!-- picture：艺术方向（不同比例裁切） -->
<picture>
  <source media="(min-width: 800px)" srcset="wide.jpg" />
  <source media="(min-width: 400px)" srcset="square.jpg" />
  <img src="tall.jpg" alt="fallback" />
</picture>
\`\`\``,

    },
    {
      id: "css-04",
      title: "CSS 预处理器与工程化：SCSS/Less 核心功能与 Tailwind CSS",
      tags: ["CSS", "SCSS", "Tailwind"],
      excerpt: "掌握 SCSS 变量/混入/继承/循环，理解 Tailwind 的原子化思想",
      content:
`## SCSS 核心功能

\`\`\`scss
// ① 变量
$primary: #3b82f6;
$spacing: 16px;
.btn { background: $primary; padding: $spacing; }

// ② 嵌套 & 父选择器
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  &.active { border-color: $primary; }
  &__title { font-size: 18px; }  // BEM：.card__title
  &--large { padding: 24px; }     // BEM：.card--large
}

// ③ @mixin — 代码复用
@mixin flex-center($gap: 0) {
  display: flex; justify-content: center; align-items: center; gap: $gap;
}
.container { @include flex-center(12px); }

// ④ @extend — 选择器继承
%base-btn { padding: 8px 16px; border-radius: 4px; }
.btn-primary { @extend %base-btn; background: blue; color: white; }
.btn-danger  { @extend %base-btn; background: red; color: white; }

// ⑤ 循环
@for $i from 1 through 4 {
  .col-#{$i} { width: 25% * $i; }
}

// ⑥ 函数
@function px-to-rem($px) { @return calc($px / 16) * 1rem; }
\`\`\`

## Tailwind CSS — 原子化 CSS

\`\`\`jsx
// 传统：写 class 名再写 CSS
<button className="btn-primary">提交</button>
// .btn-primary { padding: 8px 16px; background: blue; ... }

// Tailwind：直接在 HTML 组合原子类
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md transition-all">
  提交
</button>
// 好处：不离开 HTML、不用想 class 名、生产自动 tree-shake 多余 CSS
\`\`\`

\`\`\`js
// tailwind.config.js 定制
export default {
  theme: {
    extend: {
      colors: { brand: { 500: "#6366f1" } },
      spacing: { "128": "32rem" },
    },
  },
};
// 使用：bg-brand-500 / w-128
\`\`\`

## 选择对比

| 场景 | 推荐 |
|---|---|
| 组件库定制 | SCSS (变量+混入) |
| 快速原型 | Tailwind |
| 已有设计系统 | Tailwind + 自定义 theme |
| 团队统一风格 | Tailwind (约束自由发挥) |
| 复杂动画/特效 | CSS-in-JS 或纯 CSS |

**SCSS vs Tailwind 不是对立：** 全局主题变量用 SCSS，日常布局用 Tailwind，复杂组件用 CSS Modules。`,

    },
    {
      id: "css-05",
      title: "CSS 常见面试陷阱：层叠、选择器优先级、z-index、外边距合并",
      tags: ["CSS", "面试", "陷阱"],
      excerpt: "攻克 CSS 面试中最高频的 5 大易错点，附带调试技巧",
      content:
`## ① 选择器优先级（Specificity）

\`\`\`css
/* 优先级计算：内联(1000) > ID(100) > 类/伪类/属性(10) > 元素/伪元素(1) */

div { color: black; }           /* 0,0,0,1 = 1 */
.content { color: blue; }      /* 0,0,1,0 = 10 */
#main { color: red; }          /* 0,1,0,0 = 100 */
<div style="color:green">   /* 1,0,0,0 = 1000 → 最高优先级 */
\`\`\`

\`\`\`css
/* !important > 内联 > ID > class > 元素 */
.text { color: red !important; } /* 最高 — 几乎不应该使用 */

/* 优先级相等时，后写的生效 */
.title { color: green; }
.title { color: blue; } /* ← 这个生效 */
\`\`\`

**特殊技巧：** 用 10 个 class 也覆盖不了 1 个 ID（权重不进制）

## ② z-index 与层叠上下文

\`\`\`css
/* z-index 只在定位元素（非 static）和有层叠上下文时生效 */
.box {
  position: relative;
  z-index: 10;
}
/* 但如果其父元素创建了新的层叠上下文且 z-index 更低 → 被"锁住"！
   .box 的 z-index 只在父元素的层叠上下文内比较 */
\`\`\`

**创建层叠上下文的方式（至少 8 种）：**
\`\`\`
① position: relative/absolute/fixed + z-index ≠ auto
② opacity < 1
③ transform / filter / perspective 不为 none
④ will-change: transform/opacity
⑤ flex/grid 子元素 + z-index ≠ auto
⑥ isolation: isolate
⑦ position: fixed
⑧ backdrop-filter ≠ none
\`\`\`

## ③ 外边距合并（Margin Collapse）

\`\`\`html
<style>
  .box1 { margin-bottom: 30px; }
  .box2 { margin-top: 20px; }
  /* 两者间距 = 30px（取较大值），不是 50px！*/
</style>
<div class="box1">A</div>
<div class="box2">B</div>
\`\`\`

**触发条件：** ① 垂直方向 ② 相邻的块级元素 ③ 同一个 BFC 内

**解决方案：**
\`\`\`css
/* ① 父元素触发 BFC */
.parent { overflow: hidden; }

/* ② 用 padding 代替 margin */
.child { padding-top: 20px; }

/* ③ 加 border / padding 隔开 */
.parent { border-top: 1px solid transparent; }

/* ④ flex / grid 布局不触发合并 */
.parent { display: flex; flex-direction: column; }
\`\`\`

## ④ 隐藏元素 4 种方式

| 方式 | 占位 | 事件 | 渲染 | 动画支持 |
|---|---|---|---|---|
| opacity: 0 | ✅ | ✅ | 触发 Paint | ✅ |
| visibility: hidden | ✅ | ❌ | 触发 Paint | ✅ |
| display: none | ❌ | ❌ | 不渲染 | ❌ |
| position: absolute; top: -9999px | ❌ | ❌ | 触发 Layout | ❌ |

\`\`\`css
/* 典型场景选择 */
/* 淡入淡出 → opacity */
/* 无障碍隐藏 → .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0) } */
/* 彻底移除 → display:none */
\`\`\`

## ⑤ 清除浮动的 4 种方法

\`\`\`css
/* ① clearfix 伪元素（最经典） */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* ② overflow: hidden — 触发 BFC */
.parent { overflow: hidden; }

/* ③ display: flow-root — 现代 BFC 方案 */
.parent { display: flow-root; }

/* ④ 空 div 清除（不推荐） */
<div style="clear: both;"></div>
\`\`\``,

    },
    {
      id: "css-06",
      title: "CSS 盒模型：content-box vs border-box 彻底搞懂",
      tags: ["CSS", "盒模型", "基础"],
      excerpt: "从标准模型到怪异模型，理解 width/height 的计算方式与最佳实践",
      content:
`## 两种盒模型

\`\`\`css
/* 标准盒模型（content-box，默认） */
.content-box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
/* 实际占据宽度 = 200(content) + 20×2(padding) + 5×2(border) = 250px */
/* width 只包含内容区 */

/* 边框盒模型（border-box，推荐） */
.border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
/* 实际占据宽度 = 200px（content=150 + padding=40 + border=10） */
/* width 包含 content + padding + border */
\`\`\`

## 盒模型四层结构

\`\`\`
┌───────── margin ───────────────┐
│  ┌────── border ──────────┐    │
│  │  ┌─── padding ────┐    │    │
│  │  │                │    │    │
│  │  │    content     │    │    │  ← content-box: width 计这里
│  │  │                │    │    │  ← border-box: width 从这里开始算
│  │  └────────────────┘    │    │
│  └────────────────────────┘    │
└────────────────────────────────┘
\`\`\`

## 全局设置 border-box（几乎所有项目都这样做）

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
/* 这样所有元素的 width/height 都包含 padding 和 border，
   布局计算更直观：设 width=50%，两个并列就是各占一半 */
\`\`\`

## 两种模型下的 width 取值

\`\`\`css
/* ① 固定像素 — 两者都可 */
.box { width: 300px; }

/* ② 百分比 — 参考父元素的 content-box 宽度 */
.box { width: 50%; }
/* 父元素 border-box → 参考 content 宽度 → 两个并列放得下 */
/* 父元素 content-box → 也是参考 content 宽度 → 一样 */

/* ③ auto — 自动填充剩余空间（默认值）*/
.box { width: auto; }
/* 块级元素 width:auto = 撑满父元素的 content 区域 */
\`\`\`

## content-box 的经典坑

\`\`\`css
/* 设了 width:100% + padding → 撑破父容器 */
.child {
  box-sizing: content-box;
  width: 100%;
  padding: 20px;
}
/* 实际宽度 = 100% + 40px > 父容器 → 出现水平滚动条！*/
\`\`\`

## margin 的特殊行为

\`\`\`css
/* margin 不参与盒模型宽度的计算 */
/* 但影响元素的外部布局空间 */

/* auto 居中：左右 margin 设为 auto → 水平居中 */
.block {
  width: 600px;
  margin: 0 auto; /* 上下0，左右自动平分 */
}

/* margin 负值：拉近/拉远元素 */
.pull-up { margin-top: -20px; } /* 向上移动 20px */
.pull-left { margin-left: -10px; } /* 向左移动 10px */
\`\`\`

## 常见面试题

\`\`\`css
/* Q: 以下两个 div 各自占据多宽？*/
.a { width: 100px; padding: 10px; border: 2px; } /* 默认 content-box */
.b { width: 100px; padding: 10px; border: 2px; box-sizing: border-box; }

/* A: .a 占据 100+20+4=124px；.b 占据 100px（content=76+padding=20+border=4）*/

/* Q: margin 的百分比相对于什么？*/
.box { margin-left: 10%; }
/* A: 相对于父元素的 **width**（不是自己的 width）*/
\`\`\`

## inline vs inline-block vs block 的盒模型差异

| 元素类型 | width/height | margin 上下 | padding 上下 |
|---|---|---|---|
| inline | ❌ 无效 | ❌ 不占空间 | 占空间但不影响行高 |
| inline-block | ✅ | ✅ | ✅ |
| block | ✅（默认 100%）| ✅ | ✅ |

\`\`\`css
span { display: inline; width: 200px; margin-top: 20px; }
/* width 无用，margin-top 不占空间 → 看起来很"奇怪"*/
/* 改为 display: inline-block 即可解决 */
\`\`\``,

    },
    {
      id: "css-07",
      title: "CSS Grid 网格布局完全指南",
      tags: ["CSS", "Grid", "布局"],
      excerpt: "从零到精通，覆盖 Grid 容器与项目的所有核心属性、经典布局模板与实战技巧",
      content:
`## Grid 基本概念

\`\`\`
Flexbox = 一维布局（行或列）
Grid    = 二维布局（行和列同时控制）

Grid 核心术语：
┌──────── Grid Container ────────────┐
│  ┌─── Grid Item ───────┐           │
│  │                      │          │
│  └──────────────────────┘          │
│  ┌──── Grid Line ──┐              │
│  │  ┌─ Grid Track ─────           │
│  │  │ (行或列的轨道) │             │
│  └──── Grid Area ────┘            │
└────────────────────────────────────┘
\`\`\`

## 一、容器属性（Grid Container）

### 定义网格

\`\`\`css
.grid {
  display: grid; /* 或 inline-grid */

  /* 列 */
  grid-template-columns: 200px 1fr 200px; /* 经典三栏：固定-弹性-固定 */
  grid-template-columns: repeat(12, 1fr); /* 12 等分 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 响应式卡片！不写 media query */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));  /* auto-fit 会拉伸填满 */
  grid-template-columns: 1fr minmax(300px, 1fr) 1fr; /* 中间列最小 300px */

  /* 行 */
  grid-template-rows: auto 1fr auto; /* 粘性 footer 布局：头-内容-脚 */
  grid-template-rows: 60px 1fr 60px; /* header - main - footer */
  grid-template-rows: repeat(3, 1fr); /* 3 行等分 */

  /* 间距 */
  gap: 20px;                    /* 行列统一间距 */
  row-gap: 16px;                /* 行间距 */
  column-gap: 24px;             /* 列间距 */
}
\`\`\`

### fr 单位详解

\`\`\`css
/* fr = fraction（份数），按比例分配剩余空间 */
grid-template-columns: 1fr 2fr 1fr;
/* 总宽度 - 固定值 = 剩余空间
   剩余空间分 4 份 → 第1列1份、第2列2份(双倍宽)、第3列1份 */

/* fr 与 px 混合 */
grid-template-columns: 200px 1fr;
/* 第1列 200px 固定，第2列撑满剩余全部 */
\`\`\`

### auto-fill vs auto-fit

\`\`\`css
/* auto-fill：留空轨道（空白区域保留） */
.container { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

/* auto-fit：折叠空轨道（已有卡片会拉伸填满） */
.container { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* 只有 3 个卡片时：
   auto-fill → [Card][Card][Card][   空白   ]
   auto-fit  → [  Card  ][  Card  ][  Card  ]
                  ↑ 卡片被拉伸了 */
\`\`\`

### grid-template-areas — 可视化布局

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header  header"
    "sidebar main    right"
    "footer  footer  footer";
  gap: 16px;
  min-height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.right   { grid-area: right; }
.footer  { grid-area: footer; }
\`\`\`

## 二、项目属性（Grid Item）

\`\`\`css
/* ① 指定列/行范围 */
.item {
  grid-column: 1 / 3;        /* 从第 1 条线到第 3 条线 = 占两列 */
  grid-column: span 2;       /* 等价写法：跨两列 */
  grid-column: 1 / -1;       /* 贯穿整行（!important: -1 = 最后一条线） */
  grid-row: 1 / 3;          /* 从第 1 行线到第 3 行线 = 占两行 */
}

/* ② 简写 */
.item { grid-column: 1 / span 2; grid-row: 1; }

/* ③ 对齐方式（只影响自身，不影响其他子项） */
.item {
  justify-self: center | start | end | stretch;
  align-self: center | start | end | stretch;
  place-self: center;        /* align-self + justify-self 合写 */
}
\`\`\`

## 三、容器对齐属性

\`\`\`css
.grid {
  /* 所有子项在网格内的整体水平对齐 */
  justify-items: start | center | end | stretch;

  /* 所有子项在网格内的整体垂直对齐 */
  align-items: start | center | end | stretch;

  /* 网格本身在容器内的水平位置（网格总宽 < 容器宽时才有效） */
  justify-content: center | space-between | space-around | space-evenly;

  /* 网格本身在容器内的垂直位置 */
  align-content: center | space-between | space-around;
}
\`\`\`

## 四、经典布局模板

### 圣杯布局（Header + 左右侧栏 + 内容 + Footer）

\`\`\`css
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas: "header header header" "left main right" "footer footer footer";
  min-height: 100vh;
}
\`\`\`

### 瀑布流卡片

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
\`\`\`

### 12 栅格系统

\`\`\`css
.row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
.col-4  { grid-column: span 4; }  /* 占 1/3 */
.col-6  { grid-column: span 6; }  /* 占 1/2 */
.col-8  { grid-column: span 8; }  /* 占 2/3 */
.col-12 { grid-column: span 12; } /* 占整行 */
\`\`\`

### 重叠布局（同一格子叠放多个元素）

\`\`\`css
.overlay {
  display: grid;
  grid-template: 1fr / 1fr; /* 一行一列 */
}
.overlay > * {
  grid-area: 1 / 1; /* 全部放在同一个格子 */
}
/* 第一个子元素在最底层，后面的叠在上面 —— 背景图+文字叠加！*/
\`\`\`

## 五、Grid vs Flexbox 选型

| 场景 | 选 Grid | 选 Flexbox |
|---|---|---|
| 二维布局(行列同时) | ✅ | ❌ |
| 一维列表/导航 | 可以但不必要 | ✅ |
| 固定行列网格 | ✅ | ❌ |
| 内容撑开布局 | 不灵活 | ✅ |
| 响应式卡片(自动换行) | ✅(auto-fill) | ✅(flex-wrap) |
| 页面整体框架 | ✅(grid-template-areas) | ❌ |

**实操决策：** 页面框架用 Grid，组件内部布局用 Flexbox，两者组合是最佳实践。

## 六、常见坑

\`\`\`css
/* 坑①：grid 子项的 margin 不合并（独立存在于每个格子内） */

/* 坑②：隐式行高由 grid-auto-rows 控制 */
.grid { grid-auto-rows: minmax(100px, auto); } /* 自动创建的行最小 100px */

/* 坑③：grid 子项的 float/vertical-align 完全失效！Grid 终结了浮动布局时代 */

/* 坑④：minmax(0, 1fr) 防止内容撑爆 */
.grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
/* 不加 minmax(0, ...) 的话，内容过长会撑爆列宽 */
\`\`\``,

    },
    {
      id: "css-08",
      title: "CSS 垂直居中的 8 种方法：从经典到现代",
      tags: ["CSS", "居中", "面试"],
      excerpt: "从 line-height 到 Grid，掌握全部垂直居中方案及其适用场景",
      content:
`## 场景① 单行文本垂直居中 — line-height

\`\`\`css
.btn {
  height: 40px;
  line-height: 40px;   /* 与 height 相等 → 文字垂直居中 */
}
\`\`\`

**原理：** line-height = 文字行高。设为与容器高度相同 → 浏览器自动将文字定位在行高的中间位置。适用于导航栏、按钮等单行场景。

## 场景② 多行文本垂直居中 — table-cell

\`\`\`css
.outer {
  display: table;      /* 模拟 <table> */
  height: 200px;
}
.inner {
  display: table-cell;  /* 模拟 <td> */
  vertical-align: middle; /* 表格单元格自带垂直居中 */
}
\`\`\`

```html
<div class="outer">
  <div class="inner">多行<br />文字<br />垂直居中</div>
</div>
\`\`\`

**优点：** 兼容性好（IE8+），不需要知道内容高度。**缺点：** 多一层标签。适合老项目兼容或简单居中场景。

## 场景③ 绝对定位 + 负 margin — 已知子元素宽高

\`\`\`css
.parent {
  position: relative;
  height: 300px;
}
.child {
  position: absolute;
  top: 50%;               /* 左上角放到父元素 50% 处 */
  left: 50%;
  width: 200px;
  height: 100px;
  margin-top: -50px;       /* 向上拉自身高度的一半 = 50px */
  margin-left: -100px;     /* 向左拉自身宽度的一半 = 100px */
}
\`\`\`

**缺点：** 必须知道子元素精确宽高，不灵活。适用于弹窗、固定尺寸的 loading 等。

## 场景④ 绝对定位 + transform — 不需要知道宽高（推荐）

\`\`\`css
.parent {
  position: relative;
  height: 300px;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);  /* 自身的 50% 往回拉 */
}
\`\`\`

**原理：** \`top: 50%\` 是相对于父元素（父元素高度的 50%），\`translate(-50%, -50%)\` 是相对于元素自身（自身宽高的 50%），两者结合实现完美居中。**不需要知道子元素宽高！**

\`\`\`css
/* 进阶：只垂直居中，水平不居中 */
.child-only-v {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
\`\`\`

## 场景⑤ absolute + margin:auto — 已知宽高

\`\`\`css
.parent {
  position: relative;
  height: 300px;
}
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  width: 200px;
  height: 100px;
  margin: auto;        /* 神奇！上下左右自动平分 → 居中 */
}
\`\`\`

**原理：** 绝对定位 + 四方向都是 0 → 浏览器必须把这元素放在某个位置。同时设 \`margin: auto\` → 浏览器自动把剩余空间平分到各边 → 居中。但需要设置宽高。

## 场景⑥ Flexbox 居中 — 最常用

\`\`\`css
.parent {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 300px;
}
/* 一行搞定，不需要给子元素加任何样式！*/
\`\`\`

```css
/* 场景：垂直方向子元素间距均匀 */
.parent {
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 把所有子元素在垂直方向上居中 */
  align-items: center;
}

/* 场景：某个子元素单独对齐 */
.child {
  align-self: flex-end;     /* 只有这一个到底部 */
}
\`\`\`

## 场景⑦ Grid 居中 — 最简洁

\`\`\`css
.parent {
  display: grid;
  place-items: center;      /* align-items + justify-items 的简写 */
  height: 300px;
}
/* 两个字：place-items: center → 水平和垂直都居中！*/
\`\`\`

```css
/* 只垂直居中 */
.parent {
  display: grid;
  align-items: center;
}

/* Grid 子元素单独对齐 */
.child {
  align-self: end;           /* 这一个到底部 */
  justify-self: start;       /* 这一个靠左 */
}
\`\`\`

## 场景⑧ 内联元素/图片垂直居中 — vertical-align

\`\`\`css
.container {
  height: 60px;
  line-height: 60px;
}
img {
  vertical-align: middle;   /* 图片与文字中线对齐 */
}

/* 或配合伪元素撑高 */
.container::after {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
\`\`\`

## 八种方法对比速查

| 方法 | 需要知宽高 | 兼容性 | 适用场景 | 代码量 |
|------|-----------|--------|---------|--------|
| line-height | 高度 | 所有 | 单行文本 | 1 行 |
| table-cell | ❌ | IE8+ | 多行文本 | 两层 |
| absolute + 负margin | ✅ | 所有 | 固定弹窗 | 4 行 |
| absolute + transform | ❌ | IE10+ | **弹窗/模态框（推荐）** | 4 行 |
| absolute + margin:auto | ✅ | 所有 | 固定尺寸居中 | 6 行 |
| Flexbox | ❌ | IE10+ | **日常布局（最常用）** | 3 行 |
| Grid | ❌ | 现代浏览器 | **一行搞定** | 2 行 |
| vertical-align | ❌ | 所有 | 图片/icon 对齐 | 1 行 |

## 面试常见追问

**Q: 不定宽高的弹窗怎么垂直居中？**
A: absolute + transform（不需要宽高），或 Flexbox/Grid（同样不需要）。

**Q: Flexbox 和 Grid 居中的区别？**
A: Flexbox 适合一维居中（行或列），Grid 适合二维同时居中。\`place-items: center\` 是 Grid 独有的简写。

**Q: transform 居中有什么副作用？**
A: ① 可能影响子元素的 \`position: fixed\`（fixed 会相对于 transform 元素定位） ② 可能导致文字模糊（GPU 加速 + 亚像素问题，少见） ③ 多个 transform 属性会互相覆盖。`,

    },
  ],
};

export const htmlData = {
  name: "HTML 知识汇总",
  description: "HTML5 新特性、语义化标签、SEO 优化等知识",
  icon: "H",
  items: [
    {
      id: "html-01",
      title: "HTML5 新特性全景：语义化 / 存储 / Worker / Canvas",
      tags: ["HTML5", "语义化", "新特性"],
      excerpt: "全面梳理 HTML5 核心新特性与其在实际项目中的应用",
      content:
`## 语义化标签

header / nav / main / article / section / aside / footer。好处：SEO + 可访问性 + 代码可读性。

## 四种存储对比

| | localStorage | sessionStorage | Cookie | IndexedDB |
|---|---|---|---|---|
| 容量 | ~5MB | ~5MB | ~4KB | 数百MB+ |
| 生命周期 | 永久 | 标签页关闭 | 可设过期 | 永久 |
| 发送到服务端 | ❌ | ❌ | ✅ 自动 | ❌ |

## Web Worker

独立线程执行 JS，postMessage 通信（值拷贝）。不能访问 DOM/window/document。适合复杂计算/数据处理。

## Canvas vs SVG

Canvas：位图、像素操作、JS 绘制、适合游戏/图表。SVG：矢量图、DOM 操作、CSS 可样式化、适合图标/信息图。`,

    },
    {
      id: "html-02",
      title: "HTML 性能优化与 SEO 最佳实践",
      tags: ["HTML", "SEO", "性能"],
      excerpt: "掌握 HTML 层面的性能优化技巧和搜索引擎优化核心要点",
      content:
`## preload / prefetch / preconnect

\`\`\`html
<link rel="preload" href="font.woff2" as="font" crossorigin /> <!-- 当前页关键资源 -->
<link rel="prefetch" href="next.js" />                          <!-- 下个页面资源 -->
<link rel="preconnect" href="https://api.example.com" />        <!-- 提前建立连接 -->
\`\`\`

## SEO 核心

\`\`\`html
<title>页面标题</title>
<meta name="description" content="页面描述" />
<link rel="canonical" href="https://site.com/this-page" /> <!-- 防重复内容 -->
<script type="application/ld+json">{ "@context":"https://schema.org", "@type":"Article" }</script>
\`\`\`

## 加载策略

defer：异步下载，DOM 解析完执行，保证顺序。async：异步下载，下载完立即执行，不保证顺序。loading="lazy"：浏览器原生懒加载。`,

    },
    {
      id: "html-03",
      title: "HTML5 Canvas 与 SVG：矢量 vs 位图，从入门到实战",
      tags: ["HTML5", "Canvas", "SVG"],
      excerpt: "深入 Canvas API 绘图与 SVG 矢量图形，掌握图表、动画、签名等实战场景",
      content:
`## Canvas — 位图画布

\`\`\`javascript
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

// 设置尺寸（避免拉伸模糊）
canvas.width = canvas.offsetWidth * devicePixelRatio;
canvas.height = canvas.offsetHeight * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);

// 绘制矩形
ctx.fillStyle = "#3b82f6";
ctx.fillRect(10, 10, 100, 60);

// 绘制圆形
ctx.beginPath();
ctx.arc(150, 40, 30, 0, Math.PI * 2);
ctx.fillStyle = "#ef4444";
ctx.fill();

// 绘制文字
ctx.font = "16px sans-serif";
ctx.fillStyle = "#333";
ctx.fillText("Hello Canvas", 10, 120);

// 绘制图片
const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0, 200, 150);
img.src = "photo.jpg";

// 导出
canvas.toDataURL("image/png");  // base64
canvas.toBlob(blob => { /* 上传 */ }, "image/jpeg", 0.8);
\`\`\`

## Canvas 动画

\`\`\`javascript
let x = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
  ctx.fillRect(x, 50, 40, 40);                       // 绘制新帧
  x += 2;
  if (x > canvas.width) x = -40;
  requestAnimationFrame(animate);                    // 循环
}
animate();
\`\`\`

## SVG — 矢量图形

\`\`\`html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 圆形 -->
  <circle cx="100" cy="80" r="50" fill="#3b82f6" stroke="#1e40af" stroke-width="3" />

  <!-- 矩形 -->
  <rect x="30" y="150" width="140" height="30" rx="6" fill="#10b981" />

  <!-- 路径 -->
  <path d="M 60 120 L 100 60 L 140 120 Z" fill="none" stroke="#f59e0b" stroke-width="3" />

  <!-- 文字 -->
  <text x="100" y="170" text-anchor="middle" font-size="14" fill="#374151">SVG Demo</text>
</svg>
\`\`\`

## Canvas vs SVG 对比

| | Canvas | SVG |
|---|---|---|
| 类型 | 位图（像素） | 矢量（路径） |
| 放大 | 模糊 | 清晰 |
| 交互 | 需手动计算坐标 | DOM 事件直接绑定 |
| 性能 | 大量对象时好 | 对象少时好 |
| 适合 | 游戏/图表/图像处理 | 图标/信息图/简单动画 |
| 输出 | toDataURL/toBlob | 直接复制 XML |
| 数量大 | 快（不创建 DOM） | 慢（每个元素都是 DOM 节点） |`,

    },
    {
      id: "html-04",
      title: "WebSocket 即时通信：握手、心跳、重连与聊天室实战",
      tags: ["HTML5", "WebSocket", "即时通信"],
      excerpt: "从 HTTP 升级到全双工通信，掌握 WebSocket 的完整开发流程",
      content:
`## 为什么需要 WebSocket？

\`\`\`
HTTP：请求-响应，服务器不能主动推消息
轮询：setInterval 不断请求 → 浪费带宽
WebSocket：全双工通道，服务端可主动推送
\`\`\`

## 从 HTTP 升级到 WebSocket

\`\`\`
客户端请求：
GET /chat HTTP/1.1
Upgrade: websocket           ← 告诉服务器要升级
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

服务端响应：
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

→ 协议升级完成，TCP 连接变成 WebSocket 全双工通道
\`\`\`

## 客户端代码

\`\`\`javascript
const ws = new WebSocket("wss://example.com/chat");

ws.onopen = () => {
  console.log("连接建立");
  ws.send(JSON.stringify({ type: "join", room: "general" }));
};

ws.onmessage = e => {
  const msg = JSON.parse(e.data);
  console.log("收到消息", msg);
};

ws.onclose = e => {
  console.log("连接关闭", e.code, e.reason);
  // 这里可以重连
  setTimeout(() => reconnect(), 3000);
};

ws.onerror = e => console.error("连接错误", e);

// 发送消息
ws.send(JSON.stringify({ type: "message", text: "Hello!" }));

// 关闭
ws.close(1000, "用户离开"); // 1000 = 正常关闭
\`\`\`

## 心跳保活

\`\`\`javascript
// WebSocket 可能因网络波动断连，但 TCP 层不知道
// 需要应用层心跳检测
let heartbeatTimer;
ws.onopen = () => {
  heartbeatTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000); // 每 30 秒发一次
};
ws.onclose = () => clearInterval(heartbeatTimer);

// 超时检测：超过 10s 没收到任何消息 → 认为已断 → 主动重连
let lastMsg = Date.now();
const checkTimer = setInterval(() => {
  if (Date.now() - lastMsg > 10000) {
    ws.close();
    reconnect();
  }
}, 5000);
\`\`\`

## 断线重连（指数退避）

\`\`\`javascript
let retryCount = 0;
function reconnect() {
  const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // 1s→2s→4s→8s→...→30s 上限
  setTimeout(() => {
    retryCount++;
    connectWebSocket(); // 重新创建连接
  }, delay);
}
ws.onclose = () => reconnect();
ws.onopen = () => { retryCount = 0; }; // 连接成功重置计数
\`\`\``,

    },
    {
      id: "html-05",
      title: "Web Components：自定义元素 / Shadow DOM / Template Slot",
      tags: ["HTML5", "Web Components", "组件化"],
      excerpt: "掌握浏览器原生的组件化方案，不依赖框架也能封装可复用组件",
      content:
`## Web Components 三大技术

\`\`\`
① Custom Elements — 自定义 HTML 标签
② Shadow DOM — 样式和 DOM 隔离
③ HTML Template & Slot — 内容模板和插槽
\`\`\`

## Custom Elements 自定义元素

\`\`\`javascript
class UserCard extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = \`
      <div class="card">
        <h3>\${this.getAttribute("name")}</h3>
        <p>\${this.getAttribute("email")}</p>
      </div>
    \`;
  }
}
customElements.define("user-card", UserCard);
// 使用：<user-card name="Alice" email="alice@example.com"></user-card>
\`\`\`

## Shadow DOM — 样式隔离

\`\`\`javascript
class MyButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" }); // 创建 Shadow DOM
    shadow.innerHTML = \`
      <style>
        button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
        button:hover { background: #4f46e5; }
      </style>
      <button><slot></slot></button>
    \`;
    // Shadow DOM 内的样式不会影响外部，外部 CSS 也进不来！
  }
}
customElements.define("my-button", MyButton);
// 使用：<my-button>提交</my-button>
\`\`\`

## Template + Slot 内容投影

\`\`\`html
<template id="tab-panel-template">
  <style>
    .panel { padding: 16px; border: 1px solid #e5e7eb; }
  </style>
  <div class="panel">
    <slot name="header">默认标题</slot>
    <slot>默认内容</slot>
  </div>
</template>

<tab-panel>
  <h2 slot="header">自定义标题</h2>
  <p>自定义内容 — 投影到默认 slot</p>
</tab-panel>
\`\`\`

## 生命周期

\`\`\`javascript
class LifecycleDemo extends HTMLElement {
  connectedCallback()    { /* 挂载到 DOM */ }
  disconnectedCallback() { /* 从 DOM 移除 — 清理！*/ }
  adoptedCallback()      { /* 移动到新 document */ }
  attributeChangedCallback(name, oldVal, newVal) { /* 属性变化 */ }
  static get observedAttributes() { return ["name", "disabled"]; }
}
\`\`\`

## Web Components vs 框架组件

| | Web Components | React/Vue |
|---|---|---|
| 依赖 | 0 | 运行时框架 |
| 隔离 | Shadow DOM 原生 | 编译/约定 |
| 跨框架 | ✅ 天然 | 需桥接 |
| SSR | 需额外方案 | ✅ 内置 |
| 适合 | 通用 UI 库 | 业务应用 |`,

    },
    {
      id: "html-06",
      title: "HTML5 新增特性全景清单：API、元素、属性",
      tags: ["HTML5", "新特性", "API"],
      excerpt: "一次性掌握 HTML5 全部关键新增：语义标签、表单增强、多媒体、JS API、离线存储",
      content:
`## 一、新增语义标签

\`\`\`html
<!-- 结构标签 -->
<header> 页头 </header>
<nav>    导航栏 </nav>
<main>   主要内容 </main>
<article>独立文章</article>
<section>内容区段</section>
<aside>  侧边栏 </aside>
<footer> 页脚 </footer>

<!-- 图文标签 -->
<figure>
  <img src="photo.jpg" alt="照片" />
  <figcaption>图1：示例图片</figcaption>
</figure>

<!-- 时间/标记 -->
<time datetime="2025-07-09">2025年7月9日</time>
<mark>高亮文本</mark>
<details>
  <summary>点击展开详情</summary>
  <p>这里是展开后的详细内容</p>
</details>
\`\`\`

## 二、表单增强（10+ 新 input 类型 + 新属性）

\`\`\`html
<!-- 新 type -->
<input type="email" placeholder="邮箱" />
<input type="url" placeholder="网址" />
<input type="tel" placeholder="手机号" />
<input type="number" min="1" max="100" step="5" />
<input type="range" min="0" max="100" />
<input type="date" />
<input type="time" />
<input type="datetime-local" />
<input type="color" />
<input type="search" />

<!-- 新属性 -->
<input type="text" placeholder="提示文字" autofocus autocomplete="off" />
<input type="text" required pattern="\\d{6}" title="6位数字" />
<input type="text" readonly />   <!-- 只读，会提交 -->
<input type="text" disabled />   <!-- 禁用，不提交 -->
<input type="file" multiple accept="image/*" />

<!-- 新表单元素 -->
<datalist id="browsers">
  <option value="Chrome" /><option value="Firefox" /><option value="Safari" />
</datalist>
<input list="browsers" />

<output name="result" for="a b">计算结果</output>

<progress value="70" max="100">70%</progress>
<meter value="0.6">60%</meter>
\`\`\`

**JS 表单校验 API：** input.checkValidity() / input.validity / setCustomValidity()

## 三、多媒体 — Audio & Video

\`\`\`html
<video controls width="640" poster="cover.jpg">
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.webm" type="video/webm" />
  您的浏览器不支持 video 标签
</video>

<audio controls>
  <source src="music.mp3" type="audio/mpeg" />
  <source src="music.ogg" type="audio/ogg" />
</audio>
\`\`\`

\`\`\`javascript
const video = document.querySelector("video");
video.play(); video.pause();
video.currentTime = 30; // 跳转到 30s
video.muted = true;
video.addEventListener("ended", () => console.log("播放完毕"));
\`\`\`

## 四、JS API 大爆发

\`\`\`javascript
// ① 本地存储
localStorage.setItem("key", "val");
sessionStorage.setItem("key", "val");

// ② WebSocket — 全双工通信
const ws = new WebSocket("wss://example.com/chat");
ws.send(JSON.stringify({ msg: "hello" }));

// ③ Web Worker — 后台线程
const worker = new Worker("heavy.js");
worker.postMessage(data);
worker.onmessage = e => console.log(e.data);

// ④ Geolocation — 地理位置
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords.latitude, pos.coords.longitude),
  err => console.error(err),
  { enableHighAccuracy: true, timeout: 5000 }
);

// ⑤ History API — SPA 路由基础
history.pushState({ page: 1 }, "", "/page1");
history.replaceState({ page: 2 }, "", "/page2");
window.addEventListener("popstate", e => console.log(e.state));

// ⑥ Drag & Drop
el.addEventListener("dragover", e => e.preventDefault());
el.addEventListener("drop", e => {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");
});

// ⑦ File API — 读取本地文件
input.addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => console.log(reader.result);
  reader.readAsDataURL(e.target.files[0]);
});

// ⑧ Notification — 桌面通知
Notification.requestPermission().then(p => {
  if (p === "granted") new Notification("新消息", { body: "您有新消息" });
});

// ⑨ requestAnimationFrame — 动画优化
requestAnimationFrame(() => { /* 浏览器在下一帧执行，自动 60fps */ });

// ⑩ requestIdleCallback — 空闲执行
requestIdleCallback(deadline => {
  while (deadline.timeRemaining() > 0) { nextTask(); }
});

// ⑪ Fullscreen API
el.requestFullscreen();
document.exitFullscreen();

// ⑫ Page Visibility — 页面可见性
document.addEventListener("visibilitychange", () => {
  if (document.hidden) console.log("用户离开了标签页");
});

// ⑬ Server-Sent Events — 服务端推送
const es = new EventSource("/api/events");
es.onmessage = e => console.log(JSON.parse(e.data));
\`\`\`

## 五、离线 & 性能

\`\`\`html
<!-- Application Cache — 已废弃！改用 Service Worker -->
<!-- Service Worker — 离线缓存、消息推送 -->
\`\`\`

\`\`\`javascript
// 注册 Service Worker
navigator.serviceWorker.register("/sw.js");
\`\`\`

**HTML5 带来的范式变化：** 从 "HTML+CSS+JS 搭页面" 变成了 "HTML 提供语义结构 + CSS 负责视觉 + JS 调用丰富 API 建应用"。`,

    },
  ],
};

export const nodejsData = {
  name: "NodeJS 知识",
  description: "Node.js 运行时、模块系统、事件循环等后端知识",
  icon: "N",
  items: [
    {
      id: "node-01",
      title: "Node.js 事件循环 6 阶段与微任务优先级",
      tags: ["Node.js", "事件循环", "异步"],
      excerpt: "深入 Libuv 事件循环，对比浏览器事件循环核心差异",
      content:
`## Libuv 事件循环 6 阶段

timers → pending callbacks → idle/prepare → poll(I/O) → check(setImmediate) → close callbacks。

\`\`\`javascript
setTimeout(() => console.log("1"), 0);
setImmediate(() => console.log("2"));
process.nextTick(() => console.log("3"));
Promise.resolve().then(() => console.log("4"));
// 输出：3→4→1→2 或 3→4→2→1（timers 与 check 顺序取决于 loop 启动时间）
\`\`\`

## Node 有两个微任务队列！

① process.nextTick 队列 — 最高优先级 ② Promise 微任务队列 — nextTick 清空后才清空。

## 浏览器 vs Node

| | 浏览器 | Node |
|---|---|---|
| 微任务 | 1个 | 2个(nextTick优先) |
| setImmediate | ❌ | ✅ |
| rAF | ✅ | ❌ |
| 渲染 | 可能插入 UI 渲染 | 无 |`,

    },
    {
      id: "node-02",
      title: "Express / Koa 中间件原理与洋葱模型",
      tags: ["Node.js", "Express", "Koa", "中间件"],
      excerpt: "理解 Koa 洋葱模型与 Express 的差异，手写 compose 函数",
      content:
`## Express — 线性回溯

\`\`\`javascript
app.use((req, res, next) => { console.log("1→"); next(); console.log("←1"); });
app.use((req, res, next) => { console.log("2→"); next(); console.log("←2"); });
// 输出：1→→2→→←2→←1
\`\`\`

## Koa — 完全对称洋葱

\`\`\`javascript
app.use(async (ctx, next) => { console.log("1→"); await next(); console.log("←1"); });
app.use(async (ctx, next) => { console.log("2→"); await next(); console.log("←2"); });
// 输出：1→→2→→←2→←1（完全对称）
\`\`\`

## 手写 compose

\`\`\`javascript
function compose(mws) {
  return ctx => {
    let i = -1;
    function dispatch(idx) {
      if (idx <= i) return Promise.reject(new Error("next() called multiple times"));
      i = idx; const fn = mws[idx]; if (!fn) return Promise.resolve();
      return Promise.resolve(fn(ctx, () => dispatch(idx + 1)));
    }
    return dispatch(0);
  };
}
\`\`\`

## CJS vs ESM

CJS：运行时加载 | 同步 | require | module.exports | ❌Tree Shaking
ESM：编译时 | 异步 | import | export | ✅Tree Shaking`,

    },
  ],
};

export const networkData = {
  name: "计算机网络",
  description: "HTTP / TCP / IP 协议与前端网络优化",
  icon: "Nw",
  items: [
    {
      id: "net-01",
      title: "HTTP 1.0 → 1.1 → 2.0 → 3.0 演进全景",
      tags: ["HTTP", "协议", "网络"],
      excerpt: "各版本 HTTP 核心改进与底层原理对比",
      content:
`## 版本演进

| 版本 | 核心特性 | 痛点 |
|---|---|---|
| HTTP/1.0 | 短连接 | TCP 握手开销大 |
| HTTP/1.1 | 持久连接 + 管道化 | 管道化队头阻塞 |
| HTTP/2 | 二进制分帧 + 多路复用 + HPACK 头部压缩 + Server Push | TCP 队头阻塞 |
| HTTP/3 | QUIC(UDP) + 0-RTT + 无队头阻塞 + 连接迁移 | UDP 可能被限 |

## HTTP/2 多路复用

单个 TCP 连接 → 多个双向 Stream → 交错发送 Frame → 接收方按 Stream ID 重组。

## HTTP/3 (QUIC)

基于 UDP，绕过 TCP 队头阻塞（丢包只影响该 Stream）。0-RTT 握手。连接迁移（4G 切 WiFi 不需重握手）。

## HTTPS — TLS 1.3 握手

ClientHello → ServerHello+证书+Finished → Finished。1-RTT（比 TLS 1.2 少 1 RTT）。`,

    },
    {
      id: "net-02",
      title: "TCP 握手 / 挥手 / DNS / CDN 原理",
      tags: ["TCP", "DNS", "CDN"],
      excerpt: "经典网络面试题全解析",
      content:
`## TCP 三次握手

客户端 SYN→ 服务端 SYN-ACK→ 客户端 ACK。为什么三次？防止已失效连接请求建立无意义连接。

## TCP 四次挥手

客户端 FIN→ 服务端 ACK→ 服务端 FIN→ 客户端 ACK+2MSL等待。为什么等 2MSL？确保最后一个 ACK 能到达。

## DNS 解析

浏览器缓存→hosts→路由器→ISP DNS→根 DNS→.com TLD→权威 DNS→返回 IP。

## CDN 调度

GSLB 智能调度到最近的边缘节点，命中缓存直接返回，未命中回源。`,

    },
    {
      id: "net-03",
      title: "HTTP 与 HTTPS 的区别：从原理到抓包彻底搞懂",
      tags: ["HTTP", "HTTPS", "安全"],
      excerpt: "深入六维对比 HTTP 与 HTTPS，掌握 TLS 握手、证书验证、中间人攻击原理",
      content:
`## 一、六大核心区别

| 维度 | HTTP | HTTPS |
|---|---|---|
| 传输层 | TCP 明文 | TCP + TLS/SSL 加密 |
| 端口 | 80 | 443 |
| 数据安全 | 明文，可被窃听篡改 | 加密，防窃听防篡改 |
| 身份验证 | 无 | CA 证书验证服务器身份 |
| SEO | 无加成 | Google 排名加权 |
| 浏览器标识 | 无 | 🔒 绿色锁头 |
| URL 协议 | http:// | https:// |

## 二、HTTP 明文传输的风险

\`\`\`
客户端 ←→ 路由器A ←→ ISP ←→ 路由器B ←→ 服务端

HTTP 明文：任何中间节点都能看到和修改传输内容！

攻击演示（中间人攻击 — MITM）：
\`\`\`

\`\`\`javascript
// HTTP 明文请求（抓包即可看到）
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{"username":"alice","password":"secret123"}
// ← 密码完全暴露！任何中间路由器、WiFi 提供者都能看到
\`\`\`

\`\`\`bash
# Wireshark / tcpdump 抓 HTTP 包 → 用户名密码一览无余
tcpdump -A -i eth0 port 80
\`\`\`

## 三、HTTPS 加密原理

\`\`\`
HTTPS = HTTP + TLS（Transport Layer Security）

加密策略：非对称加密协商密钥 + 对称加密传输数据
① 非对称加密（RSA/ECDHE）：安全但慢，只用于握手阶段交换密钥
② 对称加密（AES-GCM/ChaCha20）：快速，用于加密实际传输的数据
③ 哈希（SHA-256）：验证数据完整性，防止篡改
\`\`\`

## 四、TLS 1.3 握手（完整流程）

\`\`\`
客户端                              服务端
────────────────────────────────────────────
① ClientHello                     →
  支持的密码套件(TLS_AES_256_GCM...)
  key_share (DH 公钥参数)

②                                ← ServerHello
                                   选择的密码套件
                                   key_share (DH 公钥参数)
                                 ← EncryptedExtensions
                                 ← Certificate (服务器证书)
                                 ← CertificateVerify (签名证明)
                                 ← Finished

③ 验证证书链 → CA 的公钥解密签名
   生成主密钥
④ Finished                        →
   ←→ 之后全为对称加密通信
\`\`\`

**1-RTT：** TLS 1.3 只需 1 个往返，比 TLS 1.2 的 2-RTT 快得多。

## 五、证书链验证

\`\`\`
浏览器内置信任的根 CA 列表（DigiCert、Let's Encrypt 等）
     ↓ 签名验证
   中间 CA 证书
     ↓ 签名验证
   服务器证书 (example.com)
     ↓
  验证通过 → 🔒 绿色锁头

验证内容：
① 证书是否在有效期内
② 证书域名是否匹配访问的域名
③ 签发者签名是否有效
④ 证书是否被吊销（CRL/OCSP）
\`\`\`

## 六、HTTPS 真的安全吗？

\`\`\`javascript
// ❌ 场景1：中间人代理（Charles/Fiddler）
// 用户安装了代理的根证书 → 代理可以解密所有流量
// → 所以公司网络、公共 WiFi 可以监控 HTTPS 流量

// ❌ 场景2：证书伪造
// 攻击者拿到你的域名 → 去 Let's Encrypt 签发证书
// → DNS 劫持到这个假证书 → 浏览器也显示 🔒！
// 防护：DNSSEC + CAA 记录 + 证书透明度(CT)监控

// ❌ 场景3：降级攻击
// 强制将 HTTPS 降级为 HTTP
// 防护：HSTS 头 → 浏览器记住只能用 HTTPS 访问

// ✅ 正确配置
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

## 七、HTTP → HTTPS 升级策略

\`\`\`javascript
// ① 全站升级：Nginx 301 重定向
// server { listen 80; return 301 https://$host$request_uri; }

// ② 混合内容（Mixed Content）问题
// HTTPS 页面中使用 <img src="http://..."> → 浏览器阻止/警告
// 修复：所有资源用 // 或绝对 https://

// ③ CSP upgrade-insecure-requests
// Content-Security-Policy: upgrade-insecure-requests
// 自动把 http:// 升级为 https://

// ④ HSTS Preload
// https://hstspreload.org 提交域名 → 浏览器内置名单
// 用户首次访问也强制 HTTPS，彻底杜绝降级攻击
\`\`\`

## 八、面试高频追问

**Q: HTTPS 为什么用对称+非对称混合？**
A: 纯非对称太慢（RSA 比 AES 慢 1000 倍+），纯对称无法安全交换密钥。混合：非对称交换对称密钥 → 对称加密传输数据。

**Q: 抓包工具为什么能看到 HTTPS 内容？**
A: 你手动安装了它的根证书，它作为中间人——对你伪装成服务器，对服务器伪装成客户端。

**Q: 证书链断了怎么办？**
A: 浏览器显示"不安全"或"证书错误"——中间 CA 证书没配全。Nginx 需要把中间证书也配在证书链里。`,

    },
  ],
};
export const securityData = {
  name: "前端安全知识",
  description: "XSS、CSRF、CSP、HTTPS 等前端安全防护知识",
  icon: "Sc",
  items: [
    {
      id: "sec-01",
      title: "XSS 攻击与多层防护方案",
      tags: ["安全", "XSS", "防护"],
      excerpt: "深入三种 XSS 攻击原理，掌握完整防护体系",
      content:
`## XSS 三种类型

① 反射型：URL 参数注入 → 服务端反射到页面
② 存储型：恶意代码存入数据库 → 所有访问者中招
③ DOM 型：innerHTML / document.write / eval 客户端注入

## 防护四层

① 输出转义：\`<→&lt; >→&gt; "→&quot;\`
② CSP 头：Content-Security-Policy: default-src 'self'
③ HttpOnly Cookie：禁止 JS 读取 cookie
④ 用 textContent 替代 innerHTML

## CSRF 防护

SameSite Cookie (Lax/Strict) + CSRF Token + Referer 校验`,

    },
    {
      id: "sec-02",
      title: "HTTPS / CSP / 点击劫持 / 前端加密安全",
      tags: ["安全", "HTTPS", "CSP"],
      excerpt: "全面理解 HTTPS 原理、CSP 配置与常见 Web 安全攻防",
      content:
`## HTTPS（TLS 1.3）

1-RTT 握手：ClientHello → ServerHello+证书 → Finished。加密 + 身份验证 + 数据完整性。

## HSTS

Strict-Transport-Security: max-age=31536000; includeSubDomains。浏览器自动将 http 升级为 https，防 SSL 剥离攻击。

## CSP 策略

\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc'; frame-ancestors 'none'
\`\`\`

## 点击劫持

透明 iframe 覆盖攻击。防护：X-Frame-Options: DENY 或 CSP frame-ancestors 'none'。

## 前端加密局限

前端加密 ≠ 替代 HTTPS！攻击者可篡改前端代码绕过加密。正确做法：HTTPS + 后端加盐哈希存储。`,

    },
  ],
};

export const engineeringData = {
  name: "前端工程化",
  description: "Webpack、Vite、CI/CD、代码规范等工程化实践",
  icon: "En",
  items: [
    {
      id: "eng-01",
      title: "Webpack 核心流程：Loader / Plugin / Tapable / HMR",
      tags: ["Webpack", "构建", "工程化"],
      excerpt: "从源码视角理解 Webpack 的编译管道和插件系统",
      content:
`## 编译流程

entry → resolve → loaders(右到左) → parse(AST) → collect deps → plugins → output

\`\`\`javascript
module.exports = {
  entry: "./src/index.js",
  output: { filename: "bundle.[contenthash:8].js" },
  module: { rules: [{ test: /\\.ts$/, use: ["babel-loader", "ts-loader"] }] }, // 右到左！
  plugins: [new HtmlWebpackPlugin()],
  resolve: { extensions: [".ts", ".tsx", ".js"], alias: { "@": path.resolve("src") } },
  optimization: { splitChunks: { chunks: "all" } },
};
\`\`\`

## Loader vs Plugin

Loader：文件内容转换，链式右→左。Plugin：构建整体扩展，通过 hook 注入。Tapable 是 Webpack 的发布订阅引擎。

## Vite

开发用 ESM 按需编译 + esbuild 预构建（Go 编写，快 10-100x）。HMR 精确到模块。生产用 Rollup。

## Tree Shaking 条件

① ESM import/export ② sideEffects: false ③ production build`,

    },
    {
      id: "eng-02",
      title: "Babel / monorepo / CI/CD 工程化实践",
      tags: ["工程化", "Babel", "monorepo"],
      excerpt: "理解 Babel 编译原理和 monorepo 架构实践",
      content:
`## Babel 三阶段

源码 → @babel/parser → AST → @babel/traverse(plugins) → 新 AST → @babel/generator → 目标代码

## monorepo

pnpm workspace + Turborepo/Nx。优势：代码共享、原子化提交、统一工具链、并行构建。

\`\`\`yaml
# pnpm-workspace.yaml
packages: ["apps/*", "packages/*"]
\`\`\`

## CI/CD 流水线

push → lint+type-check → unit test → build → deploy preview → e2e → production`,

    },
    {
      id: "eng-03",
      title: "Vite 与 Webpack 核心差异：原理、性能与选型",
      tags: ["工程化", "Vite", "Webpack"],
      excerpt: "从底层原理到开发体验，深度对比两大构建工具的区别、优势与适用场景",
      content:
`## 核心区别一览

| 维度 | Webpack | Vite |
|------|---------|------|
| 开发启动 | 全量打包 → 慢 | ESM 按需编译 → 秒开 |
| HMR 速度 | 随项目增大变慢 | 极快（精确到 ESM 模块） |
| 构建引擎 | 自建打包（JS） | 开发: esbuild(Go) 生产: Rollup |
| 模块处理 | 打包成 bundle | 原生 ESM，浏览器直接 import |
| 预构建依赖 | 不预构建，全走 loader | esbuild 预构建 CJS→ESM |
| 配置复杂度 | 高（loader/plugin 繁多） | 低（开箱即用，约定大于配置） |
| 生态 | 最丰富 | 快速增长，兼容 Rollup 插件 |
| 生产构建 | 自研 TerserPlugin | Rollup + esbuild/Terser |
| 浏览器兼容 | IE11+ | 现代浏览器（ESM 支持） |

## 为什么 Vite 开发启动这么快？

\`\`\`
Webpack 启动流程：
读取所有源文件 → loader 逐个处理 → 打包成 bundle → 启动 dev server
     ↑ 项目越大这个过程越慢，几十秒甚至几分钟

Vite 启动流程：
启动 dev server（秒开）→ 浏览器请求哪个模块就编译哪个
     ↑ 只编译当前页面用到的模块，不碰其他文件
\`\`\`

\`\`\`javascript
// Vite 利用浏览器原生 ESM
// 浏览器发起 import 请求 → Vite 即时编译并返回
<script type="module">
  import App from '/src/App.vue'  // 浏览器直接请求
</script>
// Vite dev server 拦截请求，实时编译 .vue / .ts → 返回浏览器能执行的 JS
\`\`\`

## esbuild 预构建依赖

\`\`\`javascript
// node_modules 里的库（React/Lodash 等）是 CJS 格式
// Vite 用 esbuild（Go 编写）把它们打包成 ESM，缓存到 node_modules/.vite
// esbuild 比 JS 打包器快 10-100 倍

// vite.config.js
export default {
  optimizeDeps: {
    include: ['lodash', 'moment'], // 强制预构建
    exclude: ['some-esm-lib'],     // 跳过的 ESM 库
  },
};
\`\`\`

## HMR 原理对比

\`\`\`
Webpack HMR：
修改文件 → 重新编译该模块及其依赖链 → 通过 WebSocket 推送 → 替换
     ↑ 依赖链越长越慢

Vite HMR：
修改文件 → 只重新编译该模块 → WebSocket 通知浏览器 → import() 热更新
     ↑ 不重新编译依赖链，精确到单个 ESM 模块
\`\`\`

## 生产构建为什么用 Rollup？

\`\`\`
① Rollup 的 Tree Shaking 比 Webpack 更彻底（ESM 静态分析）
② Rollup 输出的代码更干净（没有 Webpack 的模块运行时代码）
③ Rollup 生态成熟（大量优化插件）
④ 不能用 esbuild 直接打生产包 —— esbuild 不支持代码分割、CSS 等高级功能
\`\`\`

## Webpack 5 的新进展

\`\`\`javascript
// Webpack 5 新增特性缩小差距
module.exports = {
  // ① 持久化缓存：二次构建快 90%
  cache: { type: 'filesystem' },
  // ② Module Federation：微前端原生方案
  plugins: [new ModuleFederationPlugin({ ... })],
  // ③ Asset Modules：替代 file-loader/url-loader
  // ④ 更好的 Tree Shaking
};
\`\`\`

## 选型建议

| 场景 | 推荐 |
|------|------|
| 新项目 | Vite（启动快、配置少） |
| 老项目 Webpack 迁移 | 先不折腾，或逐步用 Vite |
| 需要 Module Federation | Webpack 5（Vite 生态尚未成熟） |
| 需要兼容 IE11 | Webpack |
| 大型 monorepo | Vite 或 Turbopack |
| 库开发 | Vite（Rollup 构建输出更干净） |

**总结：** Vite 解决了"开发慢"的核心痛点，生产构建用 Rollup 保证了质量和 Tree Shaking。不是要取代 Webpack，而是补足了 Webpack 的短板。`,

    },
    {
      id: "eng-04",
      title: "dist 包体积过大如何优化？从分析到落地的完整方案",
      tags: ["工程化", "性能", "优化"],
      excerpt: "从 Bundle 分析到逐个优化，全面掌握生产包体积的排查与治理方案",
      content:
`## 第一步：先分析，再动手

\`\`\`bash
# ① 生成构建分析报告
npm run build -- --report    # Vue CLI
npx vite build --mode analyze  # Vite + rollup-plugin-visualizer
# webpack: webpack-bundle-analyzer

# ② 打开报告 → 找出最大的 chunk 和重复模块
# 可视化看哪些依赖占了大头 → 针对性地优化
\`\`\`

\`\`\`javascript
// vite.config.js — 配合 rollup-plugin-visualizer
import { visualizer } from 'rollup-plugin-visualizer';
export default {
  plugins: [visualizer({ open: true, gzipSize: true, brotliSize: true })],
};
// 构建完自动打开浏览器 → 看每个模块的 gzip 后大小
\`\`\`

## 第二步：对症下药 — 7 个优化方向

### ① 代码分割（Code Splitting）— 最重要！

\`\`\`javascript
// ❌ 所有路由组件全量打包
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';

// ✅ 路由懒加载 — 按需加载
const Home = () => import('./pages/Home');
const About = () => import('./pages/About');
const Admin = () => import('./pages/Admin');
// 首屏只加载当前路由的 JS，其余路由用到了才下载
\`\`\`

\`\`\`javascript
// vite.config.js — 手动分割大依赖
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-charts': ['echarts'],
        'vendor-ui': ['antd'],
        'vendor-utils': ['lodash', 'moment'],
      },
    },
  },
},
// 把不常变的大依赖单独打成 chunk → 命中浏览器强缓存
\`\`\`

### ② Tree Shaking — 干掉死代码

\`\`\`javascript
// ❌ 全量引入
import _ from 'lodash';        // 整个 lodash ~70KB gzipped
import moment from 'moment';   // moment 本身不支持 tree shaking

// ✅ 按需引入
import debounce from 'lodash/debounce';  // 只引入 ~2KB
import dayjs from 'dayjs';              // 替代 moment，体积 1/10

// Webpack/Vite Tree Shaking 生效条件：
// ① 必须用 ESM（import / export），CJS 无法 tree shake
// ② package.json 中 "sideEffects": false
\`\`\`

### ③ CDN 外链 — 把大库甩给 CDN

\`\`\`html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
\`\`\`

\`\`\`javascript
// vite.config.js
build: {
  rollupOptions: {
    external: ['react', 'react-dom'],  // 打包时跳过
    output: {
      globals: { react: 'React', 'react-dom': 'ReactDOM' },
    },
  },
},
// React 和 ReactDOM 从 CDN 加载 → 不进 bundle
// 缺点：依赖 CDN 可用性，首次加载多一个 HTTP 请求
\`\`\`

### ④ 图片/字体压缩优化

\`\`\`javascript
// 图片：WebP/AVIF 替代 PNG/JPEG（体积减少 50-80%）
// 构建时自动转：vite-plugin-imagemin

// 字体：子集化（只保留用到的字符）
// 工具：fontmin、glyphhanger
// 一个完整中文字体 ~10MB → 子集化后 ~50KB

// 大图片：CDN + 懒加载 + 响应式裁剪
<img src="https://cdn.example.com/photo.jpg?w=400" loading="lazy" />
\`\`\`

### ⑤ 依赖瘦身 — 替换重型库

\`\`\`javascript
// ❌ → ✅ 常见替换
import moment from 'moment';     // 70KB → dayjs(7KB) / date-fns(按需)
import lodash from 'lodash';     // 70KB → lodash-es(按需) / 原生 JS
import axios from 'axios';       // 14KB → ky(5KB) / fetch(0)
import echarts from 'echarts';   // 1MB  → 按需引入 echarts/lib/...
// 或换轻量图表库：uCharts / Chart.js(树摇后 ~100KB)

// 分析：npx depcheck → 找出未使用的依赖
// 分析：npm ls --depth=0 → 检查有哪些重复/冗余的包
\`\`\`

### ⑥ Gzip / Brotli 压缩 — 服务端配置

\`\`\`nginx
# Nginx 开启 gzip
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
gzip_min_length 1024;
gzip_comp_level 6;

# Brotli（比 gzip 多压 15-25%）
brotli on;
brotli_types text/css application/javascript;
# 浏览器 Accept-Encoding: br → 返回 .br 文件
\`\`\`

\`\`\`javascript
// 构建时预生成 .gz / .br 文件
// vite-plugin-compression
import compression from 'vite-plugin-compression';
compression({ algorithm: 'gzip', ext: '.gz' }),
compression({ algorithm: 'brotli', ext: '.br' }),
// 服务端直接返回压缩文件，省去实时压缩 CPU
\`\`\`

### ⑦ 不要重复打包 — 去重

\`\`\`bash
# 场景：项目里 React 被打包了两份 → 多出 ~120KB

# 排查：npx npm-ls-duplicates ← 检查重复依赖
# 修复：pnpm dedupe / npm dedupe → 统一版本

# 排查：构建报告中同个库出现两次 → 配置 resolve.alias 统一
\`\`\`

## 优化优先级排序

\`\`\`
1. 路由懒加载               ← 投入最少，收益最大，必须做
2. Gzip/Brotli 压缩          ← 服务端配置，无前端改动
3. 依赖替换（moment→dayjs）  ← 低风险，效果明显
4. manualChunks 打散 vendor  ← 利用浏览器缓存
5. 图片压缩 + WebP            ← 首屏效果明显
6. Tree Shaking 生效          ← 检查 sideEffects、ESM
7. CDN 外链大库               ← 进阶方案，有风险
\`\`\`

## 验证效果

\`\`\`bash
# ① 比较优化前后大小
ls -lh dist/assets/*.js
du -sh dist/

# ② 用 Lighthouse 验证加载性能
# 关注：Total Blocking Time / Speed Index 是否改善

# ③ 线上监控：接入 web-vitals → LCP / FCP 是否改善

# ④ Bundle 分析报告对比：优化前后的 chunk 分布图
\`\`\``,

    },
  ],
};

export const miniprogramData = {
  name: "小程序知识",
  description: "微信小程序开发、Taro、uni-app 等跨端框架",
  icon: "MP",
  items: [
    {
      id: "mp-01",
      title: "小程序双线程架构 / setData 性能优化",
      tags: ["小程序", "架构", "性能"],
      excerpt: "理解小程序双线程架构与 setData 通信机制",
      content:
`## 双线程架构

渲染层(WebView) ↔ Native 层 ↔ 逻辑层(JSCore/V8)。通过消息通道通信，隔离 DOM 操作防 XSS。

## setData 优化

\`\`\`javascript
// ❌ 频繁 setData — 每次跨线程通信
for (let i = 0; i < 100; i++) { this.setData({ count: i }); }

// ✅ 合并后一次性调用
this.setData({ count: 99, name: "ok" });

// ✅ 精确路径更新
this.setData({ "list[0].name": "newName" });
\`\`\`

## 跨端方案

React/Vue 代码 → Taro/uni-app 编译 → AST 转换 → 各平台原生 DSL（微信/支付宝/H5/RN）。运行时+编译时混合。`,

    },
    {
      id: "mp-02",
      title: "小程序生命周期 / 路由 / 分包 / 性能优化",
      tags: ["小程序", "生命周期", "分包"],
      excerpt: "深入生命周期时序、页面栈管理、分包加载策略",
      content:
`## 生命周期

App: onLaunch(冷启动)→onShow(前台)→onHide(后台)
Page: onLoad→onShow→onReady→onHide→onUnload

## 页面栈

wx.navigateTo（入栈，最多10层）| redirectTo（替换）| navigateBack | switchTab | reLaunch

## 分包加载

\`\`\`json
{ "subPackages": [{ "root": "packageA", "pages": ["cat/cat"] }],
  "preloadRule": { "pages/index/index": { "network": "all", "packages": ["packageA"] } } }
\`\`\`

## 性能要点

懒注入 require、storage 缓存、setData 减量、EventChannel 页面通信。`,

    },
  ],
};

export const performanceData = {
  name: "前端性能优化",
  description: "性能指标、加载优化、渲染优化、缓存策略等",
  icon: "Pf",
  items: [
    {
      id: "perf-01",
      title: "Core Web Vitals：LCP / INP / CLS 优化实战",
      tags: ["性能", "LCP", "Core Web Vitals"],
      excerpt: "Google 三大核心指标详解及对应优化手段",
      content:
`## 三指标

| 指标 | 良好 | 需改进 | 差 |
|---|---|---|---|
| LCP | ≤2.5s | ≤4.0s | >4.0s |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |

## LCP 优化

预加载 LCP 资源(preload)、图片压缩+WebP+响应式、关键 CSS 内联+非关键 defer。

## INP 优化

拆分长任务(Long Task>50ms)用 requestIdleCallback、复杂计算放 Worker、startTransition 标记低优先级。

## CLS 优化

img/video 预设 aspect-ratio、font-display:swap、预留动态元素空间。

## 首屏优化清单

关键 CSS 内联 | JS 路由懒加载 | 图片 WebP+srcset | 字体子集化 | Gzip/Brotli+CDN | preconnect | Service Worker`,

    },
    {
      id: "perf-02",
      title: "前端性能监控与优化工具",
      tags: ["性能", "监控", "工具"],
      excerpt: "Performance API、web-vitals、Lighthouse 等工具使用",
      content:
`## Performance API

\`\`\`javascript
const { domContentLoadedEventEnd, fetchStart } = performance.timing;
const entries = performance.getEntriesByType("resource"); // 所有资源加载耗时

// PerformanceObserver 实时监控
new PerformanceObserver(list => {
  list.getEntries().forEach(e => {
    if (e.entryType === "largest-contentful-paint") console.log("LCP:", e.startTime);
    if (e.entryType === "layout-shift") console.log("CLS:", e.value);
  });
}).observe({ type: "largest-contentful-paint", buffered: true });
\`\`\`

## web-vitals 库

\`\`\`javascript
import { onLCP, onINP, onCLS } from "web-vitals";
onLCP(console.log); onINP(console.log); onCLS(console.log);
\`\`\`

## Lighthouse

五大维度：Performance / Accessibility / Best Practices / SEO / PWA
CLI: \`npx lighthouse https://example.com --view\`

## 性能闭环

开发(Lighthouse/Profiler) → 构建(Bundle Analyzer) → 上线(web-vitals+埋点→Grafana)`,

    },
    {
      id: "perf-03",
      title: "首页白屏排查与优化实战",
      tags: ["性能", "白屏", "排查"],
      excerpt: "系统梳理 SPA 白屏的根因分类、定位方法、修复策略与监控方案",
      content:
`## 白屏的定义

用户打开页面看到的是空白屏幕（通常是白底或黑底），没有任何内容渲染。SPA 应用中尤为常见。

## 白屏的六大根因

\`\`\`
① JS 加载/执行失败 — bundle 加载超时、CDN 挂了、JS 报错阻塞渲染
② 关键 CSS 缺失 — 内联 CSS 未注入、CSS 文件加载失败
③ 首屏数据请求超时 — API 挂了或返回空，前端依赖数据渲染
④ React/Vue 渲染异常 — 报错导致组件树崩溃，白屏而不展示错误边界
⑤ Webpack publicPath 错误 — 静态资源路径不对，JS/CSS 全 404
⑥ 内存溢出/死循环 — JS 主线程卡死，浏览器无法渲染
\`\`\`

## 排查方法论

\`\`\`
第一步：Network 面板 → 是否所有 JS/CSS 都加载成功？有没有 404/超时？
第二步：Console 面板 → 是否有未捕获的 JS 错误？
第三步：Performance 面板 → 录制加载过程，看哪个阶段卡住
第四步：Elements 面板 → #root / #app 内有没有内容？
第五步：Sources 面板 → 设置 DOM 变更断点，看代码是否执行到渲染逻辑
\`\`\`

## 常见场景及修复

### 场景一：JS 加载失败导致白屏

\`\`\`javascript
// ❌ bundle.js 404 / CDN 挂了 → 浏览器没有任何 JS 执行 → 白屏
// ✅ 修复：monitor 资源加载 + 重试机制
function retryLoad(src, retries = 3) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      if (retries > 0) {
        console.warn(\`重试加载 \${src}，剩余 \${retries} 次\`);
        document.head.removeChild(script);
        resolve(retryLoad(src, retries - 1));
      } else reject(new Error(\`Failed to load \${src}\`));
    };
    document.head.appendChild(script);
  });
}

// ✅ 更彻底：多 CDN 容灾
const CDNS = ["https://cdn1.example.com/bundle.js", "https://cdn2.example.com/bundle.js"];
\`\`\`

### 场景二：React/Vue 报错 → 白屏

\`\`\`tsx
// ✅ React Error Boundary — 兜底 UI
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) {
    // 上报错误
    reportError({ message: error.message, stack: error.stack, componentStack: info.componentStack });
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">
        <h2>页面出错了</h2>
        <button onClick={() => window.location.reload()}>刷新重试</button>
      </div>;
    }
    return this.props.children;
  }
}

// ✅ 全局错误兜底
window.addEventListener("error", e => {
  // 上报 + 展示轻量级错误页
  if (!document.getElementById("root")?.hasChildNodes()) {
    document.getElementById("root").innerHTML = "<h1>加载失败，请刷新</h1>";
  }
});
\`\`\`

### 场景三：publicPath 配置错误

\`\`\`javascript
// ❌ publicPath: "/" → 线上部署在 /app/ 子路径 → 所有 JS/CSS 都 404
// ✅ webpack：publicPath: process.env.ASSET_PATH || "/"
// ✅ vite：base: process.env.BASE_URL || "/"
// ✅ 部署时注入：window.__INJECTED_PUBLIC_PATH__ = "/app/"
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH__ || "/";
\`\`\`

### 场景四：CSS 未注入导致内容不可见

\`\`\`javascript
// ❌ CSS 文件 404 → DOM 已渲染但全部不可见
// ✅ 关键 CSS 内联到 HTML，保证首屏至少可见
// ✅ CSS 加载失败的兜底
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/style.css";
link.onerror = () => {
  // 加载内联的降级样式
  document.head.insertAdjacentHTML("beforeend", "<style>/* minimal fallback */</style>");
};
\`\`\`

### 场景五：数据请求阻塞渲染

\`\`\`tsx
// ❌ 等 API 返回才渲染—如果 API 超时/报错 → 永远白屏
function App() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api").then(r => r.json()).then(setData); }, []);
  if (!data) return null; // ← 白屏！
  return <div>{data}</div>;
}

// ✅ 加超时 + 兜底
const TIMEOUT = 5000;
function useData(url) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    fetch(url, { signal: controller.signal })
      .then(r => r.json()).then(data => setState({ loading: false, data, error: null }))
      .catch(err => setState({ loading: false, data: null, error: err.message }));
    return () => { clearTimeout(timer); controller.abort(); };
  }, [url]);
  return state; // { loading, data, error } → 渲染层根据状态展示骨架屏/错误页
}
\`\`\`

## 白屏监控

\`\`\`javascript
// DOM 挂载检测 — 在 JS 入口执行后、React 渲染后检查
function detectWhiteScreen() {
  const root = document.getElementById("root");
  const now = performance.now();

  // 5 秒后检查
  setTimeout(() => {
    const hasContent = root && (root.children.length > 0 || root.textContent.trim().length > 0);
    if (!hasContent) {
      // 白屏！上报
      navigator.sendBeacon("/api/report", JSON.stringify({
        type: "white-screen",
        url: location.href,
        duration: performance.now() - now,
        resources: performance.getEntriesByType("resource").map(r => ({ name: r.name, status: r.transferSize > 0 ? "ok" : "failed" })),
      }));
    }
  }, 5000);
}

// 在入口文件尽早调用
detectWhiteScreen();
\`\`\`

## 白屏优化清单

| 场景 | 修复方向 |
|---|---|
| JS 加载失败 | 多 CDN 容灾 + retry 机制 |
| React/Vue 报错 | ErrorBoundary + 全局 onerror |
| CSS 404 | 关键 CSS 内联 + 加载失败兜底 |
| 数据超时 | 超时机制 + 骨架屏 + 降级 UI |
| 内存溢出 | 代码 review + 内存 profiling |
| 死循环 | ESLint 规则 (no-unused-vars / for-direction) |

**口诀：** 白屏先看 Network → 再看 Console → 再看 #root 有没有内容 → 再看 Performance 时间线`,

    },
    {
      id: "perf-04",
      title: "大量数据渲染与部署优化：虚拟列表 / 懒加载 / 分页 / 预渲染",
      tags: ["性能", "大数据", "部署"],
      excerpt: "从渲染到部署全链路优化海量数据的展示性能",
      content:
`## 核心策略矩阵

| 策略 | DOM 数量 | 适用场景 | 部署复杂度 |
|---|---|---|---|
| 虚拟列表 | ~25 个 | 长列表/表格 | 低（引入库即可） |
| 分页 | 每页固定 | 管理后台/搜索 | 需后端配合 |
| 无限滚动 + DOM 回收 | 可变 | 信息流/feed | 中 |
| SSR/SSG 预渲染 | 首屏 0 JS | 内容型站点 | 高 |
| Web Worker 数据处理 | 无 DOM | 计算密集型 | 低 |

## 虚拟列表 — 只渲染可视区域

\`\`\`tsx
// react-window — 100000 条数据，仅 ~20 个 DOM 节点
import { FixedSizeList } from "react-window";
<FixedSizeList height={600} itemCount={100000} itemSize={40} width="100%">
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>
\`\`\`

**原理：** 容器内放占位 div（高度 = totalCount × itemSize），只渲染 scrollTop 附近 + buffer 的节点。滚动时更新渲染范围。

## 部署阶段优化

\`\`\`javascript
// ① 首屏只传输可视数据，后端分页 + 前端缓存
// GET /api/list?page=1&size=50 → 只返回第一页 50 条

// ② 数据预取 + Service Worker 缓存
// 在空闲时预加载下一页数据，切页时瞬间展示

// ③ SSR 首屏渲染
// 服务端直出 HTML → 用户看到内容的时间大幅缩短
// Next.js: export const getServerSideProps = async () => ({ props: { data: await fetchData() } });

// ④ SSG 静态生成 — 数据不频繁变化的页面
// Next.js: export const getStaticProps = async () => ({ props: { data: await fetchData() } });
// 构建时生成 HTML，部署到 CDN → 加载极快
\`\`\`

## 数据压缩与传输优化

\`\`\`
① JSON 压缩：pako (gzip)、MessagePack（更紧凑的二进制格式）
② 增量加载：先加载关键字段，详情按需请求
③ 字段精简：API 返回只传前端需要的字段（GraphQL 天然支持）
④ 数据脱水和注水（SSR）：服务端把数据序列化到 <script> 标签，客户端直接复用
\`\`\``,

    },
    {
      id: "perf-05",
      title: "大文件上传与部署优化：分片 / 断点续传 / CDN 加速",
      tags: ["性能", "上传", "部署"],
      excerpt: "从前端分片到后端合并，再到 CDN 加速，全链路优化大文件处理",
      content:
`## 分片上传核心流程

\`\`\`
① File.slice() 切文件 → 每片 5MB
② Web Worker 计算整个文件 hash (SHA256)
③ 服务端校验秒传 (hash 已存在 → 直接返回 URL)
④ 并发上传未传分片 (并发控制池)
⑤ 全部分片上传完 → 通知合并
\`\`\`

\`\`\`javascript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
function createChunks(file) {
  const chunks = [];
  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    chunks.push({ file: file.slice(start, start + CHUNK_SIZE), index: chunks.length });
  }
  return chunks;
}
// File.slice() 不会复制内存 — 零拷贝，大文件也不怕！
\`\`\`

## 部署阶段优化

\`\`\`javascript
// ① 并发控制 — 浏览器限制同域名 6 个连接
async function uploadPool(chunks, concurrency = 3) {
  const pool = new Set();
  for (const chunk of chunks) {
    const p = uploadChunk(chunk).finally(() => pool.delete(p));
    pool.add(p);
    if (pool.size >= concurrency) await Promise.race(pool);
  }
  await Promise.all(pool);
}

// ② 暂停/恢复 — AbortController
const ctrl = new AbortController();
fetch("/upload", { signal: ctrl.signal });
ctrl.abort(); // 暂停
// 恢复时重新上传未完成的分片

// ③ 进度回调
const xhr = new XMLHttpRequest();
xhr.upload.onprogress = e => {
  console.log(\`进度: \${(e.loaded / e.total * 100).toFixed(1)}%\`);
};
\`\`\`

## CDN 上传加速

\`\`\`
方案一：客户端 → CDN 边缘节点 → OSS/S3
        边缘节点就近接收，内网高速回源到存储

方案二：STS 临时凭证 + 客户端直传 OSS
        客户端拿临时 AK/SK，直传 OSS，不经过业务服务器
        减轻服务器压力，上传速度取决于客户端到 OSS 的带宽

方案三：分片上传 + 多区域并发
        把分片同时上传到不同区域的 OSS
        利用多地域带宽聚合
\`\`\`

## 图片/视频压缩

\`\`\`javascript
// 上传前压缩 — Canvas 压缩图片
function compressImage(file, maxWidth = 1920, quality = 0.8) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob), "image/jpeg", quality);
    };
    img.src = URL.createObjectURL(file);
  });
}
// 10MB PNG → 500KB JPEG → 上传流量减少 20 倍
\`\`\`
**注意：** 客户端压缩节省上传带宽，但耗 CPU。大文件放 Worker 里做。`,

    },
    {
      id: "perf-06",
      title: "微前端完整实践：通信 / 隔离 / 路由 / 部署 / 性能",
      tags: ["性能", "微前端", "架构"],
      excerpt: "从应用间通信、样式隔离、JS 沙箱、路由管理到部署优化，全面攻克微前端核心难题",
      content:
`## 微前端四大核心难题

\`\`\`
① 应用间通信 — 子应用 A 如何通知子应用 B 更新状态？
② 样式隔离   — 子应用 A 的 CSS 怎样不影响子应用 B？
③ JS 隔离    — 全局变量、事件监听怎样不互相污染？
④ 路由管理   — 主子应用路由如何协同？
⑤ 公共依赖   — React/Vue 怎样全局只加载一次？
\`\`\`

## 一、应用间通信（4 种方案）

### 方案 1：CustomEvent — 最轻量

\`\`\`javascript
// 主应用 — 广播事件
window.dispatchEvent(new CustomEvent("user-login", {
  detail: { userId: "123", role: "admin" },
}));

// 子应用 A — 监听
window.addEventListener("user-login", e => {
  console.log("当前用户", e.detail.userId);
  // 根据登录状态更新子应用 UI
});

// 子应用 B — 同样监听
window.addEventListener("user-login", e => {
  // 刷新购物车等...
});

// ⚠️ 子应用卸载时必须移除监听器！否则内存泄漏
export async function unmount() {
  window.removeEventListener("user-login", handler);
}
\`\`\`

### 方案 2：主应用通过 props 下发通信方法（qiankun 推荐）

\`\`\`javascript
// 主应用
import { registerMicroApps, initGlobalState } from "qiankun";

const actions = initGlobalState({ user: null, theme: "light" });

actions.onGlobalStateChange((state, prev) => {
  console.log("全局状态变化", state, prev);
});

registerMicroApps([{
  name: "app1",
  entry: "//localhost:3001",
  props: {
    globalState: actions,  // 传给子应用
    eventBus: new EventEmitter(), // 自定义事件总线
  },
}]);

// 子应用接收
export async function mount(props) {
  console.log(props.globalState); // 直接使用
  props.onGlobalStateChange?.((state, prev) => {
    console.log("主应用通知", state);
  });
  // 子应用修改全局状态
  props.setGlobalState?.({ user: { name: "Alice" } });
}
\`\`\`

### 方案 3：URL 参数 — 最可靠

\`\`\`javascript
// 通过 URL 传递简单状态（跨子应用刷新场景也能保持）
// 主应用跳转子应用时带参数
history.pushState(null, "", "/app2?userId=123&tab=settings");

// 子应用读取
const params = new URLSearchParams(location.search);
params.get("userId"); // "123"

// pros: 不依赖任何框架、刷新不丢失
// cons: 只能传字符串，数据量有限，不适合频繁变化的状态
\`\`\`

### 方案 4：共享 Store / 全局状态

\`\`\`javascript
// 主应用创建一个全局 Store，通过 props 注入所有子应用
// store.js（主应用管理）
class GlobalStore {
  constructor() { this.state = {}; this.listeners = []; }
  set(key, value) { this.state[key] = value; this.listeners.forEach(fn => fn(key, value)); }
  get(key) { return this.state[key]; }
  subscribe(fn) { this.listeners.push(fn); }
}

// 子应用使用
store.get("user");
store.subscribe((key, value) => {
  if (key === "user") { /* 根据 user 更新 UI */ }
});

// Vue 子应用可以直接用 reactive 包装
import { reactive } from "vue";
const globalState = reactive(store.state); // 响应式！
\`\`\`

## 二、样式隔离（3 种方案）

### 方案 1：Shadow DOM — 完美隔离

\`\`\`javascript
// qiankun strictStyleIsolation
start({ sandbox: { strictStyleIsolation: true } });
// 每个子应用挂在独立的 Shadow DOM 中
// 优点：CSS 完全隔离，子应用 A 的样式绝对不影响 B
// 缺点：子应用内无法使用 document.querySelector("body")（Shadow DOM 封装）
//       老组件（如 antd 的弹窗挂到 body）可能异常
\`\`\`

### 方案 2：CSS 前缀 — 兼容性好

\`\`\`javascript
// qiankun experimentalStyleIsolation
start({ sandbox: { experimentalStyleIsolation: true } });
// 原理：给所有子应用的样式选择器自动加上 data-qiankun="app-name" 前缀
// .title { color: red; } → .title[data-qiankun="app1"] { color: red; }
// 优点：兼容性好，不影响弹窗等 body 挂载的组件
// 缺点：[attr] 选择器增加了一点点特异性
\`\`\`

### 方案 3：CSS Modules / scoped

\`\`\`css
/* 开发规范：所有子应用必须用 CSS Modules 或 scoped */
/* React: import styles from "./App.module.css" */
/* Vue: <style scoped> */

/* 全局样式统一加子应用前缀 */
.app1-header { ... }
.app2-header { ... }
\`\`\`

## 三、JS 隔离 — Proxy 沙箱原理

\`\`\`javascript
// qiankun 的 Proxy 沙箱核心原理
class ProxySandbox {
  constructor() {
    this.proxy = new Proxy(window, {
      get(target, key) {
        // 优先查子应用自己的"假 window"
        if (this.fakeWindow.hasOwnProperty(key)) return this.fakeWindow[key];
        // 只读的白名单属性放行
        return target[key];
      },
      set(target, key, value) {
        // 所有修改都改在 fakeWindow 上，不污染全局
        this.fakeWindow[key] = value;
        return true;
      },
    });
  }

  active() { /* 激活沙箱：记录当前全局变量快照 */ }
  inactive() { /* 关闭沙箱：恢复全局变量到快照状态 */ }
}
// 子应用认为自己在操作 window，实际被 Proxy 拦截 → 隔离

// ⚠️ 事件监听器不会自动清除！
// 子应用卸载时必须清理所有 addEventListener、setTimeout、setInterval
let timers = [];
export async function mount() {
  timers.push(setInterval(() => {}, 1000));
}
export async function unmount() {
  timers.forEach(clearInterval); timers = [];
}
\`\`\`

## 四、路由协同

\`\`\`javascript
// 主应用路由
// /app1/* → 子应用 A，/app2/* → 子应用 B

// 子应用内部路由
// /app1/users → 子应用 A 的 users 页
// /app1/settings → 子应用 A 的 settings 页

// qiankun 配置
registerMicroApps([{
  name: "app1",
  entry: "//localhost:3001",
  activeRule: "/app1", // 匹配 /app1 及所有子路径
}]);

// 子应用的 router base 必须匹配
const router = createRouter({
  history: createWebHistory("/app1"),  // ← 关键！
  routes: [...],
});
// Vue: new VueRouter({ base: "/app1" })
// React: <BrowserRouter basename="/app1">

// 主子应用路由通信
// 主应用跳转子应用 → history.push("/app1/users")
// 子应用通知主应用 → window.dispatchEvent / props 回调
\`\`\`

## 五、公共依赖共享

\`\`\`javascript
// Module Federation — 声明共享依赖
new ModuleFederationPlugin({
  name: "host",
  shared: {
    react: { singleton: true, eager: false, requiredVersion: "^18" },
    "react-dom": { singleton: true, eager: false, requiredVersion: "^18" },
  },
});
// singleton: 全局只加载一份 React → 共享组件状态、useContext 可跨应用
// eager: false → 异步加载，减小主应用初始体积

// 对 qiankun 方案，主应用通过 externals 共享
// webpack externals
externals: { react: "React", "react-dom": "ReactDOM" }
// 主应用 HTML 引入 CDN 的 React
// 子应用打包时排除 React，运行时用主应用提供的 window.React
\`\`\`

## 六、常见问题与解决

\`\`\`javascript
// ① antd/Element UI 弹窗挂到 body → Shadow DOM 下找不到
// 解决：用 experimentalStyleIsolation 替代 strictStyleIsolation
//       或修改 UI 库的 getPopupContainer 指向子应用容器

// ② 子应用 A 修改了 window.xxx，子应用 B 读到了
// 解决：启用 Proxy 沙箱，或约定永远不用 window 传数据

// ③ 多个子应用都监听 window resize → 切换时监听器残留
// 解决：子应用 unmount 必须清理所有全局事件监听

// ④ 子应用图片 404 → publicPath 错误
// 解决：子应用 webpack publicPath 设置为运行时注入
// __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH__ || "/";

// ⑤ 子应用切换后，上个子应用的内存没释放
// 解决：Chrome DevTools → Memory → 拍 Heap Snapshot
//       观察 unmount 前后内存变化 → 排查闭包、定时器、事件监听泄漏

// ⑥ 子应用间的登录状态同步
// 解决：统一登录页（主应用管理）→ 登录后通过 globalState / CustomEvent 广播
//       所有子应用收到 user-login 事件后刷新自身状态
\`\`\`

## 七、微前端选型决策树

\`\`\`
是否需要独立部署和技术栈无关？
├── 是 → 微前端
│   ├── 老项目改造？→ qiankun（兼容性好）
│   └── 新项目并行开发？→ Module Federation（原生、性能好）
└── 否 → 考虑 monorepo 或组件库共享

简单场景 → Nginx 反向代理不同路径（最简单）
体验要求高 → 同技术栈 + Module Federation（共享依赖，加载快）
隔离要求高 → qiankun Shadow DOM + strict 沙箱
\`\`\``,

    },
    {
      id: "perf-07",
      title: "如何对项目进行性能优化？从加载到交互的全链路方案",
      tags: ["性能", "优化", "全链路"],
      excerpt: "从一二级指标到具体落地方案，系统讲述前端项目性能优化的完整方法论",
      content:
`## 性能优化的完整链路

\`\`\`
          ┌── 加载阶段 ──┐  ┌── 交互阶段 ──┐
用户打开  →  HTML下载  →  页面渲染  →  用户操作  →  界面响应
          ← dns/tcp/tls → ← 解析/执行 →  ← js/渲染 →  ← 网络/api →

优化目标：每个环节都要"更快"
\`\`\`

## 第一步：建立性能指标体系

\`\`\`
一级指标（面向用户）：
  LCP ≤ 2.5s   最大内容绘制 — 用户看到主要内容的时间
  INP ≤ 200ms   交互延迟 — 用户操作到浏览器响应的间隔
  CLS ≤ 0.1     布局偏移 — 页面视觉稳定性

二级指标（辅助定位）：
  FCP           首次内容绘制
  TTFB          首字节时间（服务端响应速度）
  TTI           完全可交互时间
  Speed Index   视觉加载速度得分
  Total Bundle Size   JS/CSS 总大小
\`\`\`

**衡量方式：** Chrome DevTools Lighthouse → 一键出分 + 建议；web-vitals 库 → 线上真实用户数据；PerformanceObserver → FCP/LCP/INP/CLS。

## 第二步：加载阶段优化（减少到达时间）

### 网络传输

\`\`\`javascript
// ① DNS 预解析 + 预连接
<link rel="dns-prefetch" href="//api.example.com" />
<link rel="preconnect" href="https://cdn.example.com" />

// ② 关键资源预加载
<link rel="preload" as="script" href="/critical.js" />
<link rel="preload" as="image" href="/hero.webp" />

// ③ HTML 文档压缩 + CDN 加速
// 服务端：Gzip/Brotli + Cache-Control 合理配置
// HTML 文件小 + 就近访问 → TTFB 从 2s → 200ms
\`\`\`

### 资源体积

\`\`\`javascript
// ① 路由懒加载 — 只加载当前页面需要的 JS
const Dashboard = lazy(() => import('./Dashboard'));

// ② 依赖瘦身 — 换轻量替代
// moment(70KB) → dayjs(7KB)  /  lodash → lodash-es 按需
// axios(14KB) → ky(5KB) 或直接用 fetch

// ③ 图片优化链
// 格式：PNG → WebP(体积 -60%) → AVIF(体积再 -30%)
// 策略：响应式裁剪 + 懒加载 + CDN 缓存
<img srcset="small.webp 400w, large.webp 800w" loading="lazy" />

// ④ Tree Shaking & Dead Code
// ESM + "sideEffects": false → 未使用的 export 打包时删除
// TerserPlugin 移除 console / debugger
\`\`\`

## 第三步：渲染阶段优化（让用户尽快看到内容）

### 减少阻塞

\`\`\`html
<!-- defer: 异步下载 + 等 DOM 解析完执行 + 保证顺序 -->
<script defer src="app.js"></script>
<!-- async: 异步下载 + 立即执行 + 不保证顺序 -->
<script async src="analytics.js"></script>
<!-- CSS 不阻塞 DOM 解析但阻塞渲染 → 关键 CSS 内联 -->
<style>/* 首屏关键样式直接写在 HTML 里 */</style>
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'" />
\`\`\`

### 首屏加速

\`\`\`javascript
// ① SSR / SSG — 服务端直出 HTML，首屏内容立即可见
// Next.js: getServerSideProps / getStaticProps

// ② 骨架屏 — 白屏期间给用户视觉反馈
<Suspense fallback={<Skeleton />}><HeavyComponent /></Suspense>

// ③ 非关键内容延迟加载
// requestIdleCallback(() => loadComments());  ← 浏览器空闲时才加载评论组件
\`\`\`

## 第四步：交互阶段优化（让用户操作丝滑）

### JS 执行优化

\`\`\`javascript
// ① 拆分长任务（Long Task > 50ms → 拆成多个短任务）
function processBatch(items, batchSize = 50) {
  let i = 0;
  function chunk() {
    const end = Math.min(i + batchSize, items.length);
    for (; i < end; i++) items[i].process();
    if (i < items.length) requestIdleCallback(chunk); // 让浏览器有机会插入渲染
    // 或用 scheduler.yield() — 现代 API
  }
  chunk();
}

// ② Web Worker — 把复杂计算移出主线程
const worker = new Worker('compute.js');
worker.postMessage(data);
worker.onmessage = e => updateUI(e.data);

// ③ 虚拟列表 — 10000 条数据只渲染可视的 ~20 条
<FixedSizeList height={600} itemCount={10000} itemSize={50}>
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>
\`\`\`

### 渲染优化

\`\`\`javascript
// ① React.memo / Vue computed — 避免不必要的重渲染
// ② useMemo / useCallback — 缓存计算结果和函数引用
// ③ 状态就近存放 → 只让需要的组件重渲染
// ④ CSS：动画只用 transform + opacity（GPU 合成，不走 Layout/Paint）
\`\`\`

### 网络优化

\`\`\`javascript
// ① 请求合并 — 多个小接口合并成一个
// ② 数据预取 — hover 时预加载详情
link.onmouseenter = () => import('./DetailPage');

// ③ 缓存策略
// 接口：强缓存非实时数据 + 协商缓存实时数据 + SW 兜底
// 静态资源：hash + CDN + 永久缓存

// ④ 大列表分页 / 无限滚动
// GET /api/list?page=1&size=20 → 只返回 20 条，不一次性返回全量
\`\`\`

## 第五步：构建与部署优化

\`\`\`javascript
// ① 代码分割 + vendor 拆分 — 把大 chunk 打散
manualChunks: { vendor: ['react','react-dom'], ui: ['antd'], utils: ['lodash'] }

// ② modern + legacy 双构建 — 现代浏览器用 ES2015+(更小更快)
<script type="module" src="app.mjs">
<script nomodule src="app.es5.js">  // 降级兼容

// ③ Gzip/Brotli 预压缩 — 构建时生成 .gz/.br，省去服务端实时 CPU
// ④ 关键 CSS 提取并内联到 HTML — Critical CSS 工具
// ⑤ 静态资源 hash — 利用浏览器永久缓存
\`\`\`

## 第六步：持续监控

\`\`\`javascript
// ① 开发阶段：Lighthouse CI + PR 卡点
// ② 上线前：Bundle Analyzer + 竞品对比
// ③ 上线后：web-vitals + 自定义埋点 → Grafana 看板

import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';
onLCP(metric => sendToAnalytics('LCP', metric.value));
onINP(metric => sendToAnalytics('INP', metric.value));
onCLS(metric => sendToAnalytics('CLS', metric.value));

// ④ 告警：指标劣化 > 20% 自动通知
\`\`\`

## 优化效果验证清单

\`\`\`
□ Lighthouse 分数 > 90（Performance）
□ LCP < 2.5s，INP < 200ms，CLS < 0.1
□ 首屏 JS < 200KB (gzipped)
□ 首屏图片 < 100KB (WebP)
□ FCP < 1.5s，TTFB < 600ms
□ 页面完全可交互 < 3.5s
□ 未使用 JS 占比 < 20%（Code Coverage 检查）
\`\`\``,

    },
  ],
};

export const inlineCategories: Record<string, { name: string; description: string; icon: string }> = {
  react: { name: "React 核心知识", description: "React 基础、Hooks、状态管理、性能优化等核心知识", icon: "R" },
  javascript: { name: "JavaScript 系列知识点", description: "JS 基础、原型链、闭包、异步编程等核心知识", icon: "JS" },
  browser: { name: "浏览器原理核心知识点", description: "浏览器渲染原理、事件循环、安全策略等核心知识", icon: "Br" },
  vue: { name: "Vue 高频面试题", description: "Vue 基础、进阶、原理、Vue2/Vue3 对比等核心知识", icon: "Vue" },
  typescript: { name: "TypeScript 核心知识点", description: "TypeScript 类型系统、泛型、工具类型等核心知识", icon: "TS" },
  css: { name: "CSS 知识汇总", description: "CSS 布局、动画、响应式设计、预处理器等知识", icon: "C" },
  html: { name: "HTML 知识汇总", description: "HTML5 新特性、语义化标签、SEO 优化等知识", icon: "H" },
  nodejs: { name: "NodeJS 知识", description: "Node.js 运行时、模块系统、事件循环等后端知识", icon: "N" },
  network: { name: "计算机网络", description: "HTTP / TCP / IP 协议与前端网络优化", icon: "Nw" },
  security: { name: "前端安全知识", description: "XSS、CSRF、CSP、HTTPS 等前端安全防护知识", icon: "Sc" },
  engineering: { name: "前端工程化", description: "Webpack、Vite、CI/CD、代码规范等工程化实践", icon: "En" },
  miniprogram: { name: "小程序知识", description: "微信小程序开发、Taro、uni-app 等跨端框架", icon: "MP" },
  performance: { name: "前端性能优化", description: "性能指标、加载优化、渲染优化、缓存策略等", icon: "Pf" },
};
