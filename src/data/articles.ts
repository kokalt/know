export interface Article {
  title: string;
  date: string;
  author: string;
  category: string;
  content: string;
  tags: string[];
}

export const articlesData: Record<string, Article> = {
  "13": {
    title: "JS基础语法与数据类型",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 数据类型分类

JavaScript的数据类型分为基本数据类型和引用数据类型两大类。

**基本数据类型（7种）：** undefined、null、boolean、number、string、symbol、bigint

**引用数据类型：** object（包括array、function、date等）

### 基本类型与引用类型的区别

| 特性 | 基本类型 | 引用类型 |
|------|----------|----------|
| 存储位置 | 栈内存 | 堆内存（栈中存地址） |
| 复制方式 | 值复制 | 引用复制 |
| 比较方式 | 值比较 | 引用地址比较 |

基本类型直接存储在栈中，赋值时创建副本；引用类型在堆中存储实际数据，栈中只存储指向堆的指针。

\`\`\`javascript
// 基本类型：值复制
let a = 1;
let b = a;
b = 2;
console.log(a); // 1，a不受影响

// 引用类型：引用复制
let obj1 = { name: 'Vue' };
let obj2 = obj1;
obj2.name = 'React';
console.log(obj1.name); // 'React'，obj1也被修改
\`\`\`

### null和undefined的区别

- **undefined**：变量声明但未赋值，表示"未定义"
- **null**：表示空对象指针，主动设置为空，表示"无值"

\`\`\`javascript
let a;        // undefined，声明未赋值
let b = null; // null，主动赋值为空

typeof undefined; // "undefined"
typeof null;      // "object"（历史遗留bug）
\`\`\`

### 类型判断方法

**typeof运算符：** 能判断undefined、boolean、number、string、symbol、bigint、function，但null返回"object"，数组也返回"object"。

**Object.prototype.toString.call()：** 最准确的类型判断方法。

\`\`\`javascript
Object.prototype.toString.call([]);       // "[object Array]"
Object.prototype.toString.call({});       // "[object Object]"
Object.prototype.toString.call(null);     // "[object Null]"
Object.prototype.toString.call(undefined);// "[object Undefined]"
\`\`\`

### 堆栈内存

- **栈（Stack）**：存储基本类型、函数执行上下文，由系统自动分配和释放，速度快
- **堆（Heap）**：存储引用类型，需要垃圾回收器管理，空间大但速度慢

## 类型转换

### ==和===的区别

- **==（宽松相等）**：会进行隐式类型转换后再比较
- **===（严格相等）**：不进行类型转换，类型不同直接返回false

\`\`\`javascript
0 == false;       // true，0转为false
'' == false;      // true，都转为0
null == undefined;// true，特殊规则
'1' == 1;         // true，字符串转数字

0 === false;      // false，类型不同
null === undefined;// false，类型不同
\`\`\`

### 隐式类型转换规则

字符串与数字相加时，数字转为字符串；相减时，字符串转为数字。

\`\`\`javascript
'1' + 1;   // "11"，字符串拼接
'1' - 1;   // 0，字符串转数字后相减
true + 1;  // 2，true转为1
\`\`\`

## 变量声明

### 变量提升

var声明的变量会提升到作用域顶部，但只有声明提升，赋值不提升。

\`\`\`javascript
console.log(a); // undefined，不是报错
var a = 1;

// 等价于
var a;
console.log(a); // undefined
a = 1;
\`\`\`

### 暂时性死区（TDZ）

let/const声明的变量存在暂时性死区，从作用域开始到声明语句之间访问会报错。

\`\`\`javascript
console.log(a); // ReferenceError
let a = 1;
\`\`\`

### let、const、var三者对比

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 有 | 有(TDZ) | 有(TDZ) |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 修改值 | 允许 | 允许 | 不允许 |

### const的不可变性

const保证的是变量引用的不可变，对于对象来说，内部属性仍然可以修改。

\`\`\`javascript
const obj = { name: 'Vue' };
obj.name = 'React';  // 可以，修改属性
obj.age = 3;         // 可以，添加属性
obj = {};            // 报错，不能重新赋值
\`\`\`

如果需要完全不可变的对象，可以使用Object.freeze()。

### delete关键字

delete用于删除对象的属性，返回布尔值表示是否成功。不能删除用var/let/const声明的变量。

\`\`\`javascript
const obj = { a: 1, b: 2 };
delete obj.a;    // true
console.log(obj); // { b: 2 }

let x = 1;
delete x;        // false，不能删除变量
\`\`\`
    `,
    tags: ["JavaScript", "基础", "数据类型"],
  },
  "14": {
    title: "JS作用域闭包与原型链",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 执行上下文与作用域

### 执行上下文

执行上下文是代码执行的环境，包含变量对象、作用域链、this指向三个核心部分。

**三种类型：**
- 全局执行上下文：程序启动时创建，只有一个
- 函数执行上下文：每次调用函数时创建
- eval执行上下文：执行eval代码时创建

**执行栈：** 采用LIFO（后进先出）结构，全局上下文始终在栈底。

### 作用域

作用域决定了变量的可访问范围。

- **全局作用域**：最外层，所有地方可访问
- **函数作用域**：函数内部，var创建
- **块级作用域**：{}内部，let/const创建（ES6新增）

### 作用域链

当访问变量时，会从当前作用域开始查找，找不到则向上一级作用域查找，直到全局作用域，形成链式查找机制。

\`\`\`javascript
let global = 'global';

function outer() {
  let outerVar = 'outer';

  function inner() {
    let innerVar = 'inner';
    console.log(innerVar);  // 当前作用域找到
    console.log(outerVar);  // 向上级作用域找到
    console.log(global);    // 继续向上找到全局
  }

  inner();
}

outer();
\`\`\`

## 闭包

### 什么是闭包

闭包是指能够访问外部函数作用域变量的函数。即使外部函数已经执行完毕，内部函数仍然可以访问外部函数的变量。

**形成条件：**
- 函数嵌套
- 内部函数引用外部变量
- 内部函数被返回或传递到外部

\`\`\`javascript
function createCounter() {
  let count = 0;  // 外部变量

  return function() {  // 内部函数
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// count变量仍然存在于内存中
\`\`\`

**用途：**
- 数据封装：模拟私有变量
- 函数柯里化：参数复用
- 防抖节流：保持状态

**缺点：**
- 内存泄漏风险：变量不会被GC回收
- 解决：及时解除引用，避免不必要的闭包

## this指向

### this指向规则

- **普通函数**：调用时确定，谁调用指向谁
- **箭头函数**：定义时确定，继承外层this
- **构造函数**：指向新创建的实例
- **call/apply/bind**：指向指定的第一个参数

\`\`\`javascript
const obj = {
  name: 'Vue',
  regular: function() {
    console.log(this.name);  // 'Vue'，obj调用
  },
  arrow: () => {
    console.log(this.name);  // undefined，继承外层
  }
};

obj.regular();
obj.arrow();
\`\`\`

### call、apply、bind区别

| 方法 | 参数形式 | 执行时机 | 返回值 |
|------|----------|----------|--------|
| call | 逐个传参 | 立即执行 | 函数返回值 |
| apply | 数组传参 | 立即执行 | 函数返回值 |
| bind | 逐个传参 | 返回新函数 | 新函数 |

\`\`\`javascript
function greet(greeting, punctuation) {
  console.log(\`\${greeting}, \${this.name}\${punctuation}\`);
}

const person = { name: 'Vue' };

greet.call(person, 'Hello', '!');      // Hello, Vue!
greet.apply(person, ['Hi', '.']);      // Hi, Vue.

const boundGreet = greet.bind(person, 'Hey');
boundGreet('?');                        // Hey, Vue?
\`\`\`

### 箭头函数与普通函数区别

- 没有自己的this，继承定义时的外层this
- 没有arguments对象
- 不能作为构造函数使用（不能用new）
- 没有prototype属性

## 原型链

### 原型相关概念

- **原型（prototype）**：每个函数都有一个prototype属性，指向原型对象
- **原型对象**：包含共享属性和方法的对象
- **原型链**：通过__proto__链接形成的链式结构

\`\`\`javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(\`Hello, I'm \${this.name}\`);
};

const person = new Person('Vue');
person.sayHello();  // Hello, I'm Vue
\`\`\`

### __proto__、prototype、constructor关系

\`\`\`javascript
// 构造函数的prototype指向原型对象
Person.prototype.constructor === Person;  // true

// 实例的__proto__指向构造函数的prototype
person.__proto__ === Person.prototype;    // true

// 原型链终点
Object.prototype.__proto__ === null;      // true
\`\`\`

### JS继承方案

1. **原型链继承**：子类原型等于父类实例，缺点是引用类型共享
2. **构造函数继承**：在子类中call调用父类，缺点是无法继承原型方法
3. **组合继承**：结合以上两种，最常用的ES5继承方式
4. **寄生组合继承**：最优的ES5继承方案
5. **class extends**：ES6语法糖，底层仍是原型继承

### new关键字执行过程

1. 创建一个空对象
2. 将对象的__proto__指向构造函数的prototype
3. 将this绑定到新对象，执行构造函数
4. 如果构造函数返回对象则返回该对象，否则返回新对象

\`\`\`javascript
function myNew(Constructor, ...args) {
  // 1. 创建空对象，设置原型
  const obj = Object.create(Constructor.prototype);

  // 2. 绑定this并执行构造函数
  const result = Constructor.apply(obj, args);

  // 3. 返回结果
  return result instanceof Object ? result : obj;
}
\`\`\`

### ES6 class与ES5构造函数区别

- class必须通过new调用，直接调用会报错
- class不存在变量提升
- class内部定义的方法不可枚举
- class支持extends继承，语法更清晰
    `,
    tags: ["JavaScript", "作用域", "闭包", "原型链"],
  },
  "15": {
    title: "JS异步编程与事件循环",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 事件循环机制

### JS单线程模型

JavaScript是单线程语言，同一时间只能执行一个任务。这样设计是为了避免DOM操作冲突，简化编程模型。

### 事件循环完整流程

1. 执行同步代码（宏任务）
2. 执行栈清空后，执行所有微任务
3. 渲染UI（如果需要）
4. 取下一个宏任务执行
5. 重复上述过程

**宏任务（MacroTask）：** setTimeout、setInterval、I/O操作、UI渲染

**微任务（MicroTask）：** Promise.then/catch/finally、MutationObserver、process.nextTick（Node.js）

\`\`\`javascript
console.log('1');  // 同步，立即执行

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3');  // 微任务
});

console.log('4');  // 同步，立即执行

// 输出顺序：1 -> 4 -> 3 -> 2
\`\`\`

### 宏任务与微任务区别

- 微任务优先级高于宏任务
- 每个宏任务执行完后，会清空所有微任务队列
- 微任务在当前宏任务结束前执行，宏任务在下一次循环执行

### setTimeout为什么不准时

- 最小延迟为4ms（HTML5规范，嵌套调用时）
- 受事件循环影响，需等待当前任务完成才能执行
- 浏览器标签页后台运行时，最小延迟可能增加到1000ms

## Promise

### Promise解决的问题

Promise解决了回调地狱问题，提供了更优雅、可读性更强的异步处理方式，支持链式调用和错误统一处理。

### Promise三种状态

- **pending（进行中）**：初始状态
- **fulfilled（已成功）**：操作成功完成
- **rejected（已失败）**：操作失败

**重要：** 状态只能从pending变为fulfilled或rejected，且只能改变一次。

### Promise常用方法

- **then**：处理成功回调，返回新的Promise支持链式调用
- **catch**：处理失败回调，捕获前面任何错误
- **finally**：无论成功失败都执行，常用于清理工作
- **all**：所有Promise都成功才成功，一个失败就失败
- **race**：谁先完成就用谁的结果
- **allSettled**：等待所有Promise完成，返回每个的结果

\`\`\`javascript
// Promise.all示例
Promise.all([
  fetch('/api/user'),
  fetch('/api/posts')
]).then(([user, posts]) => {
  // 两个请求都成功才执行
});

// Promise.race示例
Promise.race([
  fetchData(),
  timeout(5000)
]).then(result => {
  // 谁快用谁
});
\`\`\`

### async/await

async/await是Generator + Promise的语法糖，使异步代码看起来像同步代码，提高可读性。

\`\`\`javascript
async function getUserData() {
  try {
    const user = await fetch('/api/user');
    const posts = await fetch(\`/api/posts/\${user.id}\`);
    return { user, posts };
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
\`\`\`

**异常捕获：** 使用try...catch包裹await表达式，或者在async函数后链式调用.catch()。
    `,
    tags: ["JavaScript", "异步", "Promise", "Event Loop"],
  },
  "16": {
    title: "ES6+新特性全解析",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 新语法特性

### 解构赋值

解构赋值允许从数组或对象中提取值，赋值给变量。

\`\`\`javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4];
console.log(a);    // 1
console.log(rest); // [3, 4]

// 对象解构
const { name, age, city = 'Beijing' } = { name: 'Vue', age: 3 };
console.log(city); // 'Beijing'，默认值

// 交换变量
let x = 1, y = 2;
[x, y] = [y, x];
\`\`\`

### 模板字符串

模板字符串使用反引号，支持换行和表达式嵌入。

\`\`\`javascript
const name = 'Vue';
const version = 3;

// 传统拼接
const msg1 = 'Hello, ' + name + ' v' + version;

// 模板字符串
const msg2 = \`Hello, \${name} v\${version}\`;

// 多行字符串
const html = \`
  <div>
    <h1>\${name}</h1>
  </div>
\`;
\`\`\`

### 箭头函数

箭头函数提供简洁的函数语法，没有自己的this。

\`\`\`javascript
// 传统函数
const add1 = function(a, b) {
  return a + b;
};

// 箭头函数
const add2 = (a, b) => a + b;

// 注意事项
const obj = {
  name: 'Vue',
  regular: function() {
    console.log(this.name);  // 'Vue'
  },
  arrow: () => {
    console.log(this.name);  // undefined，继承外层
  }
};
\`\`\`

### 扩展运算符

扩展运算符可以将数组或对象展开。

\`\`\`javascript
// 数组合并
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2];  // [1, 2, 3, 4]

// 对象合并
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const mergedObj = { ...obj1, ...obj2 };  // { a: 1, b: 2 }

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
\`\`\`

## 新数据结构

### Set和Map

**Set：** 成员唯一的集合，适合去重。

\`\`\`javascript
const set = new Set([1, 2, 2, 3]);
console.log(set.size);  // 3

// 常用方法
set.add(4);
set.delete(1);
set.has(2);     // true
set.clear();
\`\`\`

**Map：** 键值对集合，键可以是任意类型。

\`\`\`javascript
const map = new Map();
map.set('name', 'Vue');
map.set(1, 'number key');
map.set({}, 'object key');

console.log(map.get('name'));  // 'Vue'
console.log(map.size);         // 3
\`\`\`

### WeakSet和WeakMap

弱引用数据结构，不影响垃圾回收，键只能是对象，不可遍历。

\`\`\`javascript
const weakMap = new WeakMap();
const obj = {};
weakMap.set(obj, 'value');
// obj被销毁后，weakMap中的条目也会被GC回收
\`\`\`

## 数组新方法

### 常用数组方法对比

| 方法 | 作用 | 返回值 | 改变原数组 |
|------|------|--------|------------|
| map | 映射转换 | 新数组 | 否 |
| forEach | 遍历 | undefined | 否 |
| filter | 过滤 | 新数组 | 否 |
| reduce | 累积计算 | 累积值 | 否 |
| find | 查找第一个匹配 | 元素 | 否 |
| some | 是否有满足条件的 | boolean | 否 |
| every | 是否都满足条件 | boolean | 否 |

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// map：每个元素乘以2
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// filter：筛选偶数
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// reduce：求和
const sum = numbers.reduce((acc, n) => acc + n, 0);  // 15
\`\`\`

## 模块化

### ES6 Module与CommonJS区别

| 特性 | ES6 Module | CommonJS |
|------|------------|----------|
| 加载方式 | 编译时静态分析 | 运行时动态加载 |
| 输出 | 引用（实时绑定） | 值拷贝 |
| 顶层this | undefined | module对象 |
| 浏览器支持 | 原生支持 | 需要打包工具 |

\`\`\`javascript
// ES6 Module
export const name = 'Vue';
export default App;
import { name } from './module';

// CommonJS
module.exports = { name: 'Vue' };
const { name } = require('./module');
\`\`\`

### 可选链和空值合并

\`\`\`javascript
// 可选链：安全访问深层属性
const city = user?.address?.city;
callback?.();

// 空值合并：仅null/undefined时使用默认值
const value = input ?? 'default';

// 与||的区别
0 || 'default';    // 'default'，0是falsy
0 ?? 'default';    // 0，0不是null/undefined
\`\`\`

### Symbol

Symbol创建唯一值，常用作对象私有属性键。

\`\`\`javascript
const ID = Symbol('id');
const obj = {
  [ID]: 123,
  name: 'Vue'
};

console.log(obj[ID]);     // 123
console.log(Object.keys(obj));  // ['name']，Symbol属性不可枚举
\`\`\`

### Iterator和for...of

Iterator是遍历接口，for...of自动调用Iterator遍历可迭代对象。

\`\`\`javascript
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next());  // { value: 1, done: false }
console.log(iterator.next());  // { value: 2, done: false }
console.log(iterator.next());  // { value: 3, done: false }
console.log(iterator.next());  // { value: undefined, done: true }

// for...of自动调用Iterator
for (const item of arr) {
  console.log(item);
}
\`\`\`
    `,
    tags: ["JavaScript", "ES6", "新特性"],
  },
  "17": {
    title: "DOM/BOM与浏览器原理",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## DOM事件

### 事件流

事件流描述了事件传播的顺序，分为三个阶段：

1. **捕获阶段**：从window向下传播到目标元素
2. **目标阶段**：到达目标元素
3. **冒泡阶段**：从目标元素向上传播到window

\`\`\`javascript
// 第三个参数控制是否在捕获阶段监听
element.addEventListener('click', handler, true);   // 捕获阶段
element.addEventListener('click', handler, false);  // 冒泡阶段（默认）
\`\`\`

### 事件委托

事件委托利用事件冒泡，将子元素的事件绑定到父元素上处理。

**好处：**
- 减少事件绑定数量，节省内存
- 动态添加的子元素自动生效
- 便于统一管理

\`\`\`javascript
// 传统方式：每个li都绑定事件
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleClick);
});

// 事件委托：只在ul上绑定一次
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    handleClick(e);
  }
});
\`\`\`

### 阻止事件传播

\`\`\`javascript
element.addEventListener('click', (e) => {
  e.stopPropagation();   // 阻止事件继续传播（冒泡或捕获）
  e.preventDefault();    // 阻止默认行为（如链接跳转、表单提交）
  e.stopImmediatePropagation();  // 阻止同一元素上的其他监听器
});
\`\`\`

## BOM对象

### 常见BOM对象

- **window**：全局对象，代表浏览器窗口
- **location**：当前URL信息
- **history**：浏览历史记录
- **navigator**：浏览器信息和用户代理
- **screen**：屏幕信息

### location方法区别

\`\`\`javascript
location.href = 'https://example.com';     // 跳转，记录历史
location.replace('https://example.com');   // 跳转，不记录历史
location.reload();                         // 刷新页面
location.assign('https://example.com');    // 同href
\`\`\`

## 浏览器缓存

### 强缓存

强缓存期间浏览器直接使用本地缓存，不发送请求。

**控制字段：**
- Cache-Control: max-age=3600（优先级高）
- Expires: GMT格式的时间戳

### 协商缓存

协商缓存会发送请求到服务器，服务器判断资源是否变化。

**控制字段：**
- ETag/If-None-Match：基于内容哈希，更精确
- Last-Modified/If-Modified-Since：基于修改时间

服务器返回304表示资源未变化，使用本地缓存。

## 跨域

### 同源策略

协议、域名、端口任一不同即为跨域。同源策略限制不同源之间的资源访问。

### 跨域解决方案

**CORS（跨域资源共享）：** 服务端设置Access-Control-Allow-Origin头，最标准的解决方案。

\`\`\`javascript
// 服务端设置
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
\`\`\`

**JSONP：** 利用script标签不受同源限制的特性，仅支持GET请求。

\`\`\`javascript
// 前端
const script = document.createElement('script');
script.src = 'https://api.example.com/data?callback=handleData';
document.body.appendChild(script);

function handleData(data) {
  console.log(data);
}
\`\`\`

**代理服务器：** 开发环境常用，通过同源服务器转发请求。

**postMessage：** 用于iframe或窗口间通信。

## 前端安全

### XSS攻击防御

XSS（跨站脚本攻击）通过在页面注入恶意脚本窃取用户信息。

**防御方案：**
- 转义用户输入的特殊字符
- 设置CSP内容安全策略
- Cookie设置HttpOnly防止JS读取

### CSRF攻击防御

CSRF（跨站请求伪造）诱导用户在已登录状态下执行非预期操作。

**防御方案：**
- Token验证：请求携带随机Token
- SameSite Cookie：限制Cookie发送范围
- 验证Referer头

## 性能优化

### 回流与重绘

**回流（重排）：** 元素布局发生变化，需要重新计算位置和大小，触发后续元素重新布局。

**重绘：** 元素样式变化但不影响布局，如颜色、背景色变化。

**回流一定触发重绘，重绘不一定触发回流。**

**优化建议：**
- 批量修改DOM，减少回流次数
- 使用transform代替top/left改变位置
- 使用visibility代替display:none
- 避免频繁读取会触发回流的属性（offsetWidth、clientHeight等）

\`\`\`javascript
// 不好：多次触发回流
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// 好：一次性修改
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';

// 或使用classList
element.classList.add('active');
\`\`\`
    `,
    tags: ["JavaScript", "DOM", "浏览器", "安全"],
  },
  "18": {
    title: "JS手写代码题精选",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 深拷贝实现

深拷贝需要递归复制对象的所有层级，并处理循环引用。

\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  // 处理基本类型和null
  if (obj === null || typeof obj !== 'object') return obj;

  // 处理循环引用
  if (map.has(obj)) return map.get(obj);

  // 创建副本
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);

  // 递归复制属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }

  return clone;
}

// 测试
const original = { a: 1, b: { c: 2 } };
original.b.self = original;  // 循环引用
const cloned = deepClone(original);
\`\`\`

**关键点：** 使用WeakMap记录已拷贝的对象，避免循环引用导致栈溢出。

## call/apply/bind实现

### call实现

call将函数的this指向指定对象，并立即执行。

\`\`\`javascript
Function.prototype.myCall = function(context, ...args) {
  // 处理context为null/undefined的情况
  context = context || window;

  // 用Symbol创建唯一属性名，避免冲突
  const fn = Symbol();
  context[fn] = this;

  // 执行函数并保存结果
  const result = context[fn](...args);

  // 删除临时属性
  delete context[fn];

  return result;
};

// 测试
function greet(greeting) {
  return \`\${greeting}, \${this.name}\`;
}
const person = { name: 'Vue' };
greet.myCall(person, 'Hello');  // "Hello, Vue"
\`\`\`

### apply实现

apply与call类似，只是参数以数组形式传入。

\`\`\`javascript
Function.prototype.myApply = function(context, args = []) {
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};
\`\`\`

### bind实现

bind返回一个新函数，this永久绑定到指定对象。

\`\`\`javascript
Function.prototype.myBind = function(context, ...args) {
  const fn = this;

  return function(...newArgs) {
    // 支持new调用
    if (this instanceof fn) {
      return new fn(...args, ...newArgs);
    }
    return fn.apply(context, [...args, ...newArgs]);
  };
};
\`\`\`

## 防抖与节流

### 防抖

防抖是在事件触发后等待一段时间再执行，如果期间再次触发则重新计时。

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;

  return function(...args) {
    // 清除之前的定时器
    clearTimeout(timer);

    // 重新设置定时器
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用场景：搜索框输入
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce((e) => {
  console.log('搜索:', e.target.value);
}, 300));
\`\`\`

### 节流

节流是在规定时间内只执行一次函数。

\`\`\`javascript
function throttle(fn, delay) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();

    // 距离上次执行超过delay才执行
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用场景：滚动事件
window.addEventListener('scroll', throttle(() => {
  console.log('滚动中');
}, 200));
\`\`\`

## Promise实现

### 简易Promise

\`\`\`javascript
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else if (this.status === 'rejected') {
        try {
          const result = onRejected(this.reason);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else {
        this.onFulfilledCallbacks.push(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }
}
\`\`\`

### Promise.all实现

\`\`\`javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        value => {
          results[index] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
        reject
      );
    });
  });
};
\`\`\`

## new操作符实现

\`\`\`javascript
function myNew(Constructor, ...args) {
  // 1. 创建新对象，原型指向构造函数prototype
  const obj = Object.create(Constructor.prototype);

  // 2. 绑定this并执行构造函数
  const result = Constructor.apply(obj, args);

  // 3. 如果构造函数返回对象则返回该对象，否则返回新对象
  return result instanceof Object ? result : obj;
}

// 测试
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  return \`Hello, \${this.name}\`;
};

const person = myNew(Person, 'Vue');
console.log(person.name);       // 'Vue'
console.log(person.sayHello()); // 'Hello, Vue'
\`\`\`

## 数组去重

\`\`\`javascript
// 方法1：Set（最简单）
const unique1 = [...new Set(arr)];

// 方法2：filter + indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 方法3：reduce
const unique3 = arr.reduce((acc, cur) => {
  return acc.includes(cur) ? acc : [...acc, cur];
}, []);
\`\`\`

## 数组扁平化

\`\`\`javascript
// 递归实现
function flatten(arr) {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}

// ES2019 flat方法
const flattened = arr.flat(Infinity);
\`\`\`

## 发布订阅模式

\`\`\`javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // 发布事件
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args));
    }
  }

  // 取消订阅
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  // 只订阅一次
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// 使用
const emitter = new EventEmitter();
emitter.on('data', (msg) => console.log(msg));
emitter.emit('data', 'Hello');
\`\`\`
    `,
    tags: ["JavaScript", "手写", "编程题"],
  },
  "19": {
    title: "JS进阶与实战场景",
    date: "2026-06-09",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 垃圾回收机制

### 标记清除算法

现代浏览器主要使用标记清除算法进行垃圾回收。

**工作流程：**
1. 从根对象（全局对象、当前执行栈）出发，标记所有可达对象
2. 清除未被标记的对象，释放内存

**优点：** 能处理循环引用问题

### 引用计数算法

记录每个对象的引用次数，引用数为0时回收。

**问题：** 无法处理循环引用

\`\`\`javascript
// 循环引用示例
function problem() {
  const obj1 = {};
  const obj2 = {};
  obj1.ref = obj2;
  obj2.ref = obj1;
  // 即使函数执行完毕，两个对象引用数都不为0
}
\`\`\`

### 内存泄漏常见场景

- **全局变量**：意外创建的全局变量不会被回收
- **未清除的定时器**：setInterval/setTimeout未clear
- **闭包引用**：闭包持有外部变量引用
- **DOM引用**：移除DOM后仍持有引用
- **事件监听**：未移除的事件监听器

**排查工具：** Chrome DevTools Memory面板，使用Heap Snapshot对比内存变化。

\`\`\`javascript
// 内存泄漏示例
let timer = setInterval(() => {
  console.log('running');
}, 1000);

// 修复：组件卸载时清除
clearInterval(timer);
\`\`\`

## 类型判断

### 判断数组的方法

\`\`\`javascript
// 方法1：Array.isArray（推荐）
Array.isArray(arr);

// 方法2：Object.prototype.toString
Object.prototype.toString.call(arr) === '[object Array]';

// 方法3：instanceof（跨iframe有问题）
arr instanceof Array;

// 方法4：constructor
arr.constructor === Array;
\`\`\`

**推荐Array.isArray**，因为它能正确处理跨iframe的情况。

## 精度问题

### 大数精度丢失

JavaScript使用IEEE 754双精度浮点数，有效数字约15-17位。

\`\`\`javascript
0.1 + 0.2;           // 0.30000000000000004
9007199254740992 + 1; // 9007199254740992，精度丢失
\`\`\`

**解决方案：**

1. **BigInt**：处理大整数
\`\`\`javascript
const bigNum = 9007199254740993n;
bigNum + 1n;  // 9007199254740994n
\`\`\`

2. **decimal.js**：处理小数精度
\`\`\`javascript
import Decimal from 'decimal.js';
new Decimal(0.1).plus(0.2).toNumber();  // 0.3
\`\`\`

3. **转为整数计算**：金额计算时转为分
\`\`\`javascript
const price = 10.5;
const cents = Math.round(price * 100);  // 1050
\`\`\`

## 函数式编程

### 函数柯里化

将多参数函数转换为一系列单参数函数。

\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    // 参数足够，执行原函数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 参数不足，返回新函数继续收集
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// 使用
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3);      // 6
curriedAdd(1, 2)(3);      // 6
curriedAdd(1)(2, 3);      // 6
\`\`\`

### 高阶函数

接收函数作为参数或返回函数的函数。

**常见高阶函数：** map、filter、reduce、sort

\`\`\`javascript
// 自定义高阶函数：compose
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const double = x => x * 2;
const addOne = x => x + 1;
const transform = compose(double, addOne);
transform(5);  // 12，先加1得6，再乘2得12
\`\`\`

## 性能优化

### JS层面优化策略

- **减少DOM操作**：批量修改，使用DocumentFragment
- **使用事件委托**：减少事件监听器数量
- **防抖节流**：控制高频事件执行频率
- **Web Worker**：将密集计算放到后台线程
- **虚拟列表**：只渲染可视区域元素

### requestAnimationFrame vs setTimeout

| 特性 | rAF | setTimeout |
|------|-----|------------|
| 执行时机 | 下次重绘前 | 指定延迟后 |
| 帧率同步 | 是（通常60fps） | 否 |
| 后台标签页 | 暂停执行 | 继续执行（延迟增加） |
| 适用场景 | 动画 | 定时任务 |

\`\`\`javascript
// 推荐用于动画
function animate() {
  // 更新动画
  element.style.transform = \`translateX(\${x}px)\`;

  // 请求下一帧
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
\`\`\`

### 虚拟列表实现思路

虚拟列表只渲染可视区域的元素，大幅减少DOM节点数量。

**核心步骤：**
1. 计算容器高度和单个项目高度
2. 根据滚动位置计算起始索引
3. 只渲染可视区域的项目
4. 使用padding或transform保持滚动条正确

\`\`\`javascript
// 简化版虚拟列表逻辑
const itemHeight = 50;
const visibleCount = 10;

function getVisibleItems(scrollTop, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, totalItems);

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight
  };
}
\`\`\`
    `,
    tags: ["JavaScript", "进阶", "性能优化"],
  },
  "7": {
    title: "Vue基础面试题精选",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## Vue核心理解

### Vue的理解及与jQuery区别

Vue是一套用于构建用户界面的渐进式JavaScript框架，采用MVVM架构模式。

**与jQuery的区别：**
- **数据驱动 vs DOM操作**：Vue通过数据绑定自动更新视图，jQuery需要手动操作DOM
- **组件化**：Vue支持组件化开发，jQuery是命令式编程
- **响应式系统**：Vue有完善的响应式数据追踪机制
- **生态完善**：Vue有路由、状态管理等完整生态

### Vue的核心特性

- **响应式数据绑定**：数据变化自动更新视图
- **组件化系统**：可复用的组件架构
- **指令系统**：v-if、v-for、v-model等内置指令
- **虚拟DOM**：高效的DOM更新机制
- **生命周期钩子**：完整的组件生命周期管理
- **过渡动画**：内置过渡效果支持

### MVVM模式解析

MVVM（Model-View-ViewModel）是一种软件架构模式：
- **Model**：数据模型
- **View**：视图层
- **ViewModel**：连接Model和View的桥梁

Vue中：
- Model对应data中的数据
- View对应模板渲染的DOM
- ViewModel对应Vue实例，负责数据绑定和DOM更新

### 单向数据流与双向绑定

**单向数据流**：父组件通过props向子组件传递数据，子组件不能直接修改props

**双向绑定**：v-model实现表单输入和应用状态之间的双向绑定，本质是语法糖

\`\`\`vue
<!-- v-model等价于 -->
<input :value="message" @input="message = $event.target.value" />
\`\`\`

## 指令系统

### v-model原理及自定义实现

v-model是:value和@input的语法糖。

**自定义组件实现v-model：**

\`\`\`vue
<!-- 子组件 -->
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>
\`\`\`

### v-if和v-for优先级

**v-for优先级高于v-if**。

不建议一起使用的原因：
- 每次渲染都会遍历整个列表，即使大部分元素被v-if过滤
- 性能浪费，应该用computed先过滤数据

\`\`\`vue
<!-- 不推荐 -->
<li v-for="item in list" v-if="item.active">{{ item.name }}</li>

<!-- 推荐 -->
<li v-for="item in activeList">{{ item.name }}</li>

<script>
computed: {
  activeList() {
    return this.list.filter(item => item.active);
  }
}
</script>
\`\`\`

### v-if和v-show区别

| 特性 | v-if | v-show |
|------|------|--------|
| 实现方式 | 条件渲染（销毁/重建） | CSS display切换 |
| 初始渲染 | 惰性（false时不渲染） | 始终渲染 |
| 切换开销 | 高 | 低 |
| 适用场景 | 条件很少改变 | 频繁切换 |

### 常用Vue指令

- **v-bind**（:）：动态绑定属性
- **v-on**（@）：事件监听
- **v-model**：双向数据绑定
- **v-if/v-else/v-else-if**：条件渲染
- **v-for**：列表渲染
- **v-show**：条件显示
- **v-html**：渲染HTML
- **v-text**：渲染文本
- **v-cloak**：防止闪烁
- **v-once**：只渲染一次

## 计算属性与侦听器

### computed和methods区别

- **缓存**：computed有缓存，依赖不变不会重新计算；methods每次调用都执行
- **使用方式**：computed作为属性使用；methods需要调用
- **适用场景**：computed适合复杂计算；methods适合事件处理

### computed和watch区别

| 特性 | computed | watch |
|------|----------|-------|
| 返回值 | 有返回值 | 无返回值 |
| 缓存 | 有缓存 | 无缓存 |
| 适用场景 | 派生数据 | 异步操作、开销大的操作 |

### watch配置项

\`\`\`javascript
watch: {
  obj: {
    handler(newVal, oldVal) {
      console.log(newVal);
    },
    immediate: true,  // 立即执行一次
    deep: true        // 深度监听对象内部变化
  }
}
\`\`\`

## 列表与Key

### key的作用

- 帮助Vue识别节点，高效更新虚拟DOM
- 保持组件状态正确对应

**不建议用index的原因：**
- 列表顺序变化时会导致错误的状态对应
- 可能引起不必要的组件重用

## 插槽

### 插槽类型

**匿名插槽：**
\`\`\`vue
<!-- 子组件 -->
<slot></slot>

<!-- 父组件 -->
<Child>默认内容</Child>
\`\`\`

**具名插槽：**
\`\`\`vue
<!-- 子组件 -->
<slot name="header"></slot>

<!-- 父组件 -->
<Child>
  <template #header>头部内容</template>
</Child>
\`\`\`

**作用域插槽：**
\`\`\`vue
<!-- 子组件 -->
<slot :item="item"></slot>

<!-- 父组件 -->
<Child v-slot="{ item }">
  {{ item.name }}
</Child>
\`\`\`

## 组件通信

### 通信方式汇总

1. **props/$emit**：父子组件通信
2. **$parent/$children**：访问父/子实例
3. **provide/inject**：跨级组件通信
4. **$attrs/$listeners**：透传属性和事件
5. **EventBus**：兄弟组件通信
6. **Vuex/Pinia**：全局状态管理
7. **$refs**：访问子组件实例

## 生命周期

### 父子组件生命周期执行顺序

**加载顺序：**
父beforeCreate → 父created → 父beforeMount → 子beforeCreate → 子created → 子beforeMount → 子mounted → 父mounted

**更新顺序：**
父beforeUpdate → 子beforeUpdate → 子updated → 父updated

**销毁顺序：**
父beforeDestroy → 子beforeDestroy → 子destroyed → 父destroyed

## 路由

### 导航守卫

- **全局**：beforeEach、beforeResolve、afterEach
- **路由独享**：beforeEnter
- **组件内**：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

### $route vs $router

- $route：当前路由信息对象
- $router：路由实例，用于导航

### 路由懒加载

\`\`\`javascript
const Home = () => import('./views/Home.vue');
\`\`\`

### hash vs history

- **hash**：URL带#，兼容性好
- **history**：URL干净，需要后端配置fallback

### 路由传参

- **params**：/user/:id
- **query**：/user?id=1
    `,
    tags: ["Vue", "基础", "面试题"],
  },
  "8": {
    title: "Vue进阶与组件化开发",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 组件化基础

### 组件化的好处

组件化是将页面拆分成独立、可复用的部分。

**好处：**
- 提高代码复用性
- 便于维护和测试
- 降低耦合度
- 团队协作更高效

### 父子组件传值方式

**父传子：props**
\`\`\`vue
<!-- 父组件 -->
<Child :message="msg" />

<!-- 子组件 -->
<script>
export default {
  props: ['message']
}
</script>
\`\`\`

**子传父：$emit**
\`\`\`vue
<!-- 子组件 -->
<button @click="$emit('update', data)">发送</button>

<!-- 父组件 -->
<Child @update="handleUpdate" />
\`\`\`

**跨级：provide/inject**
\`\`\`javascript
// 祖先组件
provide() {
  return { theme: 'dark' };
}

// 后代组件
inject: ['theme']
\`\`\`

**兄弟组件：EventBus或Vuex**

### $attrs和$listeners作用

- **$attrs**：包含父作用域中不作为prop被识别的特性绑定
- **$listeners**：包含父作用域中的v-on事件监听器（Vue2）

用于高阶组件的属性透传。

### provide和inject使用场景

**使用场景：**
- 深层嵌套组件通信
- 主题配置、语言设置等全局配置

**优点：**
- 避免props逐层传递
- 代码更简洁

**缺点：**
- 数据流向不清晰
- 难以追踪数据来源

## 高级组件

### 递归组件

组件自身调用自身，用于树形结构渲染。

\`\`\`vue
<!-- TreeNode.vue -->
<template>
  <div>
    {{ node.name }}
    <TreeNode v-for="child in node.children" :node="child" />
  </div>
</template>

<script>
export default {
  name: 'TreeNode',  // 必须设置name
  props: ['node']
}
</script>
\`\`\`

### 动态组件

\`\`\`vue
<component :is="currentComponent" />

<script>
data() {
  return {
    currentComponent: 'Home'  // 组件名称
  }
}
</script>
\`\`\`

### 异步组件

\`\`\`javascript
// Vue2
components: {
  AsyncComp: () => import('./AsyncComp.vue')
}

// Vue3
const AsyncComp = defineAsyncComponent(() => import('./AsyncComp.vue'))
\`\`\`

## 组件缓存

### keep-alive实现组件缓存

\`\`\`vue
<keep-alive include="Home,About">
  <component :is="currentView" />
</keep-alive>
\`\`\`

**生命周期钩子：**
- activated：组件激活时调用
- deactivated：组件停用时调用

**属性：**
- include：缓存的组件名
- exclude：不缓存的组件名
- max：最大缓存数量

## 混入Mixin

### mixin优缺点

**优点：**
- 代码复用
- 逻辑抽取

**缺点：**
- 命名冲突
- 来源不清晰
- 隐式依赖

**合并规则：**
- 数据对象：递归合并，冲突时组件优先
- 钩子函数：合并为数组，都执行
- 方法/组件：组件优先

### 解决mixin命名冲突

- 使用命名空间前缀
- 改用Composition API
- 使用组合式函数替代

## 自定义指令

### 自定义指令实现

\`\`\`javascript
// 全局指令
Vue.directive('focus', {
  inserted(el) {
    el.focus();
  }
});

// 局部指令
directives: {
  focus: {
    inserted(el) {
      el.focus();
    }
  }
}
\`\`\`

**钩子函数：**
- bind：只调用一次，指令第一次绑定
- inserted：被绑定元素插入父节点
- update：所在组件VNode更新
- componentUpdated：指令所在组件VNode及其子VNode全部更新
- unbind：只调用一次，指令解绑

### 防抖自定义指令

\`\`\`javascript
Vue.directive('debounce', {
  bind(el, binding) {
    let timer;
    el.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
      }, 300);
    });
  }
});
\`\`\`

## 其他

### 过滤器filter

\`\`\`javascript
// 全局过滤器
Vue.filter('capitalize', function(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// 使用
{{ message | capitalize }}
\`\`\`

**注意：** Vue3已移除过滤器，推荐使用computed或方法。

### 函数式组件

无状态、无实例的组件，渲染开销更低。

\`\`\`vue
<!-- Vue2 -->
<template functional>
  <div>{{ props.message }}</div>
</template>

<!-- Vue3 -->
<script>
export default {
  functional: true,
  render(h, context) {
    return h('div', context.props.message);
  }
}
</script>
\`\`\`
    `,
    tags: ["Vue", "进阶", "组件化"],
  },
  "9": {
    title: "Vue核心原理深度解析",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 响应式原理

### Vue2响应式实现

Vue2使用Object.defineProperty实现数据劫持：

\`\`\`javascript
function defineReactive(obj, key, val) {
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend();  // 依赖收集
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify();  // 派发更新
    }
  });
}
\`\`\`

### Object.defineProperty缺陷

**原因：** ES5标准，兼容性好

**缺陷：**
- 无法检测对象属性的添加或删除
- 无法检测数组索引和长度的变化
- 需要递归遍历所有属性，性能开销大

### 无法监听的数据变化

- 对象新增属性
- 对象删除属性
- 数组通过索引修改
- 数组长度变化

**解决方案：**
\`\`\`javascript
// 新增属性
this.$set(this.obj, 'newKey', value);

// 数组变化
this.$set(this.arr, index, value);
this.arr.splice(index, 1, value);
\`\`\`

### 数组变化监听

重写了7个数组方法：
- push、pop、shift、unshift
- splice、sort、reverse

\`\`\`javascript
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'splice'].forEach(method => {
  arrayMethods[method] = function(...args) {
    const result = arrayProto[method].apply(this, args);
    ob.dep.notify();  // 通知更新
    return result;
  };
});
\`\`\`

### 依赖收集与派发更新

**依赖收集：** getter中收集依赖该数据的Watcher

**派发更新：** setter中通知所有依赖的Watcher更新

### Dep、Watcher、Observer关系

- **Observer**：数据劫持，将数据转为响应式
- **Dep**：依赖收集器，每个响应式属性都有一个Dep
- **Watcher**：观察者，订阅Dep的变化

**流程：** Observer劫持数据 → 读取时Dep收集Watcher → 变化时Dep通知Watcher更新

## 虚拟DOM

### 虚拟DOM优缺点

虚拟DOM是用JavaScript对象描述真实DOM的结构。

**优点：**
- 减少DOM操作，提升性能
- 跨平台能力
- 方便Diff比较

**缺点：**
- 首次渲染有额外开销
- 简单场景可能不如直接操作DOM

### Vue渲染流程

1. **模板编译**：template → AST → render函数
2. **初次渲染**：执行render生成VNode → patch创建真实DOM
3. **数据更新**：触发setter → notify Watcher → 重新render → Diff对比 → patch更新DOM

### Diff算法

Diff算法是比较新旧虚拟DOM树的差异，最小化DOM操作。

**核心原则：**
- 同层比较，不跨层
- key相同认为是同一节点

### Vue2的Diff算法

双端比较策略：
1. 旧头 vs 新头
2. 旧尾 vs 新尾
3. 旧头 vs 新尾
4. 旧尾 vs 新头
5. 以上都不匹配，用key查找

## nextTick

### 数据更新异步原因

- 批量更新，避免频繁DOM操作
- 保证数据一致性

### nextTick原理

利用微任务队列（Promise/MutationObserver）或宏任务（setTimeout）

\`\`\`javascript
let callbacks = [];
let pending = false;

function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks);
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  copies.forEach(cb => cb());
}
\`\`\`

### nextTick使用场景

- 获取更新后的DOM
- 确保数据更新完成后再执行操作

\`\`\`javascript
this.message = 'new';
this.$nextTick(() => {
  // DOM已更新
  console.log(this.$el.textContent);
});
\`\`\`

## 模板编译

### 模板编译阶段

1. **parse**：模板字符串 → AST
2. **optimize**：标记静态节点
3. **generate**：AST → render函数字符串

### 运行时版本和完整版区别

- **完整版**：包含编译器，可以直接使用template
- **运行时版**：不包含编译器，只能使用render函数或预编译的template

体积：运行时版更小，性能更好。
    `,
    tags: ["Vue", "原理", "响应式"],
  },
  "10": {
    title: "Vue2与Vue3全面对比",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 重大升级

### Vue3相比Vue2的升级

- **响应式系统**：Proxy替代Object.defineProperty
- **组合式API**：Composition API
- **性能优化**：编译时优化、更快的虚拟DOM
- **TypeScript支持**：更好的TS集成
- **新特性**：Teleport、Suspense、Fragment
- **Tree-shaking**：更好的按需引入

## 响应式系统

### Proxy优势

**Object.defineProperty的局限：**
- 无法监听属性增删
- 无法监听数组索引变化
- 需要递归遍历

**Proxy的优势：**
- 可以拦截13种操作
- 天然支持动态属性
- 性能更好，惰性代理

\`\`\`javascript
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    trigger(target, key);
    return Reflect.set(target, key, value, receiver);
  }
});
\`\`\`

### Proxy局限性

- IE不支持（需要polyfill）
- 对某些内置对象（如Map、Set）需要特殊处理

## Composition API

### Composition API和Options API区别

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| 代码组织 | 按选项类型 | 按功能逻辑 |
| 逻辑复用 | mixin | 组合式函数 |
| TS支持 | 一般 | 优秀 |
| 学习曲线 | 低 | 稍高 |

### setup函数特点

- 在beforeCreate之前执行
- 没有this指向
- 返回的对象暴露给模板

\`\`\`javascript
setup(props, context) {
  const count = ref(0);
  const increment = () => count.value++;

  return { count, increment };
}
\`\`\`

### ref和reactive区别

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型+对象 | 仅对象/数组 |
| 访问方式 | .value | 直接访问 |
| 替换 | 可以替换整个值 | 不能替换 |

\`\`\`javascript
const count = ref(0);  // count.value
const state = reactive({ name: 'Vue' });  // state.name
\`\`\`

### toRef、toRefs作用

\`\`\`javascript
const state = reactive({ name: 'Vue', version: 3 });

// toRef：创建单个ref
const nameRef = toRef(state, 'name');

// toRefs：将所有属性转为ref
const { name, version } = toRefs(state);
\`\`\`

**与直接解构的区别：** 直接解构会失去响应性，toRefs保持响应性。

## 生命周期

### Vue3生命周期钩子对照

| Vue2 | Vue3 Options | Vue3 Composition |
|------|--------------|------------------|
| beforeCreate | - | setup() |
| created | - | setup() |
| beforeMount | beforeMount | onBeforeMount |
| mounted | mounted | onMounted |
| beforeUpdate | beforeUpdate | onBeforeUpdate |
| updated | updated | onUpdated |
| beforeDestroy | beforeUnmount | onBeforeUnmount |
| destroyed | unmounted | onUnmounted |

### Vue3新增生命周期钩子

- onRenderTracked：追踪依赖时触发
- onRenderTriggered：依赖变化触发渲染时

## 新组件

### Teleport、Suspense、Fragment

**Teleport：** 将内容渲染到指定DOM位置
\`\`\`vue
<Teleport to="body">
  <Modal />
</Teleport>
\`\`\`

**Suspense：** 处理异步组件加载状态
\`\`\`vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
\`\`\`

**Fragment：** 多根节点组件（无需包裹元素）

## 性能优化

### Vue3 Diff算法优化

引入**最长递增子序列**算法，减少DOM移动操作。

### Vue3编译时优化

**静态提升：** 静态节点提升到render函数外
\`\`\`javascript
// Vue2
render() {
  return h('div', [h('span', 'static')]);
}

// Vue3
const _hoisted_1 = h('span', 'static');
render() {
  return h('div', [_hoisted_1]);
}
\`\`\`

**PatchFlag：** 标记动态节点类型
\`\`\`javascript
h('div', { class: dynamicClass }, [
  h('span', null, text, PatchFlags.TEXT)
])
\`\`\`

**事件缓存：** 静态事件处理器缓存

## 其他变化

### Vue3全局API调整

\`\`\`javascript
// Vue2
Vue.component();
Vue.use();

// Vue3
const app = createApp(App);
app.component();
app.use();
\`\`\`

### defineProps、defineEmits、defineExpose

\`\`\`vue
<script setup>
const props = defineProps(['name']);
const emit = defineEmits(['update']);
const exposed = defineExpose({ method });
</script>
\`\`\`

### Vue3支持TS的优势

- 源码用TS重写
- 更好的类型推导
- 组合式API天然适合TS
    `,
    tags: ["Vue", "Vue3", "对比"],
  },
  "11": {
    title: "Vue工程化与性能优化",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 性能优化

### Vue项目性能优化策略

**加载优化：**
- 路由懒加载
- 组件异步加载
- 图片懒加载
- CDN加速

**运行优化：**
- v-if/v-show合理选择
- v-for加key
- 避免v-if和v-for一起使用
- 合理使用computed缓存
- keep-alive缓存组件

**编译优化：**
- Tree-shaking
- 代码压缩
- gzip压缩

### 首屏加载优化

- 路由懒加载
- 第三方库按需引入
- 图片压缩和懒加载
- SSR服务端渲染
- 预加载关键资源

### 代码分割与分包

\`\`\`javascript
// 路由懒加载
const Home = () => import('./views/Home.vue');

// webpack分包
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\\\/]node_modules[\\\\/]/,
        name: 'vendors'
      }
    }
  }
}
\`\`\`

## 网络请求

### Vue项目跨域配置

**开发环境（vite.config.js）：**
\`\`\`javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
\`\`\`

**生产环境：** Nginx反向代理

### axios二次封装

\`\`\`javascript
import axios from 'axios';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 响应拦截
service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response.status === 401) {
      // 跳转登录
    }
    return Promise.reject(error);
  }
);

export default service;
\`\`\`

### 处理接口重复请求

\`\`\`javascript
const pendingRequests = new Map();

function removePending(config) {
  const key = \`\${config.method}-\${config.url}\`;
  pendingRequests.delete(key);
}

function addPending(config) {
  const key = \`\${config.method}-\${config.url}\`;
  config.cancelToken = new CancelToken(cancel => {
    pendingRequests.set(key, cancel);
  });
}

// 请求拦截中调用addPending
// 响应拦截中调用removePending
\`\`\`

## 状态管理

### Vuex与Pinia区别

| 特性 | Vuex | Pinia |
|------|------|-------|
| Mutation | 需要 | 不需要 |
| TS支持 | 一般 | 优秀 |
| 模块化 | modules | 多个store |
| 体积 | 较大 | 更小 |
| Vue3推荐 | - | ✅ |

### Vuex五大核心概念

- **State**：存储数据
- **Getter**：派生状态
- **Mutation**：同步修改state
- **Action**：异步操作，提交mutation
- **Module**：模块化

### Mutation为什么必须是同步函数

Devtools需要记录状态变化的前后快照，异步操作无法准确追踪。

### Pinia优势

- 更简单的API
- 完整的TS支持
- 无需mutation
- 更好的代码分割
- 体积更小（~1KB）

\`\`\`javascript
// Pinia
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ name: '' }),
  getters: {
    displayName: (state) => \`User: \${state.name}\`
  },
  actions: {
    setName(name) {
      this.name = name;
    }
  }
});
\`\`\`

## 构建工具

### Vite和Webpack区别

| 特性 | Vite | Webpack |
|------|------|---------|
| 启动速度 | 快（按需编译） | 慢（全量打包） |
| HMR | 快速 | 较慢 |
| 生产构建 | Rollup | Webpack |
| 配置复杂度 | 简单 | 复杂 |

### Vite启动更快原因

- 基于ESM，浏览器原生支持
- 按需编译，不打包整个应用
- 依赖预构建

**依赖预构建：** 将CommonJS/UMD转为ESM，合并小模块

## 其他

### 移动端Vue适配方案

- **rem方案**：根据屏幕宽度动态设置html font-size
- **vw方案**：直接使用viewport单位
- **viewport插件**：postcss-px-to-viewport

### 内存泄漏处理

**常见泄漏场景：**
- 未清除的定时器
- 未销毁的事件监听
- 未取消的请求
- 闭包引用

**解决方案：**
\`\`\`javascript
beforeUnmount() {
  clearInterval(this.timer);
  window.removeEventListener('scroll', this.handler);
}
\`\`\`
    `,
    tags: ["Vue", "工程化", "性能优化"],
  },
  "12": {
    title: "Vue实战场景与手写题",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 手写实现

### 简易双向绑定

\`\`\`javascript
class Vue {
  constructor(options) {
    this.$data = options.data;
    this.observe(this.$data);
  }

  observe(data) {
    if (!data || typeof data !== 'object') return;

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(obj, key, value) {
    this.observe(value);
    const dep = [];

    Object.defineProperty(obj, key, {
      get() {
        if (Dep.target) dep.push(Dep.target);
        return value;
      },
      set(newVal) {
        if (newVal === value) return;
        value = newVal;
        dep.forEach(fn => fn());
      }
    });
  }
}
\`\`\`

### 防抖节流自定义指令

\`\`\`javascript
// 防抖指令
Vue.directive('debounce', {
  bind(el, binding) {
    let timer;
    el.addEventListener('click', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
      }, binding.arg || 300);
    });
  }
});

// 节流指令
Vue.directive('throttle', {
  bind(el, binding) {
    let lastTime = 0;
    el.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastTime >= (binding.arg || 300)) {
        lastTime = now;
        binding.value();
      }
    });
  }
});
\`\`\`

### 简易Proxy响应式

\`\`\`javascript
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return typeof result === 'object' ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    }
  });
}
\`\`\`

### 简易nextTick

\`\`\`javascript
let callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  copies.forEach(cb => cb());
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks);
  }
}
\`\`\`

## 组件通信

### 事件总线实现

\`\`\`javascript
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export default new EventBus();
\`\`\`

## 实战场景

### 权限控制实现

**路由权限：**
\`\`\`javascript
router.beforeEach((to, from, next) => {
  const roles = store.getters.roles;
  if (to.meta.roles && !to.meta.roles.includes(roles)) {
    next('/403');
  } else {
    next();
  }
});
\`\`\`

**按钮权限：**
\`\`\`vue
<template>
  <button v-if="hasPermission('edit')">编辑</button>
</template>

<script>
export default {
  methods: {
    hasPermission(permission) {
      return this.permissions.includes(permission);
    }
  }
}
</script>
\`\`\`

### 大数据列表渲染优化

**虚拟列表原理：**
- 只渲染可视区域的元素
- 监听滚动事件动态计算渲染范围

\`\`\`vue
<template>
  <div class="virtual-list" @scroll="onScroll">
    <div :style="{ height: totalHeight }">
      <div :style="{ transform: \`translateY(\${offsetY}px)\` }">
        <div v-for="item in visibleData" :key="item.id">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemHeight: 50,
      visibleCount: 10,
      startIndex: 0
    };
  },
  computed: {
    visibleData() {
      return this.list.slice(this.startIndex, this.startIndex + this.visibleCount);
    },
    offsetY() {
      return this.startIndex * this.itemHeight;
    },
    totalHeight() {
      return this.list.length * this.itemHeight;
    }
  },
  methods: {
    onScroll(e) {
      const scrollTop = e.target.scrollTop;
      this.startIndex = Math.floor(scrollTop / this.itemHeight);
    }
  }
}
</script>
\`\`\`

### 数据更新视图不更新的场景

1. **对象新增属性**：使用\$set
2. **数组索引修改**：使用\$set或splice
3. **异步数据更新后**：使用\$nextTick
4. **v-for key使用index**：改用唯一ID
    `,
    tags: ["Vue", "手写", "实战"],
  },
};
