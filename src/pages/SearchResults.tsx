import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageMeta } from "@/components/common/PageMeta";
import { knowledgeData } from "./KnowledgeDetail";
import { FaSearch, FaArrowUp } from "react-icons/fa";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
  matchedContent: string;
  link: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const results: SearchResult[] = [];

  if (query.trim()) {
    const lower = query.toLowerCase();

    // 遍历所有知识分类
    for (const [categoryKey, category] of Object.entries(knowledgeData)) {
      for (const item of category.items) {
        let matched = false;
        let matchedContent = "";

        // 标题匹配
        if (item.title.toLowerCase().includes(lower)) {
          matched = true;
          matchedContent = item.excerpt;
        }

        // 标签匹配
        if (!matched && item.tags.some(t => t.toLowerCase().includes(lower))) {
          matched = true;
          matchedContent = item.excerpt;
        }

        // 内容匹配
        if (!matched && item.content.toLowerCase().includes(lower)) {
          matched = true;
          const idx = item.content.toLowerCase().indexOf(lower);
          const start = Math.max(0, idx - 40);
          const end = Math.min(item.content.length, idx + 120);
          matchedContent = item.content.slice(start, end);
          if (start > 0) matchedContent = "..." + matchedContent;
          if (end < item.content.length) matchedContent += "...";
        }

        // 子知识点匹配
        if (!matched && item.subTopics) {
          for (const st of item.subTopics) {
            if (
              st.title.toLowerCase().includes(lower) ||
              st.fullContent.toLowerCase().includes(lower)
            ) {
              matched = true;
              matchedContent = st.excerpt;
              break;
            }
          }
        }

        if (matched) {
          results.push({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: categoryKey,
            categoryName: category.name,
            matchedContent: matchedContent || item.excerpt,
            link: `/knowledge/${categoryKey}`,
          });
        }
      }
    }
  }

  const highlightText = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    try {
      const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      return text.split(regex).map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded">{part}</mark>
        ) : part
      );
    } catch {
      return text;
    }
  };

  return (
    <>
      <PageMeta
        title={query ? `搜索"${query}" - 知识库` : "搜索 - 知识库"}
        description={query ? `搜索"${query}"的结果` : "搜索知识库内容"}
        keywords={["搜索", "前端", "知识库"]}
      />
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {query && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">搜索结果</h1>
              <p className="text-sm text-gray-500">
                找到 <span className="font-semibold text-blue-600">{results.length}</span> 篇与「{query}」相关的内容
              </p>
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <FaSearch className="mx-auto text-gray-200 mb-4" size={48} />
              <h2 className="text-lg font-semibold text-gray-600 mb-2">
                {query ? "未找到相关内容" : "请输入搜索关键词"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {query ? "试试其他关键词，或浏览全部分类" : "搜索覆盖全部知识分类和知识点内容"}
              </p>
              <Link
                to="/"
                className="inline-block px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
              >
                返回首页
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r) => (
                <Link
                  key={`${r.category}-${r.id}`}
                  to={r.link}
                  className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full">
                      {r.categoryName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {highlightText(r.title, query)}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {highlightText(r.matchedContent, query)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 返回顶部 */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 active:scale-95 animate-fade-in"
            aria-label="返回顶部"
          >
            <FaArrowUp size={20} />
          </button>
        )}
      </div>
    </>
  );
}
