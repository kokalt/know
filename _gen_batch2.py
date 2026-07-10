import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34); N = chr(10); BS = chr(92); BT = chr(96); DS = chr(36)
BT3 = BT + BT + BT

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

# ---- htmlData ----
h1 = ""
h1 += "## HTML5 Semantic Tags" + N + N
h1 += "Semantic HTML uses tags that convey meaning about their content, improving SEO, accessibility, and code maintainability." + N + N
h1 += BT3 + "html" + N
h1 += "<header>Site header / logo / nav</header>" + N
h1 += "<nav>Primary navigation links</nav>" + N
h1 += "<main>" + N
h1 += "  <article>Independent content piece (blog post, news)</article>" + N
h1 += "  <aside>Sidebar / complementary content</aside>" + N
h1 += "  <section>Thematic grouping of content</section>" + N
h1 += "</main>" + N
h1 += "<footer>Site footer / copyright / links</footer>" + N
h1 += BT3 + N + N
h1 += "**Semantic HTML Benefits:**" + N
h1 += "1. SEO: Search engines better understand page structure and content hierarchy" + N
h1 += "2. Accessibility: Screen readers can navigate by landmarks (header, nav, main, footer)" + N
h1 += "3. Maintainability: Clear structure is easier to read and maintain" + N + N
h1 += "## HTML5 APIs: WebSocket, Web Worker, localStorage" + N + N
h1 += "**WebSocket - Full-duplex communication:**" + N
h1 += BT3 + "javascript" + N
h1 += "const ws = new WebSocket(" + Q + "wss://example.com/ws" + Q + ");" + N
h1 += "ws.onopen = () => ws.send(" + Q + "Hello Server!" + Q + ");" + N
h1 += "ws.onmessage = (event) => console.log(" + Q + "Received:" + Q + ", event.data);" + N
h1 += "ws.onclose = () => console.log(" + Q + "Disconnected" + Q + ");" + N
h1 += "ws.onerror = (error) => console.error(error);" + N
h1 += BT3 + N + N
h1 += "**Web Worker - Background threads:**" + N
h1 += BT3 + "javascript" + N
h1 += "// main.js" + N
h1 += "const worker = new Worker(" + Q + "worker.js" + Q + ");" + N
h1 += "worker.postMessage({ data: largeArray });" + N
h1 += "worker.onmessage = (e) => console.log(" + Q + "Result:" + Q + ", e.data);" + N + N
h1 += "// worker.js" + N
h1 += "self.onmessage = (e) => {" + N
h1 += "  const result = heavyComputation(e.data);" + N
h1 += "  self.postMessage(result);" + N
h1 += "};" + N
h1 += BT3 + N + N
h1 += "**localStorage / sessionStorage:**" + N
h1 += BT3 + "javascript" + N
h1 += "localStorage.setItem(" + Q + "token" + Q + ", " + Q + "abc123" + Q + ");" + N
h1 += "const token = localStorage.getItem(" + Q + "token" + Q + ");" + N
h1 += "localStorage.removeItem(" + Q + "token" + Q + ");" + N
h1 += "localStorage.clear();" + N
h1 += "// sessionStorage: same API, data cleared on tab close" + N
h1 += "// localStorage: persists across sessions, ~5MB limit" + N
h1 += BT3 + N + N
h1 += "## Canvas vs SVG" + N + N
h1 += "**Canvas:** Pixel-based, imperative API, good for games, image manipulation, real-time graphs. Resolution-dependent. No DOM access to drawn elements." + N
h1 += "**SVG:** Vector-based, declarative (XML), good for icons, logos, responsive graphics. Resolution-independent. Each element is a DOM node (can attach events, CSS)." + N + N
h1 += BT3 + "html" + N
h1 += "<!-- Canvas: draw programmatically -->" + N
h1 += '<canvas id="c" width="400" height="300"></canvas>' + N
h1 += "<!-- SVG: declarative markup -->" + N
h1 += '<svg width="100" height="100">' + N
h1 += '  <circle cx="50" cy="50" r="40" fill="blue" />' + N
h1 += "</svg>" + N
h1 += BT3

h2 = ""
h2 += "## SEO Best Practices" + N + N
h2 += "**On-Page SEO Essentials:**" + N
h2 += "1. Semantic HTML structure (header, nav, main, article, footer)" + N
h2 += "2. Proper heading hierarchy (h1 -> h2 -> h3, single h1 per page)" + N
h2 += "3. Descriptive title tags and meta descriptions" + N
h2 += "4. Alt attributes on all images" + N
h2 += "5. Structured data (JSON-LD) for rich snippets" + N
h2 += "6. Canonical URLs to avoid duplicate content" + N
h2 += "7. Mobile-friendly responsive design" + N
h2 += "8. Fast page load (Core Web Vitals)" + N + N
h2 += BT3 + "html" + N
h2 += "<head>" + N
h2 += '  <title>Page Title - Site Name</title>' + N
h2 += '  <meta name="description" content="Concise page summary (150-160 chars)">' + N
h2 += '  <meta name="viewport" content="width=device-width, initial-scale=1">' + N
h2 += '  <link rel="canonical" href="https://example.com/page">' + N
h2 += '  <meta property="og:title" content="Title for social sharing">' + N
h2 += '  <meta property="og:description" content="Description for social sharing">' + N
h2 += "</head>" + N
h2 += BT3 + N + N
h2 += "**Structured Data (JSON-LD):**" + N
h2 += BT3 + "html" + N
h2 += '<script type="application/ld+json">' + N
h2 += "{" + N
h2 += '  "@context": "https://schema.org",' + N
h2 += '  "@type": "Article",' + N
h2 += '  "headline": "Article Title",' + N
h2 += '  "author": { "@type": "Person", "name": "Author Name" }' + N
h2 += "}" + N
h2 += "</script>" + N
h2 += BT3

# ---- es6Data ----
e1 = ""
e1 += "## Promise Internals" + N + N
e1 += "A Promise represents the eventual completion (or failure) of an async operation. It has three states: pending, fulfilled, rejected." + N + N
e1 += BT3 + "javascript" + N
e1 += "// Creating promises" + N
e1 += "const promise = new Promise((resolve, reject) => {" + N
e1 += "  setTimeout(() => {" + N
e1 += '    const success = Math.random() > 0.5;' + N
e1 += "    if (success) resolve(" + Q + "Data received" + Q + ");" + N
e1 += '    else reject(new Error("Request failed"));' + N
e1 += "  }, 1000);" + N
e1 += "});" + N + N
e1 += "// Promise chaining" + N
e1 += "fetch(" + Q + "/api/users" + Q + ")" + N
e1 += "  .then(res => res.json())" + N
e1 += '  .then(users => console.log(users))' + N
e1 += '  .catch(err => console.error("Error:", err))' + N
e1 += "  .finally(() => console.log(" + Q + "Done" + Q + "));" + N + N
e1 += "// Promise combinators" + N
e1 += "Promise.all([p1, p2, p3]);        // All resolve or any reject" + N
e1 += "Promise.allSettled([p1, p2, p3]); // Wait for all, get status of each" + N
e1 += "Promise.race([p1, p2, p3]);       // First to settle (resolve or reject)" + N
e1 += "Promise.any([p1, p2, p3]);        // First to resolve (ignore rejections)" + N
e1 += BT3 + N + N
e1 += "## async/await" + N + N
e1 += "async/await is syntactic sugar over Promises, making async code look synchronous." + N + N
e1 += BT3 + "javascript" + N
e1 += "async function loadUserData(userId) {" + N
e1 += "  try {" + N
e1 += "    const user = await fetchUser(userId);" + N
e1 += "    const posts = await fetchPosts(user.id);" + N
e1 += "    const comments = await Promise.all(" + N
e1 += "      posts.map(p => fetchComments(p.id))" + N
e1 += "    );" + N
e1 += "    return { user, posts, comments };" + N
e1 += "  } catch (error) {" + N
e1 += '    console.error("Load failed:", error);' + N
e1 += "    throw error;" + N
e1 += "  }" + N
e1 += "}" + N + N
e1 += "// Top-level await (ES2022, in modules)" + N
e1 += "const data = await fetch(" + Q + "/api/config" + Q + ").then(r => r.json());" + N
e1 += BT3 + N + N
e1 += "**Under the hood:** async functions always return a Promise. await pauses execution until the promise settles. Errors can be caught with try/catch. The event loop continues processing other tasks while waiting." + N + N
e1 += "## Arrow Functions vs Regular Functions" + N + N
e1 += "| Feature | Arrow Function | Regular Function |" + N
e1 += "|---------|---------------|------------------|" + N
e1 += "| this binding | Lexical (inherits from enclosing scope) | Dynamic (depends on call-site) |" + N
e1 += "| arguments object | Not available | Available |" + N
e1 += "| Constructor (new) | Cannot be used | Can be used |" + N
e1 += "| prototype property | No | Yes |" + N
e1 += "| Method shorthand | Not ideal (this issue) | Works correctly |" + N
e1 += "| Implicit return | Yes (single expression) | No" + N
e1 += BT3 + "javascript" + N
e1 += "// Arrow: inherits this from surrounding scope" + N
e1 += "const obj = {" + N
e1 += '  name: "Alice",' + N
e1 += "  greet: function() {" + N
e1 += '    setTimeout(() => console.log(this.name), 100); // "Alice"' + N
e1 += "  }," + N
e1 += "  greetWrong: () => {" + N
e1 += "    console.log(this.name); // undefined (this is global/window)" + N
e1 += "  }" + N
e1 += "};" + N
e1 += BT3

e2 = ""
e2 += "## Destructuring & Spread" + N + N
e2 += BT3 + "javascript" + N
e2 += "// Array destructuring" + N
e2 += "const [first, second, ...rest] = [1, 2, 3, 4, 5];" + N
e2 += "// first=1, second=2, rest=[3,4,5]" + N + N
e2 += "// Object destructuring" + N
e2 += "const { name, age, email = " + Q + "N/A" + Q + " } = user;" + N
e2 += "const { name: userName } = user; // rename" + N + N
e2 += "// Spread operator" + N
e2 += "const merged = { ...defaults, ...options };  // shallow merge" + N
e2 += "const combined = [...arr1, ...arr2];        // array concatenation" + N
e2 += BT3 + N + N
e2 += "## Set / Map / WeakMap" + N + N
e2 += BT3 + "javascript" + N
e2 += "// Set: unique values" + N
e2 += "const set = new Set([1, 2, 2, 3]);  // {1, 2, 3}" + N
e2 += "set.add(4); set.has(2); set.delete(3); set.size;" + N + N
e2 += "// Map: key-value pairs (keys can be any type)" + N
e2 += "const map = new Map();" + N
e2 += 'map.set("key", "value"); map.set(obj, "object key");' + N
e2 += "map.get(" + Q + "key" + Q + "); map.has(" + Q + "key" + Q + "); map.size;" + N + N
e2 += "// WeakMap: keys must be objects, keys are garbage-collectable" + N
e2 += "const weakMap = new WeakMap();" + N
e2 += "weakMap.set(obj, metadata); // obj can be GCd if no other references" + N
e2 += BT3 + N + N
e2 += "## Proxy / Reflect" + N + N
e2 += BT3 + "javascript" + N
e2 += "// Proxy: intercept object operations" + N
e2 += "const handler = {" + N
e2 += "  get(target, prop, receiver) {" + N
e2 += '    console.log(`Getting ${String(prop)}`);' + N
e2 += "    return Reflect.get(target, prop, receiver);" + N
e2 += "  }," + N
e2 += "  set(target, prop, value, receiver) {" + N
e2 += '    if (prop === "age" && typeof value !== "number") {' + N
e2 += '      throw new TypeError("Age must be a number");' + N
e2 += "    }" + N
e2 += "    return Reflect.set(target, prop, value, receiver);" + N
e2 += "  }," + N
e2 += "};" + N
e2 += "const user = new Proxy({ name: " + Q + "Alice" + Q + ", age: 25 }, handler);" + N
e2 += "user.name; // logs: Getting name" + N
e2 += "user.age = " + Q + "thirty" + Q + "; // throws TypeError" + N
e2 += BT3 + N + N
e2 += "**Proxy use cases:** Validation, logging, lazy loading (Vue 3 reactivity is Proxy-based), API abstraction." + N
e2 += "**Reflect:** Provides default behavior for Proxy traps, mirrors the Proxy handler methods."

e3 = ""
e3 += "## Iterator & Generator" + N + N
e3 += "**Iterator protocol:** Objects that define a next() method returning { value, done }." + N
e3 += "**Iterable protocol:** Objects that define [Symbol.iterator] returning an iterator." + N + N
e3 += BT3 + "javascript" + N
e3 += "// Custom iterable" + N
e3 += "const range = {" + N
e3 += "  from: 1, to: 5," + N
e3 += "  [Symbol.iterator]() {" + N
e3 += "    return {" + N
e3 += "      current: this.from," + N
e3 += "      last: this.to," + N
e3 += "      next() {" + N
e3 += "        if (this.current <= this.last) {" + N
e3 += "          return { value: this.current++, done: false };" + N
e3 += "        }" + N
e3 += "        return { done: true };" + N
e3 += "      }," + N
e3 += "    };" + N
e3 += "  }," + N
e3 += "};" + N
e3 += "for (const num of range) console.log(num); // 1,2,3,4,5" + N + N
e3 += "// Generator function" + N
e3 += "function* fibonacci(n) {" + N
e3 += "  let [a, b] = [0, 1];" + N
e3 += "  for (let i = 0; i < n; i++) {" + N
e3 += "    yield a;" + N
e3 += "    [a, b] = [b, a + b];" + N
e3 += "  }" + N
e3 += "}" + N
e3 += "for (const num of fibonacci(10)) console.log(num);" + N + N
e3 += "// Generator for async flow control (like redux-saga)" + N
e3 += "function* fetchFlow() {" + N
e3 += '  const user = yield fetch("/api/user").then(r => r.json());' + N
e3 += '  const posts = yield fetch(`/api/posts?userId=${user.id}`).then(r => r.json());' + N
e3 += "  return { user, posts };" + N
e3 += "}" + N
e3 += BT3 + N + N
e3 += "## Symbol" + N + N
e3 += BT3 + "javascript" + N
e3 += "// Symbol creates unique identifiers" + N
e3 += "const id = Symbol(" + Q + "id" + Q + ");" + N
e3 += "Symbol(" + Q + "id" + Q + ") === Symbol(" + Q + "id" + Q + "); // false!" + N + N
e3 += "// Well-known symbols" + N
e3 += "Symbol.iterator;  // makes object iterable" + N
e3 += "Symbol.toStringTag; // customizes Object.prototype.toString()" + N
e3 += "Symbol.toPrimitive;  // customizes type coercion" + N + N
e3 += "// Use case: non-enumerable, collision-free property keys" + N
e3 += "const PRICE = Symbol(" + Q + "price" + Q + ");" + N
e3 += "class Product {" + N
e3 += "  constructor(name, price) { this.name = name; this[PRICE] = price; }" + N
e3 += "  getPrice() { return this[PRICE]; }" + N
e3 += "}" + N
e3 += BT3

# ---- handwriteData ----
hw1 = ""
hw1 += "## Debounce (防抖)" + N + N
hw1 += "Debounce delays execution until after a period of inactivity. Use cases: search input, window resize, button click prevention." + N + N
hw1 += BT3 + "javascript" + N
hw1 += "function debounce(fn, delay) {" + N
hw1 += "  let timer = null;" + N
hw1 += "  return function(...args) {" + N
hw1 += "    clearTimeout(timer);" + N
hw1 += "    timer = setTimeout(() => fn.apply(this, args), delay);" + N
hw1 += "  };" + N
hw1 += "}" + N
hw1 += "// Usage: input.addEventListener(" + Q + "input" + Q + ", debounce(handleSearch, 300));" + N + N
hw1 += "// With immediate option" + N
hw1 += "function debounce(fn, delay, immediate = false) {" + N
hw1 += "  let timer = null;" + N
hw1 += "  return function(...args) {" + N
hw1 += "    const callNow = immediate && !timer;" + N
hw1 += "    clearTimeout(timer);" + N
hw1 += "    timer = setTimeout(() => { timer = null; if (!immediate) fn.apply(this, args); }, delay);" + N
hw1 += "    if (callNow) fn.apply(this, args);" + N
hw1 += "  };" + N
hw1 += "}" + N
hw1 += BT3 + N + N
hw1 += "## Throttle (节流)" + N + N
hw1 += "Throttle limits execution to at most once per interval. Use cases: scroll events, mousemove, game loops." + N + N
hw1 += BT3 + "javascript" + N
hw1 += "function throttle(fn, interval) {" + N
hw1 += "  let lastTime = 0;" + N
hw1 += "  return function(...args) {" + N
hw1 += "    const now = Date.now();" + N
hw1 += "    if (now - lastTime >= interval) {" + N
hw1 += "      lastTime = now;" + N
hw1 += "      fn.apply(this, args);" + N
hw1 += "    }" + N
hw1 += "  };" + N
hw1 += "}" + N + N
hw1 += "// With trailing edge option" + N
hw1 += "function throttle(fn, interval, options = {}) {" + N
hw1 += "  let lastTime = 0, timer = null;" + N
hw1 += "  const { leading = true, trailing = true } = options;" + N
hw1 += "  return function(...args) {" + N
hw1 += "    const now = Date.now();" + N
hw1 += "    if (!lastTime && !leading) lastTime = now;" + N
hw1 += "    if (now - lastTime >= interval) {" + N
hw1 += "      if (timer) { clearTimeout(timer); timer = null; }" + N
hw1 += "      lastTime = now; fn.apply(this, args);" + N
hw1 += "    } else if (trailing && !timer) {" + N
hw1 += "      timer = setTimeout(() => { lastTime = !leading ? 0 : Date.now(); timer = null; fn.apply(this, args); }, interval - (now - lastTime));" + N
hw1 += "    }" + N
hw1 += "  };" + N
hw1 += "}" + N
hw1 += BT3

hw2 = ""
hw2 += "## Deep Clone (深拷贝)" + N + N
hw2 += "Shallow copy only copies the first level. Deep copy recursively copies all nested objects." + N + N
hw2 += BT3 + "javascript" + N
hw2 += "function deepClone(obj, hash = new WeakMap()) {" + N
hw2 += "  // Handle primitives and null" + N
hw2 += '  if (obj === null || typeof obj !== "object") return obj;' + N
hw2 += "  // Handle circular references" + N
hw2 += "  if (hash.has(obj)) return hash.get(obj);" + N
hw2 += "  // Handle Date" + N
hw2 += "  if (obj instanceof Date) return new Date(obj);" + N
hw2 += "  // Handle RegExp" + N
hw2 += "  if (obj instanceof RegExp) return new RegExp(obj);" + N
hw2 += "  // Handle Array" + N
hw2 += "  if (Array.isArray(obj)) {" + N
hw2 += "    const copy = [];" + N
hw2 += "    hash.set(obj, copy);" + N
hw2 += "    obj.forEach((item, index) => { copy[index] = deepClone(item, hash); });" + N
hw2 += "    return copy;" + N
hw2 += "  }" + N
hw2 += "  // Handle plain objects" + N
hw2 += "  const copy = {};" + N
hw2 += "  hash.set(obj, copy);" + N
hw2 += "  Object.keys(obj).forEach(key => { copy[key] = deepClone(obj[key], hash); });" + N
hw2 += "  return copy;" + N
hw2 += "}" + N + N
hw2 += "// Simplified: structuredClone (native, modern browsers)" + N
hw2 += "const clone = structuredClone(original);" + N
hw2 += "// Limitations: no functions, no DOM nodes, no prototypes" + N
hw2 += BT3 + N + N
hw2 += "## call / apply / bind Implementation" + N + N
hw2 += BT3 + "javascript" + N
hw2 += "// Simplified call implementation" + N
hw2 += "Function.prototype.myCall = function(context, ...args) {" + N
hw2 += "  context = context || globalThis;" + N
hw2 += "  const fnSymbol = Symbol();" + N
hw2 += "  context[fnSymbol] = this;" + N
hw2 += "  const result = context[fnSymbol](...args);" + N
hw2 += "  delete context[fnSymbol];" + N
hw2 += "  return result;" + N
hw2 += "};" + N + N
hw2 += "// Simplified bind implementation" + N
hw2 += "Function.prototype.myBind = function(context, ...boundArgs) {" + N
hw2 += "  const originalFn = this;" + N
hw2 += "  return function(...args) {" + N
hw2 += "    return originalFn.apply(context, [...boundArgs, ...args]);" + N
hw2 += "  };" + N
hw2 += "};" + N
hw2 += BT3

hw3 = ""
hw3 += "## Implementing new" + N + N
hw3 += "The new operator: 1) Creates empty object, 2) Sets prototype, 3) Calls constructor with this, 4) Returns object (unless constructor returns non-primitive)." + N + N
hw3 += BT3 + "javascript" + N
hw3 += "function myNew(constructor, ...args) {" + N
hw3 += "  // 1. Create new object with constructor's prototype" + N
hw3 += "  const obj = Object.create(constructor.prototype);" + N
hw3 += "  // 2. Call constructor with this = new object" + N
hw3 += '  const result = constructor.apply(obj, args);' + N
hw3 += "  // 3. If constructor returns an object, use it; otherwise use obj" + N
hw3 += '  return result !== null && (typeof result === "object" || typeof result === "function")' + N
hw3 += "    ? result : obj;" + N
hw3 += "}" + N
hw3 += BT3 + N + N
hw3 += "## Implementing Promise.all" + N + N
hw3 += BT3 + "javascript" + N
hw3 += "Promise.myAll = function(promises) {" + N
hw3 += "  return new Promise((resolve, reject) => {" + N
hw3 += "    if (!Array.isArray(promises)) {" + N
hw3 += "      return reject(new TypeError(" + Q + "Argument must be an array" + Q + "));" + N
hw3 += "    }" + N
hw3 += "    const results = [];" + N
hw3 += "    let completed = 0;" + N
hw3 += "    if (promises.length === 0) return resolve(results);" + N
hw3 += "    promises.forEach((promise, index) => {" + N
hw3 += "      Promise.resolve(promise).then(value => {" + N
hw3 += "        results[index] = value;" + N
hw3 += "        completed++;" + N
hw3 += "        if (completed === promises.length) resolve(results);" + N
hw3 += "      }).catch(reject);" + N
hw3 += "    });" + N
hw3 += "  });" + N
hw3 += "};" + N
hw3 += BT3 + N + N
hw3 += "## Currying (柯里化)" + N + N
hw3 += BT3 + "javascript" + N
hw3 += "function curry(fn) {" + N
hw3 += "  return function curried(...args) {" + N
hw3 += "    if (args.length >= fn.length) {" + N
hw3 += "      return fn.apply(this, args);" + N
hw3 += "    }" + N
hw3 += "    return function(...nextArgs) {" + N
hw3 += "      return curried.apply(this, [...args, ...nextArgs]);" + N
hw3 += "    };" + N
hw3 += "  };" + N
hw3 += "}" + N
hw3 += "// Usage: const add = (a, b, c) => a + b + c;" + N
hw3 += "// const curriedAdd = curry(add);" + N
hw3 += "// curriedAdd(1)(2)(3); // 6" + N
hw3 += BT3 + N + N
hw3 += "## Pub/Sub Pattern (发布订阅)" + N + N
hw3 += BT3 + "javascript" + N
hw3 += "class EventEmitter {" + N
hw3 += "  constructor() { this.events = {}; }" + N
hw3 += "  on(event, fn) {" + N
hw3 += "    (this.events[event] ||= []).push(fn);" + N
hw3 += "    return this;" + N
hw3 += "  }" + N
hw3 += "  off(event, fn) {" + N
hw3 += "    if (this.events[event]) {" + N
hw3 += "      this.events[event] = this.events[event].filter(f => f !== fn);" + N
hw3 += "    }" + N
hw3 += "    return this;" + N
hw3 += "  }" + N
hw3 += "  emit(event, ...args) {" + N
hw3 += "    (this.events[event] || []).forEach(fn => fn.apply(this, args));" + N
hw3 += "  }" + N
hw3 += "  once(event, fn) {" + N
hw3 += "    const wrapper = (...args) => { fn.apply(this, args); this.off(event, wrapper); };" + N
hw3 += "    return this.on(event, wrapper);" + N
hw3 += "  }" + N
hw3 += "}" + N
hw3 += BT3

# ---- nodejsData ----
n1 = ""
n1 += "## Node.js Event Loop" + N + N
n1 += "Node.js event loop has 6 phases, processing different types of callbacks in order:" + N + N
n1 += BT3 + "" + N
n1 += "   ┌───────────────────────────┐" + N
n1 += "┌─>│           timers          │ setTimeout / setInterval" + N
n1 += "│  └─────────────┬─────────────┘" + N
n1 += "│  ┌─────────────┴─────────────┐" + N
n1 += "│  │     pending callbacks     │ I/O callbacks deferred" + N
n1 += "│  └─────────────┬─────────────┘" + N
n1 += "│  ┌─────────────┴─────────────┐" + N
n1 += "│  │       idle, prepare       │ internal" + N
n1 += "│  └─────────────┬─────────────┘" + N
n1 += "│  ┌─────────────┴─────────────┐" + N
n1 += "│  │           poll            │ I/O (fs, network)" + N
n1 += "│  └─────────────┬─────────────┘" + N
n1 += "│  ┌─────────────┴─────────────┐" + N
n1 += "│  │           check           │ setImmediate" + N
n1 += "│  └─────────────┬─────────────┘" + N
n1 += "│  ┌─────────────┴─────────────┐" + N
n1 += "└──┤      close callbacks      │ socket.on(" + Q + "close" + Q + ")" + N
n1 += "   └───────────────────────────┘" + N
n1 += BT3 + N + N
n1 += "Microtasks (process.nextTick and Promise callbacks) execute between each phase." + N + N
n1 += BT3 + "javascript" + N
n1 += "console.log(1);" + N
n1 += "setTimeout(() => console.log(2), 0);" + N
n1 += "setImmediate(() => console.log(3));" + N
n1 += "process.nextTick(() => console.log(4));" + N
n1 += "Promise.resolve().then(() => console.log(5));" + N
n1 += "console.log(6);" + N
n1 += "// Output: 1 6 4 5 2 3 (or 1 6 4 5 3 2)" + N
n1 += BT3 + N + N
n1 += "**process.nextTick vs Promise:** nextTick has higher priority than Promises. Both are microtasks but nextTick executes before Promise callbacks."

n2 = ""
n2 += "## CommonJS vs ESM" + N + N
n2 += "| Feature | CommonJS (require) | ESM (import/export) |" + N
n2 += "|---------|-------------------|--------------------|" + N
n2 += "| Syntax | require/module.exports | import/export |" + N
n2 += "| Loading | Synchronous (blocking) | Asynchronous |" + N
n2 += "| Timing | Runtime | Static (compile-time analysis) |" + N
n2 += "| Tree Shaking | Not possible | Supported |" + N
n2 += "| Top-level await | Not supported | Supported |" + N
n2 += "| this at top level | module.exports | undefined |" + N + N
n2 += BT3 + "javascript" + N
n2 += "// CommonJS" + N
n2 += "const fs = require(" + Q + "fs" + Q + ");" + N
n2 += "module.exports = { greet: () => " + Q + "Hello" + Q + " };" + N + N
n2 += "// ESM" + N
n2 += "import fs from " + Q + "fs" + Q + ";" + N
n2 += "export const greet = () => " + Q + "Hello" + Q + ";" + N
n2 += "export default class MyClass {}" + N
n2 += BT3 + N + N
n2 += "## Express / Koa Middleware" + N + N
n2 += "Middleware pattern: functions that have access to request, response, and the next middleware function." + N + N
n2 += BT3 + "javascript" + N
n2 += "// Express middleware" + N
n2 += "const logger = (req, res, next) => {" + N
n2 += '  console.log(`${req.method} ${req.url} ${Date.now()}`);' + N
n2 += "  next(); // Pass control to next middleware" + N
n2 += "};" + N
n2 += "app.use(logger);" + N + N
n2 += "// Koa middleware (onion model, async/await)" + N
n2 += "const koaLogger = async (ctx, next) => {" + N
n2 += "  const start = Date.now();" + N
n2 += "  await next(); // Execute downstream, then upstream" + N
n2 += '  console.log(`${ctx.method} ${ctx.url} - ${Date.now() - start}ms`);' + N
n2 += "};" + N
n2 += BT3 + N + N
n2 += "## Stream & Buffer" + N + N
n2 += BT3 + "javascript" + N
n2 += "// Buffer: raw binary data" + N
n2 += "const buf = Buffer.from(" + Q + "Hello" + Q + ", " + Q + "utf-8" + Q + ");" + N
n2 += "console.log(buf.toString(" + Q + "base64" + Q + "));" + N + N
n2 += "// Streams: process data in chunks (memory efficient)" + N
n2 += "const readStream = fs.createReadStream(" + Q + "input.txt" + Q + ");" + N
n2 += "const writeStream = fs.createWriteStream(" + Q + "output.txt" + Q + ");" + N
n2 += "readStream.pipe(writeStream); // Pipe: read -> write" + N
n2 += "writeStream.on(" + Q + "finish" + Q + ", () => console.log(" + Q + "Done" + Q + "));" + N + N
n2 += "// cluster: multi-process (leverage multi-core)" + N
n2 += "const cluster = require(" + Q + "cluster" + Q + ");" + N
n2 += "if (cluster.isMaster) {" + N
n2 += '  for (let i = 0; i < require("os").cpus().length; i++) cluster.fork();' + N
n2 += "} else { require(" + Q + "./server" + Q + "); }" + N
n2 += BT3

o = N + "export const htmlData = {" + N
o += "  name: " + Q + "HTML Knowledge" + Q + "," + N
o += "  description: " + Q + "HTML5 semantic tags, new APIs, SEO, Canvas/SVG" + Q + "," + N
o += "  icon: " + Q + "H" + Q + "," + N
o += "  items: [" + N
o += mk_item("html-01", "HTML5 Semantic Tags, WebSocket, Web Worker & localStorage", ["HTML5", "Semantic", "Web APIs"], "HTML5 semantic elements, WebSocket full-duplex communication, Web Workers for background threads, and client storage APIs", h1) + "," + N
o += mk_item("html-02", "SEO Best Practices & Structured Data", ["HTML", "SEO", "Structured Data"], "On-page SEO essentials, semantic HTML for search engines, JSON-LD structured data for rich snippets", h2)
o += N + "  ]," + N + "};" + N

o += N + "export const es6Data = {" + N
o += "  name: " + Q + "ES6+ Core" + Q + "," + N
o += "  description: " + Q + "Promises, async/await, arrow functions, destructuring, Proxy, Generator" + Q + "," + N
o += "  icon: " + Q + "E6" + Q + "," + N
o += "  items: [" + N
o += mk_item("es6-01", "Promise & async/await Under the Hood", ["ES6", "Promise", "async/await"], "Promise states, chaining, combinators (all/race/allSettled/any), and async/await as syntactic sugar", e1) + "," + N
o += mk_item("es6-02", "Arrow Functions, Destructuring, Spread, Set/Map, Proxy/Reflect", ["ES6", "Arrow", "Proxy"], "Arrow functions vs regular functions, destructuring patterns, Set/Map/WeakMap, and Proxy for object interception", e2) + "," + N
o += mk_item("es6-03", "Iterator, Generator & Symbol", ["ES6", "Iterator", "Generator"], "Iterator protocol, Generator functions for lazy evaluation, and Symbol for unique property keys", e3)
o += N + "  ]," + N + "};" + N

o += N + "export const handwriteData = {" + N
o += "  name: " + Q + "JS Handwriting" + Q + "," + N
o += "  description: " + Q + "Common JavaScript handwrite problems: debounce, throttle, deep clone, call/apply/bind, Promise, currying" + Q + "," + N
o += "  icon: " + Q + "HW" + Q + "," + N
o += "  items: [" + N
o += mk_item("hw-01", "Implement Debounce and Throttle", ["Handwrite", "Debounce", "Throttle"], "Handwrite debounce (delay until inactive) and throttle (limit to once per interval) with options", hw1) + "," + N
o += mk_item("hw-02", "Implement Deep Clone, call/apply/bind", ["Handwrite", "Deep Clone", "bind"], "Handwrite deep clone with circular reference handling, plus call/apply/bind polyfills", hw2) + "," + N
o += mk_item("hw-03", "Implement new, Promise.all, Currying, Pub/Sub", ["Handwrite", "Promise", "Currying"], "Handwrite the new operator, Promise.all, function currying, and publish/subscribe EventEmitter", hw3)
o += N + "  ]," + N + "};" + N

o += N + "export const nodejsData = {" + N
o += "  name: " + Q + "Node.js Knowledge" + Q + "," + N
o += "  description: " + Q + "Node.js event loop, module systems (CommonJS vs ESM), middleware, streams, cluster" + Q + "," + N
o += "  icon: " + Q + "N" + Q + "," + N
o += "  items: [" + N
o += mk_item("node-01", "Node.js Event Loop: 6 Phases and Microtasks", ["Node.js", "Event Loop", "nextTick"], "Node 6-phase event loop (timers/poll/check), process.nextTick vs Promise microtask priority", n1) + "," + N
o += mk_item("node-02", "CommonJS vs ESM, Express/Koa Middleware, Stream & Buffer", ["Node.js", "Modules", "Middleware"], "CommonJS vs ES modules comparison, Express/Koa middleware onion model, and Stream/Buffer for efficient I/O", n2)
o += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "a", encoding="utf-8") as f:
    f.write(o)
print("Batch2 OK, chars: " + str(len(o)))
