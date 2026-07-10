import sys, os
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34)
N = chr(10)
BS = chr(92)
BT = chr(96)
DS = chr(36)
BT3 = BT + BT + BT

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

c1 = ""
c1 += "## useState: Batch Updates and Closure Traps" + N + N
c1 += "useState stores state in the Fiber memoizedState linked list. Updates are asynchronous and batched." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useState } from " + Q + "react" + Q + ";" + N + N
c1 += "function Counter() {" + N
c1 += "  const [count, setCount] = useState(0);" + N + N
c1 += "  // Closure trap: both updates read the same old value" + N
c1 += "  const wrong = () =&gt; {" + N
c1 += "    setCount(count + 1);" + N
c1 += "    setCount(count + 1); // count only +1!" + N
c1 += "  };" + N + N
c1 += "  // Functional update: prev always points to latest state" + N
c1 += "  const correct = () =&gt; {" + N
c1 += "    setCount(prev =&gt; prev + 1);" + N
c1 += "    setCount(prev =&gt; prev + 1); // count +2" + N
c1 += "  };" + N + N
c1 += "  return &lt;button onClick={correct}&gt;Count: {count}&lt;/button&gt;;" + N
c1 += "}" + N + BT3 + N + N
c1 += "**React 18 Automatic Batching:** Before React 18, only event handlers batched updates. React 18 with createRoot batches all updates (setTimeout, Promises, native events)." + N + N
c1 += "**Lazy Initialization:** Pass a function for expensive initial state:" + N + BT3 + "tsx" + N
c1 += "const [state, setState] = useState(() =&gt; expensiveComputation());" + N + BT3 + N + N
c1 += "## useEffect: Dependencies and Cleanup" + N + N
c1 += "useEffect runs after browser paint. Cleanup prevents memory leaks and race conditions." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useState, useEffect } from " + Q + "react" + Q + ";" + N + N
c1 += "function UserProfile({ userId }: { userId: string }) {" + N
c1 += "  const [user, setUser] = useState(null);" + N + N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    let cancelled = false;" + N
c1 += "    fetch(" + BT + "/api/users/" + DS + "{userId}" + BT + ")" + N
c1 += "      .then(res =&gt; res.json())" + N
c1 += "      .then(data =&gt; { if (!cancelled) setUser(data); });" + N
c1 += "    return () =&gt; { cancelled = true; };" + N
c1 += "  }, [userId]);" + N + N
c1 += "  return &lt;div&gt;{user?.name ?? " + Q + "Loading..." + Q + "}&lt;/div&gt;;" + N
c1 += "}" + N + BT3 + N + N
c1 += "useEffect vs useLayoutEffect: useEffect runs async after paint (non-blocking); useLayoutEffect runs sync after DOM mutations but before paint (for measuring DOM synchronously)." + N + N
c1 += "## useRef: Three Core Use Cases" + N + N
c1 += "useRef returns a mutable object whose .current persists across renders without triggering re-render." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useRef, useState, useEffect } from " + Q + "react" + Q + ";" + N + N
c1 += "function Timer() {" + N
c1 += "  const [count, setCount] = useState(0);" + N
c1 += "  const inputRef = useRef&lt;HTMLInputElement&gt;(null); // 1. DOM reference" + N
c1 += "  const timerRef = useRef&lt;number | null&gt;(null);  // 2. Mutable value" + N
c1 += "  const countRef = useRef(count);" + N
c1 += "  countRef.current = count; // 3. Always latest value" + N + N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    timerRef.current = setInterval(() =&gt; setCount(c =&gt; c + 1), 1000);" + N
c1 += "    return () =&gt; clearInterval(timerRef.current!);" + N
c1 += "  }, []);" + N + N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    const id = setInterval(() =&gt; console.log(countRef.current), 2000);" + N
c1 += "    return () =&gt; clearInterval(id);" + N
c1 += "  }, []); // Empty deps + ref = closure trap solution" + N + N
c1 += "  return &lt;p onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;Timer: {count}s&lt;/p&gt;;" + N
c1 += "}" + N + BT3 + N + N
c1 += "**useRef vs createRef:** useRef returns same object each render; createRef creates new object each render. Use useRef in function components." + N + N
c1 += "**Key Takeaways:** useState (async batching + functional updates avoid closure traps); useEffect (async side effects + cleanup prevents leaks); useRef (persistent mutable reference, no re-render)."

c2 = ""
c2 += "## Virtual DOM Design Motivation" + N + N
c2 += "Direct DOM manipulation is expensive. Virtual DOM is a lightweight JS abstraction that merges multiple operations into efficient batch updates." + N + N
c2 += BT3 + "javascript" + N
c2 += "const vnode = {" + N
c2 += "  type: " + Q + "div" + Q + ", key: null," + N
c2 += "  props: { className: " + Q + "container" + Q + " }," + N
c2 += "  children: [" + N
c2 += "    { type: " + Q + "h1" + Q + ", props: { children: " + Q + "Title" + Q + " } }," + N
c2 += "    { type: " + Q + "p" + Q + ",  props: { children: " + Q + "Content" + Q + " } }," + N
c2 += "  ]," + N + "};" + N + BT3 + N + N
c2 += "Core values: Declarative programming, cross-platform abstraction, batch updates reducing real DOM operations." + N + N
c2 += "## Diff Algorithm: Three Strategies (O(n^3) to O(n))" + N + N
c2 += "**Tree Diff:** Only compare same-level nodes. Cross-level moves trigger delete and recreate." + N
c2 += "**Component Diff:** Same type = deep compare; Different type = replace entire subtree." + N
c2 += BT3 + "tsx" + N + "{isLoggedIn ? &lt;Dashboard /&gt; : &lt;LoginPage /&gt;}" + N + BT3 + N
c2 += "**Element Diff (key is everything):**" + N
c2 += BT3 + "tsx" + N
c2 += "{items.map((item, i) =&gt; &lt;Item key={i} data={item} /&gt;)} // index as key" + N
c2 += "{items.map(item =&gt; &lt;Item key={item.id} data={item} /&gt;)} // stable unique ID" + N + BT3 + N
c2 += "Key rules: Unique (among siblings), Stable (across renders), Predictable (no Math.random())." + N + N
c2 += "## Fiber Architecture: Interruptible Concurrent Rendering" + N + N
c2 += "React 15 Stack Reconciler used synchronous recursion - could not be interrupted, causing frame drops with complex trees. React 16+ Fiber Reconciler introduces Time Slicing and Priority Scheduling." + N + N
c2 += "**Fiber Node (Linked List Structure):**" + N + BT3 + "javascript" + N
c2 += "{" + N
c2 += "  type: " + Q + "div" + Q + ",           // component type" + N
c2 += "  stateNode: domElement, // real DOM node" + N
c2 += "  child:  firstChild,    // first child" + N
c2 += "  sibling: nextSibling,  // next sibling" + N
c2 += "  return:  parent,       // parent (forms linked list)" + N
c2 += "  alternate: oldFiber,   // double buffering: alternate tree node" + N
c2 += "  memoizedState: null,   // hooks linked list head" + N
c2 += "  effectTag: 0,          // Placement/Update/Deletion flags" + N
c2 += "}" + N + BT3 + N + N
c2 += "**Double Buffering:** React maintains two Fiber trees: current (on-screen) and workInProgress (building). Nodes connect via alternate pointers. On completion, root.current swaps atomically." + N + N
c2 += "**Two-Phase Rendering:**" + N + BT3 + "javascript" + N
c2 += "// Render Phase (interruptible, pure computation, no side effects)" + N
c2 += "function workLoop(deadline) {" + N
c2 += "  let shouldYield = false;" + N
c2 += "  while (nextUnitOfWork &amp;&amp; !shouldYield) {" + N
c2 += "    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);" + N
c2 += "    shouldYield = deadline.timeRemaining() &lt; 1;" + N
c2 += "  }" + N
c2 += "  if (!nextUnitOfWork) commitRoot();" + N
c2 += "  requestIdleCallback(workLoop);" + N
c2 += "}" + N
c2 += "// Commit Phase (non-interruptible, synchronous)" + N
c2 += "// beforeMutation -> mutation (DOM ops) -> layout (useLayoutEffect)" + N + BT3 + N + N
c2 += "**Lane Priority Model:** User interactions (clicks, input) get high priority; data-fetching updates get low priority. High priority can interrupt low priority Render phase. The Scheduler package handles scheduling." + N + N
c2 += "**Summary:** Virtual DOM + Diff = declarative rendering foundation; Fiber + Scheduler = concurrent rendering, smooth UX."

c3 = ""
c3 += "## React.memo - Component-Level Shallow Comparison" + N + N
c3 += "React.memo is a HOC that shallow-compares props, skipping render when unchanged." + N + N
c3 += BT3 + "tsx" + N
c3 += "import { memo, useState, useMemo } from " + Q + "react" + Q + ";" + N + N
c3 += "const List = memo(({ items }: { items: string[] }) =&gt; {" + N
c3 += "  console.log(" + Q + "Rendered" + Q + ");" + N
c3 += "  return &lt;ul&gt;{items.map(i =&gt; &lt;li key={i}&gt;{i}&lt;/li&gt;)}&lt;/ul&gt;;" + N
c3 += "});" + N + N
c3 += "function Parent() {" + N
c3 += "  const [count, setCount] = useState(0);" + N
c3 += "  const items = useMemo(() =&gt; [" + Q + "Apple" + Q + ", " + Q + "Banana" + Q + "], []);" + N
c3 += "  return &lt;div&gt;&lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;{count}&lt;/button&gt;&lt;List items={items} /&gt;&lt;/div&gt;;" + N
c3 += "}" + N + BT3 + N + N
c3 += "## useMemo - Cache Computed Values" + N + N
c3 += "Returns cached result when dependencies are unchanged." + N + N
c3 += BT3 + "tsx" + N
c3 += "import { useMemo, useState } from " + Q + "react" + Q + ";" + N + N
c3 += "function ProductList({ products }: { products: Product[] }) {" + N
c3 += "  const [filter, setFilter] = useState(" + Q + Q + ");" + N
c3 += "  const [sort, setSort] = useState(" + Q + "asc" + Q + ");" + N
c3 += "  const processed = useMemo(() =&gt; {" + N
c3 += "    let r = products.filter(p =&gt; p.name.includes(filter));" + N
c3 += "    r.sort((a, b) =&gt; sort === " + Q + "asc" + Q + " ? a.price - b.price : b.price - a.price);" + N
c3 += "    return r;" + N
c3 += "  }, [products, filter, sort]);" + N
c3 += "  return &lt;ul&gt;{processed.map(p =&gt; &lt;li key={p.id}&gt;{p.name}&lt;/li&gt;)}&lt;/ul&gt;;" + N
c3 += "}" + N + BT3 + N + N
c3 += "## useCallback - Cache Function References" + N + N
c3 += "useCallback(fn, deps) is equivalent to useMemo(() =&gt; fn, deps)." + N + N
c3 += BT3 + "tsx" + N
c3 += "import { useState, useCallback, memo } from " + Q + "react" + Q + ";" + N + N
c3 += "const Btn = memo(({ onClick, label }) =&gt; {" + N
c3 += "  console.log(label + " + Q + " rendered" + Q + ");" + N
c3 += "  return &lt;button onClick={onClick}&gt;{label}&lt;/button&gt;;" + N
c3 += "});" + N + N
c3 += "function Counter() {" + N
c3 += "  const [a, setA] = useState(0);" + N
c3 += "  const [b, setB] = useState(0);" + N
c3 += "  const incA = useCallback(() =&gt; setA(c =&gt; c + 1), []);" + N
c3 += "  const incB = useCallback(() =&gt; setB(c =&gt; c + 1), []);" + N
c3 += "  return &lt;div&gt;&lt;p&gt;A:{a} B:{b}&lt;/p&gt;&lt;Btn onClick={incA} label=" + Q + "A+" + Q + " /&gt;&lt;Btn onClick={incB} label=" + Q + "B+" + Q + " /&gt;&lt;/div&gt;;" + N
c3 += "}" + N + BT3 + N + N
c3 += "**Optimization Guidelines:**" + N
c3 += "1. Use useMemo/useCallback ONLY when child components use React.memo" + N
c3 += "2. Only useMemo for genuinely expensive computations (complex filtering/sorting)" + N
c3 += "3. These Hooks have their own overhead (dependency tracking, cache storage)" + N
c3 += "4. Measure first with React DevTools Profiler, then optimize - avoid premature optimization"

c4 = ""
c4 += "## useContext + useReducer (Zero-Dependency Lightweight Solution)" + N + N
c4 += "Best for small to medium apps. No third-party library needed." + N + N
c4 += BT3 + "tsx" + N
c4 += "import { createContext, useContext, useReducer, ReactNode } from " + Q + "react" + Q + ";" + N + N
c4 += "interface CartState { items: { id: number; name: string; qty: number }[]; }" + N
c4 += "type CartAction =" + N
c4 += "  | { type: " + Q + "ADD" + Q + "; payload: { id: number; name: string } }" + N
c4 += "  | { type: " + Q + "REMOVE" + Q + "; payload: { id: number } };" + N + N
c4 += "function reducer(state: CartState, action: CartAction): CartState {" + N
c4 += "  switch (action.type) {" + N
c4 += "    case " + Q + "ADD" + Q + ": {" + N
c4 += "      const e = state.items.find(i =&gt; i.id === action.payload.id);" + N
c4 += "      if (e) return { ...state, items: state.items.map(i =&gt;" + N
c4 += "        i.id === e.id ? { ...i, qty: i.qty + 1 } : i) };" + N
c4 += "      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };" + N
c4 += "    }" + N
c4 += "    case " + Q + "REMOVE" + Q + ": return { ...state, items: state.items.filter(i =&gt; i.id !== action.payload.id) };" + N
c4 += "    default: return state;" + N
c4 += "  }" + N + "}" + N + N
c4 += "const StateCtx = createContext&lt;CartState&gt;({ items: [] });" + N
c4 += "const DispatchCtx = createContext&lt;React.Dispatch&lt;CartAction&gt;&gt;(() =&gt; {});" + N + N
c4 += "function CartProvider({ children }: { children: ReactNode }) {" + N
c4 += "  const [state, dispatch] = useReducer(reducer, { items: [] });" + N
c4 += "  return &lt;StateCtx.Provider value={state}&gt;&lt;DispatchCtx.Provider value={dispatch}&gt;{children}&lt;/DispatchCtx.Provider&gt;&lt;/StateCtx.Provider&gt;;" + N
c4 += "}" + N + BT3 + N + N
c4 += "**Context Performance Trap:** Provider value changes cause ALL consumers to re-render. Solution: split state and dispatch into separate Contexts." + N + N
c4 += "## Redux Toolkit (Enterprise-Grade State Management)" + N + N
c4 += "Redux principles: Single source of truth, State is read-only, Changes via pure reducers." + N + N
c4 += BT3 + "tsx" + N
c4 += "import { createSlice, PayloadAction } from " + Q + "@reduxjs/toolkit" + Q + ";" + N + N
c4 += "const cartSlice = createSlice({" + N
c4 += "  name: " + Q + "cart" + Q + "," + N
c4 += "  initialState: { items: [] as { id: number; name: string; qty: number }[] }," + N
c4 += "  reducers: {" + N
c4 += "    addItem(state, action: PayloadAction&lt;{ id: number; name: string }&gt;) {" + N
c4 += "      const e = state.items.find(i =&gt; i.id === action.payload.id);" + N
c4 += "      if (e) e.qty += 1;  // Immer allows direct mutation" + N
c4 += "      else state.items.push({ ...action.payload, qty: 1 });" + N
c4 += "    }," + N
c4 += "    removeItem(state, action: PayloadAction&lt;number&gt;) {" + N
c4 += "      state.items = state.items.filter(i =&gt; i.id !== action.payload);" + N
c4 += "    }," + N
c4 += "  }," + N + "});" + N
c4 += "export const { addItem, removeItem } = cartSlice.actions;" + N
c4 += "export default cartSlice.reducer;" + N + BT3 + N + N
c4 += "**Data Flow:** View - dispatch(action) - Middleware (async: thunk/saga) - Reducer (pure fn) - Store - View" + N + N
c4 += "## Zustand (Minimalist State Management)" + N + N
c4 += "Drops Provider, Reducer, Action Creator concepts. Keeps only core state and update functions." + N + N
c4 += BT3 + "tsx" + N
c4 += "import { create } from " + Q + "zustand" + Q + ";" + N + N
c4 += "const useStore = create&lt;{ bears: number; inc: () =&gt; void }&gt;((set) =&gt; ({" + N
c4 += "  bears: 0," + N
c4 += "  inc: () =&gt; set((s) =&gt; ({ bears: s.bears + 1 }))," + N
c4 += "}));" + N + N
c4 += "function Counter() {" + N
c4 += "  const bears = useStore((s) =&gt; s.bears);" + N
c4 += "  return &lt;div onClick={useStore((s) =&gt; s.inc)}&gt;{bears} bears&lt;/div&gt;;" + N
c4 += "}" + N + BT3 + N + N
c4 += "**Principle:** Pub/sub pattern. create maintains state + listeners set. set updates state and notifies all subscribers. Selector prevents unnecessary re-renders. Uses useSyncExternalStore (React 18+) for concurrent safety." + N + N
c4 += "**Selection Guide:** Component state -&gt; useState; Cross-component sharing -&gt; Context+useReducer; Large apps -&gt; Redux Toolkit; Minimalist -&gt; Zustand."

o = "export const reactData = {" + N
o += "  name: " + Q + "React Core" + Q + "," + N
o += "  description: " + Q + "React basics, Hooks, state management, performance optimization" + Q + "," + N
o += "  icon: " + Q + "R" + Q + "," + N
o += "  items: [" + N
o += mk_item("react-01", "React Hooks Deep Dive: useState / useEffect / useRef", ["React", "Hooks", "useState"], "Master React Hooks mechanisms: batch updates, cleanup functions, and useRef use cases", c1) + "," + N
o += mk_item("react-02", "Virtual DOM Diff Algorithm and Fiber Architecture", ["React", "Virtual DOM", "Fiber"], "From Virtual DOM design to Diff strategies to Fiber interruptible rendering engine", c2) + "," + N
o += mk_item("react-03", "React.memo / useMemo / useCallback Performance Optimization", ["React", "Performance", "memo"], "Master React three rendering optimization APIs: use cases, principles, and common pitfalls", c3) + "," + N
o += mk_item("react-04", "React State Management: Context / Redux Toolkit / Zustand", ["React", "State Management", "Redux"], "From lightweight Context+useReducer to enterprise Redux Toolkit to minimal Zustand", c4)
o += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "w", encoding="utf-8") as f:
    f.write(o)
print("reactData written OK, chars: " + str(len(o)))
