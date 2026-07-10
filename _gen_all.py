# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

def w(s):
    """Write string to output file"""
    return s

# Build the complete file content
out = """export const reactData = {
  name: "React 核心知识",
  description: "React 基础、Hooks、状态管理、性能优化等核心知识",
  icon: "R",
  items: [
    {
      id: "react-01",
      title: "React Hooks 深入解析：useState / useEffect / useRef 原理与最佳实践",
      tags: ["React", "Hooks", "useState"],
      excerpt: "深入理解 React Hooks 运行机制，掌握批量更新、清理函数和 useRef 的多种用途",
      content: `
## useState 批量更新原理与闭包陷阱

useState 是 React 函数组件的状态基石。其实现依赖于 Fiber 节点上的 memoizedState 链表，Hooks 按调用顺序存储在链表中，因此必须在组件顶层调用，不能放在条件语句或循环中。

` + '```' + `tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // ❌ 闭包陷阱：两次更新基于同一个闭包中的旧 count
  const wrongClick = () => {
    setCount(count + 1);
    setCount(count + 1); // count 只 +1！
  };

  // ✅ 函数式更新：prev 始终指向最新值
  const correctClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // count +2
  };

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={correctClick}>+2</button>
    </div>
  );
}
` + '```' + `

**React 18 Automatic Batching：** React 18 之前，仅在 React 事件处理函数中的状态更新会被批处理。React 18 通过 createRoot API 实现了所有场景（setTimeout、Promise、原生事件）的自动批处理。这意味着一次事件循环中的所有状态更新会被合并为一次渲染。

**懒初始化：** 当初始状态计算开销大时，传入函数而非直接值：

` + '```' + `tsx
// expensiveComputation 只在首次渲染时执行
const [state, setState] = useState(() => expensiveComputation());

// expensiveComputation 每次渲染都执行（浪费）
const [state, setState] = useState(expensiveComputation());
` + '```' + `

## useEffect 依赖数组与清理函数

useEffect 用于处理副作用：数据请求、订阅、DOM 操作。

` + '```' + `tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(` + '`' + `/api/users/` + '${userId}' + ` + '`' + `)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      });

    // 清理函数：在下次 effect 执行前或组件卸载时调用
    return () => { cancelled = true; };
  }, [userId]); // userId 变化时重新执行

  if (loading) return <div>加载中...</div>;
  return <div>{user?.name}</div>;
}
` + '```' + `

**useEffect vs useLayoutEffect：**
- useEffect：浏览器完成布局和绘制后异步执行，不阻塞渲染，适合数据请求和订阅
- useLayoutEffect：DOM 变更后、浏览器绘制前同步执行，适合需要同步测量 DOM 尺寸并及时调整的场景（防止闪烁）

**Strict Mode 下的行为：** React 18 开发模式下会执行两次 effect（setup → cleanup → setup），帮助暴露没有正确清理副作用的 bug。

## useRef 的三大核心用途

useRef 返回一个在组件整个生命周期中引用不变的对象，修改 .current 不触发重渲染。

` + '```' + `tsx
import { useRef, useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  // 用途 1：引用 DOM 元素
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => inputRef.current?.focus();

  // 用途 2：存储可变值（不触发重渲染），如定时器 ID
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // 用途 3：解决 useEffect 闭包陷阱——ref 总能获取最新值
  const latestCount = useRef(count);
  latestCount.current = count;
  useEffect(() => {
    const id = setInterval(() => {
      console.log('最新 count:', latestCount.current);
    }, 2000);
    return () => clearInterval(id);
  }, []); // 空依赖 + ref = 闭包陷阱解决方案

  return (
    <div>
      <input ref={inputRef} placeholder="输入内容" />
      <button onClick={handleFocus}>聚焦输入框</button>
      <p onClick={() => setCount(c => c + 1)}>计时: {count} 秒</p>
    </div>
  );
}
` + '```' + `

**useRef vs createRef：** useRef 在每次渲染时返回同一对象引用；createRef 每次渲染创建新对象。函数组件必须用 useRef。` + '`' + `.current` + '`' + ` 的修改不会触发重渲染，这使得 useRef 成为存储不参与渲染的可变值的理想容器。

**总结：**
1. useState：异步批处理，函数式更新避免闭包陷阱，懒初始化优化性能
2. useEffect：异步副作用处理，清理函数防止内存泄漏和竞态条件
3. useRef：持久化可变引用，不触发渲染，桥接闭包与最新值、操作 DOM
`,
    },
    {
      id: "react-02",
      title: "虚拟 DOM Diff 算法与 Fiber 架构深度剖析",
      tags: ["React", "虚拟DOM", "Fiber"],
      excerpt: "从虚拟 DOM 设计动机到 Diff 三策略再到 Fiber 可中断渲染引擎，全面理解 React 渲染核心",
      content: `
## 虚拟 DOM 的设计动机

直接操作真实 DOM 代价高昂——每次修改可能触发浏览器的样式计算、布局和绘制。虚拟 DOM 作为 JavaScript 层面的轻量抽象，将多次 DOM 操作合并为一次高效的批量更新。

` + '```' + `javascript
// 虚拟 DOM 节点（简化表示）
const vnode = {
  type: 'div',
  key: null,
  props: {
    className: 'container',
    children: [
      { type: 'h1', props: { children: '标题' } },
      { type: 'p',  props: { children: '段落' } }
    ]
  }
};
` + '```' + `

**核心价值三角：**
- 声明式编程：描述 UI "应该长什么样"，React 负责"如何变成那样"
- 跨平台抽象：虚拟 DOM 可映射到 Web DOM、React Native、Canvas、终端等多种渲染目标
- 批量更新：将状态变更收集起来，一次性计算最小 DOM 操作集合

## Diff 算法的三个前提策略

完全比较两棵树的复杂度是 O(n` + '³' + `)，不可接受。React 基于三个前提假设将 Diff 优化到 O(n)：

**策略一：Tree Diff（同层比较）**
React 只对同一层级的节点进行比较。如果发现 DOM 节点跨层级移动（如从父节点 A 移到父节点 B），React 不会尝试复用，而是直接删除旧节点并在新位置创建新节点。这牺牲了部分灵活性换来巨大的性能提升。

**策略二：Component Diff（同类型才比较）**

` + '```' + `tsx
// 类型相同 → 按策略比较，复用组件实例
<Counter initial={1} />  →  <Counter initial={2} />

// 类型不同 → 直接卸载旧组件、挂载新组件，子树全部重建
{isLoggedIn ? <Dashboard /> : <LoginPage />}
` + '```' + `

**策略三：Element Diff（key 决定一切）**

` + '```' + `tsx
// ❌ 用 index 做 key：列表头部插入时所有元素 key 都变 → 全部重新渲染
{items.map((item, index) => <Item key={index} data={item} />)}

// ✅ 用稳定唯一 ID：React 通过 key 准确识别新增/删除/移动
{items.map(item => <Item key={item.id} data={item} />)}
` + '```' + `

**key 三原则：** 唯一（兄弟节点间不重复）、稳定（跨渲染周期不变）、可预测（不要 Math.random()）。

## Fiber 架构：可中断的并发渲染引擎

React 15 的 Stack Reconciler 使用递归同步遍历虚拟 DOM 树，一旦开始无法中断。当组件树复杂时，主线程被长时间占用（超过 16ms），导致掉帧和交互卡顿。

React 16+ 的 Fiber Reconciler 核心创新：时间切片（Time Slicing）+ 优先级调度（Lane Model）。

**Fiber 节点结构（链表树）：**

` + '```' + `javascript
{
  type: 'div',           // 组件类型
  tag: 5,                // 节点类型标识
  key: null,             // Diff 用
  stateNode: domElement, // 对应真实 DOM

  // 链表结构：child → 第一个子节点，sibling → 下一个兄弟，return → 父节点
  child:  firstChildFiber,
  sibling: nextSiblingFiber,
  return:  parentFiber,

  // 双缓存机制
  alternate: oldFiber,   // 指向另一棵树中对应节点

  // 工作相关
  memoizedState: null,   // Hooks 链表（函数组件）
  memoizedProps: {},     // 已生效的 props
  pendingProps: {},      // 新的 props
  updateQueue: null,     // 状态更新队列

  // 副作用标记
  effectTag: 0,          // Placement / Update / Deletion 等
  nextEffect: null,      // 副作用链表
}
` + '```' + `

**双缓存（Double Buffering）：** React 同时维护两棵 Fiber 树——current（当前屏幕对应的树）和 workInProgress（正在内存中构建的新树）。两棵树中的对应节点通过 alternate 指针互指。新树构建完成后，React 原子性地切换 root.current 指针，实现无缝过渡。

**两阶段渲染：**

` + '```' + `javascript
// Render 阶段（可中断/恢复，纯计算，无副作用）
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // 剩余时间 < 1ms 暂停
  }
  if (!nextUnitOfWork && pendingCommit) commitRoot();
  requestIdleCallback(workLoop);
}

// Commit 阶段（不可中断，同步执行）：
// beforeMutation → mutation（DOM 变更）→ layout（生命周期/useLayoutEffect）
` + '```' + `

**Lane 优先级模型：** 不同更新分配不同 Lane（车道）。用户交互（点击、输入）高优先级，数据请求更新低优先级。高优先级更新可打断低优先级更新的 Render 阶段。Scheduler 包负责优先级调度和过期时间管理。

**总结：** 虚拟 DOM + Diff 让 React 拥有声明式编程体验；Fiber + Scheduler 让 React 实现并发渲染（Concurrent Features），在保证 UI 流畅响应的同时高效处理大量更新。
`,
    },
  ],
};

"""

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "w", encoding="utf-8") as f:
    f.write(out)

print("File written, length:", len(out))
