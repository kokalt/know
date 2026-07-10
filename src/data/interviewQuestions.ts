export interface InterviewQuestion {
  id: string;
  title: string;
  category: string;
  difficulty: "简单" | "中等" | "困难";
  content: string;
  answer: string;
  tags: string[];
  date: string;
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "1",
    title: "什么是闭包？请举例说明",
    category: "JavaScript",
    difficulty: "中等",
    content: "请解释JavaScript中闭包的概念，并给出一个实际应用场景。",
    answer: `闭包是指有权访问另一个函数作用域中变量的函数。

**核心特点：**
1. 函数嵌套函数
2. 内部函数可以访问外部函数的变量
3. 外部函数的变量不会被垃圾回收

**示例：**
\`\`\`javascript
function createCounter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

**应用场景：**
- 数据封装和私有变量
- 函数柯里化
- 防抖节流实现
- 模块模式`,
    tags: ["JavaScript", "闭包", "作用域"],
    date: "2026-06-08",
  },
  {
    id: "2",
    title: "React中的key有什么作用？",
    category: "React",
    difficulty: "简单",
    content: "在React列表渲染中，为什么需要给每个元素添加key属性？",
    answer: `key是React用于识别哪些元素发生了变化、被添加或被删除的特殊属性。

**作用：**
1. **高效更新**：帮助React识别哪些元素需要重新渲染
2. **保持状态**：确保组件状态正确对应到正确的元素
3. **性能优化**：减少不必要的DOM操作

**最佳实践：**
- 使用稳定的唯一标识作为key
- 避免使用索引作为key（特别是列表会变化的情况）
- key应该在同级元素中唯一

**错误示例：**
\`\`\`jsx
// 不推荐：使用索引
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// 推荐：使用唯一ID
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
\`\`\``,
    tags: ["React", "性能优化", "虚拟DOM"],
    date: "2026-06-07",
  },
  {
    id: "3",
    title: "CSS盒模型有哪些类型？",
    category: "CSS",
    difficulty: "简单",
    content: "请解释标准盒模型和IE盒模型的区别。",
    answer: `CSS有两种盒模型：标准盒模型和IE盒模型（替代盒模型）。

**标准盒模型（content-box）：**
- width/height只包含内容区域
- 总宽度 = width + padding + border + margin

**IE盒模型（border-box）：**
- width/height包含内容、padding和border
- 总宽度 = width + margin

**切换方式：**
\`\`\`css
/* 标准盒模型（默认） */
box-sizing: content-box;

/* IE盒模型 */
box-sizing: border-box;
\`\`\`

**推荐使用border-box：**
\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

这样设置后，元素的width和height就是最终显示的大小，更容易控制布局。`,
    tags: ["CSS", "盒模型", "布局"],
    date: "2026-06-06",
  },
  {
    id: "4",
    title: "如何实现防抖和节流？",
    category: "JavaScript",
    difficulty: "中等",
    content:
      "请分别实现防抖（debounce）和节流（throttle）函数，并说明它们的区别和应用场景。",
    answer: `**防抖（Debounce）：**
在事件被触发n秒后再执行回调，如果n秒内又被触发，则重新计时。

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;

  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用场景：搜索框输入、窗口resize
const handleSearch = debounce((value) => {
  console.log('搜索:', value);
}, 300);
\`\`\`

**节流（Throttle）：**
规定在一个单位时间内，只能触发一次函数。

\`\`\`javascript
function throttle(fn, delay) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用场景：滚动事件、鼠标移动
const handleScroll = throttle(() => {
  console.log('滚动');
}, 200);
\`\`\`

**区别：**
- 防抖：最后一次触发后等待delay时间执行
- 节流：每隔delay时间执行一次`,
    tags: ["JavaScript", "性能优化", "事件处理"],
    date: "2026-06-05",
  },
  {
    id: "5",
    title: "TypeScript中的interface和type有什么区别？",
    category: "TypeScript",
    difficulty: "中等",
    content: "请说明interface和type的异同点，以及在什么场景下选择使用哪一个。",
    answer: `**相同点：**
- 都可以描述对象形状
- 都可以被类实现
- 都支持扩展

**不同点：**

| 特性 | interface | type |
|------|-----------|------|
| 声明合并 | ✅ 支持 | ❌ 不支持 |
| 联合类型 | ❌ 不支持 | ✅ 支持 |
| 元组类型 | ❌ 不支持 | ✅ 支持 |
| 基本类型别名 | ❌ 不支持 | ✅ 支持 |

**interface示例：**
\`\`\`typescript
interface User {
  name: string;
  age: number;
}

// 声明合并
interface User {
  email: string;
}
// 结果：{ name: string; age: number; email: string }
\`\`\`

**type示例：**
\`\`\`typescript
type Status = 'success' | 'error' | 'loading';
type Point = [number, number];
type ID = string | number;
\`\`\`

**选择建议：**
- 定义对象形状时优先使用interface
- 需要联合类型、元组时使用type
- 库作者通常使用interface以便用户扩展`,
    tags: ["TypeScript", "类型系统", "接口"],
    date: "2026-06-04",
  },
  {
    id: "6",
    title: "Vue3 Composition API相比Options API有什么优势？",
    category: "Vue",
    difficulty: "中等",
    content: "请分析Vue3 Composition API的设计理念和实际优势。",
    answer: `**Composition API的优势：**

1. **更好的逻辑复用**
   - 可以将相关逻辑组织在一起
   - 易于提取为可复用的组合式函数

2. **更好的TypeScript支持**
   - 类型推导更自然
   - 不需要额外的类型声明

3. **更灵活的代码组织**
   - 按功能而非选项类型组织代码
   - 大型组件更易维护

**对比示例：**

\`\`\`typescript
// Options API
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};

// Composition API
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const increment = () => count.value++;

    return { count, increment };
  }
};
\`\`\`

**组合式函数示例：**
\`\`\`typescript
// useCounter.ts
export function useCounter() {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
}

// 在组件中使用
const { count, increment } = useCounter();
\`\`\``,
    tags: ["Vue", "Composition API", "代码组织"],
    date: "2026-06-03",
  },
];

export const questionCategories = [
  "全部",
  "JavaScript",
  "React",
  "CSS",
  "TypeScript",
  "Vue",
];

export const difficultyLevels = [
  { value: "全部", label: "全部难度" },
  { value: "简单", label: "简单" },
  { value: "中等", label: "中等" },
  { value: "困难", label: "困难" },
];
