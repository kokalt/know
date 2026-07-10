import { Link } from "react-router-dom";
import { FaCode, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";

interface SubTopicCardProps {
  id: string;
  category: string;
  articleId: string;
  title: string;
  excerpt: string;
  codeExample: string;
}

export function SubTopicCard({ id, category, articleId, title, excerpt, codeExample }: SubTopicCardProps) {
  const hasCode = codeExample.length > 0;
  const hasError = codeExample.includes("Error") || codeExample.includes("报错");

  return (
    <Link
      to={`/knowledge/${category}/${articleId}/${id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
    >
      <div className="relative h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 mr-2 leading-snug">
            {title}
          </h3>
          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
            {hasCode && (
              <FaCode className="text-blue-500 mt-0.5 sm:mt-1" size={14} />
            )}
            {hasError && (
              <FaExclamationTriangle className="text-red-500 mt-0.5 sm:mt-1" size={14} />
            )}
          </div>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
          {excerpt}
        </p>
        {hasCode && (
          <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 overflow-hidden">
            <pre className="text-[10px] sm:text-xs text-green-400 font-mono line-clamp-3 overflow-hidden whitespace-pre-wrap break-all">
              {codeExample.replace(/```[\w]*\n?/, "").replace(/```$/, "").trim().substring(0, 120)}
            </pre>
          </div>
        )}
        <div className="flex items-center text-blue-600 text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          查看详情
          <FaArrowRight className="ml-1 sm:ml-1.5 transform group-hover:translate-x-1 transition-transform" size={10} />
        </div>
      </div>
    </Link>
  );
}
