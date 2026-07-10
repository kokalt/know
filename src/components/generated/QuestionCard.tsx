import { Link } from "react-router-dom";

interface QuestionCardProps {
  id: string;
  title: string;
  category: string;
  difficulty: "简单" | "中等" | "困难";
  tags: string[];
  date: string;
}

const difficultyColors = {
  "简单": "bg-green-100 text-green-700",
  "中等": "bg-yellow-100 text-yellow-700",
  "困难": "bg-red-100 text-red-700",
};

export function QuestionCard({ id, title, category, difficulty, tags, date }: QuestionCardProps) {
  return (
    <Link
      to={`/interview/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-blue-600 font-medium">{category}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {tag}
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-500">{date}</span>
    </Link>
  );
}
