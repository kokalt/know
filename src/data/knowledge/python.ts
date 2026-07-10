import type { KnowledgeData } from "../../pages/KnowledgeDetail";

export const pythonData: KnowledgeData = {
  name: "Python 核心知识点",
  description: "Python 基础语法、面向对象、装饰器、标准库与异步编程等核心知识",
  icon: "Py",
  items: [
    {
      id: "py-01",
      title: "Python 基础语法与数据类型",
      tags: ["Python", "基础", "数据类型"],
      excerpt: "深入理解 Python 的基础语法、变量、数据类型及常见操作，涵盖列表、字典、元组、集合",
      content: `## Python 基础语法与数据类型

### 面试场景
面试官通常会先问基础数据类型的使用和区别，再逐步深入到底层实现和性能考量。以下从变量开始，逐一拆解字符串、列表、字典、元组、集合的核心用法及常见面试题。

### 变量与动态类型

Python 是动态类型语言，变量无需声明类型，赋值时自动推断。底层一切皆对象，变量名只是对象的引用。可以通过 \`type()\` 和 \`id()\` 查看类型和内存地址。

\`\`\`python
# 变量与类型推断
name = "Alice"                 # str
age = 25                       # int
height = 1.75                  # float
is_student = False             # bool
hobbies = ["reading", "code"]  # list

# 查看类型和内存地址
print(type(name))              # <class 'str'>
print(id(name))                # 内存地址（每次运行不同）

# 多变量赋值与交换
a, b, c = 1, 2, 3             # 同时赋值
a, b = b, a                   # 原地交换，背后是元组打包/解包
print(a, b)                    # 2 1
\`\`\`

### 字符串操作（高频考点）

字符串是不可变序列，支持切片、格式化、常用方法。面试常问字符串驻留（interning）、编码问题。

\`\`\`python
# 字符串切片与步长
s = "Hello World"
print(s[0:5])      # "Hello" (左闭右开)
print(s[::-1])     # "dlroW olleH" (反转字符串)
print(s[::2])      # "HloWrd" (步长为2)

# 常用方法
print(s.upper())           # "HELLO WORLD"
print(s.lower())           # "hello world"
print(s.split(" "))        # ['Hello', 'World']
print(" ".join(["A","B"])) # "A B"
print(s.replace("World", "Python"))  # "Hello Python"

# f-string 格式化（Python 3.6+，推荐）
name, age = "Alice", 25
print(f"{name} 今年 {age} 岁")
print(f"{age:04d}")         # 0025 补零
print(f"{3.14159:.2f}")     # 3.14 保留两位小数

# 字符串驻留：只包含字母数字下划线的字符串会被自动驻留
a = "hello_world"
b = "hello_world"
print(a is b)  # True (同一个对象)
\`\`\`

### 列表（List）—— 可变序列

列表是 Python 最常用的数据结构，底层是动态数组。面试高频：切片、推导式、深浅拷贝、sort vs sorted。

\`\`\`python
# 创建与基本操作
fruits = ["apple", "banana", "orange"]
fruits.append("grape")         # 尾部追加 O(1)
fruits.insert(1, "pear")       # 指定位置插入 O(n)
fruits.extend(["kiwi", "mango"])  # 批量追加
popped = fruits.pop()          # 弹出尾部元素 O(1)
popped_index = fruits.pop(2)   # 弹出指定位置 O(n)
fruits.remove("banana")        # 按值删除第一个匹配项

# 切片赋值（强大的操作）
nums = [0, 1, 2, 3, 4, 5]
nums[1:4] = [10, 20]           # 替换： [0, 10, 20, 4, 5]
nums[2:2] = [99]               # 插入： [0, 10, 99, 20, 4, 5]
del nums[1:3]                  # 删除： [0, 20, 4, 5]

# 列表推导式（高频考点）
squares = [x**2 for x in range(10) if x % 2 == 0]   # [0, 4, 16, 36, 64]
matrix = [[i * j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]

# sort（原地排序） vs sorted（返回新列表）
nums = [3, 1, 4, 1, 5, 9]
sorted_nums = sorted(nums, reverse=True)  # [9, 5, 4, 3, 1, 1] — 原列表不变
nums.sort(key=lambda x: -x)              # 原地排序
\`\`\`

### 元组（Tuple）—— 不可变序列

元组一旦创建就不能修改。面试常问：为什么需要不可变类型？（可作为字典键、多返回值、内存更小、线程安全）

\`\`\`python
# 创建元组
t = (1, 2, 3)
single = (1,)          # 单元素元组必须有逗号
empty = ()
packed = 1, 2, 3       # 括号可省略（打包）

# 解包（unpacking）
a, b, c = (1, 2, 3)          # 位置解包
first, *middle, last = (1, 2, 3, 4, 5)
print(middle)                # [2, 3, 4]

# 命名元组（可读性更好的轻量对象）
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(10, 20)
print(p.x, p.y)        # 10 20
print(p._asdict())     # {'x': 10, 'y': 20}

# 面试：函数返回多个值实际上就是返回元组
def min_max(items):
    return min(items), max(items)  # 返回 tuple

mn, mx = min_max([3, 1, 4, 1, 5])
\`\`\`

### 字典（Dict）—— 键值对映射

字典底层是哈希表，Python 3.6+ 默认有序（插入顺序）。面试重点：哈希冲突、为什么键必须可哈希、dict vs OrderedDict。

\`\`\`python
# 创建与基本操作
person = {"name": "Alice", "age": 25, "city": "Beijing"}
print(person["name"])               # 访问（键不存在会 KeyError）
print(person.get("job", "未知"))    # 安全访问，带默认值

# 合并字典（Python 3.9+ 使用 | 运算符）
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
merged = d1 | d2            # {'a': 1, 'b': 3, 'c': 4} （后者覆盖前者）
d1 |= d2                    # d1 原地合并

# 字典推导式
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# defaultdict —— 带默认值的字典（面试高频）
from collections import defaultdict
dd = defaultdict(list)      # 访问不存在的键时自动创建空列表
words = ["apple", "banana", "avocado"]
for w in words:
    dd[w[0]].append(w)
print(dd)  # defaultdict(<class 'list'>, {'a': ['apple', 'avocado'], 'b': ['banana']})

# Counter —— 计数器
from collections import Counter
cnt = Counter("abracadabra")
print(cnt.most_common(2))  # [('a', 5), ('b', 2)]

# 面试陷阱：遍历时不能修改字典大小
d = {"a": 1, "b": 2, "c": 3}
# for k in d:          # 会报 RuntimeError
#     del d[k]
for k in list(d.keys()):  # 正确做法：先复制键列表
    del d[k]
\`\`\`

### 集合（Set）—— 无序不重复

集合底层也是哈希表，元素必须可哈希。常考：去重、集合运算（交并差）、frozenset（不可变集合）。

\`\`\`python
# 创建集合
s = {1, 2, 3, 3, 2}      # {1, 2, 3} 自动去重
empty_set = set()         # 注意：{} 是空字典而非空集合

# 集合运算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)       # {1, 2, 3, 4, 5, 6}   并集
print(a & b)       # {3, 4}                交集
print(a - b)       # {1, 2}                差集
print(a ^ b)       # {1, 2, 5, 6}         对称差集

# 集合推导式
evens = {x for x in range(20) if x % 2 == 0}

# frozenset —— 可作为字典键的不可变集合
fs = frozenset([1, 2, 3])
d = {fs: "value"}  # OK，frozenset 可哈希
\`\`\`

### 面试追问：可变 vs 不可变类型

面试官常问：哪些是可变/不可变类型？为什么 list 不能作为字典的键？

\`\`\`python
# 不可变（可哈希）：int, float, str, tuple, frozenset, bool, None
# 可变（不可哈希）：list, dict, set, 自定义对象（默认）

# 验证不可变性
a = "hello"
print(id(a))            # 如 140234567890
a += " world"
print(id(a))            # 不同地址！字符串不可变，+= 创建了新对象

# tuple 的"不可变"陷阱
t = ([1, 2], 3)
t[0].append(4)          # 这可以！元组中的列表内容可以变
print(t)                # ([1, 2, 4], 3)
# 但 t[0] = [5, 6]     # 这会报错：不能修改元组中的引用
\`\`\``,
    },
    {
      id: "py-02",
      title: "函数与装饰器",
      tags: ["Python", "函数", "装饰器"],
      excerpt: "深入理解闭包、装饰器原理、可变参数、lambda 表达式与生成器 yield 的工作机制",
      content: `## 函数与装饰器

### 面试场景
装饰器是 Python 中级面试必考题，面试官通常会从基础函数写起，逐步追问闭包概念、装饰器原理、带参数装饰器、functools.wraps 的作用，最后延伸到实际应用场景（日志、计时、权限校验、缓存）。

### 函数基础与参数传递

Python 函数是一等公民：可以赋值给变量、作为参数传递、作为返回值。参数传递是"传对象引用"（call by object reference），既不是传值也不是传引用。

\`\`\`python
# 基本定义与类型注解
def greet(name: str, greeting: str = "Hello") -> str:
    """函数文档字符串（docstring）"""
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet.__doc__)            # 打印文档字符串
print(greet.__annotations__)    # {'name': <class 'str'>, ...}

# 默认参数的陷阱（高频面试题）
def append_to(element, target=[]):
    target.append(element)
    return target

print(append_to(1))  # [1]
print(append_to(2))  # [1, 2]  ← 不是 [2]！默认参数只初始化一次
print(append_to(3))  # [1, 2, 3]

# 正确做法：默认值用 None
def append_to_safe(element, target=None):
    if target is None:
        target = []
    target.append(element)
    return target
\`\`\`

### *args 与 **kwargs

这两个是面试高频考点，\`*args\` 将位置参数打包为元组，\`**kwargs\` 将关键字参数打包为字典。名称是约定俗称，关键在 \`*\` 和 \`**\` 操作符。

\`\`\`python
# *args 接收任意数量的位置参数
def sum_all(*args):
    print(f"类型: {type(args)}")  # <class 'tuple'>
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs 接收任意数量的关键字参数
def build_user(**kwargs):
    print(f"类型: {type(kwargs)}")  # <class 'dict'>
    return kwargs

user = build_user(name="Bob", age=30, role="admin")
print(user)  # {'name': 'Bob', 'age': 30, 'role': 'admin'}

# 配合使用时的参数顺序（强制规则）
def func(a, b, *args, c=0, d=0, **kwargs):
    # 顺序: 位置参数 → *args → 关键字参数 → **kwargs
    print(f"a={a}, b={b}, args={args}, c={c}, d={d}, kwargs={kwargs}")

func(1, 2, 3, 4, 5, c=10, e=20, f=30)
# a=1, b=2, args=(3, 4, 5), c=10, d=0, kwargs={'e': 20, 'f': 30}

# 解包操作：调用时展开列表/字典
nums = [1, 2, 3]
config = {"sep": "-", "end": "!"}
print(*nums)                    # 1 2 3
print(*nums, **config)          # 1-2-3!
\`\`\`

### Lambda 表达式

Lambda 是匿名函数，只能包含单个表达式。适用于排序 key、filter/map/reduce 等场景。面试常问：lambda 的局限（不能包含语句、没有 docstring、难以调试）。

\`\`\`python
# 基本使用
square = lambda x: x ** 2
print(square(5))  # 25

# 经常作为排序/过滤的 key
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78},
]
sorted_students = sorted(students, key=lambda s: s["score"], reverse=True)

# filter / map / reduce
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))     # [2, 4, 6]
doubled = list(map(lambda x: x * 2, nums))            # [2, 4, 6, 8, 10, 12]

from functools import reduce
total = reduce(lambda acc, x: acc + x, nums, 0)       # 21

# 面试：lambda 闭包也能捕获变量
def make_multiplier(n):
    return lambda x: x * n

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))  # 10
print(triple(5))  # 15
\`\`\`

### 闭包（Closure）

闭包 = 函数 + 其捕获的外部变量（自由变量）。Python 闭包通过 \`__closure__\` 属性访问被捕获的变量。面试重点：nonlocal 关键字、闭包与装饰器的关系。

\`\`\`python
# 闭包示例：计数器
def make_counter():
    count = 0                 # 自由变量
    def counter():
        nonlocal count        # 声明要修改外部变量（否则 count += 1 会 UnboundLocalError）
        count += 1
        return count
    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3

# 查看闭包捕获的变量
print(c.__closure__)                # (<cell at ...: int object at ...>,)
print(c.__closure__[0].cell_contents)  # 3 (当前 count 的值)

# nonlocal 的作用范围：只能修改最近一层外部作用域的变量，不能跨多层
def outer():
    x = "outer"
    def middle():
        x = "middle"
        def inner():
            nonlocal x     # 修改 middle 中的 x，不是 outer 的
            x = "changed"
        inner()
        print(x)           # "changed"
    middle()
    print(x)               # "outer" (未被修改)
outer()
\`\`\`

### 装饰器（Decorator）—— 核心考点

装饰器本质是一个接受函数作为参数、返回新函数的高阶函数。原理基于闭包。面试要求能手写装饰器，特别是带参数装饰器和 \`functools.wraps\`。

\`\`\`python
import time
from functools import wraps

# ===== 基础装饰器 =====
def timer(func):
    """计时装饰器：打印函数执行时间"""
    @wraps(func)  # 保留原函数的 __name__ 和 __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 执行耗时: {elapsed:.4f} 秒")
        return result
    return wrapper

@timer
def slow_add(n):
    """累加到 n"""
    return sum(range(n + 1))

print(slow_add(1000000))        # slow_add 执行耗时: 0.0234 秒 → 500000500000
print(slow_add.__name__)        # "slow_add" (有 wraps 则保留原名)
print(slow_add.__doc__)         # "累加到 n" (有 wraps 则保留文档)

# ===== 带参数装饰器 =====
def retry(max_attempts=3, delay=1):
    """重试装饰器：函数失败后自动重试"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            import time as t
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    print(f"第 {attempt} 次失败: {e}，{delay}秒后重试...")
                    t.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unstable_network_call():
    import random
    if random.random() < 0.7:
        raise ConnectionError("网络超时")
    return "success"

# ===== 类装饰器 =====
class CountCalls:
    """统计函数调用次数"""
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} 已被调用 {self.count} 次")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # say_hello 已被调用 1 次 → Hello!
say_hello()  # say_hello 已被调用 2 次 → Hello!

# ===== 面试追问：functools.wraps 做了什么？ =====
# 它本质上是一个装饰器，把原函数的 __name__、__doc__、__module__、__dict__
# 等属性复制到 wrapper 上，同时设置 __wrapped__ 属性指向原函数
# 等价于:
#   wrapper.__name__ = func.__name__
#   wrapper.__doc__ = func.__doc__
#   wrapper.__wrapped__ = func
\`\`\`

### 生成器（Generator）与 yield

生成器是惰性求值的迭代器，每次 yield 暂停并保存状态，下次从暂停处继续。面试重点：生成器 vs 列表的内存优势、send() 方法、yield from、生成器表达式。

\`\`\`python
# 生成器函数
def fibonacci(n):
    """生成前 n 个斐波那契数"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# 逐个取值
fib = fibonacci(5)
print(next(fib))  # 0
print(next(fib))  # 1
print(list(fib))  # [1, 2, 3] （剩余的全部消费掉）

# 内存对比：生成器 vs 列表
import sys
gen = (x for x in range(1000000))   # 生成器表达式
lst = [x for x in range(1000000)]   # 列表推导式
print(sys.getsizeof(gen))           # ~200 bytes
print(sys.getsizeof(lst))           # ~8000000 bytes

# send() 方法——向生成器发送值
def echo():
    while True:
        received = yield
        print(f"收到: {received}")

g = echo()
next(g)            # 启动生成器（执行到第一个 yield）
g.send("Hello")    # 收到: Hello
g.send("World")    # 收到: World
g.close()          # 关闭生成器

# yield from —— 委托给子生成器
def chain_generators(*iterables):
    for it in iterables:
        yield from it

result = list(chain_generators([1, 2], [3, 4], [5]))
print(result)  # [1, 2, 3, 4, 5]

# 面试追问：生成器的 StopIteration 异常
def simple_gen():
    yield 1
    yield 2
    # 函数结束时自动抛出 StopIteration

g = simple_gen()
print(next(g))  # 1
print(next(g))  # 2
# next(g) → StopIteration（生成器耗尽）
\`\`\`

### 闭包面试陷阱题

\`\`\`python
# 经典陷阱：循环中的闭包
funcs = []
for i in range(3):
    funcs.append(lambda: i)    # lambda 捕获的是变量 i 的引用

print([f() for f in funcs])    # [2, 2, 2] ← 不是 [0, 1, 2]！

# 解决方案：默认参数在定义时求值
funcs2 = []
for i in range(3):
    funcs2.append(lambda x=i: x)

print([f() for f in funcs2])   # [0, 1, 2] ✓
\`\`\``,
    },
    {
      id: "py-03",
      title: "面向对象编程",
      tags: ["Python", "OOP", "类"],
      excerpt: "深入 Python 面向对象：__init__/self、继承多态、魔术方法、@property 装饰器及元类简介",
      content: `## 面向对象编程（OOP）

### 面试场景
OOP 面试从 \`__init__\` 与 \`self\` 入手，逐步考察继承与多态、魔术方法的实际应用、@property 实现属性控制，高阶面试可能追问 MRO（方法解析顺序）、元类（metaclass）、描述符协议。

### 类与实例 —— __init__ 与 self

\`__init__\` 不是构造方法！真正创建对象的是 \`__new__\`，\`__init__\` 仅负责初始化已创建的对象。\`self\` 不是关键字，只是约定俗称的第一个参数名，代表实例自身。

\`\`\`python
class Person:
    """人类"""
    species = "Homo sapiens"   # 类属性（所有实例共享）

    def __new__(cls, *args, **kwargs):
        """真正的构造方法（很少重写）"""
        print(f"__new__ 被调用，创建 {cls.__name__} 实例")
        instance = super().__new__(cls)   # 实际分配内存创建对象
        return instance

    def __init__(self, name: str, age: int):
        """初始化方法"""
        self.name = name      # 实例属性
        self.age = age

    def introduce(self):
        return f"我是 {self.name}，今年 {self.age} 岁。"

# 创建流程：先 __new__ 后 __init__
p1 = Person("Alice", 25)
p2 = Person("Bob", 30)

print(Person.species)    # Homo sapiens
print(p1.species)        # Homo sapiens（实例可访问类属性）
p1.species = "Mutant"    # 在 p1 上创建同名实例属性，不影响类属性
print(Person.species)    # Homo sapiens（类属性未变）
print(p1.species)        # Mutant（实例属性覆盖）
\`\`\`

### 继承与多态

Python 支持单继承和多继承，使用 MRO（C3 线性化算法）确定方法查找顺序。\`super()\` 在 Python 3 中无需传参。

\`\`\`python
class Student(Person):
    """学生类"""
    def __init__(self, name, age, school):
        super().__init__(name, age)   # 调用父类初始化
        self.school = school
        self._scores = []             # 受保护属性（约定：单下划线）

    def introduce(self):              # 方法重写（多态）
        return f"{super().introduce()} 就读于 {self.school}"

    def add_score(self, score):
        if 0 <= score <= 100:
            self._scores.append(score)

    @property
    def average(self):                # 计算属性
        if not self._scores:
            return 0
        return sum(self._scores) / len(self._scores)

s = Student("Charlie", 20, "清华大学")
print(s.introduce())          # 我是 Charlie，今年 20 岁。 就读于 清华大学

# 多态——同一接口不同行为
def describe(person: Person):
    print(person.introduce())

describe(Person("Alice", 25))         # 我是 Alice，今年 25 岁。
describe(Student("Bob", 22, "北大"))   # 我是 Bob，今年 22 岁。 就读于 北大

# 查看 isinstance / issubclass
print(isinstance(s, Person))          # True
print(issubclass(Student, Person))    # True
\`\`\`

### 多继承与 MRO

Python 多继承使用 C3 线性化算法计算 MRO。可以通过 \`ClassName.__mro__\` 或 \`ClassName.mro()\` 查看。

\`\`\`python
class A:
    def method(self):
        print("A")

class B(A):
    def method(self):
        print("B")

class C(A):
    def method(self):
        print("C")

class D(B, C):      # D 继承 B 和 C
    pass

d = D()
d.method()          # B → D 的 MRO: D → B → C → A → object
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

# super() 遵循 MRO 而非直接父类
class X:
    def method(self):
        print("X")
        super().method()   # super() 在 X 中会调用 object.method()

class Y(X):
    def method(self):
        print("Y")
        super().method()   # 调用 MRO 中下一个类的 method

Y().method()  # Y → X（X 中 super() 调用 object.method()，object 无 method 报错注意）
\`\`\`

### 魔术方法（Magic / Dunder Methods）

魔术方法是 Python 对象模型的核心，以双下划线开头和结尾。面试常考：\`__str__\` vs \`__repr__\`、\`__call__\`、\`__len__\`、\`__getitem__\` 等。

\`\`\`python
class Vector:
    """二维向量——展示常用魔术方法"""
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # __str__ vs __repr__：前者面向用户（print），后者面向开发者（调试）
    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"

    # 运算操作符重载
    def __add__(self, other):
        """+ 运算"""
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        """- 运算"""
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        """* 运算（标量乘法）"""
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):
        """== 判断"""
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __len__(self):
        """len() 支持"""
        return 2  # 二维向量长度为 2

    def __getitem__(self, index):
        """索引访问 v[0], v[1]"""
        if index == 0: return self.x
        if index == 1: return self.y
        raise IndexError("Vector index out of range")

    def __call__(self, factor):
        """使实例可像函数一样调用"""
        return Vector(self.x * factor, self.y * factor)

    def __bool__(self):
        """bool() 判断：非零向量为 True"""
        return self.x != 0 or self.y != 0

    # 上下文管理器支持
    def __enter__(self):
        print(f"进入上下文，操作 {self}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"退出上下文")
        return False  # 不抑制异常

# 测试
v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1)                   # Vector(3, 4) —— 调用 __str__
print(repr(v1))             # Vector(x=3, y=4) —— 调用 __repr__
print(v1 + v2)              # Vector(5, 6)
print(v1 * 3)               # Vector(9, 12)
print(v1 == Vector(3, 4))   # True
print(v1[0], v1[1])         # 3 4
print(v1(10))               # Vector(30, 40) —— 调用 __call__

with v1 as vec:             # 上下文管理器
    print(f"inside: {vec}")
\`\`\`

### @property 装饰器

\`@property\` 将方法转换为属性访问方式，实现 getter。配合 \`@xxx.setter\` 和 \`@xxx.deleter\` 实现完整属性控制。面试重点：为什么用 property 而不是直接暴露属性？（数据校验、惰性计算、向后兼容）

\`\`\`python
class Temperature:
    """温度类——展示 @property 的完整用法"""
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        """获取摄氏温度"""
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        """设置摄氏温度，带校验"""
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度 (-273.15°C)")
        self._celsius = value

    @celsius.deleter
    def celsius(self):
        """删除摄氏温度"""
        print("重置温度为 0")
        self._celsius = 0

    @property
    def fahrenheit(self):
        """华氏温度（计算属性，惰性求值）"""
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9   # 复用 celsius 的校验逻辑

# 使用
t = Temperature(37)
print(t.celsius)        # 37（方法调用，但看起来像属性访问）
print(t.fahrenheit)     # 98.6

t.celsius = 100         # 调用 setter
t.fahrenheit = 212      # 间接设置 celsius = 100
print(t.celsius)        # 100.0

del t.celsius           # 调用 deleter → 重置温度为 0

# 面试追问：property 底层原理是什么？
# property 是一个描述符类，__get__ / __set__ / __delete__ 实现了描述符协议
# 等价于：celsius = property(get_celsius, set_celsius, del_celsius, "文档")
\`\`\`

### @classmethod 与 @staticmethod

\`\`\`python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string: str):
        """类方法——从字符串创建实例（替代构造器）"""
        year, month, day = map(int, date_string.split("-"))
        return cls(year, month, day)        # cls 指向调用时的类（支持继承）

    @staticmethod
    def is_valid_date(year, month, day) -> bool:
        """静态方法——不依赖类或实例的工具函数"""
        return 1 <= month <= 12 and 1 <= day <= 31

    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

d1 = Date(2025, 1, 15)
d2 = Date.from_string("2025-06-30")   # 类方法调用
print(d2)                              # 2025-06-30
print(Date.is_valid_date(2025, 2, 30)) # False

# 面试追问：classmethod vs staticmethod 的核心区别？
# classmethod 接收 cls，可以参与继承；staticmethod 就是普通函数，只是组织在类中
class SubDate(Date):
    pass

d3 = SubDate.from_string("2025-12-25")  # cls = SubDate，返回 SubDate 实例
print(type(d3))                          # <class '__main__.SubDate'>
\`\`\`

### 私有属性与名称改写（Name Mangling）

\`\`\`python
class Secret:
    def __init__(self):
        self.public = "公开属性"
        self._protected = "约定保护（单下划线，实际上可访问）"
        self.__private = "名称改写（双下划线）"

s = Secret()
print(s.public)               # 公开属性
print(s._protected)           # 约定保护（可以访问，但不推荐）
# print(s.__private)          # AttributeError！
print(s._Secret__private)     # 名称改写：可以通过 _ClassName__attr 访问
# 双下划线只是将 __attr 改名为 _ClassName__attr，不是真正的私有
\`\`\``,
    },
    {
      id: "py-04",
      title: "常用标准库",
      tags: ["Python", "标准库", "面试"],
      excerpt: "掌握 os/sys/json/re/collections/datetime/itertools 等高频标准库的实用 API 及面试要点",
      content: `## 常用标准库

### os 模块——操作系统接口

os 模块提供操作系统相关的功能：文件路径操作、环境变量、进程管理等。面试常考路径拼接的正确方式（os.path.join 而非字符串拼接）、os.path 与 pathlib 的区别。

\`\`\`python
import os

# 路径操作
current = os.getcwd()                    # 当前工作目录
os.chdir("/tmp")                         # 切换工作目录
files = os.listdir(".")                  # 列出目录内容
os.makedirs("a/b/c", exist_ok=True)      # 递归创建目录
os.removedirs("a/b/c")                   # 递归删除空目录

# 路径拼接与拆分（跨平台正确姿势）
path = os.path.join("folder", "subfolder", "file.txt")
print(os.path.basename(path))            # file.txt
print(os.path.dirname(path))             # folder/subfolder
print(os.path.splitext(path))            # ('folder/subfolder/file', '.txt')
print(os.path.exists(path))              # 判断是否存在
print(os.path.isdir(path))               # 判断是否为目录
print(os.path.isfile(path))              # 判断是否为文件

# 环境变量
home = os.environ.get("HOME")            # 获取环境变量
# os.environ["MY_VAR"] = "value"           # 设置环境变量

# 执行系统命令（subprocess 更推荐）
# os.system("ls -la")              # 简单命令（已不推荐）
# result = os.popen("ls").read()   # 读取命令输出（已不推荐）

# pathlib 是现代替代方案（Python 3.4+，更推荐在面试中展示）
from pathlib import Path
p = Path("folder") / "subfolder" / "file.txt"
print(p.name)          # file.txt
print(p.suffix)        # .txt
print(p.parent)        # folder/subfolder
print(p.exists())      # 判断存在
for f in Path(".").glob("*.py"):   # 通配符匹配
    print(f)
\`\`\`

### sys 模块——系统相关参数

sys 模块提供 Python 解释器相关的变量和函数。面试重点：sys.argv 接收命令行参数、sys.path 模块搜索路径、sys.exit() 退出程序。

\`\`\`python
import sys

# 命令行参数
print(sys.argv)          # ['script.py', 'arg1', 'arg2']
# python script.py arg1 arg2

# Python 搜索路径
print(sys.path)          # 模块搜索路径列表

# 退出程序
# sys.exit(0)            # 正常退出
# sys.exit(1)            # 异常退出

# 递归深度限制（面试常问）
print(sys.getrecursionlimit())   # 默认 1000
# sys.setrecursionlimit(2000)    # 修改限制

# 获取对象大小
print(sys.getsizeof([1, 2, 3]))   # 列表占用的字节数

# 平台信息
print(sys.platform)              # win32 / linux / darwin
print(sys.version)               # Python 版本信息
print(sys.executable)            # Python 解释器路径

# stdin / stdout / stderr
# data = sys.stdin.read()          # 读取标准输入
# sys.stdout.write("output\\n")    # 写入标准输出
# sys.stderr.write("error\\n")     # 写入标准错误
\`\`\`

### json 模块——数据处理

json 是最常用的数据交换格式。面试重点：json.dumps vs json.loads、自定义编码器、ensure_ascii 参数、处理 datetime 等非原生类型。

\`\`\`python
import json
from datetime import datetime

# Python → JSON 字符串（序列化）
data = {
    "name": "Alice",
    "age": 25,
    "skills": ["Python", "Go", "Rust"],
    "active": True,
    "score": None
}

json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# JSON 字符串 → Python 对象（反序列化）
loaded = json.loads(json_str)
print(loaded["name"])  # Alice

# 文件读写
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    from_file = json.load(f)

# 面试：自定义 JSON 编码器（处理 datetime 等特殊类型）
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, set):
            return list(obj)
        return super().default(obj)

record = {"time": datetime.now(), "tags": {"python", "json"}}
encoded = json.dumps(record, cls=CustomEncoder, ensure_ascii=False)
print(encoded)  # {"time": "2025-01-15T10:30:00", "tags": ["python", "json"]}

# 面试追问：json.dumps 和 json.dump 的区别？
# dumps 返回字符串，dump 写入文件。同理 loads 从字符串读，load 从文件读
\`\`\`

### re 模块——正则表达式

正则表达式是文本处理利器。面试重点：常用元字符、分组与捕获、贪婪 vs 非贪婪、re.compile 预编译、flags 参数。

\`\`\`python
import re

text = "联系电话：010-12345678，手机：13812345678，邮箱：alice@example.com"

# search —— 搜索第一个匹配
match = re.search(r"\\d{3}-\\d{8}", text)
if match:
    print(match.group())  # 010-12345678

# findall —— 查找所有匹配
phones = re.findall(r"\\d+[-\\d]*", text)
print(phones)  # ['010-12345678', '13812345678']

# match —— 从开头匹配（与 search 不同）
print(re.match(r"\\d+", "123abc"))   # <re.Match object> — 从开头匹配成功
print(re.match(r"\\d+", "abc123"))   # None — 开头不是数字

# sub —— 替换
masked = re.sub(r"\\d{3}-\\d{8}", "***-********", text)
print(masked)

# 分组 —— 提取关键信息
pattern = r"(\\d+)-(\\d+)"           # () 定义分组
m = re.search(pattern, "区号 010-12345678")
if m:
    print(m.group(0))   # 010-12345678 （整个匹配）
    print(m.group(1))   # 010 （第一个分组）
    print(m.group(2))   # 12345678 （第二个分组）

# 命名分组
m = re.search(r"(?P<area>\\d+)-(?P<number>\\d+)", "010-12345678")
if m:
    print(m.group("area"))    # 010
    print(m.group("number"))  # 12345678

# compile —— 预编译（高频模式应预编译，提升性能）
email_pattern = re.compile(r"[\\w.-]+@[\\w.-]+\\.\\w+", re.IGNORECASE)
emails = email_pattern.findall("联系 alice@ex.com 和 BOB@TEST.ORG")
print(emails)  # ['alice@ex.com', 'BOB@TEST.ORG']

# 贪婪 vs 非贪婪
html = "<div>内容1</div><div>内容2</div>"
greedy = re.findall(r"<div>.*</div>", html)
non_greedy = re.findall(r"<div>.*?</div>", html)
print(greedy)      # ['<div>内容1</div><div>内容2</div>'] ← 贪婪匹配
print(non_greedy)  # ['<div>内容1</div>', '<div>内容2</div>'] ← 非贪婪

# 面试追问：re.search 和 re.match 的区别？
# re.match 只在字符串开头匹配；re.search 搜索整个字符串中第一个匹配
\`\`\`

### collections 模块——高性能容器

collections 是面试中的高频模块，包含多种实用的数据结构。

\`\`\`python
from collections import (
    Counter, defaultdict, OrderedDict,
    namedtuple, deque, ChainMap
)

# Counter —— 计数器（面试最爱）
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
cnt = Counter(words)
print(cnt)                        # Counter({'apple': 3, 'banana': 2, 'orange': 1})
print(cnt.most_common(2))         # [('apple', 3), ('banana', 2)]
print(cnt["apple"])               # 3
# 支持算术运算
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
print(c1 + c2)                    # Counter({'a': 4, 'b': 3})
print(c1 - c2)                    # Counter({'a': 2})（结果只保留正数）
print(c1 & c2)                    # Counter({'a': 1, 'b': 1})（取最小值交集）

# defaultdict —— 带默认值的字典
# 按首字母分组
names = ["Alice", "Bob", "Anna", "Ben", "Charlie"]
by_letter = defaultdict(list)
for name in names:
    by_letter[name[0]].append(name)
print(dict(by_letter))   # {'A': ['Alice', 'Anna'], 'B': ['Bob', 'Ben'], 'C': ['Charlie']}

# 用 defaultdict 实现 tree
from collections import defaultdict
def tree():
    return defaultdict(tree)
categories = tree()
categories["food"]["fruit"]["apple"] = 1
categories["food"]["fruit"]["banana"] = 2
print(categories["food"]["fruit"]["apple"])  # 1

# namedtuple —— 可读性更好的元组
Person = namedtuple("Person", ["name", "age", "city"])
alice = Person("Alice", 25, "Beijing")
print(alice.name, alice.age)     # Alice 25
print(alice._asdict())           # {'name': 'Alice', 'age': 25, 'city': 'Beijing'}
# 不可变特性：alice.age = 26 → AttributeError

# deque —— 双端队列（两端 O(1) 操作）
dq = deque([1, 2, 3], maxlen=5)
dq.append(4)        # 右边加
dq.appendleft(0)    # 左边加
dq.pop()            # 右边弹出
dq.popleft()        # 左边弹出
dq.rotate(1)        # 右旋一位
print(dq)           # deque([3, 1, 2, 4], maxlen=5)

# OrderedDict —— 有序字典（Python 3.7+ dict 默认有序，仍有特殊用途）
from collections import OrderedDict
od = OrderedDict()
od["a"] = 1
od["b"] = 2
od["c"] = 3
od.move_to_end("a")              # 移到末尾
print(list(od.keys()))           # ['b', 'c', 'a']
od.popitem(last=False)           # 弹出第一个元素（FIFO）
print(list(od.keys()))           # ['c', 'a']

# ChainMap —— 多个字典合并为一个逻辑视图
defaults = {"color": "red", "user": "guest"}
cli_args = {"user": "admin"}
combined = ChainMap(cli_args, defaults)
print(combined["user"])   # "admin"（先搜 cli_args）
print(combined["color"])  # "red"（clients 中没有才搜 defaults）
\`\`\`

### datetime 模块——日期时间处理

\`\`\`python
from datetime import datetime, date, time, timedelta, timezone

# 当前时间
now = datetime.now()
today = date.today()

# 创建指定日期时间
dt = datetime(2025, 6, 15, 14, 30, 0)
print(dt)  # 2025-06-15 14:30:00

# 格式化输出与解析（面试高频）
formatted = dt.strftime("%Y-%m-%d %H:%M:%S")   # datetime → 字符串
parsed = datetime.strptime("2025-06-15", "%Y-%m-%d")  # 字符串 → datetime
print(formatted)      # 2025-06-15 14:30:00
print(parsed)         # 2025-06-15 00:00:00

# 常用格式代码
# %Y 四位年  %m 两位月  %d 两位日
# %H 24h时   %M 分钟   %S 秒
# %A 星期全名  %B 月份全名

# timedelta —— 时间增量
delta = timedelta(days=7, hours=3)
future = now + delta
past = now - timedelta(days=30)
diff = future - past
print(diff.days)          # 37
print(diff.total_seconds())  # 37 * 86400 + 10800

# 时间戳转换
ts = datetime.now().timestamp()         # datetime → 时间戳
dt_from_ts = datetime.fromtimestamp(ts) # 时间戳 → datetime

# 时区处理（Python 3.9+ 推荐 zoneinfo）
try:
    from zoneinfo import ZoneInfo
    beijing_tz = ZoneInfo("Asia/Shanghai")
    dt_bj = datetime.now(beijing_tz)
    print(dt_bj)
except ImportError:
    pass  # Python < 3.9 不可用

# 计算两个日期之间的天数（面试常见）
def days_between(d1, d2):
    return abs((d2 - d1).days)
print(days_between(date(2025, 1, 1), date(2025, 12, 31)))  # 364
\`\`\`

### itertools 模块——迭代器工具箱

itertools 提供高效的迭代器构建块，是算法面试的好帮手。

\`\`\`python
import itertools

# 无限迭代器（需配合 islice 截断）
from itertools import count, cycle, repeat
# count(10, 2) → 10, 12, 14, 16, ...
# cycle("ABC") → A, B, C, A, B, C, ...
# repeat("X", 3) → X, X, X

# chain —— 连接多个可迭代对象
print(list(itertools.chain([1, 2], [3, 4], [5])))  # [1, 2, 3, 4, 5]

# 排列与组合（面试高频）
items = ["A", "B", "C"]
perms = list(itertools.permutations(items, 2))    # 排列（顺序相关）
combs = list(itertools.combinations(items, 2))    # 组合（顺序无关）
combs_with_repl = list(itertools.combinations_with_replacement(items, 2))
print(perms)        # [('A','B'),('A','C'),('B','A'),('B','C'),('C','A'),('C','B')]
print(combs)        # [('A','B'),('A','C'),('B','C')]
print(combs_with_repl)  # 包含 ('A','A'), ('B','B'), ('C','C')

# product —— 笛卡尔积
colors = ["红", "绿"]
sizes = ["S", "M", "L"]
for c, s in itertools.product(colors, sizes):
    print(f"{c}-{s}")    # 红-S, 红-M, 红-L, 绿-S, 绿-M, 绿-L

# groupby —— 按键分组（要求数据已排序）
data = [("A", 1), ("A", 2), ("B", 3), ("B", 4), ("A", 5)]
data.sort(key=lambda x: x[0])   # groupby 要求先排序
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    items = list(group)
    print(f"{key}: {items}")
# A: [('A', 1), ('A', 2), ('A', 5)]
# B: [('B', 3), ('B', 4)]

# 其他实用工具
nums = [1, 2, 3, 4]
print(list(itertools.accumulate(nums)))             # [1, 3, 6, 10]（累积和）
print(list(itertools.pairwise(nums)))               # [(1,2), (2,3), (3,4)]
zipped = itertools.zip_longest([1, 2], ["a","b","c"], fillvalue=None)
print(list(zipped))                                 # [(1,'a'), (2,'b'), (None,'c')]
\`\`\``,
    },
    {
      id: "py-05",
      title: "异步编程",
      tags: ["Python", "异步", "asyncio"],
      excerpt: "深入理解 async/await 语法、asyncio 事件循环、协程概念以及并发与并行的区别",
      content: `## 异步编程（Async / Await / Asyncio）

### 面试场景
异步编程是 Python 中高级面试的常见考点。面试官会从协程概念入手，逐步追问事件循环原理、\`asyncio.gather\` vs \`asyncio.create_task\` 的区别、同步/异步代码混用的陷阱，以及实际场景（网络请求、数据库查询）下的最佳实践。

### 为什么需要异步编程？

传统同步 I/O 在处理网络请求、文件读写时会阻塞线程，浪费 CPU。异步编程让单个线程在等待 I/O 时切换到其他任务，提高并发吞吐量。注意：Python 异步 = 单线程并发，不是并行。

\`\`\`python
import time
import asyncio

# 同步版本：顺序执行，总耗时 = 所有任务耗时之和
def sync_fetch(url, delay):
    time.sleep(delay)   # 阻塞整个线程
    return f"{url} 响应完成"

def sync_main():
    start = time.perf_counter()
    sync_fetch("url-1", 1)
    sync_fetch("url-2", 1)
    sync_fetch("url-3", 1)
    print(f"同步耗时: {time.perf_counter() - start:.2f}s")  # ~3.0s

# 异步版本：并发执行，总耗时 ≈ 最慢任务的耗时
async def async_fetch(url, delay):
    await asyncio.sleep(delay)  # 不阻塞，让出控制权
    return f"{url} 响应完成"

async def async_main():
    start = time.perf_counter()
    results = await asyncio.gather(
        async_fetch("url-1", 1),
        async_fetch("url-2", 1),
        async_fetch("url-3", 1),
    )
    print(f"异步耗时: {time.perf_counter() - start:.2f}s")  # ~1.0s
    print(results)

# Python 3.7+ 运行入口
# asyncio.run(async_main())
\`\`\`

### 协程（Coroutine）与事件循环（Event Loop）

协程是通过 \`async def\` 定义的函数，调用它不会立即执行，而是返回一个 coroutine 对象。事件循环是调度所有协程的核心，它不断地检查哪些协程可以继续执行（I/O 完成），并切换到下一个就绪的协程。

\`\`\`python
import asyncio

# 协程定义
async def coroutine_demo(name, delay):
    print(f"[{name}] 开始执行")
    await asyncio.sleep(delay)           # 挂起点：让出控制权
    print(f"[{name}] 延迟 {delay}s 后恢复")
    return f"{name} 完成"

# 创建一个协程对象（不执行）
coro = coroutine_demo("test", 1)
print(type(coro))                        # <class 'coroutine'>

# 三种运行协程的方式

# 1. asyncio.run() —— 最简单的入口（Python 3.7+）
# result = asyncio.run(coroutine_demo("main", 0.5))

# 2. await —— 在另一个协程中等待
async def wrapper():
    result = await coroutine_demo("nested", 0.5)
    print(f"结果: {result}")

# 3. asyncio.create_task() —— 创建 Task 并发执行
async def concurrent_demo():
    # create_task 将协程包装为 Task，立即加入事件循环调度
    task1 = asyncio.create_task(coroutine_demo("task-1", 2))
    task2 = asyncio.create_task(coroutine_demo("task-2", 1))

    print("两个任务已启动，等待完成...")
    r1 = await task1
    r2 = await task2
    print(r1, r2)
    # 输出顺序：task-2 先完成（延迟短），task-1 后完成

# asyncio.run(concurrent_demo())
\`\`\`

### asyncio.gather vs asyncio.create_task

这是面试高频对比题。\`gather\` 批量等待多个协程并收集结果；\`create_task\` 将单个协程包装为 Task 后立即投入事件循环。两者配合使用是最佳实践。

\`\`\`python
async def fetch_data(source, delay):
    await asyncio.sleep(delay)
    return f"来自 {source} 的数据"

# gather —— 批量执行，返回结果列表
async def gather_demo():
    results = await asyncio.gather(
        fetch_data("DB", 2),
        fetch_data("API", 1),
        fetch_data("Cache", 0.5),
    )
    print(results)  # ['来自 DB 的数据', '来自 API 的数据', '来自 Cache 的数据']

# gather 的 return_exceptions 参数
async def gather_with_errors():
    async def may_fail(name, fail=False):
        await asyncio.sleep(0.1)
        if fail:
            raise ValueError(f"{name} 出错了")
        return f"{name} 成功"

    results = await asyncio.gather(
        may_fail("A"),
        may_fail("B", fail=True),     # 这个会失败
        may_fail("C"),
        return_exceptions=True,       # 不抛出异常，结果中包含异常对象
    )
    print(results)
    # ['A 成功', ValueError('B 出错了'), 'C 成功']

# create_task —— 精细控制每个任务
async def task_demo():
    tasks = []
    for i in range(5):
        task = asyncio.create_task(fetch_data(f"source-{i}", i * 0.2))
        tasks.append(task)

    # 逐个等待，也可以 cancel 未完成的任务
    for t in tasks:
        try:
            result = await t
            print(result)
        except asyncio.CancelledError:
            print(f"任务 {t.get_name()} 被取消")

# asyncio.gather(...)
\`\`\`

### asyncio.wait —— 更灵活的等待控制

\`\`\`python
async def wait_demo():
    tasks = [
        asyncio.create_task(asyncio.sleep(i, result=f"task-{i}"))
        for i in [3, 1, 2]
    ]

    # FIRST_COMPLETED —— 任一完成就返回
    done, pending = await asyncio.wait(
        tasks, return_when=asyncio.FIRST_COMPLETED
    )
    print(f"已完成: {len(done)}，待处理: {len(pending)}")
    # 取消剩余任务
    for p in pending:
        p.cancel()

    # 或者 ALL_COMPLETED（默认行为，等同于 gather）
    # done, pending = await asyncio.wait(tasks)

# asyncio.run(wait_demo())
\`\`\`

### 超时与取消

\`\`\`python
async def timeout_demo():
    async def long_task():
        await asyncio.sleep(10)
        return "太久了"

    try:
        # 2 秒超时
        result = await asyncio.wait_for(long_task(), timeout=2)
    except asyncio.TimeoutError:
        print("任务超时，已取消")

    # 手动 cancel
    task = asyncio.create_task(asyncio.sleep(5))
    await asyncio.sleep(0.1)   # 让任务有机会启动
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("任务已被取消")

# asyncio.run(timeout_demo())
\`\`\`

### 同步与异步混用

面试高频陷阱：不能在异步函数中调用阻塞的同步 I/O！这会阻塞整个事件循环。解决方案：使用 \`loop.run_in_executor\` 将同步任务放到线程池。

\`\`\`python
import concurrent.futures
import time

# 问题：在协程中调用 time.sleep 会阻塞事件循环
async def bad_example():
    print("开始阻塞...")
    time.sleep(3)      # 阻塞！事件循环被卡住
    print("3 秒后才打印，期间其他协程也无法运行")

# 解决方案：把耗时同步操作放到线程池
async def good_example():
    loop = asyncio.get_running_loop()
    print("在线程池中执行同步操作...")

    # run_in_executor —— 在单独线程中运行阻塞函数
    result = await loop.run_in_executor(
        None,                             # None = 默认线程池
        time.sleep,                       # 阻塞函数
        3                                 # 参数
    )
    # 或者用 lambda 包装更复杂的逻辑
    def blocking_io():
        time.sleep(2)
        return "阻塞操作完成"

    msg = await loop.run_in_executor(None, blocking_io)
    print(msg)

# 实际应用：异步 HTTP 请求（aiohttp 示例）
# import aiohttp
# async def fetch_url(url):
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url) as response:
#             return await response.text()

# 在同步代码中运行异步函数
def run_async():
    """在同步代码中调用异步函数"""
    async def async_work():
        await asyncio.sleep(0.1)
        return "异步结果"

    # Python 3.10+ 可直接用 asyncio.run()
    return asyncio.run(async_work())

# print(run_async())  # 异步结果
\`\`\`

### 异步上下文管理器与异步迭代器

\`\`\`python
# 异步上下文管理器
class AsyncResource:
    async def __aenter__(self):
        print("异步获取资源...")
        await asyncio.sleep(0.5)
        return self

    async def __aexit__(self, *args):
        print("异步释放资源...")
        await asyncio.sleep(0.2)

    async def do_work(self):
        await asyncio.sleep(0.3)
        return "工作完成"

async def use_async_resource():
    async with AsyncResource() as res:
        result = await res.do_work()
        print(result)

# 异步迭代器
class AsyncRange:
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.start >= self.end:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)   # 模拟异步操作
        value = self.start
        self.start += 1
        return value

async def async_iteration_demo():
    async for i in AsyncRange(0, 5):
        print(i)

# asyncio.run(async_iteration_demo())   # 0 1 2 3 4（每个间隔 0.1s）
\`\`\`

### asyncio.Queue —— 异步生产者-消费者模式

\`\`\`python
async def producer_consumer_demo():
    queue = asyncio.Queue(maxsize=3)

    async def producer(name, count):
        for i in range(count):
            await asyncio.sleep(0.2)    # 生产耗时
            item = f"{name}-{i}"
            await queue.put(item)        # 队列满时自动等待
            print(f"[生产] {item}")

    async def consumer(name):
        while True:
            item = await queue.get()     # 队列空时自动等待
            if item is None:             # 终止信号
                queue.task_done()
                break
            await asyncio.sleep(0.5)     # 消费耗时
            print(f"[消费] {name} 处理了 {item}")
            queue.task_done()

    # 启动生产者和消费者
    consumers = [asyncio.create_task(consumer(f"C{i}")) for i in range(2)]
    await asyncio.gather(
        producer("P1", 5),
        producer("P2", 5),
    )

    # 发送终止信号
    for _ in consumers:
        await queue.put(None)
    await asyncio.gather(*consumers)

# asyncio.run(producer_consumer_demo())
\`\`\`

### 面试总结：异步编程五问

1. **async/await 和协程的关系？** \`async def\` 定义协程函数，\`await\` 挂起当前协程等待另一个可等待对象完成，将控制权交还给事件循环。

2. **gather 和 create_task 的区别？** \`gather\` 是批量等待并收集结果；\`create_task\` 将协程包装为 Task 投入循环，需要手动 await。推荐先用 \`create_task\` 创建任务，再用 \`gather\` 统一等待，以获得更精细的控制。

3. **异步 = 并行吗？** 不。Python 异步是单线程并发（通过事件循环调度），不是多线程/多进程并行。CPU 密集型任务应使用多进程（multiprocessing 或 ProcessPoolExecutor），I/O 密集型任务适合异步。

4. **为什么 async 函数里不能调用 time.sleep？** \`time.sleep\` 是同步阻塞调用，会阻塞整个线程，事件循环无法切换到其他协程。应使用 \`await asyncio.sleep()\`，或将 \`time.sleep\` 放到线程池执行。

5. **asyncio 的实际应用场景？** Web 框架（FastAPI, aiohttp）、数据库驱动（asyncpg, motor）、消息队列（aio-pika）、爬虫（aiohttp + asyncio）、WebSocket 服务等需要处理大量并发连接但每个连接计算量较小的场景。
\`\`\``,
    },
  ],
};
