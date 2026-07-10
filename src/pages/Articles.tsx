import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { ArticleCard } from "@/components/generated/ArticleCard";

const allArticles = [
  {
    id: "13",
    title: "JS基础语法与数据类型（15题）",
    excerpt: "涵盖数据类型、类型判断、类型转换、变量声明等JavaScript基础核心知识点。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "14",
    title: "JS作用域闭包与原型链（15题）",
    excerpt: "深入解析执行上下文、作用域链、闭包、this指向、原型继承等核心概念。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "15",
    title: "JS异步编程与事件循环（15题）",
    excerpt: "详解Event Loop、Promise、async/await、宏任务微任务等异步编程核心。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "16",
    title: "ES6+新特性全解析（14题）",
    excerpt: "涵盖解构赋值、箭头函数、Set/Map、模块化、可选链等ES6+新特性。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "17",
    title: "DOM/BOM与浏览器原理（16题）",
    excerpt: "详解事件流、事件委托、浏览器缓存、跨域方案、XSS/CSRF防御等。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "18",
    title: "JS手写代码题精选（15题）",
    excerpt: "包含深拷贝、call/apply/bind、防抖节流、Promise、new等经典手写题。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "19",
    title: "JS进阶与实战场景（10题）",
    excerpt: "涵盖垃圾回收、内存泄漏、柯里化、高阶函数、性能优化等进阶知识。",
    date: "2026-06-09",
    category: "JavaScript",
  },
  {
    id: "7",
    title: "Vue基础面试题精选（23题）",
    excerpt: "涵盖Vue核心理解、MVVM模式、指令系统、组件通信、路由等基础知识，适合初学者和面试复习。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "8",
    title: "Vue进阶与组件化开发（20题）",
    excerpt: "深入讲解组件通信、插槽、混入、自定义指令、keep-alive缓存等进阶知识点。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "9",
    title: "Vue核心原理深度解析（17题）",
    excerpt: "详解响应式原理、虚拟DOM、Diff算法、nextTick机制、模板编译等底层实现。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "10",
    title: "Vue2与Vue3全面对比（19题）",
    excerpt: "对比Vue2和Vue3在响应式、API设计、性能优化等方面的差异，掌握Vue3新特性。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "11",
    title: "Vue工程化与性能优化（18题）",
    excerpt: "涵盖项目性能优化、状态管理、Vite原理、跨域处理、内存泄漏等工程化实践。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "12",
    title: "Vue实战场景与手写题（12题）",
    excerpt: "包含双向绑定实现、防抖节流指令、权限控制、虚拟列表等实战编程题。",
    date: "2026-06-09",
    category: "Vue",
  },
  {
    id: "1",
    title: "深入理解JavaScript闭包",
    excerpt: "闭包是JavaScript中最重要也最难理解的概念之一。本文将从执行上下文、作用域链等角度深入剖析闭包的本质。",
    date: "2026-06-08",
    category: "JavaScript",
  },
  {
    id: "2",
    title: "React性能优化实战",
    excerpt: "探讨React应用中的常见性能瓶颈及优化策略，包括memo、useMemo、useCallback的正确使用场景。",
    date: "2026-06-05",
    category: "React",
  },
  {
    id: "3",
    title: "CSS Grid完全指南",
    excerpt: "从基础概念到高级布局技巧，全面掌握CSS Grid布局系统，打造响应式网页布局。",
    date: "2026-06-01",
    category: "CSS",
  },
  {
    id: "4",
    title: "TypeScript高级类型技巧",
    excerpt: "探索TypeScript中的条件类型、映射类型、模板字面量类型等高级特性，提升类型安全性。",
    date: "2026-05-28",
    category: "TypeScript",
  },
  {
    id: "5",
    title: "Webpack构建优化实践",
    excerpt: "从代码分割、Tree Shaking到缓存策略，全方位优化Webpack构建性能。",
    date: "2026-05-25",
    category: "工程化",
  },
  {
    id: "6",
    title: "Vue3 Composition API最佳实践",
    excerpt: "深入理解Composition API的设计思想，掌握组合式函数的编写规范与复用技巧。",
    date: "2026-05-20",
    category: "Vue",
  },
];

const categories = ["全部", "JavaScript", "React", "CSS", "TypeScript", "Vue", "工程化"];

// URL参数到分类的映射
const categoryParamMap: Record<string, string> = {
  React: "React",
  JavaScript: "JavaScript",
  浏览器: "JavaScript",
  Vue: "Vue",
  TypeScript: "TypeScript",
  CSS: "CSS",
  HTML: "全部",
  ES6: "JavaScript",
  手写: "JavaScript",
  Node: "全部",
  网络: "全部",
  EventLoop: "JavaScript",
  安全: "全部",
  工程化: "工程化",
  小程序: "全部",
  性能: "全部",
  设计模式: "全部",
};

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "";

  // 根据URL参数确定初始分类
  const initialCategory = urlCategory && categoryParamMap[urlCategory]
    ? categoryParamMap[urlCategory]
    : "全部";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // 当URL参数变化时更新选中分类
  useEffect(() => {
    if (urlCategory && categoryParamMap[urlCategory]) {
      setSelectedCategory(categoryParamMap[urlCategory]);
    } else if (!urlCategory) {
      setSelectedCategory("全部");
    }
  }, [urlCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "全部") {
      setSearchParams({});
    } else {
      // 找到对应的URL参数值
      const paramKey = Object.entries(categoryParamMap).find(
        ([_, value]) => value === category
      )?.[0];
      if (paramKey) {
        setSearchParams({ category: paramKey });
      }
    }
  };

  const filteredArticles =
    selectedCategory === "全部"
      ? allArticles
      : allArticles.filter((article) => article.category === selectedCategory);

  return (
    <>
      <PageMeta
        title={`${selectedCategory === "全部" ? "全部文章" : selectedCategory + "文章"} - 前端面试`}
        description="浏览所有前端技术文章"
        keywords={["前端文章", "技术博客", "JavaScript", "React"]}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {selectedCategory === "全部" ? "全部文章" : `${selectedCategory}文章`}
          </h1>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无相关文章</div>
          )}
        </div>
      </div>
    </>
  );
}
