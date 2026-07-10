import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34); N = chr(10); BS = chr(92); BT = chr(96); DS = chr(36)
BT3 = BT + BT + BT

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

# ---- networkData (3 items) ----
net1 = ""
net1 += "## HTTP/1.1 vs HTTP/2 vs HTTP/3" + N + N
net1 += "### HTTP/1.1" + N
net1 += "- Text-based protocol, human-readable" + N
net1 += "- Persistent connections (keep-alive) reduce TCP handshake overhead" + N
net1 += "- Head-of-line blocking: requests on same connection must be sequential" + N
net1 += "- Pipelining supported but rarely used due to bugs" + N + N
net1 += "### HTTP/2" + N
net1 += "- Binary protocol (not text), more efficient to parse" + N
net1 += "- Multiplexing: multiple streams over single TCP connection" + N
net1 += "- Server Push: server can proactively send resources to client" + N
net1 += "- Header compression (HPACK): reduces overhead of repeated headers" + N
net1 += "- Still uses TCP => head-of-line blocking at TCP level" + N + N
net1 += "### HTTP/3 (QUIC)" + N
net1 += "- Runs over QUIC (UDP-based), not TCP" + N
net1 += "- Eliminates TCP head-of-line blocking" + N
net1 += "- 0-RTT connection establishment (faster than TCP+TLS)" + N
net1 += "- Built-in encryption (TLS 1.3)" + N
net1 += "- Connection migration (survives network changes, e.g. WiFi to cellular)" + N + N
net1 += "| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |" + N
net1 += "|---------|----------|--------|--------|" + N
net1 += "| Format | Text | Binary | Binary |" + N
net1 += "| Multiplexing | No | Yes (stream) | Yes (stream) |" + N
net1 += "| Transport | TCP | TCP | QUIC (UDP) |" + N
net1 += "| HOL Blocking | Yes | TCP-level | No |" + N
net1 += "| Connection Setup | 1-3 RTT | 1-3 RTT | 0-1 RTT |"

net2 = ""
net2 += "## HTTPS (TLS) Handshake" + N + N
net2 += "HTTPS = HTTP over TLS (Transport Layer Security). TLS handshake establishes an encrypted session between client and server." + N + N
net2 += "### TLS 1.2 Handshake (4-way, 2 RTT)" + N + N
net2 += "```" + N
net2 += "1. ClientHello: client -> server" + N
net2 += "   - Supported TLS versions, cipher suites" + N
net2 += "   - Client random number" + N + N
net2 += "2. ServerHello + Certificate + ServerHelloDone:" + N
net2 += "   - Chosen TLS version and cipher suite" + N
net2 += "   - Server random number" + N
net2 += "   - Server's SSL certificate (with public key)" + N + N
net2 += "3. ClientKeyExchange + ChangeCipherSpec + Finished:" + N
net2 += "   - Client generates pre-master secret" + N
net2 += "   - Encrypts it with server's public key (from certificate)" + N
net2 += "   - Both sides derive session keys from random numbers + pre-master secret" + N + N
net2 += "4. ChangeCipherSpec + Finished (server):" + N
net2 += "   - Server confirms encrypted communication is established" + N
net2 += "```" + N + N
net2 += "### TLS 1.3 (1 RTT, faster and more secure)" + N
net2 += "- Removes obsolete/insecure cipher suites and algorithms" + N
net2 += "- 0-RTT for resumed sessions (but vulnerable to replay attacks)" + N
net2 += "- Forward secrecy mandatory (session key compromise doesn't reveal past sessions)" + N + N
net2 += "## TCP Three-Way Handshake & Four-Way Wave" + N + N
net2 += "### Three-Way Handshake (Establish Connection)" + N + N
net2 += "```" + N
net2 += "1. SYN: Client -> Server (SYN=1, seq=x)" + N
net2 += "   Client enters SYN-SENT state" + N
net2 += "2. SYN-ACK: Server -> Client (SYN=1, ACK=1, seq=y, ack=x+1)" + N
net2 += "   Server enters SYN-RECEIVED state" + N
net2 += "3. ACK: Client -> Server (ACK=1, seq=x+1, ack=y+1)" + N
net2 += "   Both enter ESTABLISHED state" + N
net2 += "```" + N + N
net2 += "### Four-Way Wave (Close Connection)" + N + N
net2 += "```" + N
net2 += "1. FIN: Client -> Server (Client: FIN-WAIT-1)" + N
net2 += "2. ACK: Server -> Client (Server: CLOSE-WAIT, Client: FIN-WAIT-2)" + N
net2 += "3. FIN: Server -> Client (Server: LAST-ACK)" + N
net2 += "4. ACK: Client -> Server (Client: TIME-WAIT (2MSL), then CLOSED)" + N
net2 += "```" + N + N
net2 += "**TIME-WAIT (2MSL=~120s):** Client waits to ensure server receives final ACK. If ACK is lost, server will retransmit FIN, and client can re-send ACK."

net3 = ""
net3 += "## OSI Model (7 Layers vs TCP/IP 4 Layers)" + N + N
net3 += "```" + N
net3 += "OSI                    TCP/IP         Protocols" + N
net3 += "7 Application           Application    HTTP, DNS, SMTP, FTP" + N
net3 += "6 Presentation" + N
net3 += "5 Session" + N
net3 += "4 Transport             Transport      TCP, UDP" + N
net3 += "3 Network               Internet       IP, ICMP" + N
net3 += "2 Data Link             Link           Ethernet, Wi-Fi, ARP" + N
net3 += "1 Physical                            Cables, radio waves" + N
net3 += "```" + N + N
net3 += "## DNS Resolution" + N + N
net3 += "DNS resolves domain names to IP addresses through a hierarchical query system:" + N + N
net3 += "```" + N
net3 += "1. Browser cache (chrome://net-internals/#dns)" + N
net3 += "2. OS hosts file (/etc/hosts or C:\\Windows\\System32\\drivers\\etc\\hosts)" + N
net3 += "3. Router cache" + N
net3 += "4. ISP DNS resolver (recursive query)" + N
net3 += "   -> Root DNS server (.com, .org TLD direction)" + N
net3 += "   -> TLD DNS server (example.com direction)" + N
net3 += "   -> Authoritative DNS server (final IP for www.example.com)" + N
net3 += "```" + N + N
net3 += "## CDN Principles" + N + N
net3 += "CDN distributes content across geographically distributed edge servers:" + N
net3 += "1. User requests a resource (e.g. image, JS bundle)" + N
net3 += "2. DNS routes to nearest CDN edge server (based on user's IP)" + N
net3 += "3. Edge server serves from cache if available (cache hit)" + N
net3 += "4. Cache miss: edge server pulls from origin, caches, and serves" + N
net3 += "5. Benefits: lower latency, reduced origin load, DDoS mitigation" + N + N
net3 += "## WebSocket" + N + N
net3 += "WebSocket provides full-duplex, persistent connection over a single TCP connection. Unlike HTTP request-response, both sides can send data at any time." + N + N
net3 += BT3 + "javascript" + N
net3 += "const ws = new WebSocket(" + Q + "wss://example.com/ws" + Q + ");" + N
net3 += "ws.onopen = () => ws.send(" + Q + "Hello!" + Q + ");" + N
net3 += "ws.onmessage = (e) => console.log(e.data);" + N
net3 += "ws.onclose = () => console.log(" + Q + "Disconnected" + Q + ");" + N
net3 += BT3 + N + N
net3 += "**WebSocket vs HTTP:** WebSocket uses ws:// or wss:// scheme, starts as HTTP Upgrade request, then switches protocols. Ideal for real-time apps: chat, live feeds, gaming, collaborative editing."

# ---- eventloopData (2 items) ----
el1 = ""
el1 += "## Macro Tasks vs Micro Tasks" + N + N
el1 += "The JavaScript event loop processes tasks in order: 1) Execute one macro task, 2) Execute ALL micro tasks, 3) Render if needed, 4) Repeat." + N + N
el1 += "| Macro Task (Task Queue) | Micro Task (Microtask Queue) |" + N
el1 += "|--------------------------|-----------------------------|" + N
el1 += "| setTimeout/setInterval   | Promise.then/catch/finally |" + N
el1 += "| I/O callbacks            | MutationObserver           |" + N
el1 += "| UI rendering events      | queueMicrotask()           |" + N
el1 += "| setImmediate (Node)      | process.nextTick (Node)    |" + N
el1 += "| MessageChannel           | async/await (sugar)       |" + N + N
el1 += BT3 + "javascript" + N
el1 += "console.log(" + Q + "1. sync" + Q + ");" + N + N
el1 += "setTimeout(() => {" + N
el1 += "  console.log(" + Q + "2. macro (setTimeout)" + Q + ");" + N
el1 += "}, 0);" + N + N
el1 += "Promise.resolve().then(() => {" + N
el1 += "  console.log(" + Q + "3. micro (Promise)" + Q + ");" + N
el1 += "});" + N + N
el1 += "queueMicrotask(() => {" + N
el1 += "  console.log(" + Q + "4. micro (queueMicrotask)" + Q + ");" + N
el1 += "});" + N + N
el1 += "requestAnimationFrame(() => {" + N
el1 += "  console.log(" + Q + "5. rAF (before next paint)" + Q + ");" + N
el1 += "});" + N + N
el1 += "console.log(" + Q + "6. sync" + Q + ");" + N
el1 += "// Output: 1 6 3 4 2 (then 5 in next frame before paint)" + N
el1 += BT3 + N + N
el1 += "**Key rule:** Each macro task completes. Then ALL pending micro tasks run (including micro tasks added by other micro tasks). Only after microtask queue is empty does the next macro task start."

el2 = ""
el2 += "## Browser vs Node.js Event Loop" + N + N
el2 += "### Browser Event Loop" + N
el2 += "- Single macro task + flush microtasks + optional render" + N
el2 += "- requestAnimationFrame: executes before style calculation and paint (once per frame, ~16ms)" + N
el2 += "- UI events (click, input) are macro tasks" + N
el2 += "- requestIdleCallback: executes during browser idle time (low priority)" + N + N
el2 += "### Node.js Event Loop" + N
el2 += "- 6 distinct phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks" + N
el2 += "- process.nextTick: highest priority, runs between every phase" + N
el2 += "- setImmediate: executes in the check phase (after poll)" + N
el2 += "- No UI rendering concerns" + N + N
el2 += "### requestAnimationFrame Deep Dive" + N + N
el2 += BT3 + "javascript" + N
el2 += "// rAF: callback executes before next repaint (~60fps = ~16.67ms)" + N
el2 += "let start = null;" + N
el2 += "function animate(timestamp) {" + N
el2 += "  if (!start) start = timestamp;" + N
el2 += "  const progress = (timestamp - start) / 1000;" + N
el2 += "  element.style.transform = `translateX(${Math.min(progress * 100, 500)}px)`;" + N
el2 += "  if (progress < 5) {" + N
el2 += "    requestAnimationFrame(animate);" + N
el2 += "  }" + N
el2 += "}" + N
el2 += "requestAnimationFrame(animate);" + N + N
el2 += "// Use rAF for animations (not setInterval)" + N
el2 += "// Benefits:" + N
el2 += "// 1. Synced with display refresh rate (no tearing)" + N
el2 += "// 2. Pauses when tab is inactive (saves battery)" + N
el2 += "// 3. Batched with other rAF callbacks (efficient)" + N
el2 += BT3

# ---- securityData (3 items) ----
sec1 = ""
sec1 += "## XSS (Cross-Site Scripting)" + N + N
sec1 += "XSS injects malicious scripts into web pages viewed by other users." + N + N
sec1 += "### Three Types" + N + N
sec1 += "**1. Reflected XSS:**" + N
sec1 += "Malicious script comes from the current HTTP request (URL params, form input). Server reflects it back in the response without sanitization." + N
sec1 += BT3 + "javascript" + N
sec1 += "// URL: https://example.com/search?q=<script>alert(" + Q + "XSS" + Q + ")</script>" + N
sec1 += "// Server renders: <div>Search results for: <script>alert(" + Q + "XSS" + Q + ")</script></div>" + N
sec1 += BT3 + N
sec1 += "**2. Stored XSS:**" + N
sec1 += "Malicious script is permanently stored on the target server (database, comment, forum post). Victims retrieve it when viewing stored data." + N + N
sec1 += "**3. DOM-based XSS:**" + N
sec1 += "Vulnerability exists in client-side JavaScript. Attack payload never reaches the server." + N
sec1 += BT3 + "javascript" + N
sec1 += "// Vulnerable: user input directly injected into DOM" + N
sec1 += "element.innerHTML = userInput;  // DANGEROUS!" + N
sec1 += "// Safe" + N
sec1 += "element.textContent = userInput;  // Encoded as text, not HTML" + N
sec1 += BT3 + N + N
sec1 += "### XSS Prevention" + N
sec1 += "1. **Input validation and output encoding:** Escape <, >, " + Q + Q + ", " + Q + Q + ", & before inserting into HTML" + N
sec1 += "2. **CSP (Content Security Policy):** HTTP header restricting script sources" + N
sec1 += "3. **HttpOnly cookies:** JavaScript cannot access cookies (prevents token theft)" + N
sec1 += "4. **Use safe DOM APIs:** textContent instead of innerHTML, createElement instead of direct HTML insertion" + N
sec1 += BT3 + "javascript" + N
sec1 += "function escapeHtml(str) {" + N
sec1 += "  return str" + N
sec1 += "    .replace(/&/g, " + Q + "&amp;" + Q + ")" + N
sec1 += "    .replace(/</g, " + Q + "&lt;" + Q + ")" + N
sec1 += "    .replace(/>/g, " + Q + "&gt;" + Q + ")" + N
sec1 += "    .replace(/\\" + Q + "/g, " + Q + "&quot;" + Q + ")" + N
sec1 += "    .replace(/" + Q + "/g, " + Q + "&#039;" + Q + ");" + N
sec1 += "}" + N
sec1 += BT3

sec2 = ""
sec2 += "## CSRF (Cross-Site Request Forgery)" + N + N
sec2 += "CSRF tricks a user's browser into making unwanted requests to a site where they are authenticated." + N + N
sec2 += "### How CSRF Works" + N
sec2 += "1. User logs into bank.com (session cookie set)" + N
sec2 += "2. User visits evil.com (attacker's site)" + N
sec2 += "3. evil.com contains: <img src=" + Q + "https://bank.com/transfer?to=attacker&amount=10000" + Q + " />" + N
sec2 += "4. Browser sends request to bank.com WITH the session cookie" + N
sec2 += "5. Bank processes the transfer (request appears legitimate)" + N + N
sec2 += "### CSRF Prevention" + N
sec2 += "1. **CSRF Token:** Server generates unique token, embedded in forms, validated on submission" + N
sec2 += "2. **SameSite Cookie:** Set-Cookie: SameSite=Strict|Lax (Lax: blocks cross-site POST but allows top-level GET navigation)" + N
sec2 += "3. **Referer/Origin validation:** Check request headers for trusted origins" + N
sec2 += "4. **Custom headers:** CSRF cannot set custom headers (e.g. X-Requested-With)" + N + N
sec2 += "## CSP (Content Security Policy)" + N + N
sec2 += "CSP is a HTTP header that controls which resources the browser is allowed to load, preventing XSS and data injection." + N + N
sec2 += "```" + N
sec2 += "Content-Security-Policy:" + N
sec2 += "  default-src " + Q + "self" + Q + ";" + N
sec2 += "  script-src " + Q + "self" + Q + " " + Q + "https://trusted-cdn.com" + Q + ";" + N
sec2 += "  style-src " + Q + "self" + Q + " " + Q + "https://fonts.googleapis.com" + Q + ";" + N
sec2 += "  img-src * data:;" + N
sec2 += "  connect-src " + Q + "self" + Q + " " + Q + "https://api.example.com" + Q + ";" + N
sec2 += "  frame-ancestors " + Q + "none" + Q + ";" + N
sec2 += "  form-action " + Q + "self" + Q + ";" + N
sec2 += "```" + N + N
sec2 += "## Clickjacking" + N + N
sec2 += "Clickjacking tricks users into clicking something different from what they perceive, by layering transparent iframes." + N + N
sec2 += "**Prevention:** X-Frame-Options: DENY (legacy) or Content-Security-Policy: frame-ancestors " + Q + "none" + Q + N + N
sec2 += "## Man-in-the-Middle (MITM) Attack" + N + N
sec2 += "MITM intercepts communication between client and server. HTTPS (TLS) prevents MITM through encryption and certificate validation. HSTS (HTTP Strict-Transport-Security) header forces HTTPS for all subsequent requests."

sec3 = ""
sec3 += "## Frontend Encryption & Security" + N + N
sec3 += "### HTTPS / TLS" + N
sec3 += "- Encrypts all data in transit between browser and server" + N
sec3 += "- Certificate Authority (CA) validates server identity" + N
sec3 += "- HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains" + N + N
sec3 += "### Subresource Integrity (SRI)" + N
sec3 += "Ensures third-party resources haven't been tampered with:" + N
sec3 += BT3 + "html" + N
sec3 += '<script src="https://cdn.example.com/lib.js"' + N
sec3 += '  integrity="sha384-abc123..."' + N
sec3 += '  crossorigin="anonymous"></script>' + N
sec3 += BT3 + N + N
sec3 += "### Cookie Security Attributes" + N
sec3 += "```" + N
sec3 += "Set-Cookie: session=abc123;" + N
sec3 += "  Secure;         // HTTPS only" + N
sec3 += "  HttpOnly;       // Not accessible via JavaScript (prevents XSS token theft)" + N
sec3 += "  SameSite=Strict; // Prevents CSRF" + N
sec3 += "  Path=/;         // Cookie scope" + N
sec3 += "  Max-Age=3600;   // Expiry in seconds" + N
sec3 += "```" + N + N
sec3 += "### Frontend Security Checklist" + N
sec3 += "1. Always use HTTPS (with HSTS)" + N
sec3 += "2. Set HttpOnly + Secure + SameSite cookies" + N
sec3 += "3. Escape all user input before rendering (prevent XSS)" + N
sec3 += "4. Implement CSRF tokens for state-changing requests" + N
sec3 += "5. Use CSP headers to restrict resource loading" + N
sec3 += "6. Validate third-party scripts with SRI" + N
sec3 += "7. Sanitize URLs (avoid javascript: URLs in links)" + N
sec3 += "8. Use Content-Type: application/json (avoid old MIME sniffing)"

# ---- engineeringData (3 items) ----
eng1 = ""
eng1 += "## Webpack Core Concepts" + N + N
eng1 += "Webpack is a static module bundler. It builds a dependency graph and outputs optimized bundles." + N + N
eng1 += "**Core Concepts:**" + N
eng1 += "- **Entry:** Starting point(s) of the dependency graph" + N
eng1 += "- **Output:** Where bundles are emitted" + N
eng1 += "- **Loaders:** Transform non-JS files (CSS, images, TypeScript) into valid modules" + N
eng1 += "- **Plugins:** Perform wider tasks (bundle optimization, asset management, environment injection)" + N
eng1 += "- **Mode:** development / production (enables built-in optimizations)" + N + N
eng1 += BT3 + "javascript" + N
eng1 += "// webpack.config.js" + N
eng1 += "const path = require(" + Q + "path" + Q + ");" + N
eng1 += "const HtmlWebpackPlugin = require(" + Q + "html-webpack-plugin" + Q + ");" + N + N
eng1 += "module.exports = {" + N
eng1 += "  entry: " + Q + "./src/index.js" + Q + "," + N
eng1 += "  output: {" + N
eng1 += "    path: path.resolve(__dirname, " + Q + "dist" + Q + ")," + N
eng1 += "    filename: " + Q + "[name].[contenthash].js" + Q + "," + N
eng1 += "    clean: true," + N
eng1 += "  }," + N
eng1 += "  module: {" + N
eng1 += "    rules: [" + N
eng1 += "      { test: /\\\\.tsx?$/, use: " + Q + "ts-loader" + Q + ", exclude: /node_modules/ }," + N
eng1 += "      { test: /\\\\.css$/, use: [" + Q + "style-loader" + Q + ", " + Q + "css-loader" + Q + "] }," + N
eng1 += "      { test: /\\\\.(png|jpg|gif)$/, type: " + Q + "asset/resource" + Q + " }," + N
eng1 += "    ]," + N
eng1 += "  }," + N
eng1 += "  plugins: [" + N
eng1 += "    new HtmlWebpackPlugin({ template: " + Q + "./src/index.html" + Q + " })," + N
eng1 += "  ]," + N
eng1 += "};" + N
eng1 += BT3 + N + N
eng1 += "**Tapable:** Webpack's plugin system is built on Tapable, a pub/sub library. Plugins hook into compilation lifecycle events (compile, emit, done) using tap (sync) or tapAsync/tapPromise (async)."

eng2 = ""
eng2 += "## Vite: ESM-based Dev Server" + N + N
eng2 += "Vite leverages native ES modules in the browser for dev, avoiding the need to bundle during development." + N + N
eng2 += "### How Vite Works" + N
eng2 += "1. **Dev Server:** Serves source files as native ESM. Browser requests only what's needed." + N
eng2 += "2. **esbuild pre-bundling:** Converts CommonJS/UMD to ESM and bundles many small modules into fewer requests." + N
eng2 += "3. **HMR (Hot Module Replacement):** Invalidates only the changed module and its dependents, using native ESM's fine-grained invalidation." + N
eng2 += "4. **Production Build:** Uses Rollup for optimized bundling (tree shaking, code splitting)." + N + N
eng2 += BT3 + "javascript" + N
eng2 += "// vite.config.ts" + N
eng2 += "import { defineConfig } from " + Q + "vite" + Q + ";" + N
eng2 += "import react from " + Q + "@vitejs/plugin-react" + Q + ";" + N + N
eng2 += "export default defineConfig({" + N
eng2 += "  plugins: [react()]," + N
eng2 += "  resolve: { alias: { " + Q + "@" + Q + ": " + Q + "/src" + Q + " } }," + N
eng2 += "  server: { port: 3000, proxy: { " + Q + "/api" + Q + ": { target: " + Q + "http://localhost:8080" + Q + ", changeOrigin: true } } }," + N
eng2 += "  build: { rollupOptions: { output: { manualChunks: { vendor: [" + Q + "react" + Q + ", " + Q + "react-dom" + Q + "] } } } }," + N
eng2 += "});" + N
eng2 += BT3 + N + N
eng2 += "### Webpack vs Vite" + N + N
eng2 += "| Feature | Webpack | Vite |" + N
eng2 += "|---------|---------|------|" + N
eng2 += "| Dev startup | Slow (full bundle) | Fast (ESM on-demand) |" + N
eng2 += "| HMR speed | Slows with app growth | Instant (native ESM) |" + N
eng2 += "| Pre-bundling | N/A (bundles everything) | esbuild (fast Go-based) |" + N
eng2 += "| Production | webpack (JS) | Rollup (JS) |" + N
eng2 += "| Ecosystem | Most mature | Rapidly growing |" + N
eng2 += "| Configuration | Verbose | Minimal, sensible defaults |"

eng3 = ""
eng3 += "## Babel" + N + N
eng3 += "Babel is a JavaScript compiler that transforms modern JS/TS into backwards-compatible code." + N + N
eng3 += "### How Babel Works" + N
eng3 += "1. **Parse:** Source code -> AST (Abstract Syntax Tree) [@babel/parser]" + N
eng3 += "2. **Transform:** AST traversed and modified by plugins [@babel/traverse]" + N
eng3 += "3. **Generate:** Modified AST -> output code [@babel/generator]" + N + N
eng3 += BT3 + "javascript" + N
eng3 += "// babel.config.js" + N
eng3 += "module.exports = {" + N
eng3 += "  presets: [" + N
eng3 += "    [" + Q + "@babel/preset-env" + Q + ", { targets: " + Q + "> 1%, not dead" + Q + " }]," + N
eng3 += "    [" + Q + "@babel/preset-react" + Q + ", { runtime: " + Q + "automatic" + Q + " }]," + N
eng3 += "    [" + Q + "@babel/preset-typescript" + Q + "]," + N
eng3 += "  ]," + N
eng3 += "  plugins: [" + N
eng3 += "    [" + Q + "@babel/plugin-proposal-decorators" + Q + ", { legacy: true }]," + N
eng3 += "  ]," + N
eng3 += "};" + N
eng3 += BT3 + N + N
eng3 += "## ESLint & Prettier" + N + N
eng3 += "- **ESLint:** Static analysis for code quality and style (find bugs, enforce conventions)" + N
eng3 += "- **Prettier:** Opinionated code formatter (consistent formatting, no configuration debates)" + N
eng3 += "- **Integration:** eslint-config-prettier disables ESLint rules that conflict with Prettier" + N + N
eng3 += "## CI/CD Pipeline" + N + N
eng3 += "```" + N
eng3 += "1. Developer pushes code to Git" + N
eng3 += "2. CI triggers:" + N
eng3 += "   - Install dependencies (npm ci)" + N
eng3 += "   - Lint (ESLint + Prettier check)" + N
eng3 += "   - Type check (tsc --noEmit)" + N
eng3 += "   - Unit tests (Jest/Vitest)" + N
eng3 += "   - Build (npm run build)" + N
eng3 += "3. CD deploys to staging/production" + N
eng3 += "```" + N + N
eng3 += "## Monorepo" + N + N
eng3 += "- **Tools:** Turborepo, Nx, Lerna, pnpm workspaces" + N
eng3 += "- **Benefits:** Shared configs (tsconfig, eslint), atomic commits across packages, simplified dependency management" + N
eng3 += "- **Challenges:** Complex build orchestration, versioning strategy, CI optimization (caching)"

# ---- miniprogramData (2 items) ----
mp1 = ""
mp1 += "## Mini Program Lifecycle" + N + N
mp1 += "Mini programs have App, Page, and Component lifecycles." + N + N
mp1 += BT3 + "javascript" + N
mp1 += "// App lifecycle (app.js)" + N
mp1 += "App({" + N
mp1 += "  onLaunch(options) { /* App initialization, get user info */ }," + N
mp1 += "  onShow(options) { /* App becomes visible */ }," + N
mp1 += "  onHide() { /* App goes to background */ }," + N
mp1 += "  onError(error) { /* Global error handler */ }," + N
mp1 += "});" + N + N
mp1 += "// Page lifecycle" + N
mp1 += "Page({" + N
mp1 += "  onLoad(options) { /* Page init, load data (called once) */ }," + N
mp1 += "  onShow() { /* Page becomes visible (called each time) */ }," + N
mp1 += "  onReady() { /* Page rendered, can interact */ }," + N
mp1 += "  onHide() { /* Page goes to background */ }," + N
mp1 += "  onUnload() { /* Page destroyed, clean up */ }," + N
mp1 += "  onPullDownRefresh() { /* Pull-to-refresh */ }," + N
mp1 += "  onReachBottom() { /* Scrolled to bottom */ }," + N
mp1 += "  onShareAppMessage() { /* Share button clicked */ }," + N
mp1 += "});" + N + N
mp1 += "// Component lifecycle" + N
mp1 += "Component({" + N
mp1 += "  lifetimes: { created() {}, attached() {}, ready() {}, moved() {}, detached() {} }," + N
mp1 += "  pageLifetimes: { show() {}, hide() {} }," + N
mp1 += "});" + N
mp1 += BT3 + N + N
mp1 += "## setData Mechanism" + N + N
mp1 += "setData updates the view by communicating from the logic layer to the render layer via an async bridge." + N + N
mp1 += BT3 + "javascript" + N
mp1 += "Page({" + N
mp1 += "  data: { count: 0, list: [] }," + N
mp1 += "  increment() {" + N
mp1 += "    // setData merges data at the top level" + N
mp1 += "    this.setData({ count: this.data.count + 1 });" + N
mp1 += "  }," + N
mp1 += "  async loadData() {" + N
mp1 += "    const list = await api.getList();" + N
mp1 += "    // setData is async and batched" + N
mp1 += "    this.setData({ list }, () => {" + N
mp1 += "      console.log(" + Q + "Data updated" + Q + "); // callback after render" + N
mp1 += "    });" + N
mp1 += "  }," + N
mp1 += "});" + N
mp1 += BT3 + N + N
mp1 += "**setData performance tips:**" + N
mp1 += "1. Avoid frequent setData calls (batch updates)" + N
mp1 += "2. Only pass changed data (don't pass entire data object)" + N
mp1 += "3. Use partial paths: setData({ " + Q + "user.name" + Q + ": " + Q + "Alice" + Q + " }) not setData({ user: {...user, name: " + Q + "Alice" + Q + "} })" + N
mp1 += "4. Keep data in the view layer minimal (move large lists to pure data fields)"

mp2 = ""
mp2 += "## Mini Program Performance Optimization" + N + N
mp2 += "1. **Subpackage Loading:** Split app into main package + subpackages to reduce initial load time" + N
mp2 += "2. **Lazy loading:** Use require.async for on-demand code loading" + N
mp2 += "3. **Avoid unnecessary setData:** Minimize data transfer between logic and render layers" + N
mp2 += "4. **Use wxs (WeiXin Script):** Run view-layer logic in the render thread, avoiding logic-render communication" + N
mp2 += "5. **Virtual list:** For long lists, use virtual scrolling (recycle-view)" + N
mp2 += "6. **Image optimization:** lazy-load images, use WebP format, set appropriate sizes" + N + N
mp2 += "## Cross-Platform Frameworks: Taro / uni-app" + N + N
mp2 += "**Taro:**" + N
mp2 += "- Uses React/Vue syntax, compiles to mini programs (WeChat, Alipay, Baidu, etc.) and H5" + N
mp2 += "- DSL (Domain Specific Language): adapts framework-specific code to mini program native APIs" + N
mp2 += "- Template-based compilation: JSX/Vue templates -> mini program WXML" + N
mp2 += "- Runtime provides polyfills for missing browser APIs" + N + N
mp2 += "**uni-app:**" + N
mp2 += "- Vue-based, compiles to 8+ platforms (mini programs, H5, native apps via Weex)" + N
mp2 += "- Conditional compilation: #ifdef MP-WEIXIN / #endif for platform-specific code" + N
mp2 += "- Larger ecosystem: uniCloud (serverless), uni-ui (component library)" + N + N
mp2 += "**Cross-platform principle:**" + N
mp2 += "Both frameworks abstract platform differences at compile time (template transformation) and runtime (API polyfills). They convert framework components to native mini program components, and bridge framework state management to setData calls."

# ---- performanceData (3 items) ----
perf1 = ""
perf1 += "## Core Web Vitals" + N + N
perf1 += "Google's Core Web Vitals measure real-world user experience:" + N + N
perf1 += "| Metric | Meaning | Good | Poor |" + N
perf1 += "|--------|---------|------|------|" + N
perf1 += "| LCP (Largest Contentful Paint) | When the largest content element becomes visible | < 2.5s | > 4.0s |" + N
perf1 += "| INP (Interaction to Next Paint) | Responsiveness to user interactions (replaced FID in 2024) | < 200ms | > 500ms |" + N
perf1 += "| CLS (Cumulative Layout Shift) | Visual stability (unexpected layout shifts) | < 0.1 | > 0.25 |" + N + N
perf1 += "### LCP Optimization" + N + N
perf1 += "1. Optimize server response time (TTFB < 800ms)" + N
perf1 += "2. Preload LCP image: <link rel=" + Q + "preload" + Q + " as=" + Q + "image" + Q + " href=" + Q + "hero.jpg" + Q + ">" + N
perf1 += "3. Use responsive images with srcset (serve appropriate size)" + N
perf1 += "4. Inline critical CSS, defer non-critical CSS" + N
perf1 += "5. Use CDN for faster resource delivery" + N + N
perf1 += "### CLS Prevention" + N + N
perf1 += "1. Always set width/height on images and video elements" + N
perf1 += "2. Reserve space for dynamically injected content (skeleton screens, min-height)" + N
perf1 += "3. Avoid inserting content above existing content (use transforms for animations)" + N
perf1 += "4. Use font-display: swap/optional to prevent FOIT (Flash of Invisible Text)"

perf2 = ""
perf2 += "## First Screen Optimization (首屏优化)" + N + N
perf2 += "### Metrics" + N
perf2 += "- **FP (First Paint):** First pixel rendered" + N
perf2 += "- **FCP (First Contentful Paint):** First content (text/image) rendered" + N
perf2 += "- **TTI (Time to Interactive):** Page becomes fully interactive" + N + N
perf2 += "### Optimization Strategies" + N + N
perf2 += "**1. Code Splitting:**" + N
perf2 += BT3 + "javascript" + N
perf2 += "// Route-based code splitting" + N
perf2 += "const Home = React.lazy(() => import(" + Q + "./pages/Home" + Q + "));" + N
perf2 += "const About = React.lazy(() => import(" + Q + "./pages/About" + Q + "));" + N + N
perf2 += "// Component-level splitting" + N
perf2 += "const HeavyChart = React.lazy(() => import(" + Q + "./HeavyChart" + Q + "));" + N
perf2 += BT3 + N + N
perf2 += "**2. Resource Hints:**" + N
perf2 += BT3 + "html" + N
perf2 += "<link rel=" + Q + "preload" + Q + " href=" + Q + "/fonts/main.woff2" + Q + " as=" + Q + "font" + Q + " crossorigin>" + N
perf2 += "<link rel=" + Q + "prefetch" + Q + " href=" + Q + "/next-page.js" + Q + ">" + N
perf2 += "<link rel=" + Q + "dns-prefetch" + Q + " href=" + Q + "https://api.example.com" + Q + ">" + N
perf2 += "<link rel=" + Q + "preconnect" + Q + " href=" + Q + "https://cdn.example.com" + Q + ">" + N
perf2 += BT3 + N + N
perf2 += "**3. Image Optimization:**" + N
perf2 += "- Use modern formats (WebP, AVIF) with fallback" + N
perf2 += "- Implement lazy loading: <img loading=" + Q + "lazy" + Q + ">" + N
perf2 += "- Use responsive images: srcset + sizes attributes" + N
perf2 += "- Compress images (squoosh, sharp, imagemin)" + N + N
perf2 += "**4. Critical CSS:** Extract above-the-fold CSS and inline it in <head>. Defer remaining CSS with media=" + Q + "print" + Q + " onload trick." + N + N
perf2 += "**5. JavaScript:** Defer non-critical scripts with defer/async. Minimize main thread work during load."

perf3 = ""
perf3 += "## Lazy Loading & Preloading" + N + N
perf3 += "### Lazy Loading" + N
perf3 += BT3 + "javascript" + N
perf3 += "// Intersection Observer-based lazy loading" + N
perf3 += "const observer = new IntersectionObserver((entries) => {" + N
perf3 += "  entries.forEach(entry => {" + N
perf3 += "    if (entry.isIntersecting) {" + N
perf3 += "      const img = entry.target;" + N
perf3 += "      img.src = img.dataset.src;" + N
perf3 += "      observer.unobserve(img);" + N
perf3 += "    }" + N
perf3 += "  });" + N
perf3 += "}, { rootMargin: " + Q + "200px" + Q + " });" + N
perf3 += "document.querySelectorAll(" + Q + "img[data-src]" + Q + ").forEach(img => observer.observe(img));" + N
perf3 += BT3 + N + N
perf3 += "## Virtual List (虚拟列表)" + N + N
perf3 += "Virtual lists render only visible items, dramatically reducing DOM nodes for large datasets." + N + N
perf3 += BT3 + "javascript" + N
perf3 += "// Virtual list core concept" + N
perf3 += "function VirtualList({ items, itemHeight, containerHeight }) {" + N
perf3 += "  const [scrollTop, setScrollTop] = useState(0);" + N
perf3 += "  const startIndex = Math.floor(scrollTop / itemHeight);" + N
perf3 += "  const endIndex = Math.min(" + N
perf3 += "    startIndex + Math.ceil(containerHeight / itemHeight) + 1," + N
perf3 += "    items.length" + N
perf3 += "  );" + N
perf3 += "  const visibleItems = items.slice(startIndex, endIndex);" + N
perf3 += "  return (" + N
perf3 += "    <div style={{ height: containerHeight, overflow: " + Q + "auto" + Q + " }} onScroll={e => setScrollTop(e.target.scrollTop)}>" + N
perf3 += "      <div style={{ height: items.length * itemHeight, position: " + Q + "relative" + Q + " }}>" + N
perf3 += "        {visibleItems.map((item, i) => (" + N
perf3 += "          <div key={startIndex + i} style={{ position: " + Q + "absolute" + Q + ", top: (startIndex + i) * itemHeight }}>" + N
perf3 += "            {item}" + N
perf3 += "          </div>" + N
perf3 += "        ))}" + N
perf3 += "      </div>" + N
perf3 += "    </div>" + N
perf3 += "  );" + N
perf3 += "}" + N
perf3 += BT3 + N + N
perf3 += "## Caching Strategies" + N + N
perf3 += "1. **HTTP Caching:** Cache-Control headers for static assets" + N
perf3 += "2. **Service Worker:** Offline caching, background sync" + N
perf3 += "3. **Memory Cache:** In-memory data store for frequent API responses (e.g., LRU cache)" + N
perf3 += "4. **IndexedDB:** Structured data storage for large datasets (client-side database)" + N + N
perf3 += "## Tree Shaking" + N + N
perf3 += "Tree shaking eliminates dead code from the final bundle. It relies on ES module static structure (import/export are analyzed at compile time)." + N + N
perf3 += BT3 + "javascript" + N
perf3 += "// Use named imports for tree-shakeable imports" + N
perf3 += "import { debounce } from " + Q + "lodash-es" + Q + ";  // Only debounce is bundled" + N
perf3 += "// import _ from " + Q + "lodash" + Q + ";  // Entire lodash bundled (not tree-shakeable)" + N + N
perf3 += "// package.json: " + Q + "sideEffects" + Q + ": false (marks package as tree-shakeable)" + N
perf3 += BT3 + N + N
perf3 += "**Requirements for tree shaking:** ESM format, static import/export (no dynamic require), sideEffects:false in package.json, minifier (Terser/esbuild) to remove dead code."

# ---- Assemble ----
o = N + "export const networkData = {" + N
o += "  name: " + Q + "Computer Networking" + Q + "," + N
o += "  description: " + Q + "HTTP/1/2/3, HTTPS/TLS handshake, TCP, OSI model, DNS, CDN, WebSocket" + Q + "," + N
o += "  icon: " + Q + "Nw" + Q + "," + N
o += "  items: [" + N
o += mk_item("net-01", "HTTP/1.1 vs HTTP/2 vs HTTP/3 Comparison", ["HTTP", "Network", "Protocols"], "Complete comparison of HTTP versions: multiplexing, head-of-line blocking, QUIC transport", net1) + "," + N
o += mk_item("net-02", "HTTPS/TLS Handshake & TCP Three-Way Handshake", ["HTTPS", "TLS", "TCP"], "TLS 1.2/1.3 handshake process, TCP connection establishment and termination, session keys", net2) + "," + N
o += mk_item("net-03", "OSI Model, DNS Resolution, CDN & WebSocket", ["OSI", "DNS", "CDN"], "7-layer OSI model, DNS resolution chain, CDN edge caching, and WebSocket full-duplex communication", net3)
o += N + "  ]," + N + "};" + N

o += N + "export const eventloopData = {" + N
o += "  name: " + Q + "Understanding Event Loop" + Q + "," + N
o += "  description: " + Q + "JavaScript event loop, macro/micro tasks, browser vs Node event loop, requestAnimationFrame" + Q + "," + N
o += "  icon: " + Q + "EL" + Q + "," + N
o += "  items: [" + N
o += mk_item("el-01", "Macro Tasks vs Micro Tasks Execution Order", ["Event Loop", "Macro Task", "Micro Task"], "Event loop task processing: macro task -> all micro tasks -> render -> repeat, with code examples", el1) + "," + N
o += mk_item("el-02", "Browser vs Node.js Event Loop & requestAnimationFrame", ["Event Loop", "Browser", "Node.js"], "Browser event loop vs Node 6-phase event loop, requestAnimationFrame for smooth animations", el2)
o += N + "  ]," + N + "};" + N

o += N + "export const securityData = {" + N
o += "  name: " + Q + "Frontend Security" + Q + "," + N
o += "  description: " + Q + "XSS, CSRF, CSP, clickjacking, MITM, frontend encryption and security best practices" + Q + "," + N
o += "  icon: " + Q + "Sc" + Q + "," + N
o += "  items: [" + N
o += mk_item("sec-01", "XSS (Cross-Site Scripting): Reflected, Stored & DOM-based", ["Security", "XSS", "Injection"], "XSS attack types and prevention: input escaping, CSP, HttpOnly cookies, safe DOM APIs", sec1) + "," + N
o += mk_item("sec-02", "CSRF, CSP & Clickjacking Prevention", ["Security", "CSRF", "CSP"], "CSRF attack mechanics and defense (CSRF tokens, SameSite cookies), CSP header configuration", sec2) + "," + N
o += mk_item("sec-03", "HTTPS/MITM, Cookie Security & Frontend Security Checklist", ["Security", "HTTPS", "Best Practices"], "TLS encryption, HSTS, SRI (Subresource Integrity), cookie attributes, and comprehensive security checklist", sec3)
o += N + "  ]," + N + "};" + N

o += N + "export const engineeringData = {" + N
o += "  name: " + Q + "Frontend Engineering" + Q + "," + N
o += "  description: " + Q + "Webpack, Vite, Babel, ESLint/Prettier, CI/CD, monorepo" + Q + "," + N
o += "  icon: " + Q + "En" + Q + "," + N
o += "  items: [" + N
o += mk_item("eng-01", "Webpack Core: Loaders, Plugins & Tapable", ["Webpack", "Bundler", "Plugins"], "Webpack entry/output/loaders/plugins architecture and Tapable plugin system", eng1) + "," + N
o += mk_item("eng-02", "Vite: ESM-based HMR & esbuild Pre-bundling", ["Vite", "ESM", "HMR"], "Vite dev server leveraging native ESM, esbuild for pre-bundling, Rollup for production builds", eng2) + "," + N
o += mk_item("eng-03", "Babel, ESLint/Prettier, CI/CD & Monorepo", ["Babel", "CI/CD", "Monorepo"], "Babel parse-transform-generate pipeline, code quality tools, CI/CD pipeline design, monorepo patterns", eng3)
o += N + "  ]," + N + "};" + N

o += N + "export const miniprogramData = {" + N
o += "  name: " + Q + "Mini Programs" + Q + "," + N
o += "  description: " + Q + "Mini program lifecycle, setData mechanism, performance, Taro/uni-app cross-platform" + Q + "," + N
o += "  icon: " + Q + "MP" + Q + "," + N
o += "  items: [" + N
o += mk_item("mp-01", "Mini Program Lifecycle & setData Mechanism", ["Mini Program", "Lifecycle", "setData"], "App/Page/Component lifecycles, setData async bridge between logic and render layers, performance tips", mp1) + "," + N
o += mk_item("mp-02", "Mini Program Optimization & Taro/uni-app Cross-Platform", ["Mini Program", "Performance", "Taro"], "Subpackage loading, performance optimization, and Taro/uni-app cross-platform compilation principles", mp2)
o += N + "  ]," + N + "};" + N

o += N + "export const performanceData = {" + N
o += "  name: " + Q + "Performance Optimization" + Q + "," + N
o += "  description: " + Q + "Core Web Vitals, first screen optimization, lazy loading, virtual list, caching, tree shaking" + Q + "," + N
o += "  icon: " + Q + "Pf" + Q + "," + N
o += "  items: [" + N
o += mk_item("perf-01", "Core Web Vitals: LCP, INP & CLS", ["Performance", "Core Web Vitals", "LCP"], "Google Core Web Vitals metrics explained: LCP optimization, CLS prevention, INP responsiveness", perf1) + "," + N
o += mk_item("perf-02", "First Screen Optimization: Code Splitting & Resource Hints", ["Performance", "First Screen", "Code Splitting"], "FCP/TTI optimization: route-based code splitting, preload/prefetch/dns-prefetch, image optimization", perf2) + "," + N
o += mk_item("perf-03", "Virtual List, Lazy Loading, Caching & Tree Shaking", ["Performance", "Virtual List", "Tree Shaking"], "Virtual list implementation, Intersection Observer lazy loading, caching strategies, and tree shaking principles", perf3)
o += N + "  ]," + N + "};" + N

# ---- inlineCategories Record ----
o += N + "export const inlineCategories: Record<string, { name: string; description: string; icon: string }> = {" + N
cats = [
    ("react", "React Core", "React basics, Hooks, state management, performance optimization", "R"),
    ("browser", "Browser Principles", "Browser rendering, caching, cross-origin, security", "Br"),
    ("typescript", "TypeScript Core", "TypeScript type system, generics, utility types, type guards", "TS"),
    ("css", "CSS Knowledge", "CSS layout, animations, responsive design, preprocessors", "C"),
    ("html", "HTML Knowledge", "HTML5 semantic tags, new APIs, SEO, Canvas/SVG", "H"),
    ("es6", "ES6+ Core", "Promises, async/await, arrow functions, destructuring, Proxy, Generator", "E6"),
    ("handwrite", "JS Handwriting", "Common JS handwrite problems: debounce, throttle, deep clone, Promise", "HW"),
    ("nodejs", "Node.js Knowledge", "Node.js event loop, modules (CJS vs ESM), middleware, streams, cluster", "N"),
    ("network", "Computer Networking", "HTTP/1/2/3, HTTPS/TLS, TCP, OSI, DNS, CDN, WebSocket", "Nw"),
    ("eventloop", "Event Loop", "JavaScript event loop, macro/micro tasks, browser vs Node, requestAnimationFrame", "EL"),
    ("security", "Frontend Security", "XSS, CSRF, CSP, clickjacking, MITM, frontend encryption", "Sc"),
    ("engineering", "Frontend Engineering", "Webpack, Vite, Babel, ESLint/Prettier, CI/CD, monorepo", "En"),
    ("miniprogram", "Mini Programs", "Mini program lifecycle, setData, performance, Taro/uni-app", "MP"),
    ("performance", "Performance Optimization", "Core Web Vitals, first screen optimization, lazy loading, tree shaking", "Pf"),
]
for key, name, desc, icon in cats:
    o += "  " + key + ": { name: " + Q + name + Q + ", description: " + Q + desc + Q + ", icon: " + Q + icon + Q + " }," + N
o += "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "a", encoding="utf-8") as f:
    f.write(o)
print("Final batch OK, chars: " + str(len(o)))
