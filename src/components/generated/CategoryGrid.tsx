import { Link } from "react-router-dom";
import { FaJs, FaReact, FaVuejs, FaCss3Alt, FaHtml5, FaNodeJs, FaPython, FaGitAlt, FaShieldAlt, FaCogs, FaMobileAlt, FaTachometerAlt, FaProjectDiagram, FaGlobe, FaNetworkWired, FaCode, FaLinux } from "react-icons/fa";
import { SiTypescript, SiKubernetes, SiPostgresql } from "react-icons/si";

interface CategoryCard {
  name: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
}

const categoryCards: CategoryCard[] = [
  { name: "JavaScript", desc: "闭包·原型·异步·ES6+", path: "/knowledge/javascript", icon: <FaJs size={22} />, iconBg: "bg-yellow-400", iconColor: "text-black", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  { name: "React", desc: "Hooks·Fiber·状态管理", path: "/knowledge/react", icon: <FaReact size={22} />, iconBg: "bg-cyan-500", iconColor: "text-white", textColor: "text-cyan-700", borderColor: "border-cyan-200" },
  { name: "Vue", desc: "响应式·Router·Pinia", path: "/knowledge/vue", icon: <FaVuejs size={22} />, iconBg: "bg-emerald-500", iconColor: "text-white", textColor: "text-emerald-700", borderColor: "border-emerald-200" },
  { name: "TypeScript", desc: "泛型·类型体操·协变", path: "/knowledge/typescript", icon: <SiTypescript size={22} />, iconBg: "bg-blue-600", iconColor: "text-white", textColor: "text-blue-700", borderColor: "border-blue-200" },
  { name: "CSS", desc: "Flex·Grid·BFC·动画", path: "/knowledge/css", icon: <FaCss3Alt size={22} />, iconBg: "bg-sky-500", iconColor: "text-white", textColor: "text-sky-700", borderColor: "border-sky-200" },
  { name: "HTML", desc: "语义化·存储·SEO", path: "/knowledge/html", icon: <FaHtml5 size={22} />, iconBg: "bg-orange-500", iconColor: "text-white", textColor: "text-orange-700", borderColor: "border-orange-200" },
  { name: "浏览器原理", desc: "渲染·缓存·跨域", path: "/knowledge/browser", icon: <FaGlobe size={22} />, iconBg: "bg-violet-500", iconColor: "text-white", textColor: "text-violet-700", borderColor: "border-violet-200" },
  { name: "NodeJS", desc: "事件循环·Koa·RPC", path: "/knowledge/nodejs", icon: <FaNodeJs size={22} />, iconBg: "bg-green-600", iconColor: "text-white", textColor: "text-green-700", borderColor: "border-green-200" },
  { name: "网络协议", desc: "HTTP·TCP·DNS·CDN", path: "/knowledge/network", icon: <FaNetworkWired size={22} />, iconBg: "bg-purple-500", iconColor: "text-white", textColor: "text-purple-700", borderColor: "border-purple-200" },
  { name: "前端安全", desc: "XSS·CSRF·CSP·HTTPS", path: "/knowledge/security", icon: <FaShieldAlt size={22} />, iconBg: "bg-rose-500", iconColor: "text-white", textColor: "text-rose-700", borderColor: "border-rose-200" },
  { name: "前端工程化", desc: "Webpack·Vite·CI/CD", path: "/knowledge/engineering", icon: <FaCogs size={22} />, iconBg: "bg-slate-600", iconColor: "text-white", textColor: "text-slate-700", borderColor: "border-slate-200" },
  { name: "性能优化", desc: "LCP·CLS·白屏排查", path: "/knowledge/performance", icon: <FaTachometerAlt size={22} />, iconBg: "bg-red-500", iconColor: "text-white", textColor: "text-red-700", borderColor: "border-red-200" },
  { name: "设计模式", desc: "单例·观察者·策略", path: "/knowledge/design-patterns", icon: <FaProjectDiagram size={22} />, iconBg: "bg-pink-500", iconColor: "text-white", textColor: "text-pink-700", borderColor: "border-pink-200" },
  { name: "小程序", desc: "双线程·setData·分包", path: "/knowledge/miniprogram", icon: <FaMobileAlt size={22} />, iconBg: "bg-teal-500", iconColor: "text-white", textColor: "text-teal-700", borderColor: "border-teal-200" },
  { name: "Git 版本控制", desc: "分支·合并·rebase", path: "/knowledge/git", icon: <FaGitAlt size={22} />, iconBg: "bg-orange-600", iconColor: "text-white", textColor: "text-orange-700", borderColor: "border-orange-200" },
  { name: "Python", desc: "装饰器·OOP·asyncio", path: "/knowledge/python", icon: <FaPython size={22} />, iconBg: "bg-blue-500", iconColor: "text-white", textColor: "text-blue-700", borderColor: "border-blue-200" },
  { name: "JS 逆向工程", desc: "调试·加密·反混淆", path: "/knowledge/js-reverse", icon: <FaCode size={22} />, iconBg: "bg-fuchsia-600", iconColor: "text-white", textColor: "text-fuchsia-700", borderColor: "border-fuchsia-200" },
  { name: "PostgreSQL", desc: "查询·索引·事务", path: "/knowledge/postgresql", icon: <SiPostgresql size={22} />, iconBg: "bg-indigo-600", iconColor: "text-white", textColor: "text-indigo-700", borderColor: "border-indigo-200" },
  { name: "Kubernetes", desc: "Pod·Deploy·Service", path: "/knowledge/k8s-commands", icon: <SiKubernetes size={22} />, iconBg: "bg-cyan-600", iconColor: "text-white", textColor: "text-cyan-700", borderColor: "border-cyan-200" },
  { name: "Linux 命令", desc: "文件·进程·Shell", path: "/knowledge/linux-commands", icon: <FaLinux size={22} />, iconBg: "bg-zinc-800", iconColor: "text-white", textColor: "text-zinc-700", borderColor: "border-zinc-200" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {categoryCards.map((card, idx) => (
        <Link
          key={card.path}
          to={card.path}
          className={`group relative flex items-center gap-4 rounded-2xl border ${card.borderColor} bg-white/80 backdrop-blur p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gray-200/80 hover:border-transparent animate-fade-in-up`}
          style={{ animationDelay: `${idx * 30}ms` }}
        >
          {/* 图标 */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
            {card.icon}
          </div>

          {/* 文字 */}
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-bold ${card.textColor} truncate leading-tight`}>
              {card.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {card.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
