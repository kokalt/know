import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowLeft, FaArrowUp, FaBookOpen, FaFileCode, FaLightbulb } from "react-icons/fa";
import { MobileCategoryDrawer } from "@/components/generated/MobileCategoryDrawer";
import { designPatternsData } from "@/data/knowledge/design-patterns";
import { pythonData } from "@/data/knowledge/python";
import { jsReverseData } from "@/data/knowledge/js-reverse";
import { postgresqlData } from "@/data/knowledge/postgresql";
import { k8sCommandsData } from "@/data/knowledge/k8s-commands";
import { linuxCommandsData } from "@/data/knowledge/linux-commands";
import { gitData } from "@/data/knowledge/git";
import {
  reactData,
  browserData,
  typescriptData,
  cssData,
  htmlData,
  nodejsData,
  networkData,
  securityData,
  engineeringData,
  miniprogramData,
  performanceData,
} from "@/data/knowledge/inline-categories";

export interface SubTopic {
  id: string;
  title: string;
  excerpt: string;
  codeExample: string;
  fullContent: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  date?: string;
  tags: string[];
  excerpt: string;
  content: string;
  subTopics: SubTopic[];
}

export interface KnowledgeData {
  name: string;
  description: string;
  icon: string;
  items: Omit<KnowledgeItem, "subTopics">[];
}

function parseSubTopics(content: string, articleId: string): SubTopic[] {
  const subTopics: SubTopic[] = [];
  const sections = content.split(/^## /m).filter(Boolean);

  sections.forEach((section, index) => {
    const lines = section.split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();

    if (title && body) {
      const codeMatch = body.match(/```[\s\S]*?```/);
      const codeExample = codeMatch ? codeMatch[0] : "";

      const textContent = body
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\|.+\|/g, "")
        .trim();
      const firstPara = textContent.split("\n").find((line) => line.trim().length > 0) || "";
      const excerpt =
        firstPara.length > 120 ? firstPara.slice(0, 120) + "..." : firstPara;

      const id = `${articleId}-st-${String(index + 1).padStart(2, "0")}`;

      subTopics.push({
        id,
        title,
        excerpt: excerpt || title,
        codeExample,
        fullContent: `## ${section.trim()}`,
      });
    }
  });

  return subTopics;
}

export interface KnowledgeDataWithSubTopics {
  name: string;
  description: string;
  icon: string;
  items: KnowledgeItem[];
}

const rawDataSources: Record<string, KnowledgeData> = {
  react: reactData as KnowledgeData,
  javascript: {
    name: "JavaScript 系列知识点",
    description: "JS 基础、原型链、闭包、异步编程等核心知识",
    icon: "JS",
    items: [
      {
        id: "js-01",
        title: "闭包原理、应用场景与内存泄漏防范",
        tags: ["JavaScript", "闭包", "作用域"],
        excerpt: "通过经典面试题深入理解闭包的概念、形成条件、实际应用场景以及内存泄漏问题",
        content:
`## 什么是闭包？

函数 + 其能访问的外部词法环境 = 闭包

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() { count++; return count; };
}
const c = createCounter();
c(); // 1 — 内部函数保持对 createCounter 作用域的引用
c(); // 2
\`\`\`

**闭包的形成条件：** ① 函数嵌套 ② 内部函数引用外部函数的变量 ③ 内部函数被返回/传出（外部可调用）

## 作用域链与执行上下文

\`\`\`javascript
const globalVar = "global";
function outer() {
  const outerVar = "outer";
  function inner() {
    const innerVar = "inner";
    console.log(innerVar, outerVar, globalVar); // 沿作用域链向上查找
  }
  return inner;
}
const fn = outer(); // outer 执行完毕，但其变量对象因闭包依然存在
fn(); // "inner outer global"
\`\`\`

## 四大应用场景

\`\`\`javascript
// ① 私有变量 / 数据封装
function createBank(init) {
  let money = init;                                       // 外部无法直接访问
  return {
    deposit(v)  { money += v; return money; },
    withdraw(v) { if(v>money) throw Error("余额不足"); money-=v; return money; },
    get()       { return money; },
  };
}

// ② 函数柯里化（参数复用）
function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
  };
}

// ③ 防抖（debounce）— 高频事件只执行最后一次
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
}

// ④ 模块模式（IIFE + 闭包）
const Counter = (function() {
  let count = 0;
  return { inc() { count++; }, get() { return count; } };
})();
Counter.inc(); Counter.get(); // 1
\`\`\`

## 经典陷阱与防护

\`\`\`javascript
// 陷阱1：循环中的 var + 闭包
for (var i = 0; i < 5; i++) { setTimeout(() => console.log(i), 100); } // 5个5
// 修复方案：
for (let i = 0; i < 5; i++) { setTimeout(() => console.log(i), 100); } // 0 1 2 3 4（let 块级作用域）

// 陷阱2：闭包导致大对象无法 GC → 内存泄漏
function leak() {
  const bigData = new Array(1_000_000).fill("x");
  return () => console.log(bigData.length); // bigData 永久驻留
}
// 修复：用完后将引用设为 null
\`\`\``,
      },
      {
        id: "js-02",
        title: "var / let / const 区别与暂时性死区（TDZ）",
        tags: ["JavaScript", "ES6", "变量声明"],
        excerpt: "深入理解三种变量声明的核心区别：作用域、提升、暂时性死区",
        content:
`## 核心对比表

| | var | let | const |
|---|---|---|---|
| 作用域 | 函数级 | 块级 {} | 块级 {} |
| 重复声明 | ✅ 允许 | ❌ 报错 | ❌ 报错 |
| 重新赋值 | ✅ | ✅ | ❌ |
| 变量提升 | ✅ 初始化为 undefined | 提升但不初始化（TDZ） | 提升但不初始化 |
| 必须初始化 | ❌ | ❌ | ✅ |

## 作用域差异

\`\`\`javascript
// var — 没有块级作用域
{ var x = 10; }
console.log(x); // 10

// let/const — 块级作用域
{ let y = 20; }
console.log(y); // ReferenceError

// 循环中的关键区别
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)); } // 3 3 3
for (let j = 0; j < 3; j++) { setTimeout(() => console.log(j)); } // 0 1 2
\`\`\`

## 暂时性死区（TDZ）

\`\`\`javascript
// var — 预初始化为 undefined
console.log(a); // undefined（不报错）
var a = 10;

// let/const — TDZ：从作用域开始到声明之间的区域访问会报错
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 20;
\`\`\`

## const 不是真正的常量

\`\`\`javascript
const obj = { name: "Alice" };
obj.name = "Bob";     // ✅ 可以修改属性！
obj.age = 25;         // ✅ 可以新增属性！
// obj = {};          // ❌ 不能重新赋值

// 真正冻结对象
const frozen = Object.freeze({ name: "Alice" });
frozen.name = "Bob";  // 严格模式报错，非严格静默失败
\`\`\``,
      },
      {
        id: "js-03",
        title: "原型链与继承：prototype / __proto__ / class",
        tags: ["JavaScript", "原型链", "继承"],
        excerpt: "彻底搞懂原型链的本质，手写 new 和各种继承方式",
        content:
`## 原型链核心概念

\`\`\`javascript
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { console.log("Hi, " + this.name); };

const p = new Person("Alice");
p.sayHi(); // "Hi, Alice"

// 链式关系：
// p.__proto__  →  Person.prototype
// Person.prototype.__proto__  →  Object.prototype
// Object.prototype.__proto__  →  null
// 这就是原型链！实例查找属性时沿着 __proto__ 一路向上
\`\`\`

## 手写 new 操作符

\`\`\`javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // ① 建立原型链
  const ret = Constructor.apply(obj, args);          // ② 执行构造函数
  return ret instanceof Object ? ret : obj;          // ③ 处理返回值
}
\`\`\`

## 继承方式演进

\`\`\`javascript
// ① 原型链继承 — 共享引用类型问题
function Parent() { this.colors = ["red"]; }
function Child() {}
Child.prototype = new Parent();
const c1 = new Child(), c2 = new Child();
c1.colors.push("blue"); // c2.colors 也变了！

// ② 组合继承（最常用）— 调用两次父构造
function Child(name) { Parent.call(this, name); }    // 继承属性
Child.prototype = Object.create(Parent.prototype);    // 继承方法
Child.prototype.constructor = Child;                  // 修复 constructor

// ③ class 语法（ES6）— 底层仍是原型链
class Parent { constructor(name) { this.name = name; } }
class Child extends Parent {
  constructor(name, age) { super(name); this.age = age; }
}
\`\`\`

## instanceof 原理

\`\`\`javascript
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
// 本质：沿着 obj.__proto__ 链查找，看是否会等于 Constructor.prototype
\`\`\``,
      },
      {
        id: "js-04",
        title: "数据类型检测：typeof / instanceof / Object.prototype.toString",
        tags: ["JavaScript", "数据类型", "检测"],
        excerpt: "JavaScript 8 种数据类型全面解析，外加 typeof 陷阱与正确检测方法",
        content:
`## 8 种数据类型

原始类型(7)：string、number、boolean、undefined、null、symbol、bigint
引用类型(1)：object（含 Array、Date、RegExp、Function、Map、Set 等）

## typeof 经典陷阱

\`\`\`javascript
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof Symbol()     // "symbol"
typeof 123n         // "bigint"
typeof {}           // "object"
typeof []           // "object"   ⚠️ 无法区分数组
typeof null         // "object"   ⚠️ 历史遗留 bug！
typeof function(){} // "function" ⚠️ 函数是 object 但 typeof 特殊处理
\`\`\`

## 正确检测方法

\`\`\`javascript
// ① 数组 — Array.isArray
Array.isArray([]); // true

// ② null — 严格相等
value === null

// ③ NaN — Number.isNaN（不会做类型转换）
Number.isNaN(NaN);    // true
Number.isNaN("abc");  // false（推荐）
isNaN("abc");         // true（先 Number("abc")→NaN）

// ④ 万能方法 — Object.prototype.toString
function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
getType([]);       // "array"
getType(null);     // "null"
getType(new Date());// "date"
getType(/a/);      // "regexp"
\`\`\`

## == vs ===

\`\`\`javascript
// == 会做类型转换（不要用！）
0 == ""            // true
0 == "0"           // true
false == ""        // true
null == undefined  // true（特例）
// === 严格相等，推荐
\`\`\``,
      },
      {
        id: "js-05",
        title: "JS 异步编程：回调、Promise、async/await 演进",
        tags: ["JavaScript", "异步", "Promise"],
        excerpt: "从回调地狱到 async/await，梳理 JS 异步编程的完整演进路径",
        content:
`## 回调地狱 → Promise

\`\`\`javascript
// ❌ 回调地狱——意大利面条
getUser(id, user => {
  getPosts(user.id, posts => {
    getComments(posts[0].id, comments => {
      console.log(comments); // 3 层嵌套，错误处理困难
    });
  });
});

// ✅ Promise 链式调用
getUser(id)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(console.log)
  .catch(err => console.error("任一环节出错都会被捕获")); // 统一错误处理！\`\`\`

## 宏任务 vs 微任务

\`\`\`javascript
// 宏任务：setTimeout, setInterval, I/O, UI rendering
// 微任务：Promise.then, MutationObserver, queueMicrotask

console.log(1);
setTimeout(() => console.log(2));    // 宏任务
Promise.resolve().then(() => console.log(3)); // 微任务
console.log(4);
// 输出：1→4→3→2
// 每个宏任务执行后清空微任务队列，微任务先于下一个宏任务
\`\`\`

## async/await 错误处理

\`\`\`javascript
async function loadData() {
  try {
    const user = await fetchUser();  // 等待 Promise resolve
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error("加载失败", err);     // 统一捕获
    return null;
  }
}

// Promise.all — 并行请求
const [users, articles] = await Promise.all([fetchUsers(), fetchArticles()]);

// Promise.allSettled — 全完成后拿结果（不因一个失败而中断）
const results = await Promise.allSettled([p1, p2, p3]);
\`\`\``,
      },
      {
        id: "js-06",
        title: "箭头函数与普通函数的区别",
        tags: ["JavaScript", "箭头函数", "this"],
        excerpt: "从 this 绑定、arguments、构造函数、原型等维度全面对比箭头函数与普通函数",
        content:
`## 七大核心区别

\`\`\`javascript
// === ① this 绑定 ===
// 普通函数：this 由调用方式决定（动态）
const obj1 = {
  name: "Alice",
  greet: function() { console.log(this.name); },
};
obj1.greet();           // "Alice"（隐式绑定）
const fn = obj1.greet;
fn();                   // undefined（默认绑定）

// 箭头函数：没有自己的 this，从定义时的外层作用域继承（静态）
const obj2 = {
  name: "Bob",
  greet: () => console.log(this.name), // this = window / undefined
};
obj2.greet();           // undefined（外层 this 不是 obj2）

// === ② 不能作为构造函数 ===
const Person = (name) => { this.name = name; };
// new Person("Alice");  // ❌ TypeError: Person is not a constructor

// === ③ 没有 prototype 属性 ===
const fn1 = () => {};
console.log(fn1.prototype); // undefined

// === ④ 没有自己的 arguments ===
const regular = function() { console.log(arguments); };
regular(1, 2, 3); // Arguments(3) [1, 2, 3]

const arrow = () => console.log(arguments);
// arrow(1, 2, 3);  // ❌ ReferenceError: arguments is not defined

// 箭头函数获取 arguments 的方法：用 rest 参数
const arrow2 = (...args) => console.log(args); // [1, 2, 3]

// === ⑤ 不能用作 Generator 函数 ===
// 箭头函数不能使用 yield 关键字

// === ⑥ 简写语法 ===
const add = (a, b) => a + b;           // 单行省略 return
const greet = name => \`Hi \${name}\`;      // 单个参数省略括号
const getObj = () => ({ key: "val" }); // 返回对象字面量要加括号

// === ⑦ 不绑定 super ===
// 箭头函数不能用于需要 super 的类方法
\`\`\`

## 实际场景选择

\`\`\`javascript
// ✅ 箭头函数 — 回调/闭包中保持外层 this
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    setInterval(() => { this.seconds++; }, 1000); // this = Timer 实例 ✅
    // setInterval(function() { this.seconds++; }, 1000); // this = window ❌
  }
}

// ✅ 箭头函数 — 数组方法回调
items.map(item => item.name);
arr.filter(x => x > 0);

// ✅ 普通函数 — 对象方法（需要 this 指向该对象）
const user = {
  name: "Alice",
  // ❌ greet: () => console.log(this.name),  // this 不是 user
  greet() { console.log(this.name); },          // ✅ 方法简写
};

// ✅ 普通函数 — 构造函数 / 需要 prototype / 需要 arguments
\`\`\`

**口诀：** 需要自己的 this → 普通函数；想继承外层 this → 箭头函数；构造函数/原型必须用普通函数。`,

      },
      {
        id: "js-07",
        title: "call / apply / bind 的区别与手写实现",
        tags: ["JavaScript", "this", "手写"],
        excerpt: "深入理解三种改变 this 指向的方法，逐行手写实现并掌握应用场景",
        content:
`## 三者的区别

\`\`\`javascript
function greet(msg, punctuation) {
  console.log(\`\${msg}, \${this.name}\${punctuation}\`);
}
const user = { name: "Alice" };

// call — 逐个传参，立即执行
greet.call(user, "Hello", "!"); // "Hello, Alice!"

// apply — 数组传参，立即执行
greet.apply(user, ["Hello", "!"]); // "Hello, Alice!"

// bind — 返回新函数，永久绑定 this，可延迟调用
const boundGreet = greet.bind(user, "Hello"); // 可预填参数
boundGreet("!"); // "Hello, Alice!"
\`\`\`

## 手写 call

\`\`\`javascript
Function.prototype.myCall = function(context, ...args) {
  context = context == null ? globalThis : Object(context);
  const key = Symbol("fn");         // 唯一 key，避免覆盖原有属性
  context[key] = this;              // 把函数临时挂到 context 上
  const result = context[key](...args); // 执行 → this = context
  delete context[key];              // 清理痕迹
  return result;
};
\`\`\`

## 手写 apply

\`\`\`javascript
Function.prototype.myApply = function(context, args) {
  context = context == null ? globalThis : Object(context);
  const key = Symbol("fn");
  context[key] = this;
  const result = context[key](...(args || []));
  delete context[key];
  return result;
};
\`\`\`

## 手写 bind

\`\`\`javascript
Function.prototype.myBind = function(context, ...preArgs) {
  const fn = this; // 保存原函数
  return function bound(...args) {
    // 如果 bound 被 new 调用，this 指向新实例，忽略 bind 绑定的 context
    return fn.apply(
      this instanceof bound ? this : context,
      preArgs.concat(args),
    );
  };
};
// 注意：原生 bind 返回的函数没有 prototype，但有 length 和 name
\`\`\`

## 常见面试场景

\`\`\`javascript
// ① 数组最大值（Math.max 内部不依赖 this）
Math.max.apply(null, [1, 5, 3]); // 5

// ② 把类数组转为数组
Array.prototype.slice.call(document.querySelectorAll("div"));
// 现在推荐用 Array.from

// ③ 事件处理中绑定 this
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this); // 永久绑定
  }
  handleClick(e) { console.log(this); } // 始终指向 Component 实例
}
\`\`\``,

      },
      {
        id: "js-08",
        title: "深浅拷贝的区别与手写实现",
        tags: ["JavaScript", "深浅拷贝", "手写"],
        excerpt: "彻底搞懂赋值、浅拷贝、深拷贝的本质区别，手写深拷贝处理循环引用",
        content:
`## 赋值 vs 浅拷贝 vs 深拷贝

\`\`\`javascript
const obj = { name: "Alice", info: { age: 25 } };

// ① 赋值：复制引用 → 改一处全变
const ref = obj;
ref.name = "Bob";        // obj.name 也变成 "Bob"！

// ② 浅拷贝：只复制第一层 → 嵌套对象共享引用
const shallow = { ...obj }; // 或 Object.assign({}, obj)
shallow.name = "Cathy";     // obj.name 不变 ✅
shallow.info.age = 30;      // obj.info.age 也变成 30！ ❌

// ③ 深拷贝：完全独立 → 互相不影响
const deep = JSON.parse(JSON.stringify(obj));
deep.info.age = 40;        // obj.info.age 不变 ✅

// 但 JSON 方案局限：
// undefined、函数、Symbol → 丢失
// Date → 变字符串 / RegExp → 变 {}
// 循环引用 → 直接报错
const o = {};
o.self = o;
// JSON.stringify(o); // ❌ TypeError: Converting circular structure
\`\`\`

## 浅拷贝 4 种方式

\`\`\`javascript
// ① 展开运算符（最常用）
const copy1 = { ...obj };
const arr1 = [...originalArr];

// ② Object.assign
const copy2 = Object.assign({}, obj);

// ③ 数组 slice / concat
const arr2 = arr.slice();
const arr3 = [].concat(arr);

// ④ 手写浅拷贝
function shallowClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) clone[key] = obj[key];
  }
  return clone;
}
\`\`\`

## 手写深拷贝（处理循环引用 + 特殊对象）

\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date)   return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (typeof obj === "function") return obj; // 函数不深拷贝
  if (map.has(obj)) return map.get(obj); // 循环引用 → 返回已拷贝的

  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone);

  // Reflect.ownKeys 包含 Symbol 属性
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], map);
  });
  return clone;
}

// 测试循环引用
const a = { name: "a" };
a.self = a;
const b = deepClone(a);
console.log(b.self === b); // true，正确处理循环引用
\`\`\`

## 第三方方案

\`\`\`javascript
// lodash cloneDeep（最稳健）
import { cloneDeep } from "lodash";

// structuredClone（浏览器原生，支持循环引用、Date、Map、Set 等）
const copy = structuredClone(obj);
// 不支持函数、Symbol、DOM 节点
\`\`\``,

      },
      {
        id: "js-09",
        title: "防抖（debounce）与节流（throttle）的原理与手写",
        tags: ["JavaScript", "防抖", "节流", "手写"],
        excerpt: "理解防抖与节流的本质区别、应用场景，手写完整实现并处理 this 和参数",
        content:
`## 一句话区别

防抖：连续触发只执行最后一次（搜索框输入）
节流：固定时间间隔最多执行一次（滚动事件、按钮点击）

## 手写防抖（基础版 + 立即执行版）

\`\`\`javascript
// 基础版：停止触发 N 毫秒后才执行
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 立即执行版：第一次立即执行，之后防抖
function debounceLeading(fn, delay = 300, leading = false) {
  let timer = null;
  return function(...args) {
    const callNow = leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; if (!leading) fn.apply(this, args); }, delay);
    if (callNow) fn.apply(this, args);
  };
}
\`\`\`

## 手写节流

\`\`\`javascript
// 时间戳版：第一次立即执行
function throttle(fn, interval = 300) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 定时器版：最后一次也会执行
function throttleTimer(fn, interval = 300) {
  let timer = null;
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, interval);
    }
  };
}
\`\`\`

## 场景对照

\`\`\`javascript
// ✅ 防抖：搜索框输入
input.addEventListener("input", debounce(e => fetch(\`/search?q=\${e.target.value}\`), 300));

// ✅ 防抖：窗口 resize 结束
window.addEventListener("resize", debounce(() => console.log(window.innerWidth), 200));

// ✅ 节流：滚动加载更多
window.addEventListener("scroll", throttle(() => { if (nearBottom()) loadMore(); }, 200));

// ✅ 节流：按钮防重复提交
btn.addEventListener("click", throttle(() => submit(), 2000));
\`\`\``,

      },
      {
        id: "js-10",
        title: "new 操作符原理与构造函数",
        tags: ["JavaScript", "new", "构造函数"],
        excerpt: "手写 new 操作符，理解构造函数、实例、原型之间的关系",
        content:
`## new 做了什么？

\`\`\`
① 创建一个空对象
② 将该对象的 __proto__ 指向构造函数的 prototype
③ 将构造函数的 this 绑定为该对象
④ 执行构造函数代码
⑤ 若构造函数返回对象则用它，否则返回新创建的对象
\`\`\`

## 手写 new

\`\`\`javascript
function myNew(Constructor, ...args) {
  // ① + ②：创建对象并链接原型
  const obj = Object.create(Constructor.prototype);
  // ③ + ④：执行构造函数
  const result = Constructor.apply(obj, args);
  // ⑤：处理返回值
  return result instanceof Object ? result : obj;
}

// 测试
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() { return \`Hi, I'm \${this.name}\`; };

const p = myNew(Person, "Alice", 25);
console.log(p.name);   // "Alice"
console.log(p.greet()); // "Hi, I'm Alice"
console.log(p instanceof Person); // true
\`\`\`

## 构造函数返回值的特殊处理

\`\`\`javascript
function Foo1() { return { x: 1 }; }
new Foo1(); // { x: 1 } — 返回对象 → 使用返回值

function Foo2() { return 42; }
new Foo2(); // Foo2 {} — 返回原始值 → 忽略，返回新实例

function Foo3() { } // 无 return
new Foo3(); // Foo3 {}
\`\`\`

## class 本质是语法糖

\`\`\`javascript
class Person {
  constructor(name) { this.name = name; }
  greet() { return \`Hi, I'm \${this.name}\`; }
}
// typeof Person === "function" — class 底层仍是构造函数
// Person.prototype.greet — 方法定义在原型上
\`\`\``,

      },
      {
        id: "js-11",
        title: "JavaScript 作用域与作用域链",
        tags: ["JavaScript", "作用域", "作用域链"],
        excerpt: "理解词法作用域、块级作用域、作用域链的查找机制和闭包的形成原理",
        content:
`## 三种作用域

\`\`\`javascript
// ① 全局作用域
const globalVar = "global";

// ② 函数作用域
function outer() {
  const outerVar = "outer";
  // ③ 块级作用域（ES6+）
  if (true) {
    const blockVar = "block"; // 只在 {} 内可见
    let blockVar2 = "block2";
  }
  // console.log(blockVar); // ❌ ReferenceError
}
\`\`\`

## 词法作用域（静态作用域）

作用域在代码书写时就确定了，不是运行时确定的。

\`\`\`javascript
const name = "global";
function outer() {
  const name = "outer";
  function inner() {
    console.log(name); // "outer" — 查找定义时的外层，不是调用时的
  }
  inner();
}
outer(); // "outer"
// JS 使用词法作用域，this 除外（this 是动态的）
\`\`\`

## 作用域链

\`\`\`javascript
const a = "global a";
function first() {
  const b = "first b";
  function second() {
    const c = "second c";
    console.log(c, b, a); // 沿作用域链向上查找：second → first → global
  }
  second();
}
first(); // "second c first b global a"

// 查找顺序：自身作用域 → 外层函数作用域 → 外层的外层 → ... → 全局作用域
// 找到即停止
\`\`\`

## var vs let/const 作用域区别

\`\`\`javascript
// var：函数作用域，无块级作用域
{ var x = 10; }
console.log(x); // 10

// let/const：块级作用域
{ let y = 20; }
// console.log(y); // ❌ ReferenceError

// 经典面试题：循环 + setTimeout
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)); }  // 3 3 3
for (let j = 0; j < 3; j++) { setTimeout(() => console.log(j)); }  // 0 1 2
// var i 是全局共享，let j 每次迭代创建新绑定
\`\`\`

## 作用域链与闭包的关系

\`\`\`javascript
function createCounter() {
  let count = 0;               // count 在 createCounter 的作用域中
  return function() {
    count++;                   // 内部函数引用外部作用域的变量
    return count;
  };
}
const counter = createCounter();
counter(); // 1
counter(); // 2
// 闭包 = 函数 + 其保留的外部作用域链
// createCounter 虽已返回，但内部函数仍持有其作用域链的引用
\`\`\``,

      },
      {
        id: "js-12",
        title: "ES6+ 常用新特性汇总",
        tags: ["JavaScript", "ES6", "新特性"],
        excerpt: "快速掌握 ES6-ES2024 中最常用的新特性及其使用场景",
        content:
`## 解构赋值

\`\`\`javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4]; // a=1, b=2, rest=[3,4]
// 对象解构
const { name, age = 18, ...other } = { name: "Alice", job: "Dev" };
// 函数参数解构
function greet({ name, age }) { return \`\${name}, \${age}\`; }
greet({ name: "Bob", age: 30 });
\`\`\`

## 模板字符串

\`\`\`javascript
const user = "Alice";
const msg = \`Hello, \${user}! You have \${unread} messages.\`;
const multiline = \`第一行
第二行
第三行\`; // 保留换行
\`\`\`

## 可选链与空值合并

\`\`\`javascript
// 可选链 ?. — 安全访问深层属性
const city = user?.address?.city;       // 中间任一属性为 null/undefined → undefined
const result = obj.method?.();          // 方法存在才调用
const first = arr?.[0];                 // 数组安全访问

// 空值合并 ?? — 只在 null/undefined 时取默认值
const value = input ?? "默认值";         // input = 0 或 "" 不会被替换！
// || 会把 0、""、false 都当作 falsy → ?? 更精确
\`\`\`

## BigInt & globalThis

\`\`\`javascript
// BigInt：超大整数
const big = 9007199254740993n;
const result = big + 1n; // 超过 Number.MAX_SAFE_INTEGER 也不丢精度

// globalThis：统一获取全局对象（浏览器 window、Node global、Worker self）
console.log(globalThis); // 所有环境通用
\`\`\`

## for...of vs for...in

\`\`\`javascript
const arr = ["a", "b", "c"];

for (const i in arr)  { console.log(i); }   // "0", "1", "2" — 遍历 key/索引
for (const v of arr)  { console.log(v); }   // "a", "b", "c" — 遍历 value/值

const obj = { x: 1, y: 2 };
for (const k in obj)  { console.log(k); }   // "x", "y"
// for (const v of obj) {} // ❌ 普通对象不可迭代
for (const [k, v] of Object.entries(obj)) {} // ✅ 通过 entries 遍历
\`\`\``,

      },
      {
        id: "js-13",
        title: "JavaScript 类型转换与隐式转换",
        tags: ["JavaScript", "类型转换", "隐式转换"],
        excerpt: "掌握显式类型转换方法，理解隐式转换的规则和常见陷阱",
        content:
`## 显式类型转换

\`\`\`javascript
// 转字符串
String(42);            // "42"
(42).toString();       // "42"
String(true);          // "true"
String(null);          // "null"

// 转数字
Number("42");          // 42
Number("42px");        // NaN
parseInt("42px");      // 42（更宽容）
parseFloat("3.14");    // 3.14
+"42";                 // 42（一元加号）

// 转布尔
Boolean(0);            // false
Boolean("");           // false
Boolean(null);         // false
Boolean(undefined);    // false
Boolean(NaN);          // false
Boolean([]);           // true — 空数组是真值！
Boolean({});           // true — 空对象是真值！
!!value;               // 快速转布尔
\`\`\`

## 隐式转换规则

\`\`\`javascript
// === 运算符的隐式转换
"" == 0;              // true — "" → 0
"" == false;          // true — 两边都 → 0
"1" == true;          // true — "1" → 1, true → 1
null == undefined;    // true — 特例！
null == 0;            // false — null 只等于 undefined 和自己
NaN == NaN;           // false — 永远！

// + 运算符 — 有字符串就拼接
1 + "2";              // "12"
"1" + 2;              // "12"
1 + true;             // 2 — true → 1
[] + [];              // "" — 先 toString() → 空串拼接
[] + {};              // "[object Object]"
{} + [];              // 0 — {} 被当作空语句块，+[] → 0

// - * / 运算符 — 全部转数字
"6" - "2";            // 4
"6" * "2";            // 12
"6" / "2";            // 3
\`\`\`

## 对象转原始类型

\`\`\`javascript
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 42;
    if (hint === "string") return "hello";
    return "default";
  },
};
console.log(+obj);         // 42（hint = "number"）
console.log(\`\${obj}\`);     // "hello"（hint = "string"）
console.log(obj + "");     // "default"（hint = "default"）

// 没有 Symbol.toPrimitive 时：
// hint = "string" → toString() → valueOf()
// hint = "number" / "default" → valueOf() → toString()
\`\`\``,

      },
      {
        id: "js-14",
        title: "JavaScript 为什么是单线程的？异步如何实现？",
        tags: ["JavaScript", "单线程", "异步"],
        excerpt: "从浏览器架构理解 JS 单线程的设计原因，以及事件循环如何实现非阻塞异步",
        content:
`## JS 为什么设计成单线程？

JavaScript 诞生之初就为浏览器而生，主要职责是操作 DOM 和响应用户交互。

\`\`\`
假设 JS 是多线程的：
线程 A：删除这个 DOM 节点
线程 B：在这个 DOM 节点上添加文字
→ 浏览器不知道该听谁的 → DOM 操作冲突 → 界面混乱
\`\`\`

**单线程避免了复杂的锁机制和竞态条件**，让 DOM 操作简单可靠。

## 单线程 ≠ 阻塞

\`\`\`javascript
console.log("① 开始");

// 这不是"卡住 2 秒"，而是把回调注册到定时器线程，主线程继续往下
setTimeout(() => console.log("③ 定时器"), 2000);

// 网络请求也不会阻塞
fetch("/api/data").then(res => console.log("④ 数据到了"));

console.log("② 继续执行");
// 输出：①开始 → ②继续 → ④数据到了 → ③定时器
\`\`\`

**代码解释：** JS 引擎自己只需要一个线程跑代码。定时器、网络 I/O、文件读写这些耗时操作交给浏览器内核的其他线程（定时器线程、网络线程），完成后把回调扔回 JS 主线程的任务队列。

## 浏览器架构中的多线程

\`\`\`
浏览器是多进程多线程的：
├── 浏览器主进程
├── 渲染进程（每个标签页一个）
│   ├── JS 引擎线程（执行 JS，一个）
│   ├── GUI 渲染线程（互斥，不能和 JS 同时跑）
│   ├── 事件触发线程（管理任务队列）
│   ├── 定时器线程（setTimeout/setInterval）
│   └── 异步 HTTP 请求线程（fetch/XHR）
├── GPU 进程
└── 网络进程
\`\`\`

**关键：JS 引擎是单线程的，但浏览器提供了多个辅助线程。JS 通过事件循环 + 任务队列实现异步非阻塞。**

## 单线程的弊端与解决方案

\`\`\`javascript
// 弊端：长时间计算会卡住 UI
function heavyTask() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;
  return sum; // 计算期间页面完全冻结，点击无响应
}

// 解决方案①：拆分长任务
function processChunk(items, callback) {
  let i = 0;
  function chunk() {
    const end = Math.min(i + 100, items.length);
    for (; i < end; i++) heavyWork(items[i]);
    if (i < items.length) setTimeout(chunk, 0); // 让出主线程
    else callback();
  }
  chunk();
}

// 解决方案②：Web Worker（真正多线程）
const worker = new Worker("heavy.js");
worker.postMessage(largeData);
worker.onmessage = e => console.log("Worker 完成了！", e.data);
// Worker 运行在独立线程，不阻塞 UI，但不能访问 DOM
\`\`\``,

      },
      {
        id: "js-15",
        title: "JavaScript 事件循环（Event Loop）完整解析",
        tags: ["JavaScript", "事件循环", "异步"],
        excerpt: "从调用栈到任务队列，逐层拆解浏览器事件循环的完整执行流程",
        content:
`## 核心原理图

\`\`\`
┌─────────────────────────────────────────┐
│            调用栈（Call Stack）          │
│  foo() → bar() → baz()  [LIFO 后进先出] │
└────────────┬────────────────────────────┘
             │ 同步代码执行完
             ▼
      清空微任务队列（Microtask Queue）
      Promise.then / MutationObserver / queueMicrotask
             │ 全部清空
             ▼
       取一个宏任务（Macrotask Queue）
       setTimeout / setInterval / I/O / UI事件
             │ 执行该宏任务
             ▼
      （循环回到清空微任务...）
\`\`\`

## 宏任务 vs 微任务的本质区别

\`\`\`javascript
// 宏任务：浏览器提供的能力，每个宏任务之间可能插入一次 UI 渲染
// setTimeout、setInterval、I/O、UI 渲染、postMessage、MessageChannel

// 微任务：JS 引擎自身的能力，当前宏任务执行完后立刻清空
// Promise.then/catch/finally、MutationObserver、queueMicrotask
\`\`\`

## 经典执行顺序

\`\`\`javascript
console.log("1");                    // ① 同步

setTimeout(() => console.log("2")); // ④ 宏任务

new Promise(resolve => {
  console.log("3");                 // ① 同步！executor 同步执行
  resolve();
}).then(() => console.log("4"));   // ③ 微任务

console.log("5");                   // ① 同步

// 输出：1 → 3 → 5 → 4 → 2
// 注意：Promise 的 executor 是同步的，then 才是微任务！
\`\`\`

## 微任务套微任务

\`\`\`javascript
Promise.resolve().then(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B")); // B 在 A 里注册
});
Promise.resolve().then(() => console.log("C"));

// 输出：A→C→B（不是 A→B→C！）
// 执行 A 时注册了 B，但 C 已经在队列里了 → C 先执行
\`\`\`

## async/await 中的微任务

\`\`\`javascript
async function foo() {
  console.log("1");
  await bar();           // await 右边同步执行
  console.log("3");      // await 之后 → 微任务！
}
async function bar() { console.log("2"); }
console.log("start");
foo();
Promise.resolve().then(() => console.log("4"));
console.log("end");
// 输出：start→1→2→end→3→4
// 3 和 4 都在微任务队列，3 先注册所以先执行
\`\`\``,

      },
      {
        id: "js-16",
        title: "原型链与继承：prototype / __proto__ / class",
        tags: ["JavaScript", "原型链", "继承"],
        excerpt: "彻底搞懂原型链本质，手写 instanceof，对比 6 种继承方式",
        content:
`## 核心三角关系

\`\`\`javascript
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { return "Hi!"; };

const p = new Person("Alice");

// 三条核心链：
p.__proto__           === Person.prototype    // ① 实例→原型
Person.prototype.constructor === Person       // ② 原型→构造函数
Person.__proto__      === Function.prototype  // ③ 构造函数本身也是对象

// 访问属性的查找链：
// p.name        → 实例自身有 → 直接返回
// p.sayHi       → 实例没有 → 沿 __proto__ 到 Person.prototype → 找到
// p.toString    → Person.prototype 没有 → 再往上的 __proto__ → Object.prototype → 找到
// p.xxx         → 一路到 null → undefined
\`\`\`

## 手写 instanceof

\`\`\`javascript
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj); // obj.__proto__
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto); // 沿原型链向上
  }
  return false; // 到 null 还没找到
}
console.log(myInstanceof(p, Person));     // true
console.log(myInstanceof(p, Object));     // true
console.log(myInstanceof([], Array));     // true
\`\`\`

## 六种继承方式

\`\`\`javascript
function Parent(name) { this.name = name; this.colors = ["red"]; }
Parent.prototype.say = function() { return this.name; };

// ① 原型链继承：Child.prototype = new Parent()
//    缺点：所有实例共享引用类型属性（colors）

// ② 构造函数继承：Parent.call(this, name)
//    缺点：无法继承原型上的方法

// ③ 组合继承（最常用）：
function Child(name, age) {
  Parent.call(this, name);                       // 继承属性
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // 继承方法
Child.prototype.constructor = Child;                // 修复 constructor

// ④ 寄生组合（最优）— 同上，避免调用两次 Parent 构造函数
// ⑤ class extends（ES6 语法糖，底层仍是原型链）
class Child extends Parent {
  constructor(name, age) { super(name); this.age = age; }
}
// ⑥ Object.create() — 直接创建以某个对象为原型的对象
\`\`\``,

      },
      {
        id: "js-17",
        title: "JavaScript 模块化演进：IIFE → CJS → AMD → ESM",
        tags: ["JavaScript", "模块化", "ESM"],
        excerpt: "全面梳理 JS 模块化的历史演进，理解 CommonJS 与 ESM 的本质区别",
        content:
`## ① 全局函数 + IIFE（立即执行函数）

\`\`\`javascript
// 早期的模块化：用闭包隔离作用域
const Module = (function() {
  const privateVar = "内部变量";
  return {
    publicMethod() { return privateVar; },
  };
})();
// Module.publicMethod() ✅
// Module.privateVar ❌ undefined
\`\`\`

## ② CommonJS（Node.js 默认）

\`\`\`javascript
// math.js
const add = (a, b) => a + b;
module.exports = { add };
// 本质：module.exports = { add }; exports 是 module.exports 的引用

// app.js
const { add } = require("./math");
// require 函数执行流程：
// ① 解析路径 → ② 检查缓存 → ③ 创建 module 对象
// → ④ 执行文件代码 → ⑤ 返回 module.exports → ⑥ 缓存

// CJS 特点：
// 运行时加载（同步） | 值拷贝（非引用） | 可以在条件中 require
// ❌ 不能 Tree Shaking（运行时才知道引用了什么）
\`\`\`

## ③ AMD / RequireJS（浏览器端）

\`\`\`javascript
// 解决浏览器不能同步 require 的问题（文件需要下载）
define(["jquery", "lodash"], function($, _) {
  return { doSomething() { /* ... */ } };
});
// 依赖前置，先加载完再执行
\`\`\`

## ④ ESM（ES6 模块，现代标准）

\`\`\`javascript
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add } from "./math.js";
// import 是静态的，必须写在顶层

// ESM 特点：
// 编译时加载（静态） | 值的引用（实时绑定） | 必须在顶层
// ✅ 支持 Tree Shaking（编译时就知道用了哪些导出）
\`\`\`

## CJS vs ESM 核心区别

| | CommonJS | ESM |
|---|---|---|
| 加载时机 | 运行时同步 | 编译时静态 |
| this | 指向模块自身 | undefined |
| 导入值 | 值的拷贝 | 值的实时引用 |
| 动态导入 | require() 天生支持 | import() 返回 Promise |
| Tree Shaking | ❌ | ✅ |
| 顶层 await | ❌ | ✅ |`,

      },
      {
        id: "js-18",
        title: "JavaScript 垃圾回收机制（GC）",
        tags: ["JavaScript", "GC", "内存管理"],
        excerpt: "理解 V8 引擎的标记清除、分代回收、增量标记等垃圾回收策略",
        content:
`## 垃圾回收的核心：可达性

\`\`\`javascript
// V8 从"根"（Roots）出发，能访问到的对象就是"活的"，其他都是"垃圾"

// 根包括：
// ① 全局对象 window/global
// ② 调用栈上的局部变量和参数
// ③ 当前执行函数的闭包中的变量

let user = { name: "Alice" };
user = null; // { name: "Alice" } 无法从根访问 → 被 GC 回收
\`\`\`

## 标记清除（Mark-Sweep）— 主流算法

\`\`\`
① 标记阶段：从根出发 DFS，标记所有可到达的对象
② 清除阶段：遍历整个堆，回收未被标记的对象
③ （可选）整理阶段：移动存活对象，消除内存碎片
\`\`\`

## V8 分代回收

\`\`\`
V8 把堆分为两代：

新生代（Young Generation）：
- 存活时间短的对象（大部分对象诞生即死亡）
- 使用 Scavenge 算法（Cheney 算法）— 快，频繁
- 经过两次 GC 仍存活 → 晋升到老生代

老生代（Old Generation）：
- 生命周期长的对象（全局变量、闭包、大对象等）
- 使用标记清除 + 标记整理
- 频率低，但停顿时间长
\`\`\`

## 增量标记与惰性清理

\`\`\`
全量 GC 会造成明显卡顿（Stop-The-World）

V8 优化：
① 增量标记：标记阶段拆成小段，与 JS 交替执行
② 惰性清理：清除阶段按需执行，降低单次 GC 停顿
③ 并发标记：标记阶段在后台线程中执行
\`\`\`

## 引用计数（老方案，现代不单独使用）

\`\`\`javascript
// 循环引用 → 引用计数永远不为 0 → 内存泄漏
function cycle() {
  const a = {}, b = {};
  a.ref = b;
  b.ref = a;
}
cycle(); // a 和 b 互相引用，引用计数法无法回收！
// 标记清除可以（对象无法从根到达 → 正确回收）
\`\`\``,

      },
      {
        id: "js-19",
        title: "0.1 + 0.2 !== 0.3：浮点数精度问题",
        tags: ["JavaScript", "浮点数", "精度"],
        excerpt: "从 IEEE 754 标准出发，彻底理解 JS 中的浮点数精度问题及解决方案",
        content:
`## 为什么 0.1 + 0.2 = 0.30000000000000004？

\`\`\`javascript
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);  // false 😱
\`\`\`

**根本原因：JavaScript 使用 IEEE 754 双精度浮点数（64 位），十进制小数转二进制可能产生无限循环小数。**

\`\`\`
十进制 0.1 → 二进制 0.000110011001100...（循环！）
十进制 0.2 → 二进制 0.00110011001100...（循环！）
\`\`\`

10 进制能精确表示的 1/10，在 2 进制中是无限循环小数，只能截断成 64 位存储，截断后再加回来就有微小误差。

## IEEE 754 双精度（64 位）结构

\`\`\`
┌─────┬───────────┬─────────────────────────────┐
│ 符号 │   指数    │            尾数              │
│ 1bit │   11bit   │            52bit             │
└─────┴───────────┴─────────────────────────────┘
实际值 = (-1)^符号 × 1.尾数 × 2^(指数-1023)
\`\`\`

## 解决方案

\`\`\`javascript
// ① toFixed() — 返回字符串
(0.1 + 0.2).toFixed(2); // "0.30"

// ② 乘一个倍数转整数再除回来
(0.1 * 10 + 0.2 * 10) / 10; // 0.3

// ③ Number.EPSILON — 最小精度误差
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
isEqual(0.1 + 0.2, 0.3); // true ✅

// ③ decimal.js / big.js — 精确运算库
import Decimal from "decimal.js";
new Decimal(0.1).plus(0.2).toNumber(); // 0.3

// ④ 后端用 int 存储（如金额用"分"为单位）
const price = 1099; // 10.99 元 = 1099 分
\`\`\`

## 另一个经典例子

\`\`\`javascript
console.log(0.1 + 0.7); // 0.7999999999999999 😱
console.log(0.2 + 0.4); // 0.6000000000000001

// 所有使用 IEEE 754 的语言都一样：Python、Java、C++ double、Go float64 等等
\`\`\``,

      },
      {
        id: "js-20",
        title: "JavaScript 内存泄漏常见场景与排查",
        tags: ["JavaScript", "内存泄漏", "调试"],
        excerpt: "识别 6 种常见内存泄漏场景，掌握 Chrome DevTools 内存排查方法",
        content:
`## ① 意外的全局变量

\`\`\`javascript
function leak1() {
  bar = "全局变量"; // 没有 var/let/const → 漏到 window 上
}
// 等价于 window.bar — 只要页面不关闭，bar 永远不会被 GC

// 解决方案：ESLint no-undef + 严格模式
"use strict";
function safe() { bar = "global"; } // ❌ ReferenceError
\`\`\`

## ② 忘记清除的定时器/事件监听

\`\`\`javascript
// 定时器没清
function startTimer() {
  setInterval(() => { /* 引用了组件变量 */ }, 1000);
  // 即使组件"销毁"了，定时器仍在运行 → 闭包引用的变量无法 GC
}
// ✅ 组件卸载时 clearInterval(id)

// 事件监听没清
function mount() {
  window.addEventListener("resize", handler);
}
// ✅ unmount 时 window.removeEventListener("resize", handler)
\`\`\`

## ③ 闭包中持有大对象引用

\`\`\`javascript
function leak3() {
  const bigData = new Array(10000000).fill("*");
  return function handler() {
    console.log(bigData.length); // bigData 永远在内存中！
  };
}
const fn = leak3(); // 即使 fn 不再需要 bigData，它也不回收
// ✅ 需要时置为 null：bigData = null
\`\`\`

## ④ 脱离 DOM 树的引用

\`\`\`javascript
const cache = {};
function bind(el) {
  cache["key"] = el; // JS 中有引用 → 即使 DOM 节点被删除也无法 GC
}
// 这也是 WeakMap 的应用场景！
const cache2 = new WeakMap();
// DOM 节点删除后，WeakMap 中的记录自动被 GC
\`\`\`

## ⑤ console.log 保留引用

\`\`\`javascript
function leak5() {
  const obj = new Array(10000000);
  console.log(obj); // 浏览器控制台保留对 obj 的引用（为了能展开查看）
}
// 生产环境去掉 console.log / 避免打印大对象
\`\`\`

## ⑥ 闭包不当使用

\`\`\`javascript
function TheClass() {
  this.bigData = new Array(1000000);
  this.someMethod = () => {
    // 箭头函数没用 bigData，但闭包捕获了整个 TheClass 的作用域
    console.log("hello");
  };
}
// someMethod 并不会被 GC → TheClass 实例也不会 → bigData 泄漏！
\`\`\`

## Chrome DevTools 排查

\`\`\`
① Performance → 录制 → 观察 JS Heap 曲线
   - 如果内存持续上升不回落 → 内存泄漏

② Memory → Heap Snapshot → 拍快照 → 对比前后两次快照
   - 按 Delta 排序 → 找到新增最多的对象

③ Memory → Allocation instrumentation on timeline
   - 实时记录每次内存分配 → 精确定位哪行代码分配了大内存
\`\`\``,

      },
      {
        id: "js-21",
        title: "严格模式（\"use strict\"）的作用与影响",
        tags: ["JavaScript", "严格模式", "最佳实践"],
        excerpt: "理解严格模式引入的 8 大限制，以及为什么现代开发中应该始终启用",
        content:
`## 开启方式

\`\`\`javascript
"use strict";           // ① 文件顶部 → 整个文件严格模式
function fn() {
  "use strict";         // ② 函数内部第一行 → 仅该函数
}
// ES6 class 和 ESM 模块默认就是严格模式
\`\`\`

## 8 大核心变化

\`\`\`javascript
// ① 禁止意外创建全局变量
x = 10;                  // ❌ ReferenceError: x is not defined
// var x = 10;           // ✅

// ② 禁止删除变量/函数
var y = 1;
delete y;                // ❌ SyntaxError

// ③ 函数参数不能重名
function fn(a, a) {}     // ❌ SyntaxError

// ④ 禁止 0 开头的八进制字面量
var n = 010;             // ❌ SyntaxError（非严格输出 8）

// ⑤ with 语句禁止使用
with (obj) {}            // ❌ SyntaxError

// ⑥ eval 不再在外部作用域创建变量
eval("var z = 10");
console.log(z);          // ❌ ReferenceError

// ⑦ this 不自动指向全局对象
function fn() { console.log(this); }
fn();                    // undefined（非严格：window）

// ⑧ 禁止给只读/不可扩展的对象设置属性
var obj = {};
Object.preventExtensions(obj);
obj.newProp = 1;         // ❌ TypeError
\`\`\`

## 为什么现代开发中默认启用？

\`\`\`javascript
// ① 消除静默失败 → 将错误暴露出来
// ② 阻止不安全的操作（delete/eval/with）
// ③ 为未来的 ES 新特性预留空间
// ④ ESM 和 class 默认严格 → 已经是事实标准

// 构建工具（Babel/webpack/Vite）会默认添加 "use strict"
// 生产环境中 'use strict' 会被 Terser 压缩掉（因为 ESM 默认严格）
\`\`\``,

      },
      {
        id: "js-22",
        title: "typeof / instanceof 的区别与实现原理",
        tags: ["JavaScript", "typeof", "instanceof"],
        excerpt: "掌握两种类型检测方式的区别、原理、局限性，以及正确的类型判断方法",
        content:
`## typeof — 检测原始类型

\`\`\`javascript
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof Symbol()     // "symbol"
typeof 123n         // "bigint"
typeof function(){} // "function"

// ⚠️ 三大经典陷阱
typeof null         // "object"  ← 历史遗留 Bug
typeof []           // "object"  ← 无法区分数组
typeof {}           // "object"  ← 所有对象都是 "object"
\`\`\`

**typeof null 为什么是 "object"？** JS 第一版用低位二进制标识类型：对象 000、整数 1、字符串 100...而 null 全是 0（和对象一样），所以 typeof null = "object"。这个 Bug 为了兼容性保留至今。

## instanceof — 检测原型链

\`\`\`javascript
[] instanceof Array  // true — [] 的原型链上有 Array.prototype
[] instanceof Object // true — 原型链上也有 Object.prototype

function Foo() {}
const f = new Foo();
f instanceof Foo     // true
f instanceof Object  // true

// instanceof 本质：沿着 __proto__ 链查找 Constructor.prototype
\`\`\`

## 正确检测方法

\`\`\`javascript
// ✅ null — 严格相等
value === null

// ✅ 数组 — Array.isArray（推荐）
Array.isArray([]);     // true

// ✅ NaN — Number.isNaN（不转换类型）
Number.isNaN(NaN);     // true
Number.isNaN("abc");   // false
isNaN("abc");          // true ← 先把 "abc" 转成 NaN 再判断！

// ✅ 万能方法 — Object.prototype.toString
function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
getType([]);           // "array"
getType(null);         // "null"
getType(new Date());   // "date"
getType(/a/);          // "regexp"
getType(new Map());    // "map"
getType(Promise.resolve()); // "promise"
getType(() => {});     // "function"
\`\`\``,

      },
      {
        id: "js-23",
        title: "从输入 URL 到页面展示的完整过程",
        tags: ["JavaScript", "浏览器", "渲染"],
        excerpt: "经典面试题：涵盖 DNS→TCP→HTTP→解析→渲染→合成 全链路",
        content:
`## 完整流程概览

\`\`\`
用户输入 URL → DNS 解析 → TCP 连接 → TLS 握手 → HTTP 请求/响应
→ HTML 解析 → CSS 解析 → 渲染树 → 布局 → 绘制 → 合成 → 显示
\`\`\`

## 第一步：DNS 解析（域名→IP）

\`\`\`
浏览器 DNS 缓存 → OS hosts 文件 → 路由器缓存
→ ISP DNS 服务器 → 根 DNS → 顶级域名 DNS → 权威 DNS
最终得到 IP 地址
\`\`\`

## 第二步：TCP 三次握手

\`\`\`
客户端 → SYN (seq=x) → 服务端
客户端 ← SYN-ACK (seq=y, ack=x+1) ← 服务端
客户端 → ACK (ack=y+1) → 服务端  // 连接建立
\`\`\`

**为什么三次？** 防止旧连接请求到达服务端建立无意义连接。若只有两次，客户端不回应 ACK 服务端就空等。

## 第三步：TLS 握手（HTTPS）

\`\`\`
TLS 1.3 (1-RTT)：
客户端 → ClientHello（支持的密码套件 + 密钥协商参数）
服务端 → ServerHello + 证书 + Finished
客户端 → Finished
\`\`\`

## 第四步：发送 HTTP 请求

\`\`\`
GET /index.html HTTP/1.1
Host: www.example.com
Connection: keep-alive
Accept: text/html
\`\`\`

服务端返回 HTML + 状态码 + 响应头。浏览器收到 HTML 开始解析。

## 第五步：HTML→DOM + CSS→CSSOM

\`\`\`html
<!-- HTML 解析遇到 <script> 默认阻塞 -->
<script src="app.js"></script>
<!-- async: 异步下载，下载完立即执行，不保证顺序 -->
<script async src="analytics.js"></script>
<!-- defer: 异步下载，等 DOM 解析完再执行，保证顺序 -->
<script defer src="app.js"></script>
<!-- CSS 不阻塞 DOM 解析但阻塞渲染 -->
<link rel="stylesheet" href="style.css" />
\`\`\`

## 第六步：渲染树 → 布局 → 绘制 → 合成

\`\`\`
DOM Tree + CSSOM Tree = Render Tree（不含 display:none 节点）
→ Layout（计算每个节点位置和尺寸）
→ Paint（将像素填充到图层）
→ Composite（GPU 合成图层 → 屏幕显示）
\`\`\`

**一图总结：**
\`\`\`
┌──────┐   ┌──────┐
│ DOM  │   │CSSOM │
└──┬───┘   └──┬───┘
   └────┬─────┘
     Render Tree → Layout → Paint → Composite → 屏幕
\`\`\``,

      },
      {
        id: "js-24",
        title: "V8 引擎工作原理：解析、编译、执行与 JIT",
        tags: ["JavaScript", "V8", "JIT"],
        excerpt: "理解 V8 引擎的解析(Ignition)、编译(TurboFan)、优化去优化全过程",
        content:
`## V8 引擎架构

\`\`\`
JavaScript 源码
     ↓
  Parser（解析器）→ AST（抽象语法树）
     ↓
  Ignition（解释器）→ 生成字节码 → 直接执行（快启动）
     ↓                        ↓
  收集运行信息（热点检测）  ← 频繁执行的代码标记为"热点"
     ↓
  TurboFan（优化编译器）→ 编译成高度优化的机器码
     ↓
  如果类型变化 → 逆优化（Deoptimization）→ 退回字节码
\`\`\`

## Ignition 解释器

\`\`\`javascript
// Ignition 把 AST 转成字节码并执行
// 字节码比机器码更紧凑，启动速度快
function add(a, b) { return a + b; }
// Ignition 生成类似如下的字节码：
// Ldar a1    // 加载参数 a
// Add a2, r0 // a + b
// Return
\`\`\`

## TurboFan 优化编译器

\`\`\`javascript
// V8 发现 add 被频繁调用且参数总是 number → 标记为热点
// TurboFan 编译成高度优化的机器码
add(1, 2); add(3, 4); add(5, 6); // 总是 number + number

// 但如果突然传入不同类型...
add("hello", "world"); // string + string
// → V8 检测到类型变化 → Deoptimization（逆优化）
// → 回退到 Ignition 字节码重新执行
// → 如果又频繁调用 string+string，重新优化
\`\`\`

## 隐藏类（Hidden Class）

\`\`\`javascript
// V8 为相同结构的对象共享隐藏类，加速属性访问
function Point(x, y) { this.x = x; this.y = y; }
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
// p1 和 p2 共享同一个隐藏类 → 属性访问极快！

// ❌ 动态添加属性会改变隐藏类
p1.z = 5; // p1 的隐藏类变了！不再与 p2 共享 → 性能下降

// ✅ 最佳实践：构造函数中一次性声明所有属性
function Point(x, y) { this.x = x; this.y = y; this.z = null; }
\`\`\`

## 内联缓存（Inline Cache）

\`\`\`javascript
function getName(obj) { return obj.name; }
// 第一次调用：obj 的隐藏类记为 HC₁ → 操作缓存
getName(user1); // user1 隐藏类 = HC₁
getName(user2); // user2 隐藏类 = HC₁ → 命中缓存 → 快速
getName(obj3);  // 不同隐藏类 → 缓存未命中 → 变成多态缓存
\`\`\`

**性能建议：** ① 用相同顺序初始化对象属性 ② 避免动态添加/删除属性 ③ 保持函数参数类型稳定`,

      },
      {
        id: "js-25",
        title: "DOM 事件模型：冒泡、捕获与事件委托",
        tags: ["JavaScript", "DOM", "事件"],
        excerpt: "掌握 DOM 事件三阶段、阻止冒泡/默认行为、事件委托原理与实战",
        content:
`## DOM 事件三阶段

\`\`\`html
<div id="outer">
  <button id="inner">点我</button>
</div>
\`\`\`

\`\`\`javascript
// 事件传播三阶段：
// ① 捕获阶段：window → document → html → body → outer → inner
// ② 目标阶段：到达 inner
// ③ 冒泡阶段：inner → outer → body → html → document → window

// addEventListener 第三个参数：
// false/省略 = 冒泡阶段触发（默认）
// true       = 捕获阶段触发
outer.addEventListener("click", () => console.log("outer 捕获"), true);
outer.addEventListener("click", () => console.log("outer 冒泡"), false);
inner.addEventListener("click", () => console.log("inner"));

// 点击 inner，输出：
// "outer 捕获" → "inner" → "outer 冒泡"
\`\`\`

## e.stopPropagation() vs e.stopImmediatePropagation()

\`\`\`javascript
inner.addEventListener("click", e => {
  e.stopPropagation();    // 阻止继续冒泡/捕获，但当前元素上其他监听器仍触发
});
inner.addEventListener("click", e => {
  e.stopImmediatePropagation(); // 阻止所有后续监听器 + 阻止冒泡/捕获
});

// e.preventDefault() — 阻止默认行为（链接跳转、表单提交等）
link.addEventListener("click", e => {
  e.preventDefault();     // 阻止跳转，但事件仍会冒泡
});
\`\`\`

## 事件委托（最常用优化）

\`\`\`javascript
// ❌ 给每个 li 绑定事件 — 1000 个 li = 1000 个监听器
document.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => { /* ... */ });
});

// ✅ 事件委托：把监听器绑定到父元素，利用冒泡机制
document.querySelector("ul").addEventListener("click", e => {
  if (e.target.tagName === "LI") {     // 判断真正被点击的是 li
    console.log("点击了", e.target.textContent);
  }
  // 也可以用 e.target.matches("li.active") 做更精确匹配
});

// ✅ 动态添加的元素也能响应！
ul.insertAdjacentHTML("beforeend", "<li>新项</li>");
// 新加的 li 不用再绑定事件，父元素上的委托监听器自动生效！
\`\`\`

## 事件委托的 data- 属性传参

\`\`\`html
<button data-id="123" data-action="delete">删除</button>
<button data-id="456" data-action="edit">编辑</button>
\`\`\`

\`\`\`javascript
document.querySelector(".toolbar").addEventListener("click", e => {
  const btn = e.target.closest("button");     // 找到最近的 button 祖先
  if (!btn) return;
  const { id, action } = btn.dataset;         // 读取 data-* 属性
  if (action === "delete") deleteItem(id);
  if (action === "edit")   editItem(id);
});
\`\`\``,

      },
      {
        id: "js-26",
        title: "数组常用方法大全：map / filter / reduce / splice / slice",
        tags: ["JavaScript", "数组", "方法"],
        excerpt: "从使用到手写实现，全面掌握 JS 数组的增删改查与高阶方法",
        content:
`## 增删改查

\`\`\`javascript
const arr = ["a", "b", "c"];

// 末尾
arr.push("d", "e");       // 添加 → ["a","b","c","d","e"]  返回新 length
arr.pop();                 // 删除末尾 → "e"                返回删除的值

// 开头
arr.unshift("z");          // 头部添加 → ["z","a","b","c"]  返回新 length
arr.shift();               // 头部删除 → "z"               返回删除的值

// 万能方法 splice
arr.splice(1, 1, "x");    // 从索引1删1个，插入"x" → ["a","x","c"]
arr.splice(1, 1);         // 从索引1删1个 → ["a","c"]
arr.splice(1, 0, "y");    // 从索引1删0个，插入"y" → ["a","y","c"]（纯插入）

// slice — 截取子数组（不改变原数组！）
arr.slice(1, 3);           // 索引[1, 3) → ["b","c"]
arr.slice(-2);             // 最后 2 个 → ["b","c"]

// indexOf / includes / find
arr.indexOf("b");          // 1（不存在返回 -1）
arr.includes("b");         // true
arr.find(x => x === "b");  // "b"（回调方式查找）
arr.findIndex(x => x === "b"); // 1
\`\`\`

## 遍历方法

\`\`\`javascript
const nums = [1, 2, 3, 4, 5];

// map：映射 → 新数组
nums.map(x => x * 2);              // [2, 4, 6, 8, 10]

// filter：过滤 → 新数组
nums.filter(x => x > 3);           // [4, 5]

// reduce：归并 → 单个值
nums.reduce((sum, x) => sum + x, 0);       // 15
nums.reduce((acc, x) => { acc[x] = x; return acc; }, {}); // {1:1,2:2,...}

// reduceRight：从右往左归并
["a","b","c"].reduceRight((s, c) => s + c); // "cba"

// forEach：遍历（无返回值）
nums.forEach((x, i) => console.log(i, x));

// every / some：判断
nums.every(x => x > 0);   // true（全部大于 0）
nums.some(x => x > 4);    // true（至少一个大于 4）

// sort：排序（默认按字符串排序，注意 10 在 2 前面！）
[2, 10, 1].sort((a, b) => a - b);  // [1, 2, 10]  ✅ 数字排序
[2, 10, 1].sort();                  // [1, 10, 2]  ❌ 默认按字符串！

// flat / flatMap：扁平化
[1, [2, [3]]].flat();       // [1, 2, [3]]
[1, [2, [3]]].flat(2);      // [1, 2, 3]
[1, 2, 3].flatMap(x => [x, x*2]); // [1,2, 2,4, 3,6]
\`\`\`

## 变 vs 不变（Mutation）

| 改变原数组 | 不改变原数组 |
|---|---|
| push/pop/shift/unshift | map/filter/reduce |
| splice/sort/reverse | slice/concat/join |
| fill/copyWithin | flat/flatMap/indexOf/find |

\`\`\`javascript
// ✅ 不改变原数组的排序
const sorted = [...arr].sort((a, b) => a - b);
const reversed = [...arr].reverse();
\`\`\``,

      },
      {
        id: "js-27",
        title: "正则表达式核心语法与实战",
        tags: ["JavaScript", "正则", "RegExp"],
        excerpt: "从基础元字符到进阶断言，掌握 JS 中正则的创建、匹配与替换",
        content:
`## 创建正则

\`\`\`javascript
const re1 = /pattern/flags;                     // 字面量（推荐，静态）
const re2 = new RegExp("pattern", "flags");     // 构造函数（动态拼接）

// flags: g-全局 i-忽略大小写 m-多行 s-点号匹配换行 u-Unicode
\`\`\`

## 核心元字符速查

\`\`\`javascript
// 字符类
\\d     // 数字 [0-9]
\\w     // 单词字符 [a-zA-Z0-9_]
\\s     // 空白（空格/制表/换行）
.       // 除换行外任意字符
\\D \\W \\S // 取反

// 量词
*       // 0次或多次  {0,}
+       // 1次或多次  {1,}
?       // 0次或1次   {0,1}
{n}     // 恰好 n 次
{n,}    // 至少 n 次
{n,m}   // n 到 m 次

// 位置
^       // 开头
$       // 结尾
\\b      // 单词边界
\\B      // 非单词边界

// 分组
(x)     // 捕获组
(?:x)   // 非捕获组
x|y     // 或
[abc]   // 字符集合
[^abc]  // 排除集合
\`\`\`

## 常用正则实战

\`\`\`javascript
// 邮箱
const emailRe = /^[\\w.-]+@[\\w.-]+\\.\\w+$/;
emailRe.test("user@example.com"); // true

// 手机号（中国大陆）
const phoneRe = /^1[3-9]\\d{9}$/;
phoneRe.test("13800138000"); // true

// 提取 URL 里的参数
const url = "https://site.com?name=Alice&age=25";
const params = Object.fromEntries(new URLSearchParams(new URL(url).search));
// { name: "Alice", age: "25" }

// 匹配并替换
"hello world".replace(/\\b\\w+/g, m => m.toUpperCase()); // "HELLO WORLD"

// 千分位
"1234567890".replace(/\\B(?=(\\d{3})+(?!\\d))/g, ","); // "1,234,567,890"

// 模板占位符替换
"Hello, {{name}}!".replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => ({ name: "Alice" })[key]);
// "Hello, Alice!"
\`\`\`

## 断言（零宽）

\`\`\`javascript
// 正向先行断言 (?=...) — 后面必须跟着
"10px".match(/\\d+(?=px)/);  // ["10"]  只匹配数字，数字后必须有 px

// 反先行断言 (?!...) — 后面不能跟着
"10rem".match(/\\d+(?!px)/); // ["10"]  只匹配数字，数字后不能有 px

// 正向后行断言 (?<=...) — 前面必须是什么
"¥100".match(/(?<=¥)\\d+/);  // ["100"] 只匹配 ¥ 后面的数字

// 反后行断言 (?<!...) — 前面不能是什么
"$100".match(/(?<!¥)\\d+/);  // ["100"] 前面不能是 ¥
\`\`\`

## match / test / exec / replace 区别

\`\`\`javascript
const re = /(\\w+)=(\\w+)/g;
const str = "name=Alice&age=25";

re.test(str);           // true/false — 只判断是否匹配
str.match(re);          // ["name=Alice", "age=25"] — 返回匹配数组（g 模式）
str.match(/(\\w+)=(\\w+)/); // ["name=Alice","name","Alice"] — 非 g 返回捕获组

// exec — 逐次匹配（带 g 时），适合 while 循环
let m;
while ((m = re.exec(str)) !== null) console.log(m[1], m[2]); // "name Alice" "age 25"

str.replace(/(\\w+)=(\\w+)/g, "$2=$1"); // "Alice=name&25=age"
\`\`\``,

      },
      {
        id: "js-28",
        title: "错误处理：try-catch / Promise / 全局错误捕获",
        tags: ["JavaScript", "错误处理", "调试"],
        excerpt: "掌握同步错误、异步错误、全局错误的捕获方式与最佳实践",
        content:
`## try-catch（同步错误）

\`\`\`javascript
try {
  JSON.parse("{ invalid json }");
} catch (err) {
  console.error(err.name);    // "SyntaxError"
  console.error(err.message); // "Unexpected token ..."
  console.error(err.stack);   // 完整调用栈
} finally {
  // 无论是否出错，始终执行（常用于清理资源）
}

// ❌ try-catch 无法捕获异步错误
try {
  setTimeout(() => { throw new Error("async"); }, 0);
} catch (err) { /* 不会执行！*/ }
\`\`\`

## Promise 错误处理

\`\`\`javascript
fetch("/api/data")
  .then(res => res.json())
  .then(data => processData(data))
  .catch(err => console.error("统一捕获")); // 任一环节出错都会被捕获

// async/await
async function load() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error("加载失败", err);
    return null;
  }
}

// ⚠️ Promise 中未处理的 rejection
new Promise((_, reject) => reject("oops")); // ❌ 没有 .catch()
// → 触发 unhandledrejection 事件
\`\`\`

## 全局错误捕获

\`\`\`javascript
// ① 同步错误 — window.onerror
window.addEventListener("error", e => {
  console.error(e.message, e.filename, e.lineno, e.colno);
  // 上报日志服务
});

// ② Promise 未处理 rejection
window.addEventListener("unhandledrejection", e => {
  console.error("未处理的 Promise 错误", e.reason);
});

// ③ 资源加载错误
window.addEventListener("error", e => {
  if (e.target !== window) {
    console.error("资源加载失败", e.target.src || e.target.href);
  }
}, true); // 捕获阶段（资源加载错误不冒泡）

// ④ React 错误边界
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }
  render() {
    return this.state.hasError ? <FallbackUI /> : this.props.children;
  }
}
\`\`\`

## 自定义错误

\`\`\`javascript
class BusinessError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "BusinessError";
    this.code = code;
  }
}
throw new BusinessError("余额不足", "INSUFFICIENT_FUNDS");
// err.code === "INSUFFICIENT_FUNDS" — 前端可以据此展示不同提示

// 更好的选择：instanceof 判断
try {
  throw new TypeError("类型错误");
} catch (err) {
  if (err instanceof TypeError) console.log("类型错了");
  else if (err instanceof RangeError) console.log("越界了");
  else throw err; // 不认识的错误继续往上抛
}
\`\`\``,

      },
      {
        id: "js-29",
        title: "事件循环与渲染的关系：requestAnimationFrame、requestIdleCallback",
        tags: ["JavaScript", "事件循环", "渲染"],
        excerpt: "理解事件循环中渲染帧的位置，掌握 rAF 和 rIC 的最佳实践",
        content:
`## 一帧里发生了什么

\`\`\`
每一帧（16.6ms @ 60fps）：
宏任务 → 微任务 → requestAnimationFrame → 样式计算 → 布局 → 绘制 → 合成
                                    ↑                        ↑
                              操作 DOM 的最佳时机          requestIdleCallback
\`\`\`

## requestAnimationFrame（rAF）

\`\`\`javascript
// rAF 在下一次重绘前执行，适合做动画、更新 DOM
function animate() {
  box.style.transform = \`translateX(\${x}px)\`;
  x += 1;
  requestAnimationFrame(animate); // 浏览器自动按 60fps 调度
}
requestAnimationFrame(animate);

// ✅ 用 rAF 做动画的好处：
// ① 与浏览器刷新率同步（不会掉帧/多余渲染）
// ② 页面不可见时自动暂停（切到其他标签页）
// ③ 多个 rAF 合并到一个渲染帧中

// ❌ 对比 setTimeout 动画：
setInterval(() => { box.style.left = x + "px"; x++; }, 16); // 16ms≈60fps
// 但 setTimeout 不精确！可能掉帧，页面隐藏时也在运行
\`\`\`

## requestIdleCallback（rIC）

\`\`\`javascript
// rIC 在浏览器空闲时执行，适合非关键任务
requestIdleCallback(deadline => {
  // deadline.timeRemaining() — 剩余空闲时间（ms）
  // deadline.didTimeout — 是否因超时被强制执行
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    processTask(task);
  }
}, { timeout: 2000 }); // 最多等 2s，超时强制执行
\`\`\`

## 经典执行顺序题

\`\`\`javascript
console.log("1");                                    // ① 同步

setTimeout(() => console.log("2"), 0);               // ⑤ 宏任务

requestAnimationFrame(() => console.log("3"));       // ④ 渲染前

Promise.resolve().then(() => console.log("4"));      // ② 微任务

requestIdleCallback(() => console.log("5"));         // ⑥ 空闲时

console.log("6");                                    // ① 同步

// 输出：1→6→4→3→2→5
// 注意：rAF 在微任务之后、下一个宏任务之前执行
\`\`\`

## 用 rAF 解决渲染问题

\`\`\`javascript
// 问题：快速修改 DOM 两次，但只触发一次渲染
box.style.display = "none";
box.style.display = "block"; // 浏览器合并了 → 用户看不到闪烁

// 让浏览器看到"中间状态"再去改
box.style.display = "none";
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    box.style.display = "block"; // 中间帧已渲染，确保 display:none 生效
  });
});
\`\`\``,

      },
      {
        id: "js-30",
        title: "函数式编程核心：纯函数 / 不可变性 / 柯里化 / 组合",
        tags: ["JavaScript", "函数式编程", "FP"],
        excerpt: "掌握函数式编程的核心理念与在 JS 中的实践技巧",
        content:
`## 纯函数

\`\`\`javascript
// ✅ 纯函数：相同输入 → 相同输出；无副作用
function add(a, b) { return a + b; }
function getFullName(user) { return \`\${user.firstName} \${user.lastName}\`; }

// ❌ 非纯函数：有副作用、依赖外部状态
let count = 0;
function increment() { count++; return count; } // 修改外部 count
function getNow() { return Date.now(); }         // 依赖外部时间
function sendLog(msg) { fetch("/log", { method: "POST", body: msg }); } // 副作用

// 纯函数的好处：可缓存、可测试、可并行、无竞态
\`\`\`

## 不可变性（Immutable）

\`\`\`javascript
// ❌ 直接修改原数据
const user = { name: "Alice", age: 25 };
user.age = 26;            // mutation！

const list = [1, 2, 3];
list.push(4);             // mutation！

// ✅ 返回新数据
const newUser = { ...user, age: 26 };
const newList = [...list, 4];
const updated = list.map(x => x === 2 ? 200 : x);
const filtered = list.filter(x => x > 1);
const merged = list.reduce((a, x) => [...a, x * 2], []);

// React 中不可变更新状态的原因：
// ① 浅比较判断是否变化 → shouldComponentUpdate/React.memo
// ② 时间旅行调试（Redux DevTools）
// ③ 纯组件渲染优化
\`\`\`

## 柯里化（Currying）

\`\`\`javascript
// 柯里化：把多参函数变成单参函数链
const add = a => b => a + b;
add(1)(2); // 3

// 实战：日志函数
const log = level => module => msg =>
  console.log(\`[\${level}] [\${module}] \${msg}\`);
const errorLog = log("ERROR");           // 固定级别
const apiError = log("ERROR")("API");    // 固定级别+模块
apiError("请求失败");                     // [ERROR] [API] 请求失败

// 实战：验证器工厂
const minLength = len => str => str.length >= len;
const isLongEnough = minLength(8);
["ok", "hello", "sufficiently-long"].filter(isLongEnough); // ["sufficiently-long"]
\`\`\`

## 函数组合（Composition）

\`\`\`javascript
// compose：从右往左执行
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// pipe：从左往右执行
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const trim       = s => s.trim();
const toLower   = s => s.toLowerCase();
const slugify   = s => s.replace(/\\s+/g, "-");
const addPrefix = s => \`article-\${s}\`;

const processTitle = pipe(trim, toLower, slugify, addPrefix);
processTitle("  React Fiber Architecture  "); // "article-react-fiber-architecture"
\`\`\`

## 副作用隔离

\`\`\`javascript
// 把纯逻辑和不纯的副作用分开
// 纯部分（可测试）
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// 不纯部分（副作用）
async function fetchCart() { /* fetch */ }
async function renderTotal(total) { /* update DOM */ }

// 组装：纯逻辑做好计算，副作用只负责 I/O
async function main() {
  const items = await fetchCart();          // 副作用
  const total = calculateTotal(items);      // 纯逻辑
  renderTotal(total);                       // 副作用
}
\`\`\`

## React 中的函数式思想

\`\`\`tsx
// props → JSX，纯函数
const Greeting = ({ name }) => <h1>Hello, {name}!</h1>;

// useState 保持不可变性
setUsers(prev => [...prev, newUser]);     // 追加
setUsers(prev => prev.filter(u => u.id !== id)); // 删除
setUsers(prev => prev.map(u => u.id === id ? {...u, name: "new"} : u)); // 更新
\`\`\``,

      },
      {
        id: "js-31",
        title: "DOM 查找与遍历：querySelector / getElement / 节点关系",
        tags: ["JavaScript", "DOM", "查找"],
        excerpt: "掌握所有 DOM 查找方法的选择和节点遍历关系，理解性能差异",
        content:
`## 查找 DOM 的 6 种方法

\`\`\`javascript
// ① querySelector / querySelectorAll — CSS 选择器（最灵活）
const el = document.querySelector(".active");           // 单个元素
const els = document.querySelectorAll("li.active");     // 静态 NodeList — 拍快照！不会随 DOM 变化而更新

// ② getElementById — 最快（唯一 ID）
const el = document.getElementById("app");

// ③ getElementsByClassName — 动态 HTMLCollection
const items = document.getElementsByClassName("item");  // 动态！DOM 变化会自动更新
// 性能比 querySelectorAll 快，适合频繁访问的集合

// ④ getElementsByTagName
const divs = document.getElementsByTagName("div");      // 也是动态的

// ⑤ getElementsByName — 按 name 属性（表单常用）
const radios = document.getElementsByName("gender");

// ⑥ closest — 查找最近的祖先匹配元素
e.target.closest("li");          // 从当前元素向上找 li
e.target.closest("[data-id]");  // 找带 data-id 属性的祖先
\`\`\`

## 性能对比

\`\`\`javascript
// ❌ 慢：querySelectorAll 返回静态 NodeList，遍历所有元素拍快照
document.querySelectorAll(".item");

// ✅ 快：getElementsByClassName 返回动态 HTMLCollection，不拍快照
document.getElementsByClassName("item");

// 结论：频繁操作用 getElement 系，灵活查找用 querySelector 系
// 一次性查找两者差距不大，但循环中 getElement 系明显更快
\`\`\`

## 节点遍历（所有关系）

\`\`\`javascript
const el = document.getElementById("app");

// 父节点
el.parentNode;          // 父节点（包含文本/注释节点）
el.parentElement;       // 父元素节点（只 Element，推荐）

// 子节点
el.children;            // 所有子元素（HTMLCollection，仅 Element）✅
el.childNodes;          // 所有子节点（NodeList，含文本/注释）
el.firstChild;          // 第一个子节点（可能是文本）
el.lastChild;           // 最后一个子节点
el.firstElementChild;   // 第一个子元素 ✅
el.lastElementChild;    // 最后一个子元素 ✅

// 兄弟节点
el.nextSibling;         // 下一个节点（可能是文本）
el.previousSibling;     // 上一个节点
el.nextElementSibling;  // 下一个元素节点 ✅
el.previousElementSibling; // 上一个元素节点 ✅

// 判断是否有子元素
el.hasChildNodes();     // 是否有任何子节点
el.children.length > 0; // 是否有子元素
\`\`\`

## 匹配检测

\`\`\`javascript
el.matches(".active");        // el 是否匹配 CSS 选择器 → true/false
el.contains(childEl);         // el 是否包含 childEl → true/false
el.compareDocumentPosition(otherEl); // 元素间位置关系（位掩码）
\`\`\`

**速记：** 带 Element 的只找元素节点（推荐日常使用），不带 Element 的可能包含文本/注释节点。`,

      },
      {
        id: "js-32",
        title: "DOM 增删改：createElement / append / remove / insertBefore / replaceChild",
        tags: ["JavaScript", "DOM", "增删改"],
        excerpt: "全面掌握 DOM 节点的创建、插入、移动、删除、替换与克隆操作",
        content:
`## 创建节点

\`\`\`javascript
// 创建元素
const div = document.createElement("div");
div.className = "box";          // 设置 class
div.textContent = "Hello";      // 设置文本（安全，不解析 HTML）
div.innerHTML = "<span>Hi</span>"; // 设置 HTML（注意 XSS！）
div.setAttribute("data-id", "1"); // 设置属性
div.dataset.action = "save";      // data-action="save"

// 创建文本节点
const text = document.createTextNode("纯文本");

// 创建 DocumentFragment（批量插入高性能）
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = \`Item \${i}\`;
  fragment.appendChild(li);       // 不在页面上，都在内存中
}
ul.appendChild(fragment);          // 一次性插入 1000 个 li！
// fragment 本身不会出现在 DOM 中，只有它的子节点被插入
\`\`\`

## 插入节点（6 种方式）

\`\`\`javascript
// ① append — 末尾追加（支持多节点 + 字符串）
parent.append(div, "字符串", span);   // ✅ 现代推荐

// ② appendChild — 末尾追加（单节点，返回该节点）
parent.appendChild(div);              // 经典方法

// ③ prepend — 开头插入
parent.prepend(div);                   // 插入为第一个子元素

// ④ before — 在当前元素前插入
target.before(div);                    // div 插入在 target 之前

// ⑤ after — 在当前元素后插入
target.after(div);                     // div 插入在 target 之后

// ⑥ insertBefore — 在指定子节点前插入
parent.insertBefore(newNode, referenceNode); // 经典方法
// 如果 referenceNode 是 null，效果等同于 appendChild

// ⑦ insertAdjacentHTML / Element / Text — 按位置插入
target.insertAdjacentHTML("beforebegin", "<div>前</div>");  // target 之前
target.insertAdjacentHTML("afterbegin",  "<div>内首</div>"); // target 内第一个
target.insertAdjacentHTML("beforeend",   "<div>内尾</div>"); // target 内最后一个
target.insertAdjacentHTML("afterend",    "<div>后</div>");  // target 之后
// insertAdjacentHTML 有 XSS 风险，insertAdjacentElement 更安全
\`\`\`

## 移动 / 替换 / 删除 / 克隆

\`\`\`javascript
// 移动节点（已有节点重新插入 = 移动，不是复制）
parent2.appendChild(existingNode); // existingNode 从原位置消失，出现在 parent2

// 替换
oldNode.replaceWith(newNode);     // ✅ 现代
parent.replaceChild(newNode, oldNode); // 经典

// 删除
el.remove();                      // ✅ 现代，删除自身
parent.removeChild(child);        // 经典

// 克隆
const clone = el.cloneNode(true); // true = 深克隆（含子节点）
const shallow = el.cloneNode(false); // false = 仅克隆标签自身
// 注意：cloneNode 不克隆事件监听器！
\`\`\`

## 批量操作最佳实践

\`\`\`javascript
// ❌ 循环中逐个插入 — 触发多次重排
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item;
  parent.appendChild(li);          // 每次循环都触发 layout
});

// ✅ 方案 1：DocumentFragment（一次重排）
const frag = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item;
  frag.appendChild(li);
});
parent.appendChild(frag);           // 只触发一次重排

// ✅ 方案 2：拼接 innerHTML（最快但注意 XSS）
const html = items.map(i => \`<li>\${escapeHtml(i)}</li>\`).join("");
parent.innerHTML = html;

// ✅ 方案 3：脱离文档流
const parentEl = parent.parentNode;
parent.remove();                    // 脱离文档流
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item;
  parent.appendChild(li);           // 不在文档流中，不触发重排
});
parentEl.appendChild(parent);       // 放回去，只触发一次重排
\`\`\``,

      },
      {
        id: "js-33",
        title: "DOM 属性操作：Attribute vs Property",
        tags: ["JavaScript", "DOM", "属性"],
        excerpt: "彻底分清 HTML Attribute 与 DOM Property 的区别，避免踩坑",
        content:
`## Attribute vs Property 核心区别

\`\`\`html
<input id="name" type="text" value="初始值" data-user="1" />
\`\`\`

\`\`\`javascript
const input = document.getElementById("name");

// Attribute — HTML 标签上写的属性（静态）
input.getAttribute("value");          // "初始值" — HTML 上的初始值
input.setAttribute("value", "新值");  // 修改 HTML 属性

// Property — DOM 对象上的属性（动态、当前状态）
input.value;                          // 用户在输入框打了什么 → 当前值
input.value = "新值";                 // 修改属性值

// ⚠️ 关键区别：
// 用户在输入框输入 "用户输入的内容"
input.getAttribute("value");  // "初始值" — 始终是 HTML 上的初始值
input.value;                  // "用户输入的内容" — 当前实际值

// 同样：
input.getAttribute("checked"); // "checked" 或 null — HTML 的字面值
input.checked;                 // true 或 false — 当前是否选中
\`\`\`

## 常见 Attribute → Property 映射陷阱

\`\`\`javascript
// class
el.getAttribute("class");      // "foo bar"
el.className;                  // "foo bar"
el.classList.add("baz");       // ✅ 推荐：用 classList 操作

// style
el.getAttribute("style");      // "color: red; font-size: 14px" — 字符串
el.style.color;                // "red" — CSSStyleDeclaration 对象
el.style.fontSize;             // "14px" — 驼峰命名

// data-* 属性
el.getAttribute("data-user-id"); // "42"
el.dataset.userId;               // "42" — ✅ 用 dataset 更方便

// href
a.getAttribute("href");        // "/page" — HTML 上的原始值
a.href;                        // "https://site.com/page" — 完整解析后的 URL

// disabled / checked / readonly — 布尔属性
el.setAttribute("disabled", ""); // 存在即禁用
el.disabled = true;              // ✅ 推荐
el.removeAttribute("disabled");
el.disabled = false;
\`\`\`

## classList — 最常用的属性操作

\`\`\`javascript
el.classList.add("active");        // 添加
el.classList.remove("inactive");   // 删除
el.classList.toggle("dark");       // 有则删，无则加
el.classList.toggle("dark", true); // 强制添加
el.classList.contains("active");   // 判断是否存在
el.classList.replace("old", "new"); // 替换

// 一次替换多个
el.className = "foo bar";          // 直接覆盖全部 class
\`\`\`

## 自定义属性 data-*

\`\`\`html
<div data-id="1" data-user-name="Alice" data-order-index="3">
\`\`\`

\`\`\`javascript
el.dataset.id;         // "1"
el.dataset.userName;   // "Alice" (data-user-name → camelCase)
el.dataset.orderIndex; // "3"    (data-order-index → camelCase)

// 增删
el.dataset.status = "active";         // 添加 data-status="active"
delete el.dataset.status;             // 删除属性
el.dataset.status = "";               // data-status=""（属性还在）
\`\`\`

## 总结

| 操作 | 用 Property | 用 Attribute |
|---|---|---|
| 获取当前值 | ✅ value / checked | ❌ 只会返回初始值 |
| 修改状态 | ✅ el.disabled = true | 也行但麻烦 |
| 增删非标准属性 | ❌ | ✅ data-* 或 setAttribute |
| 批量改 class | ✅ classList | 不推荐 |`,

      },
      {
        id: "js-34",
        title: "DOM 尺寸与位置：getBoundingClientRect / offset / scroll / client",
        tags: ["JavaScript", "DOM", "尺寸"],
        excerpt: "彻底搞懂 element 的各类尺寸和位置 API，不再混淆 offsetHeight/scrollTop/clientWidth",
        content:
`## 坐标与位置

\`\`\`javascript
// ① getBoundingClientRect — 元素相对于视口的位置（推荐！）
const rect = el.getBoundingClientRect();
rect.top;       // 元素上边到视口顶部的距离
rect.left;      // 元素左边到视口左边的距离
rect.right;     // 元素右边到视口左边的距离
rect.bottom;    // 元素下边到视口顶部的距离
rect.width;     // 元素宽度（含 padding 和 border，即 border-box）
rect.height;    // 元素高度（同上）
rect.x;         // 同 left
rect.y;         // 同 top

// 坐标是相对于视口的，加上 scroll 就是相对于文档
const pageY = rect.top + window.scrollY;
const pageX = rect.left + window.scrollX;
\`\`\`

## offset / client / scroll 三大系列

\`\`\`javascript
// ═══ offset 系列 — 相对于 offsetParent（最近的定位祖先）═══
el.offsetParent;     // 最近的定位祖先元素
el.offsetTop;        // 相对于 offsetParent 的顶部距离
el.offsetLeft;       // 相对于 offsetParent 的左边距离
el.offsetWidth;      // 元素完整宽度 = content + padding + border + scrollbar
el.offsetHeight;     // 元素完整高度 = content + padding + border + scrollbar

// ═══ client 系列 — 元素内部可视区域 ═══
el.clientTop;        // 上边框宽度（border-top）
el.clientLeft;       // 左边框宽度（border-left）
el.clientWidth;      // content + padding（不包含边框和滚动条！）
el.clientHeight;     // content + padding

// ═══ scroll 系列 — 元素滚动相关 ═══
el.scrollTop;        // 元素垂直滚动了多少 px（可读写）
el.scrollLeft;       // 元素水平滚动了多少 px
el.scrollWidth;      // 内容的总宽度（包括溢出不可见的部分）
el.scrollHeight;     // 内容的总高度
\`\`\`

## 图解三者的区别

\`\`\`
┌──────────── border ────────────┐  ← offsetWidth / offsetHeight
│   ┌──────── padding ────────┐  │
│   │                         │  │
│   │     content 内容         │  │  ← clientWidth / clientHeight
│   │       ↑ 可能滚动        │  │
│   │    scrollWidth/Height   │  │
│   └─────────────────────────┘  │
└────────────────────────────────┘
↑ offsetTop / offsetLeft = 到 offsetParent 的距离
↑ 通过 getBoundingClientRect 获取相对于视口
\`\`\`

## 判断元素是否在可视区

\`\`\`javascript
function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= window.innerHeight + offset &&
    rect.right <= window.innerWidth + offset
  );
}

// IntersectionObserver — 更现代的方式（性能更好）
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) console.log("出现在视口中！");
  });
}, { threshold: 0.5 }); // 可见 50% 时触发
observer.observe(el);
\`\`\`

## 判断滚动到底部

\`\`\`javascript
// 元素滚动到底
el.scrollTop + el.clientHeight >= el.scrollHeight - 5; // 预留 5px

// 页面滚动到底
window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
\`\`\`

## window 相关尺寸

\`\`\`javascript
window.innerWidth;   // 视口宽度（含滚动条）
window.innerHeight;  // 视口高度
window.outerWidth;   // 浏览器窗口宽度
window.screen.width;  // 屏幕宽度
window.scrollX;       // 页面水平滚动量（可读写）
window.scrollY;       // 页面垂直滚动量

// 文档总尺寸
document.documentElement.scrollWidth;
document.documentElement.scrollHeight;

// 滚动到指定位置
window.scrollTo({ top: 0, behavior: "smooth" });
el.scrollTo({ top: 100, behavior: "smooth" });
el.scrollIntoView({ behavior: "smooth", block: "center" }); // 滚动到可视区中央
\`\`\``,

      },
      {
        id: "js-35",
        title: "表单操作与数据获取：FormData / 校验 / 提交",
        tags: ["JavaScript", "表单", "FormData"],
        excerpt: "掌握原生表单数据获取、校验、提交的完整流程",
        content:
`## 获取表单数据 — FormData（推荐）

\`\`\`html
<form id="loginForm">
  <input name="username" value="alice" />
  <input name="password" type="password" />
  <input name="remember" type="checkbox" checked />
  <select name="role"><option selected value="admin">管理员</option></select>
</form>
\`\`\`

\`\`\`javascript
// ① 直接从 form 构建 FormData
const form = document.getElementById("loginForm");
const data = new FormData(form);

// ② 遍历
for (const [key, value] of data) {
  console.log(key, value);
}
// "username" "alice"
// "password" ""
// "role" "admin"
// ⚠️ 未选中的 checkbox 不会出现在 FormData 中！

// ③ 转为普通对象
const obj = Object.fromEntries(data); // { username: "alice", password: "", role: "admin" }

// ④ 直接用于 fetch
fetch("/api/login", { method: "POST", body: data }); // Content-Type 自动设 multipart/form-data

// ⑤ 手写追加
const data = new FormData();
data.append("username", "alice");
data.append("file", fileInput.files[0]); // 文件上传
\`\`\`

## 表单校验 — Constraint Validation API

\`\`\`javascript
const input = document.getElementById("email");

// ① HTML5 原生校验属性
// <input required minlength="3" maxlength="20" pattern="\\d+" type="email" />

// ② JS 校验
input.checkValidity();       // true/false — 是否符合约束
input.validity.valid;        // 整体是否有效
input.validity.valueMissing; // required 但空
input.validity.typeMismatch; // type=email 但格式不对
input.validity.patternMismatch; // pattern 不匹配
input.validity.tooShort;     // minlength 不够
input.validity.tooLong;      // maxlength 超出
input.validationMessage;     // 浏览器默认错误信息

// ③ 自定义错误
input.setCustomValidity("邮箱已被注册");
input.reportValidity();      // 触发浏览器原生气泡提示

// ④ 表单整体校验
form.checkValidity();        // true 如果所有字段都通过
form.reportValidity();       // 显示第一个不合法字段的错误提示
\`\`\`

## 表单事件

\`\`\`javascript
form.addEventListener("submit", e => {
  e.preventDefault();          // 阻止默认提交（页面刷新）
  if (!form.checkValidity()) return;
  const data = new FormData(form);
  fetch("/api/submit", { method: "POST", body: data });
});

input.addEventListener("input", e => {
  console.log(e.target.value); // 每次输入变化
});

input.addEventListener("change", e => {
  console.log(e.target.value); // 值改变且失去焦点时
});

input.addEventListener("focus", () => { /* ... */ });
input.addEventListener("blur", () => { /* 可用于校验 */ });
\`\`\`

## 重置与清空

\`\`\`javascript
form.reset();          // 重置所有字段为初始值
// 或用 JS
form.querySelectorAll("input").forEach(i => {
  if (i.type === "checkbox" || i.type === "radio") i.checked = false;
  else i.value = "";
});
\`\`\``,

      },
      {
        id: "js-36",
        title: "MutationObserver / IntersectionObserver / ResizeObserver",
        tags: ["JavaScript", "Observer", "API"],
        excerpt: "掌握三大 Observer API，告别轮询，用原生方式监听 DOM 变化、元素可见和尺寸变化",
        content:
`## MutationObserver — 监听 DOM 变化

\`\`\`javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    // mutation.type: "childList" | "attributes" | "characterData"
    if (mutation.type === "childList") {
      console.log("新增节点", mutation.addedNodes);
      console.log("删除节点", mutation.removedNodes);
    }
    if (mutation.type === "attributes") {
      console.log("属性变化", mutation.attributeName, mutation.target.getAttribute(mutation.attributeName));
    }
  });
});

observer.observe(targetEl, {
  childList: true,      // 监听子节点增删
  attributes: true,     // 监听属性变化
  attributeFilter: ["class", "style"], // 只监听特定属性（性能优化）
  subtree: true,        // 监听所有后代节点
  characterData: true,  // 监听文本变化
  attributeOldValue: true, // 记录旧值
});

// 停止监听
observer.disconnect();

// 优势：异步批量回调，不会每次变化都触发
// 相比 Mutation Events（已废弃、同步、性能差）好太多
\`\`\`

## IntersectionObserver — 监听元素可见性

\`\`\`javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // entry.isIntersecting — 是否交叉（进入可视区）
    // entry.intersectionRatio — 可见比例 0~1

    if (entry.isIntersecting) {
      console.log("元素可见了！");
      // 图片懒加载
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img); // 加载完就不再观察
    }
  });
}, {
  root: null,           // null = 视口；可指定父元素
  rootMargin: "100px", // 提前 100px 触发（预加载）
  threshold: [0, 0.5, 1], // 0%/50%/100% 可见时各触发一次
});

observer.observe(el);

// 经典应用：
// ① 图片懒加载
// ② 无限滚动（最后一个元素可见时加载更多）
// ③ 广告曝光统计
// ④ 动画触发（滚动到才播放）
\`\`\`

## ResizeObserver — 监听元素尺寸变化

\`\`\`javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(\`元素尺寸变为 \${width} × \${height}\`);
  });
});

observer.observe(el);

// 应用：
// ① 响应式组件（内容撑大容器时调整布局）
// ② 监听某个 div 的宽度以同步给另一个元素
// ③ 代替 window.resize（更精确，不听全局）

// ❌ 不能直接监听 window/document
// ✅ 可以监听任何 Element、SVGElement
\`\`\`

## 三大 Observer 对比

| API | 监听什么 | 触发条件 | 典型用途 |
|---|---|---|---|
| MutationObserver | DOM 变化 | 子节点/属性/文本变化 | 监听注入、数据绑定 |
| IntersectionObserver | 可见性 | 进入/离开视口 | 懒加载、曝光统计 |
| ResizeObserver | 尺寸 | width/height 变化 | 响应式组件 |`,

      },
      {
        id: "js-37",
        title: "10 万条数据渲染优化：虚拟列表与分片加载",
        tags: ["JavaScript", "大数据", "性能"],
        excerpt: "从虚拟滚动到时间分片，掌握海量数据渲染的 4 种核心优化策略",
        content:
`## 问题：直接渲染 10 万条会发生什么？

\`\`\`javascript
// ❌ 10 万个 DOM 节点 → 页面卡死几十秒 → 浏览器崩溃
const data = Array.from({ length: 100000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));
function App() { return <ul>{data.map(d => <li key={d.id}>{d.name}</li>)}</ul>; }
\`\`\`

## 方案一：虚拟列表（Virtual Scrolling）— 最优解

\`\`\`tsx
// 核心思路：只渲染可视区 + 上下少量 buffer 的 DOM 节点
// 容器高度 600px，每行 40px → 同时显示 ~15 条 → 实际渲染 ~25 条（加 buffer）

import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={100000}
  itemSize={40}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>第 {index + 1} 行</div>
  )}
</FixedSizeList>
// 100000 条数据，DOM 节点仅 ~25 个，滚动丝滑！
\`\`\`

**核心原理：**
\`\`\`
可视区概念：
┌────────────── 占位 div (高度 = 总数据量 × 行高) ──────────────┐
│  padding-top = scrollTop                                       │
│  ┌────── 只渲染这几行 ──────┐                                   │
│  │  item_{startIndex}       │  ← 实际 DOM 节点，仅 ~25 个       │
│  │  item_{startIndex+1}     │                                   │
│  │  ...                     │                                   │
│  │  item_{endIndex}         │                                   │
│  └──────────────────────────┘                                   │
│  padding-bottom = 剩余数据高度                                   │
└────────────────────────────────────────────────────────────────┘
\`\`\`

**第三方方案：** react-window（轻量）、react-virtualized（功能全）、@tanstack/virtual（框架无关）、vue-virtual-scroller（Vue）

## 方案二：时间分片（Time Slicing）

\`\`\`javascript
// 利用 requestIdleCallback 把大数据拆分多次渲染
function renderChunks(data, container, chunkSize = 20) {
  let index = 0;
  function renderChunk(deadline) {
    while (index < data.length && deadline.timeRemaining() > 1) {
      const end = Math.min(index + chunkSize, data.length);
      const fragment = document.createDocumentFragment();
      for (let i = index; i < end; i++) {
        const li = document.createElement("li");
        li.textContent = data[i].name;
        fragment.appendChild(li);
      }
      container.appendChild(fragment);
      index = end;
    }
    if (index < data.length) requestIdleCallback(renderChunk);
    else console.log("渲染完成！");
  }
  requestIdleCallback(renderChunk);
}
// 不冻结 UI，用户可以继续操作
\`\`\`

## 方案三：分页（最传统）

\`\`\`
每页 50 条，共 2000 页。后端分页 + 前端分页组件。
适用于对实时性要求不高、需要精确跳转的场景。
局限：用户无法连续滚动浏览。
\`\`\`

## 方案四：无限滚动 + 懒加载

\`\`\`javascript
// IntersectionObserver 监听底部哨兵元素
const sentinel = document.getElementById("sentinel");
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadMore(); // 加载下一页数据，追加到列表末尾
  }
});
observer.observe(sentinel);
// 每次追加 20 条，滚到底部自动加载
// 注意：当数据累积到几千条时也要清理旧 DOM（超出视口的数据卸载）
\`\`\`

## 方案对比

| 方案 | DOM 数量 | 流畅度 | 适用场景 |
|---|---|---|---|
| 虚拟列表 | ~25 个 | ⭐⭐⭐⭐⭐ | 大量同高/可变高列表 |
| 时间分片 | 最终 10 万个 | ⭐⭐⭐ | 一次性渲染但不能用虚拟列表 |
| 分页 | 每页 50 个 | ⭐⭐⭐⭐ | 传统表格/管理后台 |
| 无限滚动 | 越滚越多 | ⭐⭐ | 信息流（需配合 DOM 回收） |

**推荐路线：** 优先虚拟列表 → 不能用的场景用分页 → 特殊场景时间分片`,

      },
      {
        id: "js-38",
        title: "大文件上传：分片上传、断点续传、秒传、进度控制",
        tags: ["JavaScript", "文件上传", "断点续传"],
        excerpt: "从前端到协议，掌握大文件分片上传的完整实现方案",
        content:
`## 为什么需要分片上传？

\`\`\`
单文件上传的问题：
① 大文件（>100MB）可能超时、失败 → 需从头重传
② 占用大量内存（浏览器要把整个文件读进内存）
③ 没有进度反馈（只有 0% 和 100%）
④ 无法暂停/恢复
\`\`\`

## 完整流程

\`\`\`
① 客户端用 File.slice() 把文件切成 N 个分片（每片 5MB）
② 计算整个文件的 hash（MD5/SHA256）→ 用于秒传和断点续传
③ 请求服务端：这个文件上传过吗？（秒传校验）
④ 服务端返回：已上传的分片列表
⑤ 客户端只上传未上传的分片（断点续传）
⑥ 全部分片上传完 → 通知服务端合并分片
\`\`\`

## 核心代码实现

\`\`\`javascript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 一个分片

// ① 切片
function createChunks(file) {
  const chunks = [];
  let start = 0;
  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push({
      file: file.slice(start, end), // File.slice() 不占内存！
      index: chunks.length,
      start,
      end,
    });
    start = end;
  }
  return chunks;
}

// ② 计算文件 hash（Web Worker 中计算，不阻塞 UI）
async function hashFile(file) {
  return new Promise(resolve => {
    const worker = new Worker("hash-worker.js");
    worker.postMessage({ file, chunkSize: CHUNK_SIZE });
    worker.onmessage = e => resolve(e.data); // "a1b2c3d4e5..."
  });
}
// hash-worker.js
self.onmessage = async e => {
  const { file, chunkSize } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  let start = 0;
  while (start < file.size) {
    const chunk = file.slice(start, start + chunkSize);
    spark.append(await chunk.arrayBuffer());
    start += chunkSize;
    self.postMessage({ progress: start / file.size }); // 可报告 hash 进度
  }
  self.postMessage(spark.end());
};

// ③ 秒传 & 断点续传
async function upload(file) {
  const hash = await hashFile(file);
  // 检查服务端是否已存在
  const { uploaded, chunks: uploadedChunks } = await fetch(\`/api/check?hash=\${hash}\`).then(r => r.json());
  if (uploaded) return { url: uploadedChunks }; // 秒传！

  const chunks = createChunks(file);
  // 只上传未上传的分片
  const pending = chunks.filter(c => !uploadedChunks.includes(c.index));
  for (const chunk of pending) {
    const form = new FormData();
    form.append("file", chunk.file);
    form.append("hash", hash);
    form.append("index", chunk.index);
    form.append("total", chunks.length);
    await fetch("/api/upload-chunk", { method: "POST", body: form });
  }

  // 通知合并
  return fetch("/api/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hash, fileName: file.name, total: chunks.length }),
  }).then(r => r.json());
}
\`\`\`

## 并发上传 + 进度控制 + 暂停恢复

\`\`\`javascript
async function uploadWithConcurrency(chunks, hash, concurrency = 3) {
  const controller = new AbortController();
  let uploaded = 0;

  async function uploadChunk(chunk) {
    const form = new FormData();
    form.append("file", chunk.file);
    form.append("hash", hash);
    form.append("index", chunk.index);
    await fetch("/api/upload-chunk", { method: "POST", body: form, signal: controller.signal });
    uploaded++;
    onProgress({ loaded: uploaded, total: chunks.length }); // 进度回调
  }

  // 并发控制池
  const pool = new Set();
  for (const chunk of chunks) {
    const p = uploadChunk(chunk).then(() => pool.delete(p));
    pool.add(p);
    if (pool.size >= concurrency) await Promise.race(pool); // 等一个完成再放新任务
  }
  await Promise.all(pool); // 等待剩余完成

  return { pause: () => controller.abort() }; // 暂停
}
\`\`\`

**核心要点：** File.slice() 零拷贝 | Web Worker 算 hash | 并发池控制 | AbortController 暂停 | 分片 + hash 实现秒传和断点`,

      },
      {
        id: "js-39",
        title: "微前端架构：qiankun / Module Federation / single-spa",
        tags: ["JavaScript", "微前端", "架构"],
        excerpt: "理解微前端的核心理念，掌握 qiankun 与 Module Federation 的选型与实践",
        content:
`## 什么是微前端？

\`\`\`
把巨石前端应用拆成多个独立的小型前端应用（微应用）
每个微应用可以：
- 独立开发、独立部署、独立运行
- 技术栈无关（React + Vue + jQuery 共存）
- 团队自治（A 团队负责用户模块，B 团队负责订单模块）
\`\`\`

## 三种主流方案

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    基座应用（主应用）                      │
│  路由分发 + 生命周期管理 + 全局状态共享                   │
├──────────────┬──────────────────┬────────────────────────┤
│  微应用 A     │   微应用 B       │   微应用 C              │
│  React 18     │   Vue 3          │   Svelte               │
│  /users/*     │   /orders/*      │   /dashboard/*         │
│  team-a       │   team-b         │   team-c               │
└──────────────┴──────────────────┴────────────────────────┘
\`\`\`

## 方案一：qiankun（基于 single-spa，阿里出品）

\`\`\`javascript
// 主应用 — 注册微应用
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "react-app",
    entry: "//localhost:3001",           // 开发环境
    container: "#sub-app-container",
    activeRule: "/app-react",
  },
  {
    name: "vue-app",
    entry: "//localhost:3002",
    container: "#sub-app-container",
    activeRule: "/app-vue",
    props: { globalStore },              // 向微应用传数据
  },
]);

start();

// 微应用 — 导出生命周期
// React 微应用的入口
export async function bootstrap() {}
export async function mount(props) {
  ReactDOM.render(<App {...props} />, props.container);
}
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(props.container);
}

// qiankun 的 JS 沙箱：隔离全局变量，微应用间不互相污染
// qiankun 的 CSS 沙箱：隔离样式，微应用 A 的 CSS 不影响 B
\`\`\`

## 方案二：Module Federation（Webpack 5 原生）

\`\`\`javascript
// webpack.config.js — 主应用
module.exports = {
  plugins: [new ModuleFederationPlugin({
    name: "host",
    remotes: {
      app1: "app1@http://localhost:3001/remoteEntry.js",
      app2: "app2@http://localhost:3002/remoteEntry.js",
    },
    shared: { react: { singleton: true }, "react-dom": { singleton: true } },
  })],
};

// 使用时直接 import！
import App1 from "app1/App";
import App2 from "app2/App";

function Host() {
  return (
    <>
      <React.Suspense fallback="Loading...">
        <App1 />
      </React.Suspense>
      <React.Suspense fallback="Loading...">
        <App2 />
      </React.Suspense>
    </>
  );
}
// 像用普通 npm 包一样 import 远程模块！
\`\`\`

## 方案对比

| 维度 | qiankun | Module Federation |
|---|---|---|
| 原理 | JS 入口 + 沙箱 | 运行时 import 远程 chunk |
| 隔离强度 | ⭐⭐⭐⭐⭐ 强（JS/CSS 沙箱） | ⭐⭐⭐ 中（依赖 runtime 隔离） |
| 加载性能 | 较慢（需下载整个微应用） | 更快（按需加载，共享依赖） |
| 技术栈 | 不限（iframe 兜底） | 需 Webpack 5 / Rspack |
| 通信成本 | 较复杂（props/globalState） | 较简单（import/export） |
| 适合场景 | 老项目微前端改造 | 新项目模块化拆分 |

## 微前端三大核心问题

\`\`\`javascript
// ① 样式隔离
// qiankun: strictStyleIsolation（Shadow DOM 隔离）或 experimentalStyleIsolation（前缀隔离）
// Module Federation: 依赖 CSS Modules / Tailwind prefix

// ② JS 隔离
// qiankun: 基于 Proxy 的沙箱，劫持 window 操作
// 非 qiankun: 微应用 mount 时保存全局变量快照，unmount 时恢复

// ③ 应用间通信
// 轻量：CustomEvent + 全局 store（主应用 provide）
// 重量：RxJS / event bus
window.dispatchEvent(new CustomEvent("global-event", { detail: { type: "login" } }));

// ④ 公共依赖
// Module Federation shared: { react: { singleton: true, requiredVersion: "18" } }
// 确保 React 只加载一份，所有微应用共享
\`\`\`

## 选型建议

- 已有巨石应用改造 → qiankun（老框架兼容性好）
- 新项目并行开发 → Module Federation（原生、性能好）
- 简单场景 → Nginx 反向代理不同路径到不同应用（最简单）
- npm 包方式 → 各团队发包，主应用安装使用（最轻量）`,

      },
    ],
  },
  browser: browserData as KnowledgeData,
  vue: {
    name: "Vue 高频面试题",
    description: "Vue 基础、进阶、原理、Vue2/Vue3 对比等核心知识",
    icon: "Vue",
    items: [
      {
        id: "vue-01",
        title: "Vue 核心原理：MVVM、响应式系统与指令",
        tags: ["Vue", "基础", "面试题"],
        excerpt: "深入 Vue 核心概念：MVVM 模式、Object.defineProperty 与 Proxy 响应式原理、v-model 本质",
        content:
          "## MVVM 模式与 Vue\n\n" +
          "Model（data 数据）←→ ViewModel（Vue 实例）←→ View（模板 DOM）。Vue 通过数据绑定 + 依赖收集实现数据变化自动更新视图。\n\n" +
          "## Vue2 响应式 — Object.defineProperty\n\n" +
          "```javascript\n" +
          "// Vue2 响应式原理核心\n" +
          "function defineReactive(obj, key) {\n" +
          "  let val = obj[key];\n" +
          "  const dep = new Dep(); // 依赖收集器\n" +
          "  Object.defineProperty(obj, key, {\n" +
          "    get() { Dep.target && dep.addSub(Dep.target); return val; },\n" +
          "    set(newVal) { val = newVal; dep.notify(); } // 通知 Watcher 更新\n" +
          "  });\n" +
          "}\n" +
          "```\n\n" +
          "局限：① 无法检测新增/删除属性（需要 Vue.set）② 无法检测数组索引和 length 修改 ③ 需要递归遍历，性能开销大。\n\n" +
          "## Vue3 响应式 — Proxy\n\n" +
          "```javascript\n" +
          "// Proxy 代理整个对象，无需递归\n" +
          "const handler = {\n" +
          "  get(target, key, receiver) { track(target, key); return Reflect.get(target, key, receiver); },\n" +
          "  set(target, key, val, receiver) { Reflect.set(target, key, val, receiver); trigger(target, key); return true; },\n" +
          "  deleteProperty(target, key) { Reflect.deleteProperty(target, key); trigger(target, key); return true; },\n" +
          "};\n" +
          "const proxy = new Proxy(obj, handler);\n" +
          "```\n\n" +
          "优势：可检测新增/删除属性；能代理数组操作；惰性代理（用到才代理深层对象）；支持 Map/Set 等更多类型。\n\n" +
          "## v-model 本质\n\n" +
          "```html\n" +
          "<input v-model=\"msg\" />\n" +
          "<!-- 等价于 -->\n" +
          "<input :value=\"msg\" @input=\"msg = $event.target.value\" />\n" +
          "```\n\n" +
          "自定义组件 v-model：默认用 modelValue prop + update:modelValue 事件。\n\n" +
          "## v-if vs v-show\n\n" +
          "| 特性 | v-if | v-show |\n|------|------|--------|\n| 实现 | 条件渲染（不显示就不渲染） | CSS display 切换 |\n| 切换开销 | 高（销毁/重建） | 低 |\n| 初始开销 | 低（false 时不渲染） | 高（始终渲染） |\n| 场景 | 条件很少改变 | 频繁切换 |\n\n" +
          "## v-for 中的 key\n\n" +
          "key 是 Vue 识别节点的唯一标识，Diff 时根据 key 判断节点是移动、修改还是新建。用 index 做 key 在列表增删时会对比错位，导致输入框状态错乱。\n\n" +
          "## 组件通信方式\n\n" +
          "父子：props + $emit；兄弟：EventBus；跨级：provide/inject；全局：Vuex/Pinia；$refs 访问子实例；$parent/$children；$attrs/$listeners 属性透传。\n\n" +
          "## 生命周期顺序\n\n" +
          "加载：父 beforeCreate→created→beforeMount → 子 beforeCreate→created→beforeMount→mounted → 父 mounted。更新：父 beforeUpdate → 子 beforeUpdate→updated → 父 updated。销毁：父 beforeDestroy → 子 beforeDestroy→destroyed → 父 destroyed。",
      },
      {
        id: "vue-02",
        title: "Vue Router 路由与 Vuex/Pinia 状态管理",
        tags: ["Vue", "路由", "状态管理"],
        excerpt: "深入 Vue Router 导航守卫、懒加载、动态路由，以及 Vuex 与 Pinia 的核心原理对比",
        content:
          "## Vue Router 导航守卫\n\n" +
          "```javascript\n" +
          "// ① 全局守卫\n" +
          "router.beforeEach((to, from, next) => {\n" +
          "  const token = localStorage.getItem('token');\n" +
          "  if (to.meta.auth && !token) next('/login'); else next();\n" +
          "});\n" +
          "router.afterEach((to, from) => { /* 页面统计 */ });\n\n" +
          "// ② 路由独享守卫\n" +
          "routes: [{ path: '/admin', beforeEnter: (to, from, next) => { /* 权限 */ next(); } }]\n\n" +
          "// ③ 组件内守卫\n" +
          "beforeRouteEnter(to, from, next) { /* 不能访问 this */ next(vm => vm.fetch()); }\n" +
          "beforeRouteUpdate(to, from, next) { /* /user/1→/user/2 时触发 */ next(); }\n" +
          "beforeRouteLeave(to, from, next) { if(hasChanges) next(confirm('离开？')); else next(); }\n" +
          "```\n\n" +
          "## 路由懒加载\n\n" +
          "```javascript\n" +
          "const User = () => import('./User.vue');          // 动态 import\n" +
          "const Group = () => import(/* webpackChunkName:'group' */ './Group.vue'); // 分组\n" +
          "```\n\n" +
          "## hash vs history 模式\n\n" +
          "hash: URL 带 #，锚点部分不发给服务器，兼容所有浏览器。history: URL 干净，需要后端配置 fallback（Nginx: try_files $uri /index.html）。\n\n" +
          "## Vue Router 完整解析流程\n\n" +
          "① 导航触发 → ② 失活组件 beforeRouteLeave → ③ 全局 beforeEach → ④ 重用组件 beforeRouteUpdate → ⑤ 路由配置 beforeEnter → ⑥ 激活组件 beforeRouteEnter → ⑦ 全局 beforeResolve → ⑧ 确认导航 → ⑨ 全局 afterEach → ⑩ DOM 更新 → ⑪ beforeRouteEnter 的 next 回调。\n\n" +
          "## Vuex vs Pinia\n\n" +
          "```javascript\n" +
          "// Vuex — Store 集中管理\n" +
          "const store = new Vuex.Store({\n" +
          "  state: { count: 0 },\n" +
          "  mutations: { increment(state, payload) { state.count += payload; } }, // 同步\n" +
          "  actions: { asyncIncrement({ commit }) { await delay(); commit('increment', 1); } }, // 异步\n" +
          "  getters: { doubleCount: state => state.count * 2 },\n" +
          "});\n\n" +
          "// Pinia — 更简洁，无 mutations，TypeScript 友好\n" +
          "const useStore = defineStore('main', () => {\n" +
          "  const count = ref(0);\n" +
          "  const double = computed(() => count.value * 2);\n" +
          "  const inc = () => count.value++;\n" +
          "  return { count, double, inc };\n" +
          "});\n" +
          "```\n\n" +
          "| 特性 | Vuex | Pinia |\n|------|-------|-------|\n| 类型支持 | 弱 | 强（完整 TS 推断） |\n| mutations | 有 | 无（直接用 actions 改） |\n| 模块 | 嵌套 module | 扁平 store 组合 |\n| 体积 | 较大 | 轻量 |",
      },
      {
        id: "vue-03",
        title: "Vue 组件化高级用法：插槽、混入、自定义指令、keep-alive",
        tags: ["Vue", "组件", "进阶"],
        excerpt: "掌握 Vue 高级组件技巧：作用域插槽、动态组件、异步组件、Mixin 与 Composition API 对比",
        content:
          "## 插槽三件套\n\n" +
          "```html\n" +
          "<!-- ① 匿名插槽 -->\n" +
          "<slot>默认内容</slot>\n\n" +
          "<!-- ② 具名插槽 -->\n" +
          "<slot name='header'>默认头部</slot>\n" +
          "<!-- 父：<template #header>自定义</template> -->\n\n" +
          "<!-- ③ 作用域插槽：子传父 -->\n" +
          "<slot :user='user' :index='index'>{{ user.name }}</slot>\n" +
          "<!-- 父：<template #default='{ user, index }'>{{ index }}.{{ user.name }}</template> -->\n" +
          "```\n\n" +
          "## 动态组件\n\n" +
          "```html\n" +
          "<component :is='currentTab' />\n" +
          "<!-- :is 可以是组件名字符串或组件对象，切换时销毁重建 -->\n" +
          "<keep-alive>\n" +
          "  <component :is='currentTab' />  <!-- 切换后不销毁，状态保留 -->\n" +
          "</keep-alive>\n" +
          "```\n\n" +
          "keep-alive 生命周期：activated（激活时） / deactivated（停用时）。include/exclude 控制缓存范围，max 限制数量（LRU 淘汰）。\n\n" +
          "## 递归组件\n\n" +
          "```html\n" +
          "<li v-for='node in treeData'>\n" +
          "  {{ node.name }}\n" +
          "  <ul v-if='node.children'>\n" +
          "    <tree-node v-for='child in node.children' :node='child' />\n" +
          "  </ul>\n" +
          "</li>\n" +
          "```\n" +
          "递归组件必须有 name 选项，且有终止条件。\n\n" +
          "## Mixin vs Composition API\n\n" +
          "Mixin 问题：命名冲突、隐式依赖、来源不清晰。Vue3 推荐用 Composition API（组合函数）：\n" +
          "```javascript\n" +
          "function useMouse() {\n" +
          "  const x = ref(0), y = ref(0);\n" +
          "  onMounted(() => window.addEventListener('mousemove', e => { x.value=e.x; y.value=e.y; }));\n" +
          "  return { x, y };\n" +
          "}\n" +
          "// 组件中：const { x, y } = useMouse();\n" +
          "// 来源清晰、可任意组合、无命名冲突\n" +
          "```\n\n" +
          "## 异步组件\n\n" +
          "```javascript\n" +
          "import { defineAsyncComponent } from 'vue';\n" +
          "const AsyncComp = defineAsyncComponent({\n" +
          "  loader: () => import('./Heavy.vue'),\n" +
          "  loadingComponent: LoadingSpinner,\n" +
          "  errorComponent: ErrorDisplay,\n" +
          "  delay: 200,   // 200ms 后才显示 loading（避免闪烁）\n" +
          "  timeout: 5000, // 超时\n" +
          "});\n" +
          "```\n\n" +
          "## Vue2 vs Vue3 关键差异\n\n" +
          "| Vue2 | Vue3 |\n|------|------|\n| Options API | Composition API + Options API |\n| Object.defineProperty | Proxy |\n| 单根节点 | 多根节点（Fragment） |\n| Vue.set() | 不需要（Proxy 自动检测） |\n| .sync 修饰符 | v-model 支持多个绑定 |\n| filters | ❌ 移除（用 computed 替代） |",
      },
      {
        id: "vue-04",
        title: "Vue3 Composable（Hooks）封装：设计思想、最佳实践与踩坑指南",
        tags: ["Vue3", "Composable", "封装"],
        excerpt: "深入理解 Vue3 组合式函数的封装原则、状态管理、副作用处理、可测试性设计",
        content:
          "## Composable 是什么？\n\n" +
          "Composable 是利用 Vue3 Composition API 封装有状态逻辑的函数。类比 React Hooks。\n\n" +
          "```javascript\n" +
          "// 一个简单的 useMouse composable\n" +
          "import { ref, onMounted, onUnmounted } from 'vue';\n" +
          "export function useMouse() {\n" +
          "  const x = ref(0);\n" +
          "  const y = ref(0);\n" +
          "  function update(e) { x.value = e.pageX; y.value = e.pageY; }\n" +
          "  onMounted(() => window.addEventListener('mousemove', update));\n" +
          "  onUnmounted(() => window.removeEventListener('mousemove', update));\n" +
          "  return { x, y };\n" +
          "}\n" +
          "// 组件中：const { x, y } = useMouse();\n" +
          "```\n\n" +
          "**Composable vs Mixin：** ① 来源清晰（import 路径可追溯） ② 无命名冲突（解构重命名） ③ 可组合（composable 之间互相调用） ④ 类型安全（完整 TS 推断）\n\n" +
          "## 封装 Composable 的五大原则\n\n" +
          "### ① 输入参数使用 ref 或普通值 — 灵活调用\n\n" +
          "```javascript\n" +
          "import { ref, watch, unref } from 'vue';\n" +
          "export function useTitle(newTitle) {\n" +
          "  const title = ref(newTitle);\n" +
          "  watch(title, (val) => { document.title = val; }, { immediate: true });\n" +
          "  return title;\n" +
          "}\n" +
          "// 用法 1：传字符串\nconst title = useTitle('首页');\n" +
          "// 用法 2：传 ref\nconst name = ref('首页'); useTitle(name);\n" +
          "```\n\n" +
          "**关键技巧：** 用 `unref()` 统一处理 ref/普通值，不用自己写 isRef 判断。\n\n" +
          "### ② 返回值用 ref/reactive — 保持响应式\n\n" +
          "```javascript\n" +
          "export function useCounter(initial = 0) {\n" +
          "  const count = ref(initial);\n" +
          "  const double = computed(() => count.value * 2);\n" +
          "  function increment() { count.value++; }\n" +
          "  return { count, double, increment }; // ✅ 返回 ref/computed → 解构后仍响应式\n" +
          "}\n" +
          "// ❌ 不要返回 count.value → 丢失响应式！\n" +
          "```\n\n" +
          "### ③ 副作用必须清理 — 防止内存泄漏\n\n" +
          "```javascript\n" +
          "export function useEventListener(target, event, handler) {\n" +
          "  onMounted(() => target.addEventListener(event, handler));\n" +
          "  onUnmounted(() => target.removeEventListener(event, handler)); // ✅ 必须！\n" +
          "}\n" +
          "// 定时器、Observer、fetch abort 都需要在 onUnmounted 中清理\n" +
          "```\n\n" +
          "### ④ 关注点分离 — Composable 之间互相调用\n\n" +
          "```javascript\n" +
          "// useUserProfile.js — 组合多个 composable\n" +
          "import { useUser } from './useUser';\n" +
          "import { useTitle } from './useTitle';\n" +
          "export function useUserProfile(userId) {\n" +
          "  const { user, loading, fetchUser } = useUser();       // ← 嵌套使用\n" +
          "  const title = useTitle(user.value?.name || '...');     // ← 嵌套使用\n" +
          "  onMounted(() => fetchUser(userId.value));\n" +
          "  return { user, loading, title };\n" +
          "}\n" +
          "```\n\n" +
          "### ⑤ 可测试性设计 — 依赖注入\n\n" +
          "```javascript\n" +
          "// ❌ 写死 API → 测试困难\nexport function useUser() { return axios.get('/api/user'); }\n" +
          "// ✅ 注入 fetcher → 可 mock\nexport function useUser(fetcher = fetch) {\n" +
          "  const user = ref(null);\n" +
          "  async function load(url) { user.value = await fetcher(url).then(r => r.json()); }\n" +
          "  return { user, load };\n" +
          "}\n" +
          "```\n\n" +
          "## Composable 的四种常见类型模板\n\n" +
          "```javascript\n" +
          "// ① 状态管理型 — 封装数据和修改方法\n" +
          "export function useToggle(initial = false) {\n" +
          "  const state = ref(initial);\n" +
          "  const toggle = () => state.value = !state.value;\n" +
          "  return { state, toggle, setTrue: () => state.value = true, setFalse: () => state.value = false };\n" +
          "}\n\n" +
          "// ② 副作用型 — 封装生命周期和清理\n" +
          "export function useDebounce(fn, delay = 300) {\n" +
          "  let timer = null;\n" +
          "  const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };\n" +
          "  onUnmounted(() => clearTimeout(timer));\n" +
          "  return debounced;\n" +
          "}\n\n" +
          "// ③ 数据请求型 — 封装 loading/error/data 三态\n" +
          "export function useAsync(asyncFn, immediate = false) {\n" +
          "  const data = ref(null), error = ref(null), loading = ref(false);\n" +
          "  async function execute(...args) {\n" +
          "    loading.value = true; error.value = null;\n" +
          "    try { data.value = await asyncFn(...args); }\n" +
          "    catch (e) { error.value = e; }\n" +
          "    finally { loading.value = false; }\n" +
          "  }\n" +
          "  if (immediate) execute();\n" +
          "  return { data, error, loading, execute };\n" +
          "}\n\n" +
          "// ④ 工具型 — 封装 DOM/浏览器 API\n" +
          "export function useLocalStorage(key, defaultValue) {\n" +
          "  const stored = localStorage.getItem(key);\n" +
          "  const value = ref(stored ? JSON.parse(stored) : defaultValue);\n" +
          "  watch(value, (v) => localStorage.setItem(key, JSON.stringify(v)), { deep: true });\n" +
          "  return value;\n" +
          "}\n" +
          "```\n\n" +
          "## 封装 6 个踩坑点\n\n" +
          "```javascript\n" +
          "// 坑①：在 setup 上下文外调用 composable\n" +
          "// ❌ export function useX() { onMounted(...) } — 在普通函数中调用\n" +
          "// ✅ 必须在 setup() 或 <script setup> 中同步调用\n\n" +
          "// 坑②：竞态条件（race condition）→ 请求顺序错乱\n" +
          "export function useSearch(query) {\n" +
          "  const results = ref([]);\n" +
          "  let requestId = 0;\n" +
          "  watch(query, async (q) => {\n" +
          "    const id = ++requestId;\n" +
          "    const res = await fetch(\`/api?q=\${q}\`).then(r => r.json());\n" +
          "    if (id === requestId) results.value = res; // ← 关键！只取最新请求\n" +
          "  });\n" +
          "  return results;\n" +
          "}\n\n" +
          "// 坑③：状态定义在 Composable 外部 → 被所有组件共享\n" +
          "// ❌ const count = ref(0); export function useCounter() { return { count } }\n" +
          "// ✅ export function useCounter() { const count = ref(0); return { count } }\n\n" +
          "// 坑④：异步 loading 闪烁 → 加延迟显示 watchEffect + setTimeout 最小 200ms\n\n" +
          "// 坑⑤：解构 reactive 丢失响应式 → 用 toRefs 解构\n" +
          "export function useUser() {\n" +
          "  const state = reactive({ name: 'Alice', age: 25 });\n" +
          "  return { ...toRefs(state) }; // ✅ 解构后每个属性仍是 ref\n" +
          "}\n\n" +
          "// 坑⑥：effectScope 批量管理副作用\n" +
          "import { effectScope } from 'vue';\n" +
          "const scope = effectScope();\n" +
          "scope.run(() => { useA(); useB(); }); // 所有 watch/computed 统一管理\n" +
          "scope.stop(); // 一键停止所有 effect！（插件/动态组件场景）\n" +
          "```\n\n" +
          "## 封装检查清单\n\n" +
          "```\n" +
          "□ 输入：是否兼容 ref 和普通值（unref 处理）？\n" +
          "□ 输出：返回的是 ref/reactive 还是普通值（是否保持响应式）？\n" +
          "□ 清理：所有 timer/event/Observer 在 onUnmounted 中清了吗？\n" +
          "□ 竞态：异步请求是否处理了过期响应（requestId 标记）？\n" +
          "□ 单例：状态是否定义在函数内部（避免跨组件共享）？\n" +
          "□ 测试：依赖是否可以注入 mock？\n" +
          "□ 命名：是否以 use 开头？\n" +
          "□ TypeScript：是否有完整类型标注？\n" +
          "```",
      },
      {
        id: "vue-05",
        title: "computed / watch / watchEffect 三者的区别与使用场景",
        tags: ["Vue3", "computed", "watch"],
        excerpt: "彻底搞清三个 API 的核心区别、执行时机、适用场景，再也不混淆",
        content:
          "## 一句话区别\n\n" +
          "```\n" +
          "computed    → 声明式派生值（有缓存、有返回值）\n" +
          "watch       → 监听特定数据源的变化后执行副作用（无返回值、可取旧值）\n" +
          "watchEffect → 自动追踪依赖的 watch（不用写依赖、立即执行）\n" +
          "```\n\n" +
          "## computed — 声明式计算属性\n\n" +
          "```javascript\n" +
          "import { ref, computed } from 'vue';\n" +
          "const firstName = ref('Zhang');\n" +
          "const lastName = ref('San');\n\n" +
          "// ① 只读 computed（默认）\n" +
          "const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`);\n" +
          "console.log(fullName.value); // 'Zhang San'\n\n" +
          "// ② 可写 computed\n" +
          "const fullName2 = computed({\n" +
          "  get: () => \`\${firstName.value} \${lastName.value}\`,\n" +
          "  set(val) { [firstName.value, lastName.value] = val.split(' '); },\n" +
          "});\n" +
          "fullName2.value = 'Li Si'; // firstName 和 lastName 同时更新\n" +
          "```\n\n" +
          "**核心特性：**\n" +
          "- 有缓存！依赖不变不会重新计算\n" +
          "- 懒执行：只有被访问时才计算（没人读就不算）\n" +
          "- 必须有返回值\n" +
          "- computed 属性本身是 ref（用 .value 访问）\n\n" +
          "## watch — 精确监听\n\n" +
          "```javascript\n" +
          "import { ref, reactive, watch } from 'vue';\n\n" +
          "// ① 监听 ref\n" +
          "const count = ref(0);\n" +
          "watch(count, (newVal, oldVal) => {\n" +
          "  console.log(\`count: \${oldVal} → \${newVal}\`);\n" +
          "});\n\n" +
          "// ② 监听 reactive 属性（需要 getter 函数）\n" +
          "const state = reactive({ count: 0 });\n" +
          "watch(() => state.count, (newVal, oldVal) => {\n" +
          "  console.log(newVal, oldVal);\n" +
          "});\n\n" +
          "// ③ 监听多个源\n" +
          "watch([count, () => state.count], ([newCount, newStateCount], [oldCount, oldStateCount]) => {\n" +
          "  // 任一源变化都触发\n" +
          "});\n\n" +
          "// ④ 深度监听\n" +
          "watch(() => state, (newVal) => { console.log('深层变化'); }, { deep: true });\n" +
          "// 或直接传 reactive 对象自动深度监听\n" +
          "watch(state, (newVal) => { console.log('自动 deep'); });\n\n" +
          "// ⑤ 立即执行\n" +
          "watch(count, (newVal) => { console.log('立即执行'); }, { immediate: true });\n" +
          "// 等价于 watchEffect 但能拿到旧值？不 — watchEffect 拿不到旧值\n" +
          "```\n\n" +
          "**核心特性：**\n" +
          "- 需要显式声明监听源\n" +
          "- 能访问旧值（oldVal）\n" +
          "- 默认懒执行（immediate: true 才立即执行）\n" +
          "- 适合：数据变化后做异步请求、操作 DOM、写 localStorage\n\n" +
          "## watchEffect — 自动追踪 + 立即执行\n\n" +
          "```javascript\n" +
          "import { ref, watchEffect } from 'vue';\n\n" +
          "const todoId = ref(1);\n" +
          "const data = ref(null);\n\n" +
          "// 立即执行一次，自动追踪内部依赖，依赖变化后重新执行\n" +
          "watchEffect(async () => {\n" +
          "  const response = await fetch(\`/api/todo/\${todoId.value}\`);\n" +
          "  data.value = await response.json();\n" +
          "  // 自动追踪 todoId.value → todoId 变了就重新执行\n" +
          "});\n" +
          "// 代码中不需要声明 \"监听 todoId\"，Vue 自动识别依赖关系\n" +
          "\n" +
          "// watchEffect 返回停止函数\n" +
          "const stop = watchEffect(() => { /* ... */ });\n" +
          "stop(); // 手动停止\n" +
          "```\n\n" +
          "**核心特性：**\n" +
          "- 自动追踪依赖（不用手动写监听源）\n" +
          "- 立即执行（不像 watch 默认懒执行）\n" +
          "- 拿不到旧值\n" +
          "- 适合：简化 watch 的懒执行 + immediate: true 场景\n\n" +
          "## 三者的使用场景矩阵\n\n" +
          "```javascript\n" +
          "// ① 从已有数据派生新数据 → computed\n" +
          "const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`);\n" +
          "const filtered = computed(() => list.value.filter(i => i.active));\n\n" +
          "// ② 数据变化后做副作用、需要旧值 → watch\n" +
          "watch(query, async (newQuery, oldQuery) => {\n" +
          "  if (newQuery !== oldQuery) {\n" +
          "    results.value = await searchAPI(newQuery);\n" +
          "  }\n" +
          "});\n" +
          "watch(() => props.userId, (newId) => {\n" +
          "  fetchUser(newId); // props 变化重新请求\n" +
          "});\n\n" +
          "// ③ 依赖较多不想手动写、需要立即执行 → watchEffect\n" +
          "watchEffect(() => {\n" +
          "  localStorage.setItem('form', JSON.stringify(formData.value)); // 自动追踪 formData\n" +
          "});\n\n" +
          "// ❌ computed 做异步/副作用 → 不行\n" +
          "// computed(() => fetch('/api').then(...)) // 错误！computed 不支持异步\n" +
          "// ❌ watchEffect 用 computed 替代 → 不行\n" +
          "// computed 有缓存、有返回值；watchEffect 无返回值、不缓存\n" +
          "```\n\n" +
          "## computed vs watchEffect 的互替性\n\n" +
          "```javascript\n" +
          "// 需求：根据 a 和 b 计算 c\n" +
          "// ✅ computed — 更语义化，有缓存\n" +
          "const c = computed(() => a.value + b.value);\n" +
          "// ❌ watchEffect — 也能实现但浪费，无缓存\n" +
          "const c = ref(0);\n" +
          "watchEffect(() => { c.value = a.value + b.value; });\n\n" +
          "// 但 computed 无法做下面的事 → 必须 watchEffect\n" +
          "watchEffect(() => {\n" +
          "  document.title = title.value;\n" +
          "  // ↑ 这是副作用！computed 不应该有副作用\n" +
          "});\n" +
          "```\n\n" +
          "## watchEffect vs watch + immediate: true\n\n" +
          "```javascript\n" +
          "// 下面两个代码效果一样：\n" +
          "watchEffect(() => { console.log(count.value); });\n" +
          "watch(count, () => { console.log(count.value); }, { immediate: true });\n\n" +
          "// 区别：\n" +
          "// ① watchEffect 自动追踪依赖 → 少写代码\n" +
          "//     watchEffect 内部用到 count 和 name → 两者任一变化都触发\n" +
          "//     watch 需要手动传 [count, name]\n\n" +
          "// ② watchEffect 拿不到旧值 → 需要旧值用 watch\n" +
          "watch(count, (newVal, oldVal) => { if (newVal !== oldVal) { /* ... */ } });\n\n" +
          "// ③ 复杂依赖用 watchEffect 更简洁\n" +
          "watchEffect(() => {\n" +
          "  // 内部用了 a.value, b.value[0], c.value.x → 三者任一变化都触发\n" +
          "});\n" +
          "// 等价 watch 写法会很啰嗦\n" +
          "watch([a, () => b.value[0], () => c.value.x], () => { /* ... */ });\n" +
          "```\n\n" +
          "## 核心对比表\n\n" +
          "| 特性 | computed | watch | watchEffect |\n" +
          "|------|----------|-------|-------------|\n" +
          "| 有缓存 | ✅ | ❌ | ❌ |\n" +
          "| 有返回值 | ✅ | ❌ | ❌ |\n" +
          "| 懒执行 | ✅ | ✅（默认） | ❌（立即执行） |\n" +
          "| 拿旧值 | ❌ | ✅ | ❌ |\n" +
          "| 自动追依赖 | ✅ | ❌（手动声明） | ✅ |\n" +
          "| 支持异步 | ❌ | ✅ | ✅ |\n" +
          "| 函数签名 | computed(fn) | watch(source, fn, opts) | watchEffect(fn) |\n" +
          "| 经典用途 | 派生数据 | 请求/存储/DOM | 自动同步副作用 |\n\n" +
          "## 面试常见追问\n\n" +
          "**Q: 能用 watch 替代 computed 吗？**\n" +
          "技术上可以，但语义不对。computed 有缓存优化，watch 每次依赖变化都重新执行，浪费性能。\n\n" +
          "**Q: watch 和 watchEffect 谁先执行？**\n" +
          "按代码顺序执行。但由于 watchEffect 默认立即执行（相当于 immediate: true），它会在 setup 阶段就执行一次；watch 默认懒执行，先注册不执行。\n\n" +
          "**Q: computed 的值为什么是只读的？**\n" +
          "computed 本质是派生值，应该由源数据单向推导出来。如果设置 computed 值能反向修改源数据，会产生循环依赖。需要双向的场景用 { get, set } 写法。\n\n" +
          "**Q: watchEffect 在哪里停止？**\n" +
          "组件卸载时自动停止，也可以手动停：const stop = watchEffect(() => {...}); stop();\n\n" +
          "## 实战：搜索防抖 + 自动请求\n\n" +
          "```javascript\n" +
          "import { ref, watch } from 'vue';\n" +
          "export function useSearch() {\n" +
          "  const keyword = ref('');\n" +
          "  const results = ref([]);\n" +
          "  const loading = ref(false);\n" +
          "  // 防抖 300ms + 自动请求\n" +
          "  let timer = null;\n" +
          "  watch(keyword, (kw) => {\n" +
          "    clearTimeout(timer);\n" +
          "    if (!kw.trim()) { results.value = []; return; }\n" +
          "    timer = setTimeout(async () => {\n" +
          "      loading.value = true;\n" +
          "      results.value = await fetch(`/api/search?q=${kw}`).then(r => r.json());\n" +
          "      loading.value = false;\n" +
          "    }, 300);\n" +
          "  });\n" +
          "  return { keyword, results, loading };\n" +
          "}\n" +
          "```\n\n" +
          "**组合总结：** computed 做派生 → watch 做副作用(改title/请求/存储) → watchEffect 做自动同步。三者配合使用，不要互相替代。",
      },
      {
        id: "vue-06",
        title: "ref 与 reactive 的区别与使用场景",
        tags: ["Vue3", "ref", "reactive"],
        excerpt: "彻底搞清 ref 与 reactive 的核心区别、底层原理、解包规则与最佳选型",
        content:
          "## ref —— 包装任意值为响应式\n\n" +
          "ref 是 Vue3 最基础、最常用的响应式 API。它把值包装成一个带有 `.value` 属性的对象。\n\n" +
          "```javascript\n" +
          "import { ref } from 'vue';\n\n" +
          "// ① 包装基本类型\n" +
          "const count = ref(0);\n" +
          "console.log(count.value); // 0 — JS 中必须 .value 读写\n" +
          "count.value = 10;         // 修改 → 触发响应式更新\n\n" +
          "// ② 包装对象 — 内部自动用 reactive 处理\n" +
          "const user = ref({ name: 'Alice', age: 25 });\n" +
          "user.value.name = 'Bob';  // 修改属性 → 触发更新\n" +
          "console.log(user.value);  // Proxy { name: 'Bob', age: 25 }\n\n" +
          "// ③ 包装数组\n" +
          "const list = ref([1, 2, 3]);\n" +
          "list.value.push(4);       // ✅ 响应式\n" +
          "list.value = [5, 6];        // ✅ 整体替换也响应式\n" +
          "```\n\n" +
          "### ref 的底层原理\n\n" +
          "```javascript\n" +
          "// ref(0) 等价于 reactive({ value: 0 })\n" +
          "class RefImpl {\n" +
          "  constructor(value) {\n" +
          "    this._value = value;\n" +
          "    this._rawValue = value;\n" +
          "  }\n" +
          "  get value() {\n" +
          "    track(this, 'value');     // 依赖收集\n" +
          "    return this._value;\n" +
          "  }\n" +
          "  set value(newVal) {\n" +
          "    if (newVal !== this._rawValue) {\n" +
          "      this._rawValue = newVal;\n" +
          "      this._value = newVal;\n" +
          "      trigger(this, 'value'); // 触发更新\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "// 核心：通过 class 的 get value() / set value() 劫持 .value 的读写\n" +
          "// 这就是为什么必须 .value ── 只有 .value 才会触发 getter/setter\n" +
          "```\n\n" +
          "### 为什么要 .value？\n\n" +
          "```javascript\n" +
          "// 基本类型是不可变的 —— const a = 0; 你没法\"改变\"0\n" +
          "// 需要包一层对象，通过改对象的属性来触发响应式\n" +
          "// 如果是对象，它直接用内部的 reactive 代理，深层自动追踪\n\n" +
          "const count = ref(0);\n" +
          "// count → { value: 0 }  通过 count.value 触发 getter/setter\n" +
          "// 如果直接暴露 0，JS 里没办法监听\"0 变成 1\"这个过程\n" +
          "```\n\n" +
          "## reactive —— 只接受对象，深层响应式\n\n" +
          "reactive 用 ES6 Proxy 直接代理整个对象，访问属性不需要 .value。\n\n" +
          "```javascript\n" +
          "import { reactive } from 'vue';\n\n" +
          "const state = reactive({\n" +
          "  count: 0,\n" +
          "  user: { name: 'Alice', info: { age: 25 } },\n" +
          "  list: [1, 2, 3],\n" +
          "});\n\n" +
          "// ① 直接读写，不用 .value\n" +
          "state.count++;\n" +
          "state.user.name = 'Bob';      // 深层属性也响应式\n" +
          "state.user.info.age = 30;     // 三层嵌套也响应式！\n" +
          "state.list.push(4);           // 数组方法也响应式\n\n" +
          "// ② 深层代理 — 每一层都是 Proxy\n" +
          "console.log(state.user);        // Proxy { name: 'Bob', info: {...} }\n" +
          "console.log(state.user.info);   // Proxy { age: 30 }\n" +
          "// ⚠️ 代价：每个对象都被 Proxy 包装，有一定性能开销\n" +
          "```\n\n" +
          "### reactive 的底层原理 — ES6 Proxy\n\n" +
          "```javascript\n" +
          "// reactive 本质就是 new Proxy(target, handler)\n" +
          "function reactive(target) {\n" +
          "  return new Proxy(target, {\n" +
          "    get(target, key, receiver) {\n" +
          "      track(target, key);                     // 收集依赖\n" +
          "      const result = Reflect.get(target, key, receiver);\n" +
          "      if (typeof result === 'object' && result !== null) {\n" +
          "        return reactive(result);               // 递归代理深层对象\n" +
          "      }\n" +
          "      return result;\n" +
          "    },\n" +
          "    set(target, key, value, receiver) {\n" +
          "      const old = target[key];\n" +
          "      const ok = Reflect.set(target, key, value, receiver);\n" +
          "      if (old !== value) trigger(target, key); // 触发更新\n" +
          "      return ok;\n" +
          "    },\n" +
          "    deleteProperty(target, key) {\n" +
          "      const had = Object.prototype.hasOwnProperty.call(target, key);\n" +
          "      const ok = Reflect.deleteProperty(target, key);\n" +
          "      if (had) trigger(target, key);           // 删除也触发更新\n" +
          "      return ok;\n" +
          "    },\n" +
          "  });\n" +
          "}\n" +
          "```\n\n" +
          "### reactive 的四大局限\n\n" +
          "```javascript\n" +
          "// 局限①：只能传对象，不能传基本类型\n" +
          "// reactive('hello');  // ❌ 无效，不会报错但不会响应式\n\n" +
          "// 局限②：不能整体替换 —— 致命！\n" +
          "let state = reactive({ count: 0 });\n" +
          "state = reactive({ count: 1 });  // ❌ state 指向新对象，原响应式断开！\n" +
          "// ✅ 解决：用 ref 包装 → ref({ count: 0 })，可以 ref.value = newObj\n\n" +
          "// 局限③：解构会丢失响应式\n" +
          "const state = reactive({ count: 0, name: 'Alice' });\n" +
          "const { count, name } = state;   // ❌ count 就是普通数字 0，不再响应式\n" +
          "// ✅ 解决：用 toRefs 解构\n" +
          "import { toRefs } from 'vue';\n" +
          "const { count, name } = toRefs(state); // count 和 name 都是 ref，保持响应式\n" +
          "count.value = 10; // ✅ 响应式\n\n" +
          "// 局限④：不能像 ref 那样返回值然后 .value 替换\n" +
          "function useX() { return reactive({ count: 0 }); }\n" +
          "// 调用者拿到的是 Proxy，没法整体替换（一替换就断开）\n" +
          "// ✅ 组合式函数推荐返回 ref 或 toRefs 后的对象\n" +
          "```\n\n" +
          "## 模板中的自动解包规则（5 种情况）\n\n" +
          "```html\n" +
          "<template>\n" +
          "  <!-- 情况①：顶层 ref 自动解包 -->\n" +
          "  <p>{{ count }}</p>\n\n" +
          "  <!-- 情况②：reactive 的属性直接访问 -->\n" +
          "  <p>{{ state.name }}</p>\n\n" +
          "  <!-- 情况③：reactive 对象内部嵌套的 ref 自动解包 -->\n" +
          "  <p>{{ obj.nestedRef }}</p>\n" +
          "  <!-- 但如果 nestedRef 存在 reactive 内部，自动解包；否则不解包 -->\n\n" +
          "  <!-- 情况④：数组/Map 内的 ref 不解包！ -->\n" +
          "  <p>{{ arr[0] }}</p>\n" +
          "  <!-- arr 是 reactive 数组，元素是 ref → 不解包！需 arr[0].value -->\n\n" +
          "  <!-- 情况⑤：解构后丢失 ref 的自动解包 -->\n" +
          "  <p>{{ count }}</p>\n" +
          "  <!-- setup return { count } → 顶层，自动解包 ✅ -->\n" +
          "  <!-- setup return { obj: { count } } → 非顶层，不解包 ❌ -->\n" +
          "</template>\n" +
          "```\n\n" +
          "## 核心对比表\n\n" +
          "| 维度 | ref | reactive |\n" +
          "|------|-----|----------|\n" +
          "| 支持类型 | 任意：string/number/boolean/object/array | 仅 object/array/Map/Set |\n" +
          "| JS 中访问 | .value | 直接 . 访问 |\n" +
          "| 底层原理 | class RefImpl + getter/setter | ES6 Proxy 代理整个对象 |\n" +
          "| 模板顶层 | 自动解包（不用 .value） | 直接访问 |\n" +
          "| 深层递归 | 传入对象时内部调 reactive | ✅ 自动递归代理 |\n" +
          "| 整体替换 | ✅ ref.value = newObj | ❌ 重新赋值断开响应 |\n" +
          "| 解构保持 | ✅ 天然是 ref | ❌ 需 toRefs |\n" +
          "| watch 监听 | 直接传 ref | 需 () => state.xxx |\n" +
          "| 组合函数返回 | ✅ 推荐返回 ref | ❌ 不推荐 |\n" +
          "| 内存开销 | 轻量（一个 RefImpl 对象） | 较重（每层都 new Proxy） |\n" +
          "| 新增属性响应 | ref 对象内 ✅（内部是 reactive） | ✅\n" +
          "| 删除属性响应 | ref 对象内 ✅ | ✅\n\n" +
          "## ref 的 .value 时机速查\n\n" +
          "```javascript\n" +
          "const count = ref(0);\n\n" +
          "// ✅ 需要 .value 的地方：\n" +
          "// JS 代码中读写：  count.value++\n" +
          "// 传给 computed：   computed(() => count.value * 2)\n" +
          "// 传给 watch：      watch(count, ...) 不需要！watch(() => count.value, ...) 需要 getter\n" +
          "// 在 setup 中操作：  count.value = 10\n\n" +
          "// ❌ 不需要 .value 的地方：\n" +
          "// 模板中：          <p>{{ count }}</p>\n" +
          "// 作为 reactive 属性：reactive({ count }) → state.count 自动解包\n" +
          "// watch 直接传 ref： watch(count, fn) — Vue 内部自动 unwrap\n" +
          "```\n\n" +
          "## 实战：ref + reactive 组合使用\n\n" +
          "```javascript\n" +
          "import { ref, reactive, toRefs, computed } from 'vue';\n\n" +
          "// 组合式函数 — 返回 ref 便于调用方解构\n" +
          "export function useUser() {\n" +
          "  const loading = ref(false);         // 单个状态 → ref\n" +
          "  const error = ref(null);\n" +
          "  const data = ref(null);             // 需要整体替换 → ref\n" +
          "  async function fetch(id) {\n" +
          "    loading.value = true;\n" +
          "    try { data.value = await api(id); }  // 整体替换 ✅\n" +
          "    catch(e) { error.value = e; }\n" +
          "    finally { loading.value = false; }\n" +
          "  }\n" +
          "  return { loading, error, data, fetch }; // 解构后都是 ref → 响应式\n" +
          "}\n\n" +
          "// 表单场景 — 字段多用 reactive 更简洁\n" +
          "export function useForm() {\n" +
          "  const form = reactive({\n" +
          "    name: '', email: '', password: '', agree: false,\n" +
          "  });\n" +
          "  const errors = reactive({});\n" +
          "  function validate() {\n" +
          "    errors.name = form.name ? '' : '必填';     // 直接赋值，不用 .value\n" +
          "    errors.email = /\\S+@\\S+/.test(form.email) ? '' : '格式不对';\n" +
          "  }\n" +
          "  return { form: toRefs(form), errors }; // toRefs 解构保持响应式\n" +
          "}\n" +
          "```\n\n" +
          "## 选型总结\n\n" +
          "```\n" +
          "单个值（数字/字符串/布尔）→ 必须 ref，reactive 不支持\n" +
          "需要 .value 整体替换               → ref（reactive 一替换就断）\n" +
          "需要解构传给子组件                  → ref 或 reactive + toRefs\n" +
          "表单对象（字段多、不需整体替换）      → reactive（代码更清爽）\n" +
          "组合式函数返回值                    → ref（调用方随便解构）\n" +
          "不确定选哪个                        → ref（永远不会丢失响应式）\n" +
          "```",
      },
      {
        id: "vue-07",
        title: "Vue3 生命周期钩子：每个阶段做了什么，父子组件执行顺序",
        tags: ["Vue3", "生命周期", "钩子"],
        excerpt: "深入理解 Vue3 每个生命周期钩子的触发时机、典型用途与父子组件执行顺序",
        content:
          "## Vue3 生命周期全景图\n\n" +
          "```\n" +
          "┌─── setup() ──────────────────────────────────────────────────┐\n" +
          "│   ① 初始化 props / 创建响应式数据 / computed / watch           │\n" +
          "│   ⚠ 此时还没有组件实例，不能访问 this                         │\n" +
          "├─── 编译模板 → 虚拟 DOM                                        │\n" +
          "│                                                                │\n" +
          "├─── onBeforeMount() ──────────────────────────────────────────┤\n" +
          "│   ② DOM 挂载前 / 最后的 setup 操作                            │\n" +
          "│   用途：SSR 相关                                               │\n" +
          "├─── 创建真实 DOM → 插入页面 → DOM 挂载完成                      │\n" +
          "│                                                                │\n" +
          "├─── onMounted() ──────────────────────────────────────────────┤\n" +
          "│   ③ 可以访问 DOM / 发起请求 / 初始化第三方库                   │\n" +
          "│   用途：fetch 数据、初始化 ECharts/Swiper、操作 DOM             │\n" +
          "│                                                                │\n" +
          "├─── 数据变化 → onBeforeUpdate() ──────────────────────────────┤\n" +
          "│   ④ 响应式数据变化，但 DOM 还没更新                            │\n" +
          "│   用途：获取更新前的 DOM 状态                                   │\n" +
          "├─── 虚拟 DOM 重新渲染 → patch → DOM 更新                         │\n" +
          "│                                                                │\n" +
          "├─── onUpdated() ──────────────────────────────────────────────┤\n" +
          "│   ⑤ DOM 已更新完成                                             │\n" +
          "│   用途：操作更新后的 DOM（注意不要在这里改数据，会死循环）      │\n" +
          "│                                                                │\n" +
          "├─── onBeforeUnmount() ────────────────────────────────────────┤\n" +
          "│   ⑥ 组件即将销毁                                               │\n" +
          "│   用途：清理定时器/事件/订阅（关键！防内存泄漏）                │\n" +
          "├─── 组件卸载 → DOM 移除                                          │\n" +
          "│                                                                │\n" +
          "├─── onUnmounted() ────────────────────────────────────────────┤\n" +
          "│   ⑦ 组件已销毁                                                 │\n" +
          "│   用途：清理第三方实例                                         │\n" +
          "└────────────────────────────────────────────────────────────────┘\n" +
          "```\n\n" +
          "## 每个钩子的典型用法\n\n" +
          "```javascript\n" +
          "import { ref, onMounted, onBeforeUnmount, onBeforeUpdate, onUpdated } from 'vue';\n\n" +
          "export default {\n" +
          "  setup() {\n" +
          "    const list = ref([]);\n" +
          "    let timer = null;\n" +
          "    let observer = null;\n\n" +
          "    // ✅ onMounted — 挂载后：操作DOM/发请求/初始化第三方库\n" +
          "    onMounted(() => {\n" +
          "      fetch('/api/list').then(r => r.json()).then(data => list.value = data);\n" +
          "      timer = setInterval(() => console.log('tick'), 1000);\n" +
          "      observer = new IntersectionObserver(handleVisible);\n" +
          "      observer.observe(document.getElementById('sentinel'));\n" +
          "    });\n\n" +
          "    // ✅ onBeforeUpdate — 更新前：记录滚动位置，更新后恢复\n" +
          "    let savedScroll = 0;\n" +
          "    onBeforeUpdate(() => {\n" +
          "      savedScroll = document.getElementById('list')?.scrollTop || 0;\n" +
          "    });\n" +
          "    onUpdated(() => {\n" +
          "      document.getElementById('list').scrollTop = savedScroll;\n" +
          "    });\n\n" +
          "    // ✅ onBeforeUnmount — 销毁前清理（最重要！）\n" +
          "    onBeforeUnmount(() => {\n" +
          "      clearInterval(timer);       // 清理定时器\n" +
          "      observer?.disconnect();     // 清理 Observer\n" +
          "      // 清理全局事件监听\n" +
          "      window.removeEventListener('resize', handleResize);\n" +
          "    });\n\n" +
          "    return { list };\n" +
          "  },\n" +
          "};\n" +
          "```\n\n" +
          "## 父子组件生命周期执行顺序\n\n" +
          "```\n" +
          "═══ 挂载阶段 ═══                  ═══ 更新阶段 ═══\n" +
          "父 setup()                       父 onBeforeUpdate()\n" +
          "父 onBeforeMount()               子 onBeforeUpdate()\n" +
          "├─ 子 setup()                      子 onUpdated()\n" +
          "├─ 子 onBeforeMount()             父 onUpdated()\n" +
          "├─ 子 onMounted()\n" +
          "父 onMounted()                   ═══ 销毁阶段 ═══\n" +
          "                                   父 onBeforeUnmount()\n" +
          "                                     子 onBeforeUnmount()\n" +
          "                                     子 onUnmounted()\n" +
          "                                   父 onUnmounted()\n" +
          "```\n\n" +
          "**口诀：** 创建时父先 setup，子先 mounted；销毁时父先 beforeUnmount，子先 unmounted。\n\n" +
          "## onActivated / onDeactivated — keep-alive 专属\n\n" +
          "```javascript\n" +
          "import { onActivated, onDeactivated } from 'vue';\n\n" +
          "// 只在 <keep-alive> 包裹的组件中有效\n" +
          "onActivated(() => { console.log('组件被激活（从缓存中取出）'); /* 刷新数据 */ });\n" +
          "onDeactivated(() => { console.log('组件被停用（放入缓存）'); /* 清理临时状态 */ });\n\n" +
          "// ⚠️ onMounted 只在首次创建时调用，onActivated 每次激活都调用！\n" +
          "// 所以被 keep-alive 缓存的组件，数据请求应该放 onActivated 里\n" +
          "```\n\n" +
          "## Vue2 生命周期对照\n\n" +
          "| Vue2 (Options) | Vue3 (Composition) | Vue3 (Options) |\n" +
          "|---|---|---|\n" +
          "| beforeCreate | setup() 本身 | ← 直接写在 setup 里 |\n" +
          "| created | setup() 本身 | ← 直接写在 setup 里 |\n" +
          "| beforeMount | onBeforeMount | beforeMount |\n" +
          "| mounted | onMounted | mounted |\n" +
          "| beforeUpdate | onBeforeUpdate | beforeUpdate |\n" +
          "| updated | onUpdated | updated |\n" +
          "| beforeDestroy | onBeforeUnmount | beforeUnmount |\n" +
          "| destroyed | onUnmounted | unmounted |\n" +
          "| activated | onActivated | activated |\n" +
          "| deactivated | onDeactivated | deactivated |",
      },
      {
        id: "vue-08",
        title: "Vue Router 路由守卫：种类、执行顺序与实战场景",
        tags: ["Vue", "路由", "守卫"],
        excerpt: "全面掌握三种路由守卫的类型、参数、执行顺序与实际应用场景",
        content:
          "## 三种路由守卫\n\n" +
          "```\n" +
          "① 全局守卫：router.beforeEach / router.beforeResolve / router.afterEach\n" +
          "② 路由独享守卫：beforeEnter（写在路由配置里）\n" +
          "③ 组件内守卫：beforeRouteEnter / beforeRouteUpdate / beforeRouteLeave\n" +
          "```\n\n" +
          "## 完整执行顺序（从 A 页面导航到 B 页面）\n\n" +
          "```\n" +
          "① 导航触发\n" +
          "② A 组件：beforeRouteLeave（离开确认）\n" +
          "③ 全局：router.beforeEach（权限校验、登录检查）\n" +
          "④ B 组件：beforeRouteEnter（不能访问 this）\n" +
          "⑤ 路由独享：beforeEnter（特定路由逻辑）\n" +
          "⑥ 全局：router.beforeResolve（解析完成前）\n" +
          "⑦ 导航确认\n" +
          "⑧ 全局：router.afterEach（埋点/标题设置）\n" +
          "⑨ DOM 更新完成\n" +
          "⑩ beforeRouteEnter 的 next 回调执行（此时 this 可用）\n" +
          "```\n\n" +
          "## ① 全局守卫 — 最常用\n\n" +
          "```javascript\n" +
          "import { createRouter } from 'vue-router';\n" +
          "const router = createRouter({ ... });\n\n" +
          "// beforeEach — 权限校验（最常用）\n" +
          "router.beforeEach((to, from, next) => {\n" +
          "  const token = localStorage.getItem('token');\n" +
          "  // 需要登录的页面\n" +
          "  if (to.meta.requiresAuth && !token) {\n" +
          "    next({ path: '/login', query: { redirect: to.fullPath } }); // 记住来源\n" +
          "  } else if (to.path === '/login' && token) {\n" +
          "    next('/'); // 已登录的不用再进登录页\n" +
          "  } else {\n" +
          "    next();\n" +
          "  }\n" +
          "});\n\n" +
          "// beforeResolve — 组件和路由守卫都解析完，导航确认前\n" +
          "router.beforeResolve(async (to) => {\n" +
          "  // 获取用户权限、动态路由等\n" +
          "  if (to.meta.permission && !(await checkPermission(to.meta.permission))) {\n" +
          "    return '/403';\n" +
          "  }\n" +
          "});\n\n" +
          "// afterEach — 导航完成后（没有 next）\n" +
          "router.afterEach((to) => {\n" +
          "  document.title = to.meta.title || '默认标题'; // 改标题\n" +
          "  // 页面访问埋点\n" +
          "  analytics.track('page_view', { page: to.path });\n" +
          "});\n" +
          "```\n\n" +
          "## ② 路由独享守卫\n\n" +
          "```javascript\n" +
          "const routes = [{\n" +
          "  path: '/admin',\n" +
          "  component: Admin,\n" +
          "  beforeEnter: (to, from, next) => {\n" +
          "    // 只在进入 /admin 时触发\n" +
          "    if (!userStore.isAdmin) next('/403');\n" +
          "    else next();\n" +
          "  },\n" +
          "  meta: { requiresAuth: true, permission: 'admin' },\n" +
          "}];\n" +
          "```\n\n" +
          "## ③ 组件内守卫\n\n" +
          "```javascript\n" +
          "export default {\n" +
          "  // beforeRouteEnter — 进入组件前（此时 this 不可用！）\n" +
          "  beforeRouteEnter(to, from, next) {\n" +
          "    // 在路由确认前预先获取数据\n" +
          "    fetchUser(to.params.id).then(user => {\n" +
          "      next(vm => vm.user = user); // 通过 vm 访问组件实例\n" +
          "    });\n" +
          "  },\n\n" +
          "  // beforeRouteUpdate — 路由参数变化（/user/1 → /user/2）\n" +
          "  beforeRouteUpdate(to, from, next) {\n" +
          "    this.fetchData(to.params.id); // this 可用！同一组件，参数变了\n" +
          "    next();\n" +
          "  },\n\n" +
          "  // beforeRouteLeave — 离开当前路由\n" +
          "  beforeRouteLeave(to, from, next) {\n" +
          "    if (this.hasUnsavedChanges) {\n" +
          "      const ok = confirm('有未保存的更改，确定离开吗？');\n" +
          "      next(ok); // false 取消导航，true 继续\n" +
          "    } else {\n" +
          "      next();\n" +
          "    }\n" +
          "  },\n" +
          "};\n" +
          "```\n\n" +
          "## Vue3 组合式 API 写法（onBeforeRouteLeave / onBeforeRouteUpdate）\n\n" +
          "```javascript\n" +
          "import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';\n" +
          "import { ref } from 'vue';\n\n" +
          "const hasChanges = ref(false);\n" +
          "// 在 setup 中直接使用\n" +
          "onBeforeRouteLeave((to, from) => {\n" +
          "  if (hasChanges.value) return confirm('确定离开？'); // return false 取消导航\n" +
          "});\n" +
          "```\n\n" +
          "## 守卫的三个参数\n\n" +
          "| 参数 | 说明 |\n" +
          "|------|------|\n" +
          "| to | 目标路由对象（要去的页面） |\n" +
          "| from | 来源路由对象（来自哪里） |\n" +
          "| next | (Vue2) 放行/重定向回调；(Vue3推荐) return false/路径 |\n\n" +
          "## 实战场景速查\n\n" +
          "| 场景 | 用哪个守卫 |\n" +
          "|------|-----------|\n" +
          "| 登录鉴权 | router.beforeEach |\n" +
          "| 动态路由/权限 | router.beforeResolve |\n" +
          "| 页面标题/埋点 | router.afterEach |\n" +
          "| 离开确认（表单未保存） | beforeRouteLeave |\n" +
          "| 参数变化刷新数据 | beforeRouteUpdate |\n" +
          "| 特定路由权限 | beforeEnter",
      },
      {
        id: "vue-09",
        title: "keep-alive 缓存组件：原理、属性、完整生命周期与最佳实践",
        tags: ["Vue", "keep-alive", "缓存"],
        excerpt: "掌握 keep-alive 的缓存机制、属性详解、完整生命周期链路与实战场景",
        content:
          "## 为什么需要 keep-alive？\n\n" +
          "```html\n" +
          "<!-- ❌ 没有 keep-alive：切换路由时列表页被销毁，回来重新加载 → 白屏闪烁 → 滚动位置丢失 → 筛选状态丢失 -->\n" +
          "<router-view />\n\n" +
          "<!-- ✅ 有 keep-alive：列表页缓存不销毁，回来瞬间恢复 → 保留滚动位置和筛选状态 -->\n" +
          "<keep-alive>\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "```\n\n" +
          "**场景：** 列表页 → 详情页 → 返回列表页。没缓存时列表页重新挂载、重新请求、滚动到顶部，用户体验很差。\n\n" +
          "## keep-alive 的三个属性详解\n\n" +
          "### include — 指定哪些组件被缓存\n" +
          "```html\n" +
          "<!-- ① 字符串：逗号分隔组件名 -->\n" +
          "<keep-alive include=\"Home,List,Search\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n\n" +
          "<!-- ② 数组：动态绑定 -->\n" +
          "<keep-alive :include=\"['Home', 'List']\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n\n" +
          "<!-- ③ 正则：模式匹配 -->\n" +
          "<keep-alive :include=\"/^(Home|List|Search)$/\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "```\n\n" +
          "```javascript\n" +
          "// include 匹配的是组件的 name 选项！不是路由 path！\n" +
          "// ❌ const routes = [{ path: '/home', name: 'homePage', component: Home }]\n" +
          "// ❌ <keep-alive include=\"homePage\"> — 不对！路由 name 不是组件 name\n\n" +
          "// ✅ 组件必须定义 name\n" +
          "export default { name: 'Home', setup() { ... } } // include=\"Home\" 匹配这个\n" +
          "// 或 <script setup> 中的文件名自动作为 name（需插件支持）\n" +
          "// 或 defineOptions({ name: 'Home' }) — Vue 3.3+\n" +
          "```\n\n" +
          "### exclude — 指定哪些组件不缓存\n" +
          "```html\n" +
          "<keep-alive exclude=\"Detail,Login\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "<!-- 除了 Detail 和 Login，其他都缓存 -->\n" +
          "<!-- 优先级：exclude > include — 如果同时匹配，exclude 生效 -->\n" +
          "```\n\n" +
          "### max — 最多缓存实例数（LRU 淘汰）\n" +
          "```html\n" +
          "<keep-alive :max=\"10\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "<!-- 最多缓存 10 个组件实例，第 11 个进来时，最久未使用的被销毁 -->\n" +
          "<!-- 内部用 Map 实现 LRU：每次访问把当前移到最前，淘汰末尾的 -->\n" +
          "```\n\n" +
          "## keep-alive 内部源码简化\n\n" +
          "```javascript\n" +
          "// keep-alive 内部维护一个缓存表和一个 keys 数组\n" +
          "const cache = new Map();         // key: 组件name → value: 组件VNode\n" +
          "const keys = [];                 // 记录访问顺序（LRU 用）\n\n" +
          "// 挂载时：检查当前组件是否在 cache 中\n" +
          "//   → 在：从 cache 取出，返回缓存的 VNode\n" +
          "//   → 不在：正常挂载，然后加入 cache\n\n" +
          "// 挂载后：onActivated 触发（首次挂载 + 缓存激活）\n\n" +
          "// 卸载时：检查是否要被缓存\n" +
          "//   → 要缓存：不销毁，从 DOM 移除后存到内存 → onDeactivated\n" +
          "//   → 不缓存：正常销毁 → onBeforeUnmount → onUnmounted\n" +
          "```\n\n" +
          "## keep-alive 完整生命周期时序\n\n" +
          "```\n" +
          "═══ 场景 1：首次进入列表页 ═══\n" +
          "  setup()               ← 初始化\n" +
          "  onBeforeMount()       ← 即将挂载\n" +
          "  onMounted()           ← DOM 已插入\n" +
          "  onActivated()         ← 组件被激活 ← keep-alive 专属\n" +
          "                        ↑ 首次进入也触发！\n\n" +
          "═══ 场景 2：从列表页切到详情页（列表页被缓存）═══\n" +
          "  onDeactivated()       ← 组件被停用，但仍在内存中\n" +
          "                        ← 不清除 DOM、不销毁实例！\n" +
          "                        ← 此时 savedScroll = el.scrollTop\n\n" +
          "═══ 场景 3：从详情页返回列表页（列表页从缓存激活）═══\n" +
          "  onActivated()         ← 直接激活！不触发 onMounted！\n" +
          "                        ← 在这里恢复滚动位置、刷新数据\n\n" +
          "═══ 场景 4：列表页缓存超过 max 限制被淘汰 ═══\n" +
          "  onBeforeUnmount()     ← 真正开始销毁\n" +
          "  onUnmounted()         ← 销毁完成\n" +
          "```\n\n" +
          "## 完整代码示例：列表页 + keep-alive\n\n" +
          "```vue\n" +
          "<!-- App.vue — 主应用 -->\n" +
          "<template>\n" +
          "  <keep-alive :include=\"cachedViews\" :max=\"8\">\n" +
          "    <router-view />\n" +
          "  </keep-alive>\n" +
          "</template>\n\n" +
          "<script setup>\n" +
          "import { computed } from 'vue';\n" +
          "import { useRouter } from 'vue-router';\n" +
          "const router = useRouter();\n" +
          "// 根据路由 meta 动态决定缓存哪些页面\n" +
          "const cachedViews = computed(() =>\n" +
          "  router.getRoutes()\n" +
          "    .filter(r => r.meta.keepAlive)\n" +
          "    .map(r => r.components?.default?.name || r.name)\n" +
          "    .filter(Boolean)\n" +
          ");\n" +
          "</script>\n" +
          "```\n\n" +
          "```vue\n" +
          "<!-- ListPage.vue — 列表页 -->\n" +
          "<template>\n" +
          "  <div>\n" +
          "    <input v-model=\"keyword\" placeholder=\"搜索\" />\n" +
          "    <div ref=\"listEl\" class=\"list\" @scroll=\"onScroll\">\n" +
          "      <div v-for=\"item in data\" :key=\"item.id\">{{ item.name }}</div>\n" +
          "    </div>\n" +
          "    <button @click=\"toDetail\">去详情</button>\n" +
          "  </div>\n" +
          "</template>\n\n" +
          "<script setup>\n" +
          "import { ref, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue';\n" +
          "import { useRouter } from 'vue-router';\n\n" +
          "defineOptions({ name: 'ListPage' }); // 组件名 → keep-alive 用它匹配\n\n" +
          "const router = useRouter();\n" +
          "const keyword = ref('');\n" +
          "const data = ref([]);\n" +
          "const listEl = ref(null);\n" +
          "let savedScroll = 0;\n\n" +
          "// ❌ onMounted — 只在首次创建时触发\n" +
          "// 适合：初始化第三方库（ECharts/Swiper）— 只需一次\n" +
          "onMounted(() => {\n" +
          "  console.log('onMounted — 仅首次');\n" +
          "});\n\n" +
          "// ✅ onActivated — 每次进入都触发（首次 + 从缓存取出）\n" +
          "// 适合：重新获取数据、恢复 UI 状态\n" +
          "onActivated(() => {\n" +
          "  console.log('onActivated — 每次激活');\n" +
          "  fetchData(keyword.value);           // 重新拉数据（保证是最新的）\n" +
          "  nextTick(() => {\n" +
          "    if (listEl.value) listEl.value.scrollTop = savedScroll; // 恢复滚动位置\n" +
          "  });\n" +
          "});\n\n" +
          "// ✅ onDeactivated — 被缓存时触发\n" +
          "// 适合：保存状态、清理临时资源\n" +
          "onDeactivated(() => {\n" +
          "  console.log('onDeactivated — 被缓存');\n" +
          "  savedScroll = listEl.value?.scrollTop || 0; // 保存滚动位置\n" +
          "  // 清理轮询等临时副作用\n" +
          "});\n\n" +
          "// ✅ onBeforeUnmount — 组件真正销毁前\n" +
          "// 适合：清理所有副作用（定时器、事件、Observer）\n" +
          "onBeforeUnmount(() => {\n" +
          "  console.log('onBeforeUnmount — 真正销毁');\n" +
          "  // 注意：对 keep-alive 页面，这个可能永远不触发（除非被 LRU 淘汰）\n" +
          "});\n" +
          "</script>\n" +
          "```\n\n" +
          "## 生命周期对照表\n\n" +
          "| 钩子 | keep-alive 首次进入 | keep-alive 缓存回来 | keep-alive 被淘汰 | 普通组件 |\n" +
          "|------|--------------------|--------------------|--------------------|------|\n" +
          "| setup() | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onBeforeMount | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onMounted | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onActivated | ✅ | ✅ | ❌ | ❌ |\n" +
          "| onBeforeUpdate | ✅ | ✅ | ❌ | ✅ |\n" +
          "| onUpdated | ✅ | ✅ | ❌ | ✅ |\n" +
          "| onDeactivated | ❌ | ✅(切出时) | ❌ | ❌ |\n" +
          "| onBeforeUnmount | ❌ | ❌ | ✅ | ✅ |\n" +
          "| onUnmounted | ❌ | ❌ | ✅ | ✅ |\n\n" +
          "## 缓存管理实战\n\n" +
          "```javascript\n" +
          "import { ref, nextTick } from 'vue';\n\n" +
          "// ① 强制刷新某个缓存页面 — 临时排除再恢复\n" +
          "const excludeNames = ref([]);\n" +
          "function forceRefresh(pageName) {\n" +
          "  excludeNames.value = [pageName];       // 从缓存中移除 → 触发 onBeforeUnmount\n" +
          "  nextTick(() => { excludeNames.value = []; }); // 马上恢复缓存\n" +
          "}\n\n" +
          "// ② 退出登录时清理所有缓存 — 刷新页面\n" +
          "function clearAllCacheOnLogout() {\n" +
          "  // Vue3: 通过 key 变化强制重建 router-view\n" +
          "  routerViewKey.value++;\n" +
          "  // 或简单 reload: window.location.reload();\n" +
          "}\n\n" +
          "// ③ 根据页面栈动态缓存\n" +
          "const visitedViews = ref([]);\n" +
          "router.afterEach((to) => {\n" +
          "  if (to.meta.keepAlive && !visitedViews.value.includes(to.name)) {\n" +
          "    visitedViews.value.push(to.name);\n" +
          "  }\n" +
          "});\n" +
          "// <keep-alive :include=\"visitedViews\" :max=\"6\">\n" +
          "```\n\n" +
          "## 常见问题\n\n" +
          "```\n" +
          "Q: onMounted 和 onActivated 都触发时，哪个先？\n" +
          "A: onMounted 先 → onActivated 后。首次进入两个都触发。\n\n" +
          "Q: keep-alive 缓存的组件，它的 ref/computed/watch 还在运行吗？\n" +
          "A: 被 deactivated 后，组件实例仍在内存，ref 保持当前值，\n" +
          "   但 watch/watchEffect 会被暂停（Vue 内部处理）。\n" +
          "   激活时 recovered 继续运行。\n\n" +
          "Q: 如何知道组件被缓存了还是被销毁了？\n" +
          "A: onDeactivated → 被缓存了（下次激活走 onActivated）\n" +
          "   onBeforeUnmount → 被销毁了（下次进入走全套生命周期）\n\n" +
          "**场景：** 列表页 → 详情页 → 返回列表页。没缓存时列表页重新挂载、重新请求、滚动到顶部，用户体验很差。\n\n" +
          "## keep-alive 的三个属性详解\n\n" +
          "### include — 指定哪些组件被缓存\n" +
          "```html\n" +
          "<!-- ① 字符串：逗号分隔组件名 -->\n" +
          "<keep-alive include=\"Home,List,Search\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n\n" +
          "<!-- ② 数组：动态绑定 -->\n" +
          "<keep-alive :include=\"['Home', 'List']\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n\n" +
          "<!-- ③ 正则：模式匹配 -->\n" +
          "<keep-alive :include=\"/^(Home|List|Search)$/\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "```\n\n" +
          "```javascript\n" +
          "// include 匹配的是组件的 name 选项！不是路由 path！\n" +
          "// ❌ const routes = [{ path: '/home', name: 'homePage', component: Home }]\n" +
          "// ❌ <keep-alive include=\"homePage\"> — 不对！路由 name 不是组件 name\n\n" +
          "// ✅ 组件必须定义 name\n" +
          "export default { name: 'Home', setup() { ... } } // include=\"Home\" 匹配这个\n" +
          "// 或 <script setup> 中的文件名自动作为 name（需插件支持）\n" +
          "// 或 defineOptions({ name: 'Home' }) — Vue 3.3+\n" +
          "```\n\n" +
          "### exclude — 指定哪些组件不缓存\n" +
          "```html\n" +
          "<keep-alive exclude=\"Detail,Login\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "<!-- 除了 Detail 和 Login，其他都缓存 -->\n" +
          "<!-- 优先级：exclude > include — 如果同时匹配，exclude 生效 -->\n" +
          "```\n\n" +
          "### max — 最多缓存实例数（LRU 淘汰）\n" +
          "```html\n" +
          "<keep-alive :max=\"10\">\n" +
          "  <router-view />\n" +
          "</keep-alive>\n" +
          "<!-- 最多缓存 10 个组件实例，第 11 个进来时，最久未使用的被销毁 -->\n" +
          "<!-- 内部用 Map 实现 LRU：每次访问把当前移到最前，淘汰末尾的 -->\n" +
          "```\n\n" +
          "## keep-alive 内部源码简化\n\n" +
          "```javascript\n" +
          "// keep-alive 内部维护一个缓存表和一个 keys 数组\n" +
          "const cache = new Map();         // key: 组件name → value: 组件VNode\n" +
          "const keys = [];                 // 记录访问顺序（LRU 用）\n\n" +
          "// 挂载时：检查当前组件是否在 cache 中\n" +
          "//   → 在：从 cache 取出，返回缓存的 VNode\n" +
          "//   → 不在：正常挂载，然后加入 cache\n" +
          "// 挂载后：onActivated 触发（首次挂载 + 缓存激活）\n" +
          "// 卸载时：检查是否要被缓存\n" +
          "//   → 要缓存：不销毁，从 DOM 移除后存到内存 → onDeactivated\n" +
          "//   → 不缓存：正常销毁 → onBeforeUnmount → onUnmounted\n" +
          "```\n\n" +
          "## keep-alive 完整生命周期时序\n\n" +
          "```\n" +
          "═══ 场景 1：首次进入列表页 ═══\n" +
          "  setup()               ← 初始化\n" +
          "  onBeforeMount()       ← 即将挂载\n" +
          "  onMounted()           ← DOM 已插入\n" +
          "  onActivated()         ← 组件被激活 ← keep-alive 专属\n" +
          "                        ↑ 首次进入也触发！\n\n" +
          "═══ 场景 2：从列表页切到详情页（列表页被缓存）═══\n" +
          "  onDeactivated()       ← 组件被停用，但仍在内存中\n" +
          "                        ← 不清除 DOM、不销毁实例！\n" +
          "                        ← 此时 savedScroll = el.scrollTop\n\n" +
          "═══ 场景 3：从详情页返回列表页（列表页从缓存激活）═══\n" +
          "  onActivated()         ← 直接激活！不触发 onMounted！\n" +
          "                        ← 在这里恢复滚动位置、刷新数据\n\n" +
          "═══ 场景 4：列表页缓存超过 max 限制被淘汰 ═══\n" +
          "  onBeforeUnmount()     ← 真正开始销毁\n" +
          "  onUnmounted()         ← 销毁完成\n" +
          "```\n\n" +
          "## 完整代码示例：列表页 + keep-alive\n\n" +
          "```vue\n" +
          "<!-- App.vue — 主应用 -->\n" +
          "<template>\n" +
          "  <keep-alive :include=\"cachedViews\" :max=\"8\">\n" +
          "    <router-view />\n" +
          "  </keep-alive>\n" +
          "</template>\n\n" +
          "<script setup>\n" +
          "import { computed } from 'vue';\n" +
          "import { useRouter } from 'vue-router';\n" +
          "const router = useRouter();\n" +
          "// 根据路由 meta 动态决定缓存哪些页面\n" +
          "const cachedViews = computed(() =>\n" +
          "  router.getRoutes()\n" +
          "    .filter(r => r.meta.keepAlive)\n" +
          "    .map(r => r.components?.default?.name || r.name)\n" +
          "    .filter(Boolean)\n" +
          ");\n" +
          "</script>\n" +
          "```\n\n" +
          "```vue\n" +
          "<!-- ListPage.vue — 列表页 -->\n" +
          "<template>\n" +
          "  <div>\n" +
          "    <input v-model=\"keyword\" placeholder=\"搜索\" />\n" +
          "    <div ref=\"listEl\" class=\"list\" @scroll=\"onScroll\">\n" +
          "      <div v-for=\"item in data\" :key=\"item.id\">{{ item.name }}</div>\n" +
          "    </div>\n" +
          "    <button @click=\"toDetail\">去详情</button>\n" +
          "  </div>\n" +
          "</template>\n\n" +
          "<script setup>\n" +
          "import { ref, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue';\n" +
          "import { useRouter } from 'vue-router';\n\n" +
          "defineOptions({ name: 'ListPage' }); // 组件名 → keep-alive 用它匹配\n\n" +
          "const router = useRouter();\n" +
          "const keyword = ref('');\n" +
          "const data = ref([]);\n" +
          "const listEl = ref(null);\n" +
          "let savedScroll = 0;\n\n" +
          "// ❌ onMounted — 只在首次创建时触发\n" +
          "// 适合：初始化第三方库（ECharts/Swiper）— 只需一次\n" +
          "onMounted(() => {\n" +
          "  console.log('onMounted — 仅首次');\n" +
          "});\n\n" +
          "// ✅ onActivated — 每次进入都触发（首次 + 从缓存取出）\n" +
          "// 适合：重新获取数据、恢复 UI 状态\n" +
          "onActivated(() => {\n" +
          "  console.log('onActivated — 每次激活');\n" +
          "  fetchData(keyword.value);           // 重新拉数据（保证是最新的）\n" +
          "  nextTick(() => {\n" +
          "    if (listEl.value) listEl.value.scrollTop = savedScroll; // 恢复滚动位置\n" +
          "  });\n" +
          "});\n\n" +
          "// ✅ onDeactivated — 被缓存时触发\n" +
          "// 适合：保存状态、清理临时资源\n" +
          "onDeactivated(() => {\n" +
          "  console.log('onDeactivated — 被缓存');\n" +
          "  savedScroll = listEl.value?.scrollTop || 0; // 保存滚动位置\n" +
          "  // 清理轮询等临时副作用\n" +
          "});\n\n" +
          "// ✅ onBeforeUnmount — 组件真正销毁前\n" +
          "// 适合：清理所有副作用（定时器、事件、Observer）\n" +
          "onBeforeUnmount(() => {\n" +
          "  console.log('onBeforeUnmount — 真正销毁');\n" +
          "  // 注意：对 keep-alive 页面，这个可能永远不触发（除非被 LRU 淘汰）\n" +
          "});\n" +
          "</script>\n" +
          "```\n\n" +
          "## 生命周期对照表\n\n" +
          "| 钩子 | keep-alive 首次进入 | keep-alive 缓存回来 | keep-alive 被淘汰 | 普通组件 |\n" +
          "|------|--------------------|--------------------|--------------------|------|\n" +
          "| setup() | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onBeforeMount | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onMounted | ✅ | ❌ | ❌ | ✅ |\n" +
          "| onActivated | ✅ | ✅ | ❌ | ❌ |\n" +
          "| onBeforeUpdate | ✅ | ✅ | ❌ | ✅ |\n" +
          "| onUpdated | ✅ | ✅ | ❌ | ✅ |\n" +
          "| onDeactivated | ❌ | ✅(切出时) | ❌ | ❌ |\n" +
          "| onBeforeUnmount | ❌ | ❌ | ✅ | ✅ |\n" +
          "| onUnmounted | ❌ | ❌ | ✅ | ✅ |\n\n" +
          "## 缓存管理实战\n\n" +
          "```javascript\n" +
          "import { ref, nextTick } from 'vue';\n\n" +
          "// ① 强制刷新某个缓存页面 — 临时排除再恢复\n" +
          "const excludeNames = ref([]);\n" +
          "function forceRefresh(pageName) {\n" +
          "  excludeNames.value = [pageName];       // 从缓存中移除 → 触发 onBeforeUnmount\n" +
          "  nextTick(() => { excludeNames.value = []; }); // 马上恢复缓存\n" +
          "}\n\n" +
          "// ② 退出登录时清理所有缓存 — 刷新页面\n" +
          "function clearAllCacheOnLogout() {\n" +
          "  // Vue3: 通过 key 变化强制重建 router-view\n" +
          "  routerViewKey.value++;\n" +
          "  // 或简单 reload: window.location.reload();\n" +
          "}\n\n" +
          "// ③ 根据页面栈动态缓存\n" +
          "const visitedViews = ref([]);\n" +
          "router.afterEach((to) => {\n" +
          "  if (to.meta.keepAlive && !visitedViews.value.includes(to.name)) {\n" +
          "    visitedViews.value.push(to.name);\n" +
          "  }\n" +
          "});\n" +
          "// <keep-alive :include=\"visitedViews\" :max=\"6\">\n" +
          "```\n\n" +
          "## 常见问题\n\n" +
          "```\n" +
          "Q: onMounted 和 onActivated 都触发时，哪个先？\n" +
          "A: onMounted 先 → onActivated 后。首次进入两个都触发。\n\n" +
          "Q: keep-alive 缓存的组件，它的 ref/computed/watch 还在运行吗？\n" +
          "A: 被 deactivated 后，组件实例仍在内存，ref 保持当前值，\n" +
          "   但 watch/watchEffect 会被暂停（Vue 内部处理）。\n" +
          "   激活时 recovered 继续运行。\n\n" +
          "Q: 如何知道组件被缓存了还是被销毁了？\n" +
          "A: onDeactivated → 被缓存了（下次激活走 onActivated）\n" +
          "   onBeforeUnmount → 被销毁了（下次进入走全套生命周期）\n\n" +
          "Q: 缓存太多内存溢出怎么办？\n" +
          "A: 设 :max=\"6\"，LRU 自动淘汰最久未访问的。\n" +
          "   在 onDeactivated 中清理大对象引用：bigData.value = null。\n" +
          "```",
      },
      {
        id: "vue-10",
        title: "nextTick 原理与使用场景：为什么需要它？",
        tags: ["Vue", "nextTick", "异步更新"],
        excerpt: "深入理解 Vue 的异步 DOM 更新机制，掌握 nextTick 的 5 种典型使用场景",
        content:
          "## 为什么需要 nextTick？\n\n" +
          "```javascript\n" +
          "import { ref, nextTick } from 'vue';\n\n" +
          "const count = ref(0);\n" +
          "const el = ref(null);\n\n" +
          "function update() {\n" +
          "  count.value++;\n" +
          "  // ❌ 此时 DOM 还没更新！count.value 是 1 但页面还是 0\n" +
          "  console.log(el.value.textContent); // \"0\" — 拿到的是旧值！\n\n" +
          "  // ✅ nextTick 回调在 DOM 更新后执行\n" +
          "  nextTick(() => {\n" +
          "    console.log(el.value.textContent); // \"1\" — DOM 已更新\n" +
          "  });\n" +
          "}\n" +
          "// Vue 不会在你改数据后立即更新 DOM。它把更新放到一个微任务队列里，\n" +
          "// 等当前同步代码执行完后，统一批量更新。\n" +
          "// nextTick 就是让你在这个\"更新完成后\"的时刻执行代码。\n" +
          "```\n\n" +
          "## Vue 的异步更新机制\n\n" +
          "```\n" +
          "修改响应式数据 → 不会立即更新 DOM\n" +
          "                → 放到一个更新队列中（去重：同一个 Watcher 只入队一次）\n" +
          "                → 在当前同步代码执行完后\n" +
          "                → 统一执行队列中所有更新（批量 DOM 操作）\n" +
          "                → DOM 更新完成\n" +
          "                → nextTick 回调执行\n" +
          "```\n\n" +
          "**为什么这样设计？** 如果每次改数据都立即更新 DOM，修改 100 次数据就会触发 100 次 DOM 操作，性能极差。异步批量更新只触发 1 次。\n\n" +
          "## nextTick 内部实现\n\n" +
          "```javascript\n" +
          "// 简化版 nextTick 实现\n" +
          "const queue = [];\n" +
          "let isFlushing = false;\n\n" +
          "function nextTick(fn) {\n" +
          "  return new Promise(resolve => {\n" +
          "    queue.push(() => { fn?.(); resolve(); });\n" +
          "    if (!isFlushing) {\n" +
          "      isFlushing = true;\n" +
          "      // 优先用 Promise.then（微任务），降级用 setTimeout（宏任务）\n" +
          "      Promise.resolve().then(flushQueue);\n" +
          "    }\n" +
          "  });\n" +
          "}\n\n" +
          "function flushQueue() {\n" +
          "  let job;\n" +
          "  while ((job = queue.shift())) job();\n" +
          "  isFlushing = false;\n" +
          "}\n" +
          "// 本质：nextTick 把回调放到微任务队列中，等同步代码和 DOM 更新都完成后执行\n" +
          "```\n\n" +
          "## nextTick 的 5 种典型使用场景\n\n" +
          "```javascript\n" +
          "import { ref, reactive, nextTick } from 'vue';\n\n" +
          "// 场景①：获取更新后的 DOM 状态\n" +
          "const list = ref([1, 2, 3]);\n" +
          "function addItem() {\n" +
          "  list.value.push(4);\n" +
          "  nextTick(() => {\n" +
          "    const last = document.querySelector('.list li:last-child');\n" +
          "    last.scrollIntoView({ behavior: 'smooth' }); // 滚动到新添加的项\n" +
          "  });\n" +
          "}\n\n" +
          "// 场景②：操作 ref 引用的 DOM 元素\n" +
          "const inputRef = ref(null);\n" +
          "const visible = ref(false);\n" +
          "function showInput() {\n" +
          "  visible.value = true;         // v-if 改为 true → 但 input 还未挂载\n" +
          "  nextTick(() => {\n" +
          "    inputRef.value?.focus();    // ✅ 此时 input 已出现在 DOM 中\n" +
          "  });\n" +
          "}\n\n" +
          "// 场景③：子组件挂载后进行操作\n" +
          "const childRef = ref(null);\n" +
          "onMounted(() => {\n" +
          "  nextTick(() => {\n" +
          "    childRef.value?.someMethod(); // 确保子组件已挂载完成\n" +
          "  });\n" +
          "});\n\n" +
          "// 场景④：在 setup 中等待 DOM 渲染\n" +
          "// 场景⑤：测试中验证 DOM 变化\n" +
          "// await nextTick(); // nextTick 返回 Promise，可以 await！\n" +
          "```\n\n" +
          "## nextTick vs onUpdated\n\n" +
          "| | nextTick | onUpdated |\n" +
          "|------|-----------|----------|\n" +
          "| 触发时机 | 本次数据变更导致的 DOM 更新完成后 | 任何数据变化引起的 DOM 更新后 |\n" +
          "| 作用域 | 回调内，一次性 | 组件内，每次都触发 |\n" +
          "| 场景 | 操作特定的某次 DOM 更新 | 通用的「更新后做某事」 |\n" +
          "| 清理 | 不需要 | 通常不需要，但要小心死循环（改数据→更新→回调改数据→...）|\n\n" +
          "```javascript\n" +
          "// nextTick 可以 await — 写起来更直观\n" +
          "import { ref, nextTick } from 'vue';\n" +
          "const show = ref(false);\n" +
          "async function open() {\n" +
          "  show.value = true;\n" +
          "  await nextTick();               // 等 DOM 更新\n" +
          "  document.getElementById('modal')?.focus();\n" +
          "  // 不需要嵌套回调，代码更扁平\n" +
          "}\n" +
          "```\n\n" +
          "## Vue2 vs Vue3\n\n" +
          "| Vue2 | Vue3 |\n" +
          "|------|------|\n" +
          "| this.$nextTick(cb) | import { nextTick } from 'vue' |\n" +
          "| 返回 undefined | 返回 Promise（可以 await）|\n" +
          "| 不支持 await | ✅ await nextTick() |\n" +
          "| 底层用 Promise/MutationObserver/setTimeout | 底层用 Promise（微任务）|\n\n" +
          "## 常见误用\n\n" +
          "```javascript\n" +
          "// ❌ 不需要 nextTick 的场景\n" +
          "const name = ref('Alice');\n" +
          "name.value = 'Bob';\n" +
          "console.log(name.value); // 'Bob' — ref 的值是同步更新的！\n" +
          "// ↑ ref 的 .value 是立即生效的，不需要 nextTick\n" +
          "// nextTick 只用于需要读 DOM 的场景！\n" +
          "```\n\n" +
          "**核心口诀：** 改了数据后立即要读 DOM → 用 nextTick；只读 JS 数据（ref/reactive）→ 不需要。",
      },
    ],
  },
  typescript: typescriptData as KnowledgeData,
  css: cssData as KnowledgeData,
  html: htmlData as KnowledgeData,
  nodejs: nodejsData as KnowledgeData,
  network: networkData as KnowledgeData,
  security: securityData as KnowledgeData,
  engineering: engineeringData as KnowledgeData,
  miniprogram: miniprogramData as KnowledgeData,
  performance: performanceData as KnowledgeData,
  "design-patterns": designPatternsData as KnowledgeData,
  python: pythonData,
  "js-reverse": jsReverseData,
  postgresql: postgresqlData,
  "k8s-commands": k8sCommandsData,
  "linux-commands": linuxCommandsData,
  git: gitData as unknown as KnowledgeData,
};

export const knowledgeData: Record<string, KnowledgeDataWithSubTopics> = {};

for (const [key, data] of Object.entries(rawDataSources)) {
  knowledgeData[key] = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      subTopics: parseSubTopics(item.content, item.id),
    })),
  };
}

export default function KnowledgeDetail() {
  const { category } = useParams<{ category: string }>();
  const knowledge = category ? knowledgeData[category] : null;
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!knowledge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const allSubTopics = knowledge.items.flatMap((item) =>
    item.subTopics.map((st) => ({ ...st, articleId: item.id, articleTitle: item.title }))
  );

  return (
    <>
      <PageMeta
        title={`${knowledge.name} - 前端面试知识库`}
        description={knowledge.description}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FaArrowLeft />
              返回首页
            </Link>
          </div>

          <header className="mb-6 p-5 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-sm border border-blue-100/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-200">
                {knowledge.icon}
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{knowledge.name}</h1>
                <p className="text-gray-500 text-xs mt-0.5">{knowledge.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><FaBookOpen size={12} />{knowledge.items.length} 篇文章</span>
              <span className="flex items-center gap-1.5"><FaFileCode size={12} />{allSubTopics.length} 个知识点</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledge.items.map((item, idx) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/80 overflow-hidden cursor-pointer"
                onClick={() => {
                  const first = item.subTopics[0];
                  if (first) {
                    window.location.href = `/knowledge/${category}/${item.id}/${first.id}`;
                  }
                }}
              >
                {/* 顶部渐变条 — 交替颜色 */}
                <div className={`h-1.5 ${
                  ["from-blue-500 to-cyan-400","from-purple-500 to-pink-400","from-emerald-500 to-teal-400","from-orange-500 to-rose-400"][idx % 4]
                } bg-gradient-to-r`} />

                <div className="p-4">
                  {/* 标题行 */}
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      ["bg-blue-100 text-blue-700","bg-purple-100 text-purple-700","bg-emerald-100 text-emerald-700","bg-orange-100 text-orange-700"][idx % 4]
                    }`}>
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h2>
                  </div>

                  {/* 摘要 — 更紧凑 */}
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 ml-9">
                    {item.excerpt}
                  </p>

                  {/* 底部：标签 + 子知识点数 */}
                  <div className="flex items-center justify-between ml-9">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{item.tags.length - 3}</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
                      <FaLightbulb size={10} />
                      {item.subTopics.length} 个知识点
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <MobileCategoryDrawer />
        </div>
      </div>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 active:scale-95 animate-fade-in"
          aria-label="返回顶部"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}
