import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowLeft, FaArrowUp, FaShareAlt } from "react-icons/fa";
import { articlesData } from "@/data/articles";

const articles: Record<string, { title: string; date: string; author: string; category: string; content: string; tags: string[] }> = {
  ...articlesData,
  "7": {
    title: "Vue基础面试题精选（23题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、Vue核心理解

### 1. 说说你对Vue的理解，它和jQuery有什么区别？

Vue是一套用于构建用户界面的渐进式JavaScript框架，采用MVVM架构模式。

**与jQuery的区别：**
- **数据驱动 vs DOM操作**：Vue通过数据绑定自动更新视图，jQuery需要手动操作DOM
- **组件化**：Vue支持组件化开发，jQuery是命令式编程
- **响应式系统**：Vue有完善的响应式数据追踪机制
- **生态完善**：Vue有路由、状态管理等完整生态

### 2. Vue的核心特性有哪些？

- **响应式数据绑定**：数据变化自动更新视图
- **组件化系统**：可复用的组件架构
- **指令系统**：v-if、v-for、v-model等内置指令
- **虚拟DOM**：高效的DOM更新机制
- **生命周期钩子**：完整的组件生命周期管理
- **过渡动画**：内置过渡效果支持

### 3. 什么是MVVM模式？Vue如何体现MVVM？

MVVM（Model-View-ViewModel）是一种软件架构模式：
- **Model**：数据模型
- **View**：视图层
- **ViewModel**：连接Model和View的桥梁

Vue中：
- Model对应data中的数据
- View对应模板渲染的DOM
- ViewModel对应Vue实例，负责数据绑定和DOM更新

### 4. 解释Vue单向数据流和双向绑定

**单向数据流**：父组件通过props向子组件传递数据，子组件不能直接修改props

**双向绑定**：v-model实现表单输入和应用状态之间的双向绑定，本质是语法糖

\`\`\`vue
<!-- v-model等价于 -->
<input :value="message" @input="message = $event.target.value" />
\`\`\`

## 二、指令系统

### 5. v-model的原理是什么？如何自定义组件实现v-model？

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

### 6. v-if和v-for优先级谁更高？为什么不建议两者一起使用？

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

### 7. v-if和v-show的区别、使用场景？

| 特性 | v-if | v-show |
|------|------|--------|
| 实现方式 | 条件渲染（销毁/重建） | CSS display切换 |
| 初始渲染 | 惰性（false时不渲染） | 始终渲染 |
| 切换开销 | 高 | 低 |
| 适用场景 | 条件很少改变 | 频繁切换 |

### 8. 常用的Vue指令有哪些？

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

## 三、计算属性与侦听器

### 9. 计算属性computed和方法methods的区别？

- **缓存**：computed有缓存，依赖不变不会重新计算；methods每次调用都执行
- **使用方式**：computed作为属性使用；methods需要调用
- **适用场景**：computed适合复杂计算；methods适合事件处理

### 10. 计算属性computed和侦听器watch的区别及使用场景？

| 特性 | computed | watch |
|------|----------|-------|
| 返回值 | 有返回值 | 无返回值 |
| 缓存 | 有缓存 | 无缓存 |
| 适用场景 | 派生数据 | 异步操作、开销大的操作 |

### 11. watch有哪些配置项？immediate、deep分别作用是什么？

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

## 四、列表与Key

### 12. Vue中key的作用是什么？为什么不建议用index当key？

**key的作用：**
- 帮助Vue识别节点，高效更新虚拟DOM
- 保持组件状态正确对应

**不建议用index的原因：**
- 列表顺序变化时会导致错误的状态对应
- 可能引起不必要的组件重用

## 五、插槽

### 13. 如何理解Vue中的插槽？

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

## 六、组件通信

### 14. 组件之间通信方式有哪些？

1. **props/$emit**：父子组件通信
2. **$parent/$children**：访问父/子实例
3. **provide/inject**：跨级组件通信
4. **$attrs/$listeners**：透传属性和事件
5. **EventBus**：兄弟组件通信
6. **Vuex/Pinia**：全局状态管理
7. **$refs**：访问子组件实例

## 七、生命周期

### 15. 父子组件生命周期执行顺序是什么？

**加载顺序：**
父beforeCreate → 父created → 父beforeMount → 子beforeCreate → 子created → 子beforeMount → 子mounted → 父mounted

**更新顺序：**
父beforeUpdate → 子beforeUpdate → 子updated → 父updated

**销毁顺序：**
父beforeDestroy → 子beforeDestroy → 子destroyed → 父destroyed

## 八、路由

### 17-23. 路由相关

**导航守卫：**
- 全局：beforeEach、beforeResolve、afterEach
- 路由独享：beforeEnter
- 组件内：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

**$route vs $router：**
- $route：当前路由信息对象
- $router：路由实例，用于导航

**路由懒加载：**
\`\`\`javascript
const Home = () => import('./views/Home.vue');
\`\`\`

**hash vs history：**
- hash：URL带#，兼容性好
- history：URL干净，需要后端配置fallback

**路由传参：**
- params：/user/:id
- query：/user?id=1
    `,
    tags: ["Vue", "基础", "面试题"],
  },
  "8": {
    title: "Vue进阶与组件化开发（20题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、组件化基础

### 1. 什么是组件化？Vue组件化的好处？

组件化是将页面拆分成独立、可复用的部分。

**好处：**
- 提高代码复用性
- 便于维护和测试
- 降低耦合度
- 团队协作更高效

### 2. 父子组件传值有哪些方式？

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

### 3. $attrs和$listeners的作用？

- **$attrs**：包含父作用域中不作为prop被识别的特性绑定
- **$listeners**：包含父作用域中的v-on事件监听器（Vue2）

用于高阶组件的属性透传。

### 4. provide和inject的使用场景、优缺点？

**使用场景：**
- 深层嵌套组件通信
- 主题配置、语言设置等全局配置

**优点：**
- 避免props逐层传递
- 代码更简洁

**缺点：**
- 数据流向不清晰
- 难以追踪数据来源

## 二、高级组件

### 5. 什么是递归组件？如何实现？

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

### 6. 动态组件component标签如何使用？

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

### 7. 异步组件如何定义？

\`\`\`javascript
// Vue2
components: {
  AsyncComp: () => import('./AsyncComp.vue')
}

// Vue3
const AsyncComp = defineAsyncComponent(() => import('./AsyncComp.vue'))
\`\`\`

## 三、组件缓存

### 13. 如何实现组件缓存？keep-alive的原理？

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

## 四、混入Mixin

### 15. 什么是混入mixin？优缺点？

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

### 16. 如何解决mixin命名冲突？

- 使用命名空间前缀
- 改用Composition API
- 使用组合式函数替代

## 五、自定义指令

### 18. 自定义指令如何实现？

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

### 19. 手写防抖自定义指令

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

## 六、其他

### 17. Vue中的过滤器filter如何使用？

\`\`\`javascript
// 全局过滤器
Vue.filter('capitalize', function(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// 使用
{{ message | capitalize }}
\`\`\`

**注意：** Vue3已移除过滤器，推荐使用computed或方法。

### 20. 什么是函数式组件？

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
    title: "Vue核心原理深度解析（17题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、响应式原理

### 1. 说说Vue响应式原理

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

### 2. Vue2为什么用Object.defineProperty？有什么缺陷？

**原因：** ES5标准，兼容性好

**缺陷：**
- 无法检测对象属性的添加或删除
- 无法检测数组索引和长度的变化
- 需要递归遍历所有属性，性能开销大

### 3. Object.defineProperty无法监听哪些数据变化？

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

### 4. Vue如何监听数组变化？

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

### 5. 什么是依赖收集、派发更新？

**依赖收集：** getter中收集依赖该数据的Watcher

**派发更新：** setter中通知所有依赖的Watcher更新

### 6. Dep、Watcher、Observer三者的关系？

- **Observer**：数据劫持，将数据转为响应式
- **Dep**：依赖收集器，每个响应式属性都有一个Dep
- **Watcher**：观察者，订阅Dep的变化

**流程：** Observer劫持数据 → 读取时Dep收集Watcher → 变化时Dep通知Watcher更新

## 二、虚拟DOM

### 7. 什么是虚拟DOM？优缺点？

虚拟DOM是用JavaScript对象描述真实DOM的结构。

**优点：**
- 减少DOM操作，提升性能
- 跨平台能力
- 方便Diff比较

**缺点：**
- 首次渲染有额外开销
- 简单场景可能不如直接操作DOM

### 8. 简述Vue渲染流程

1. **模板编译**：template → AST → render函数
2. **初次渲染**：执行render生成VNode → patch创建真实DOM
3. **数据更新**：触发setter → notify Watcher → 重新render → Diff对比 → patch更新DOM

### 9. 什么是Diff算法？

Diff算法是比较新旧虚拟DOM树的差异，最小化DOM操作。

**核心原则：**
- 同层比较，不跨层
- key相同认为是同一节点

### 10. Vue2的Diff算法执行流程？

双端比较策略：
1. 旧头 vs 新头
2. 旧尾 vs 新尾
3. 旧头 vs 新尾
4. 旧尾 vs 新头
5. 以上都不匹配，用key查找

## 三、nextTick

### 12. 为什么Vue数据更新是异步的？

- 批量更新，避免频繁DOM操作
- 保证数据一致性

### nextTick原理：

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

### 13. nextTick使用场景

- 获取更新后的DOM
- 确保数据更新完成后再执行操作

\`\`\`javascript
this.message = 'new';
this.$nextTick(() => {
  // DOM已更新
  console.log(this.$el.textContent);
});
\`\`\`

## 四、模板编译

### 15. 模板编译过程分为哪几个阶段？

1. **parse**：模板字符串 → AST
2. **optimize**：标记静态节点
3. **generate**：AST → render函数字符串

### 16. 运行时版本和完整版Vue的区别？

- **完整版**：包含编译器，可以直接使用template
- **运行时版**：不包含编译器，只能使用render函数或预编译的template

体积：运行时版更小，性能更好。
    `,
    tags: ["Vue", "原理", "响应式"],
  },
  "10": {
    title: "Vue2与Vue3全面对比（19题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、重大升级

### 1. Vue3相比Vue2有哪些重大升级？

- **响应式系统**：Proxy替代Object.defineProperty
- **组合式API**：Composition API
- **性能优化**：编译时优化、更快的虚拟DOM
- **TypeScript支持**：更好的TS集成
- **新特性**：Teleport、Suspense、Fragment
- **Tree-shaking**：更好的按需引入

## 二、响应式系统

### 2. 为什么Vue3改用Proxy？优势是什么？

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

### 3. Proxy有什么局限性？

- IE不支持（需要polyfill）
- 对某些内置对象（如Map、Set）需要特殊处理

## 三、Composition API

### 4. Composition API和Options API区别？

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| 代码组织 | 按选项类型 | 按功能逻辑 |
| 逻辑复用 | mixin | 组合式函数 |
| TS支持 | 一般 | 优秀 |
| 学习曲线 | 低 | 稍高 |

### 5. setup函数特点？

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

### 6. ref和reactive的区别？

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型+对象 | 仅对象/数组 |
| 访问方式 | .value | 直接访问 |
| 替换 | 可以替换整个值 | 不能替换 |

\`\`\`javascript
const count = ref(0);  // count.value
const state = reactive({ name: 'Vue' });  // state.name
\`\`\`

### 7. toRef、toRefs的作用？

\`\`\`javascript
const state = reactive({ name: 'Vue', version: 3 });

// toRef：创建单个ref
const nameRef = toRef(state, 'name');

// toRefs：将所有属性转为ref
const { name, version } = toRefs(state);
\`\`\`

**与直接解构的区别：** 直接解构会失去响应性，toRefs保持响应性。

## 四、生命周期

### 9. Vue3生命周期钩子对照

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

### 10. Vue3新增的生命周期钩子？

- onRenderTracked：追踪依赖时触发
- onRenderTriggered：依赖变化触发渲染时

## 五、新组件

### 11. Teleport、Suspense、Fragment作用？

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

## 六、性能优化

### 12. Vue3 Diff算法优化？

引入**最长递增子序列**算法，减少DOM移动操作。

### 13. Vue3编译时优化？

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

## 七、其他变化

### 15. Vue3全局API调整？

\`\`\`javascript
// Vue2
Vue.component();
Vue.use();

// Vue3
const app = createApp(App);
app.component();
app.use();
\`\`\`

### 17. defineProps、defineEmits、defineExpose？

\`\`\`vue
<script setup>
const props = defineProps(['name']);
const emit = defineEmits(['update']);
const exposed = defineExpose({ method });
</script>
\`\`\`

### 19. Vue3支持TS的优势？

- 源码用TS重写
- 更好的类型推导
- 组合式API天然适合TS
    `,
    tags: ["Vue", "Vue3", "对比"],
  },
  "11": {
    title: "Vue工程化与性能优化（18题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、性能优化

### 1. Vue项目如何做性能优化？

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

### 2. 首屏加载慢如何优化？

- 路由懒加载
- 第三方库按需引入
- 图片压缩和懒加载
- SSR服务端渲染
- 预加载关键资源

### 4. 如何做代码分割、分包优化？

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

## 二、网络请求

### 5. Vue项目如何配置跨域？

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

### 6. axios如何二次封装？

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

### 7. 如何处理接口重复请求？

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

## 三、状态管理

### 8. Vuex/Pinia区别？

| 特性 | Vuex | Pinia |
|------|------|-------|
| Mutation | 需要 | 不需要 |
| TS支持 | 一般 | 优秀 |
| 模块化 | modules | 多个store |
| 体积 | 较大 | 更小 |
| Vue3推荐 | - | ✅ |

### 9. Vuex五大核心概念？

- **State**：存储数据
- **Getter**：派生状态
- **Mutation**：同步修改state
- **Action**：异步操作，提交mutation
- **Module**：模块化

### 10. Mutation为什么必须是同步函数？

Devtools需要记录状态变化的前后快照，异步操作无法准确追踪。

### 12. Pinia相比Vuex的优势？

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

## 四、构建工具

### 13. Vite和Webpack区别？

| 特性 | Vite | Webpack |
|------|------|---------|
| 启动速度 | 快（按需编译） | 慢（全量打包） |
| HMR | 快速 | 较慢 |
| 生产构建 | Rollup | Webpack |
| 配置复杂度 | 简单 | 复杂 |

### 14. Vite为什么启动更快？

- 基于ESM，浏览器原生支持
- 按需编译，不打包整个应用
- 依赖预构建

**依赖预构建：** 将CommonJS/UMD转为ESM，合并小模块

## 五、其他

### 17. 移动端Vue适配方案？

- **rem方案**：根据屏幕宽度动态设置html font-size
- **vw方案**：直接使用viewport单位
- **viewport插件**：postcss-px-to-viewport

### 18. 如何处理内存泄漏？

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
    title: "Vue实战场景与手写题（12题）",
    date: "2026-06-09",
    author: "前端开发者",
    category: "Vue",
    content: `
## 一、手写实现

### 1. 手写简单的双向绑定

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

### 2. 手写防抖、节流自定义指令

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

### 3. 手写简易版Proxy响应式

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

### 4. 手写简易版nextTick

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

## 二、组件通信

### 5. 实现事件总线

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

## 三、实战场景

### 8. 如何实现权限控制？

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

### 9. 大数据列表渲染卡顿如何解决？

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

### 11. 数据更新视图不更新的场景？

1. **对象新增属性**：使用\$set
2. **数组索引修改**：使用\$set或splice
3. **异步数据更新后**：使用\$nextTick
4. **v-for key使用index**：改用唯一ID
    `,
    tags: ["Vue", "手写", "实战"],
  },
  "1": {
    title: "深入理解JavaScript闭包",
    date: "2026-06-08",
    author: "前端开发者",
    category: "JavaScript",
    content: `
## 什么是闭包？

闭包是指有权访问另一个函数作用域中变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数。

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

## 闭包的原理

要理解闭包，首先需要理解JavaScript的作用域链和执行上下文。

### 作用域链

当函数被调用时，会创建一个执行上下文，其中包含一个作用域链。作用域链包含了当前函数可以访问的所有变量对象。

### 内存管理

闭包会导致外部函数的变量对象无法被垃圾回收，因为内部函数仍然引用着它们。这既是闭包的优势，也是需要注意的地方。

## 闭包的应用场景

1. **数据封装**：模拟私有变量
2. **函数柯里化**：实现参数复用
3. **防抖节流**：控制函数执行频率
4. **模块模式**：组织代码结构

## 注意事项

- 避免在循环中创建闭包导致的常见问题
- 注意内存泄漏风险
- 合理使用，不要过度使用
    `,
    tags: ["JavaScript", "闭包", "作用域"],
  },
  "2": {
    title: "React性能优化实战",
    date: "2026-06-05",
    author: "前端开发者",
    category: "React",
    content: `
## React性能优化的核心原则

React的性能优化主要围绕减少不必要的渲染展开。

## 常用优化工具

### React.memo

用于包裹函数组件，只有当props发生变化时才重新渲染。

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
\`\`\`

### useMemo

缓存计算结果，避免每次渲染都重新计算。

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
\`\`\`

### useCallback

缓存函数引用，避免子组件因函数引用变化而重新渲染。

\`\`\`jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## 性能分析工具

- React DevTools Profiler
- Chrome Performance面板
- why-did-you-render

## 最佳实践

1. 只在真正需要时使用优化手段
2. 优先优化渲染次数多的组件
3. 使用key帮助React识别哪些元素改变了
4. 避免在render中创建新的对象或函数
    `,
    tags: ["React", "性能优化", "Hooks"],
  },
};

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = id ? articles[id as keyof typeof articles] : null;
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <Link to="/articles" className="text-blue-600 hover:underline">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${article.title} - 前端面试`}
        description={article.content.substring(0, 150)}
        keywords={article.tags}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft />
            返回文章列表
          </Link>
        </div>

        <header className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.author}</span>
            <span>·</span>
            <span className="text-blue-600 font-medium">{article.category}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
        </div>

        <div className="mt-12 pt-8 border-t flex justify-between items-center">
          <Link
            to="/articles"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft />
            返回文章列表
          </Link>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <FaShareAlt />
            分享
          </button>
        </div>
      </article>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
          aria-label="返回顶部"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}

function formatContent(content: string): string {
  let html = content
    // 先处理代码块，避免被其他规则影响
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`;
    })
    // 处理二级标题 ##
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    // 处理三级标题 ###
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
    // 处理加粗 **text**
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // 处理无序列表 - item
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // 处理有序列表 1. item
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // 处理表格行 | cell | cell |
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((cell) => cell.trim());
      if (cells.every((cell) => /^[-]+$/.test(cell))) {
        return "";
      }
      return `<tr>${cells.map((cell) => `<td class="border border-gray-300 px-4 py-2">${cell}</td>`).join("")}</tr>`;
    })
    // 将连续的<li>包裹在<ul>中
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-3 space-y-1">$1</ul>')
    // 处理换行（不在标签内的）
    .replace(/\n/g, "<br />")
    // 清理多余的<br />在标签之间
    .replace(/>(<br \/>)+</g, "><")
    .replace(/(<br \/>)+</g, "<")
    .replace(/> (<br \/>)+/g, "> ");

  // 处理表格
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
    return `<table class="min-w-full border-collapse border border-gray-300 my-4"><tbody>${match}</tbody></table>`;
  });

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
