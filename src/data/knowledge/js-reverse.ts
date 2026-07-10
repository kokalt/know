import type { KnowledgeData } from "../../pages/KnowledgeDetail";

export const jsReverseData: KnowledgeData = {
  name: "JS 逆向工程",
  description: "JavaScript 逆向分析、加密算法破解、反调试绕过、Hook 技术与 AST 操作",
  icon: "JS",
  items: [
    {
      id: "jsr-01",
      title: "浏览器开发者工具高级用法",
      tags: ["逆向", "DevTools", "断点", "Overrides"],
      excerpt: "掌握 Chrome DevTools 在逆向分析中的高级断点技巧与本地文件替换",
      content: `## Sources 面板断点详解

Sources 面板是逆向分析的核心工具。通过合理设置断点，可以精确卡住关键代码的执行时机，从而观察调用栈、变量值和加密参数。

### 1. 普通行断点与条件断点

\`\`\`javascript
// 目标网站中的加密函数（压缩混淆后通常在一行）
function encrypt(t, e) {
  var n = t.split(""), r = e.split(""), i = {};
  // ... 数百行混淆代码
  return o;
}

// 定位到该函数后：
// - 点击行号设置普通断点（蓝标）
// - 右键行号 -> "Add conditional breakpoint" 设置条件断点（橙标）

// 条件断点示例 — 仅在特定参数时中断
// 条件表达式：t.includes("password") || e === "my-key"

// 条件断点中可直接写 console.log 而不中断执行：
// 条件表达式：console.log("encrypt called, param:", t, e), false
// 逗号表达式最后返回 false，断点永不暂停，但日志会输出
\`\`\`

### 2. XHR / Fetch 断点 — 拦截网络请求

逆向场景中，大部分加密参数通过 AJAX 发送。XHR 断点可以在请求发出前中断，直接查看请求体和请求头中的加密数据。

\`\`\`javascript
// 设置方式：Sources -> XHR/fetch Breakpoints -> 点击 "+"
// 输入 URL 片段即可，支持部分匹配：

// 示例：拦截所有包含 "api" 的请求
// 输入：api

// 示例：拦截特定接口
// 输入：/v1/user/login

// 断点触发后，Call Stack 会显示完整的调用链：
// onreadystatechange -> xhr.send -> ajaxWrapper -> doLogin -> handleSubmit

// 从调用栈向上追溯，找到加密参数构造的位置
\`\`\`

### 3. DOM 断点 — 监控元素变化

DOM 断点用于监控网页中某个 DOM 节点的属性变化、子节点变化或节点移除。常用于追踪数据绑定和 UI 更新逻辑。

\`\`\`javascript
// 三种 DOM 断点类型：
// - Subtree modification：子节点增删时触发
// - Attribute modification：属性值变化时触发
// - Node removal：节点被移除时触发

// 设置方法：Elements 面板 -> 右键目标元素 -> Break on

// 应用场景：
// 1. 找到显示加密结果的 <span> 元素
// 2. 右键 -> Break on -> Subtree modification
// 3. 当 JS 更新该元素内容时自动中断
// 4. 从 Call Stack 中找到更新逻辑，向上追溯到加密函数
\`\`\`

### 4. Event Listener 断点 — 按事件类型中断

Event Listener 断点可以在特定类型的事件触发时中断执行，无需知道具体元素。

\`\`\`javascript
// 类别包括：
// - Mouse：click、dblclick、mousedown、mouseup、mousemove 等
// - Keyboard：keydown、keyup、keypress
// - Touch：touchstart、touchmove、touchend
// - Timer：setTimeout、setInterval、requestAnimationFrame
// - Script：script first statement（脚本第一行执行时中断）

// 逆向常用：
// 1. 勾选 Timer -> setTimeout / setInterval
//    可以中断所有定时器，用于找到反调试定时器代码
// 2. 勾选 Keyboard -> keydown
//    捕获用户输入事件，追踪密码/验证码加密流程
// 3. 勾选 Clipboard -> copy / cut / paste
//    部分网站会禁止复制粘贴，可借此找到拦截逻辑
\`\`\`

### 5. Overrides — 本地替换 JS 文件

Overrides 是 DevTools 最强大的功能之一：将远程 JS 文件替换为本地版本，绕过反调试、注入自定义代码。

\`\`\`javascript
// 设置步骤：
// 1. Sources -> Overrides -> Select folder for overrides
//    选择一个本地空文件夹作为覆盖目录
// 2. 点击顶部的 "Allow" 授权 DevTools 读写该目录
// 3. 在 Sources 的 Page 面板中找到目标 JS 文件
// 4. 右键 -> "Save for overrides"
// 5. 编辑保存后的本地文件，刷新页面即可使用本地版本

// 常用 Overrides 场景：
// 场景一：去除 debugger 语句
// 原代码：
setInterval(() => { debugger; }, 1000);
// 替换为：
setInterval(() => { /* debugger removed */ }, 1000);

// 场景二：注入 Hook 代码
// 在目标 JS 文件顶部添加：
(function() {
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    console.log("[Hook] fetch called:", args);
    return origFetch.apply(this, args);
  };
})();

// 场景三：修改加密函数的返回值以便调试
// 在加密函数末尾添加调试代码，输出中间变量
\`\`\`

### 6. Snippets — 代码片段快捷执行

\`\`\`javascript
// Sources -> Snippets -> New snippet
// 创建常用的 Hook 脚本，随时在目标页面执行（Ctrl+Enter）

// 示例 snippet：万能 Hook 脚本
(function() {
  // 如果页面引入了 jQuery，可 Hook $.ajax
  if (typeof $ !== 'undefined' && $.ajax) {
    const origAjax = $.ajax;
    $.ajax = function(settings) {
      console.log('[Hook] $.ajax:', settings.url, settings.data);
      return origAjax.call(this, settings);
    };
  }
  console.log('[Snippet] Hooks installed');
})();
\`\`\`

## Network 面板配合分析

\`\`\`javascript
// 1. 筛选 XHR/Fetch 请求，找到关键 API
// 2. 点击具体请求，查看 Headers 中的：
//    - Authorization / token / sign / timestamp / nonce
// 3. 查看 Payload（请求体）中的加密字段
// 4. 查看 Preview / Response 确认返回数据结构

// 常用技巧：右键请求 -> Copy -> Copy as cURL
// 然后在本地终端执行以验证加密参数的有效期
\`\`\``,
    },
    {
      id: "jsr-02",
      title: "常见加密算法识别与破解",
      tags: ["逆向", "加密", "MD5", "AES", "RSA", "Base64"],
      excerpt: "通过代码特征识别常见加密算法及其 JS 实现，掌握在线逆向工具链",
      content: `## 加密算法识别方法论

逆向加密算法的第一步是识别目标使用的是哪种加密。JS 中的加密实现通常具有以下可识别的特征：魔术常量、特定运算模式、固定长度的密钥/IV、以及特定的编码输出格式。

## Base64 编解码

Base64 是最常见的编码方式（不是加密，但经常配合加密使用），识别极其简单。

\`\`\`javascript
// 特征1：查表法实现 — 包含 64 个字符的映射表
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// 自定义变体可能替换 +/ 或调整顺序
// 变体1（URL安全）：- 替换 +，_ 替换 /
// 变体2：不同顺序的映射表

// 特征2：按位操作 — 每 3 字节转 4 字符
function base64Encode(str) {
  // 查找特征代码：
  // (input.charCodeAt(i) >> 2)
  // ((input.charCodeAt(i) & 3) << 4)
  // ((input.charCodeAt(i + 1) >> 4) & 15)
  // 这类移位操作是 Base64 实现的标志
}

// 逆向还原 — 浏览器原生 API
const decoded = atob("SGVsbG8gV29ybGQ=");     // "Hello World"
const encoded = btoa("Hello World");            // "SGVsbG8gV29ybGQ="

// Node.js 环境
Buffer.from("Hello World").toString("base64");
Buffer.from("SGVsbG8gV29ybGQ=", "base64").toString("utf-8");
\`\`\`

## MD5 哈希

MD5 是最常见的哈希算法，输出固定 128 位（32 个十六进制字符）。识别 MD5 主要看其魔术常量。

\`\`\`javascript
// 特征1：四个初始化常量（MD5 魔术常量）
// 几乎所有 MD5 实现都包含这四个常量
const md5Magic = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

// 特征2：64 个常量 T[i]（正弦函数生成）
// 识别特征代码：
var T = [];
for (var i = 0; i < 64; i++) {
  T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
  // 或直接硬编码 64 个常量
}

// 特征3：四轮操作，每轮 16 步
// F(X, Y, Z) = (X & Y) | ((~X) & Z)
// G(X, Y, Z) = (X & Z) | (Y & (~Z))
// H(X, Y, Z) = X ^ Y ^ Z
// I(X, Y, Z) = Y ^ (X | (~Z))

// 特征4：循环左移量
var s = [
  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
];

// 常见 JS 库
// crypto-js: CryptoJS.MD5("message").toString()
// spark-md5: SparkMD5.hash("message")
// blueimp-md5: md5("message")

// 破解方式：MD5 不可逆，通常使用在线彩虹表
// https://www.cmd5.com
// https://www.somd5.com
// https://crackstation.net
\`\`\`

## AES 对称加密

AES 是最常用的对称加密算法。JS 逆向中，重点识别：模式（CBC/ECB）、密钥长度、IV、填充方式（Pkcs7）。

\`\`\`javascript
// 特征1：crypto-js 库调用方式
const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
  iv: CryptoJS.enc.Utf8.parse("1234567890123456"),   // IV 固定 16 字节
  mode: CryptoJS.mode.CBC,                            // 模式
  padding: CryptoJS.pad.Pkcs7                         // 填充
});

// 特征2：密钥/IV 经常以 UTF-8 转 WordArray 的方式出现
var key = CryptoJS.enc.Utf8.parse("my-16-byte-key!!");  // AES-128
var key = CryptoJS.enc.Utf8.parse("my-24-byte-key!!!!!!"); // AES-192
var key = CryptoJS.enc.Utf8.parse("my-32-byte-key!!!!!!!!!!"); // AES-256

// 特征3：ECB 模式（无 IV，更易识别）
const encrypted = CryptoJS.AES.encrypt(msg, key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
});

// 特征4：自定义 AES 实现
// 查找 S-box（S 盒）— AES 标准中固定的 256 字节替换表
var SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
  0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  // ... 共 256 个值
];

// 特征5：轮常量 Rcon
var Rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// 还原方法：直接使用 crypto-js 或 Node crypto 模块
const crypto = require('crypto');
const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'base64', 'utf8');
decrypted += decipher.final('utf8');
\`\`\`

## DES 对称加密

DES 较老但仍有网站在用，密钥固定 8 字节（实际 56 位有效）。

\`\`\`javascript
// 特征1：crypto-js DES 调用
const encrypted = CryptoJS.DES.encrypt(msg, key, {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  iv: CryptoJS.enc.Utf8.parse("12345678")  // IV 固定 8 字节
});

// 特征2：3DES（Triple DES）— 密钥 24 字节
const encrypted = CryptoJS.TripleDES.encrypt(msg, key, { ... });

// 特征3：自定义 DES 的特征
// - 初始置换表 IP（64 个元素）
// - 逆初始置换表 IP-1
// - PC1 / PC2 置换表（密钥调度）
// - E 扩展表、P 置换表
// - 8 个 S-box（每个 4x16）

// 还原：使用 crypto-js 或 Node crypto
const decipher = crypto.createDecipheriv('des-cbc', key, iv);
\`\`\`

## RSA 非对称加密

RSA 涉及大整数运算，特征非常明显：大质数、模幂运算、公钥指数 65537（0x10001）。

\`\`\`javascript
// 特征1：jsencrypt 库
const crypt = new JSEncrypt();
crypt.setPublicKey("-----BEGIN PUBLIC KEY-----\\nMIGfMA0G...\\n-----END PUBLIC KEY-----");
const encrypted = crypt.encrypt("plaintext");

// 特征2：极大整数值
var modulus = new BigInteger("c9e39137c5e2823f...", 16);  // 模数 n（通常 1024/2048 位）
var exponent = new BigInteger("10001", 16);              // 公钥指数 e（通常 65537）

// 特征3：模幂运算（RSA 核心操作）
// 查找 BigInt.powMod 或 modPow 调用
var encrypted = plaintext.modPow(publicExponent, modulus);

// 特征4：PEM 格式公钥字符串
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
// Base64 解码后包含 ASN.1 结构

// 还原方法：
// 1. 含私钥：直接用 JSEncrypt 解密
// 2. 只有公钥：通过 RPC 调用浏览器内的加密函数
// 3. 尝试搜索 window.encrypt / window.rsaEncrypt
\`\`\`

## 编码/加密在线工具推荐

- **CyberChef** (gchq.github.io/CyberChef)：万能编码/加密工具链，支持串联多种操作
- **JS Nice** (jsnice.org)：混淆 JS 美化与变量名推测
- **de4js** (lelinhtinh.github.io/de4js)：JS 反混淆，支持多种混淆器
- **Beautifier** (beautifier.io)：JS 代码格式化
- **AST Explorer** (astexplorer.net)：在线 AST 分析
- **RegExr** (regexr.com)：正则表达式调试
- **CrackStation** (crackstation.net)：在线哈希破解
- **Online Domain Tools**：Base64/Hex/URL 编解码

## 综合识别技巧

\`\`\`javascript
// 快速判断加密类型的方法：
// 1. 查看加密结果长度和格式
//    - 32 位十六进制 → MD5
//    - 40 位十六进制 → SHA1
//    - 64 位十六进制 → SHA256
//    - Base64 且长度可变 → AES/DES
//    - 定长 172/344/684 字符 Base64 → RSA(1024/2048/4096)

// 2. 搜索关键词定位加密函数
//    - "encrypt" / "decrypt"
//    - "CryptoJS" / "JSEncrypt"
//    - "sign" / "signature" / "token"
//    - "base64" / "btoa" / "atob"

// 3. 通过 XHR 断点追溯加密参数来源
//    在请求发送前设置断点，观察请求体中的参数，
//    然后从变量值反查加密逻辑
\`\`\``,
    },
    {
      id: "jsr-03",
      title: "反调试技术 Bypass",
      tags: ["逆向", "反调试", "绕过", "混淆"],
      excerpt: "系统学习常见反调试手段的原理与多种绕过方法",
      content: `## 一、debugger 无限循环

网站最常见的反调试手段，通过定时器或循环不断调用 \`debugger\` 语句，使 DevTools 持续中断无法正常调试。

\`\`\`javascript
// 反调试代码示例 — 常见变体
// 变体1：setInterval 定时触发
setInterval(function() {
  debugger;
}, 100);

// 变体2：递归 setTimeout（更隐蔽）
(function loop() {
  debugger;
  setTimeout(loop, 200);
})();

// 变体3：eval 动态构造，绕过静态检测
setInterval(function() {
  eval("debu" + "gger");  // 字符串拼接绕过关键词搜索
});

// 变体4：Function 构造函数动态生成
var fn = new Function("debugger");
setInterval(fn, 50);

// ======== 绕过方法 ========

// 方法1：条件断点抑制（最简单）
// 在 debugger 所在行右键 -> Add conditional breakpoint
// 条件写：false
// 效果：断点条件永远不满足，debugger 不会暂停

// 方法2：Never pause here
// 右键 debugger 所在行 -> Never pause here
// DevTools 会记住该位置，不再暂停

// 方法3：Deactivate breakpoints
// 点击 Sources 面板顶部的断点图标（或 Ctrl+F8）
// 禁用所有断点后继续执行，然后再启用

// 方法4：替换 debugger 标识符（注入脚本）
// 在页面 JS 执行前注入：
window.Function.prototype.constructor = function() {
  var fn = arguments[0];
  if (fn && fn.includes('debugger')) {
    return function(){};
  }
  return Function.apply(this, arguments);
};

// 方法5：协议拦截（Chrome DevTools Protocol）
// 使用 CDP 的 Debugger.scriptParsed 事件，在脚本加载时替换 debugger
\`\`\`

## 二、console 禁用

部分网站会重写 console 系列方法，阻止调试日志输出。

\`\`\`javascript
// 反调试代码
(function() {
  var empty = function() {};
  console.log = empty;
  console.warn = empty;
  console.error = empty;
  console.table = empty;
  console.dir = empty;
  console.clear = empty;
})();

// 变体：使用 Object.defineProperty 锁定
Object.defineProperty(window, 'console', {
  get: function() {
    return {};
  }
});

// ======== 绕过方法 ========

// 方法1：使用 iframe 获取干净的 console
var iframe = document.createElement('iframe');
iframe.style.display = 'none';
document.body.appendChild(iframe);
var cleanConsole = iframe.contentWindow.console;
cleanConsole.log('hello from clean console!');

// 方法2：保存原始 console 引用（在页面脚本执行前注入）
// 使用 Tampermonkey 的 @run-at document-start
var _console = new Proxy(console, { apply: function(){} });
// 在 document-start 时就保存原始引用

// 方法3：使用 DevTools 的 Snippets
// 新建 snippet 并运行，snippet 在独立上下文中执行

// 方法4：Chrome DevTools Protocol
// 通过 CDP 的 Runtime.evaluate 执行代码，不受页面 console 影响
\`\`\`

## 三、检测 DevTools 是否打开

网站可能检测 DevTools 是否打开，一旦发现就跳转、清空页面或上报。

\`\`\`javascript
// 检测手段汇总

// 检测1：窗口尺寸差异检测（最常用）
function detectDevTools() {
  var threshold = 160;
  // DevTools 打开时，outerHeight - innerHeight > 160（约等于 DevTools 面板高度）
  if (window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold) {
    return true;
  }
  return false;
}

// 检测2：console.log 结合 defineProperty
var devtools = false;
var el = new Image();
Object.defineProperty(el, 'id', {
  get: function() {
    devtools = true;  // DevTools 打开时会触发 getter
    return '';
  }
});
console.log(el);  // 控制台展开对象时触发 getter
console.clear();

// 检测3：debugger 时间差检测
var start = performance.now();
debugger;
var end = performance.now();
if (end - start > 100) {
  // debugger 导致暂停超过 100ms → DevTools 已打开
  document.body.innerHTML = '';
}

// 检测4：正则检测 toString
var re = /./;
re.toString = function() {
  alert('DevTools detected');
  return '';
};
console.log(re);  // 控制台格式化正则时触发 toString

// ======== 绕过方法 ========

// 方法1：针对窗口尺寸检测
window.outerHeight = window.innerHeight;
window.outerWidth = window.innerWidth;

// 方法2：使用 --auto-open-devtools-for-tabs 启动 Chrome
// 在启动参数中关闭 DevTools 检测功能

// 方法3：Tampermonkey 脚本提前注入
// @run-at document-start 确保在任何页面脚本前运行
Object.defineProperty(window, 'outerHeight', {
  get: function() { return window.innerHeight; }
});
Object.defineProperty(window, 'outerWidth', {
  get: function() { return window.innerWidth; }
});
\`\`\`

## 四、函数 toString 检测

一些网站通过检测函数 toString 结果来判断是否被 Hook 或运行在异常环境。

\`\`\`javascript
// 检测代码
function checkEnvironment() {
  // 检测1：console.log 是否被重写
  if (console.log.toString().indexOf('[native code]') === -1) {
    // console.log 不是原生的 → 可能被 Hook
    return false;
  }

  // 检测2：检测自身是否被代理
  if (checkEnvironment.toString().indexOf('console.log') === -1) {
    // 函数体已被修改
    return false;
  }

  // 检测3：eval 是否原生
  if (eval.toString().indexOf('[native code]') === -1) {
    return false;
  }

  return true;
}

// ======== 绕过方法 ========

// 方法1：修改 Function.prototype.toString 的行为
const origToString = Function.prototype.toString;
Function.prototype.toString = function() {
  if (this === console.log || this === eval) {
    return 'function ' + (this.name || '') + '() { [native code] }';
  }
  return origToString.call(this);
};

// 方法2：Hook 检测函数使其始终返回 true
// 先找到检测函数（如 checkEnvironment），然后替换
window.checkEnvironment = function() { return true; };

// 方法3：在构造函数上做文章
const origFnToString = Function.prototype.toString;
const origFnApply = Function.prototype.apply;
Function.prototype.toString = function() {
  var str = origFnApply.call(origFnToString, this, []);
  if (this === console.log) {
    return 'function log() { [native code] }';
  }
  return str;
};
\`\`\`

## 五、定时器检测与代码混淆

\`\`\`javascript
// 定时器检测 — 检测执行速度是否被断点拖慢
(function() {
  var lastTime = Date.now();
  setInterval(function() {
    var now = Date.now();
    if (now - lastTime > 2000) {
      // 间隔超过2秒说明被断点暂停了
      // 触发反制措施：跳转、清空、上报
      location.href = 'about:blank';
    }
    lastTime = now;
  }, 500);
})();

// 绕过方法：Hook Date.now 均匀返回时间值
// 或直接移除定时器回调函数

// ======== 代码混淆形态识别 ========

// 形态1：十六进制字符串 + eval
var _0xabc = ['\\x65\\x6e\\x63\\x72\\x79\\x70\\x74', '\\x6b\\x65\\x79'];
// 逐字符还原 → 原文 "encrypt", "key"

// 形态2：JSFuck 风格 ([]+!+)
// 完全使用 6 个字符编写代码：[]()!+
// (![]+[])[+[]]+(![]+[])[+!+[]]... → 逐字符构造字符串

// 形态3：aaencode — 颜文字混淆
// ゚ωﾟﾉ= /｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/

// 形态4：obfuscator.io — 最常用混淆器
// - 变量名随机化：var _0x1a2b3c = ...
// - 字符串数组化：var _0xabc = ['hello', 'world']; _0xabc[0]
// - 控制流平坦化：switch-case 状态机
// - 死代码注入：if(false) { ... }
// - 自执行函数包裹：(function(_0x123, _0x456){...})(...)

// 形态5：sojson v5/v6 — 国内常用
// 特征：开头有特定的版权注释和版本号
// 使用特定的解密函数 _0x 开头
\`\`\`

## 六、反调试综合对抗策略

\`\`\`javascript
// Tampermonkey 注入脚本模板（@run-at document-start）
// ==UserScript==
// @name         通用反反调试
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 1. 保存原始引用
  const origDebugger = Function.prototype.constructor;
  const origToString = Function.prototype.toString;

  // 2. 劫持 Function 构造，过滤 debugger
  Function.prototype.constructor = function() {
    const src = arguments[arguments.length - 1];
    if (typeof src === 'string' && src.includes('debugger')) {
      console.log('[Bypass] blocked Function with debugger');
      return function() {};
    }
    return origDebugger.apply(this, arguments);
  };

  // 3. 修复 toString
  Function.prototype.toString = function() {
    const str = origToString.call(this);
    if (this === Function.prototype.constructor) {
      return 'function Function() { [native code] }';
    }
    return str;
  };

  // 4. 劫持 setInterval/setTimeout 清除反调试定时器
  const origSetInterval = window.setInterval;
  window.setInterval = function(fn, delay, ...args) {
    const fnStr = fn.toString();
    if (fnStr.includes('debugger') || fnStr.length < 5) {
      console.log('[Bypass] blocked suspicious setInterval');
      return 0;
    }
    return origSetInterval.call(this, fn, delay, ...args);
  };

  console.log('[Bypass] Anti-anti-debugging hooks installed');
})();
\`\`\``,
    },
    {
      id: "jsr-04",
      title: "AJAX 请求拦截与 Hook 技术",
      tags: ["逆向", "Hook", "XHR", "Fetch", "Cookie"],
      excerpt: "全面掌握 XHR/fetch/Cookie/Storage 的 Hook 技术实现请求拦截与修改",
      content: `## Hook 技术核心原理

Hook 的本质是代理/劫持原生 API，在原始逻辑前后插入自定义代码，同时保持对调用者的透明性。JS 逆向中，Hook 用于捕获加密参数、拦截请求响应、监控数据流。

## 一、XMLHttpRequest Hook

\`\`\`javascript
// 完整的 XHR Hook 实现
(function() {
  const OrigXHR = window.XMLHttpRequest;

  // Hook open 方法 — 捕获请求方法和 URL
  const origOpen = OrigXHR.prototype.open;
  OrigXHR.prototype.open = function(method, url, async, user, password) {
    // 挂载自定义属性，在 send 中使用
    this._hookedMethod = method;
    this._hookedUrl = url;
    console.log('[XHR Hook] open:', method, url);
    return origOpen.apply(this, arguments);
  };

  // Hook setRequestHeader — 捕获请求头设置
  const origSetRequestHeader = OrigXHR.prototype.setRequestHeader;
  OrigXHR.prototype.setRequestHeader = function(header, value) {
    // 记录关键请求头
    if (['authorization', 'token', 'sign', 'x-sign', 'cookie']
          .includes(header.toLowerCase())) {
      console.log('[XHR Hook] setRequestHeader:', header, '=', value);
      // 可在此时 debugger 卡住查看调用栈
    }
    return origSetRequestHeader.apply(this, arguments);
  };

  // Hook send 方法 — 捕获请求体
  const origSend = OrigXHR.prototype.send;
  OrigXHR.prototype.send = function(body) {
    console.log('[XHR Hook] send →', this._hookedMethod, this._hookedUrl);
    console.log('[XHR Hook] body:', body);

    // 修改请求体示例 — 替换加密参数
    // if (body && body.includes('encrypted_data')) {
    //   body = body.replace(/encrypted_data=[^&]+/, 'encrypted_data=modified');
    // }

    // Hook onreadystatechange — 捕获响应
    const origOnReadyStateChange = this.onreadystatechange;
    this.onreadystatechange = function() {
      if (this.readyState === 4) {
        console.log('[XHR Hook] response (' + this.status + '):',
          this.responseText?.substring(0, 200));
        // 可修改响应内容
        // Object.defineProperty(this, 'responseText', { value: modifiedText });
      }
      if (origOnReadyStateChange) {
        origOnReadyStateChange.apply(this, arguments);
      }
    };

    // Hook addEventListener 捕获 load 事件
    const origAddEventListener = this.addEventListener;
    this.addEventListener = function(type, listener, options) {
      if (type === 'load' || type === 'readystatechange') {
        const wrappedListener = function(event) {
          console.log('[XHR Hook] event:', type, event.target.responseText?.substring(0, 100));
          return listener.apply(this, arguments);
        };
        return origAddEventListener.call(this, type, wrappedListener, options);
      }
      return origAddEventListener.apply(this, arguments);
    };

    return origSend.apply(this, arguments);
  };

  console.log('[XHR Hook] Installed');
})();
\`\`\`

## 二、Fetch API Hook

Fetch 是现代 Web 应用最常用的请求方式，Promise 链式调用需要特殊处理。

\`\`\`javascript
// 完整的 Fetch Hook 实现
(function() {
  const origFetch = window.fetch;

  window.fetch = function(input, init = {}) {
    // 解析 URL
    let url = typeof input === 'string' ? input
            : (input instanceof URL ? input.href : input.url);

    console.log('[Fetch Hook] Request:', init.method || 'GET', url);
    console.log('[Fetch Hook] Headers:', init.headers);
    console.log('[Fetch Hook] Body:', init.body);

    // 修改请求示例
    // init.headers = { ...init.headers, 'X-Custom': 'injected' };

    // 调用原始 fetch
    return origFetch.apply(this, arguments)
      .then(response => {
        // 克隆响应以便多次读取 body
        const clonedResponse = response.clone();

        clonedResponse.text().then(body => {
          console.log('[Fetch Hook] Response (' + response.status + '):',
            body.substring(0, 200));
        }).catch(() => {});

        return response;
      })
      .catch(error => {
        console.log('[Fetch Hook] Error:', error);
        throw error;
      });
  };

  // Hook Headers 对象
  const origHeadersAppend = Headers.prototype.append;
  Headers.prototype.append = function(name, value) {
    console.log('[Fetch Hook] Headers.append:', name, '=', value);
    return origHeadersAppend.call(this, name, value);
  };

  const origHeadersSet = Headers.prototype.set;
  Headers.prototype.set = function(name, value) {
    console.log('[Fetch Hook] Headers.set:', name, '=', value);
    return origHeadersSet.call(this, name, value);
  };

  console.log('[Fetch Hook] Installed');
})();
\`\`\`

## 三、Cookie Hook

Cookie 常用于存储 token、session、设备指纹等关键信息。Hook document.cookie 可以监控所有 Cookie 读写。

\`\`\`javascript
// Cookie 读写 Hook
(function() {
  const cookieDescriptor = Object.getOwnPropertyDescriptor(
    Document.prototype, 'cookie'
  ) || Object.getOwnPropertyDescriptor(
    HTMLDocument.prototype, 'cookie'
  );

  if (cookieDescriptor) {
    // 保存原始的 getter 和 setter
    const origGetter = cookieDescriptor.get;
    const origSetter = cookieDescriptor.set;

    Object.defineProperty(document, 'cookie', {
      get: function() {
        const value = origGetter.call(this);
        console.log('[Cookie Hook] GET:', value?.substring(0, 200));
        // 可在 get 时断点，追踪谁在读取 cookie
        // debugger;
        return value;
      },
      set: function(value) {
        console.log('[Cookie Hook] SET:', value);
        // 可在 set 时断点，追踪 token 来源
        // if (value.includes('token')) { debugger; }
        // 修改 Cookie 值
        // value = value.replace(/original=xxx/, 'modified=yyy');
        return origSetter.call(this, value);
      },
      configurable: true,
      enumerable: true
    });

    console.log('[Cookie Hook] Installed');
  }
})();
\`\`\`

## 四、LocalStorage / SessionStorage Hook

\`\`\`javascript
// Storage Hook — 监控本地存储操作
(function() {
  function hookStorage(storageType, storageObj) {
    // Hook setItem
    const origSetItem = storageObj.setItem;
    storageObj.setItem = function(key, value) {
      console.log('[Storage Hook] ' + storageType + '.setItem:', key, '=', value);
      // 追踪特定的 key
      // if (key === 'token' || key === 'userInfo') { debugger; }
      return origSetItem.call(this, key, value);
    };

    // Hook getItem
    const origGetItem = storageObj.getItem;
    storageObj.getItem = function(key) {
      const value = origGetItem.call(this, key);
      console.log('[Storage Hook] ' + storageType + '.getItem:', key, '=', value);
      return value;
    };

    // Hook removeItem
    const origRemoveItem = storageObj.removeItem;
    storageObj.removeItem = function(key) {
      console.log('[Storage Hook] ' + storageType + '.removeItem:', key);
      return origRemoveItem.call(this, key);
    };

    // Hook clear
    const origClear = storageObj.clear;
    storageObj.clear = function() {
      console.log('[Storage Hook] ' + storageType + '.clear called');
      return origClear.call(this);
    };
  }

  hookStorage('localStorage', window.localStorage);
  hookStorage('sessionStorage', window.sessionStorage);
  console.log('[Storage Hook] Installed');
})();
\`\`\`

## 五、JSON.stringify / JSON.parse Hook

加密数据通常以 JSON 格式传输，Hook JSON 方法可以捕获序列化和反序列化过程。

\`\`\`javascript
// JSON 方法 Hook
(function() {
  const origStringify = JSON.stringify;
  const origParse = JSON.parse;

  JSON.stringify = function(value, replacer, space) {
    console.log('[JSON Hook] stringify called');
    // 打印调用栈，定位加密参数构造位置
    console.trace();
    const result = origStringify.call(this, value, replacer, space);
    console.log('[JSON Hook] stringify result:', result?.substring(0, 300));
    return result;
  };

  JSON.parse = function(text, reviver) {
    console.log('[JSON Hook] parse called, text:', text?.substring(0, 300));
    const result = origParse.call(this, text, reviver);
    console.log('[JSON Hook] parse result:', result);
    return result;
  };

  console.log('[JSON Hook] JSON methods hooked');
})();
\`\`\`

## 六、WebSocket Hook

部分实时通信场景使用 WebSocket，Hook 可以捕获推送数据。

\`\`\`javascript
// WebSocket Hook
(function() {
  const OrigWebSocket = window.WebSocket;

  window.WebSocket = function(url, protocols) {
    console.log('[WS Hook] Connecting to:', url);
    const ws = new OrigWebSocket(url, protocols);

    // Hook send
    const origSend = ws.send;
    ws.send = function(data) {
      console.log('[WS Hook] Send:', data);
      return origSend.call(this, data);
    };

    // Hook onmessage
    const origDescriptor = Object.getOwnPropertyDescriptor(
      OrigWebSocket.prototype, 'onmessage'
    );

    const origAddEventListener = ws.addEventListener;
    ws.addEventListener = function(type, listener, options) {
      if (type === 'message') {
        const wrapped = function(event) {
          console.log('[WS Hook] Message received:', event.data);
          return listener.call(this, event);
        };
        return origAddEventListener.call(this, type, wrapped, options);
      }
      return origAddEventListener.apply(this, arguments);
    };

    return ws;
  };

  // 保持原型链
  window.WebSocket.prototype = OrigWebSocket.prototype;

  console.log('[WebSocket Hook] Installed');
})();
\`\`\`

## 七、Tampermonkey 综合 Hook 脚本

\`\`\`javascript
// ==UserScript==
// @name         通用请求拦截 Hook
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 在页面脚本执行前就安装所有 Hook
  function installHooks() {
    // XHR Hook（略，同上）
    // Fetch Hook（略，同上）
    // Cookie Hook（略，同上）

    // 额外 Hook：navigator.sendBeacon
    const origSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
      console.log('[Beacon Hook]', url, data);
      return origSendBeacon.call(navigator, url, data);
    };

    // Hook window.btoa / atob 追踪编解码
    const origBtoa = window.btoa;
    const origAtob = window.atob;
    window.btoa = function(input) {
      console.log('[btoa Hook] encode:', input);
      return origBtoa.call(window, input);
    };
    window.atob = function(input) {
      console.log('[atob Hook] decode:', input);
      return origAtob.call(window, input);
    };
  }

  installHooks();
  console.log('[Tampermonkey] All hooks installed at document-start');
})();
\`\`\``,
    },
    {
      id: "jsr-05",
      title: "AST 抽象语法树操作",
      tags: ["逆向", "AST", "Babel", "反混淆", "控制流"],
      excerpt: "使用 Babel 操作 AST，实现字符串解密、控制流还原、代码反混淆自动化",
      content: `## AST 基础概念

AST（Abstract Syntax Tree，抽象语法树）是源代码的结构化表示。通过解析 JS 代码为 AST，可以程序化地分析、修改、生成代码。这在批量反混淆、批量解密字符串等场景中不可替代。

## 一、Babel 环境搭建

\`\`\`javascript
// 安装依赖
// npm install @babel/parser @babel/traverse @babel/generator @babel/types

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const fs = require('fs');

// 1. 读取混淆代码
const obfuscatedCode = fs.readFileSync('./obfuscated.js', 'utf-8');

// 2. 解析为 AST
const ast = parser.parse(obfuscatedCode, {
  sourceType: 'module',     // 或 'script'（无 import/export）
  plugins: ['jsx', 'typescript']  // 根据需要添加
});

// 3. 遍历并修改 AST
traverse(ast, {
  // 访问者模式：在这里定义对各类节点的处理逻辑
  StringLiteral(path) {
    // 访问所有字符串字面量节点
    console.log('found string:', path.node.value);
  },
  CallExpression(path) {
    // 访问所有函数调用表达式
    console.log('found call:', path.node.callee.name);
  }
});

// 4. 生成代码
const output = generate(ast, {
  retainLines: false,
  compact: false,
  comments: true
}).code;

fs.writeFileSync('./deobfuscated.js', output);
console.log('Done!');
\`\`\`

## 二、字符串解密 — 提取字符串数组并替换引用

混淆器通常将所有字符串提取到一个数组中，通过索引访问，使代码难以阅读。AST 可以自动还原。

\`\`\`javascript
// 混淆前原始代码：
// console.log("Hello World");

// 混淆后代码：
var _0xabc = ["Hello", " ", "World"];
console.log(_0xabc[0] + _0xabc[1] + _0xabc[2]);

// ======== AST 还原脚本 ========

traverse(ast, {
  // 第一步：收集字符串数组
  VariableDeclarator(path) {
    const node = path.node;
    const id = node.id;
    const init = node.init;

    // 识别 var _0xabc = ["Hello", " ", "World"];
    if (t.isArrayExpression(init) &&
        init.elements.every(el => t.isStringLiteral(el))) {
      // 记录：变量名 → 字符串数组映射
      stringArrays[id.name] = init.elements.map(el => el.value);
    }
  },

  // 第二步：替换 _0xabc[0] 形式的引用
  MemberExpression(path) {
    const node = path.node;
    // 匹配 _0xabc[0] 模式
    if (t.isIdentifier(node.object) &&
        stringArrays[node.object.name] &&
        t.isNumericLiteral(node.property)) {
      const array = stringArrays[node.object.name];
      const index = node.property.value;
      if (index < array.length) {
        // 替换为对应的字符串字面量
        path.replaceWith(t.stringLiteral(array[index]));
      }
    }
  }
});

// 第三步（可选）：移除已替换的字符串数组声明
traverse(ast, {
  VariableDeclarator(path) {
    if (stringArrays[path.node.id.name]) {
      path.remove();  // 删除无用的字符串数组变量声明
    }
  }
});
\`\`\`

## 三、控制流平坦化还原

控制流平坦化（Control Flow Flattening）是将顺序执行的代码转换为 switch-case 状态机，极大增加阅读难度。这是 obfuscator.io 的招牌功能。

\`\`\`javascript
// 混淆前的正常代码
function test(a, b) {
  var c = a + b;
  var d = c * 2;
  if (d > 10) {
    console.log("large");
  } else {
    console.log("small");
  }
  return d;
}

// 混淆后的控制流平坦化代码（简化示意）
function test(a, b) {
  var _0x1a2b = '0|1|2|3|4'.split('|');
  var _0x3c4d = 0;
  while (true) {
    switch (_0x1a2b[_0x3c4d++]) {
      case '0':
        var c = a + b;
        continue;
      case '1':
        var d = c * 2;
        continue;
      case '2':
        if (d > 10) { _0x3c4d = 3; } else { _0x3c4d = 4; }
        continue;
      case '3':
        console.log("large");
        continue;
      case '4':
        console.log("small");
        continue;
      case '5':
        return d;
    }
    break;
  }
}

// ======== AST 还原步骤 ========

// 核心思路：
// 1. 找到调度器：while(true) { switch(dispatcher[state++]) { ... } }
// 2. 提取每个 case 的代码块
// 3. 根据状态变量的赋值确定跳转关系（即控制流图）
// 4. 按照控制流重建顺序代码

// 简化版还原脚本（实际需要更复杂的控制流分析）
traverse(ast, {
  WhileStatement(path) {
    const body = path.node.body;

    // 检查是否是控制流平坦化模式
    if (t.isBlockStatement(body) && body.body.length === 1) {
      const switchStmt = body.body[0];

      if (t.isSwitchStatement(switchStmt) &&
          t.isMemberExpression(switchStmt.discriminant)) {
        // 确认这是平坦化的 switch-case

        // 收集所有 case 块
        const cases = {};
        for (const caseClause of switchStmt.cases) {
          if (t.isStringLiteral(caseClause.test)) {
            const key = caseClause.test.value;
            cases[key] = caseClause.consequent;
          }
        }

        // 根据状态转换顺序拼接代码（需要分析状态变量赋值）
        // 这里省略复杂的控制流重建逻辑...
        // 实际生产中建议使用现成工具

        console.log('[Deobfuscator] Found control flow flattening,',
          Object.keys(cases).length, 'cases');
      }
    }
  }
});
\`\`\`

## 四、死代码注入移除

混淆工具会注入大量永不执行的分支代码。

\`\`\`javascript
// 混淆后注入的死代码
if (false) {
  console.log("this is dead code");
}

if (!![]) {
  // 这里总会执行，因为 !![] 恒为 true
}
if (![]) {
  // 这里永不执行，dead code
}

// ======== AST 移除脚本 ========

traverse(ast, {
  IfStatement(path) {
    const test = path.node.test;

    // 识别 if (false) { ... } 并移除
    if (t.isBooleanLiteral(test) && test.value === false) {
      path.remove();
    }

    // 识别 if (![]) { ... } 之类的永假条件
    if (t.isUnaryExpression(test) &&
        test.operator === '!' &&
        t.isArrayExpression(test.argument) &&
        test.argument.elements.length === 0) {
      // ![] 永远为 false
      path.remove();
    }

    // 识别 if (!![]) { ... } 之类的永真条件
    // 可以移除 if 包装，直接保留 body 内容
    if (t.isUnaryExpression(test) &&
        test.operator === '!' &&
        t.isUnaryExpression(test.argument) &&
        test.argument.operator === '!' &&
        t.isArrayExpression(test.argument.argument) &&
        test.argument.argument.elements.length === 0) {
      // !![] 永远为 true，替换为 body 内容
      path.replaceWithMultiple(path.node.consequent.body);
    }
  }
});
\`\`\`

## 五、无用变量声明移除和变量名美化

\`\`\`javascript
// 移除未被引用的变量声明
traverse(ast, {
  VariableDeclarator(path) {
    const binding = path.scope.getBinding(path.node.id.name);

    // 检查是否有引用
    if (binding && !binding.referenced && binding.constant) {
      // 如果没有副作用（初始化是字面量），则移除
      const init = path.node.init;
      if (!init || t.isLiteral(init)) {
        path.remove();
      }
    }
  }
});

// 变量名美化 — 将 _0x1a2b3c 替换为有意义的名称
// 简单方案：按顺序重命名为 v1, v2, v3...
let renameCounter = 0;
traverse(ast, {
  Identifier(path) {
    const name = path.node.name;
    // 匹配混淆变量名模式：_0x 开头 + 十六进制字符
    if (/^_0x[0-9a-fA-F]+$/.test(name) && path.scope.hasBinding(name)) {
      const binding = path.scope.getBinding(name);
      if (binding && !binding.renamed) {
        binding.renamed = true;
        path.scope.rename(name, 'var_' + (++renameCounter));
      }
    }
  }
});
\`\`\`

## 六、简化表达式 — 常量折叠

混淆器经常将简单常量写成复杂表达式。

\`\`\`javascript
// 混淆后的代码
var x = 0x8 * 0x02 + 0x1;      // 16 + 1 = 17
var y = parseInt("255", 10);    // 255
var z = ![] ? "yes" : "no";     // "no"

// ======== AST 常量折叠脚本 ========

function evaluateExpression(path) {
  try {
    const { confident, value } = path.evaluate();
    if (confident) {
      path.replaceWith(t.valueToNode(value));
    }
  } catch (e) {}
}

traverse(ast, {
  BinaryExpression(path) {
    evaluateExpression(path);
  },
  UnaryExpression(path) {
    evaluateExpression(path);
  },
  ConditionalExpression(path) {
    evaluateExpression(path);
  }
});
\`\`\`

## 七、完整的反混淆工作流

\`\`\`javascript
// deobfuscator.js — 完整的反混淆管线
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const fs = require('fs');

// 读取混淆代码
const code = fs.readFileSync('./input.js', 'utf-8');

// 解析
const ast = parser.parse(code);

// 管线步骤
const stringArrays = {};

// 步骤1：收集字符串数组
traverse(ast, {
  VariableDeclarator(path) { /* 见上文 */ }
});

// 步骤2：替换字符串引用
traverse(ast, {
  MemberExpression(path) { /* 见上文 */ }
});

// 步骤3：常量折叠
traverse(ast, {
  BinaryExpression: evaluateExpression,
  UnaryExpression: evaluateExpression,
  ConditionalExpression: evaluateExpression
});

// 步骤4：移除死代码
traverse(ast, {
  IfStatement(path) { /* 见上文 */ }
});

// 步骤5：移除空语句和无用变量
traverse(ast, {
  EmptyStatement(path) { path.remove(); },
  VariableDeclarator(path) { /* 见上文 */ }
});

// 步骤6：代码美化生成
const output = generate(ast, {
  retainLines: false,
  compact: false,
  comments: false
}).code;

// 输出并格式化（可选：使用 prettier）
fs.writeFileSync('./output.js', output);

// 运行 prettier 进行最终格式化
// npx prettier --write output.js

console.log('Deobfuscation completed!');
console.log('Original:', code.length, 'chars');
console.log('Output:', output.length, 'chars');
\`\`\`

## 八、推荐工具与资源

- **AST Explorer** (astexplorer.net)：在线 AST 可视化，实时查看代码对应的 AST 结构
- **@babel/parser**：JS/TS/JSX 解析器，性能优秀
- **recast**：保留原始格式的 AST 工具，适合只做局部修改
- **escodegen**：轻量级 JS 代码生成器
- **synchrony** (github.com/nicolo-ribaudo/synchrony)：Babel 新版遍历器
- **shift-ast**：另一种 JS AST 标准，Shape Security 出品
- **obfuscator-detector**：检测混淆工具类型
- **webcrack** (github.com/j4k0xb/webcrack)：webpack bundle 解包与反混淆

## AST 操作注意事项

\`\`\`javascript
// 1. scope 追踪至关重要
//    traverse 会自动维护 scope 信息，修改代码时需注意作用域

// 2. path 的 replace/remove/insert 操作会影响后续遍历
//    需要 skip() 或注意遍历顺序

// 3. 复杂混淆建议多遍处理
//    每一遍解决一个问题：字符串 → 控制流 → 常量折叠 → 美化

// 4. 保留 sourceMap 便于调试
const result = generate(ast, {
  sourceMaps: true,
  sourceFileName: 'original-obfuscated.js'
});
fs.writeFileSync('./output.js.map', JSON.stringify(result.map));

// 5. 使用 t.valueToNode() 将 JS 值转为 AST 节点
//    t.valueToNode("hello")    → StringLiteral
//    t.valueToNode(42)         → NumericLiteral
//    t.valueToNode([1,2,3])    → ArrayExpression
//    t.valueToNode({a:1})      → ObjectExpression
\`\`\``,
    },
  ],
};
