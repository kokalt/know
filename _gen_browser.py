import sys
sys.stdout.reconfigure(encoding="utf-8")
Q = chr(34); N = chr(10); BS = chr(92); BT = chr(96); DS = chr(36)
BT3 = BT + BT + BT

def mk_item(iid, title, tags, excerpt, content):
    tags_s = ", ".join(Q + t + Q for t in tags)
    esc = content.replace(BS, BS + BS).replace(BT, BS + BT).replace(DS + "{", BS + DS + "{")
    return "    {" + N + "      id: " + Q + iid + Q + "," + N + "      title: " + Q + title + Q + "," + N + "      tags: [" + tags_s + "]," + N + "      excerpt: " + Q + excerpt + Q + "," + N + "      content: " + BT + N + esc + N + BT + "," + N + "    }"

AR = "=>"

def a(s):
    return s.replace("=>", AR)

c = {}
c["b1"] = a("""## Complete Rendering Pipeline

From URL input to pixel display, the browser goes through network and rendering phases.

```
Network Phase:
  1. DNS Resolution (browser cache > OS hosts > router > DNS server)
  2. TCP Three-Way Handshake
  3. TLS Handshake (HTTPS, 4-way)
  4. HTTP Request / Response

Render Phase:
  5. Parse HTML => DOM Tree
  6. Parse CSS  => CSSOM Tree
  7. DOM + CSSOM => Render Tree (only visible nodes; display:none excluded)
  8. Layout (Reflow) => Calculate geometry of each node
  9. Paint => Fill pixels into layers
  10. Composite => Merge layers to screen
```

## Critical Rendering Path

```html
<!DOCTYPE html>
<html>
<head>
  <!-- CSS is render-blocking: browser waits for CSSOM -->
  <link rel="stylesheet" href="styles.css">

  <!-- Sync script is parser-blocking: stops DOM parsing -->
  <script src="app.js"></script>

  <!-- async: download non-blocking, executes immediately after download -->
  <script async src="analytics.js"></script>

  <!-- defer: download non-blocking, executes after DOM parse -->
  <script defer src="ui.js"></script>
</head>
<body><div id="app">Hello World</div></body>
</html>
```

CSS is deliberately render-blocking to prevent FOUC (Flash of Unstyled Content) where users would briefly see unstyled HTML before CSS loads.

## Reflow vs Repaint

```javascript
// ===== Trigger Reflow (geometry change) =====
element.style.width = "200px";
element.style.height = "100px";
element.style.padding = "10px";
element.style.margin = "20px";
element.style.display = "none";
element.style.fontSize = "16px";
element.classList.add("active");
element.innerHTML = "new content";
document.body.appendChild(newDiv);

// Reading these properties triggers Forced Synchronous Layout
element.offsetTop; element.offsetWidth; element.offsetHeight;
element.scrollTop; element.clientWidth;
element.getBoundingClientRect();

// ===== Trigger Repaint only (visual change) =====
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.visibility = "hidden";  // Only repaint!
// Note: display:none triggers reflow; visibility:hidden only repaints

// ===== No reflow or repaint (compositor thread) =====
element.style.transform = "translateX(100px) scale(1.5)";
element.style.opacity = "0.5";
```

## Batch DOM Operations Optimization

```javascript
// Option 1: DocumentFragment (offline DOM)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li); // No reflow (fragment not in document)
}
list.appendChild(fragment); // Single reflow

// Option 2: cssText for batch style changes
element.style.cssText = "width:200px; height:100px; margin:10px;";

// Option 3: Separate reads from writes (avoid layout thrashing)
// BAD: alternating read/write forces sync layout each iteration
elements.forEach(el => {
  const h = el.offsetHeight;      // Read (invalidates layout)
  el.style.height = h + 10 + "px"; // Write
});

// GOOD: batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // Batch reads
elements.forEach((el, i) => { el.style.height = heights[i] + 10 + "px"; }); // Batch writes
```

## Layer Compositing

```css
/* Promote element to its own compositor layer */
.animated {
  will-change: transform;      /* Recommended: explicit hint */
  transform: translateZ(0);    /* 3D transform implicitly creates layer */
}
/* transform/opacity animations run on compositor thread, not main thread */
```

Caution: Each compositor layer consumes GPU memory. Do not overuse will-change. Remove it after animation ends.
""")

c["b2"] = a("""## Cache Classification

```
Strong Cache (no request to server, higher priority):
  Expires: Wed, 21 Oct 2025 07:28:00 GMT  (HTTP/1.0, absolute time)
  Cache-Control: max-age=31536000         (HTTP/1.1, relative time, overrides Expires)

Negotiated Cache (validate with server, 304 => use cache):
  Last-Modified / If-Modified-Since        (timestamp, second-level precision)
  ETag / If-None-Match                      (content hash, more precise, higher priority)
```

## Cache-Control Directives

```
Cache-Control: max-age=3600          // Expires 3600s after request
Cache-Control: no-cache              // Skip strong cache, always validate
Cache-Control: no-store              // Never cache (sensitive data)
Cache-Control: public                // CDN/proxy can cache
Cache-Control: private               // Only browser can cache
Cache-Control: immutable             // Content never changes
Cache-Control: must-revalidate       // Must validate after expiry
Cache-Control: stale-while-revalidate=600  // Serve stale for 600s while revalidating
```

**Production Best Practices:**
- HTML files: `Cache-Control: no-cache` (always validate for updates)
- Hashed JS/CSS: `Cache-Control: public, max-age=31536000, immutable`
- Images/fonts: `Cache-Control: public, max-age=2592000` (30 days)

## ETag vs Last-Modified

```text
// Server first response
Last-Modified: Wed, 01 Jan 2025 10:00:00 GMT
ETag: "a1b2c3d4e5f6"

// Browser subsequent request (after cache expiry)
If-Modified-Since: Wed, 01 Jan 2025 10:00:00 GMT
If-None-Match: "a1b2c3d4e5f6"

// File unchanged => 304 Not Modified (headers only, no body)
// File changed    => 200 OK (new content + new ETag/Last-Modified)

// ETag advantages: content-level precision, unaffected by file mtime
// Last-Modified limitations: second-level precision, mtime changes without content change
```

## Cache Decision Flow

```
Browser requests resource
  |
  +-- Strong cache valid (not expired)?
  |     +-- Yes => 200 OK (from disk cache / memory cache)
  |     +-- No  => Negotiated cache validation
  |
  +-- Negotiated cache validation
        +-- Resource unchanged => 304 Not Modified (use local cache)
        +-- Resource changed   => 200 OK (new content + new cache headers)

Memory Cache: fast, small, cleared on tab close
Disk Cache: slow, large, persistent
""")

c["b3"] = a("""## Same-Origin Policy

Protocol + Domain + Port must be identical. Policy restricts READING cross-origin responses, not SENDING requests.

```
https://example.com:443/app
Same-Origin: https://example.com:443/api
Cross-Origin:
  http://example.com           (protocol differs)
  https://api.example.com      (domain differs)
  https://example.com:8080    (port differs)
```

## CORS (Cross-Origin Resource Sharing)

Server sets response headers to authorize cross-origin access.

```javascript
// Key CORS Response Headers
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Custom
Access-Control-Max-Age: 86400  // Preflight cache: 24 hours

// Express CORS Middleware
app.use((req, res, next) => {
  const allowed = ["https://app.example.com", "https://admin.example.com"];
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
```

**Simple vs Preflighted Requests:** Simple requests use GET/HEAD/POST with limited Content-Type. Non-simple requests (custom headers, PUT/DELETE, JSON body) trigger an OPTIONS preflight first.

## JSONP (GET-only legacy)

Uses <script> tag which is not subject to same-origin policy.

```javascript
function jsonp(url, callbackParam = "callback") {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const fnName = "__jsonp_" + Date.now() + "__";
    window[fnName] = (data) => {
      resolve(data);
      document.head.removeChild(script);
      delete window[fnName];
    };
    script.src = url + "?" + callbackParam + "=" + fnName;
    script.onerror = () => reject(new Error("JSONP failed"));
    document.head.appendChild(script);
  });
}
// Server: ctx.body = ctx.query.callback + "(" + JSON.stringify(data) + ")";
```

Limitations: GET only, no error handling, XSS risk (malicious script injection).

## Proxy (Dev and Production)

```javascript
// Vite dev proxy
export default defineConfig({
  server: {
    proxy: {
      "/api": { target: "https://backend.example.com", changeOrigin: true },
    },
  },
});

// Nginx production reverse proxy
// location /api/ { proxy_pass https://backend.example.com/; }
```

Principle: Same-origin policy is a browser restriction. Server-to-server communication is not limited.

## postMessage (iframe cross-origin communication)

```javascript
// Parent page (https://parent.com)
const iframe = document.getElementById("childFrame");
iframe.contentWindow.postMessage(
  { type: "GREETING", text: "Hello!" },
  "https://child.com"  // MUST specify exact target origin
);
window.addEventListener("message", (event) => {
  if (event.origin !== "https://child.com") return;  // MUST verify origin
  console.log("Received:", event.data);
});

// Child page (https://child.com)
window.addEventListener("message", (event) => {
  if (event.origin !== "https://parent.com") return;
  console.log("From parent:", event.data);
  event.source.postMessage({ type: "REPLY" }, event.origin);
});
```

**Security Rules:**
1. Always specify exact targetOrigin in postMessage (never use "*")
2. Always verify event.origin when receiving messages
3. Validate the structure of message data
""")

o = N + "export const browserData = {" + N
o += "  name: " + Q + "Browser Principles" + Q + "," + N
o += "  description: " + Q + "Browser rendering, caching, cross-origin, security" + Q + "," + N
o += "  icon: " + Q + "Br" + Q + "," + N
o += "  items: [" + N

o += mk_item("browser-01", "Browser Rendering Pipeline: URL to Pixels", ["Browser", "Rendering", "Critical Path"], "Complete browser rendering pipeline: DOM/CSSOM construction, Layout, Paint, Composite", c["b1"]) + "," + N
o += mk_item("browser-02", "Browser Caching: Strong Cache vs Negotiated Cache", ["Browser", "Caching", "Performance"], "Deep comparison of Cache-Control/Expires and ETag/Last-Modified mechanisms", c["b2"]) + "," + N
o += mk_item("browser-03", "Cross-Origin Solutions: CORS / JSONP / Proxy / postMessage", ["Cross-Origin", "CORS", "JSONP"], "Complete guide to Same-Origin Policy and four cross-origin solutions", c["b3"])

o += N + "  ]," + N + "};" + N

with open("d:/桌面/inter/src/data/knowledge/inline-categories.ts", "a", encoding="utf-8") as f:
    f.write(o)
print("browserData appended OK, chars: " + str(len(o)))
