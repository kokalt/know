import { Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { CategoryGrid } from "@/components/generated/CategoryGrid";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <PageMeta
        title="前端知识库"
        description="覆盖 React、Vue、JavaScript、TypeScript、CSS、浏览器原理等核心分类的前端技术知识库"
        keywords={["前端", "React", "Vue", "JavaScript", "TypeScript", "CSS"]}
      />

      <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
        {/* 背景光斑 */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 via-cyan-200/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/20 via-pink-200/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col overflow-hidden pt-4">
          {/* Hero 卡片 */}
          <div className="relative overflow-hidden rounded-2xl mb-5 p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-slate-800 to-slate-900 text-white shadow-2xl shadow-slate-300/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-400/30 to-cyan-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    体系化学习，系统掌握前端
                  </span>
                </h2>
                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  覆盖 20 个技术分类，体系化梳理前端核心知识，持续积累与成长
                </p>
                <div className="flex gap-3 mt-4">
                  <Link to="/knowledge/javascript" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-all duration-300 backdrop-blur border border-white/10">
                    开始浏览 <FaArrowRight size={12} />
                  </Link>
                  <a href="#categories" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-transparent hover:bg-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all duration-300 border border-white/10">
                    浏览分类
                  </a>
                </div>
              </div>

              {/* 统计数字 */}
              <div className="hidden sm:flex flex-shrink-0 items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">20</div>
                  <div className="text-xs text-slate-500 mt-0.5">技术分类</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white">60+</div>
                  <div className="text-xs text-slate-500 mt-0.5">篇文章</div>
                </div>
              </div>
            </div>
          </div>

          {/* 分类标题 */}
          <div id="categories" className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <h3 className="text-[13px] font-bold text-gray-800">全部分类</h3>
              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-500">20</span>
            </div>
          </div>

          {/* 分类卡片 */}
          <CategoryGrid />

          {/* 底部 */}
          <p className="mt-auto pt-3 text-center text-[10px] text-gray-400">
            持续更新 · 知识积累，厚积薄发
          </p>
        </div>
      </div>
    </>
  );
}
