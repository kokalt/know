import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34)
N = chr(10)
BS = chr(92)
BT = chr(96)
DS = chr(36)
BT3 = BT + BT + BT
SP = " "
L = "{" + N
R = N + "}"

def line(txt):
    return txt + N

# Build content strings
c1_hdr = "## useState " + chr(25104) + chr(25209) + chr(37327) + chr(26356) + chr(26032) + chr(19982) + chr(38381) + chr(21253) + chr(38519) + chr(38449)" + N + N
c1_hdr += "useState " + chr(26159) + " React " + chr(20989) + chr(25968) + chr(32452) + chr(20214) + chr(30340) + chr(29366) + chr(24577) + chr(22522) + chr(30707) + N

c1 = ""
c1 += "## useState Batch Updates" + N + N
c1 += "useState is the foundation of React function component state, relying on the memoizedState linked list on Fiber nodes." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useState } from " + Q + "react" + Q + ";" + N
c1 += N
c1 += "function Counter() {" + N
c1 += "  const [count, setCount] = useState(0);" + N
c1 += N
c1 += "  // Closure trap: both updates use the same old value" + N
c1 += "  const wrong = () => {" + N
c1 += "    setCount(count + 1);" + N
c1 += "    setCount(count + 1); // count only +1!" + N
c1 += "  };" + N
c1 += N
c1 += "  // Functional update: prev always points to latest" + N
c1 += "  const correct = () => {" + N
c1 += "    setCount(prev =&gt; prev + 1);" + N
c1 += "    setCount(prev =&gt; prev + 1); // count +2" + N
c1 += "  };" + N
c1 += N
c1 += "  return &lt;button onClick={correct}&gt;Count: {count}&lt;/button&gt;;" + N
c1 += "}" + N
c1 += BT3 + N + N

c1 += "**React 18 Automatic Batching:** Before React 18, batching only happened in event handlers. React 18 via createRoot enables automatic batching in all scenarios (setTimeout, Promise, native events)." + N + N

c1 += "**Lazy initialization:** Pass a function to useState for expensive initial state:" + N
c1 += BT3 + "tsx" + N
c1 += "const [state, setState] = useState(() =&gt; expensiveComputation());" + N
c1 += BT3 + N + N

c1 += "## useEffect Dependencies and Cleanup" + N + N
c1 += "useEffect handles side effects: data fetching, subscriptions, DOM operations. The cleanup function is called before the next effect runs or when the component unmounts." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useState, useEffect } from " + Q + "react" + Q + ";" + N
c1 += N
c1 += "function UserProfile({ userId }: { userId: string }) {" + N
c1 += "  const [user, setUser] = useState(null);" + N
c1 += N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    let cancelled = false;" + N
c1 += "    fetch(" + BT + "/api/users/" + DS + "{userId}" + BT + ")" + N
c1 += "      .then(res =&gt; res.json())" + N
c1 += "      .then(data =&gt; { if (!cancelled) setUser(data); });" + N
c1 += "    return () =&gt; { cancelled = true; };" + N
c1 += "  }, [userId]);" + N
c1 += N
c1 += "  return &lt;div&gt;{user" + chr(63) + ".name ?? " + Q + "Loading..." + Q + "}&lt;/div&gt;;" + N
c1 += "}" + N
c1 += BT3 + N + N

c1 += "useEffect runs asynchronously after browser layout and paint. useLayoutEffect runs synchronously after DOM mutations but before paint, suitable for measuring DOM and adjusting synchronously." + N + N

c1 += "## Three Uses of useRef" + N + N
c1 += "useRef returns an object whose reference stays constant throughout the component lifecycle. Modifying .current does not trigger re-render." + N + N
c1 += BT3 + "tsx" + N
c1 += "import { useRef, useState, useEffect } from " + Q + "react" + Q + ";" + N + N
c1 += "function Timer() {" + N
c1 += "  const [count, setCount] = useState(0);" + N
c1 += "  const inputRef = useRef&lt;HTMLInputElement&gt;(null);" + N
c1 += "  const timerRef = useRef&lt;number | null&gt;(null);" + N
c1 += "  const countRef = useRef(count);" + N
c1 += "  countRef.current = count;" + N + N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    timerRef.current = setInterval(() =&gt; setCount(c =&gt; c + 1), 1000);" + N
c1 += "    return () =&gt; clearInterval(timerRef.current!);" + N
c1 += "  }, []);" + N + N
c1 += "  useEffect(() =&gt; {" + N
c1 += "    const id = setInterval(() =&gt; console.log(" + Q + "Latest:" + Q + ", countRef.current), 2000);" + N
c1 += "    return () =&gt; clearInterval(id);" + N
c1 += "  }, []);" + N + N
c1 += "  return &lt;p onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;Timer: {count}s&lt;/p&gt;;" + N
c1 += "}" + N
c1 += BT3 + N + N

c1 += "**useRef vs createRef:** useRef returns the same object reference each render; createRef creates a new object each render. Function components must use useRef." + N + N
c1 += "**Summary:** useState (async batch + functional update avoids closure trap); useEffect (async side effects + cleanup prevents leaks); useRef (persistent mutable reference, no re-render)."

# Build output
o = "export const reactData = {" + N
o += "  name: " + Q + "React Core" + Q + "," + N
o += "  description: " + Q + "React basics, Hooks, state management, performance optimization" + Q + "," + N
o += "  icon: " + Q + "R" + Q + "," + N
o += "  items: [" + N

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

o += mk_item("react-01",
    "React Hooks: useState / useEffect / useRef",
    ["React", "Hooks", "useState"],
    "Deep dive into React Hooks mechanisms",
    c1)

o += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "w", encoding="utf-8") as f:
    f.write(o)

print("OK: " + str(len(o)))
