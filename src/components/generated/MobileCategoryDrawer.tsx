import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaReact, FaJs, FaChrome, FaVuejs, FaCode, FaCss3Alt, FaHtml5, FaNodeJs, FaNetworkWired, FaShieldAlt, FaCogs, FaMobileAlt, FaTachometerAlt, FaProjectDiagram, FaBars, FaTimes, FaPython, FaDatabase, FaServer } from "react-icons/fa";

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
  { id: "python", label: "Python 核心知识点", icon: <FaPython className="text-blue-500" />, path: "/knowledge/python" },
  { id: "js-reverse", label: "JS 逆向工程", icon: <FaCode className="text-purple-600" />, path: "/knowledge/js-reverse" },
  { id: "postgresql", label: "PostgreSQL 数据库", icon: <FaDatabase className="text-indigo-600" />, path: "/knowledge/postgresql" },
  { id: "k8s-commands", label: "K8s 常用命令", icon: <FaServer className="text-cyan-600" />, path: "/knowledge/k8s-commands" },
  { id: "linux-commands", label: "Linux 常用命令", icon: <div className="w-4 h-4 bg-gray-800 rounded text-white text-[10px] flex items-center justify-center font-bold">LX</div>, path: "/knowledge/linux-commands" },
];

export function MobileCategoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 active:scale-95"
        aria-label="打开分类导航"
      >
        <FaBars size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-left">
            {/* Header with gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-5 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <FaCode className="text-white" size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">知识分类</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                aria-label="关闭导航"
              >
                <FaTimes size={18} className="text-white" />
              </button>
            </div>

            {/* Categories list */}
            <nav className="p-3 space-y-1.5 bg-gray-50">
              {categories.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.id === "home" && location.pathname === "/");

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg scale-[1.02]"
                        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600 shadow-sm"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
