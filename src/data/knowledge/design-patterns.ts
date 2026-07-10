export const designPatternsData = {
  name: "设计模式",
  description:
    "前端开发中常用的设计模式详解，包括单例、观察者、工厂、策略等模式",
  icon: "Design",
  items: [
    {
      id: "design-01",
      title: "单例模式",
      tags: ["设计模式", "单例", "创建型"],
      excerpt: "确保一个类只有一个实例，并提供全局访问点",
      content: `
## 定义

单例模式（Singleton Pattern）是一种创建型设计模式，它确保一个类只有一个实例，并提供一个全局访问点来获取该实例。

## 使用场景

- **全局状态管理**：如 Vuex Store、Redux Store
- **数据库连接池**：避免重复创建连接
- **配置管理器**：应用配置只需加载一次
- **日志记录器**：统一的日志输出入口
- **浏览器缓存管理**：LocalStorage/SessionStorage 封装

## 如何实现

### JavaScript 实现

\`\`\`javascript
// 方式一：闭包实现
const Singleton = (function() {
  let instance;

  function createInstance() {
    return {
      data: [],
      addData(item) {
        this.data.push(item);
      },
      getData() {
        return this.data;
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 使用
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
\`\`\`

### TypeScript 实现

\`\`\`typescript
class Singleton {
  private static instance: Singleton;
  private data: string[] = [];

  // 私有构造函数，防止外部直接实例化
  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public addData(item: string): void {
    this.data.push(item);
  }

  public getData(): string[] {
    return [...this.data];
  }
}

// 使用
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
\`\`\`

### React 中的单例

\`\`\`jsx
// 创建全局状态单例
class GlobalState {
  static instance = null;
  state = {};
  listeners = [];

  static getInstance() {
    if (!GlobalState.instance) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  setState(key, value) {
    this.state[key] = value;
    this.notify();
  }

  getState(key) {
    return this.state[key];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }
}

// 在组件中使用
const globalState = GlobalState.getInstance();
\`\`\`

## 注意事项

- **线程安全**：JavaScript 是单线程，无需考虑线程安全问题
- **测试困难**：单例可能导致测试之间相互影响，建议在测试时提供重置方法
- **过度使用**：不要将所有对象都做成单例，只在真正需要全局唯一时使用
`,
    },
    {
      id: "design-02",
      title: "观察者模式",
      tags: ["设计模式", "观察者", "行为型"],
      excerpt: "定义对象间的一对多依赖关系，当对象状态改变时自动通知所有依赖者",
      content: `
## 定义

观察者模式（Observer Pattern）是一种行为型设计模式，它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。当主题对象状态发生变化时，会通知所有观察者对象自动更新。

## 使用场景

- **事件系统**：DOM 事件、自定义事件
- **响应式数据**：Vue 的响应式系统、RxJS
- **发布订阅**：消息队列、事件总线
- **UI 更新**：数据变化自动更新视图
- **状态管理**：Redux、Vuex 的状态变更通知

## 如何实现

### 基础实现

\`\`\`javascript
class Subject {
  constructor() {
    this.observers = [];
  }

  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // 通知所有观察者
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(\`\${this.name} 收到通知: \${data}\`);
  }
}

// 使用
const subject = new Subject();
const observer1 = new Observer('观察者1');
const observer2 = new Observer('观察者2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notify('数据已更新');
// 观察者1 收到通知: 数据已更新
// 观察者2 收到通知: 数据已更新
\`\`\`

### 发布订阅模式

\`\`\`javascript
class EventBus {
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
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
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
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// 使用
const bus = new EventBus();

bus.on('userLogin', (user) => {
  console.log('用户登录:', user.name);
});

bus.on('userLogin', (user) => {
  console.log('记录登录日志:', user.id);
});

bus.emit('userLogin', { id: 1, name: '张三' });
\`\`\`

### Vue 响应式原理简化版

\`\`\`javascript
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

class Watcher {
  constructor(getter) {
    this.getter = getter;
    this.value = this.get();
  }

  get() {
    Dep.target = this;
    const value = this.getter();
    Dep.target = null;
    return value;
  }

  update() {
    this.value = this.get();
    console.log('视图更新');
  }
}

// 数据劫持
function defineReactive(obj, key, val) {
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal;
        dep.notify();
      }
    }
  });
}
\`\`\`

## 注意事项

- **内存泄漏**：记得在不使用时移除观察者
- **执行顺序**：观察者的执行顺序可能不确定，不要依赖特定顺序
- **性能问题**：大量观察者可能导致性能问题，考虑使用防抖或节流
`,
    },
    {
      id: "design-03",
      title: "工厂模式",
      tags: ["设计模式", "工厂", "创建型"],
      excerpt: "通过工厂方法创建对象，隐藏对象创建的复杂逻辑",
      content: `
## 定义

工厂模式（Factory Pattern）是一种创建型设计模式，它提供了一种创建对象的最佳方式，将对象的创建和使用分离，隐藏对象创建的复杂逻辑。

## 使用场景

- **对象创建复杂**：需要根据不同条件创建不同类型的对象
- **解耦**：调用者不需要知道具体类的名称
- **统一接口**：多个类实现相同接口，通过工厂统一创建
- **框架设计**：如 React.createElement、Vue.component
- **API 请求封装**：根据请求类型创建不同的请求对象

## 如何实现

### 简单工厂

\`\`\`javascript
class Button {
  render() {
    return '<button>按钮</button>';
  }
}

class Input {
  render() {
    return '<input type="text" />';
  }
}

class Select {
  render() {
    return '<select><option>选项</option></select>';
  }
}

// 简单工厂
function createComponent(type) {
  switch (type) {
    case 'button':
      return new Button();
    case 'input':
      return new Input();
    case 'select':
      return new Select();
    default:
      throw new Error('未知组件类型');
  }
}

// 使用
const button = createComponent('button');
console.log(button.render()); // <button>按钮</button>
\`\`\`

### 工厂方法模式

\`\`\`javascript
// 抽象工厂类
class ComponentFactory {
  createComponent() {
    throw new Error('子类必须实现此方法');
  }
}

// 具体工厂
class ButtonFactory extends ComponentFactory {
  createComponent() {
    return new Button();
  }
}

class InputFactory extends ComponentFactory {
  createComponent() {
    return new Input();
  }
}

// 使用
const buttonFactory = new ButtonFactory();
const button = buttonFactory.createComponent();
\`\`\`

### React 中的工厂模式

\`\`\`jsx
// 表单组件工厂
const formComponents = {
  text: ({ label, value, onChange }) => (
    <div>
      <label>{label}</label>
      <input type="text" value={value} onChange={onChange} />
    </div>
  ),
  select: ({ label, value, options, onChange }) => (
    <div>
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  ),
  checkbox: ({ label, checked, onChange }) => (
    <div>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </label>
    </div>
  )
};

// 动态表单组件
function DynamicForm({ fields, values, onChange }) {
  return (
    <form>
      {fields.map(field => {
        const Component = formComponents[field.type];
        return (
          <Component
            key={field.name}
            label={field.label}
            value={values[field.name]}
            options={field.options}
            checked={values[field.name]}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      })}
    </form>
  );
}
\`\`\`

### Axios 请求工厂

\`\`\`javascript
class RequestFactory {
  static create(config) {
    const defaultConfig = {
      baseURL: '/api',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.create({ ...defaultConfig, ...config });
  }

  static createAuthRequest(token) {
    const instance = this.create();
    instance.interceptors.request.use(config => {
      config.headers.Authorization = \`Bearer \${token}\`;
      return config;
    });
    return instance;
  }
}

// 使用
const api = RequestFactory.create();
const authApi = RequestFactory.createAuthRequest('token123');
\`\`\`

## 注意事项

- **扩展性**：新增产品类型时需要修改工厂代码，违反开闭原则
- **复杂度**：简单场景下使用工厂模式可能增加不必要的复杂度
- **结合其他模式**：常与策略模式、模板方法模式结合使用
`,
    },
    {
      id: "design-04",
      title: "策略模式",
      tags: ["设计模式", "策略", "行为型"],
      excerpt: "定义一系列算法，将每个算法封装起来，并使它们可以互相替换",
      content: `
## 定义

策略模式（Strategy Pattern）是一种行为型设计模式，它定义了一系列算法，并将每个算法封装起来，使它们可以互相替换。策略模式让算法的变化独立于使用算法的客户。

## 使用场景

- **表单验证**：不同的验证规则
- **排序算法**：根据不同条件选择不同排序方式
- **支付方式**：支付宝、微信、信用卡等不同支付策略
- **折扣计算**：不同会员等级享受不同折扣
- **数据导出**：支持 CSV、Excel、PDF 等多种格式

## 如何实现

### 基础实现

\`\`\`javascript
// 定义策略接口
class ValidationStrategy {
  validate(value) {
    throw new Error('必须实现 validate 方法');
  }
}

// 具体策略
class EmailValidation extends ValidationStrategy {
  validate(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}

class PhoneValidation extends ValidationStrategy {
  validate(value) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value);
  }
}

class RequiredValidation extends ValidationStrategy {
  validate(value) {
    return value !== '' && value !== null && value !== undefined;
  }
}

// 上下文类
class Validator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  // 动态切换策略
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  validate(value) {
    return this.strategy.validate(value);
  }
}

// 使用
const validator = new Validator(new EmailValidation());
console.log(validator.validate('test@example.com')); // true
console.log(validator.validate('invalid')); // false

// 切换策略
validator.setStrategy(new PhoneValidation());
console.log(validator.validate('13800138000')); // true
\`\`\`

### 表单验证实战

\`\`\`javascript
// 验证策略集合
const validationStrategies = {
  required: (value) => value !== '' && value !== null && value !== undefined,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^1[3-9]\d{9}$/.test(value),
  minLength: (min) => (value) => value.length >= min,
  maxLength: (max) => (value) => value.length <= max,
  pattern: (regex) => (value) => regex.test(value)
};

// 验证器
class FormValidator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(values) {
    const errors = {};

    for (const [field, fieldRules] of Object.entries(this.rules)) {
      const value = values[field];

      for (const rule of fieldRules) {
        const { type, params, message } = rule;
        const strategy = validationStrategies[type];

        if (!strategy) continue;

        const isValid = typeof params !== 'undefined'
          ? strategy(params)(value)
          : strategy(value);

        if (!isValid) {
          errors[field] = message || \`\${field} 验证失败\`;
          break;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// 使用
const validator = new FormValidator({
  email: [
    { type: 'required', message: '邮箱不能为空' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  phone: [
    { type: 'required', message: '手机号不能为空' },
    { type: 'phone', message: '手机号格式不正确' }
  ],
  password: [
    { type: 'required', message: '密码不能为空' },
    { type: 'minLength', params: 6, message: '密码至少6位' }
  ]
});

const result = validator.validate({
  email: 'test@example.com',
  phone: '13800138000',
  password: '123456'
});

console.log(result.isValid); // true
\`\`\`

### 折扣计算策略

\`\`\`javascript
// 折扣策略
const discountStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.9,
  svip: (price) => price * 0.8,
  seasonal: (price) => price * 0.7
};

// 价格计算器
class PriceCalculator {
  calculate(price, memberType) {
    const strategy = discountStrategies[memberType] || discountStrategies.normal;
    return strategy(price);
  }
}

// 使用
const calculator = new PriceCalculator();
console.log(calculator.calculate(100, 'normal'));  // 100
console.log(calculator.calculate(100, 'vip'));     // 90
console.log(calculator.calculate(100, 'svip'));    // 80
console.log(calculator.calculate(100, 'seasonal'));// 70
\`\`\`

### React 中的策略模式

\`\`\`jsx
// 排序策略
const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byPrice: (a, b) => a.price - b.price,
  byDate: (a, b) => new Date(b.date) - new Date(a.date),
  byRating: (a, b) => b.rating - a.rating
};

// 产品列表组件
function ProductList({ products, sortBy }) {
  const sortedProducts = [...products].sort(sortStrategies[sortBy]);

  return (
    <div>
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
\`\`\`

## 注意事项

- **策略选择**：客户端需要知道所有策略，并选择合适的策略
- **策略数量**：策略过多时会增加维护成本，考虑使用注册表管理
- **结合其他模式**：常与工厂模式结合，由工厂决定使用哪个策略
`,
    },
  ],
};
