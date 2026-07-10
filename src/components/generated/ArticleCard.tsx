import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export function ArticleCard({ id, title, excerpt, date, category }: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
    >
      <div className="relative h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4">{excerpt}</p>
        <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          阅读全文
          <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
