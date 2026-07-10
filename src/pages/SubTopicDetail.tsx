import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { knowledgeData } from "./KnowledgeDetail";
import type { KnowledgeItem } from "./KnowledgeDetail";

export default function SubTopicDetail() {
  const { category, articleId, subTopicId } = useParams<{
    category: string;
    articleId: string;
    subTopicId: string;
  }>();
  const [showBackToTop, setShowBackToTop] = useState(false);

    const knowledge = category ? knowledgeData[category] : null;
  const article = knowledge?.items.find((item: KnowledgeItem) => item.id === articleId);
  const subTopic = article?.subTopics.find((st) => st.id === subTopicId);

  // 获取当前分类下所有子知识点（扁平化）
  const allSubTopics = knowledge?.items.flatMap((item: KnowledgeItem) =>
    item.subTopics.map(st => ({ ...st, articleId: item.id, articleTitle: item.title }))
  ) || [];

  const currentIndex = allSubTopics.findIndex(st => st.id === subTopicId);
  const prevSubTopic = currentIndex > 0 ? allSubTopics[currentIndex - 1] : null;
  const nextSubTopic = currentIndex < allSubTopics.length - 1 ? allSubTopics[currentIndex + 1] : null;

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!knowledge || !article || !subTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">知识点不存在</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${subTopic.title} - ${article.title} - 前端面试`}
        description={subTopic.excerpt}
        keywords={[...article.tags, subTopic.title]}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link
            to={`/knowledge/${category}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft />
            返回{knowledge.name}
          </Link>
        </div>

        <header className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="text-blue-600 font-medium">{article.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {subTopic.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatContent(subTopic.fullContent) }} />
        </div>

        {/* 上一篇/下一篇导航 */}
        <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-4">
          {prevSubTopic ? (
            <Link
              to={`/knowledge/${category}/${prevSubTopic.articleId}/${prevSubTopic.id}`}
              className="group flex items-start gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-gray-400 group-hover:text-blue-600 mt-1 flex-shrink-0" size={16} />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 mb-1">上一篇</div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                  {prevSubTopic.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSubTopic ? (
            <Link
              to={`/knowledge/${category}/${nextSubTopic.articleId}/${nextSubTopic.id}`}
              className="group flex items-start gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors justify-end text-right"
            >
              <div className="min-w-0">
                <div className="text-xs text-gray-500 mb-1">下一篇</div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                  {nextSubTopic.title}
                </div>
              </div>
              <FaChevronRight className="text-gray-400 group-hover:text-blue-600 mt-1 flex-shrink-0" size={16} />
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to={`/knowledge/${category}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft />
            返回{knowledge.name}
          </Link>
        </div>
      </article>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
          aria-label="返回顶部"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}

function formatContent(content: string): string {
  let html = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`;
    })
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-3 space-y-1">$1</ul>')
    .replace(/\n/g, "<br />")
    .replace(/>(<br \/>)+</g, "><")
    .replace(/(<br \/>)+</g, "<")
    .replace(/> (<br \/>)+/g, "> ");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
