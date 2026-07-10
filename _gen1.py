# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

C1 = """
export const reactData = {
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
## useState 批量更新与闭包陷阱

useState 是 React 函数组件的状态基石。实现依赖于 Fiber 节点上的 memoizedState 链表。

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // 闭包陷阱：两次更新基于同一个旧值 → count 只 +1
  const wrong = () => {
    setCount(count + 1);
    setCount(count + 1);
  };

  // 函数式更新：prev 始终是最新值 → count +2
  const correct = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return <button onClick={correct}>计数: {count}</button>;
}
\`\`\`

React 18 的 Automatic Batching：在 React 18 之前，仅 React 事件处理函数中的更新被批量处理。React 18 通过 createRoot 实现了所有场景（setTimeout、Promise、原生事件）的自动批处理，减少不必要的重渲染。

懒初始化：当初始状态计算昂贵时，传入函数让 React 只在首次渲染时计算：

\`\`\`tsx
const [state, setState] = useState(() => expensiveComputation());
// expensiveComputation 只在首次渲染执行
\`\`\`

## useEffect 依赖与清理

useEffect 处理副作用：数据请求、订阅、DOM 操作。理解清理函数至关重要。

\`\`\`tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setUser(data);
      });
    // 清理函数：下次执行前或卸载时调用
    return () => { cancelled = true; };
  }, [userId]);

  return <div>{user?.name ?? '加载中...'}</div>;
}
\`\`\`

useEffect 在浏览器布局和绘制后异步执行。useLayoutEffect 在 DOM 变更后、浏览器绘制前同步执行，适合同步测量 DOM 并立即调整的场景。

## useRef 的三大用途

useRef 返回一个在组件整个生命周期中引用不变的对象，修改 .current 不触发重渲染。

\`\`\`tsx
import { useRef, useState, useEffect } from 'react';

function Demo() {
  // 用途 1：DOM 引用
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = () => inputRef.current?.focus();

  // 用途 2：存储可变值（定时器 ID 等），不触发渲染
  const timerRef = useRef<number | null>(null);

  // 用途 3：解决 useEffect 闭包陷阱
  const latestCount = useRef(0);
  const [count, setCount] = useState(0);
  latestCount.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      console.log('最新 count:', latestCount.current);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focus}>聚焦</button>
      <p onClick={() => setCount(c => c + 1)}>count: {count}</p>
    </div>
  );
}
\`\`\`

**核心要点：**
1. useState 异步批处理，函数式更新避免闭包陷阱
2. useEffect 清理函数防止内存泄漏、竞态条件
3. useRef 持久引用不变，不触发渲染，桥接闭包与最新值
`,
    },
  ],
};

"""

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "w", encoding="utf-8") as f:
    f.write(C1)

print("Part 1 ok, length:", len(C1))
