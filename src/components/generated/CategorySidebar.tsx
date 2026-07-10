import { Link, useLocation } from "react-router-dom";
import { FaReact, FaJs, FaChrome, FaVuejs, FaCode, FaCss3Alt, FaHtml5, FaNodeJs, FaNetworkWired, FaShieldAlt, FaCogs, FaMobileAlt, FaTachometerAlt, FaProjectDiagram, FaGitAlt, FaPython, FaDatabase, FaServer } from "react-icons/fa";

const categories = [
  { id: "home", label: "首页", icon: <FaReact className="text-blue-600" />, path: "/" },
  { id: "react", label: "React 核心知识", icon: <FaReact className="text-cyan-500" />, path: "/knowledge/react" },
  { id: "javascript", label: "JavaScript 系列知识点", icon: <FaJs className="text-yellow-500" />, path: "/knowledge/javascript" },
  { id: "browser", label: "浏览器原理核心知识点", icon: <FaChrome className="text-green-500" />, path: "/knowledge/browser" },
  { id: "vue", label: "Vue 核心知识", icon: <FaVuejs className="text-emerald-500" />, path: "/knowledge/vue" },
  { id: "typescript", label: "TypeScript 核心知识点", icon: <FaCode className="text-blue-700" />, path: "/knowledge/typescript" },
  { id: "css", label: "CSS 知识汇总", icon: <FaCss3Alt className="text-blue-500" />, path: "/knowledge/css" },
  { id: "html", label: "HTML 知识汇总", icon: <FaHtml5 className="text-orange-500" />, path: "/knowledge/html" },
  { id: "nodejs", label: "NodeJS 知识", icon: <FaNodeJs className="text-green-600" />, path: "/knowledge/nodejs" },
  { id: "network", label: "计算机网络 / 操作系统 / 数据结构", icon: <FaNetworkWired className="text-gray-600" />, path: "/knowledge/network" },
  { id: "security", label: "前端安全知识", icon: <FaShieldAlt className="text-red-500" />, path: "/knowledge/security" },
  { id: "engineering", label: "前端工程化知识", icon: <FaCogs className="text-gray-700" />, path: "/knowledge/engineering" },
  { id: "miniprogram", label: "前端小程序知识", icon: <FaMobileAlt className="text-green-500" />, path: "/knowledge/miniprogram" },
  { id: "performance", label: "前端性能优化知识", icon: <FaTachometerAlt className="text-blue-600" />, path: "/knowledge/performance" },
  { id: "design-patterns", label: "设计模式", icon: <FaProjectDiagram className="text-indigo-500" />, path: "/knowledge/design-patterns" },
  { id: "git", label: "Git 版本控制", icon: <FaGitAlt className="text-orange-600" />, path: "/knowledge/git" },
  { id: "python", label: "Python 核心知识点", icon: <FaPython className="text-blue-500" />, path: "/knowledge/python" },
  { id: "js-reverse", label: "JS 逆向工程", icon: <FaCode className="text-purple-600" />, path: "/knowledge/js-reverse" },
  { id: "postgresql", label: "PostgreSQL 数据库", icon: <FaDatabase className="text-indigo-600" />, path: "/knowledge/postgresql" },
  { id: "k8s-commands", label: "K8s 常用命令", icon: <FaServer className="text-cyan-600" />, path: "/knowledge/k8s-commands" },
  { id: "linux-commands", label: "Linux 常用命令", icon: <div className="w-4 h-4 bg-gray-800 rounded text-white text-[10px] flex items-center justify-center font-bold">LX</div>, path: "/knowledge/linux-commands" },
];

export function CategorySidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16 overflow-y-auto shadow-sm">
      <div className="p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
          分类导航
        </h3>
        <nav className="space-y-1.5">
          {categories.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.id === "home" && location.pathname === "/");

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}>
                  {item.icon}
                </span>
                <span className="text-sm truncate flex-1">{item.label}</span>
                {isActive && (
                  <svg className="w-4 h-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
